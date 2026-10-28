import { SectorBoothId } from "@/data/agifutures-catalog";

export type WingId =
  | "arrival"
  | "atrium"
  | "levl"
  | "agifutures"
  | "conservatory";

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
  // 0. ARRIVAL (Skippable Space-Elevator Ascent)
  // =========================================================================
  {
    id: "orbital-elevator-ascent",
    label: "Orbital Tether Ascent Cabin",
    shortLabel: "Space Elevator",
    wing: "arrival",
    kind: "arrival_cabin",
    mode: "explore",
    description:
      "Ascending through the upper stratosphere into the HyperAbundance Orbital Ring.",
    cameraPos: [0, -18, 22],
    lookAt: [0, 3, -35],
    markerPos: [0, -16, 18],
  },

  // =========================================================================
  // 1. SHARED ORBITAL ATRIUM
  // =========================================================================
  {
    id: "atrium-commons",
    label: "Shared Orbital Atrium — Grand Commons",
    shortLabel: "Atrium Commons",
    wing: "atrium",
    kind: "overview",
    mode: "explore",
    description:
      "Central zero-G architectural commons with branching ivory ribs, sunken glass-floor lounges, outward Earthview pods, and offshoot portals to LEVL and AGI Futures.",
    cameraPos: [0, 2.5, 11.5],
    lookAt: [0, 2.2, -28],
    markerPos: [0, 0.2, 5],
  },
  {
    id: "atrium-concierge",
    label: "Orbital Concierge & Station Briefing Kiosk",
    shortLabel: "Concierge & Briefing",
    wing: "atrium",
    kind: "concierge_desk",
    mode: "explore",
    description:
      "AI Resident Concierge and live station briefing for recent blueprints, longevity research, and focus seat selection.",
    cameraPos: [0, 2.0, 4.2],
    lookAt: [0, 1.8, -12],
    markerPos: [0, 1.1, 0.5],
  },
  {
    id: "lounge-pit-west",
    label: "West Sunken Earth-Glass Lounge",
    shortLabel: "West Glass Lounge",
    wing: "atrium",
    kind: "sunken_lounge",
    mode: "connect",
    description:
      "Recessed circular conversation pit with a transparent structural glass floor looking straight down at Earth beneath the seating ring.",
    cameraPos: [-5.8, 1.35, -3.2],
    lookAt: [-5.8, -6.5, -14],
    markerPos: [-5.8, -0.4, -5.5],
  },
  {
    id: "lounge-pit-east",
    label: "East Sunken Earth-Glass Lounge",
    shortLabel: "East Glass Lounge",
    wing: "atrium",
    kind: "sunken_lounge",
    mode: "connect",
    description:
      "Recessed circular conversation pit with perimeter bouclé seating and a clear glass floor over the glowing night-to-day terminator line.",
    cameraPos: [5.8, 1.35, -3.2],
    lookAt: [5.8, -6.5, -14],
    markerPos: [5.8, -0.4, -5.5],
  },

  // =========================================================================
  // 2. OUTWARD-PROTRUDING EARTHVIEW BUBBLE PODS (Focus Mode)
  // =========================================================================
  {
    id: "pod-earthview-1",
    label: "Earthview Bubble Pod α1 (Upper West — +24 ft)",
    shortLabel: "Pod α1 (Upper West)",
    wing: "atrium",
    kind: "focus_pod",
    mode: "focus",
    elevationLabel: "+24 ft Upper Hull",
    description:
      "Outward-protruding convex glass bubble pod suspended outside the upper west hull rib. Flush interior ring entry; desk faces straight out toward Earth.",
    cameraPos: [-8.6, 7.6, -21.2],
    lookAt: [-11.5, 4.2, -85],
    markerPos: [-8.2, 7.4, -19.5],
  },
  {
    id: "pod-earthview-2",
    label: "Earthview Bubble Pod α2 (Upper Center-West — +28 ft)",
    shortLabel: "Pod α2 (Apex West)",
    wing: "atrium",
    kind: "focus_pod",
    mode: "focus",
    elevationLabel: "+28 ft Upper Hull",
    description:
      "High-altitude zero-G drift pod protruding through the upper forward glazing with an unobstructed horizon view.",
    cameraPos: [-3.9, 8.8, -22.8],
    lookAt: [-4.5, 5.0, -90],
    markerPos: [-3.8, 8.6, -21.0],
  },
  {
    id: "pod-earthview-3",
    label: "Earthview Bubble Pod β1 (Upper Center-East — +28 ft)",
    shortLabel: "Pod β1 (Apex East)",
    wing: "atrium",
    kind: "focus_pod",
    mode: "focus",
    elevationLabel: "+28 ft Upper Hull",
    description:
      "Upper-hull outward glass bubble pod tuned for deep writing and architectural systems work above the orbital limb.",
    cameraPos: [3.9, 8.8, -22.8],
    lookAt: [4.5, 5.0, -90],
    markerPos: [3.8, 8.6, -21.0],
  },
  {
    id: "pod-earthview-4",
    label: "Earthview Bubble Pod β2 (Upper East — +24 ft)",
    shortLabel: "Pod β2 (Upper East)",
    wing: "atrium",
    kind: "focus_pod",
    mode: "focus",
    elevationLabel: "+24 ft Upper Hull",
    description:
      "Outward-protruding convex glass sphere along the eastern structural rib overlooking continental cloud formations.",
    cameraPos: [8.6, 7.6, -21.2],
    lookAt: [11.5, 4.2, -85],
    markerPos: [8.2, 7.4, -19.5],
  },
  {
    id: "pod-earthview-5",
    label: "Earthview Bubble Pod γ1 (Mid-Deck West — +12 ft)",
    shortLabel: "Pod γ1 (Mid West)",
    wing: "atrium",
    kind: "focus_pod",
    mode: "focus",
    elevationLabel: "+12 ft Mid Hull",
    description:
      "Mid-level outward bubble capsule with botanical acoustic planters and warm walnut desk facing Earth.",
    cameraPos: [-6.4, 3.8, -21.8],
    lookAt: [-8.0, 0.5, -85],
    markerPos: [-6.2, 3.6, -20.2],
  },
  {
    id: "pod-earthview-6",
    label: "Earthview Bubble Pod γ2 (Mid-Deck East — +12 ft)",
    shortLabel: "Pod γ2 (Mid East)",
    wing: "atrium",
    kind: "focus_pod",
    mode: "focus",
    elevationLabel: "+12 ft Mid Hull",
    description:
      "Mid-level outward glass bubble pod with direct horizon framing and distraction-suppressed focus HUD.",
    cameraPos: [6.4, 3.8, -21.8],
    lookAt: [8.0, 0.5, -85],
    markerPos: [6.2, 3.6, -20.2],
  },

  // =========================================================================
  // 3. LEVL LONGEVITY LOUNGE & SPA WING (West Offshoot: x ≈ -28)
  // =========================================================================
  {
    id: "levl-lounge-entry",
    label: "LEVL Longevity Lounge — Overview",
    shortLabel: "LEVL Lounge",
    wing: "levl",
    kind: "overview",
    mode: "explore",
    description:
      "Botanical luxury longevity wing in ivory travertine, sage greenery, and warm timber featuring the Protocol Bar, Research Screening Wall, and Spa Circuit.",
    cameraPos: [-21.5, 2.2, 3.5],
    lookAt: [-30.0, 1.8, -9.0],
    markerPos: [-24.0, 0.2, 0.0],
  },
  {
    id: "levl-protocol-bar",
    label: "LEVL Protocol Bar & AI Bartender",
    shortLabel: "Protocol Bar",
    wing: "levl",
    kind: "protocol_bar",
    mode: "explore",
    defaultModalitySlug: "zone-2-and-vo2max-training",
    description:
      "Speak privately with the holographic LEVL Protocol Bartender to explore RCT-backed longevity modalities and build a draft protocol for your LEVL Bench.",
    cameraPos: [-28.2, 1.85, -2.2],
    lookAt: [-34.5, 1.85, -4.5],
    markerPos: [-32.5, 1.2, -4.5],
  },
  {
    id: "levl-screening-wall",
    label: "LEVL Research Screening Wall",
    shortLabel: "Screening Wall",
    wing: "levl",
    kind: "screening_wall",
    mode: "explore",
    description:
      "Curated longevity science screenings with independent audio controls and linked PubMed evidence cards.",
    cameraPos: [-27.5, 2.1, -6.5],
    lookAt: [-28.5, 2.8, -15.5],
    markerPos: [-28.5, 2.6, -14.8],
  },
  {
    id: "levl-spa-sauna",
    label: "Thermal Conditioning Suite — Finnish Dry Sauna & Cold Plunge",
    shortLabel: "Sauna & Cold Plunge",
    wing: "levl",
    kind: "spa_station",
    mode: "explore",
    defaultModalitySlug: "finnish-sauna",
    description:
      "Inspect human clinical evidence, HSP70/eNOS mechanisms, hypertrophy timing caveats, and real-world protocols for heat and cold exposure.",
    cameraPos: [-33.0, 1.8, -9.5],
    lookAt: [-38.5, 1.6, -12.0],
    markerPos: [-36.8, 1.2, -11.5],
  },
  {
    id: "levl-spa-hbot",
    label: "Hyperbaric Oxygen (HBOT) & Photobiomodulation Alcove",
    shortLabel: "HBOT & Red Light",
    wing: "levl",
    kind: "spa_station",
    mode: "explore",
    defaultModalitySlug: "hyperbaric-oxygen-therapy",
    description:
      "Review hyperoxic-hypoxic paradox trials (2.0 ATA), red/NIR irradiance windows, contraindications, and clinical evidence grades.",
    cameraPos: [-23.5, 1.8, -9.5],
    lookAt: [-21.0, 1.6, -14.2],
    markerPos: [-22.0, 1.2, -13.0],
  },

  // =========================================================================
  // 4. AGI FUTURES BUILDER CLUB WING (East Offshoot: x ≈ +28)
  // =========================================================================
  {
    id: "agi-club-overview",
    label: "AGI Futures Inventor's Club — Overview",
    shortLabel: "AGI Futures Club",
    wing: "agifutures",
    kind: "overview",
    mode: "explore",
    description:
      "Optimistic inventor's club in walnut, copper, and graphite with swipable 3D holographic startup idea booths, central holo-table, AI Builder Guide, and Founder Matching wall.",
    cameraPos: [21.5, 2.2, 3.8],
    lookAt: [29.5, 1.9, -8.5],
    markerPos: [24.0, 0.2, 0.0],
  },
  {
    id: "agi-holo-table",
    label: "Central Collaborative Holographic Blueprint Table",
    shortLabel: "Central Holo-Table",
    wing: "agifutures",
    kind: "holo_table",
    mode: "explore",
    defaultSectorId: "homes-cities",
    description:
      "Interactive holographic centerpiece where you can swipe through all 33 canonical AGI Futures startup ideas and switch across all 6 civilizational sectors in place.",
    cameraPos: [28.0, 2.05, -2.2],
    lookAt: [28.0, 1.35, -6.5],
    markerPos: [28.0, 1.2, -6.5],
  },
  {
    id: "agi-booth-homes",
    label: "Idea Booth 1 — Homes & Thriving Communities (Signal House, Porchfront, Hearth)",
    shortLabel: "Booth: Homes & Cities",
    wing: "agifutures",
    kind: "idea_booth",
    mode: "explore",
    defaultSectorId: "homes-cities",
    description:
      "Holographic booth showcasing Signal House, Porchfront, Hearth, HouseGraph, HomeQuote, and CommonGround. Swipe ideas or switch sectors in place.",
    cameraPos: [31.5, 1.85, -3.5],
    lookAt: [36.8, 1.85, -3.5],
    markerPos: [35.8, 1.5, -3.5],
  },
  {
    id: "agi-booth-energy",
    label: "Idea Booth 2 — Clean Energy & Planetary Scale (HelioTerra, Skyhold)",
    shortLabel: "Booth: Clean Energy",
    wing: "agifutures",
    kind: "idea_booth",
    mode: "explore",
    defaultSectorId: "clean-energy-planet",
    description:
      "Holographic booth showcasing HelioTerra, Skyhold, Wild Return, and Waypoint. Swipe ideas or switch sectors in place.",
    cameraPos: [31.5, 1.85, -7.5],
    lookAt: [36.8, 1.85, -7.5],
    markerPos: [35.8, 1.5, -7.5],
  },
  {
    id: "agi-booth-biotech",
    label: "Idea Booth 3 — Biotech, Health & Longevity (BioWalls, BioArk, BiomeX)",
    shortLabel: "Booth: Biotech & Health",
    wing: "agifutures",
    kind: "idea_booth",
    mode: "explore",
    defaultSectorId: "biotech-longevity",
    description:
      "Holographic booth showcasing BioWalls, BioArk, BiomeX, Attune, Thoughtline, and Afterlight.",
    cameraPos: [31.5, 1.85, -11.5],
    lookAt: [36.8, 1.85, -11.5],
    markerPos: [35.8, 1.5, -11.5],
  },
  {
    id: "agi-booth-ai",
    label: "Idea Booth 4 — AI & Economic Agency (Main Street Legacy, AI Founder Lab)",
    shortLabel: "Booth: AI & Enterprise",
    wing: "agifutures",
    kind: "idea_booth",
    mode: "explore",
    defaultSectorId: "ai-autonomous-enterprise",
    description:
      "Holographic booth showcasing Main Street Legacy, AI Founder Lab, Agentable, Helm, ProofRun, SellCraft, and Easy Exit.",
    cameraPos: [25.5, 1.85, -11.2],
    lookAt: [25.5, 1.85, -15.8],
    markerPos: [25.5, 1.5, -14.8],
  },
  {
    id: "agi-builder-guide",
    label: "AI Builder Guide Desk",
    shortLabel: "AI Builder Guide",
    wing: "agifutures",
    kind: "builder_guide",
    mode: "explore",
    defaultSectorId: "ai-autonomous-enterprise",
    description:
      "Consult the holographic AGI Futures Builder Guide to unpack blueprint assumptions, design falsifiable 14-day experiments, and match your skills to high-leverage problems.",
    cameraPos: [24.2, 1.8, -2.5],
    lookAt: [20.5, 1.65, -4.0],
    markerPos: [21.5, 1.3, -4.0],
  },
  {
    id: "agi-matching-wall",
    label: "Founder Matching Wall (Building / Looking For / Can Help)",
    shortLabel: "Founder Matching",
    wing: "agifutures",
    kind: "matching_board",
    mode: "connect",
    description:
      "Browse asynchronous builder intentions, post your own Building / Looking For / Can Help banner, and leave high-signal introductions or proof-of-work contributions.",
    cameraPos: [24.5, 1.9, -7.8],
    lookAt: [19.8, 2.1, -7.8],
    markerPos: [20.5, 2.0, -7.8],
  },

  // =========================================================================
  // 5. UPPER CONSERVATORY & BOTANICAL READING DECK
  // =========================================================================
  {
    id: "conservatory-deck",
    label: "Botanical Library & Quiet Conservatory",
    shortLabel: "Library Conservatory",
    wing: "conservatory",
    kind: "reading_nook",
    mode: "focus",
    elevationLabel: "+22 ft Canopy Deck",
    description:
      "Elevated botanical reading terrace overlooking the entire orbital atrium and Earth horizon for quiet study and reviewing saved ideas & protocols.",
    cameraPos: [0, 7.2, 6.5],
    lookAt: [0, 3.0, -25.0],
    markerPos: [0, 6.2, 5.5],
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
