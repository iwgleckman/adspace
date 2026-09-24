-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Creators ─────────────────────────────────────────────────────────────────
create table if not exists public.creators (
  id                 uuid primary key default uuid_generate_v4(),
  user_id            uuid references auth.users(id) on delete cascade not null unique,
  name               text not null,
  handle             text,
  youtube_url        text,
  avatar_url         text,
  niche_tags         text[]    default '{}',
  avg_views          integer,
  retention_pct      numeric(5,2),
  age_breakdown      jsonb,
  gender_breakdown   jsonb,
  geo_breakdown      jsonb,
  subscribers        text,
  bio                text,
  star_rating        numeric(3,2) not null default 0,
  rating_count       integer      not null default 0,
  created_at         timestamptz  not null default now()
);

-- ── Sponsors ─────────────────────────────────────────────────────────────────
create table if not exists public.sponsors (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid references auth.users(id) on delete cascade not null unique,
  company_name     text not null,
  industry         text,
  niche_tags       text[]   default '{}',
  bio              text,
  website          text,
  avatar_url       text,
  completion_rate  numeric(5,2) not null default 100,
  created_at       timestamptz  not null default now()
);

-- ── Campaigns ────────────────────────────────────────────────────────────────
create table if not exists public.campaigns (
  id                       uuid primary key default uuid_generate_v4(),
  sponsor_id               uuid references public.sponsors(id) on delete cascade not null,
  name                     text not null,
  description              text,
  campaign_type            text not null default 'ad-read'
                             check (campaign_type in ('ad-read','dedicated-video','product-placement')),
  pricing_model            text not null default 'flat'
                             check (pricing_model in ('flat','cpm','hybrid')),
  flat_fee                 numeric(12,2) not null default 0,
  cpm                      numeric(8,2)  not null default 0,
  payout_cap               numeric(12,2),
  niche_tags               text[]   default '{}',
  content_deadline         date,
  payout_window_days       integer  not null default 30,
  submission_deadline_days integer  not null default 14,
  status                   text not null default 'open'
                             check (status in ('open','needs_response','accepted','in_progress','completed','disputed')),
  created_at               timestamptz not null default now()
);

-- ── Offers / Applications ────────────────────────────────────────────────────
create table if not exists public.offers (
  id            uuid primary key default uuid_generate_v4(),
  campaign_id   uuid references public.campaigns(id) on delete cascade not null,
  creator_id    uuid references public.creators(id)  on delete cascade not null,
  proposed_rate numeric(12,2),
  note          text,
  status        text not null default 'pending'
                  check (status in ('pending','countered','accepted','declined')),
  created_at    timestamptz not null default now(),
  unique (campaign_id, creator_id)
);

-- ── Submissions ───────────────────────────────────────────────────────────────
create table if not exists public.submissions (
  id              uuid primary key default uuid_generate_v4(),
  offer_id        uuid references public.offers(id) on delete cascade not null unique,
  video_url       text not null,
  submitted_at    timestamptz not null default now(),
  approval_status text not null default 'pending'
                    check (approval_status in ('pending','approved','rejected'))
);

-- ── Ratings ───────────────────────────────────────────────────────────────────
create table if not exists public.ratings (
  id          uuid primary key default uuid_generate_v4(),
  campaign_id uuid references public.campaigns(id) on delete cascade not null,
  sponsor_id  uuid references public.sponsors(id)  on delete cascade not null,
  creator_id  uuid references public.creators(id)  on delete cascade not null,
  stars       smallint not null check (stars between 1 and 5),
  comment     text,
  created_at  timestamptz not null default now(),
  unique (campaign_id, creator_id)
);

-- ── Messages ──────────────────────────────────────────────────────────────────
create table if not exists public.messages (
  id         uuid primary key default uuid_generate_v4(),
  offer_id   uuid references public.offers(id) on delete cascade not null,
  sender_id  uuid references auth.users(id) not null,
  body       text not null,
  created_at timestamptz not null default now()
);

-- ── Row-Level Security ────────────────────────────────────────────────────────
alter table public.creators   enable row level security;
alter table public.sponsors   enable row level security;
alter table public.campaigns  enable row level security;
alter table public.offers     enable row level security;
alter table public.submissions enable row level security;
alter table public.ratings    enable row level security;
alter table public.messages   enable row level security;

-- Creators: own row + public read
create policy "creators_select_all"  on public.creators for select using (true);
create policy "creators_insert_own"  on public.creators for insert with check (user_id = auth.uid());
create policy "creators_update_own"  on public.creators for update using (user_id = auth.uid());

-- Sponsors: own row + public read
create policy "sponsors_select_all"  on public.sponsors for select using (true);
create policy "sponsors_insert_own"  on public.sponsors for insert with check (user_id = auth.uid());
create policy "sponsors_update_own"  on public.sponsors for update using (user_id = auth.uid());

-- Campaigns: public read, sponsor write
create policy "campaigns_select_all"    on public.campaigns for select using (true);
create policy "campaigns_insert_sponsor" on public.campaigns for insert
  with check (sponsor_id in (select id from public.sponsors where user_id = auth.uid()));
create policy "campaigns_update_sponsor" on public.campaigns for update
  using (sponsor_id in (select id from public.sponsors where user_id = auth.uid()));

-- Offers: involved parties only
create policy "offers_select" on public.offers for select using (
  creator_id in (select id from public.creators where user_id = auth.uid())
  or campaign_id in (select id from public.campaigns where sponsor_id in (select id from public.sponsors where user_id = auth.uid()))
);
create policy "offers_insert_creator" on public.offers for insert
  with check (creator_id in (select id from public.creators where user_id = auth.uid()));
create policy "offers_update_sponsor" on public.offers for update using (
  campaign_id in (select id from public.campaigns where sponsor_id in (select id from public.sponsors where user_id = auth.uid()))
);

-- Submissions: involved parties
create policy "submissions_select" on public.submissions for select using (
  offer_id in (
    select o.id from public.offers o
    join public.creators c on c.id = o.creator_id
    join public.campaigns ca on ca.id = o.campaign_id
    join public.sponsors s on s.id = ca.sponsor_id
    where c.user_id = auth.uid() or s.user_id = auth.uid()
  )
);
create policy "submissions_insert_creator" on public.submissions for insert
  with check (offer_id in (select o.id from public.offers o join public.creators c on c.id = o.creator_id where c.user_id = auth.uid()));

-- Ratings: sponsor inserts, public read
create policy "ratings_select_all" on public.ratings for select using (true);
create policy "ratings_insert_sponsor" on public.ratings for insert
  with check (sponsor_id in (select id from public.sponsors where user_id = auth.uid()));

-- Messages: offer participants
create policy "messages_select" on public.messages for select using (
  offer_id in (
    select o.id from public.offers o
    join public.creators c on c.id = o.creator_id
    join public.campaigns ca on ca.id = o.campaign_id
    join public.sponsors s on s.id = ca.sponsor_id
    where c.user_id = auth.uid() or s.user_id = auth.uid()
  )
);
create policy "messages_insert" on public.messages for insert
  with check (sender_id = auth.uid());

-- ── Rating average trigger ────────────────────────────────────────────────────
create or replace function update_creator_rating()
returns trigger language plpgsql security definer as $$
begin
  update public.creators
  set
    star_rating  = (select avg(stars) from public.ratings where creator_id = NEW.creator_id),
    rating_count = (select count(*)  from public.ratings where creator_id = NEW.creator_id)
  where id = NEW.creator_id;
  return NEW;
end;
$$;

drop trigger if exists trg_rating on public.ratings;
create trigger trg_rating after insert or update on public.ratings
  for each row execute function update_creator_rating();
