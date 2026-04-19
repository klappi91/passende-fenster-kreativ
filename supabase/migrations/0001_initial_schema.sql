-- Initial schema for Passende-Fenster Konfigurator
-- Source: specs/konfigurator-db.md (Sections 5 + 9.2)

-- =====================================================================
-- Phase 1: Konfigurator + Lead-Flow
-- =====================================================================

-- Marken / Profilhersteller
create table brands (
  id          bigserial primary key,
  external_id int unique,
  name        text not null,
  slug        text unique not null,
  logo_url    text,
  created_at  timestamptz default now()
);

-- Oeffnungsarten (DKL, DKR, Fest, Kipp, DL, DR)
create table shapes (
  id   bigserial primary key,
  code text unique not null,
  name text not null
);

-- Flügel-Konfigurationen (1-/2-/3-fluegelig, Ober-/Unterlicht)
create table groups (
  id                  bigserial primary key,
  external_id         int unique,
  name                text not null,
  category            smallint not null,
  shape_configuration jsonb not null,
  sort_order          int default 0
);

-- Artikel / Produkte (je Brand × Profil-Serie)
create table articles (
  id               bigserial primary key,
  external_id      int unique,
  brand_id         bigint not null references brands(id) on delete cascade,
  name             text not null,
  slug             text unique not null,
  uw_value         numeric(4,2),
  profile_depth    int,
  base_price_cents int not null,
  description      text,
  datasheet_url    text,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- Auto-update updated_at on articles
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger articles_set_updated_at
  before update on articles
  for each row execute function set_updated_at();

-- Zulaessige Dimensionen pro Artikel (min/max fuer H und B)
create table article_dimensions (
  article_id bigint primary key references articles(id) on delete cascade,
  min_width  int not null,
  max_width  int not null,
  min_height int not null,
  max_height int not null,
  check (min_width <= max_width and min_height <= max_height)
);

-- Welche Shapes der Artikel unterstuetzt (m:n)
create table article_shapes (
  article_id bigint references articles(id) on delete cascade,
  shape_id   bigint references shapes(id) on delete cascade,
  primary key (article_id, shape_id)
);

-- Welche Groups der Artikel unterstuetzt
create table article_groups (
  article_id bigint references articles(id) on delete cascade,
  group_id   bigint references groups(id) on delete cascade,
  primary key (article_id, group_id)
);

-- Preisformel-Overrides (optional, falls nicht linear)
create table price_rules (
  id                  bigserial primary key,
  article_id          bigint references articles(id) on delete cascade,
  shape_id            bigint references shapes(id) on delete cascade,
  group_id            bigint references groups(id) on delete cascade,
  price_per_sqm_cents int,
  surcharge_cents     int default 0,
  valid_from          timestamptz default now(),
  valid_to            timestamptz
);

-- Bilder (Thumbnails, 360-Frames, Farbproben)
create table images (
  id           bigserial primary key,
  article_id   bigint references articles(id) on delete cascade,
  type         text not null check (type in ('thumbnail', '360_frame', 'color', 'other')),
  storage_path text not null,
  sort_order   int default 0,
  metadata     jsonb
);

-- Anfragen / Leads
create table inquiries (
  id                bigserial primary key,
  configuration     jsonb not null,
  article_id        bigint references articles(id),
  width_mm          int,
  height_mm         int,
  shape             text,
  group_external_id int,
  contact_name      text not null,
  contact_email     text not null,
  contact_phone     text,
  message           text,
  total_price_cents int,
  status            text default 'new' check (status in (
    'new', 'contacted', 'quoted',
    'converted_to_order',
    'won', 'lost'
  )),
  order_id          bigint,
  created_at        timestamptz default now()
);

-- =====================================================================
-- Phase 4 Stubs: Orders, Payments, Invoices
-- Tabellen bleiben leer bis ENABLE_PURCHASE=true
-- =====================================================================

create table orders (
  id               bigserial primary key,
  inquiry_id       bigint references inquiries(id),
  order_number     text unique,
  status           text not null default 'pending' check (status in (
    'pending',
    'deposit_paid',
    'reserved',
    'in_production',
    'ready_to_ship',
    'delivered',
    'fully_paid',
    'completed',
    'cancelled'
  )),
  configuration    jsonb not null,
  article_id       bigint references articles(id),
  width_mm         int not null,
  height_mm        int not null,
  quantity         int not null default 1,
  subtotal_cents   int not null,
  tax_cents        int not null,
  total_cents      int not null,
  deposit_cents    int not null,
  contact_name     text not null,
  contact_email    text not null,
  contact_phone    text,
  billing_address  jsonb not null,
  shipping_address jsonb,
  created_at       timestamptz default now(),
  deposit_paid_at  timestamptz,
  fully_paid_at    timestamptz,
  completed_at     timestamptz
);

-- FK inquiries.order_id → orders.id nachtraeglich (cyclic dependency)
alter table inquiries
  add constraint inquiries_order_id_fkey
  foreign key (order_id) references orders(id) on delete set null;

create table payments (
  id                 bigserial primary key,
  order_id           bigint not null references orders(id) on delete cascade,
  type               text not null check (type in ('deposit', 'final')),
  amount_cents       int not null,
  provider           text not null,
  provider_intent_id text,
  status             text not null default 'pending' check (status in (
    'pending', 'authorized', 'paid', 'failed', 'refunded'
  )),
  paid_at            timestamptz,
  created_at         timestamptz default now()
);

create table invoices (
  id             bigserial primary key,
  order_id       bigint not null references orders(id),
  invoice_number text unique not null,
  pdf_url        text,
  issued_at      timestamptz default now()
);

-- =====================================================================
-- Indices
-- =====================================================================

create index inquiries_status_idx on inquiries(status, created_at desc);
create index articles_brand_idx   on articles(brand_id);
create index images_article_idx   on images(article_id, type);
create index orders_status_idx    on orders(status, created_at desc);
create index orders_inquiry_idx   on orders(inquiry_id);
create index payments_order_idx   on payments(order_id);
