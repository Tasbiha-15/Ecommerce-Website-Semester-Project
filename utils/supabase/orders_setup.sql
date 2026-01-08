
-- Create order_items table
create table if not exists order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  size text,
  quantity integer not null,
  price decimal(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add Index
create index if not exists order_items_order_id_idx on order_items(order_id);
create index if not exists order_items_product_id_idx on order_items(product_id);

-- Update orders table with shipping info
alter table orders 
add column if not exists email text,
add column if not exists address text,
add column if not exists city text;
