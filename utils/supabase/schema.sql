-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Categories
create table if not exists categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Products
create table if not exists products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  sku text unique not null,
  price decimal(10,2) not null,
  stock integer not null default 0,
  category_id uuid references categories(id),
  image_url text,
  low_stock_threshold integer default 10,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Orders
create table if not exists orders (
  id uuid default uuid_generate_v4() primary key,
  customer_name text not null,
  total_amount decimal(10,2) not null,
  status text not null default 'pending', -- pending, completed, cancelled
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Transactions (Ledger)
create table if not exists transactions (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references products(id),
  order_id uuid references orders(id), -- Optional link to order
  type text not null, -- 'sale', 'restock', 'adjustment'
  quantity integer not null, -- Positive for restock, negative for sale (or handle by type logic)
  total_price decimal(10,2), -- Total value of transaction
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for performance
create index if not exists products_category_id_idx on products(category_id);
create index if not exists transactions_product_id_idx on transactions(product_id);
create index if not exists transactions_created_at_idx on transactions(created_at);

-- Profiles (Auth Integration)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  role text default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger to create profile on sign up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Product Sizes (Size-Based Inventory)
create table if not exists product_sizes (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references products(id) on delete cascade,
  size text not null, -- 'S', 'M', 'L', 'XL', 'XXL'
  quantity integer default 0,
  unique(product_id, size)
);
-- Index for performance
create index if not exists product_sizes_product_id_idx on product_sizes(product_id);
