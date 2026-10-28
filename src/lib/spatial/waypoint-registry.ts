import { SectorBoothId } from "@/data/agifutures-catalog";

export type WingId =
  | "arrival"
  | "atrium"
  | "levl"
  | "agifutures"
  | "conservatory";

export type StageId =
  | "atrium-grand"
  | "atrium-terrace"
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
  // 0. ARRIVAL (Space-Elevator Ascent)
  // =========================================================================
  {
    id: "orbital-elevator-ascent",
    label: "Orbital Tether Ascent Cabin",
    shortLabel: "Space Elevator",
    wing: "arrival",
    stageId: "atrium-grand",
    kind: "arrival_cabin",
    mode: "explore",
    description:
      "Ascending through the upper thermosphere into the HyperAbundance Orbital Ring at 418 km LEO.",
    cameraPos: [0, -2.5, 11.5],
    lookAt: [0, 1.5, -12],
    markerPos: [0, -3.5, -8.5],
  },

  // =========================================================================
  // 1. SHARED ORBITAL ATRIUM (Stage: atrium-grand -> atrium-radiant-3.png)
  // =========================================================================
  {
    id: "atrium-commons",
    label: "Shared Orbital Atrium — Grand Commons",
    shortLabel: "Atrium Commons",
    wing: "atrium",
    stageId: "atrium-grand",
    kind: "overview",
    mode: "explore",
    description:
      "Monumental zero-G architectural sanctuary with branching ivory ribs, twin sunken glass-floor lounges over Earth, outward-protruding bubble pods, and radiant portals to LEVL and AGI Futures.",
    cameraPos: [0, 0.35, 9.2],
    lookAt: [0, 0.25, -12.0],
    markerPos: [0, -1.2, -10.5],
  },
  {
    id: "atrium-concierge",
    label: "Holographic Concierge, Bartender & DJ Terrace",
    shortLabel: "Concierge & DJ Deck",
    wing: "atrium",
    stageId: "atrium-terrace",
    kind: "concierge_desk",
    mode: "explore",
    description:
      "Close-up promenade featuring the holographic AI Resident Bartender, circular glass-walled botanical library, AGI Futures robotics bay, and live orbital DJ console.",
    cameraPos: [0, 0.25, 8.8],
    lookAt: [0, 0.15, -12.0],
    markerPos: [-2.2, 0.6, -10.8],
  },
  {
    id: "lounge-pit-west",
    label: "West Sunken Earth-Glass Lounge",
    shortLabel: "West Glass Lounge",
    wing: "atrium",
    stageId: "atrium-grand",
    kind: "sunken_lounge",
    mode: "connect",
    description:
      "Recessed circular conversation pit with curved cream bouclé seating and a structural glass floor looking straight down at Earth's glowing city networks and clouds.",
    cameraPos: [-3.2, -0.8, 4.6],
    lookAt: [-5.6, -3.8, -10.5],
    markerPos: [-5.6, -3.6, -9.2],
  },
  {
    id: "lounge-pit-east",
    label: "East Sunken Earth-Glass Lounge",
    shortLabel: "East Glass Lounge",
    wing: "atrium",
    stageId: "atrium-grand",
    kind: "sunken_lounge",
    mode: "connect",
    description:
      "Recessed circular conversation pit on the eastern deck with a transparent glass floor suspended directly over the orbital terminator line.",
    cameraPos: [3.2, -0.8, 4.6],
    lookAt: [5.8, -3.8, -10.5],
    markerPos: [5.8, -3.6, -9.2],
  },

  // =========================================================================
  // 2. OUTWARD-PROTRUDING EARTHVIEW BUBBLE PODS (Focus Sanctuary)
  // =========================================================================
  {
    id: "pod-earthview-1",
    label: "Earthview Bubble Pod α1 (Upper West — +24 ft)",
    shortLabel: "Pod α1 (Upper West)",
    wing: "atrium",
    stageId: "pods-workbays",
    kind: "focus_pod",
    mode: "focus",
    elevationLabel: "+24 ft Upper Hull",
    description:
      "Outward-protruding convex glass bubble pod suspended along the upper western rib. Curved walnut desk faces directly toward Earth's horizon.",
    cameraPos: [-2.8, 1.4, 5.2],
    lookAt: [-5.4, 2.6, -11.0],
    markerPos: [-8.2, 4.3, -9.8],
  },
  {
    id: "pod-earthview-2",
    label: "Earthview Bubble Pod α2 (Apex West — +28 ft)",
    shortLabel: "Pod α2 (Apex West)",
    wing: "atrium",
    stageId: "pods-garden",
    kind: "focus_pod",
    mode: "focus",
    elevationLabel: "+28 ft Upper Hull",
    description:
      "High-altitude zero-G glass bubble pod nestled in the upper botanical canopy with an unobstructed view of Earth's atmospheric limb.",
    cameraPos: [-1.8, 1.8, 5.0],
    lookAt: [-4.5, 4.2, -11.2],
    markerPos: [-4.6, 5.6, -10.8],
  },
  {
    id: "pod-earthview-3",
    label: "Earthview Bubble Pod β1 (Apex East — +28 ft)",
    shortLabel: "Pod β1 (Apex East)",
    wing: "atrium",
    stageId: "pods-garden",
    kind: "focus_pod",
    mode: "focus",
    elevationLabel: "+28 ft Upper Hull",
    description:
      "Upper-hull outward glass bubble pod tuned for deep writing and architectural systems work above the orbital horizon.",
    cameraPos: [1.8, 1.6, 5.0],
    lookAt: [4.8, 3.8, -11.2],
    markerPos: [5.4, 2.8, -11.2],
  },
  {
    id: "pod-earthview-4",
    label: "Earthview Bubble Pod β2 (Upper East — +24 ft)",
    shortLabel: "Pod β2 (Upper East)",
    wing: "atrium",
    stageId: "pods-workbays",
    kind: "focus_pod",
    mode: "focus",
    elevationLabel: "+24 ft Upper Hull",
    description:
      "Outward-protruding convex glass sphere along the eastern structural rib overlooking continental cloud formations and city lights.",
    cameraPos: [2.8, 1.4, 5.2],
    lookAt: [5.6, 2.8, -11.0],
    markerPos: [10.4, 4.2, -9.2],
  },
  {
    id: "pod-earthview-5",
    label: "Earthview Bubble Pod γ1 (Mid-Deck West — +12 ft)",
    shortLabel: "Pod γ1 (Mid West)",
    wing: "atrium",
    stageId: "pods-workbays",
    kind: "focus_pod",
    mode: "focus",
    elevationLabel: "+12 ft Mid Hull",
    description:
      "Mid-level outward bubble capsule with botanical acoustic planters and warm walnut work bay facing Earth.",
    cameraPos: [-1.5, 0.8, 5.8],
    lookAt: [-3.8, 1.8, -11.2],
    markerPos: [-4.6, 2.6, -11.2],
  },
  {
    id: "pod-earthview-6",
    label: "Earthview Bubble Pod γ2 (Mid-Deck East — +12 ft)",
    shortLabel: "Pod γ2 (Mid East)",
    wing: "atrium",
    stageId: "pods-garden",
    kind: "focus_pod",
    mode: "focus",
    elevationLabel: "+12 ft Mid Hull",
    description:
      "Mid-level outward glass bubble pod framed by cascading biophilic foliage and direct Earth horizon views.",
    cameraPos: [1.5, 0.8, 5.8],
    lookAt: [4.2, 1.8, -11.2],
    markerPos: [7.6, -0.1, -11.0],
  },

  // =========================================================================
  // 3. LEVL LONGEVITY LOUNGE & SPA WING (Stage: levl-lounge -> levl-lounge.png)
  // =========================================================================
  {
    id: "levl-lounge-entry",
    label: "LEVL Longevity Lounge — Overview",
    shortLabel: "LEVL Lounge",
    wing: "levl",
    stageId: "levl-lounge",
    kind: "overview",
    mode: "explore",
    description:
      "Botanical luxury longevity sanctuary in ivory travertine, warm walnut, and glowing cyan-emerald accents featuring the Protocol Bar, Earth-Glass Lounge Pit, and Research Screening Wall.",
    cameraPos: [0, 0.35, 9.0],
    lookAt: [0, 0.2, -12.0],
    markerPos: [-12.6, 0.3, -9.2],
  },
  {
    id: "levl-protocol-bar",
    label: "LEVL Protocol Bar & Sora AI Bartender",
    shortLabel: "Protocol Bar",
    wing: "levl",
    stageId: "levl-lounge",
    kind: "protocol_bar",
    mode: "explore",
    defaultModalitySlug: "zone-2-and-vo2max-training",
    description:
      "Backlit fluted alabaster Longevity Bar where you can consult Sora (LEVL AI Coach), inspect PubMed RCT evidence, and hand off a draft protocol to mylevl.ai.",
    cameraPos: [-3.6, -0.2, 4.8],
    lookAt: [-9.2, -0.8, -10.5],
    markerPos: [-9.5, -1.0, -9.8],
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
      "Dedicated research screening theater wall with curated longevity science talks, linked PubMed evidence cards, and automatic DJ audio ducking.",
    cameraPos: [3.6, 0.1, 4.8],
    lookAt: [9.5, 0.2, -10.5],
    markerPos: [9.8, 0.2, -9.8],
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
      "Inspect human clinical evidence, HSP70/eNOS mechanisms, hypertrophy timing caveats, and real-world protocols for 80°C+ heat and 10–15°C cold exposure.",
    cameraPos: [-2.4, 1.2, 5.2],
    lookAt: [-6.8, 2.4, -11.0],
    markerPos: [-6.8, 2.4, -10.6],
  },
  {
    id: "levl-spa-hbot",
    label: "Hyperbaric Oxygen (HBOT) & Photobiomodulation Alcove",
    shortLabel: "HBOT & Red Light",
    wing: "levl",
    stageId: "levl-lounge",
    kind: "spa_station",
    mode: "explore",
    defaultModalitySlug: "hyperbaric-oxygen-therapy",
    description:
      "Review hyperoxic-hypoxic paradox trials (2.0 ATA), red/NIR irradiance windows (660nm / 850nm), contraindications, and clinical evidence grades.",
    cameraPos: [2.4, 1.2, 5.2],
    lookAt: [6.8, 2.6, -11.0],
    markerPos: [6.8, 2.6, -10.6],
  },

  // =========================================================================
  // 4. AGI FUTURES BUILDER CLUB WING (Stage: agifutures-club -> agifutures-club.png)
  // =========================================================================
  {
    id: "agi-club-overview",
    label: "AGI Futures Inventor's Club — Overview",
    shortLabel: "AGI Futures Club",
    wing: "agifutures",
    stageId: "agifutures-club",
    kind: "overview",
    mode: "explore",
    description:
      "High-craft inventor's club in warm walnut, brushed brass, and radiant emerald with the Central Holographic Blueprint Table, 6 Sector Idea Booths, and Earth-glass floor.",
    cameraPos: [0, 0.35, 9.0],
    lookAt: [0, 0.2, -12.0],
    markerPos: [12.6, 0.3, -9.2],
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
      "Interactive holographic centerpiece projecting 3D architectural and deep-tech models. Swipe through all 33 canonical AGI Futures startup ideas across 6 sectors in place.",
    cameraPos: [0, -0.2, 4.4],
    lookAt: [0, -1.2, -10.2],
    markerPos: [0, -1.3, -9.6],
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
      "Holographic booth showcasing Signal House, Porchfront, Hearth, HouseGraph, HomeQuote, and CommonGround. Swipe ideas or switch sectors in place.",
    cameraPos: [-3.4, -0.1, 4.8],
    lookAt: [-9.2, -0.6, -10.2],
    markerPos: [-9.4, -0.6, -9.6],
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
      "Holographic booth showcasing HelioTerra, Skyhold, Wild Return, and Waypoint. Swipe ideas or switch sectors in place.",
    cameraPos: [-2.0, 0.4, 5.2],
    lookAt: [-5.6, 0.6, -11.0],
    markerPos: [-5.6, 0.6, -10.8],
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
      "Holographic booth showcasing BioWalls, BioArk, BiomeX, Attune, Thoughtline, and Afterlight.",
    cameraPos: [-0.8, 0.5, 5.2],
    lookAt: [-2.4, 0.9, -11.2],
    markerPos: [-2.4, 0.9, -11.0],
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
      "Holographic booth showcasing Main Street Legacy, AI Founder Lab, Agentable, Helm, ProofRun, SellCraft, and Easy Exit.",
    cameraPos: [2.0, 0.4, 5.2],
    lookAt: [5.6, 0.5, -11.0],
    markerPos: [5.6, 0.5, -10.8],
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
      "Consult Kaelen (AGI Futures AI Builder Guide) to unpack blueprint assumptions, design falsifiable 14-day experiments, and match your skills to high-leverage problems.",
    cameraPos: [3.4, -0.1, 4.8],
    lookAt: [9.2, -0.8, -10.2],
    markerPos: [9.4, -0.8, -9.6],
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
      "Browse asynchronous builder intentions, post your own Building / Looking For / Can Help banner, and send high-signal introductions.",
    cameraPos: [1.2, 1.1, 5.4],
    lookAt: [3.2, 2.2, -11.0],
    markerPos: [3.2, 2.2, -10.8],
  },

  // =========================================================================
  // 5. UPPER CONSERVATORY & BOTANICAL READING DECK (Stage: atrium-terrace)
  // =========================================================================
  {
    id: "conservatory-deck",
    label: "Botanical Library & Quiet Conservatory",
    shortLabel: "Library Conservatory",
    wing: "conservatory",
    stageId: "atrium-terrace",
    kind: "reading_nook",
    mode: "focus",
    elevationLabel: "+22 ft Canopy Deck",
    description:
      "Circular glass-walled botanical reading library and quiet terrace overlooking Earth and the holographic bartender lounge.",
    cameraPos: [-0.8, 0.4, 5.4],
    lookAt: [-2.2, 0.5, -11.2],
    markerPos: [-2.2, 0.5, -10.8],
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
