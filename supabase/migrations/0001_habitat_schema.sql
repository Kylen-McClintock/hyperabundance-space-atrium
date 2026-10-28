-- =============================================================================
-- HyperAbundance Community Space Atrium — Canonical Database Schema (v1.0)
-- =============================================================================
-- Dedicated Supabase project schema for habitat-owned data.
-- Authoritative health data remains in LEVL; canonical blueprints/seeds remain in AGI Futures.
-- =============================================================================

create extension if not exists "pgcrypto";

-- 1. Habitat Profiles & Workspace Preferences
create table if not exists public.habitat_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  handle text unique,
  display_name text not null default 'Orbital Explorer',
  avatar_style text not null default 'astronaut-ivory',
  presence_status text not null default 'exploring'
    check (presence_status in ('focus', 'available', 'exploring', 'offline')),
  current_destination text not null default 'atrium-commons',
  saved_workspace_id text default 'pod-earthview-1',
  audio_prefs jsonb not null default '{"mood": "deep-focus", "musicVolume": 0.55, "ambientVolume": 0.4, "uiVolume": 0.5, "muted": false}'::jsonb,
  quality_tier text not null default 'balanced'
    check (quality_tier in ('high', 'balanced', 'lightweight', 'directory-2d')),
  reduced_motion boolean not null default false,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.habitat_profiles enable row level security;

create policy "Public can view active non-private presence and basic profile"
  on public.habitat_profiles for select
  using (true);

create policy "Users can insert own habitat profile"
  on public.habitat_profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own habitat profile"
  on public.habitat_profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 2. Focus Sessions (Work intentions are private unless explicitly shared)
create table if not exists public.focus_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  destination_id text not null default 'pod-earthview-1',
  intention_private text,
  share_intention_public boolean not null default false,
  duration_minutes integer, -- null = untimed flow session
  started_at timestamptz not null default now(),
  target_end_at timestamptz,
  completed_at timestamptz,
  status text not null default 'active'
    check (status in ('active', 'completed', 'ended_early')),
  created_at timestamptz not null default now()
);

alter table public.focus_sessions enable row level security;

create policy "Users can read own focus sessions"
  on public.focus_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own focus sessions"
  on public.focus_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own focus sessions"
  on public.focus_sessions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 3. Member Banners (Building / Looking For / Can Help With)
create table if not exists public.member_banners (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  handle text,
  role_tag text not null default 'Builder',
  building text not null default '' check (char_length(building) <= 160),
  looking_for text not null default '' check (char_length(looking_for) <= 160),
  can_help_with text not null default '' check (char_length(can_help_with) <= 160),
  linked_idea_slug text,
  sector_tags text[] not null default '{}',
  is_visible boolean not null default true,
  source_agifutures_profile_id uuid,
  updated_at timestamptz not null default now()
);

alter table public.member_banners enable row level security;

create policy "Anyone can view visible member banners"
  on public.member_banners for select
  using (is_visible = true or auth.uid() = user_id);

create policy "Users can upsert own member banner"
  on public.member_banners for insert
  with check (auth.uid() = user_id);

create policy "Users can update own member banner"
  on public.member_banners for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 4. Saved Items (Ideas, LEVL Modalities, Protocol Draft Previews, Briefing Items)
create table if not exists public.saved_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type text not null
    check (item_type in ('agi_idea', 'levl_modality', 'levl_protocol_draft', 'briefing_item', 'idea_seed')),
  canonical_id text not null,
  title text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (user_id, item_type, canonical_id)
);

alter table public.saved_items enable row level security;

create policy "Users manage own saved items"
  on public.saved_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 5. Asynchronous Introductions, Offers & Idea Contributions
create table if not exists public.community_contributions (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null,
  target_type text not null
    check (target_type in ('idea_blueprint', 'idea_seed', 'member_intro', 'room_note')),
  target_id text not null, -- e.g. idea slug or recipient user_id
  contribution_kind text not null
    check (contribution_kind in ('experiment_proposal', 'prototype_link', 'skill_offer', 'introduction', 'assumption_critique', 'idea_seed_submission')),
  title text not null check (char_length(title) <= 140),
  body text not null check (char_length(body) <= 2000),
  external_url text,
  idempotency_key text unique,
  moderation_status text not null default 'published'
    check (moderation_status in ('published', 'flagged', 'removed')),
  created_at timestamptz not null default now()
);

alter table public.community_contributions enable row level security;

create policy "Published contributions are readable"
  on public.community_contributions for select
  using (moderation_status = 'published' or auth.uid() = author_id);

create policy "Authenticated users can create contributions"
  on public.community_contributions for insert
  with check (auth.uid() = author_id);

create policy "Authors can delete own contributions"
  on public.community_contributions for delete
  using (auth.uid() = author_id);

-- 6. Cross-App Verified Account Links (LEVL, AGI Futures, Discord)
create table if not exists public.account_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null check (provider in ('levl', 'agifutures', 'discord')),
  external_user_id text not null,
  external_handle text,
  scopes text[] not null default '{}',
  verified_at timestamptz not null default now(),
  revoked_at timestamptz,
  unique (user_id, provider)
);

alter table public.account_links enable row level security;

create policy "Users can view and revoke own account links"
  on public.account_links for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 7. AI Resident Usage & Per-User Quota Ledger
create table if not exists public.ai_request_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resident_role text not null
    check (resident_role in ('concierge', 'levl_bartender', 'agi_builder_guide', 'dj')),
  idempotency_key text,
  created_at timestamptz not null default now()
);

alter table public.ai_request_logs enable row level security;

create policy "Users can read and insert own AI usage logs"
  on public.ai_request_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 8. Moderation Reports & User Blocks (Required before public social posting)
create table if not exists public.moderation_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  target_type text not null check (target_type in ('banner', 'contribution', 'user')),
  target_id text not null,
  reason text not null check (char_length(reason) <= 500),
  created_at timestamptz not null default now()
);

alter table public.moderation_reports enable row level security;

create policy "Authenticated users can submit reports"
  on public.moderation_reports for insert
  with check (auth.uid() = reporter_id);

create table if not exists public.user_blocks (
  blocker_id uuid not null references auth.users(id) on delete cascade,
  blocked_user_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_user_id)
);

alter table public.user_blocks enable row level security;

create policy "Users manage own block list"
  on public.user_blocks for all
  using (auth.uid() = blocker_id)
  with check (auth.uid() = blocker_id);
