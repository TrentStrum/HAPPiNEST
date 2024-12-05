-- Create review-related enums
create type review_type as enum ('tenant_review', 'landlord_review', 'property_review');
create type review_status as enum ('pending', 'approved', 'rejected', 'disputed');

-- Create reviews table
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  type review_type not null,
  reviewer_id uuid references public.profiles(id) not null,
  property_id uuid references public.properties(id) not null,
  lease_id uuid references public.leases(id) not null,
  status review_status default 'pending' not null,
  content text not null,
  response text,
  response_date timestamptz,
  maintenance_rating smallint check (maintenance_rating between 1 and 5),
  communication_rating smallint check (communication_rating between 1 and 5),
  condition_rating smallint check (condition_rating between 1 and 5),
  payment_rating smallint check (payment_rating between 1 and 5),
  property_care_rating smallint check (property_care_rating between 1 and 5),
  location_rating smallint check (location_rating between 1 and 5),
  value_rating smallint check (value_rating between 1 and 5),
  amenities_rating smallint check (amenities_rating between 1 and 5),
  images text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create review_reports table for dispute handling
create table public.review_reports (
  id uuid default gen_random_uuid() primary key,
  review_id uuid references public.reviews(id) not null,
  reporter_id uuid references public.profiles(id) not null,
  reason text not null,
  status review_status default 'pending' not null,
  resolution_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add average ratings columns to properties table
alter table public.properties add column avg_maintenance_rating numeric(3,2);
alter table public.properties add column avg_communication_rating numeric(3,2);
alter table public.properties add column avg_condition_rating numeric(3,2);
alter table public.properties add column avg_location_rating numeric(3,2);
alter table public.properties add column avg_value_rating numeric(3,2);
alter table public.properties add column avg_amenities_rating numeric(3,2);
alter table public.properties add column total_reviews integer default 0;

-- Add review metrics to profiles table
alter table public.profiles add column avg_rating numeric(3,2);
alter table public.profiles add column total_reviews integer default 0;

-- Create function to update property average ratings
create or replace function update_property_ratings()
returns trigger as $$
begin
  update public.properties
  set
    avg_maintenance_rating = (
      select avg(maintenance_rating)::numeric(3,2)
      from public.reviews
      where property_id = new.property_id
      and status = 'approved'
    ),
    avg_communication_rating = (
      select avg(communication_rating)::numeric(3,2)
      from public.reviews
      where property_id = new.property_id
      and status = 'approved'
    ),
    avg_condition_rating = (
      select avg(condition_rating)::numeric(3,2)
      from public.reviews
      where property_id = new.property_id
      and status = 'approved'
    ),
    avg_location_rating = (
      select avg(location_rating)::numeric(3,2)
      from public.reviews
      where property_id = new.property_id
      and status = 'approved'
    ),
    avg_value_rating = (
      select avg(value_rating)::numeric(3,2)
      from public.reviews
      where property_id = new.property_id
      and status = 'approved'
    ),
    avg_amenities_rating = (
      select avg(amenities_rating)::numeric(3,2)
      from public.reviews
      where property_id = new.property_id
      and status = 'approved'
    ),
    total_reviews = (
      select count(*)
      from public.reviews
      where property_id = new.property_id
      and status = 'approved'
    )
  where id = new.property_id;
  return new;
end;
$$ language plpgsql;

-- Create trigger for updating property ratings
create trigger update_property_ratings_trigger
after insert or update on public.reviews
for each row
when (new.status = 'approved')
execute function update_property_ratings();

-- Create RLS policies for reviews
alter table public.reviews enable row level security;

-- Allow tenants to create reviews for properties they've leased
create policy "Tenants can create property reviews"
  on public.reviews
  for insert
  with check (
    exists (
      select 1 from public.leases
      where id = lease_id
      and tenant_id = auth.uid()
    )
  );

-- Allow users to view approved reviews
create policy "Anyone can view approved reviews"
  on public.reviews
  for select
  using (status = 'approved');

-- Allow property owners to respond to reviews
create policy "Property owners can respond to reviews"
  on public.reviews
  for update
  using (
    exists (
      select 1 from public.properties
      where id = property_id
      and landlord_id = auth.uid()
    )
  )
  with check (
    old.response is null
    and new.response is not null
    and old.status = new.status
    and old.content = new.content
  );

-- Create RLS policies for review reports
alter table public.review_reports enable row level security;

-- Allow users to report reviews
create policy "Users can create review reports"
  on public.review_reports
  for insert
  with check (auth.uid() = reporter_id);

-- Allow users to view their own reports
create policy "Users can view their own reports"
  on public.review_reports
  for select
  using (auth.uid() = reporter_id);

-- Allow property owners to view reports for their properties
create policy "Property owners can view reports for their properties"
  on public.review_reports
  for select
  using (
    exists (
      select 1 from public.reviews r
      join public.properties p on r.property_id = p.id
      where r.id = review_id
      and p.landlord_id = auth.uid()
    )
  );