# AGI Futures → HyperAbundance Integration Discovery

> **Audit Scope & Methodology Note**:
> - **Status Labels**: Every technical finding in this report is tagged as **`VERIFIED IN CODE`**, **`VERIFIED IN DEPLOYED CONFIGURATION`**, **`PROPOSED`**, or **`UNKNOWN`**.
> - **Live Supabase Configuration**: Live Supabase database inspection (DDL catalog, deployed Row-Level Security policies, triggers, storage policies, and production row counts) is **unavailable from repository inspection alone** (`UNKNOWN`). No `supabase/migrations/*.sql` directory or `supabase/config.toml` file exists in the repository (`VERIFIED IN CODE`). All database table structures, foreign keys, RPC signatures, and storage buckets documented below are reconstructed from TypeScript queries, server actions, and seed scripts (`VERIFIED IN CODE`), and must not be assumed to match deployed production constraints without running a live `pg_catalog` / `information_schema` inspection.
> - **Security & Privacy**: No secrets, tokens, environment-variable values, or private user/submission records are included. Only environment-variable **names** and public or synthetic payloads are shown.

---

## A. Executive Summary: What Is Reusable Today vs. What Must Be Built

### 1. What Is Reusable Today (`VERIFIED IN CODE`)
- **Canonical Startup Registry & Taxonomy (33 Ideas)**: [`src/data/ideas.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/data/ideas.ts#L1-L443) (`ideas` array and `ideaFallbacks` dictionary) provides a clean, single-source-of-truth TypeScript registry of all 33 canonical startup blueprints, including stable `slug`, `title`, `scoreTitle` (short 4-5 word descriptor), `description` (1-2 sentence thesis), hero image reference, route `href`, theme color tokens, composite scores (`moat`, `difficulty`, `impact` on a `-100` to `100` scale), `civilizational_impact_ratings`, and an 8-dimension tag taxonomy (`sector`, `bottleneck`, `readiness`, `customer`, `outcomes`, `product_type`, `enabling_technology`, `founder_fit`).
- **Startup Valuation Forecast Curves**: [`src/data/forecasts.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/data/forecasts.ts#L1-L120) and [`src/utils/forecastMath.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/utils/forecastMath.ts#L1-L185) provide deterministic probability distributions (`2030-01-01`, `2035-01-01`, `2040-01-01` across 6 valuation thresholds from `$10M` to `$1T`), expected-valuation math (`calculateExpectedValuation`), and `calculateTimeToUnicorn`, plus per-idea AI rationale strings (`aiRationale`).
- **Problem Atlas (55 Civilizational Bottlenecks)**: [`src/data/problem-atlas-data.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/data/problem-atlas-data.ts#L1-L90) exports `problems: ProblemData[]` with structured fields (`rank`, `slug`, `title`, `short_descriptor`, `preview_text`, `problem_priority`, `importance`, `neglectedness`, `tractability`, `gap`, `stakes`, `sector_tags`, `outcome_tags`, `long_form_content` in light Markdown, and `sources`).
- **Community Submissions ("Idea Seeds") Data Model**: [`src/app/Idea-Seeds/actions.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/Idea-Seeds/actions.ts#L1-L181) and [`src/app/Idea-Seeds/[id]/actions.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/Idea-Seeds/%5Bid%5D/actions.ts#L1-L108) back a separate `idea_seeds` table (distinct from canonical blueprints), with 5 semantic vote types (`world_needs_this`, `id_build_this`, `id_fund_this`, `id_use_this`, `keep_me_updated` in `idea_seed_votes`) and threaded comments (`idea_seed_comments`). This cleanly separates member-submitted concepts from editorially approved blueprints.
- **Proof-of-Work Contributions (`artifacts`) & Threaded Notes (`artifact_comments`)**: [`src/components/ArtifactSection.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/components/ArtifactSection.tsx#L10-L230), [`src/components/SubmitArtifactModal.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/components/SubmitArtifactModal.tsx#L1-L310), and [`src/app/artifact/[id]/page.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/artifact/%5Bid%5D/page.tsx#L1-L65) store builder contributions linked to a `project_id` (`projects.id`) and `profile_id` (`profiles.id`), supporting 13 artifact types (`core repo`, `technical spec`, `prototype`, `demo`, `design concept`, etc.), external URLs, media attachments, upvotes (`artifact_likes`), editor picks (`is_editors_pick`), and nested comments (`artifact_comments`).
- **Builder Profiles & Matching Signals**: [`src/app/onboarding/page-client.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/onboarding/page-client.tsx#L1-L435) and [`src/app/builder/[handle]/page-client.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/builder/%5Bhandle%5D/page-client.tsx#L1-L450) maintain rich builder profiles (`profiles` table) with `handle`, `builder_status`, `goals` (e.g., `"Actively Building My Own Project"`, `"Looking for Cofounder"`, `"Looking to Join Startup"`, `"Advising"`), `sectors`, `outcomes`, `frontier_tech_familiarity`, `top_skills`, `open_to`, `provider_links`, and privacy controls (`contact_preference`, `message_preference`).
- **Founder Fit Matcher Engine**: [`src/lib/match/score.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/lib/match/score.ts#L1-L154) and [`src/lib/match/gemini.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/lib/match/gemini.ts#L1-L78) implement a deterministic 6-axis heuristic ranker (`rankIdeas`) paired with a Gemini structured-JSON generator (`runMatch` and `unlockBrief` in [`src/app/match/actions.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/match/actions.ts#L1-L263)).

### 2. What Must Be Built or Refactored (`VERIFIED IN CODE` -> `PROPOSED`)
- **No Public JSON APIs or Content Feeds Exist Today (`VERIFIED IN CODE`)**: The repository exposes only two Next.js Route Handlers: [`POST /api/upload`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/api/upload/route.ts#L1-L47) and [`GET /auth/callback`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/auth/callback/route.ts#L1-L44). All other mutations and reads occur via Next.js Server Actions (bound to internal React trees) or direct browser-to-Supabase PostgREST queries. Versioned `/api/v1/*` Route Handlers must be built for the HyperAbundance habitat.
- **Full Blueprint Narratives Are Hardcoded inside React JSX (`VERIFIED IN CODE`)**: While card summaries, scores, tags, and valuation curves live in [`src/data/ideas.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/data/ideas.ts) and [`src/data/forecasts.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/data/forecasts.ts), the deep blueprint writeups (Problem, Why Now, Solution, Product Architecture Simulator, Value Flow Loop, ICP, Business Model, Unit Economics, Prior Art Matrix, Moat, First Experiment, AGI Future Edge, Civilizational Impact, and Citations) are authored directly inside each idea's `src/app/<slug>/page-client.tsx` and `src/app/<slug>/components/*` files. To power holographic booth displays and a grounded Habitat AI Builder Guide without scraping HTML, AGI Futures needs a structured blueprint content manifest (`src/data/blueprint-content.ts` or build-time JSON extraction).
- **No Editorial Workflow, Moderation State, or Duplicate Guard on Submissions (`VERIFIED IN CODE`)**: [`submitIdeaSeed`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/Idea-Seeds/actions.ts#L67-L119) inserts directly into `idea_seeds` and publishes immediately to `/Idea-Seeds` with no `status` column (`draft`, `pending_review`, `published`, `rejected`, `withdrawn`), no source attribution (`source_app`), no idempotency key, no rate limit, and no promotion link (`promoted_project_id`) to `projects`.
- **No Cross-App Account Linking or Scoped Integration Auth (`VERIFIED IN CODE`)**: Authentication relies on first-party cookies set on the AGI Futures origin via `@supabase/ssr` ([`src/utils/supabase/server.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/utils/supabase/server.ts#L1-L36)). If the habitat runs on its own domain and Supabase project, a signed OAuth/OIDC-style account-linking handshake (`account_links` table + short-lived state/code exchange) and service-to-service HMAC/Bearer token verification are required.
- **No Conversational AI Builder Guide Exists Today (`VERIFIED IN CODE`)**: Only the one-shot Founder Fit Matcher ([`src/lib/match/gemini.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/lib/match/gemini.ts#L1-L78)) uses an LLM (`gemini-flash-latest`). There is no chat assistant, vector store (`pgvector`), or streaming RAG endpoint.
- **No Discord Integration Exists Today (`VERIFIED IN CODE`)**: There are zero Discord bots, webhooks, OAuth providers, channel mappings, or message sync tables in the repository. Even the social links in [`src/lib/site.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/lib/site.ts#L18-L23) include only Instagram, Threads, Facebook, and Substack.
- **Security & Consistency Gaps in Existing Code (`VERIFIED IN CODE`)**:
  1. [`POST /api/upload`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/api/upload/route.ts#L6-L46) uses `SUPABASE_SERVICE_ROLE_KEY` to upload files to the public `artifact_media` bucket **without checking `supabase.auth.getUser()`, file size, or MIME type**.
  2. [`seed_tags.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/seed_tags.ts#L878-L886) defines 32 startups (missing `housegraph`, which is present in [`src/data/ideas.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/data/ideas.ts#L422-L429)) and omits `...startup.scores` during `.from('projects').upsert(...)`.
  3. Several newer canonical idea pages (e.g., [`src/app/commonground/page-client.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/commonground/page-client.tsx)) omit `<ArtifactSection projectSlug="..." />` and `<InterestedButton projectSlug="..." />` at the bottom of the page, unlike older pages (e.g., [`src/app/porchfront/page-client.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/porchfront/page-client.tsx#L555-L561)).

---

## B. Current Architecture and Idea/Submission Lifecycle

### 1. Architecture and Deployment

#### Framework, Languages, & Packages (`VERIFIED IN CODE`)
- **Application Root**: `/Users/kylenmcclintock/Documents/AntiGravity Projects/AGI Futures - AntiGravity/AGI Futures Startup Ideas`
- **Framework & Runtime**: Next.js `16.1.6` (App Router, Turbopack configured in [`next.config.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/next.config.ts#L4-L23)), React `19.2.3`, TypeScript `^5` (`strict: true` in [`tsconfig.json`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/tsconfig.json#L1-L35)).
- **Styling & UI**: Tailwind CSS v4 (`@tailwindcss/postcss` in [`postcss.config.mjs`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/postcss.config.mjs#L1-L8) and [`src/app/globals.css`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/globals.css#L1-L68)), `framer-motion` `^12.35.1`, `lucide-react` `^0.577.0`, `recharts` `^3.8.0`, `three` `^0.183.2` + `@react-three/fiber` `^9.5.0` + `@react-three/drei` `^10.7.7`, `nuqs` `^2.8.9` (URL query state).
- **Database & Auth SDKs** ([`package.json`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/package.json#L11-L30)): `@supabase/supabase-js` `^2.99.2`, `@supabase/ssr` `^0.9.0`, `@supabase/auth-ui-react` `^0.4.7`, `pg` `^8.20.0`.
- **Deployment Target**: Vercel (`VERIFIED IN CODE` via `.gitignore` `.vercel` entry, `@vercel/og` / `next/og` usage in [`src/lib/og/render.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/lib/og/render.tsx#L1-L97), and git commit logs in [`.git/logs/HEAD`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/.git/logs/HEAD#L79)). Canonical production domain is `https://www.agifutures.org` ([`src/lib/site.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/lib/site.ts#L1-L24)).

#### Repository Structure (`VERIFIED IN CODE`)
- `src/app/` - Next.js App Router pages:
  - 33 colocated canonical startup blueprint directories (`src/app/<slug>/page.tsx`, `page-client.tsx`, `opengraph-image.tsx`, `twitter-image.tsx`, `components/*`, `assets/*`).
  - `/ideas` and `/ideas/[sector]` - Sector hub pages ([`src/app/ideas/page.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/ideas/page.tsx), [`src/app/ideas/[sector]/page.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/ideas/%5Bsector%5D/page.tsx)).
  - `/Idea-Seeds`, `/Idea-Seeds/new`, `/Idea-Seeds/[id]` - Community idea submissions, voting, and comments ([`src/app/Idea-Seeds/page.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/Idea-Seeds/page.tsx)).
  - `/problem-atlas` and `/problem-atlas/[slug]` - Ranked civilizational bottlenecks ([`src/app/problem-atlas/page.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/problem-atlas/page.tsx)).
  - `/artifact/[id]` - Standalone Proof-of-Work artifact view and nested comment thread ([`src/app/artifact/[id]/page.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/artifact/%5Bid%5D/page.tsx)).
  - `/builder/[handle]`, `/builder/[handle]/feed`, `/builder/[handle]/inbox` - Builder profiles, follow network activity feed, and unified direct-message/comment inbox ([`src/app/builder/[handle]/page.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/builder/%5Bhandle%5D/page.tsx)).
  - `/match` and `/match/[id]` - Founder Fit Matcher and shareable match results ([`src/app/match/page.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/match/page.tsx)).
  - `/forecasts/live`, `/forecasts/live/[slug]`, `/forecasts/proposed`, `/forecasting` - Community forecasting platform and methodology ([`src/app/forecasts/live/page.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/forecasts/live/page.tsx)).
  - `/singularity-tracker` and `/glossary` - Civilization cockpit metrics visualizer and lexicon ([`src/app/singularity-tracker/page.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/singularity-tracker/page.tsx), [`src/app/glossary/page.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/glossary/page.tsx)).
  - `/login`, `/onboarding`, `/auth/callback` - Authentication and builder profile setup.
  - `/about`, `/license` - Editorial thesis, curator bio, and CC BY-NC-SA 4.0 license terms.
- `src/data/` - Static registries ([`ideas.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/data/ideas.ts), [`forecasts.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/data/forecasts.ts), [`sector-hubs.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/data/sector-hubs.ts), [`hub-links.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/data/hub-links.ts), [`problem-atlas-data.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/data/problem-atlas-data.ts), [`glossary.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/data/glossary.ts)).
- `src/utils/supabase/` - Browser client ([`client.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/utils/supabase/client.ts)), SSR cookie client ([`server.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/utils/supabase/server.ts)), service-role admin client ([`admin.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/utils/supabase/admin.ts)), and session refresh middleware ([`middleware.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/utils/supabase/middleware.ts)).

#### Supabase Usage Breakdown (`VERIFIED IN CODE`)
| Capability | Status in Codebase | Implementation Details & Citations |
| :--- | :--- | :--- |
| **Auth** | **Used** (`VERIFIED IN CODE`) | Email Magic Link + OAuth (`google`, `github`, `linkedin_oidc`) in [`src/app/login/page.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/login/page.tsx#L18-L65); code exchange in [`src/app/auth/callback/route.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/auth/callback/route.ts#L6-L43); session refresh in [`src/middleware.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/middleware.ts#L1-L20). |
| **Database (PostgREST)** | **Used** (`VERIFIED IN CODE`) | 17 tables queried across Server Components, Server Actions, and Client Components (detailed in Section D). |
| **RPCs** | **Used** (`VERIFIED IN CODE`) | 2 Postgres functions called via `.rpc()`: `bump_match_rate` ([`src/app/match/actions.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/match/actions.ts#L76-L80)) and `rate_forecast_importance` ([`src/app/forecasts/components/ForecastCard.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/forecasts/components/ForecastCard.tsx#L49-L53)). |
| **Storage** | **Used** (`VERIFIED IN CODE`) | 1 public bucket `artifact_media` written by [`src/app/api/upload/route.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/api/upload/route.ts#L25-L38) for Proof-of-Work artifact and comment images. |
| **Realtime** | **Used (1 table)** (`VERIFIED IN CODE`) | [`src/components/InterestProvider.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/components/InterestProvider.tsx#L88-L115) subscribes to `postgres_changes` (`event: '*'`, `schema: 'public'`, `table: 'saved_ideas'`, `filter: 'profile_id=eq.${user.id}'`). |
| **Edge Functions** | **Not Used** (`VERIFIED IN CODE`) | No Supabase Edge Functions exist or are invoked anywhere in the codebase. |
| **Vector Search (`pgvector`)** | **Not Used** (`VERIFIED IN CODE`) | No embeddings or vector similarity queries exist in the codebase. |
| **Scheduled Jobs (`pg_cron` / Vercel Cron)** | **Not Used** (`VERIFIED IN CODE`) | No cron configuration or scheduled jobs exist in the repository (`UNKNOWN` if any exist solely in the live Supabase dashboard). |

#### Environment Variable Names Referenced in Code (`VERIFIED IN CODE`)
Only variable **names** are listed below (no values inspected or exposed):
1. `NEXT_PUBLIC_SUPABASE_URL` - [`src/utils/supabase/client.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/utils/supabase/client.ts#L5), [`server.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/utils/supabase/server.ts#L9), [`admin.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/utils/supabase/admin.ts#L11), [`middleware.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/utils/supabase/middleware.ts#L10), [`src/app/api/upload/route.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/api/upload/route.ts#L8).
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` - [`src/utils/supabase/client.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/utils/supabase/client.ts#L6), [`server.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/utils/supabase/server.ts#L10), [`middleware.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/utils/supabase/middleware.ts#L11).
3. `SUPABASE_SERVICE_ROLE_KEY` - [`src/utils/supabase/admin.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/utils/supabase/admin.ts#L12), [`src/app/api/upload/route.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/api/upload/route.ts#L9), [`seed_tags.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/seed_tags.ts#L9), [`src/scripts/seed_problems.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/scripts/seed_problems.ts#L10).
4. `NEXT_PUBLIC_SITE_URL` - [`src/lib/site.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/lib/site.ts#L4) (defaults to `"https://www.agifutures.org"`).
5. `NEXT_PUBLIC_SUBSTACK_URL` - [`src/lib/site.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/lib/site.ts#L8) (defaults to `"https://agifutures.substack.com"`).
6. `GOOGLE_SITE_VERIFICATION` - [`src/app/layout.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/layout.tsx#L36).
7. `GEMINI_API_KEY` - [`src/lib/match/gemini.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/lib/match/gemini.ts#L28).
8. `GEMINI_MODEL` - [`src/lib/match/gemini.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/lib/match/gemini.ts#L29) (defaults to `"gemini-flash-latest"`).
9. `MATCH_DAILY_CAP` - [`src/app/match/actions.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/match/actions.ts#L23) (defaults to `500`).
10. `MATCH_IP_SALT` - [`src/app/match/actions.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/match/actions.ts#L24) (defaults to `"agif"`).
11. `NODE_ENV` - [`src/app/auth/callback/route.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/auth/callback/route.ts#L31).

#### Deployed Functionality vs. Mocks / Unfinished Code (`VERIFIED IN CODE`)
- **Production-Ready / Functional in Code**:
  - Homepage library grid with tag filtering, outcome sorting, and valuation sorting ([`src/app/page.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/page.tsx), [`src/app/page-client.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/page-client.tsx)).
  - All 33 canonical startup blueprint pages, sector hubs (`/ideas/[sector]`), and Problem Atlas pages (`/problem-atlas/[slug]`).
  - Community "Idea Seeds" submission, 5-axis voting, and 3-level nested comments (`/Idea-Seeds`).
  - Proof-of-Work artifacts (`ArtifactSection`, `/artifact/[id]`), likes, and nested media comments.
  - Builder authentication, onboarding, profile pages (`/builder/[handle]`), follow network feed (`/builder/[handle]/feed`), and direct messaging inbox (`/builder/[handle]/inbox`).
  - Founder Fit Matcher (`/match` and `/match/[id]`) and Substack dual-write subscription (`SubscribeCTA`).
  - Live Forecasting platform (`/forecasts/live` and `/forecasts/live/[slug]`).
- **Mocked or Partially Implemented in Code**:
  - **Singularity Tracker (`/singularity-tracker`)**: Although the UI header displays `"LIVE DATA / CIVILIZATION COCKPIT"` ([`src/app/singularity-tracker/page.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/singularity-tracker/page.tsx#L43)), all metrics are imported from static TypeScript files (`mockMetrics` in [`src/app/singularity-tracker/data/mock-metrics.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/singularity-tracker/data/mock-metrics.ts#L1-L60), `exhaustive-metrics.ts`, and `extended-metrics.ts`) with placeholder `sourceUrl: '#'` links.
  - **Proposed Forecasts Upvote/Suggest Edits (`/forecasts/proposed`)**: In [`src/app/forecasts/components/ForecastCard.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/forecasts/components/ForecastCard.tsx#L102-L115), when `mode === "proposed"`, the `"Upvote Proposal"` and `"Suggest Edits..."` buttons have no `onClick` handlers attached.
  - **Startup Valuation Forecast "Submit Forecast" Button**: On startup blueprint pages, [`CategoryFrontierForecast.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/components/forecast/CategoryFrontierForecast.tsx#L152-L162) lets users drag probability curve nodes or type custom valuation anchors and click `"Submit Forecast"`, which sets `hasSubmitted = true` in local React state (`useState`) and blends the user's curve into a local `"Community"` toggle, but **does not persist the user's startup valuation forecast to Supabase**.

---

### 2. Idea Library and Content Model

#### Where Ideas Live (`VERIFIED IN CODE`)
Canonical startup ideas use a **hybrid static-first + Supabase metadata** architecture:
1. **Static Registry ([`src/data/ideas.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/data/ideas.ts#L98-L443))**: Defines the 33 canonical ideas (`ideas: IdeaStatic[]`) and their complete fallback scores/tags (`ideaFallbacks: Record<string, IdeaFallback>`).
   - The 33 canonical slugs are: `murmuration`, `attune`, `porchfront`, `hearth`, `homequote`, `aura`, `AIFounderLab`, `deepguide`, `main-street-legacy`, `helm`, `agentable`, `avatarlab`, `proofrun`, `handraise`, `biowalls`, `sellcraft`, `afterlight`, `civicpath`, `biomex`, `helioterra`, `easy-exit`, `proxypilot`, `bioark`, `ownyourreplacement`, `thoughtline`, `whistleworks`, `signal-house`, `skyhold`, `wild-return`, `waypoint`, `housegraph`, `public-ai`, and `commonground`. (Note casing: `AIFounderLab` uses PascalCase; all other 32 canonical slugs are lowercase/kebab-case.)
2. **Database Metadata (`projects` and `project_tags` tables)**:
   - On the homepage ([`src/app/page.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/page.tsx#L16-L64)) and on individual blueprint pages (e.g., [`src/app/porchfront/page.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/porchfront/page.tsx#L18-L29)), the server fetches `projects` joined with `project_tags(*)` by `slug` and merges them with `ideaFallbacks[slug]`.
   - Note that the `projects` table is also seeded with the 55 Problem Atlas slugs via [`src/scripts/seed_problems.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/scripts/seed_problems.ts#L19-L42) so that Problem Atlas pages can reuse `<InterestedButton>` (`saved_ideas`) and `<ArtifactSection>` (`artifacts`).
3. **Full Blueprint Narrative & Interactive Widgets (`src/app/<slug>/page-client.tsx` & `src/app/<slug>/components/*`)**:
   - Full blueprint content is **not** stored in Supabase, Markdown, MDX, or JSON. It is authored directly as bespoke React JSX inside each idea's `src/app/<slug>/page-client.tsx` (typically 400 to 900 lines of TSX per idea) with custom interactive components in `src/app/<slug>/components/` (`*Inspector.tsx`, `*Simulator.tsx`, `ValueFlowLoop.tsx`, `PriorArtMatrix.tsx`, `UnitEconomicsWidget.tsx`, `InteractiveSection.tsx`, `ExpandableCitation.tsx`).
4. **Valuation Forecasts ([`src/data/forecasts.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/data/forecasts.ts#L1-L120))**:
   - Injected into every canonical idea page via [`AutoForecastInjector.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/components/forecast/AutoForecastInjector.tsx#L1-L72), which reads `usePathname()` and calls `getForecastForSlug(slug)`.
5. **Images & Visual Assets**:
   - Hero and section images live in `src/app/<slug>/assets/*.png|*.jpg|*.webp` and are imported via Next.js static imports (`StaticImageData`), which compile to hashed URLs under `/_next/static/media/...`.
   - Every canonical idea also has an auto-generated `src/app/<slug>/opengraph-image.tsx` and `twitter-image.tsx` (created by [`scripts/generate-og.js`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/scripts/generate-og.js#L1-L46) calling [`renderIdeaOg`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/lib/og/render.tsx#L37-L76)), which serves a public `1200x630` PNG card at `https://www.agifutures.org/<slug>/opengraph-image`.

#### Publication, Updates, Unpublishing, and Deletion (`VERIFIED IN CODE`)
- Because canonical ideas are static Next.js routes registered in [`src/data/ideas.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/data/ideas.ts), **publishing, updating, unpublishing, or deleting a canonical startup blueprint requires a git commit and Vercel deployment**, optionally accompanied by running `seed_tags.ts` against Supabase. There is no CMS or database-driven publish/unpublish toggle for canonical blueprints (`VERIFIED IN CODE`).

#### Asset Access, Attribution, and Licensing Requirements (`VERIFIED IN CODE`)
- [`src/app/license/page.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/license/page.tsx#L1-L152) and [`src/components/Footer.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/components/Footer.tsx#L141-L146) license all startup idea writeups, data frameworks, and projections under **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)**.
- **Requirements for displaying ideas in the HyperAbundance habitat**:
  1. **Attribution**: Credit **AGI Futures** (`https://www.agifutures.org`) and link back to the canonical blueprint URL (`https://www.agifutures.org/<slug>`).
  2. **Indicate Changes**: Clearly label whether content shown in a habitat booth is the verbatim AGI Futures summary/blueprint, a condensed adaptation, or an AI-generated suggestion.
  3. **Brand Separation**: The license explicitly notes that the **AGI Futures name, logo, and branding** are not granted for third-party commercial endorsement; since HyperAbundance is a first-party/sister application, the integration spec should explicitly document first-party cross-display authorization while keeping member submissions and company showcases visually distinct from editorially approved AGI Futures blueprints.

---

### 3. Submissions and Editorial Workflow ("Idea Seeds")

#### End-to-End Trace of "Submit an Idea" (`VERIFIED IN CODE`)
1. **Entry Point**: Clicking `"Submit an Idea"` in [`src/components/AuthHeader.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/components/AuthHeader.tsx#L41-L46) navigates to `/Idea-Seeds` ([`src/app/Idea-Seeds/page.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/Idea-Seeds/page.tsx#L1-L148)).
2. **Form Input**: Clicking `"Plant a Seed"` navigates to `/Idea-Seeds/new` ([`src/app/Idea-Seeds/new/page.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/Idea-Seeds/new/page.tsx#L1-L27)), which renders [`IdeaSeedForm.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/Idea-Seeds/components/IdeaSeedForm.tsx#L1-L246).
   - Required fields (HTML `required` attribute):
     - `descriptor` (Short Title / Descriptor, `maxLength={80}`)
     - `one_liner` (The One-Liner Thesis, `maxLength={280}`)
     - `problem` (The Core Bottleneck / Problem, `<textarea required>`)
     - `solution_hypothesis` (Solution Hypothesis & Wedge, `<textarea required>`)
   - Optional dynamic sections (`custom_sections` JSON array of `{ type, title, content }`): users can add presets (`Why Now`, `Business Model`, `Market & TAM`, `Moat & Defensibility`, `First Experiment`, `Civilizational Impact`) or `Custom Section`.
3. **Server Action & Storage**: Submitting invokes [`submitIdeaSeed(formData)`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/Idea-Seeds/actions.ts#L67-L119):
   - Verifies authentication via `supabase.auth.getUser()`.
   - Generates a slug: `${baseSlug}-${Math.random().toString(36).substring(2, 6)}` (up to 40 chars of `descriptor` slugified + 4 random alphanumeric chars).
   - Inserts `{ profile_id: user.id, slug, descriptor, one_liner, problem, solution_hypothesis, custom_sections }` into `idea_seeds`.
   - Calls `revalidatePath('/Idea-Seeds')` and redirects to `/Idea-Seeds`.
4. **Review, Approval, & Publication**:
   - **No moderation or approval queue exists (`VERIFIED IN CODE`)**: Every submitted Idea Seed is **immediately public** on `/Idea-Seeds` and `/Idea-Seeds/[id]`.
   - **No server-side validation, spam prevention, or notifications (`VERIFIED IN CODE`)**: [`submitIdeaSeed`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/Idea-Seeds/actions.ts#L67-L119) does not enforce server-side length limits, rate limits, CAPTCHA, profanity filtering, or email/webhook notifications.
   - **No duplicate detection (`VERIFIED IN CODE`)**: Appending a random 4-character suffix bypasses slug collisions, so identical submissions create duplicate rows.
   - **Author Edit / Withdraw (`VERIFIED IN CODE`)**: Authors can **delete** their submission via [`deleteIdeaSeed(id)`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/Idea-Seeds/actions.ts#L121-L139) (which checks `.eq('id', id).eq('profile_id', user.id)`), exposed on `/Idea-Seeds` and `/builder/[handle]`. There is **no edit/update action or UI** for `idea_seeds`.
   - **Relation to Published Idea IDs (`VERIFIED IN CODE`)**: `idea_seeds.id` (UUID) and `idea_seeds.slug` have **no foreign key or automated promotion pipeline** to `projects.id` or [`src/data/ideas.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/data/ideas.ts). Community submissions remain in `idea_seeds` unless manually rewritten as a full Next.js route by the AGI Futures editorial team.

---

### 4. Community, Matching, and Contributions

#### Existing Community Capabilities (`VERIFIED IN CODE`)
1. **Builder Profiles (`/onboarding` & `/builder/[handle]`)**:
   - Stored in `profiles` (`id` = `auth.users.id`).
   - Captures structured builder identity: `handle`, `name`, `avatar_url`, `headline`, `thesis`, `builder_status` (`Founder`, `Prospective Founder`, `Developer`, `Designer`, `Product Lead`, `Go-To-Market`, `Venture`, `Operator`, `Researchers`), `goals` (`Actively Building My Own Project`, `Exploring New Ideas`, `Learning`, `Looking to Join Startup`, `Looking for Cofounder`, `Looking for Employees`, `Advising`), `sectors`, `outcomes` (ranked up to 10), `frontier_tech_familiarity` (`Novice | Proficient | Expert` per technology), `top_skills`, `open_to`, `provider_links` (`email`, `x`, `github`, `linkedin`, `website`, `portfolio`, `substack`, `huggingface`), `contact_preference` (`nobody | following | anyone`), `message_preference` (`nobody | following | anyone`), and `newsletter_opt_in`.
   - **Privacy Gate Nuance (`VERIFIED IN CODE`)**: In [`src/app/builder/[handle]/page-client.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/builder/%5Bhandle%5D/page-client.tsx#L91-L115), `"following"` means * the profile owner follows the viewer* (`ownerFollowsViewer`), enforcing a "reverse-follow meritocracy check" before exposing the owner's email or allowing direct messages. However, because `profiles` is fetched via `select('*')` in [`src/app/builder/[handle]/page.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/builder/%5Bhandle%5D/page.tsx#L19), `provider_links.email` is passed in RSC props and hidden only client-side unless sanitized on the server.
2. **Idea Bookmarks ("Interested" / `saved_ideas`)**:
   - Managed by [`src/components/InterestProvider.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/components/InterestProvider.tsx#L1-L185) and [`src/components/InterestedButton.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/components/InterestedButton.tsx#L1-L95).
   - Links `profile_id` to `project_id` (`projects.id`). Displayed publicly under the `"Saved Ideas"` tab on `/builder/[handle]`.
3. **Private Idea Notes (`idea_notes`)**:
   - Managed by [`src/components/PrivateNotesSection.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/components/PrivateNotesSection.tsx#L1-L162). Strictly private to the authoring user (`profile_id` + `project_id`).
4. **Proof-of-Work Contributions (`artifacts`, `artifact_likes`, `artifact_comments`)**:
   - Managed by [`src/components/ArtifactSection.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/components/ArtifactSection.tsx#L1-L702), [`src/components/SubmitArtifactModal.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/components/SubmitArtifactModal.tsx#L1-L310), and [`src/app/artifact/[id]/page-client.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/artifact/%5Bid%5D/page-client.tsx#L1-L395).
   - Builders attach structured work (`core repo`, `technical spec`, `prototype`, `demo`, `design concept`, `wedge strategy`, `gtm thesis`, `market insight`, `founder memo`, `policy angle`, etc.) to any `project_id`.
   - Supports author editing (`SubmitArtifactModal`), deletion (`artifact/[id]/page-client.tsx`), upvoting (`artifact_likes` + `artifacts.likes` counter), and nested comments with up to 3 image attachments (`artifact_comments`).
5. **Social Graph & Direct Messaging (`follows`, `messages`)**:
   - Users can follow builders ([`FollowListModal.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/components/FollowListModal.tsx)) and send direct messages ([`SendMessageModal.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/components/SendMessageModal.tsx)), which appear in `/builder/[handle]/inbox` alongside incoming comments on the user's artifacts.

#### Reusability for "Building / Looking For / Can Help" & Canonical Ownership (`PROPOSED`)
- **What exists**:
  - Profile-level arrays (`builder_status`, `goals`, `top_skills`, `open_to`) capture general builder intent.
  - Per-idea signals exist for `idea_seeds` via `idea_seed_votes.vote_type` (`id_build_this`, `id_fund_this`, `id_use_this`) and for canonical `projects` via `saved_ideas` ("Interested") and `artifacts` (Proof-of-Work).
  - **Gap**: For canonical blueprints (`projects`), there is no structured per-project intent table distinguishing `"building"`, `"looking_for"`, and `"can_help"` with role/skill tags and a short status note.
- **Recommended Canonical Ownership Split (`PROPOSED`)**:
  - **Owned by AGI Futures (Authoritative)**:
    1. Canonical startup blueprints (`projects`, `project_tags`, `src/data/ideas.ts`, `src/data/forecasts.ts`, and proposed `blueprint-content` JSON).
    2. Community idea submissions (`idea_seeds`, `idea_seed_votes`, `idea_seed_comments`) regardless of whether submitted from the website or the habitat.
    3. Idea-linked Proof-of-Work contributions (`artifacts`, `artifact_likes`, `artifact_comments`) and idea-linked builder intents (`project_builder_intents`: `building / looking_for / can_help` tied to a `project_id`).
    4. Shared builder identity attributes (`profiles`: `handle`, `name`, `avatar_url`, `headline`, `thesis`, `builder_status`, `goals`, `top_skills`, `sectors`).
  - **Owned by HyperAbundance Habitat (Authoritative)**:
    1. Spatial/orbital state: atrium presence, Earthview work pod occupancy, focus session timers, 3D avatar coordinates, and spatial audio/chat ephemera.
    2. Habitat-specific company showcases and member booths (which may optionally reference an AGI Futures `project_slug` or `idea_seed_id` as `"inspired_by_slug"`, but must carry an explicit `editorial_status: "community_showcase"` badge so they are never mistaken for editorially approved AGI Futures blueprints).
- **Displaying Comments and Submissions on Both Surfaces Without Duplicate Copies (`PROPOSED`)**:
  - Because `idea_seeds`, `idea_seed_comments`, `artifacts`, and `artifact_comments` are stored in AGI Futures' Supabase Postgres with stable UUIDs, the habitat should read and write them through AGI Futures' versioned `/api/v1/*` endpoints (and/or receive signed webhook projections). Both surfaces render the same canonical record ID (`idea_seed.id`, `artifact.id`, `comment.id`) with a `source_surface: 'web' | 'habitat' | 'discord'` metadata field.

---

### 5. AI Functionality

#### Existing AI Services (`VERIFIED IN CODE`)
- **Founder Fit Matcher (`/match`)**:
  - **Files**: [`src/app/match/page.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/match/page.tsx), [`src/app/match/match-client.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/match/match-client.tsx), [`src/app/match/actions.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/match/actions.ts), [`src/lib/match/score.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/lib/match/score.ts), [`src/lib/match/gemini.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/lib/match/gemini.ts), [`src/lib/match/public.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/lib/match/public.ts).
  - **Model Provider**: Google Gemini REST API (`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`), model defaulting to `gemini-flash-latest` via `GEMINI_MODEL`, authenticated via `GEMINI_API_KEY` ([`src/lib/match/gemini.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/lib/match/gemini.ts#L28-L55)).
  - **Execution & Limits**: Non-streaming (`fetch` with `15000ms` `AbortController` timeout, `temperature: 0.5`, `responseMimeType: "application/json"`, and strict `responseSchema`). Rate-limited in [`src/app/match/actions.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/match/actions.ts#L19-L97) to **5 runs/day per salted IP SHA-256 hash** (`PER_IP_DAILY_CAP = 5`) and **500 runs/day globally** (`MATCH_DAILY_CAP = 500`) via the `bump_match_rate` Postgres RPC (falling back to an in-memory `Map` if the RPC is absent).
  - **Two-Stage Pipeline**:
    1. `runMatch(raw)` runs deterministic tag/role/capital/advantage scoring (`rankIdeas` in [`src/lib/match/score.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/lib/match/score.ts#L118-L132)) to shortlist 8 ideas, then prompts Gemini (`TOP3_SCHEMA`) to pick the top 3 slugs, assign a `fit` score (`60-97`), and write a 1-sentence `why`. Saves `{ id, inputs, top3 }` to the `matches` table.
    2. `unlockBrief(id, email)` is called after the user enters an email in `SubscribeCTA`. It prompts Gemini (`BRIEF_SCHEMA`) to generate a personalized execution plan (`headline`, `whyYou`, `first30Days` array of 4 steps, `firstExperiment`, `risks`, `whoToTalkTo`) for `top3[0]` and updates `matches.brief`, `matches.email`, and `matches.unlocked_at`.
- **No Existing AI Builder Guide Assistant (`VERIFIED IN CODE`)**:
  - There is **no** interactive chat assistant, RAG pipeline, or tool-calling agent in the repository today.
  - Furthermore, [`describeIdea(slug)`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/match/actions.ts#L103-L119) only feeds Gemini the short summary metadata from [`src/data/ideas.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/data/ideas.ts) (`title`, `scoreTitle`, `description`, `tags`, `impact`, `moat`, `difficulty`). It has no access to the deep blueprint sections (First Experiment, Why Now, Unit Economics, Prior Art, Citations) locked inside `src/app/<slug>/page-client.tsx`.

#### Epistemic Labeling for a Habitat AI Builder Guide (`PROPOSED`)
To support the Habitat AI Builder Guide while strictly distinguishing epistemic tiers, the structured blueprint export (`PROPOSED` in Section F) and AI prompt contract should partition every idea's context into four explicit provenance buckets:
1. **`published_facts`**: Verbatim citations (`ExpandableCitation` title + URL) and empirical statistics quoted in the blueprint or Problem Atlas.
2. **`editorial_judgments`**: The curated AGI Futures thesis (`description`, Problem, Why Now, Solution, Moat, Transferable Insight, Open Source Priority) and composite scores (`moat_score`, `difficulty_score`, `civilizational_impact_score`, `civilizational_impact_ratings`).
3. **`forecasts`**: Probabilistic valuation curves (`2030`, `2035`, `2040` thresholds, `expectedValuation2030/2035/2040`, `timeToUnicorn`, `aiRationale` from [`src/data/forecasts.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/data/forecasts.ts)) and live community forecasts (`forecasts` / `forecast_answers`).
4. **`generated_suggestions`**: Any personalized next steps, founder-fit rationales (`MatchBrief`), or conversational recommendations synthesized at runtime by Gemini for a specific visitor.

---

### 6. Accounts and Integration Authorization

#### Current Auth & Session Architecture (`VERIFIED IN CODE`)
- **Identity Provider**: Supabase Auth (`auth.users`), with public profile records in `public.profiles` where `profiles.id = auth.users.id`.
- **Sign-In Methods** ([`src/app/login/page.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/login/page.tsx#L18-L65)):
  - OAuth providers: `google`, `github`, `linkedin_oidc` via `supabase.auth.signInWithOAuth({ provider, options: { redirectTo: '${window.location.origin}/auth/callback' } })`.
  - Passwordless Email Magic Link via `@supabase/auth-ui-react` (`magic_link` view).
- **Session Transport**: First-party HTTP cookies managed by `@supabase/ssr` in [`src/utils/supabase/server.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/utils/supabase/server.ts) and refreshed on every request by [`src/middleware.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/middleware.ts).
- **Callback Routing** ([`src/app/auth/callback/route.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/auth/callback/route.ts#L6-L43)): Exchanges `?code=` for a session, checks if `profiles` has a `handle` for `user.id`, and redirects new users to `/onboarding` or returning users to `next` (only relative paths starting with `/` are allowed by `const next = rawNext.startsWith('/') ? rawNext : '/'`).
- **RLS Policies (`UNKNOWN` in live DB, inferred from code)**:
  - Most reads/writes use the anon-key client (`createClient()`), indicating RLS permits public `SELECT` on `projects`, `project_tags`, `profiles`, `artifacts`, `artifact_comments`, `artifact_likes`, `follows`, `idea_seeds`, `idea_seed_votes`, `idea_seed_comments`, `forecasts`, `forecast_answers`, `forecast_answer_votes`, `forecast_comments`, `forecast_comment_votes`, and `matches`, and authenticated `INSERT/UPDATE/DELETE` where `profile_id = auth.uid()`.
  - Only `subscribers`, `matches` writes, `bump_match_rate`, and `/api/upload` use `SUPABASE_SERVICE_ROLE_KEY` ([`src/utils/supabase/admin.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/utils/supabase/admin.ts)).

---

### 7. APIs, Synchronization, and Content Distribution

#### Existing Feeds, Sitemaps, and External Integrations (`VERIFIED IN CODE`)
- **Sitemaps & Robots**: [`src/app/sitemap.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/sitemap.ts#L1-L55) generates `/sitemap.xml` listing static routes, sector hubs, and all 33 canonical ideas. [`src/app/robots.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/robots.ts#L1-L18) disallows `/login`, `/onboarding`, `/auth/`, and `/api/`.
- **Newsletter / Substack Integration**: [`src/app/actions/subscribe.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/actions/subscribe.ts#L1-L57) upserts `{ email, source, page_path, idea_slug }` into the Supabase `subscribers` table (using `createAdminClient()`), while [`src/components/SubscribeCTA.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/components/SubscribeCTA.tsx#L53-L61) simultaneously submits a hidden HTML `<form action="https://agifutures.substack.com/api/v1/free?nojs=true" method="post" target="substack-subscribe-Sink">` in the browser. There is no inbound Substack RSS/API reader fetching newsletter posts back into the web app.
- **Social Publishing Scripts (Workspace Root, Offline Batch Tools)**: Outside the Next.js app directory, the workspace root contains offline Node/Python scripts ([`write_all_captions.js`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/write_all_captions.js), [`write_x_threads.py`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/write_x_threads.py), [`write_threads_posts.py`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/write_threads_posts.py), [`idea_numbers.json`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/idea_numbers.json)) that generate static 1080x1350 carousel slides and caption files for Instagram, Facebook, Threads, and X. None of these are wired to live social APIs.
- **Public vs. Private Material**:
  - **Publicly displayable**: Canonical startup blueprints (`ideas.ts`, `projects`, `project_tags`, `forecasts.ts`), Problem Atlas (`problem-atlas-data.ts`), public builder profiles (`profiles` excluding gated `provider_links.email`), public `artifacts` & `artifact_comments`, public `idea_seeds` & `idea_seed_comments`, and live `forecasts`.
  - **Private / Gated**:
    - `idea_notes`: Strictly private per-user notes ([`src/components/PrivateNotesSection.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/components/PrivateNotesSection.tsx)).
    - `messages`: Private direct messages between `sender_id` and `receiver_id` ([`src/app/builder/[handle]/inbox/page.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/builder/%5Bhandle%5D/inbox/page.tsx)).
    - `profiles.provider_links.email`: Gated by `contact_preference` (`'nobody' | 'following' | 'anyone'`).
    - `subscribers`: Internal newsletter subscriber list (`email`, `source`, `page_path`, `idea_slug`).
    - `matches.email` and `matches.inputs`: Founder Fit Matcher submissions (`matches.brief` is soft-gated behind email capture in [`src/app/match/actions.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/match/actions.ts#L196-L262), though `/match/[id]` is a shareable public URL if `id` is known).

---

### 8. Discord Integration

#### Current State (`VERIFIED IN CODE`)
- **None Exists**: There are zero Discord bots, webhook URLs, Discord OAuth providers, channel ID mappings, or Discord message tables in the AGI Futures repository (`VERIFIED IN CODE`).

#### Integration Assessment for Discord <-> Habitat <-> AGI Futures (`PROPOSED`)
1. **Outbound Idea Announcements & Explicit "Share to Habitat / Discord" Actions**:
   - Outbound-only notifications (e.g., when a new canonical blueprint is published, a high-signal Proof-of-Work artifact is marked `is_editors_pick`, or a user clicks `"Share to Discord"` in the habitat) can use standard Discord Incoming Webhooks (`POST https://discord.com/api/webhooks/{id}/{token}?wait=true`).
   - Passing `?wait=true` returns the created Discord `message.id` and `channel_id`, which must be stored in a `discord_message_links` table so subsequent edits or deletions on AGI Futures/Habitat can `PATCH` or `DELETE` the corresponding Discord message.
2. **Selected Two-Way Conversation Channels**:
   - **Important Constraint**: Ordinary Discord Incoming Webhooks are strictly one-way (outbound HTTP POST) and **do not emit incoming message events**.
   - Two-way channel synchronization (e.g., syncing a designated Discord forum/thread for an idea booth with habitat/website comments) requires a **Discord Bot Application** connecting via the **Discord Gateway (`MESSAGE_CREATE`, `MESSAGE_UPDATE`, `MESSAGE_DELETE`, `THREAD_CREATE` events with `MESSAGE_CONTENT` privileged intent)** and forwarding signed events to an AGI Futures/Habitat ingestion endpoint.
3. **Requirements for Two-Way Sync (`PROPOSED`)**:
   - **Attribution & Account Linking**: Discord users who have linked their Discord ID (`discord_user_id` verified via Discord OAuth2 `identify` scope) map to their `profiles.id`; unlinked Discord participants must either be prompted to link accounts before syncing or be represented with an explicit external author object (`author_source: 'discord'`, `discord_user_id`, `discord_display_name`) rather than spoofing an AGI Futures `profile_id`.
   - **Message ID Mapping & Threading**: Maintain a canonical `external_message_map` table (`internal_entity_type: 'idea_seed_comment' | 'artifact_comment' | 'habitat_chat'`, `internal_id`, `discord_channel_id`, `discord_thread_id`, `discord_message_id`, `origin_surface: 'web' | 'habitat' | 'discord'`).
   - **Loop Prevention**: Every message created by the webhook/bot must carry a bot/webhook `author.bot === true` flag and an `origin_event_id` metadata record. The Gateway listener must immediately drop any event where `author.id === BOT_ID`, `webhook_id === CHANNEL_WEBHOOK_ID`, or `discord_message_id` already exists in `external_message_map`.
   - **Edits, Deletions, & Retries**: Propagate `MESSAGE_UPDATE` and `MESSAGE_DELETE` via `discord_message_id` lookup; handle Discord `429 Too Many Requests` using the `X-RateLimit-Reset-After` header with exponential backoff and a dead-letter outbox table.

---

## C. Existing Integration Surface Table

All entries below are **`VERIFIED IN CODE`**.

| Surface Type | Method / Path or Identifier | File & Symbol Citation | Authentication | Input | Output | Errors & Authorization |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **HTTP Route Handler** | `POST /api/upload` | [`src/app/api/upload/route.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/api/upload/route.ts#L6-L46) (`POST`) | **None enforced** (uses `SUPABASE_SERVICE_ROLE_KEY` directly - **security risk**) | `multipart/form-data` with `file: File` | `{ url: string }` (public URL in `artifact_media` bucket) | `400` (`No file provided`), `500` (`Server configuration missing` or upload error). No auth, MIME, or size check. |
| **HTTP Route Handler** | `GET /auth/callback` | [`src/app/auth/callback/route.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/auth/callback/route.ts#L6-L43) (`GET`) | OAuth/Magic-Link PKCE `?code=` query param | Query params: `code`, `next` (optional relative path) | `302 Redirect` to `/onboarding` (if `profiles.handle` missing) or `next` | Redirects to `/login?error=Could not authenticate user` if `code` invalid. Restricts `next` to `/` prefix. |
| **Dynamic Image Route** | `GET /<slug>/opengraph-image` (and `/twitter-image`) | [`src/lib/og/render.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/lib/og/render.tsx#L37-L76) (`renderIdeaOg`) | Public | Route path `<slug>` (33 canonical ideas) | `image/png` (`1200x630` branded share card) | Public read. |
| **Metadata Feed** | `GET /sitemap.xml` & `GET /robots.txt` | [`src/app/sitemap.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/sitemap.ts#L6-L54), [`src/app/robots.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/robots.ts#L4-L17) | Public | None | XML sitemap / Robots rules | Public read. Note: `robots.txt` disallows `/api/`. |
| **Server Action** | `subscribe(input)` | [`src/app/actions/subscribe.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/actions/subscribe.ts#L19-L56) | Public (uses `createAdminClient()`) | `{ email, source, pagePath?, ideaSlug? }` | `{ ok: boolean, error?: string }` | Validates email regex; upserts `subscribers` on `email`. |
| **Server Action** | `getIdeaSeeds()` | [`src/app/Idea-Seeds/actions.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/Idea-Seeds/actions.ts#L29-L65) | Public (reads current user if logged in to mark `user_votes`) | None | `IdeaSeed[]` with `profile`, `votes` counts, `user_votes`, `comment_count` | Returns `[]` on error. |
| **Server Action** | `submitIdeaSeed(formData)` | [`src/app/Idea-Seeds/actions.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/Idea-Seeds/actions.ts#L67-L119) | Supabase cookie session (`auth.getUser()`) | `FormData`: `descriptor`, `one_liner`, `problem`, `solution_hypothesis`, `custom_sections` (JSON string) | Redirects to `/Idea-Seeds` or returns `{ error: string }` | Requires authenticated user; inserts with `profile_id: user.id`. |
| **Server Action** | `deleteIdeaSeed(id)` | [`src/app/Idea-Seeds/actions.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/Idea-Seeds/actions.ts#L121-L139) | Supabase cookie session (`auth.getUser()`) | `id: string` (UUID) | `{ success?: boolean, error?: string }` | Enforces `.eq('id', id).eq('profile_id', user.id)`. |
| **Server Action** | `upvoteIdeaSeed(seedId, voteType)` | [`src/app/Idea-Seeds/actions.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/Idea-Seeds/actions.ts#L141-L180) | Supabase cookie session (`auth.getUser()`) | `seedId: string`, `voteType: VoteType` | `{ action?: 'added' \| 'removed', error?: string }` | Toggles row in `idea_seed_votes` for `profile_id: user.id`. |
| **Server Action** | `getIdeaSeed(idOrSlug)` | [`src/app/Idea-Seeds/[id]/actions.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/Idea-Seeds/%5Bid%5D/actions.ts#L7-L50) | Public (reads `auth.getUser()` for `user_votes`) | `idOrSlug: string` (UUID or slug) | `IdeaSeed \| null` | Public read. |
| **Server Action** | `getIdeaSeedComments(seedId)` | [`src/app/Idea-Seeds/[id]/actions.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/Idea-Seeds/%5Bid%5D/actions.ts#L52-L71) | Public | `seedId: string` (UUID) | `IdeaSeedComment[]` ordered ascending by `created_at` | Public read. |
| **Server Action** | `addSeedComment(seedId, content, parentId)` | [`src/app/Idea-Seeds/[id]/actions.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/Idea-Seeds/%5Bid%5D/actions.ts#L73-L107) | Supabase cookie session (`auth.getUser()`) | `seedId`, `content`, `parentId: string \| null` | `{ success?: boolean, error?: string }` | Requires authenticated user; inserts `idea_seed_comments`. |
| **Server Action** | `runMatch(raw)` | [`src/app/match/actions.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/match/actions.ts#L121-L194) | Public (IP rate-limited via `bump_match_rate` RPC) | `MatchInputs`: `{ roles, experience, capital, commitment, sectors, advantage }` | `{ ok: true, id, top3 }` or `{ ok: false, error }` | Rate limit: 5/day per IP hash, 500/day global. Writes `matches` via `createAdminClient()`. |
| **Server Action** | `unlockBrief(id, email)` | [`src/app/match/actions.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/match/actions.ts#L196-L262) | Public (requires valid `matches.id` UUID + email) | `id: string` (UUID), `email: string` | `{ ok: true, brief: MatchBrief }` or `{ ok: false, error }` | Validates UUID & email regex; calls `subscribe()`; updates `matches` via `createAdminClient()`. |
| **Supabase RPC** | `bump_match_rate` | [`src/app/match/actions.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/match/actions.ts#L76-L80) | Service role (`createAdminClient()`) | `{ p_ip_hash, p_ip_cap, p_global_cap }` | `boolean` (`true` if allowed, `false` if capped) | Called internally by `runMatch`. |
| **Supabase RPC** | `rate_forecast_importance` | [`src/app/forecasts/components/ForecastCard.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/forecasts/components/ForecastCard.tsx#L49-L53) | Public anon client (`createClient()`) | `{ f_id, session_key, new_rating }` | Void / error | Uses browser `localStorage.getItem("agi_anon_sess")` as `session_key`. |
| **Supabase Realtime** | `postgres_changes` on `public.saved_ideas` | [`src/components/InterestProvider.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/components/InterestProvider.tsx#L88-L115) | Authenticated browser client | `filter: profile_id=eq.${user.id}` | Live insert/delete sync for bookmarked ideas | Scoped to current user's `profile_id`. |

---

## D. Relevant Schemas and Representative Idea/Submission Payloads

### 1. Reconstructed Supabase Database Schema (`VERIFIED IN CODE` for columns queried/written; `UNKNOWN` for live DB constraints/RLS)

#### Table 1: `projects`
Referenced in [`src/app/page.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/page.tsx#L16-L18), [`seed_tags.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/seed_tags.ts#L878-L886), [`src/scripts/seed_problems.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/scripts/seed_problems.ts#L25-L30), [`src/components/InterestProvider.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/components/InterestProvider.tsx#L38).
- `id`: `uuid` (PK)
- `slug`: `text` (UNIQUE - stores both the 33 canonical startup slugs and the 55 Problem Atlas slugs)
- `name`: `text`
- `created_at`: `timestamptz`
- `moat_score`: `jsonb` (`{ "ai_scored": number }`) or `numeric`
- `difficulty_score`: `jsonb` (`{ "ai_scored": number }`) or `numeric`
- `civilizational_impact_score`: `jsonb` (`{ "ai_scored": number }`) or `numeric`
- `civilizational_impact_ratings`: `jsonb` (`Record<string, { ai_scored: number } | number>`)

#### Table 2: `project_tags`
Referenced in [`seed_tags.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/seed_tags.ts#L896-L908), [`src/app/page.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/page.tsx#L18).
- `project_id`: `uuid` (UNIQUE FK -> `projects.id`)
- `sector`: `text[]`
- `bottleneck`: `text[]`
- `readiness`: `text[]`
- `customer`: `text[]`
- `outcomes`: `text[]`
- `product_type`: `text[]`
- `enabling_technology`: `text[]`
- `founder_fit`: `text[]`

#### Table 3: `profiles`
Referenced in [`src/app/onboarding/page-client.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/onboarding/page-client.tsx#L140-L163), [`src/app/builder/[handle]/page.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/builder/%5Bhandle%5D/page.tsx#L17-L22), [`src/app/forecasts/live/[slug]/page.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/forecasts/live/%5Bslug%5D/page.tsx#L18-L23).
- `id`: `uuid` (PK, FK -> `auth.users.id`)
- `handle`: `text` (UNIQUE, lowercase alphanumeric + `_-`)
- `name`: `text`
- `avatar_url`: `text | null`
- `headline`: `text | null`
- `thesis`: `text | null`
- `builder_status`: `text[]`
- `goals`: `text[]`
- `sectors`: `text[]`
- `outcomes`: `text[]`
- `frontier_tech_familiarity`: `jsonb` (`Record<string, 'Novice' | 'Proficient' | 'Expert'>`)
- `top_skills`: `text[]`
- `open_to`: `text[]`
- `provider_links`: `jsonb` (`{ email?, x?, github?, linkedin?, website?, portfolio?, substack?, huggingface? }`)
- `contact_preference`: `text` (`'nobody' | 'following' | 'anyone'`)
- `message_preference`: `text` (`'nobody' | 'following' | 'anyone'`)
- `newsletter_opt_in`: `boolean`
- `is_premium`: `boolean` (queried in `forecasts` thesis sorting)
- `updated_at`: `timestamptz`

#### Table 4: `idea_seeds`
Referenced in [`src/app/Idea-Seeds/actions.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/Idea-Seeds/actions.ts#L8-L24).
- `id`: `uuid` (PK)
- `slug`: `text` (UNIQUE)
- `profile_id`: `uuid` (FK -> `profiles.id`)
- `descriptor`: `text`
- `one_liner`: `text`
- `problem`: `text`
- `solution_hypothesis`: `text`
- `custom_sections`: `jsonb` (`Array<{ type: string, title: string, content: string }>`)
- `created_at`: `timestamptz`
- `updated_at`: `timestamptz`

#### Table 5: `idea_seed_votes`
Referenced in [`src/app/Idea-Seeds/actions.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/Idea-Seeds/actions.ts#L141-L180).
- `id`: `uuid` (PK)
- `idea_seed_id`: `uuid` (FK -> `idea_seeds.id`)
- `profile_id`: `uuid` (FK -> `profiles.id`)
- `vote_type`: `text` (`'world_needs_this' | 'id_build_this' | 'id_fund_this' | 'id_use_this' | 'keep_me_updated'`)

#### Table 6: `idea_seed_comments`
Referenced in [`src/app/Idea-Seeds/[id]/actions.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/Idea-Seeds/%5Bid%5D/actions.ts#L52-L107).
- `id`: `uuid` (PK)
- `idea_seed_id`: `uuid` (FK -> `idea_seeds.id`)
- `profile_id`: `uuid` (FK -> `profiles.id`)
- `parent_id`: `uuid | null` (self-FK -> `idea_seed_comments.id`)
- `content`: `text`
- `created_at`: `timestamptz`

#### Table 7: `artifacts`
Referenced in [`src/components/ArtifactSection.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/components/ArtifactSection.tsx#L61-L70), [`src/components/SubmitArtifactModal.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/components/SubmitArtifactModal.tsx#L91-L148), [`src/app/artifact/[id]/page.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/artifact/%5Bid%5D/page.tsx#L17-L38).
- `id`: `uuid` (PK)
- `slug`: `text` (UNIQUE, generated as `${slugifiedTitle}-${6-char random}`)
- `project_id`: `uuid` (FK -> `projects.id`)
- `profile_id`: `uuid` (FK -> `profiles.id`)
- `type`: `text` (`'core repo' | 'technical spec' | 'prototype' | 'demo' | 'design concept' | 'design extension' | 'wedge strategy' | 'gtm thesis' | 'market insight' | 'founder memo' | 'policy angle' | 'tagline set' | 'product thesis'`)
- `title`: `text`
- `summary`: `text`
- `content_url`: `text | null`
- `media_urls`: `text[]` (each element is a JSON-stringified `{ "url": string, "tag": string }`)
- `likes`: `integer`
- `is_editors_pick`: `boolean`
- `created_at`: `timestamptz`
- `updated_at`: `timestamptz | null`

#### Table 8: `artifact_likes`
Referenced in [`src/components/ArtifactSection.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/components/ArtifactSection.tsx#L77-L80).
- `artifact_id`: `uuid` (FK -> `artifacts.id`)
- `profile_id`: `uuid` (FK -> `profiles.id`)

#### Table 9: `artifact_comments`
Referenced in [`src/components/ArtifactSection.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/components/ArtifactSection.tsx#L155-L212).
- `id`: `uuid` (PK)
- `artifact_id`: `uuid` (FK -> `artifacts.id`)
- `profile_id`: `uuid` (FK -> `profiles.id`)
- `parent_id`: `uuid | null` (self-FK -> `artifact_comments.id`)
- `content`: `text`
- `media_urls`: `text[]` (array of JSON-stringified `{ "url": string, "tag": "note" }`)
- `created_at`: `timestamptz`

#### Tables 10-17: Social, Matching, Subscriptions, and Live Forecasting
- **`saved_ideas`** ([`InterestProvider.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/components/InterestProvider.tsx)): `project_id` (`uuid`), `profile_id` (`uuid`), `created_at` (`timestamptz`).
- **`idea_notes`** ([`PrivateNotesSection.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/components/PrivateNotesSection.tsx)): `project_id` (`uuid`), `profile_id` (`uuid`), `content` (`text`), `updated_at` (`timestamptz`).
- **`follows`** ([`builder/[handle]/page-client.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/builder/%5Bhandle%5D/page-client.tsx)): `follower_id` (`uuid`), `following_id` (`uuid`), `created_at` (`timestamptz`).
- **`messages`** ([`SendMessageModal.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/components/SendMessageModal.tsx)): `id` (`uuid`), `sender_id` (`uuid`), `receiver_id` (`uuid`), `content` (`text`), `created_at` (`timestamptz`).
- **`subscribers`** ([`src/app/actions/subscribe.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/actions/subscribe.ts)): `email` (`text`, UNIQUE), `source` (`text`), `page_path` (`text | null`), `idea_slug` (`text | null`).
- **`matches`** ([`src/app/match/actions.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/match/actions.ts)): `id` (`uuid`), `inputs` (`jsonb`), `top3` (`jsonb`), `brief` (`jsonb | null`), `email` (`text | null`), `unlocked_at` (`timestamptz | null`), `created_at` (`timestamptz`).
- **`forecasts`, `forecast_answers`, `forecast_answer_votes`, `forecast_comments`, `forecast_comment_votes`** ([`src/types/forecasting.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/types/forecasting.ts), [`ForecastHubClient.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/forecasts/components/ForecastHubClient.tsx), [`DiscussionThread.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/forecasts/components/DiscussionThread.tsx)). Note: [`src/types/forecasting.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/types/forecasting.ts#L42-L47) defines `ForecastVote` (`target_type: 'forecast' | 'answer' | 'comment'`), whereas the actual UI components query separate tables `forecast_answer_votes` (`answer_id`, `profile_id`) and `forecast_comment_votes`.

---

### 2. Representative Payloads (Public & Synthetic Data, `VERIFIED IN CODE`)

#### Representative Canonical Idea Record (Merged `ideas.ts` + `projects` + `project_tags` + `forecasts.ts`)
Based on [`src/app/page.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/page.tsx#L26-L64), [`src/data/ideas.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/data/ideas.ts#L430-L442), and [`src/data/forecasts.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/data/forecasts.ts):
```json
{
  "id": "e7f2b4a0-91c4-4e1a-8f52-0c3d9b8a1101",
  "slug": "commonground",
  "title": "CommonGround AI",
  "scoreTitle": "Bilateral Deal & Alignment Engine",
  "description": "High-stakes negotiations fail because parties hide their true priorities. CommonGround acts as a confidential AI mediator that discovers Pareto-optimal deals neither side could find alone.",
  "canonicalUrl": "https://www.agifutures.org/commonground",
  "href": "/commonground",
  "ogImageUrl": "https://www.agifutures.org/commonground/opengraph-image",
  "themeColor": "hover:border-indigo-500/50 text-indigo-400",
  "hoverTextColor": "group-hover:text-indigo-400",
  "created_at": "2026-04-26T16:50:56-06:00",
  "moat_score": 84,
  "difficulty_score": 72,
  "civilizational_impact_score": 90,
  "civilizational_impact_ratings": {
    "Social Trust": 94,
    "Better Governance": 90,
    "Abundance": 86
  },
  "tags": {
    "sector": ["AI", "Governance", "Finance"],
    "bottleneck": ["Trust", "Coordination"],
    "readiness": ["Build Now"],
    "customer": ["Founders", "Enterprises"],
    "outcomes": ["Social Trust", "Better Governance", "Abundance"],
    "product_type": ["Coordination Infrastructure", "Platform"],
    "enabling_technology": ["Large Language Models", "Knowledge Graphs", "Simulations"],
    "founder_fit": ["Technical Founder", "Operator-Led"]
  },
  "forecast": {
    "expectedValuation2030": 412500000,
    "expectedValuation2035": 2850000000,
    "expectedValuation2040": 9400000000,
    "timeToUnicorn": 5.4,
    "curves": {
      "2030-01-01": {
        "probabilities": {
          "10000000": 68,
          "100000000": 34,
          "1000000000": 11,
          "10000000000": 2,
          "100000000000": 0.2,
          "1000000000000": 0.02
        }
      }
    }
  },
  "license": "CC BY-NC-SA 4.0"
}
```

#### Representative Community Idea Submission (`IdeaSeed` Record, Synthetic)
Based on [`src/app/Idea-Seeds/actions.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/Idea-Seeds/actions.ts#L8-L24):
```json
{
  "id": "a18c9e24-5b31-4d8e-9a12-77f0c2e9b300",
  "slug": "orbital-bioreactor-twin-k9x2",
  "profile_id": "d4b0f112-8c77-4a39-b901-33e5f8120099",
  "descriptor": "Orbital Bioreactor Digital Twin",
  "one_liner": "Closed-loop simulation and telemetry control for microgravity protein crystallization and bioreactor yields.",
  "problem": "Wet-lab payloads in low-Earth orbit suffer from delayed ground-loop adjustments and unmodeled fluid shear anomalies.",
  "solution_hypothesis": "Pair multimodal camera telemetry with a physics-informed neural surrogate model to tune nutrient feed rates autonomously in orbit.",
  "custom_sections": [
    {
      "type": "first_experiment",
      "title": "First Falsifiable Experiment",
      "content": "Benchmark surrogate model predictions against 50 historical ISS crystallization runs before flight hardware integration."
    }
  ],
  "created_at": "2026-10-28T16:00:00Z",
  "updated_at": "2026-10-28T16:00:00Z",
  "profile": {
    "name": "Ada Lovelace (Synthetic)",
    "handle": "ada_orbital",
    "avatar_url": null
  },
  "votes": {
    "world_needs_this": 14,
    "id_build_this": 3,
    "id_fund_this": 2,
    "id_use_this": 6,
    "keep_me_updated": 9
  },
  "user_votes": ["world_needs_this", "keep_me_updated"],
  "comment_count": 4
}
```

#### Representative Proof-of-Work Contribution (`artifacts` Record, Synthetic)
Based on [`src/components/ArtifactSection.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/components/ArtifactSection.tsx#L61-L70) and [`src/components/SubmitArtifactModal.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/components/SubmitArtifactModal.tsx#L103-L115):
```json
{
  "id": "c93e1042-71a0-4c92-8e15-1102a4b90011",
  "slug": "confidential-pareto-solver-prototype-8f2a9c",
  "project_id": "e7f2b4a0-91c4-4e1a-8f52-0c3d9b8a1101",
  "profile_id": "d4b0f112-8c77-4a39-b901-33e5f8120099",
  "type": "prototype",
  "title": "Confidential Pareto Solver Prototype",
  "summary": "Open-source TypeScript implementation of multi-issue utility elicitation with zero-knowledge weight commitments.",
  "content_url": "https://github.com/example/commonground-pareto-poc",
  "media_urls": [
    "{\"url\":\"https://example.supabase.co/storage/v1/object/public/artifact_media/uploads/1792850000-01.png\",\"tag\":\"prototype\"}"
  ],
  "likes": 8,
  "is_editors_pick": true,
  "created_at": "2026-10-28T15:30:00Z",
  "updated_at": null
}
```

---

## E. Recommended Account-Linking, Permissions, and Canonical Data Ownership

### 1. Secure Account Linking Between Habitat and AGI Futures (`PROPOSED`)
Because the HyperAbundance habitat will have its own repository, Vercel deployment, and likely its own Supabase project, **matching email addresses across the two Supabase instances must NEVER be treated as proof of account ownership** (e.g., an unverified email or an OAuth provider with mutable email claims could allow account takeover).

Instead, implement an **Explicit OAuth2/PKCE-Style Account Linking Handshake**:
1. **Initiation (Habitat -> AGI Futures)**:
   - An authenticated habitat user (`habitat_user_id`) clicks `"Connect AGI Futures Builder Profile"`.
   - The habitat backend generates a cryptographically random `state` nonce, stores `{ state, habitat_user_id, code_challenge, expires_at }` (5-minute TTL), and redirects the user's browser to:
     `https://www.agifutures.org/auth/link-habitat?state=<state>&code_challenge=<S256_challenge>&redirect_uri=https://habitat.example.com/api/auth/agifutures/callback`
2. **Consent & Authentication on AGI Futures**:
   - If not signed in on `agifutures.org`, the user signs in via `/login` (`next=/auth/link-habitat?...`).
   - AGI Futures displays an explicit consent screen showing the user's AGI Futures `@handle` (`profiles.id`) and asking to authorize linking with their HyperAbundance Habitat account.
   - Upon approval, AGI Futures inserts a single-use authorization code (`ttl = 60 seconds`) into an `integration_auth_codes` table (`code_hash`, `agif_profile_id`, `code_challenge`, `expires_at`, `used_at`) and redirects back to `redirect_uri?code=<code>&state=<state>`.
3. **Server-to-Server Token Exchange (Habitat Backend -> AGI Futures API)**:
   - The habitat backend verifies `state`, then calls `POST https://www.agifutures.org/api/v1/integration/account-links/exchange` with:
     - `Authorization: Bearer <HABITAT_INTEGRATION_SECRET>` (plus `X-AGIF-Signature` HMAC-SHA256)
     - `{ code, code_verifier, habitat_user_id }`
   - AGI Futures verifies `SHA256(code_verifier) === code_challenge`, marks the code used, creates an active record in `account_links` (`id`, `agif_profile_id`, `habitat_user_id`, `scopes`, `linked_at`, `revoked_at: null`), and returns `{ link_id, agif_profile_id, handle, scopes, link_token }`.

### 2. Public Browsing vs. Authenticated Actions & Revocation (`PROPOSED`)
- **Public Browsing (No Account Link Required)**:
  - Anyone in the habitat can walk through the AGI Futures wing, inspect all 33 startup booths, view Problem Atlas bottlenecks, read public `idea_seeds` and `artifacts`, and query the AI Builder Guide.
- **Authenticated Write Actions (Account Link Required)**:
  - Submitting an Idea Seed (`POST /api/v1/idea-seeds`), voting (`POST /api/v1/idea-seeds/:id/votes`), posting a Proof-of-Work `artifact` (`POST /api/v1/projects/:slug/artifacts`), commenting, or publishing an idea-linked `"building / looking_for / can_help"` intent from the habitat requires an active, non-revoked `account_links` entry mapping `habitat_user_id -> agif_profile_id`.
- **Revocation & Deletion Behavior**:
  - Either side can call `DELETE /api/v1/integration/account-links/:link_id` (or unlink in UI settings), which sets `revoked_at = now()`.
  - Revoking a link immediately blocks future habitat-originated writes under that `agif_profile_id` while preserving historical public contributions (`artifacts`, `idea_seeds`, comments) on AGI Futures unless the author explicitly deletes those records.
  - If a user deletes their AGI Futures account/profile, AGI Futures emits an `account.deleted` webhook to the habitat so the habitat purges the link and anonymizes cached profile references.

### 3. Canonical Data Ownership Matrix (`PROPOSED`)
| Domain Entity | Authoritative System | Display & Sync Pattern | Editorial Badge / Trust Tier |
| :--- | :--- | :--- | :--- |
| **33 Startup Blueprints (`ideas.ts`, `projects`, `project_tags`, `forecasts.ts`)** | **AGI Futures** | Habitat reads via `GET /api/v1/ideas` & `GET /api/v1/ideas/:slug` + webhook cache invalidation. | `editorially_approved_blueprint` |
| **55 Problem Atlas Bottlenecks (`problem-atlas-data.ts`)** | **AGI Futures** | Habitat reads via `GET /api/v1/problems`. | `editorial_problem_atlas` |
| **Community Idea Submissions (`idea_seeds`, `idea_seed_votes`, `idea_seed_comments`)** | **AGI Futures** | Submitted from web or habitat (`POST /api/v1/idea-seeds`); stored once in AGI Futures; rendered in both `/Idea-Seeds` and the Habitat Seed Nursery. | `community_idea_seed` (`status: pending_review \| published`) |
| **Proof-of-Work Contributions (`artifacts`, `artifact_likes`, `artifact_comments`)** | **AGI Futures** | Attached to `projects.id`; created/read on both surfaces via `/api/v1/projects/:slug/artifacts`. | `community_proof_of_work` (or `editors_pick` if `is_editors_pick = true`) |
| **Idea-Linked Builder Intents (`building / looking_for / can_help` per idea)** | **AGI Futures** | Stored in proposed `project_builder_intents` table on AGI Futures so web blueprint pages and habitat booths show the same active builders. | `verified_builder_intent` |
| **Habitat Company Showcases & Spatial Booths** | **HyperAbundance Habitat** | Stored in Habitat DB; may reference `inspired_by_idea_slug`. Never written into AGI Futures `projects`. | `member_company_showcase` (explicitly non-editorial) |
| **Atrium Pods, Focus Sessions, Spatial Presence, Local Pod Chat** | **HyperAbundance Habitat** | Stored exclusively in Habitat DB / Realtime channels. | `habitat_ephemeral` |

---

## F. Proposed Minimal Integration Contract (`PROPOSED`)

All endpoints, database tables, and webhook contracts in this section **do not exist yet** (`VERIFIED IN CODE`) and are **`PROPOSED`** as the minimal integration specification.

### 1. Authentication & Security Headers (`PROPOSED`)
- **Read Endpoints (`GET /api/v1/*`)**: Publicly readable with CORS allowlist for the habitat origin (`https://habitat.agifutures.org` / preview URLs) and `Cache-Control: public, s-maxage=300, stale-while-revalidate=600`, or authenticated with `Authorization: Bearer <HABITAT_INTEGRATION_READ_TOKEN>` for higher rate limits.
- **Write & Account-Link Endpoints (`POST/PATCH/DELETE /api/v1/*`)**:
  - Require server-to-server authentication from the Habitat backend using:
    - `Authorization: Bearer <HABITAT_INTEGRATION_SECRET>`
    - `X-AGIF-Timestamp: <unix_epoch_seconds>` (reject if skew > 300s)
    - `X-AGIF-Signature: sha256=<HMAC_SHA256(secret, timestamp + "." + raw_body)>`
    - `Idempotency-Key: <uuid_v4>` (stored in `integration_idempotency_keys` for 24h to prevent duplicate submissions on network retries)
    - `X-AGIF-Linked-Profile-Id: <agif_profile_id>` + `X-AGIF-Habitat-User-Id: <habitat_user_id>` (verified against active `account_links`).

### 2. Proposed REST Endpoints on AGI Futures (`PROPOSED`)

| Method & Path (`PROPOSED`) | Purpose | Request Body / Params | Response Shape (`200` / `201`) |
| :--- | :--- | :--- | :--- |
| `GET /api/v1/ideas` | Paginated/complete feed of all 33 canonical blueprints, scores, tags, valuation summaries, and `content_hash`. | `?sector=&readiness=&updated_since=` | `{ version: "2026-10-28", ideas: CanonicalIdeaSummary[] }` |
| `GET /api/v1/ideas/:slug` | Full structured blueprint for a single canonical idea (including structured sections extracted from `page-client.tsx`, citations, interactive simulator config, valuation curves, and public `artifacts` count). | Path `:slug` | `{ idea: CanonicalIdeaDetail, epistemic_layers: { published_facts, editorial_judgments, forecasts } }` |
| `GET /api/v1/problems` | Structured feed of the 55 Problem Atlas bottlenecks (`problem-atlas-data.ts`). | `?sector=` | `{ problems: ProblemData[] }` |
| `GET /api/v1/idea-seeds` | List published community Idea Seeds (with vote counts and comment counts). | `?limit=50&cursor=&status=published` | `{ seeds: IdeaSeed[], next_cursor }` |
| `POST /api/v1/idea-seeds` | Submit a new Idea Seed from the habitat into the AGI Futures workflow. | `{ descriptor, one_liner, problem, solution_hypothesis, custom_sections, source_surface: "habitat", external_ref_id }` | `201 Created`: `{ id, slug, status: "pending_review" \| "published", canonical_url, editorial_approved: false }` |
| `PATCH /api/v1/idea-seeds/:id` | Allow linked author to edit or withdraw (`status: "withdrawn"`) their Idea Seed. | `{ descriptor?, one_liner?, problem?, solution_hypothesis?, status?: "withdrawn" }` | `{ id, slug, status, updated_at }` |
| `POST /api/v1/idea-seeds/:id/votes` | Toggle one of the 5 semantic votes (`world_needs_this`, `id_build_this`, `id_fund_this`, `id_use_this`, `keep_me_updated`). | `{ vote_type }` | `{ action: "added" \| "removed", votes }` |
| `GET /api/v1/ideas/:slug/contributions` | Fetch Proof-of-Work `artifacts`, `artifact_comments`, and active `project_builder_intents` (`building / looking_for / can_help`) for a booth. | `?type=&limit=20` | `{ artifacts: Artifact[], builder_intents: BuilderIntent[] }` |
| `POST /api/v1/ideas/:slug/artifacts` | Submit a Proof-of-Work artifact from the habitat. | `{ type, title, summary, content_url?, media_urls? }` | `201 Created`: `{ artifact: Artifact, canonical_url }` |
| `POST /api/v1/ideas/:slug/intents` | Upsert a per-idea `"building" \| "looking_for" \| "can_help"` status for the linked builder. | `{ intent_type, roles_needed?, skills_offered?, summary, showcase_url? }` | `{ intent: BuilderIntent }` |
| `POST /api/v1/ai/builder-guide` | Grounded AI Builder Guide query or Founder Fit match for a habitat visitor. | `{ mode: "explain_idea" \| "next_steps" \| "match", slug?, builder_context?, question? }` | `{ answer, epistemic_tier: "generated_suggestion", cited_facts: Citation[], recommended_actions: string[] }` |
| `POST /api/v1/integration/account-links/exchange` | Exchange single-use PKCE authorization code for a persistent `account_links` binding. | `{ code, code_verifier, habitat_user_id }` | `{ link_id, agif_profile_id, handle, profile_summary }` |
| `DELETE /api/v1/integration/account-links/:link_id` | Revoke an account link from either app. | Path `:link_id` | `{ revoked: true, revoked_at }` |

### 3. Signed Outbound Webhooks & Reconciliation (`PROPOSED`)
- **Events Emitted by AGI Futures (`POST <HABITAT_WEBHOOK_URL>`)**:
  - `idea.created`, `idea.updated`, `idea.unpublished`, `idea.deleted`
  - `idea_seed.created`, `idea_seed.status_changed`, `idea_seed.deleted`
  - `artifact.created`, `artifact.updated`, `artifact.deleted`
  - `comment.created`, `comment.deleted`
  - `builder_intent.upserted`, `builder_intent.deleted`
  - `account_link.revoked`, `account.deleted`
- **Webhook Envelope**:
  ```json
  {
    "event_id": "evt_01J8Z9K4M2N3P4Q5R6S7T8U9V0",
    "event_type": "idea.updated",
    "occurred_at": "2026-10-28T17:30:00Z",
    "entity_type": "canonical_idea",
    "entity_id": "commonground",
    "content_hash": "sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    "data": { "slug": "commonground", "canonical_url": "https://www.agifutures.org/commonground" }
  }
  ```
- **Delivery, Retries, & Periodic Reconciliation**:
  - Signed with `X-AGIF-Webhook-Signature: sha256=<HMAC>`.
  - Retried with exponential backoff (`10s`, `60s`, `5m`, `30m`, `2h`, `12h`) via a `webhook_outbox` table.
  - Because Vercel static deployments (`ideas.ts` / `forecasts.ts`) do not automatically fire Postgres triggers, a post-deploy build hook (`scripts/notify-habitat-deploy.ts`) compares each idea's `content_hash` and dispatches `idea.updated` events, while the habitat also runs a periodic reconciliation job (`GET /api/v1/ideas` every 15 minutes) comparing `content_hash`.

---

## G. Prioritized Changes in This Repository, Dependencies, Risks, and Testable Acceptance Criteria

> **Note**: In accordance with discovery rules, **none of the changes below have been applied during this audit**.

| Priority | Change in AGI Futures Repository | Dependencies | Key Risks Mitigated | Testable Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **P0 (Security Blocker)** | **Harden [`POST /api/upload`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/api/upload/route.ts) and Server-Side Profile Email Redaction ([`src/app/builder/[handle]/page.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/builder/%5Bhandle%5D/page.tsx))** | Supabase SSR auth (`createClient()`) | Prevents unauthenticated arbitrary file uploads to `artifact_media` via `SUPABASE_SERVICE_ROLE_KEY`; prevents leaking `provider_links.email` in RSC payload when `contact_preference !== 'anyone'`. | 1. Unauthenticated `POST /api/upload` returns `401`.<br>2. Files > 5 MB or non-`image/*` MIME types return `400`/`413`.<br>3. Inspecting HTML/RSC payload of `/builder/[handle]` for a user with `contact_preference: 'nobody'` contains no email string. |
| **P0 (Data Integrity)** | **Fix [`seed_tags.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/seed_tags.ts#L878-L886) and Check In Versioned SQL Migrations (`supabase/migrations/`)** | Access to live Supabase schema dump (`supabase db pull`) | Fixes missing `housegraph` row in `projects` and missing `scores` upsert in `seed_tags.ts`; eliminates schema drift between code and deployed DB. | 1. `projects` table contains all 33 canonical slugs from `src/data/ideas.ts` with non-null `id`, `moat_score`, `difficulty_score`, and `civilizational_impact_score`.<br>2. `supabase/migrations/` contains reproducible DDL and RLS policies. |
| **P1 (Core Read Integration)** | **Extract Structured Blueprint Content Manifest & Expose `GET /api/v1/ideas`, `GET /api/v1/ideas/:slug`, and `GET /api/v1/problems`** | [`src/data/ideas.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/data/ideas.ts), [`src/data/forecasts.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/data/forecasts.ts), [`src/data/problem-atlas-data.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/data/problem-atlas-data.ts) | Allows Habitat booths and the AI Builder Guide to render structured thesis sections, interactive widget schemas, citations, and public hero/OG image URLs without scraping JSX. | 1. `GET /api/v1/ideas` returns all 33 ideas with deterministic `content_hash`, scores, tags, and valuation summaries.<br>2. `GET /api/v1/ideas/:slug` returns structured `published_facts`, `editorial_judgments`, and `forecasts`.<br>3. Update [`src/app/robots.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/robots.ts) if public `/api/v1/ideas` should be crawlable. |
| **P1 (Submissions & Moderation)** | **Upgrade `idea_seeds` Workflow & Expose `POST/PATCH /api/v1/idea-seeds`** | Migration adding `status`, `source_surface`, `external_ref_id`, `content_hash`, `promoted_project_id` to `idea_seeds` | Prevents habitat or web submissions from bypassing moderation or being confused with canonical blueprints; blocks duplicate retries; allows authors to edit/withdraw seeds. | 1. Duplicate `POST /api/v1/idea-seeds` with same `Idempotency-Key` or identical `(profile_id, content_hash)` within 24h returns existing record instead of creating a duplicate.<br>2. Response explicitly includes `editorial_approved: false` and `status`.<br>3. Author can `PATCH` to edit or withdraw (`status: 'withdrawn'`). |
| **P1 (Account Linking)** | **Implement `/auth/link-habitat` UI + `POST /api/v1/integration/account-links/exchange` + `account_links` Table** | New `integration_auth_codes` and `account_links` tables in Supabase | Prevents insecure email-matching across separate Supabase projects; provides auditable, revocable cross-app authorization. | 1. Unlinked habitat user cannot write to `/api/v1/idea-seeds` or `/api/v1/ideas/:slug/artifacts` (`403`).<br>2. Completing PKCE code exchange creates an `account_links` row.<br>3. Calling `DELETE /api/v1/integration/account-links/:id` immediately revokes write access (`403`). |
| **P2 (Community & Matching)** | **Add `project_builder_intents` Table (`building / looking_for / can_help`) & Restore `<ArtifactSection>` Across All 33 Blueprint Pages** | `projects.id`, `profiles.id`, and audit of all 33 `src/app/<slug>/page-client.tsx` files | Enables shared per-idea builder matching and Proof-of-Work display across both website blueprint pages and habitat booths without duplicate copies. | 1. All 33 canonical blueprint pages render `<InterestedButton>` and `<ArtifactSection>`.<br>2. `GET /api/v1/ideas/:slug/contributions` returns both `artifacts` and `project_builder_intents` with canonical UUIDs. |
| **P2 (AI Builder Guide)** | **Build `POST /api/v1/ai/builder-guide` Using Structured Blueprint Manifest + [`src/lib/match/gemini.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/lib/match/gemini.ts)** | P1 Structured Blueprint Content Manifest + `GEMINI_API_KEY` | Gives the habitat an authoritative AI guide that grounds answers in actual blueprint sections and separates facts, editorial scores, forecasts, and generated advice. | 1. Endpoint returns structured JSON separating `cited_facts`, `editorial_summary`, `forecast_metrics`, and `generated_next_steps`.<br>2. Enforces per-user/IP rate limits via Supabase RPC. |
| **P3 (Webhooks & Discord)** | **Add `webhook_outbox` + `external_message_map` Tables for Habitat Sync and Optional Discord Bot Bridge** | `HABITAT_WEBHOOK_URL`, optional Discord Bot Application + Gateway worker | Guarantees eventual consistency for edits/deletions across AGI Futures, Habitat, and Discord while preventing infinite message loops. | 1. Deleting an `artifact` or `idea_seed_comment` emits a signed `*.deleted` event.<br>2. Messages with `origin_event_id` already present in `external_message_map` are ignored (`200 No-Op`). |

---

## H. Questions and Access Gaps That Cannot Be Resolved from Available Evidence

1. **Live Supabase DDL, RLS Policies, Triggers, and Indexes (`UNKNOWN`)**:
   - Because no `.sql` migration files exist in the repository (`VERIFIED IN CODE`), what are the exact deployed column types, `NOT NULL` constraints, `ON DELETE CASCADE` behaviors, and Row-Level Security policies on the 17 tables in the production Supabase project? Running `supabase db dump --schema public` or querying `pg_policies` and `information_schema.columns` against the live project is required before finalizing migration scripts.
2. **Definition of Existing Postgres RPCs (`bump_match_rate` and `rate_forecast_importance`) (`UNKNOWN`)**:
   - Both RPCs are called from TypeScript ([`src/app/match/actions.ts`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/match/actions.ts#L76) and [`src/app/forecasts/components/ForecastCard.tsx`](file:///Users/kylenmcclintock/Documents/AntiGravity%20Projects/AGI%20Futures%20-%20AntiGravity/AGI%20Futures%20Startup%20Ideas/src/app/forecasts/components/ForecastCard.tsx#L49)), but their SQL bodies and backing rate-limit/rating tables are not checked into git.
3. **Editorial Moderation Policy for Habitat-Originated "Idea Seeds" (`Product Decision Needed`)**:
   - Today on `agifutures.org`, submitting an Idea Seed publishes it immediately to `/Idea-Seeds` (`VERIFIED IN CODE`). Should Idea Seeds submitted from either the website or the habitat enter a `pending_review` queue before appearing publicly, or publish immediately to the `/Idea-Seeds` community tier with an explicit `"Unreviewed Community Seed"` badge while remaining strictly excluded from canonical blueprints (`projects`)?
4. **Separate vs. Shared Supabase Auth Instance (`Architecture Decision Needed`)**:
   - The prompt notes the habitat will *"likely [have] its own Supabase project."* If it uses a separate Supabase project, the OAuth/PKCE `account_links` handshake in Section E is required. However, if both Vercel deployments are placed on subdomains of `agifutures.org` (e.g., `www.agifutures.org` and `atrium.agifutures.org`) and configured to share the **same** Supabase Auth project (with habitat tables isolated in a dedicated Postgres schema `habitat.*`), users would enjoy seamless single sign-on (`auth.users.id === profiles.id`) with zero account-linking friction. Confirming whether a separate Supabase project is a hard requirement is the highest-leverage architectural decision before implementation.
5. **Discord Server Topology & Bot Hosting (`Product / Ops Decision Needed`)**:
   - Which Discord channels/forums are designated for one-way announcements versus two-way habitat/blueprint discussions, and where will the persistent Discord Gateway WebSocket listener run (since Vercel serverless functions cannot maintain a persistent outbound Discord Gateway WebSocket connection)?
