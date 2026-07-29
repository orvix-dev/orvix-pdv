-- ============================================================
-- REVVO PDV - SCHEMA MULTI-TENANT (Supabase / Postgres)
-- ============================================================

create extension if not exists "pgcrypto";

create table redes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  logo_url text,
  created_at timestamptz default now()
);

create table estabelecimentos (
  id uuid primary key default gen_random_uuid(),
  rede_id uuid references redes(id) on delete set null,
  nome text not null,
  cidade text,
  slug text unique not null,
  logo_url text,
  acai_price_per_kg numeric(10,2) default 43.00,
  sorvete_price_per_kg numeric(10,2) default 43.00,
  created_at timestamptz default now()
);

create index idx_estabelecimentos_slug on estabelecimentos(slug);

create table user_estabelecimentos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  estabelecimento_id uuid references estabelecimentos(id) on delete cascade,
  role text check (role in ('operador','admin','dono')) not null default 'operador',
  created_at timestamptz default now(),
  unique(user_id, estabelecimento_id)
);

create index idx_user_est_user on user_estabelecimentos(user_id);
create index idx_user_est_est on user_estabelecimentos(estabelecimento_id);

create table products (
  id uuid primary key default gen_random_uuid(),
  estabelecimento_id uuid references estabelecimentos(id) on delete cascade not null,
  name text not null,
  price numeric(10,2) not null,
  category text default 'Geral',
  image text,
  active boolean default true,
  created_at timestamptz default now()
);

create index idx_products_est on products(estabelecimento_id, active);

create table sales (
  id uuid primary key default gen_random_uuid(),
  estabelecimento_id uuid references estabelecimentos(id) on delete cascade not null,
  user_id uuid references auth.users(id),
  items jsonb not null,
  subtotal numeric(10,2) not null,
  delivery_fee numeric(10,2) default 0,
  total numeric(10,2) not null,
  payment_method text check (payment_method in ('cash','card','pix')) not null,
  cash_received numeric(10,2),
  change_amount numeric(10,2),
  delivery_mode text check (delivery_mode in ('balcao','entrega')) default 'balcao',
  delivery_info jsonb,
  open_time_minutes numeric(10,2) default 0,
  sale_date date not null default current_date,
  created_at timestamptz default now()
);

create index idx_sales_est_date on sales(estabelecimento_id, sale_date);

create table expenses (
  id uuid primary key default gen_random_uuid(),
  estabelecimento_id uuid references estabelecimentos(id) on delete cascade not null,
  user_id uuid references auth.users(id),
  name text not null,
  description text,
  value numeric(10,2) not null,
  expense_date date not null default current_date,
  created_at timestamptz default now()
);

create index idx_expenses_est_date on expenses(estabelecimento_id, expense_date);

create table open_orders (
  id uuid primary key default gen_random_uuid(),
  estabelecimento_id uuid references estabelecimentos(id) on delete cascade not null,
  customer_name text not null,
  items jsonb not null default '[]',
  total numeric(10,2) not null default 0,
  delivery_info jsonb,
  created_at timestamptz default now()
);

create index idx_open_orders_est on open_orders(estabelecimento_id);

create table discount_config (
  estabelecimento_id uuid primary key references estabelecimentos(id) on delete cascade,
  active boolean default false,
  percentage numeric(5,2) default 0,
  target_acai boolean default false,
  target_sorvete boolean default false,
  scheduled_days int[] default '{}',
  updated_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table estabelecimentos enable row level security;
alter table user_estabelecimentos enable row level security;
alter table products enable row level security;
alter table sales enable row level security;
alter table expenses enable row level security;
alter table open_orders enable row level security;
alter table discount_config enable row level security;

create or replace function get_role(p_estabelecimento_id uuid)
returns text language sql security definer stable as $$
  select role from user_estabelecimentos
  where user_id = auth.uid() and estabelecimento_id = p_estabelecimento_id
  limit 1;
$$;

create or replace function has_access(p_estabelecimento_id uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from user_estabelecimentos
    where user_id = auth.uid() and estabelecimento_id = p_estabelecimento_id
  );
$$;

create policy "usuario ve seus vinculos"
on user_estabelecimentos for select
using (user_id = auth.uid());

create policy "dono cria vinculo (onboarding)"
on user_estabelecimentos for insert
with check (user_id = auth.uid());

create policy "ver estabelecimentos vinculados"
on estabelecimentos for select
using (has_access(id));

create policy "criar estabelecimento (qualquer usuario autenticado)"
on estabelecimentos for insert
with check (auth.uid() is not null);

create policy "admin/dono atualiza estabelecimento"
on estabelecimentos for update
using (get_role(id) in ('admin','dono'));

create policy "ver produtos do estabelecimento"
on products for select
using (has_access(estabelecimento_id));

create policy "operador insere produtos"
on products for insert
with check (has_access(estabelecimento_id));

create policy "admin/dono atualiza produtos"
on products for update
using (get_role(estabelecimento_id) in ('admin','dono'));

create policy "admin/dono exclui produtos"
on products for delete
using (get_role(estabelecimento_id) in ('admin','dono'));

create policy "ver vendas do estabelecimento"
on sales for select
using (has_access(estabelecimento_id));

create policy "operador registra venda"
on sales for insert
with check (has_access(estabelecimento_id));

create policy "admin/dono exclui venda"
on sales for delete
using (get_role(estabelecimento_id) in ('admin','dono'));

create policy "ver despesas do estabelecimento"
on expenses for select
using (has_access(estabelecimento_id));

create policy "operador registra despesa"
on expenses for insert
with check (has_access(estabelecimento_id));

create policy "admin/dono exclui despesa"
on expenses for delete
using (get_role(estabelecimento_id) in ('admin','dono'));

create policy "crud comandas do estabelecimento"
on open_orders for all
using (has_access(estabelecimento_id))
with check (has_access(estabelecimento_id));

create policy "ver config de desconto"
on discount_config for select
using (has_access(estabelecimento_id));

create policy "admin/dono altera desconto"
on discount_config for all
using (get_role(estabelecimento_id) in ('admin','dono'))
with check (get_role(estabelecimento_id) in ('admin','dono'));

-- ============================================================
-- REALTIME
-- ============================================================
alter publication supabase_realtime add table sales;
alter publication supabase_realtime add table open_orders;
alter publication supabase_realtime add table expenses;
