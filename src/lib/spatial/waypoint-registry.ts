import { SectorBoothId } from "@/data/agifutures-catalog";

export type WingId =
  | "arrival"
  | "atrium"
  | "levl"
  | "agifutures"
  | "tobehuman"
  | "conservatory";

export type StageId =
  | "atrium-grand"
  | "atrium-terrace"
  | "tobehuman-sanctuary"
  | "pods-workbays"
  | "pods-garden"
  | "levl-lounge"
  | "agifutures-club";

export type StationKind =
  | "arrival_cabin"
  | "overview"
  | "focus_pod"
  | "sunken_lounge"
  | "briefing_kiosk"
  | "concierge_desk"
  | "protocol_bar"
  | "spa_station"
  | "screening_wall"
  | "holo_table"
  | "idea_booth"
  | "builder_guide"
  | "matching_board"
  | "pitch_stage"
  | "reading_nook";

export interface SpatialWaypoint {
  id: string;
  label: string;
  shortLabel: string;
  wing: WingId;
  stageId: StageId;
  kind: StationKind;
  mode: "focus" | "explore" | "connect";
  description: string;
  cameraPos: [number, number, number];
  lookAt: [number, number, number];
  markerPos: [number, number, number];
  defaultSectorId?: SectorBoothId;
  defaultModalitySlug?: string;
  elevationLabel?: string;
}

export const SPATIAL_WAYPOINTS: SpatialWaypoint[] = [
  // =========================================================================
  // 0. ARRIVAL (Space-Elevator Ascent Shaft — South Atrium z = +20)
  // =========================================================================
  {
    id: "orbital-elevator-ascent",
    label: "Orbital Tether Ascent Cabin & Arrival Rotunda",
    shortLabel: "Space Elevator",
    wing: "arrival",
    stageId: "atrium-terrace",
    kind: "arrival_cabin",
    mode: "explore",
    description:
      "Ascending through the glass-and-brass Space Elevator Rotunda into the HyperAbundance Orbital Ring at 418 km LEO.",
    cameraPos: [0, 1.8, 19.5],
    lookAt: [0, 1.6, -12.0],
    markerPos: [0, 1.2, 21.5],
  },

  // =========================================================================
  // 1. SHARED ORBITAL ATRIUM (Front Earth View + 180° Rear Rotunda)
  // =========================================================================
  {
    id: "atrium-commons",
    label: "Shared Orbital Atrium — Facing Earth (Front 5.5K Panorama)",
    shortLabel: "Atrium (Earth View)",
    wing: "atrium",
    stageId: "atrium-grand",
    kind: "overview",
    mode: "explore",
    description:
      "5.5K ultra-wide observation rotunda facing Planet Earth with swept ivory-travertine bionic ribs, Orbital Telemetry Astrolabe Hearth, twin sunken Earth-glass conversation pits, cantilevered glass focus pods, and glowing portals to LEVL (Left) and AGI Futures (Right).",
    cameraPos: [0, 2.3, 11.5],
    lookAt: [0, 1.4, -14.0],
    markerPos: [0, 0.4, 0.0],
  },
  {
    id: "atrium-rear-rotunda",
    label: "Shared Orbital Atrium — 180° Rear Rotunda (Space Elevator & TO BE HUMAN Portal)",
    shortLabel: "Atrium (180° Rear View)",
    wing: "atrium",
    stageId: "atrium-terrace",
    kind: "overview",
    mode: "explore",
    description:
      "Turn 180° around in the Grand Atrium to face the soaring glass Space-Elevator Arrival Shaft, Holographic Station Concierge Desk, TO BE HUMAN Wing Portal (Left), Backlit Fluted-Alabaster Lounge Bar & DJ Terrace (Right), and Aurora Earth-Glass Floor Oculi.",
    cameraPos: [0, 2.3, -8.5],
    lookAt: [0, 1.8, 18.0],
    markerPos: [0, 1.2, 16.0],
  },
  {
    id: "atrium-concierge",
    label: "Rear Atrium — Alabaster Social Bar, Concierge & Orbital DJ Terrace",
    shortLabel: "Alabaster Bar & DJ",
    wing: "atrium",
    stageId: "atrium-terrace",
    kind: "concierge_desk",
    mode: "explore",
    description:
      "Curved backlit fluted-alabaster Lounge Bar with cream bouclé barstools and the elevated second-story Orbital DJ Soundscape Terrace in the Rear Atrium.",
    cameraPos: [3.5, 2.0, 7.5],
    lookAt: [10.5, 1.6, 15.5],
    markerPos: [10.5, 1.6, 15.5],
  },
  {
    id: "lounge-pit-west",
    label: "West Sunken Earth-Glass Lounge Pit",
    shortLabel: "West Glass Lounge",
    wing: "atrium",
    stageId: "atrium-grand",
    kind: "sunken_lounge",
    mode: "connect",
    description:
      "Recessed circular conversation pit with curved cream bouclé sectional seating and a transparent structural glass floor looking straight down 418 km at Earth.",
    cameraPos: [-8.5, 1.2, 2.8],
    lookAt: [-8.5, -0.6, -4.5],
    markerPos: [-8.5, -0.2, -2.5],
  },
  {
    id: "lounge-pit-east",
    label: "East Sunken Earth-Glass Lounge Pit",
    shortLabel: "East Glass Lounge",
    wing: "atrium",
    stageId: "atrium-grand",
    kind: "sunken_lounge",
    mode: "connect",
    description:
      "Recessed circular conversation pit on the eastern deck with curved bouclé sofas, warm table lanterns, and a structural glass oculus suspended over Earth's terminator line.",
    cameraPos: [8.5, 1.2, 2.8],
    lookAt: [8.5, -0.6, -4.5],
    markerPos: [8.5, -0.2, -2.5],
  },

  // =========================================================================
  // 2. OUTWARD-PROTRUDING EARTHVIEW BUBBLE PODS (North Hull z = -21..-25)
  // =========================================================================
  {
    id: "pod-earthview-1",
    label: "Earthview Bubble Pod α1 (Lower West — +4 ft)",
    shortLabel: "Pod α1 (West)",
    wing: "atrium",
    stageId: "pods-workbays",
    kind: "focus_pod",
    mode: "focus",
    elevationLabel: "+4 ft Hull Rim",
    description:
      "Outward-protruding spherical glass biosphere pod along the western hull rim. Step inside to a curved walnut focus desk facing Earth, or turn 180° around to look back across the glowing Atrium.",
    cameraPos: [-13.5, 2.0, -21.2],
    lookAt: [-15.0, 1.4, -29.0],
    markerPos: [-14.0, 1.8, -22.5],
  },
  {
    id: "pod-earthview-2",
    label: "Earthview Bubble Pod α2 (Lower Center-West — +4 ft)",
    shortLabel: "Pod α2 (Center-West)",
    wing: "atrium",
    stageId: "pods-garden",
    kind: "focus_pod",
    mode: "focus",
    elevationLabel: "+4 ft Hull Rim",
    description:
      "Outward-protruding glass focus capsule suspended beyond the northern observation wall with an unobstructed 270° horizon view of Earth.",
    cameraPos: [-4.8, 2.0, -23.0],
    lookAt: [-5.2, 1.4, -31.0],
    markerPos: [-5.0, 1.8, -24.2],
  },
  {
    id: "pod-earthview-3",
    label: "Earthview Bubble Pod β1 (Lower Center-East — +4 ft)",
    shortLabel: "Pod β1 (Center-East)",
    wing: "atrium",
    stageId: "pods-garden",
    kind: "focus_pod",
    mode: "focus",
    elevationLabel: "+4 ft Hull Rim",
    description:
      "Outward-protruding spherical glass focus pod tuned for deep writing and architectural systems work directly over the orbital horizon.",
    cameraPos: [4.8, 2.0, -23.0],
    lookAt: [5.2, 1.4, -31.0],
    markerPos: [5.0, 1.8, -24.2],
  },
  {
    id: "pod-earthview-4",
    label: "Earthview Bubble Pod β2 (Lower East — +4 ft)",
    shortLabel: "Pod β2 (East)",
    wing: "atrium",
    stageId: "pods-workbays",
    kind: "focus_pod",
    mode: "focus",
    elevationLabel: "+4 ft Hull Rim",
    description:
      "Outward-protruding convex glass sphere along the eastern structural rib overlooking continental cloud formations and city lights.",
    cameraPos: [13.5, 2.0, -21.2],
    lookAt: [15.0, 1.4, -29.0],
    markerPos: [14.0, 1.8, -22.5],
  },
  {
    id: "pod-earthview-5",
    label: "Earthview Bubble Pod γ1 (Upper Mezzanine West — +18 ft)",
    shortLabel: "Pod γ1 (Upper West)",
    wing: "atrium",
    stageId: "pods-workbays",
    kind: "focus_pod",
    mode: "focus",
    elevationLabel: "+18 ft Mezzanine",
    description:
      "Elevated second-story outward glass bubble pod accessed from the Upper Mezzanine Promenade, suspended high above the orbital horizon.",
    cameraPos: [-9.5, 6.6, -21.5],
    lookAt: [-10.5, 5.8, -29.5],
    markerPos: [-9.8, 6.4, -22.8],
  },
  {
    id: "pod-earthview-6",
    label: "Earthview Bubble Pod γ2 (Upper Mezzanine East — +18 ft)",
    shortLabel: "Pod γ2 (Upper East)",
    wing: "atrium",
    stageId: "pods-garden",
    kind: "focus_pod",
    mode: "focus",
    elevationLabel: "+18 ft Mezzanine",
    description:
      "Elevated second-story outward glass bubble pod framed by cascading biophilic foliage and direct Earth horizon views.",
    cameraPos: [9.5, 6.6, -21.5],
    lookAt: [10.5, 5.8, -29.5],
    markerPos: [9.8, 6.4, -22.8],
  },

  // =========================================================================
  // 3. LEVL LONGEVITY LOUNGE & SPA WING (West Wing x = -22..-54)
  // =========================================================================
  {
    id: "levl-lounge-entry",
    label: "LEVL Longevity Lounge — 360° Wing Overview",
    shortLabel: "LEVL Lounge",
    wing: "levl",
    stageId: "levl-lounge",
    kind: "overview",
    mode: "explore",
    description:
      "Walkable 360° botanical longevity sanctuary in honed travertine, warm walnut, and glowing cyan-teal accents featuring the Fluted Alabaster Protocol Bar, Sunken Recovery Pit, Sauna/Cold Plunge, HBOT Alcove, and Screening Wall.",
    cameraPos: [-26.0, 2.2, 4.5],
    lookAt: [-40.0, 1.5, -2.0],
    markerPos: [-35.0, 0.5, 0.0],
  },
  {
    id: "levl-protocol-bar",
    label: "LEVL Fluted Alabaster Protocol Bar & Sora AI Coach",
    shortLabel: "Protocol Bar",
    wing: "levl",
    stageId: "levl-lounge",
    kind: "protocol_bar",
    mode: "explore",
    defaultModalitySlug: "zone-2-and-vo2max-training",
    description:
      "Backlit fluted alabaster Longevity Bar with glowing apothecary vial shelving where you can consult Sora (LEVL AI Coach), inspect PubMed RCT evidence, and hand off a draft protocol to mylevl.ai.",
    cameraPos: [-40.5, 1.9, 0.0],
    lookAt: [-48.5, 1.6, 0.0],
    markerPos: [-46.5, 1.5, 0.0],
  },
  {
    id: "levl-screening-wall",
    label: "LEVL Research Screening Wall (Living Longer • Living Better)",
    shortLabel: "Screening Wall",
    wing: "levl",
    stageId: "levl-lounge",
    kind: "screening_wall",
    mode: "explore",
    description:
      "Dedicated research screening theater wall on the south side of the LEVL wing with curated longevity science talks, linked PubMed evidence cards, and automatic DJ audio ducking.",
    cameraPos: [-33.0, 1.9, 6.5],
    lookAt: [-33.0, 2.2, 14.5],
    markerPos: [-33.0, 2.2, 13.8],
  },
  {
    id: "levl-spa-sauna",
    label: "Thermal Conditioning Suite — Finnish Dry Sauna & Cold Plunge",
    shortLabel: "Sauna & Cold Plunge",
    wing: "levl",
    stageId: "levl-lounge",
    kind: "spa_station",
    mode: "explore",
    defaultModalitySlug: "finnish-sauna",
    description:
      "Warm cedar-slatted Finnish Dry Sauna and illuminated Cold Plunge basin on the north-west spa deck. Inspect human clinical evidence, HSP70/eNOS mechanisms, and timing protocols.",
    cameraPos: [-36.0, 1.9, -6.5],
    lookAt: [-38.0, 1.6, -14.0],
    markerPos: [-38.0, 1.6, -12.8],
  },
  {
    id: "levl-spa-hbot",
    label: "Hyperbaric Oxygen (HBOT) & 660nm Photobiomodulation Alcove",
    shortLabel: "HBOT & Red Light",
    wing: "levl",
    stageId: "levl-lounge",
    kind: "spa_station",
    mode: "explore",
    defaultModalitySlug: "hyperbaric-oxygen-therapy",
    description:
      "Cylindrical glass-and-brass 2.0 ATA Hyperbaric Chamber and 660nm/850nm Red/NIR Photobiomodulation alcove in the south-west spa sanctuary.",
    cameraPos: [-40.0, 1.9, 6.5],
    lookAt: [-44.5, 1.6, 13.5],
    markerPos: [-44.0, 1.6, 12.2],
  },

  // =========================================================================
  // 4. AGI FUTURES BUILDER CLUB WING (East Wing x = +22..+54)
  // =========================================================================
  {
    id: "agi-club-overview",
    label: "AGI Futures Inventor's Club — 360° Wing Overview",
    shortLabel: "AGI Futures Club",
    wing: "agifutures",
    stageId: "agifutures-club",
    kind: "overview",
    mode: "explore",
    description:
      "Walkable 360° inventor's club in warm American walnut, brushed brass, and radiant emerald featuring the Central Holographic Blueprint Table, 6 curved Sector Idea Booths, and Earth-glass floor.",
    cameraPos: [26.0, 2.2, 4.5],
    lookAt: [38.0, 1.4, -1.5],
    markerPos: [36.0, 0.5, 0.0],
  },
  {
    id: "agi-holo-table",
    label: "Central Collaborative Holographic Blueprint Table",
    shortLabel: "Central Holo-Table",
    wing: "agifutures",
    stageId: "agifutures-club",
    kind: "holo_table",
    mode: "explore",
    defaultSectorId: "homes-cities",
    description:
      "Monumental 5-meter circular walnut-and-brass table projecting rotating 3D architectural and deep-tech holograms. Swipe through all 33 canonical AGI Futures startup ideas across 6 sectors in place.",
    cameraPos: [31.2, 2.0, 3.2],
    lookAt: [36.0, 1.3, 0.0],
    markerPos: [36.0, 1.4, 0.0],
  },
  {
    id: "agi-booth-homes",
    label: "Idea Booth 1 — Homes & Thriving Communities (Signal House, Porchfront, Hearth)",
    shortLabel: "Booth: Homes & Cities",
    wing: "agifutures",
    stageId: "agifutures-club",
    kind: "idea_booth",
    mode: "explore",
    defaultSectorId: "homes-cities",
    description:
      "North-West curved walnut booth showcasing Signal House, Porchfront, Hearth, HouseGraph, HomeQuote, and CommonGround.",
    cameraPos: [29.5, 1.9, -6.2],
    lookAt: [29.5, 1.5, -12.5],
    markerPos: [29.5, 1.6, -11.5],
  },
  {
    id: "agi-booth-energy",
    label: "Idea Booth 2 — Clean Energy & Planetary Scale (HelioTerra, Skyhold)",
    shortLabel: "Booth: Clean Energy",
    wing: "agifutures",
    stageId: "agifutures-club",
    kind: "idea_booth",
    mode: "explore",
    defaultSectorId: "clean-energy-planet",
    description:
      "North-Center curved walnut booth showcasing HelioTerra, Skyhold, Wild Return, and Waypoint.",
    cameraPos: [36.5, 1.9, -6.2],
    lookAt: [36.5, 1.5, -12.5],
    markerPos: [36.5, 1.6, -11.5],
  },
  {
    id: "agi-booth-biotech",
    label: "Idea Booth 3 — Biotech, Health & Longevity (BioWalls, BioArk, BiomeX)",
    shortLabel: "Booth: Biotech & Health",
    wing: "agifutures",
    stageId: "agifutures-club",
    kind: "idea_booth",
    mode: "explore",
    defaultSectorId: "biotech-longevity",
    description:
      "North-East curved walnut booth showcasing BioWalls, BioArk, BiomeX, Attune, Thoughtline, and Afterlight.",
    cameraPos: [43.5, 1.9, -6.2],
    lookAt: [43.5, 1.5, -12.5],
    markerPos: [43.5, 1.6, -11.5],
  },
  {
    id: "agi-booth-ai",
    label: "Idea Booth 4 — AI & Economic Agency (Main Street Legacy, AI Founder Lab)",
    shortLabel: "Booth: AI & Enterprise",
    wing: "agifutures",
    stageId: "agifutures-club",
    kind: "idea_booth",
    mode: "explore",
    defaultSectorId: "ai-autonomous-enterprise",
    description:
      "South-West curved walnut booth showcasing Main Street Legacy, AI Founder Lab, Agentable, Helm, ProofRun, SellCraft, and Easy Exit.",
    cameraPos: [29.5, 1.9, 6.2],
    lookAt: [29.5, 1.5, 12.5],
    markerPos: [29.5, 1.6, 11.5],
  },
  {
    id: "agi-builder-guide",
    label: "AI Builder Guide Desk (Kaelen)",
    shortLabel: "AI Builder Guide",
    wing: "agifutures",
    stageId: "agifutures-club",
    kind: "builder_guide",
    mode: "explore",
    defaultSectorId: "ai-autonomous-enterprise",
    description:
      "Consult Kaelen (AGI Futures AI Builder Guide) at the Eastern Observatory Desk to unpack blueprint assumptions, design falsifiable 14-day experiments, and match your skills.",
    cameraPos: [44.0, 1.9, -2.5],
    lookAt: [50.0, 1.5, -4.0],
    markerPos: [49.2, 1.5, -4.0],
  },
  {
    id: "agi-matching-wall",
    label: "Founder Matching Wall (Building / Looking For / Can Help)",
    shortLabel: "Founder Matching",
    wing: "agifutures",
    stageId: "agifutures-club",
    kind: "matching_board",
    mode: "connect",
    description:
      "Browse asynchronous builder intentions on the holographic Founder Matching Wall, post your own Building / Looking For / Can Help banner, and send high-signal introductions.",
    cameraPos: [44.0, 1.9, 3.5],
    lookAt: [50.0, 1.8, 5.0],
    markerPos: [49.2, 1.8, 5.0],
  },

  // =========================================================================
  // 5. TO BE HUMAN SANCTUARY WING (Purpose & Consciousness in the AGI Era)
  // =========================================================================
  {
    id: "tobehuman-sanctuary",
    label: "TO BE HUMAN Sanctuary — Purpose & Consciousness in the AGI Era (5.5K Panorama)",
    shortLabel: "TO BE HUMAN Wing",
    wing: "tobehuman",
    stageId: "tobehuman-sanctuary",
    kind: "overview",
    mode: "focus",
    elevationLabel: "Consciousness Wing",
    description:
      "Transcendent orbital sanctuary dedicated to human consciousness, existential purpose, and deep contemplation—featuring the Zero-G Obsidian Reflection Pool over the Aurora Earth Oculus, Ancient Bonsai Tree of Life, Golden Neural-Cosmos Sculpture, Socratic Dialogue Amphitheater, and Two-Story Wisdom Library.",
    cameraPos: [-18.0, 2.2, 16.0],
    lookAt: [-30.0, 1.8, 22.0],
    markerPos: [-28.0, 1.2, 20.0],
  },
  {
    id: "tobehuman-amphitheater",
    label: "TO BE HUMAN — Socratic Dialogue Amphitheater & Contemplation Pods",
    shortLabel: "Socratic Amphitheater",
    wing: "tobehuman",
    stageId: "tobehuman-sanctuary",
    kind: "sunken_lounge",
    mode: "connect",
    elevationLabel: "West Sanctuary",
    description:
      "Stepped curved cream-travertine and bouclé amphitheater seating with warm recessed candlelight coves for intimate philosophical salons and existential inquiry.",
    cameraPos: [-24.0, 2.0, 14.0],
    lookAt: [-34.0, 1.5, 18.0],
    markerPos: [-32.0, 1.5, 18.0],
  },
  {
    id: "tobehuman-library",
    label: "TO BE HUMAN — Two-Story Wisdom & Consciousness Library Rotunda",
    shortLabel: "Wisdom Library",
    wing: "tobehuman",
    stageId: "tobehuman-sanctuary",
    kind: "reading_nook",
    mode: "focus",
    elevationLabel: "East Sanctuary",
    description:
      "Two-story curved oiled American walnut bookcases housing humanity's foundational philosophical texts, brushed-brass rolling ladders, and quiet contemplation alcoves.",
    cameraPos: [-14.0, 2.0, 18.0],
    lookAt: [-22.0, 2.2, 26.0],
    markerPos: [-21.0, 2.0, 25.0],
  },
  {
    id: "conservatory-deck",
    label: "Circular Glass Botanical Library & Reading Conservatory",
    shortLabel: "Library Conservatory",
    wing: "tobehuman",
    stageId: "tobehuman-sanctuary",
    kind: "reading_nook",
    mode: "focus",
    elevationLabel: "South Conservatory",
    description:
      "Two-story circular glass-walled botanical reading library in the TO BE HUMAN Sanctuary with illuminated walnut bookcases, plush reading armchairs, and a central bonsai canopy tree.",
    cameraPos: [-4.5, 2.0, 9.0],
    lookAt: [-10.5, 1.8, 15.5],
    markerPos: [-10.5, 1.8, 15.5],
  },
];

export function getWaypointById(id: string): SpatialWaypoint {
  return (
    SPATIAL_WAYPOINTS.find((wp) => wp.id === id) ||
    SPATIAL_WAYPOINTS.find((wp) => wp.id === "atrium-commons")!
  );
}

export function getWaypointsByWing(wing: WingId): SpatialWaypoint[] {
  return SPATIAL_WAYPOINTS.filter((wp) => wp.wing === wing);
}
