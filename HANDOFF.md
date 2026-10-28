# HyperAbundance — Community Space Atrium (`HANDOFF.md`)

A walkable 3D orbital co-working sanctuary, social hub, and builder club connecting the **Shared Orbital Atrium**, **6 Outward-Protruding Earthview Bubble Pods**, **2 Sunken Glass-Floor Lounges**, the **LEVL Longevity Lounge** ([mylevl.ai](https://www.mylevl.ai)), and the **AGI Futures Builder Club** ([agifutures.org](https://www.agifutures.org)).

---

## 1. Local Setup & Run Instructions

### Prerequisites
- **Node.js**: v20+ (tested on Node v24.11.1)
- **npm**: v10+

### Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Copy environment template (optional for local guest/demo mode)
cp .env.example .env.local

# 3. Start the development server
npm run dev

# 4. Production build & type check
npm run build
npm run start
```

Open `http://localhost:3000` in your browser.
- **First-Time Arrival**: You can experience the Space Elevator ascent, skip directly to the Central Atrium, jump straight to your saved Earthview Bubble Pod, or open the **2D Accessible Directory**.
- **3D Navigation**:
  - **Click any 3D pod, holographic booth, or room portal** to smoothly drift there along a zero-G camera spline.
  - **Click & drag** on the viewport to look around freely (cursor is never pointer-locked, so the HUD and drawers remain 1-click accessible).
  - **WASD / Arrow keys** allow optional free-float movement.
  - **Reduced Motion** toggle in the top bar (or OS `prefers-reduced-motion: reduce`) switches camera travel to instant cuts and freezes ambient orbital rotation.

---

## 2. Environment Variables (`.env.example` / `.env.local`)

The application is designed to run out-of-the-box with zero configuration using local persistence (`localStorage`) and the deterministic grounded AI resident engine. Supplying the variables below enables cloud persistence via Supabase and live conversational Gemini 2.5 Flash responses for signed-in Habitat Pass members:

| Variable | Required? | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional (Cloud Sync) | Your Supabase project URL (`https://<project-ref>.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional (Cloud Sync) | Your Supabase public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional (Server API) | Server-only service role key for administrative writes |
| `GEMINI_API_KEY` | Optional (Live AI) | Google Gemini API key (`gemini-2.5-flash`) unlocked when a visitor signs in |
| `NEXT_PUBLIC_LEVL_BASE_URL` | Optional | Defaults to `https://www.mylevl.ai` |
| `NEXT_PUBLIC_AGIFUTURES_BASE_URL` | Optional | Defaults to `https://www.agifutures.org` |

---

## 3. Database Schema & Migrations (Supabase)

The full PostgreSQL schema and Row-Level Security (RLS) policies live in:
- `supabase/migrations/0001_habitat_schema.sql`

### Tables Included
1. `habitat_profiles` — Visitor display name, default workspace pod, reduced-motion preference, and linked sister-platform flags.
2. `focus_sessions` — Timestamp-anchored focus blocks (`started_at`, `target_end_at`, `duration_minutes`, `intention`, `is_public`, `waypoint_id`).
3. `member_banners` — Asynchronous Member Matching Board cards (`building`, `looking_for`, `can_help_with`, `wing`, `linked_idea_slug`, `is_visible`).
4. `async_intros` — Non-intrusive asynchronous intro notes between builders.
5. `idea_seeds` — Community-planted startup seeds (kept visually distinct from canonical AGI Futures blueprints via `is_editorial_blueprint = false`).
6. `idea_contributions` — Structured builder notes, critiques, and milestone suggestions on startup ideas.
7. `protocol_drafts` — Explicitly saved LEVL Longevity Bar protocol drafts with mandatory non-medical disclaimer tracking.
8. `moderation_reports` — User block/report records for community safety.

### Applying the Migration
```bash
# Link your Supabase project
npx supabase link --project-ref <your-project-ref>

# Push the schema migration
npx supabase db push
```
Or paste the contents of `supabase/migrations/0001_habitat_schema.sql` directly into the Supabase SQL Editor and click **Run**.

---

## 4. Audio System, Procedural Web Audio DJ & Adding Custom Tracks

### How It Works
- **Zero-Cost Procedural Multi-Stem Engine**: `src/lib/audio/soundscapeEngine.ts` synthesizes warm orbital ambient pads, room-specific acoustic coloring (Atrium, Bubble Pods, LEVL Spa, AGI Futures Club, Botanical Conservatory), and gentle UI chimes in real time using the browser's native Web Audio API.
- **Independent Stems & Mute**: Separate gain controls for **DJ Music**, **Room Ambient**, and **UI Chimes**, plus a master mute button in the bottom HUD.
- **Automatic Video Ducking**: Opening and playing a talk on the **LEVL Research Screening Wall** (`src/components/panels/LevlScreeningModal.tsx`) calls `soundscapeEngine.setVideoScreeningActive(true)`, which automatically ducks the DJ music stem down so the speaker audio is clear and uncompeting.
- **Track Manifest & License Attribution**: `public/audio/tracks.json` lists the 4 DJ moods (*Deep Focus*, *Calm*, *Builder Flow*, *Night Horizon*) and their CC0 / Public Domain procedural synthesis attribution. To add external MP3/OGG streams in the future, add an `audioUrl` field to any entry in `public/audio/tracks.json`.

---

## 5. Updating LEVL & AGI Futures Curated Content

- **AGI Futures Catalog (`src/data/agifutures-catalog.ts`)**:
  - Contains all **33 canonical startup ideas** organized across the **6 Holographic Sector Booths** (`clinical-biotech`, `scientific-discovery`, `energy-climate`, `robotics-manufacturing`, `ai-infrastructure`, `abundance-society`).
  - Each idea defines `hologramArchetype` (`dna-helix`, `fusion-torus`, `neural-constellation`, `orbital-manufacturing`, `autonomous-lab`, `biome-dome`), deep link to `https://www.agifutures.org/ideas/[slug]`, and structured milestones.
  - Visitors can swipe between ideas inside a booth or switch sectors in place without moving their avatar.
- **LEVL Longevity Catalog (`src/data/levl-catalog.ts`)**:
  - Contains the 8 public longevity modalities across **Movement**, **Nutrition**, **Cognitive Focus**, and **Recovery**, PubMed evidence citations, the curated YouTube screening playlist, and `buildLevlDraftHandoffUrl()` which encodes protocol drafts to `https://www.mylevl.ai/my-protocol?draft=<base64url>`.
- **Station Briefing & Initial Member Matching Banners (`src/data/station-briefing.ts`)**:
  - Edit `STATION_BRIEFING_ITEMS` and `INITIAL_MEMBER_BANNERS` to update the daily station signal and seeded builder profiles.

---

## 6. AI Residents & Cost Guardrails

- **Guest Mode (Not Signed In)**: Handled deterministically by `src/lib/ai/deterministic-residents.ts` at **\$0 LLM cost**, grounded strictly in `agifutures-catalog.ts`, `levl-catalog.ts`, and `waypoint-registry.ts`.
- **Signed-In Habitat Pass Mode**: Calls `POST /api/ai/resident` (`src/app/api/ai/resident/route.ts`), which enforces:
  1. **Per-User Rate Limiting**: Max 25 requests per rolling hour per user ID.
  2. **Idempotency Deduplication**: Caches identical `(userId, residentId, prompt)` tuples for 10 minutes to prevent duplicate token spend.
  3. **Structured JSON Output**: Uses `gemini-2.5-flash` with `responseMimeType: "application/json"` and automatically falls back to the deterministic engine if `GEMINI_API_KEY` is not set.

---

## 7. Known Limitations & Milestone 3–4 Extension Points

- **Live Multiplayer Presence**: Currently uses seeded orbital focus presence indicators and asynchronous Member Matching banners. To enable real-time avatar co-presence in Milestone 3, subscribe to a Supabase Realtime Broadcast channel (`supabase.channel('orbital-atrium')`) in `AtriumExperienceClient.tsx`.
- **Cross-App OAuth / Webhook Sync**: Sister-platform account linking (`AuthAndLinksModal.tsx`) stores link state locally and prepares the payload contract described in the LEVL and AGI Futures discovery reports (`POST /api/webhooks/hyperabundance`).
