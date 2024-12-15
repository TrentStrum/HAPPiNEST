-- Enable RLS
alter database postgres set "app.jwt_secret" to 'your-jwt-secret';

-- Create enum types if they don't exist
do $$ begin
    create type user_role as enum ('landlord', 'tenant', 'technician');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type ticket_status as enum ('open', 'in_progress', 'completed', 'cancelled');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type payment_status as enum ('pending', 'completed', 'failed', 'refunded');
exception
    when duplicate_object then null;
end $$;

-- Create tables if they don't exist
do $$ begin
    -- Create profiles table
    create table if not exists public.profiles (
      id uuid references auth.users on delete cascade primary key,
      role user_role not null,
      email text not null unique,
      full_name text,
      phone text,
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    );

    -- Create properties table
    create table if not exists public.properties (
      id uuid default gen_random_uuid() primary key,
      landlord_id uuid references public.profiles(id) not null,
      name text not null,
      address text not null,
      city text not null,
      state text not null,
      zip text not null,
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    );

    -- Create units table
    create table if not exists public.units (
      id uuid default gen_random_uuid() primary key,
      property_id uuid references public.properties(id) not null,
      unit_number text not null,
      rent_amount decimal(10,2) not null,
      square_feet integer,
      bedrooms integer,
      bathrooms integer,
      created_at timestamptz default now(),
      updated_at timestamptz default now(),
      unique(property_id, unit_number)
    );

    -- Create leases table
    create table if not exists public.leases (
      id uuid default gen_random_uuid() primary key,
      unit_id uuid references public.units(id) not null,
      tenant_id uuid references public.profiles(id) not null,
      start_date date not null,
      end_date date not null,
      rent_amount decimal(10,2) not null,
      security_deposit decimal(10,2) not null,
      document_url text,
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    );

    -- Create maintenance tickets table
    create table if not exists public.maintenance_tickets (
      id uuid default gen_random_uuid() primary key,
      unit_id uuid references public.units(id) not null,
      tenant_id uuid references public.profiles(id) not null,
      technician_id uuid references public.profiles(id),
      title text not null,
      description text not null,
      status ticket_status default 'open' not null,
      priority integer default 1 not null,
      category text not null,
      images text[],
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    );

    -- Create payments table
    create table if not exists public.payments (
      id uuid default gen_random_uuid() primary key,
      lease_id uuid references public.leases(id) not null,
      amount decimal(10,2) not null,
      status payment_status default 'pending' not null,
      stripe_payment_id text,
      due_date date not null,
      paid_date timestamptz,
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    );

    -- Create tenant_units table
    create table if not exists public.tenant_units (
      id uuid default gen_random_uuid() primary key,
      tenant_id uuid references public.profiles(id) not null,
      unit_id uuid references public.units(id) not null,
      status text not null default 'active',
      created_at timestamptz default now(),
      updated_at timestamptz default now(),
      unique(tenant_id, unit_id, status)
    );

exception when others then
    raise notice 'Error creating tables: %', sqlerrm;
end $$;

-- Enable RLS on all tables
do $$ begin
    alter table public.profiles enable row level security;
    alter table public.properties enable row level security;
    alter table public.units enable row level security;
    alter table public.leases enable row level security;
    alter table public.maintenance_tickets enable row level security;
    alter table public.payments enable row level security;
    alter table public.tenant_units enable row level security;
exception when others then
    raise notice 'Error enabling RLS: %', sqlerrm;
end $$;

-- Create or replace functions
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, email)
  values (new.id, 'tenant', new.email);
  return new;
end;
$$ language plpgsql security definer;

create or replace function public.handle_new_lease()
returns trigger as $$
begin
  insert into public.tenant_units (tenant_id, unit_id, status)
  values (new.tenant_id, new.unit_id, 'active');
  return new;
end;
$$ language plpgsql security definer;

-- Drop existing triggers if they exist and recreate them
do $$ begin
    -- Drop existing triggers
    drop trigger if exists handle_updated_at on public.profiles;
    drop trigger if exists handle_updated_at on public.properties;
    drop trigger if exists handle_updated_at on public.units;
    drop trigger if exists handle_updated_at on public.leases;
    drop trigger if exists handle_updated_at on public.maintenance_tickets;
    drop trigger if exists handle_updated_at on public.payments;
    drop trigger if exists handle_updated_at on public.tenant_units;
    drop trigger if exists on_auth_user_created on auth.users;
    drop trigger if exists on_lease_created on public.leases;

    -- Recreate triggers
    create trigger handle_updated_at
        before update on public.profiles
        for each row execute function public.handle_updated_at();

    create trigger handle_updated_at
        before update on public.properties
        for each row execute function public.handle_updated_at();

    create trigger handle_updated_at
        before update on public.units
        for each row execute function public.handle_updated_at();

    create trigger handle_updated_at
        before update on public.leases
        for each row execute function public.handle_updated_at();

    create trigger handle_updated_at
        before update on public.maintenance_tickets
        for each row execute function public.handle_updated_at();

    create trigger handle_updated_at
        before update on public.payments
        for each row execute function public.handle_updated_at();

    create trigger handle_updated_at
        before update on public.tenant_units
        for each row execute function public.handle_updated_at();

    create trigger on_auth_user_created
        after insert on auth.users
        for each row execute function public.handle_new_user();

    create trigger on_lease_created
        after insert on public.leases
        for each row execute function public.handle_new_lease();

exception when others then
    raise notice 'Error creating triggers: %', sqlerrm;
end $$;

-- Drop existing policies and recreate them
do $$ begin
    -- Drop existing policies
    drop policy if exists "Users can view their own profile" on public.profiles;
    drop policy if exists "Users can update their own profile" on public.profiles;
    drop policy if exists "Landlords can manage their properties" on public.properties;
    drop policy if exists "Tenants can view their rented properties" on public.properties;
    drop policy if exists "Landlords can manage their units" on public.units;
    drop policy if exists "Tenants can view their rented units" on public.units;
    drop policy if exists "Landlords can manage leases" on public.leases;
    drop policy if exists "Tenants can view their leases" on public.leases;
    drop policy if exists "Landlords can manage tickets" on public.maintenance_tickets;
    drop policy if exists "Tenants can manage their tickets" on public.maintenance_tickets;
    drop policy if exists "Technicians can manage assigned tickets" on public.maintenance_tickets;
    drop policy if exists "Landlords can view payments" on public.payments;
    drop policy if exists "Tenants can view their payments" on public.payments;
    drop policy if exists "Landlords can manage tenant_units" on public.tenant_units;
    drop policy if exists "Tenants can view their unit assignments" on public.tenant_units;

    -- Profiles policies
    create policy "Users can view their own profile"
        on public.profiles for select
        using (auth.uid() = id);

    create policy "Users can update their own profile"
        on public.profiles for update
        using (auth.uid() = id);

    -- Properties policies
    create policy "Landlords can manage their properties"
        on public.properties for all
        using (auth.uid() = landlord_id);

    create policy "Tenants can view properties"
        on public.properties for select
        using (exists (
            select 1 from public.tenant_units tu
            where tu.tenant_id = auth.uid()
            and exists (
                select 1 from public.units u
                where u.property_id = properties.id
                and u.id = tu.unit_id
            )
        ));

    -- Units policies
    create policy "Landlords can manage their units"
        on public.units for all
        using (
            exists (
                select 1 from public.properties
                where properties.id = units.property_id
                and properties.landlord_id = auth.uid()
            )
        );

    create policy "Tenants can view units"
        on public.units for select
        using (
            exists (
                select 1 from public.tenant_units
                where tenant_units.unit_id = units.id
                and tenant_units.tenant_id = auth.uid()
                and tenant_units.status = 'active'
            )
        );

    -- Leases policies
    create policy "Landlords can manage leases"
        on public.leases for all
        using (exists (
            select 1 from public.units
            join public.properties on units.property_id = properties.id
            where units.id = leases.unit_id
            and properties.landlord_id = auth.uid()
        ));

    create policy "Tenants can view their leases"
        on public.leases for select
        using (tenant_id = auth.uid());

    -- Maintenance tickets policies
    create policy "Landlords can manage tickets"
        on public.maintenance_tickets for all
        using (exists (
            select 1 from public.units
            join public.properties on units.property_id = properties.id
            where units.id = maintenance_tickets.unit_id
            and properties.landlord_id = auth.uid()
        ));

    create policy "Tenants can manage their tickets"
        on public.maintenance_tickets for all
        using (tenant_id = auth.uid());

    create policy "Technicians can manage assigned tickets"
        on public.maintenance_tickets for all
        using (technician_id = auth.uid());

    -- Payments policies
    create policy "Landlords can view payments"
        on public.payments for select
        using (exists (
            select 1 from public.leases
            join public.units on leases.unit_id = units.id
            join public.properties on units.property_id = properties.id
            where leases.id = payments.lease_id
            and properties.landlord_id = auth.uid()
        ));

    create policy "Tenants can view their payments"
        on public.payments for select
        using (exists (
            select 1 from public.leases
            where leases.id = payments.lease_id
            and leases.tenant_id = auth.uid()
        ));

    -- Tenant_units policies
    create policy "Landlords can manage tenant_units"
        on public.tenant_units for all
        using (exists (
            select 1 from public.units
            join public.properties on units.property_id = properties.id
            where units.id = tenant_units.unit_id
            and properties.landlord_id = auth.uid()
        ));

    create policy "Tenants can view their unit assignments"
        on public.tenant_units for select
        using (tenant_id = auth.uid());

exception when others then
    raise notice 'Error creating policies: %', sqlerrm;
end $$;