-- ============================================================
-- Lumora Studio — Blog schema for Supabase
-- Run this in the Supabase SQL editor (Dashboard > SQL Editor).
-- ============================================================

-- CATEGORIES ---------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- TAGS ---------------------------------------------------------
create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- POSTS --------------------------------------------------------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,                -- HTML produced by the rich-text editor
  featured_image text,         -- public URL in the blog-images bucket
  category_id uuid references public.categories (id) on delete set null,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_published_idx on public.posts (published, published_at desc);
create index if not exists posts_slug_idx on public.posts (slug);

-- POST <-> TAG join --------------------------------------------
create table if not exists public.post_tags (
  post_id uuid references public.posts (id) on delete cascade,
  tag_id uuid references public.tags (id) on delete cascade,
  primary key (post_id, tag_id)
);

-- updated_at trigger -------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- ROW LEVEL SECURITY -------------------------------------------
alter table public.posts enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.post_tags enable row level security;

-- Public (anon) can read only published posts
create policy "Public read published posts"
  on public.posts for select
  using (published = true);

-- Authenticated users (admins) can do everything with posts
create policy "Admins manage posts"
  on public.posts for all
  to authenticated
  using (true) with check (true);

-- Taxonomy is publicly readable, writable by admins
create policy "Public read categories" on public.categories for select using (true);
create policy "Admins manage categories" on public.categories for all to authenticated using (true) with check (true);

create policy "Public read tags" on public.tags for select using (true);
create policy "Admins manage tags" on public.tags for all to authenticated using (true) with check (true);

create policy "Public read post_tags" on public.post_tags for select using (true);
create policy "Admins manage post_tags" on public.post_tags for all to authenticated using (true) with check (true);

-- STORAGE: featured images --------------------------------------
-- Create a PUBLIC bucket named: blog-images  (Dashboard > Storage)
-- Then run:
create policy "Public read blog images"
  on storage.objects for select
  using (bucket_id = 'blog-images');

create policy "Admins upload blog images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'blog-images');

create policy "Admins update blog images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'blog-images');

create policy "Admins delete blog images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'blog-images');

-- Seed a few categories (optional)
insert into public.categories (name, slug) values
  ('Architecture', 'architecture'),
  ('Interiors', 'interiors'),
  ('Studio Notes', 'studio-notes')
on conflict (slug) do nothing;
