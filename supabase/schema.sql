-- AdSpace schema — run this once in the Supabase SQL editor
-- Dashboard → SQL Editor → New query → paste → Run

-- ── Extensions ──────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Tables ──────────────────────────────────────────────────────────────────

create table if not exists public.creators (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid unique not null references auth.users(id) on delete cascade,
  name          text not null default '',
  handle        text not null default '',
  youtube_url   text,
  avatar_url    text,
  niche_tags    text[] not null default '{}',
  avg_views     integer,
  retention_pct numeric,
  age_breakdown jsonb,
  gender_breakdown jsonb,
  geo_breakdown jsonb,
  subscribers   text,
  bio           text,
  star_rating   numeric not null default 0,
  rating_count  integer not null default 0,
  created_at    timestamptz not null default now()
);

create table if not exists public.sponsors (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid unique not null references auth.users(id) on delete cascade,
  company_name    text not null default '',
  industry        text,
  niche_tags      text[] not null default '{}',
  bio             text,
  website         text,
  avatar_url      text,
  completion_rate numeric not null default 0,
  created_at      timestamptz not null default now()
);

create table if not exists public.campaigns (
  id                       uuid primary key default uuid_generate_v4(),
  sponsor_id               uuid not null references public.sponsors(id) on delete cascade,
  name                     text not null,
  description              text,
  campaign_type            text not null default 'ad-read',
  pricing_model            text not null default 'flat',
  flat_fee                 numeric not null default 0,
  cpm                      numeric not null default 0,
  payout_cap               numeric,
  niche_tags               text[] not null default '{}',
  content_deadline_days    integer,
  payout_window_days       integer not null default 30,
  submission_deadline_days integer not null default 14,
  status                   text not null default 'open',
  created_at               timestamptz not null default now()
);

create table if not exists public.offers (
  id            uuid primary key default uuid_generate_v4(),
  campaign_id   uuid not null references public.campaigns(id) on delete cascade,
  creator_id    uuid not null references public.creators(id) on delete cascade,
  proposed_rate numeric,
  note          text,
  status        text not null default 'pending',
  accepted_at   timestamptz,
  created_at    timestamptz not null default now()
);

create table if not exists public.submissions (
  id               uuid primary key default uuid_generate_v4(),
  offer_id         uuid not null references public.offers(id) on delete cascade,
  video_url        text not null,
  submitted_at     timestamptz not null default now(),
  approval_status  text not null default 'pending_review',
  approved_at      timestamptz,
  rejection_reason text
);

create table if not exists public.ratings (
  id          uuid primary key default uuid_generate_v4(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  sponsor_id  uuid not null references public.sponsors(id) on delete cascade,
  creator_id  uuid not null references public.creators(id) on delete cascade,
  stars       integer not null check (stars between 1 and 5),
  comment     text,
  created_at  timestamptz not null default now()
);

create table if not exists public.messages (
  id         uuid primary key default uuid_generate_v4(),
  offer_id   uuid not null references public.offers(id) on delete cascade,
  sender_id  uuid not null references auth.users(id) on delete cascade,
  body       text not null,
  created_at timestamptz not null default now()
);

-- ── Row Level Security ───────────────────────────────────────────────────────

alter table public.creators  enable row level security;
alter table public.sponsors  enable row level security;
alter table public.campaigns enable row level security;
alter table public.offers    enable row level security;
alter table public.submissions enable row level security;
alter table public.ratings   enable row level security;
alter table public.messages  enable row level security;

-- creators: anyone can read, owners can write
create policy "creators_select" on public.creators for select using (true);
create policy "creators_insert" on public.creators for insert with check (auth.uid() = user_id);
create policy "creators_update" on public.creators for update using (auth.uid() = user_id);
create policy "creators_delete" on public.creators for delete using (auth.uid() = user_id);

-- sponsors: anyone can read, owners can write
create policy "sponsors_select" on public.sponsors for select using (true);
create policy "sponsors_insert" on public.sponsors for insert with check (auth.uid() = user_id);
create policy "sponsors_update" on public.sponsors for update using (auth.uid() = user_id);
create policy "sponsors_delete" on public.sponsors for delete using (auth.uid() = user_id);

-- campaigns: anyone can read open campaigns, sponsors manage their own
create policy "campaigns_select" on public.campaigns for select using (true);
create policy "campaigns_insert" on public.campaigns for insert
  with check (exists (select 1 from public.sponsors where id = sponsor_id and user_id = auth.uid()));
create policy "campaigns_update" on public.campaigns for update
  using (exists (select 1 from public.sponsors where id = sponsor_id and user_id = auth.uid()));
create policy "campaigns_delete" on public.campaigns for delete
  using (exists (select 1 from public.sponsors where id = sponsor_id and user_id = auth.uid()));

-- offers: creators OR sponsors can insert; both parties can read/update their own
create policy "offers_select" on public.offers for select
  using (
    exists (select 1 from public.creators where id = creator_id and user_id = auth.uid())
    or exists (select 1 from public.campaigns c join public.sponsors s on c.sponsor_id = s.id where c.id = campaign_id and s.user_id = auth.uid())
  );
create policy "offers_insert" on public.offers for insert
  with check (
    exists (select 1 from public.creators where id = creator_id and user_id = auth.uid())
    or exists (select 1 from public.campaigns c join public.sponsors s on c.sponsor_id = s.id where c.id = campaign_id and s.user_id = auth.uid())
  );
create policy "offers_update" on public.offers for update
  using (
    exists (select 1 from public.creators where id = creator_id and user_id = auth.uid())
    or exists (select 1 from public.campaigns c join public.sponsors s on c.sponsor_id = s.id where c.id = campaign_id and s.user_id = auth.uid())
  );

-- submissions: creator and sponsor of the offer can read; creator can insert
create policy "submissions_select" on public.submissions for select
  using (exists (select 1 from public.offers o join public.creators c on o.creator_id = c.id where o.id = offer_id and c.user_id = auth.uid())
    or exists (select 1 from public.offers o join public.campaigns ca on o.campaign_id = ca.id join public.sponsors s on ca.sponsor_id = s.id where o.id = offer_id and s.user_id = auth.uid()));
create policy "submissions_insert" on public.submissions for insert
  with check (exists (select 1 from public.offers o join public.creators c on o.creator_id = c.id where o.id = offer_id and c.user_id = auth.uid()));

-- Sponsor of the offer's campaign can update (approve/reject); creator can update (auto-approve path)
create policy "submissions_update" on public.submissions for update
  using (
    exists (select 1 from public.offers o join public.creators c on o.creator_id = c.id where o.id = offer_id and c.user_id = auth.uid())
    or exists (select 1 from public.offers o join public.campaigns ca on o.campaign_id = ca.id join public.sponsors s on ca.sponsor_id = s.id where o.id = offer_id and s.user_id = auth.uid())
  );

-- ratings: sponsor can insert, anyone can read
create policy "ratings_select" on public.ratings for select using (true);
create policy "ratings_insert" on public.ratings for insert
  with check (exists (select 1 from public.sponsors where id = sponsor_id and user_id = auth.uid()));

-- messages: participants of the offer can read and send
create policy "messages_select" on public.messages for select
  using (sender_id = auth.uid()
    or exists (select 1 from public.offers o join public.creators c on o.creator_id = c.id where o.id = offer_id and c.user_id = auth.uid())
    or exists (select 1 from public.offers o join public.campaigns ca on o.campaign_id = ca.id join public.sponsors s on ca.sponsor_id = s.id where o.id = offer_id and s.user_id = auth.uid()));
create policy "messages_insert" on public.messages for insert
  with check (sender_id = auth.uid());

-- ── Storage bucket for avatars ───────────────────────────────────────────────
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true)
  on conflict (id) do nothing;

create policy "avatars_select" on storage.objects for select using (bucket_id = 'avatars');
create policy "avatars_insert" on storage.objects for insert with check (bucket_id = 'avatars' and auth.uid() is not null);
create policy "avatars_update" on storage.objects for update using (bucket_id = 'avatars' and auth.uid() is not null);

-- ── Reports table ───────────────────────────────────────────────────────────
create table if not exists public.reports (
  id          uuid primary key default uuid_generate_v4(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  report_type text not null check (report_type in ('bug', 'user_report', 'content_report')),
  description text not null,
  related_id  uuid,
  status      text not null default 'open',
  created_at  timestamptz not null default now()
);

alter table public.reports enable row level security;

-- Any authenticated user can insert their own report
create policy "reports_insert" on public.reports for insert
  with check (auth.uid() = reporter_id);

-- Only service-role / admin can read (no select policy for regular users)

-- ── Migration: initiated_by column on offers ────────────────────────────────
-- Tracks who sent the offer so the correct party sees Accept/Decline.
-- Default 'creator' preserves existing creator-application rows.
-- Run in Supabase SQL editor:
--
-- alter table public.offers
--   add column if not exists initiated_by text not null default 'creator';

-- ── Migration: cancellation_count columns ────────────────────────────────────
-- Run in Supabase SQL editor:
--
-- alter table public.creators
--   add column if not exists cancellation_count integer not null default 0;
--
-- alter table public.sponsors
--   add column if not exists cancellation_count integer not null default 0;

-- ── Migration: language_breakdown column ────────────────────────────────────
-- Run in Supabase SQL editor if column doesn't exist:
--
-- alter table public.creators
--   add column if not exists language_breakdown jsonb;

-- ── Migration: kill_fee_charged column on offers ───────────────────────────────
-- Tracks whether a kill fee was applied when a sponsor cancelled after the 24h
-- free window. Stored as a numeric amount (null = no kill fee applied).
-- Run in Supabase SQL editor:
--
-- alter table public.offers
--   add column if not exists kill_fee_charged numeric;

-- ── Migration: Stripe payment tracking columns on submissions ───────────────────
-- Run in Supabase SQL editor:
--
-- alter table public.submissions
--   add column if not exists stripe_payment_intent_id text,
--   add column if not exists stripe_checkout_session_id text,
--   add column if not exists payment_status text default 'unpaid';
-- -- payment_status values: 'unpaid', 'pending', 'paid', 'refunded'

-- ── Migration: stripe_account_id column on creators ────────────────────────────
-- Run in Supabase SQL editor:
--
-- alter table public.creators
--   add column if not exists stripe_account_id text;

-- ── Migration: content_deadline_days + accepted_at ───────────────────────────
-- Run these in the Supabase SQL editor on existing databases:
--
-- alter table public.campaigns
--   add column if not exists content_deadline_days integer,
--   drop column if exists content_deadline;
--
-- alter table public.offers
--   add column if not exists accepted_at timestamptz;
--
-- alter table public.submissions
--   add column if not exists approved_at timestamptz,
--   add column if not exists rejection_reason text;
