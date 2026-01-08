-- Create Transactions Table
create table if not exists public.transactions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  order_id uuid references public.orders(id) on delete set null,
  product_id uuid references public.products(id) on delete set null,
  type text not null check (type in ('sale', 'restock', 'return', 'adjustment')),
  quantity integer not null,
  total_price decimal(10, 2) default 0.00
);

-- RLS Policies
alter table public.transactions enable row level security;

create policy "Enable read access for authenticated users" on public.transactions
  for select using (auth.role() = 'authenticated');

create policy "Enable insert for authenticated users" on public.transactions
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update for authenticated users" on public.transactions
  for update using (auth.role() = 'authenticated');

-- Create Index for faster lookups
create index if not exists idx_transactions_order_id on public.transactions(order_id);
create index if not exists idx_transactions_product_id on public.transactions(product_id);
create index if not exists idx_transactions_type on public.transactions(type);
