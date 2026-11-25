create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title varchar(90) not null,
  category varchar(32) not null check (category in ('Retratos', 'Encontros', 'Cotidiano', 'Editorial')),
  image_url text not null check (image_url ~ '^https://'),
  alt varchar(180) not null,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists portfolio_items_published_created_idx
  on public.portfolio_items (published, created_at desc);

alter table public.portfolio_items enable row level security;
revoke all on public.portfolio_items from anon, authenticated;
grant all on public.portfolio_items to service_role;