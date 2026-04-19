-- Full schema for qlein-API Import (Phase 1)
-- Quelle: specs/konfigurator-db.md §6.2 + Korrekturen aus Live-API-Analyse 2026-04-19
--
-- Änderungen gegenüber 0001:
--   - articles.base_price_cents entfernt (Preis liegt im Raster article_price_points)
--   - groups.category_id / group_category_name fehlte (groups.category ist schon in 0001)
--   - Neue Tabellen: properties, property_values (refactored), addition_categories,
--     article_additions, article_addition_variants, article_addition_variant_property_values,
--     article_variants, article_variant_property_values,
--     article_properties, article_group_mappings, article_price_points,
--     article_images (ersetzt images), delivery_time_rules
--   - Entdeckt in Live-API, nicht in Spec §6.2: article_addition_variants
--     (jede Addition hat bis zu 41 Farbvarianten), properties.external_id,
--     property_values.property_id, priceOld-Felder

-- =====================================================================
-- Anpassungen an bestehenden Tabellen
-- =====================================================================

alter table articles drop column if exists base_price_cents;

-- =====================================================================
-- Neue Tabellen
-- =====================================================================

-- Property-Definitionen (z.B. propertyId=4 "Außenfarbe", propertyId=9 "Innenfarbe")
create table properties (
  id          bigserial primary key,
  external_id int unique not null,
  name        text not null,
  short_name  text not null
);

-- Property-Values (z.B. id=6 "Anthrazitgrau" mit valueCode "anthraciteGray7016")
create table property_values (
  id                 bigserial primary key,
  external_id        int unique not null,
  property_id        bigint not null references properties(id) on delete cascade,
  name               text not null,
  short_name         text not null,
  value              text not null,
  value_code         text,
  image_storage_path text,
  position           int
);

create index property_values_property_idx on property_values(property_id);

-- Mapping qlein-Artikel-ID → (articles × groups), da qlein pro Group eine eigene article-ID führt
create table article_group_mappings (
  id               bigserial primary key,
  article_id       bigint not null references articles(id) on delete cascade,
  group_id         bigint not null references groups(id)   on delete cascade,
  qlein_article_id int  unique not null,
  created_at       timestamptz default now()
);

create index article_group_mappings_article_idx on article_group_mappings(article_id);
create index article_group_mappings_group_idx   on article_group_mappings(group_id);

-- Technische Specs eines Artikels (Bautiefe, Kammerzahl, Verglasung, Uw, Dichtung)
create table article_properties (
  id          bigserial primary key,
  article_id  bigint not null references articles(id) on delete cascade,
  short_name  text not null,
  name        text not null,
  value       text not null,
  unit        text,
  icon        text,
  is_main     bool default false,
  sort_order  int default 0,
  external_id int,
  unique (article_id, short_name)
);

-- Kategorien der Zusatz-Optionen (rollladen, sound_insulation, …)
create table addition_categories (
  id         bigserial primary key,
  code       text unique not null,
  name       text,
  sort_order int default 0
);

-- Zusatz-Option pro Artikel (z.B. "Vorbaurolllade Aluprof SK 45" bei article 23)
create table article_additions (
  id                 bigserial primary key,
  external_id        int unique not null,
  article_id         bigint not null references articles(id)            on delete cascade,
  category_id        bigint not null references addition_categories(id) on delete cascade,
  name               text not null,
  type_name          text,
  image_storage_path text,
  price_cents        int,
  price_old_cents    int,
  is_default         bool default false,
  sort_order         int default 0
);

create index article_additions_article_idx on article_additions(article_id);

-- Varianten einer Addition (z.B. Rollladen in 10 Farben)
create table article_addition_variants (
  id              bigserial primary key,
  external_id     int unique not null,
  addition_id     bigint not null references article_additions(id) on delete cascade,
  price_cents     int,
  price_old_cents int,
  is_default      bool default false,
  created_at      timestamptz default now()
);

create index article_addition_variants_addition_idx on article_addition_variants(addition_id);

create table article_addition_variant_property_values (
  addition_variant_id bigint not null references article_addition_variants(id) on delete cascade,
  property_value_id   bigint not null references property_values(id)           on delete cascade,
  position            int,
  primary key (addition_variant_id, property_value_id)
);

-- Varianten des Artikels selbst (Farb-/Ausstattungs-Kombis)
create table article_variants (
  id          bigserial primary key,
  external_id int unique not null,
  article_id  bigint not null references articles(id) on delete cascade,
  price_cents int,
  is_default  bool default false,
  created_at  timestamptz default now()
);

create index article_variants_article_idx on article_variants(article_id);

create table article_variant_property_values (
  variant_id        bigint not null references article_variants(id) on delete cascade,
  property_value_id bigint not null references property_values(id)  on delete cascade,
  position          int,
  primary key (variant_id, property_value_id)
);

-- Bilder (ersetzt images aus 0001)
drop table if exists images cascade;

create table article_images (
  id           bigserial primary key,
  article_id   bigint references articles(id) on delete cascade,
  storage_path text not null,
  source_url   text,
  type         text not null check (type in ('article','variant','360_frame','thumbnail','brand','addition','property_value')),
  sort_order   int default 0,
  metadata     jsonb,
  unique (article_id, storage_path)
);

create index article_images_article_idx on article_images(article_id, type);

-- Preis-Raster: Gesamtpreis pro (Artikel × Group × Width × Height)
create table article_price_points (
  id               bigserial primary key,
  article_id       bigint not null references articles(id) on delete cascade,
  group_id         bigint not null references groups(id),
  width_mm         int not null,
  height_mm        int not null,
  base_price_cents int not null,
  scraped_at       timestamptz default now(),
  unique (article_id, group_id, width_mm, height_mm)
);

create index article_price_points_lookup_idx
  on article_price_points(article_id, group_id, width_mm, height_mm);

-- Lieferzeit-Regeln (aus passende-fenster.de/lieferzeiten/)
create table delivery_time_rules (
  id             bigserial primary key,
  description    text not null,
  match_criteria jsonb not null,
  weeks_min      int not null,
  weeks_max      int not null,
  sort_order     int default 0
);

-- =====================================================================
-- Auto-updated_at für articles (bestehender Trigger bleibt aus 0001)
-- =====================================================================

-- Nichts zu tun — Trigger `articles_set_updated_at` existiert bereits.
