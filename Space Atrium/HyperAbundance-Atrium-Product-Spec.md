# HyperAbundance Community Space Atrium
## Product specification and Antigravity build brief

Version 1.0 • October 28, 2026 • Owner: Kylen McClintock

## 1. Build this experience

Create an immersive browser-based orbital habitat where ambitious, curious people come to do meaningful work, explore longevity and startup ideas, and find collaborators building an abundant future.

The habitat unites HyperAbundance’s worldview, AGI Futures’ ideas and builder community, and LEVL’s longevity guidance. It should feel like somewhere people want to spend an afternoon, with practical reasons to return. It must be valuable with zero other humans online.

The daily habit is opening the habitat while working in existing tools. Exploration and social interaction are available during breaks or as intentional activities. We are not building a replacement editor, operating system, or coding environment.

**Design principle:** Every beautiful destination should lead to a useful action. Every interaction should respect attention, privacy, and the visitor’s intention.

This document specifies outcomes and constraints. Choose implementation details pragmatically. Treat recommended defaults as defaults, not instructions to build unnecessary infrastructure. Preserve the experience even if individual effects need simpler implementation.

## 2. Audience, modes, and success

Initial audience: AI-native founders, builders, investors, researchers, writers, and longevity enthusiasts. People can participate in one wing without needing equal interest in every brand.

| Mode | User intention | Successful outcome |
| --- | --- | --- |
| Focus | Get something done | Complete a personally configured work session |
| Explore | Find useful ideas or guidance | Save an idea, understand research, or create a protocol draft |
| Connect | Find collaborators or help | Make a relevant introduction, contribute, or receive a useful response |

Measure repeat visits and completed useful actions, not maximum time spent. Track focus-session completion, return to saved workspace, idea exploration and contributions, authorized protocol saves, and meaningful connection activity. Do not collect private work content or health conversations for analytics.

An early pilot should establish whether people return voluntarily after the visual novelty fades. Define numerical launch targets after observing the pilot rather than inventing retention benchmarks now.

## 3. Non-negotiable decisions

- Separate new Antigravity project, repository, and Vercel deployment. Give habitat-specific data its own Supabase project unless a clearly justified alternative is agreed.
- Retain Vercel and Supabase. No cloud-hosted graphics rendering or Unreal Pixel Streaming.
- Render on the visitor’s device; offer the best fidelity it can sustain, with adaptive quality and a lightweight fallback.
- Default to first-person experience. Other people see the member’s avatar; seeing one’s own avatar is optional future functionality.
- Use destination-based travel, not continuous network broadcasting of movement.
- Anyone can explore without an account. Sign-in enables AI requests, social participation, server-saved workspaces, and cross-device persistence. Guests may try a local focus timer and music.
- AI residents are clearly and persistently identified as AI. Never fabricate human occupancy or community activity.
- Use the actual supplied LEVL and AGI Futures logos. Preserve their shapes and colors; use asset files as scene signage rather than recreating the lettering.
- LEVL owns its private health data and protocol logic. AGI Futures owns its ideas, submissions, and existing builder/contribution systems.
- Never require a visitor to navigate a corridor to perform a common action. Provide direct navigation as well as spatial exploration.

## 4. World and visual direction

### Shared atrium

An extraordinary sculptural orbital interior with branching structural ribs, graceful asymmetry, greenery, warm materials, and expansive glazing. Earth is realistic, immense, and visibly beneath the station: recognizable surface detail, clouds, atmosphere, and day/night lighting. Stars are secondary. Avoid extra fantasy planets, generic office floors, a shopping-mall layout, or overwhelming neon.

Earth motion should be subtle. A convincing shared visual is sufficient; live weather feeds or scientifically exact orbital simulation are not required. Avoid fast motion during work sessions.

The central volume supports zero-G travel. Seated workspaces, lounges, and spa areas remain visually stable. This is a designed virtual world; elaborate gravity simulation is unnecessary.

### Earthview work pods

Small convex glass bubbles protrude **outward through the exterior hull**. Their open circular entrances are flush with the atrium’s interior wall. They are not inward-hanging cylinders or conventional projecting balconies. Desks and occupants face outward toward Earth.

Place pods at different heights, including approximately 20–30 feet above the main deck. Visitors select a pod and drift into it, or travel instantly. Inside, the camera settles into a stable, beautiful work view.

### Sunken lounges

Recessed conversation areas with perimeter seating and **transparent floors inside the seating pits**, revealing Earth beneath visitors’ feet. Glass only around the outside of an opaque lounge does not satisfy this direction. Keep the view legible beneath tables and furniture.

### Distinct offshoot wings

LEVL and AGI Futures are separate rooms reached from the atrium, each with an unmistakable identity. They should not be branded counters occupying the shared commons.

| Space | Character and role |
| --- | --- |
| LEVL | Botanical luxury longevity lounge: ivory stone, jade/sage, warm timber, restrained brand gradient accents, protocol bar, spa and recovery spaces |
| AGI Futures | Optimistic inventor’s club: graphite, copper, walnut, green brand light, idea booths, collaborative tables, matching board, pitch area |
| Library/conservatory | Quiet reading, planning, and saved content among plants |
| Shared lounges | Optional public conversation and small gatherings |

The approved concept images guide atmosphere and geometry, not exact floor plans. Resolve their visual inconsistencies into one coherent navigable space. Do not promise still-image fidelity on every device.

### Arrival

Use a skippable space-elevator ascent as the recommended first arrival: clouds fall away, Earth opens below, the station comes into view. A rocket launch/docking arrival is a later alternative. Avoid implying a SpaceX affiliation.

Let entry occur as soon as the experience is ready. Never create artificial waiting to finish the cinematic. Returning users enter directly, preferably at their saved workspace. Include replay and reduced-motion options.

## 5. Primary user journeys

### A. First visit

Land on a concise introduction with Enter and a clear lightweight option. Allow immediate guest exploration. Offer the arrival sequence with a visible skip control. In the atrium, offer Focus, Explore, Connect, or free exploration. A labeled AI concierge can help; no forced tutorial or questionnaire.

Request sign-in at a useful boundary, such as saving a workspace or sending an AI question. Preserve the visitor’s selected destination and unfinished action through sign-in.

### B. Work alone

Select a pod or quiet seat → optionally state an intention → choose duration and audio → begin working in existing tools → return to complete, extend, or end the session.

Support a flexible timer and untimed work. Work intention is private unless deliberately shared. Timer state must survive tab changes, background throttling, refresh, and reconnect. Audio settings and preferred workspace should be easy to restore.

“Return to my workspace” restores the view, audio preferences, and unfinished session. It does not permanently reserve a scarce public seat. Private workspace instances or equivalent visual reuse are acceptable.

### C. Explore longevity

Enter LEVL → select a modality station or speak privately with the bartender → ask a sourced question → review suggested options → connect LEVL if needed → explicitly save a draft → open it in LEVL for review and activation.

Do not silently add activities to a live schedule during conversation. A failed integration must leave the draft recoverable and clearly indicate whether anything was saved.

### D. Explore and contribute to an idea

Enter an idea booth → see what it is and why it matters → explore its blueprint or ask the builder guide → save interest, contribute, or offer specific help.

Use actual AGI Futures titles and content, including examples such as Signal House, Main Street Legacy, HelioTerra, and BioWalls. These are examples, not a hardcoded permanent selection. All published ideas should be searchable; a curated subset can occupy physical booths at any one time.

### E. Find people asynchronously

Browse profiles and project needs → identify a useful match → leave an introduction, offer, or contribution → recipient sees it on return through the appropriate existing community system.

Do not make a visitor’s value depend on live attendance. Contributions and requests remain available after their authors leave.

## 6. Functional requirements by destination

### Focus spaces

Provide Earthview pods first; later extend the same focus behavior to library seats, greenhouse nooks, and paired work capsules. Include Focus/Available status, optional timer, personal audio, leave/return controls, and accessible text alternatives. Focus mode suppresses unsolicited interruptions and reduces scene motion.

### LEVL protocol bar and spa

The protocol bartender is a presentation of LEVL’s existing coach and builder, not a separately maintained medical agent. General mode uses approved public knowledge only. Connected personalization stays in a private session and requires explicit permissions.

Answers should expose source links when available, distinguish evidence strength and uncertainty, and avoid invented citations. Do not require a numeric dose or recommendation when the source material cannot justify one. Product mentions should be relevant and clearly identifiable; every answer must not become a sales pitch.

The full spa vision includes sauna, cold plunge, hyperbaric oxygen chambers, recovery seating, and botanical reading areas. Each station opens evidence, limitations, and relevant real-world protocols. It can optionally open a station-specific question with the bartender. Virtual use does not count as a real treatment, exposure, or protocol completion.

Keep the LEVL research-video area separate from ambient audio. Visitors can inspect what is playing, choose to watch/listen, and browse the previously featured playlist. Call scheduled prerecorded content a screening, not a live broadcast.

### AGI Futures gallery and builder space

Every booth offers an accessible content panel with title, thesis, existing imagery, canonical source link, and contribution actions. Holographic models are optional illustrations, never substitutes for readable content. Do not generate bespoke 3D assets for every idea as a launch prerequisite.

Reuse existing builder profiles, matching, Idea Seeds, artifacts, and comments where appropriate. Community Idea Seeds and founder/company showcases must be visually distinct from curated editorial blueprints.

The AI builder guide explains source ideas, identifies assumptions, proposes experiments, and surfaces relevant contributions. It must label its own suggestions separately from the published blueprint. A general conversational builder guide is new functionality, not an existing AGI Futures capability.

Include shared tables and a small presentation area. Live voice, screen-sharing, and synchronized pitch events are later extensions rather than first-release dependencies.

### Member banners and matching

Members can present: **Building / Looking for / Can help with**. Reuse relevant AGI Futures profile information after account connection; let members choose what is shown.

Keep banners compact, expandable on selection, and hideable. Publicly shared intentions and banners must be editable, reportable, and subject to reasonable length limits. Match through useful needs and contributions rather than noisy promotion or implied investment access.

### Briefing and content

Provide an engaging station briefing for recent newsletters, research, ideas, member progress, videos, and events. Every item has a source, date, and next action: read, save, visit booth, contribute, or attend. Link out where no authorized feed exists. Do not copy subscriber-only material without authorization or subscribe visitors to newsletters automatically.

## 7. Social presence, movement, and culture

Show honest human occupancy separately from AI residents. A quiet room should feel peaceful and useful, not falsely crowded.

Use a discrete seat/destination state. Recommended behavior: broadcast one arrival update; other clients animate the transition from the last known location. This animation is decorative and may occur slightly late. No continuous position updates, collision simulation, or server-driven walking animation are required. Reconnects use the latest state rather than replaying every movement.

Occupied shared seats should not double-book; private focus seats may use personal instances. Resolve abandoned seats after disconnect without deleting a user’s saved preference. Basic avatar choices are sufficient initially.

Community norms: optimistic, ambitious, generous, evidence-aware, and comfortable with constructive disagreement. AI hosts model this culture but must not manufacture endorsements, member posts, success stories, or activity. Add reporting, blocking, spam controls, and moderator removal before public social posting launches.

## 8. AI residents and audio

Initial roles: concierge, LEVL protocol bartender, AGI Futures builder guide, and DJ. These may share infrastructure, but each should have clear permissions and purpose. They do not need to infer continuously while idle.

Start with text interactions. Voice can follow. Provide per-user limits and a clear recovery state when AI service is unavailable. Do not duplicate tool effects when retrying a request.

The DJ selects from an approved catalog of owned or appropriately licensed audio. Default to personal listening, with mood requests such as deep focus, energetic, or calm. Playback continues between rooms where appropriate; an explicit user gesture enables sound. Offer independent music, ambient effects, and speech controls. Avoid competing audio when watching a video.

Use browser playback and caching. Do not run a permanent AI process or radio server for a playlist. Keep track attribution/license records. Free access to the habitat does not remove music-rights requirements.

Optional YouTube embeds must use a visible, compliant player with user controls; do not extract audio or use hidden background players. Ads and account behavior are controlled by the provider. Spotify can be an external personal-listening link; it is not the default shared soundtrack. Recheck provider requirements when implementing.

## 9. Integrations and data ownership

The supplied discovery reports are evidence about repository code, not proof of live deployment state. Their proposed routes and custom auth designs are optional proposals. Do not implement them wholesale without evaluating simpler secure alternatives.

| Owner | Authoritative data/capabilities | Habitat responsibility |
| --- | --- | --- |
| LEVL | Health profiles, coach/retrieval logic, protocol drafts, schedules | Private bartender UI, authorized requests, draft preview and LEVL handoff |
| AGI Futures | Canonical ideas, Idea Seeds, builder profiles, matching signals, idea contributions/comments | Spatial displays and alternate interaction surfaces |
| Habitat | Avatar, location, focus sessions, workspace preferences, room conversations | Operate community experience and integrations |
| Discord | Original Discord messages and identities | Authorized bridge copies with source attribution and mapping |

### LEVL integration

Reuse existing services behind a deliberately restricted integration interface. The audit reports unverified caller-supplied user IDs in coach routes, draft tools with scheduling side effects, and guest migration/deletion issues. Verify and address the relevant findings before exposing connected health access or mutations. Confirm deployed permissions rather than assuming migration files describe production.

Required outcomes: public-catalog guidance; explicitly authorized personalization; draft-only generation; explicit save; canonical app link; revocation; no accidental schedule activation. Keep raw health records and integration credentials out of public community storage, analytics, and Discord. Treat any private conversation content as sensitive even if the interface is inside a public-looking room.

Prefer an opaque draft ID for handoff rather than health details in URL parameters. Confirm the actual production domain and signed-out/mobile behavior before launch. Existing import links are a useful starting point, not proof that every guest-to-account case works.

### AGI Futures integration

Expose existing structured summaries through a stable feed or equivalent service. Full blueprint text currently resides in page code; create a structured representation when needed for grounded AI and richer displays. Do not scrape the rendered site as the permanent integration.

Submission from either surface creates one canonical Idea Seed. Existing Idea Seeds publish separately from curated blueprints; do not invent an existing editorial approval queue. Preserve that product distinction, add appropriate abuse controls, and keep any future promotion process explicit.

Updates, unpublishing, and deletion should propagate to habitat displays. Contributions need stable idea references, accounting for differences between static idea slugs and database project records. Retries must not create duplicates. Preserve attribution and permissions.

### Identity

Use habitat sign-in for the new experience and explicit Connect LEVL / Connect AGI Futures actions where needed. A verified link maps user IDs; matching email text alone is insufficient. Prefer standards-supported authorization over hand-built token systems where practical. Do not share unrestricted database credentials across browser clients.

Connection failures should not block public browsing or local focus use. Disconnect must revoke future integration access without deleting the source account. Never create duplicate builder profiles silently.

### Discord

Stage one: outbound announcements and explicit Discord “Share to habitat” actions. Stage two: automatic two-way mirroring of selected public channels, if justified by use. Suggested mappings: commons to atrium, builders to AGI Futures, longevity discussion to LEVL public lounge.

Disclose bridged channels; preserve authorship, origin links, reply relationships, permissions, and message-ID mappings. Prevent echo loops and repeated deliveries. Define edit/deletion propagation and offline recovery. Never bridge DMs or private coach sessions by default. Evaluate bot lifecycle and hosting separately; ordinary outgoing webhooks are not a full incoming-message listener.

## 10. Technical guidance without over-prescribing

Browser 3D with Three.js/React Three Fiber is the recommended direction, compatible with the existing ecosystem. Blender is optional for authoring optimized assets, not a service visitors depend on. Prefer mature components over an experimental graphics stack unless the tradeoff is justified.

Keep rendering, domain features, source content, and AI integrations separable. Room configuration should map objects to useful actions without requiring scene-code rewrites for every content update. Use exact logo assets as textures or appropriate UI artwork.

Load the arrival/atrium first and other wings on demand. Use compressed assets, baked lighting where effective, adjustable resolution, simplified reflections, and reduced particle/plant complexity on weaker devices. Pause unnecessary rendering in hidden tabs while preserving timestamp-based timers. No cloud rendering fallback.

Recommended performance targets, to validate on representative devices: responsive initial usable entry within roughly five seconds on a normal broadband laptop; smooth 30 fps or better in the default scene on an agreed midrange device; higher-quality tiers when hardware permits. These are targets, not guarantees independent of device or network. Measure asset bytes, load time, frame rate, and real-time message counts before increasing fidelity.

Provide keyboard/touch navigation, readable contrast and type, reduced motion, mute controls, and a lightweight directory/panel experience when 3D is unsuitable. A mobile visitor must still browse ideas, ask questions, and open a protocol without navigating the full environment.

No exact monthly-cost promise. Monitor real usage, cap AI consumption, and keep realtime traffic tied to meaningful actions. A persistent browser view should not trigger continuous model calls or database writes.

## 11. Delivery sequence

These are implementation milestones, not permission to replace the full vision with a generic dashboard. Build complete slices, retain working previews, and extend them.

| Milestone | Deliverable | Exit test |
| --- | --- | --- |
| 1. Spatial solo prototype | Atrium, realistic Earth, outward bubble pod, glass-bottom lounge, navigation, focus timer, licensed sample audio, quality controls | A guest can enter, work elsewhere, return, and complete a session on a normal laptop |
| 2. Useful integrated solo alpha | Sign-in/preferences; LEVL and AGI Futures offshoots; real idea summaries; approved public bartender; reviewed draft handoff when source integration is ready | With nobody online, a visitor can complete meaningful Focus and Explore journeys |
| 3. Connected community beta | Account links, existing AGI profiles/contributions, member banners, destination presence, asynchronous conversation, reporting/blocking, Discord announcements/explicit sharing | Two users can connect or contribute across sessions without duplicates or private-data exposure |
| 4. Richer habitat | Full spa circuit, deeper blueprint displays/guide, more workspace types, automatic Discord bridge, events, optional voice | Expand based on observed demand and validated performance/cost |

Display only working actions in public releases. During development, mocks must be labeled and isolated. If an integration is unavailable, provide a clear external link or unavailable state rather than simulated success.

## 12. Acceptance checklist

- [ ] Guest can enter, skip arrival, navigate directly, and use a local focus session.
- [ ] Solo visitor can gain value without human occupancy or fictional activity.
- [ ] Pod geometry faces outward; entry is flush to atrium; sunken lounges reveal Earth through their own floors.
- [ ] LEVL and AGI Futures are distinct wings with supplied logos.
- [ ] Focus session survives tab/background changes and refresh; status prevents unwanted interruption.
- [ ] Audio starts with permission, can be muted, and has documented rights.
- [ ] Published ideas retain canonical IDs/links and refresh after changes; unpublished items leave public displays.
- [ ] Habitat submission creates one canonical Idea Seed, visibly distinct from editorial blueprints.
- [ ] Contribution/profile updates reuse the agreed AGI Futures records rather than silently duplicating them.
- [ ] Bartender cannot activate schedules during exploration; save requires explicit action and returns a verified LEVL handoff.
- [ ] Account links verify ownership; disconnected or unauthorized users cannot access private source data.
- [ ] Arrival updates animate locally; no continuous movement stream or idle AI requests.
- [ ] AI residents and original/mirrored message authors are clearly identified.
- [ ] Bridging is limited to disclosed authorized channels and does not echo messages indefinitely.
- [ ] A failed integration, AI call, connection, or unsupported graphics device has an understandable recovery path.
- [ ] Public posting has reporting, blocking, moderation, and abuse controls.

## 13. Instructions to the Antigravity implementation agent

Read this spec and the supplied visual references first. Consult the two discovery reports only for the relevant integration details. Do not turn their entire proposed backlog into prerequisites for the first spatial prototype.

Start by producing a concise architecture proposal, a short milestone-one plan, and a visual implementation approach. Then build milestone one in reviewable increments. Make sensible reversible choices without repeatedly requesting confirmation. Ask only where an unresolved decision affects identity, source-system writes, public publication, or the agreed product direction.

Maintain a compact HANDOFF.md with current state, decisions, tested behavior, known limitations, and next work. Use version control. Verify browser behavior visually and functionally; compiling is not sufficient. Test authorization, draft side effects, and duplicate prevention before integrations launch.

Work in the new habitat repository. Changes needed in LEVL or AGI Futures should be explicit, narrowly scoped tasks for those projects, with agreed interface contracts. Do not assume the reports’ proposed endpoints exist. Do not rewrite functioning source apps or migrate all their data into this project.

Keep remaining confirmations short: production domains/callbacks, verified source authorization and RLS, approved audio assets, access to actual logo/concept files, and Discord server/channel choices. These do not block building the local spatial prototype.

## Reference pack

- User-approved concept art: latest sculptural atrium with logos; original LEVL protocol lounge with logo; LEVL spa with sauna/plunge/HBOT; original AGI Futures builder room with logo; idea gallery with Signal House, Main Street Legacy, HelioTerra, BioWalls.
- Exact logo files: LEVL Logo cropped(2).png; AGI Futures Logo 2026 High Res(1).png.
- AGI Futures hyperabundance-integration-discovery copy.md.
- LEVL hyperabundance-integration-discovery copy.md. The pasted-text report is an alternate representation and is not an additional implementation requirement.

Attach the visual files and reports alongside this specification when handing it to Antigravity. Their chat/workspace paths are not assumed to exist on the developer’s machine.
