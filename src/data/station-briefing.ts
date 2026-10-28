export interface StationBriefingItem {
  id: string;
  sourceBrand: "HyperAbundance" | "AGI Futures" | "LEVL";
  category: "Blueprint" | "Longevity Research" | "Essay" | "Community Milestone" | "Screening";
  title: string;
  publishedDate: string;
  summary: string;
  actionLabel: string;
  actionType: "visit_waypoint" | "open_idea_booth" | "open_levl_modality" | "external_link";
  targetWaypointId?: string;
  targetIdeaSlug?: string;
  targetModalitySlug?: string;
  externalUrl?: string;
}

export interface MemberBannerRecord {
  id: string;
  displayName: string;
  handle: string;
  roleTag: string;
  avatarColor: string;
  currentDestination: string;
  presenceStatus: "focus" | "available" | "exploring";
  building: string;
  lookingFor: string;
  canHelpWith: string;
  linkedIdeaSlug?: string;
  sectorTags: string[];
  isCurrentUser?: boolean;
}

export const STATION_BRIEFING_ITEMS: StationBriefingItem[] = [
  {
    id: "brief-signal-house",
    sourceBrand: "AGI Futures",
    category: "Blueprint",
    title: "Signal House: High-Agency Co-Living & Builder Guild Campuses",
    publishedDate: "2026-10-26",
    summary:
      "Why 2-to-5 person AI-era teams need shared physical compounds with fabrication labs, shared compute, and high-trust peer density.",
    actionLabel: "Inspect Hologram in Booth",
    actionType: "open_idea_booth",
    targetWaypointId: "agi-booth-homes",
    targetIdeaSlug: "signal-house",
    externalUrl: "https://www.agifutures.org/signal-house",
  },
  {
    id: "brief-levl-sauna-vo2",
    sourceBrand: "LEVL",
    category: "Longevity Research",
    title: "Synergy Analysis: Post-Zone-2 Finnish Sauna & Vascular Compliance",
    publishedDate: "2026-10-25",
    summary:
      "Evidence synthesis from JAMA Internal Medicine & human RCTs on combining aerobic base conditioning with 80°C+ heat exposure for eNOS and HSP70 upregulation.",
    actionLabel: "Open in LEVL Protocol Bar",
    actionType: "open_levl_modality",
    targetWaypointId: "levl-protocol-bar",
    targetModalitySlug: "finnish-sauna",
    externalUrl: "https://longevityreviews.org/modalities/finnish-sauna",
  },
  {
    id: "brief-helioterra",
    sourceBrand: "AGI Futures",
    category: "Blueprint",
    title: "HelioTerra: Autonomous Desert Solar & Atmospheric Water Foundries",
    publishedDate: "2026-10-23",
    summary:
      "Self-deploying robotic racking teams that turn stranded hyper-arid sunlight into off-grid compute clusters and atmospheric water oases.",
    actionLabel: "Inspect Hologram in Booth",
    actionType: "open_idea_booth",
    targetWaypointId: "agi-booth-energy",
    targetIdeaSlug: "helioterra",
    externalUrl: "https://www.agifutures.org/helioterra",
  },
  {
    id: "brief-biowalls",
    sourceBrand: "AGI Futures",
    category: "Blueprint",
    title: "BioWalls: Active Rhizosphere Air Scrubbing for Cognitive Clarity",
    publishedDate: "2026-10-20",
    summary:
      "Engineered root-zone microbiomes that strip indoor VOCs and stabilize CO2 levels across high-output workspaces.",
    actionLabel: "Inspect Hologram in Booth",
    actionType: "open_idea_booth",
    targetWaypointId: "agi-booth-biotech",
    targetIdeaSlug: "biowalls",
    externalUrl: "https://www.agifutures.org/biowalls",
  },
  {
    id: "brief-main-street-legacy",
    sourceBrand: "AGI Futures",
    category: "Blueprint",
    title: "Main Street Legacy: AI-Augmented Succession for Retiring SMBs",
    publishedDate: "2026-10-18",
    summary:
      "Pairing next-generation operators with retiring trade and precision-manufacturing owners using an agentic operational backbone.",
    actionLabel: "Inspect Hologram in Booth",
    actionType: "open_idea_booth",
    targetWaypointId: "agi-booth-ai",
    targetIdeaSlug: "main-street-legacy",
    externalUrl: "https://www.agifutures.org/main-street-legacy",
  },
  {
    id: "brief-hyperabundance-manifesto",
    sourceBrand: "HyperAbundance",
    category: "Essay",
    title: "Design Principle of the Orbital Atrium: Attention Sovereignty & Useful Beauty",
    publishedDate: "2026-10-28",
    summary:
      "Why every destination in our shared orbital commons leads to a concrete work session, a verifiable scientific protocol, or an authentic builder contribution.",
    actionLabel: "Enter Earthview Pod #1",
    actionType: "visit_waypoint",
    targetWaypointId: "pod-earthview-1",
  },
];

// Honest community matching directory (clearly marked as asynchronous directory profiles from AGI Futures)
export const INITIAL_MEMBER_BANNERS: MemberBannerRecord[] = [
  {
    id: "member-aria-lin",
    displayName: "Dr. Aria Lin",
    handle: "arialin_bio",
    roleTag: "Biotech Researcher",
    avatarColor: "#a78bfa",
    currentDestination: "levl-protocol-bar",
    presenceStatus: "available",
    building: "Closed-loop rhizosphere VOC & CO2 sensor arrays inspired by the BioWalls blueprint.",
    lookingFor: "Industrial designer with low-noise peristaltic/aeroponic misting experience.",
    canHelpWith: "Plant-microbiome shotgun metagenomics, IRB study design, and wet-lab protocol validation.",
    linkedIdeaSlug: "biowalls",
    sectorTags: ["Biotech, Health & Longevity", "Homes & Thriving Communities"],
  },
  {
    id: "member-devon-hale",
    displayName: "Devon Hale",
    handle: "devonhale",
    roleTag: "Robotics Systems Lead",
    avatarColor: "#38bdf8",
    currentDestination: "agi-booth-energy",
    presenceStatus: "exploring",
    building: "Autonomous screw-pile & solar torque-tube rover prototype (HelioTerra wedge).",
    lookingFor: "Power-electronics cofounder and Mojave desert test-site landowner.",
    canHelpWith: "ROS2 outdoor SLAM, RTK-GNSS actuator control, and ruggedized drivetrain BOMs.",
    linkedIdeaSlug: "helioterra",
    sectorTags: ["Clean Energy & Planetary Scale", "Coordination, Robotics & Civic Trust"],
  },
  {
    id: "member-soren-k",
    displayName: "Soren Lindqvist",
    handle: "soren_builds",
    roleTag: "Founder / Operator",
    avatarColor: "#f59e0b",
    currentDestination: "pod-earthview-2",
    presenceStatus: "focus",
    building: "Voice-to-SOP ingestion pipeline for HVAC & precision machine shop transitions (Main Street Legacy).",
    lookingFor: "SBA 7(a) acquisition operators currently in exclusivity with $1M–$3M EBITDA shops.",
    canHelpWith: "Agentic ERP/QuickBooks integrations, tool-calling guardrails, and B2B field onboarding.",
    linkedIdeaSlug: "main-street-legacy",
    sectorTags: ["AI & Economic Agency"],
  },
  {
    id: "member-maya-okafor",
    displayName: "Maya Okafor",
    handle: "maya_urban",
    roleTag: "Architectural Developer",
    avatarColor: "#34d399",
    currentDestination: "agi-booth-homes",
    presenceStatus: "available",
    building: "12-unit cottage-court pocket neighborhood in Austin using panelized mass timber (Porchfront).",
    lookingFor: "Civil engineer familiar with shared courtyard stormwater & municipal pre-approved plans.",
    canHelpWith: "Infill land underwriting, community co-op governance, and pro-forma modeling.",
    linkedIdeaSlug: "porchfront",
    sectorTags: ["Homes & Thriving Communities"],
  },
];
