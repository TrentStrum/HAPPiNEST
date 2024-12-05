-- Enable RLS
alter database postgres set "app.jwt_secret" to 'your-jwt-secret';

-- Create enum types
create type user_role as enum ('landlord', 'tenant', 'technician');
create type ticket_status as enum ('open', 'in_progress', 'completed', 'cancelled');
create type payment_status as enum ('pending', 'completed', 'failed', 'refunded');

-- Create users table with role-based access
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  role user_role not null,
  email text not null unique,
  full_name text,
  phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create properties table
create table public.properties (
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
create table public.units (
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
create table public.leases (
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
create table public.maintenance_tickets (
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
create table public.payments (
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

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.units enable row level security;
alter table public.leases enable row level security;
alter table public.maintenance_tickets enable row level security;
alter table public.payments enable row level security;

-- Create RLS policies

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

create policy "Tenants can view their rented properties"
  on public.properties for select
  using (
    exists (
      select 1 from public.leases l
      join public.units u on l.unit_id = u.id
      where u.property_id = properties.id
      and l.tenant_id = auth.uid()
    )
  );

-- Units policies
create policy "Landlords can manage their units"
  on public.units for all
  using (
    exists (
      select 1 from public.properties p
      where p.id = units.property_id
      and p.landlord_id = auth.uid()
    )
  );

create policy "Tenants can view their rented units"
  on public.units for select
  using (
    exists (
      select 1 from public.leases l
      where l.unit_id = units.id
      and l.tenant_id = auth.uid()
    )
  );

-- Leases policies
create policy "Landlords can manage leases for their properties"
  on public.leases for all
  using (
    exists (
      select 1 from public.units u
      join public.properties p on u.property_id = p.id
      where u.id = leases.unit_id
      and p.landlord_id = auth.uid()
    )
  );

create policy "Tenants can view their own leases"
  on public.leases for select
  using (tenant_id = auth.uid());

-- Maintenance tickets policies
create policy "Landlords can manage tickets for their properties"
  on public.maintenance_tickets for all
  using (
    exists (
      select 1 from public.units u
      join public.properties p on u.property_id = p.id
      where u.id = maintenance_tickets.unit_id
      and p.landlord_id = auth.uid()
    )
  );

create policy "Tenants can create and view their tickets"
  on public.maintenance_tickets for select
  using (tenant_id = auth.uid());

create policy "Tenants can create tickets"
  on public.maintenance_tickets for insert
  with check (tenant_id = auth.uid());

create policy "Technicians can view and update assigned tickets"
  on public.maintenance_tickets for all
  using (technician_id = auth.uid());

-- Payments policies
create policy "Landlords can view payments for their properties"
  on public.payments for select
  using (
    exists (
      select 1 from public.leases l
      join public.units u on l.unit_id = u.id
      join public.properties p on u.property_id = p.id
      where l.id = payments.lease_id
      and p.landlord_id = auth.uid()
    )
  );

create policy "Tenants can view their own payments"
  on public.payments for select
  using (
    exists (
      select 1 from public.leases l
      where l.id = payments.lease_id
      and l.tenant_id = auth.uid()
    )
  );

-- Create function to handle new user registration
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, email)
  values (new.id, 'tenant', new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user registration
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Create function to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create updated_at triggers for all tables
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