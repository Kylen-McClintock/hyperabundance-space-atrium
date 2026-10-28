export type SectorBoothId =
  | "homes-cities"
  | "clean-energy-planet"
  | "biotech-longevity"
  | "ai-autonomous-enterprise"
  | "human-flourishing-media"
  | "governance-coordination";

export type HologramArchetype =
  | "courtyard-village"
  | "solar-ring"
  | "biowall-matrix"
  | "agent-lattice"
  | "drone-swarm"
  | "neural-crown"
  | "stratosphere-platform"
  | "biobank-vault"
  | "civic-agora"
  | "orbital-spire";

export interface AgiFuturesIdea {
  slug: string;
  title: string;
  scoreTitle: string;
  description: string;
  sectorId: SectorBoothId;
  sectorLabel: string;
  hologramArchetype: HologramArchetype;
  accentColor: string;
  scores: {
    moat: number;
    difficulty: number;
    impact: number;
  };
  forecasts: {
    y2030: string;
    y2035: string;
    y2040: string;
    unicornEta: string;
  };
  thesis: string;
  whyNow: string;
  keyAssumptions: string[];
  firstExperiment: string;
  neededSkills: string[];
  canonicalUrl: string;
  isEditorialBlueprint: boolean;
  featuredInBooth?: boolean;
}

export interface SectorBoothMeta {
  id: SectorBoothId;
  title: string;
  subtitle: string;
  boothSignage: string;
  accentHex: string;
  positionIndex: number;
}

export const SECTOR_BOOTHS: SectorBoothMeta[] = [
  {
    id: "homes-cities",
    title: "Homes & Thriving Communities",
    subtitle: "High-trust neighborhoods, modular housing, and third places",
    boothSignage: "HOMES FOR A HEALTHY PLANET",
    accentHex: "#34d399",
    positionIndex: 0,
  },
  {
    id: "clean-energy-planet",
    title: "Clean Energy & Planetary Scale",
    subtitle: "Terraforming-grade solar, stratospheric infrastructure & rewilding",
    boothSignage: "ENERGY FOR PLANETARY ABUNDANCE",
    accentHex: "#38bdf8",
    positionIndex: 1,
  },
  {
    id: "biotech-longevity",
    title: "Biotech, Health & Longevity",
    subtitle: "Living indoor ecosystems, microbiome synthesis & neuro-resilience",
    boothSignage: "BIOTECH FOR LONGER LIVES",
    accentHex: "#a78bfa",
    positionIndex: 2,
  },
  {
    id: "ai-autonomous-enterprise",
    title: "AI & Economic Agency",
    subtitle: "Main-street succession, AI founder labs & autonomous verification",
    boothSignage: "AI FOR SHARED PROSPERITY",
    accentHex: "#f59e0b",
    positionIndex: 3,
  },
  {
    id: "human-flourishing-media",
    title: "Human Flourishing & Deep Learning",
    subtitle: "Socratic tutors, high-signal culture & sovereign digital twins",
    boothSignage: "WISDOM FOR AN AI ERA",
    accentHex: "#f472b6",
    positionIndex: 4,
  },
  {
    id: "governance-coordination",
    title: "Coordination, Robotics & Civic Trust",
    subtitle: "Swarm robotics, collective intelligence & verifiable institutions",
    boothSignage: "ROBOTICS & CIVIC COORDINATION",
    accentHex: "#2dd4bf",
    positionIndex: 5,
  },
];

const AGI_BASE_URL =
  process.env.NEXT_PUBLIC_AGIFUTURES_URL || "https://www.agifutures.org";

export const AGI_FUTURES_IDEAS: AgiFuturesIdea[] = [
  // =========================================================================
  // 1. HOMES & THRIVING COMMUNITIES (6 Ideas)
  // =========================================================================
  {
    slug: "signal-house",
    title: "Signal House",
    scoreTitle: "High-Agency Co-Living & Builder Guild Houses",
    description:
      "A network of permanent, architectural residency houses in high-signal neighborhoods where builders, researchers, and founders live, prototype, and compound trust.",
    sectorId: "homes-cities",
    sectorLabel: "Homes & Thriving Communities",
    hologramArchetype: "courtyard-village",
    accentColor: "#34d399",
    scores: { moat: 74, difficulty: 52, impact: 88 },
    forecasts: {
      y2030: "$380M",
      y2035: "$2.4B",
      y2040: "$8.5B",
      unicornEta: "2032",
    },
    thesis:
      "Remote work unbundled geography, but high-trust proximity remains the scarcest input to ambitious creation. Signal House turns residential real estate into curated builder campuses.",
    whyNow:
      "AI shrinks startup team sizes to 2-5 people, creating massive demand for shared physical guild environments with embedded fabrication, compute, and peer review.",
    keyAssumptions: [
      "Top builders will pay a 15-25% premium over standard luxury leases for curated peer density",
      "Master-lease + propCo flywheel can scale across 12 hub cities without diluting admission bar",
    ],
    firstExperiment:
      "Run a 90-day pop-up Signal House in a leased 8-bedroom architectural compound with 12 vetted AI/biotech builders and track project launches.",
    neededSkills: ["Real Estate Ops", "Community Curation", "Spatial Architecture"],
    canonicalUrl: `${AGI_BASE_URL}/signal-house`,
    isEditorialBlueprint: true,
    featuredInBooth: true,
  },
  {
    slug: "porchfront",
    title: "Porchfront",
    scoreTitle: "Walkable Pocket Neighborhood Developer",
    description:
      "Micro-neighborhood developments centered on shared courtyard greens, front porches, and intergenerational commons rather than isolated garages.",
    sectorId: "homes-cities",
    sectorLabel: "Homes & Thriving Communities",
    hologramArchetype: "courtyard-village",
    accentColor: "#34d399",
    scores: { moat: 78, difficulty: 68, impact: 92 },
    forecasts: {
      y2030: "$620M",
      y2035: "$4.1B",
      y2040: "$16.0B",
      unicornEta: "2031",
    },
    thesis:
      "Suburban sprawl engineered loneliness into the built environment. Cottage-court pocket neighborhoods unlock 2x density with 5x spontaneous neighbor interaction.",
    whyNow:
      "By-right middle-housing zoning reforms across US states + factory panelized timber cut infill construction timelines by 40%.",
    keyAssumptions: [
      "Pre-approved courtyard site plans can clear municipal permitting in under 90 days",
      "Shared courtyard amenities justify 18% higher price-per-square-foot",
    ],
    firstExperiment:
      "Pre-sell 10 courtyard cottages on a single 1.5-acre infill parcel using interactive 3D walkthroughs before breaking ground.",
    neededSkills: ["Modular Construction", "Zoning & Land Entitlement", "Urban Design"],
    canonicalUrl: `${AGI_BASE_URL}/porchfront`,
    isEditorialBlueprint: true,
  },
  {
    slug: "hearth",
    title: "Hearth",
    scoreTitle: "Neighborhood Family Club & Third Place",
    description:
      "Modern neighborhood family clubs combining drop-in childcare, quiet deep-work cabanas, communal family dinners, and youth maker studios under one roof.",
    sectorId: "homes-cities",
    sectorLabel: "Homes & Thriving Communities",
    hologramArchetype: "courtyard-village",
    accentColor: "#10b981",
    scores: { moat: 71, difficulty: 56, impact: 86 },
    forecasts: {
      y2030: "$450M",
      y2035: "$3.0B",
      y2040: "$11.2B",
      unicornEta: "2032",
    },
    thesis:
      "Nuclear families are exhausted because parenting and remote work happen in isolation. Hearth restores the village within a 10-minute walk.",
    whyNow:
      "Commercial retail vacancy offers prime ground-floor corner spaces at historic discounts while dual-income flexible parents seek integrated care + workspace.",
    keyAssumptions: [
      "180 founding families per location reach break-even within 5 months of opening",
      "Co-op membership structure keeps staff turnover under 15% annually",
    ],
    firstExperiment:
      "Launch a weekend + 3-afternoon pop-up Hearth club with 40 local families in a partnered community space.",
    neededSkills: ["Hospitality Operations", "Early Childhood Design", "Local GTM"],
    canonicalUrl: `${AGI_BASE_URL}/hearth`,
    isEditorialBlueprint: true,
  },
  {
    slug: "housegraph",
    title: "HouseGraph",
    scoreTitle: "Living Digital Twin for Home Systems",
    description:
      "A persistent 3D spatial & mechanical digital twin of every home—tracking wiring, plumbing, serial numbers, preventative maintenance, and autonomous contractor dispatch.",
    sectorId: "homes-cities",
    sectorLabel: "Homes & Thriving Communities",
    hologramArchetype: "orbital-spire",
    accentColor: "#6ee7b7",
    scores: { moat: 82, difficulty: 60, impact: 80 },
    forecasts: {
      y2030: "$510M",
      y2035: "$3.8B",
      y2040: "$14.0B",
      unicornEta: "2031",
    },
    thesis:
      "A home is most families' largest asset, yet its documentation is a shoebox of receipts. HouseGraph turns phone LiDAR + inspection scans into a living operating manual.",
    whyNow:
      "Multimodal vision models can now extract exact appliance models, pipe materials, and code risks from a 10-minute smartphone walkthrough.",
    keyAssumptions: [
      "Home inspectors will bundle HouseGraph scans for a $99 rev-share",
      "Homeowners retain the twin across ownership transfers",
    ],
    firstExperiment:
      "Partner with 5 independent home inspectors to deliver interactive HouseGraph twins on 100 home closings.",
    neededSkills: ["3D Computer Vision", "PropTech Integrations", "Home Services Marketplace"],
    canonicalUrl: `${AGI_BASE_URL}/housegraph`,
    isEditorialBlueprint: true,
  },
  {
    slug: "homequote",
    title: "HomeQuote",
    scoreTitle: "Instant AI Scope & Fixed-Price Trades Engine",
    description:
      "Computer-vision scoping engine that converts homeowner video walkthroughs into standardized bills of materials and instant bindable contractor bids.",
    sectorId: "homes-cities",
    sectorLabel: "Homes & Thriving Communities",
    hologramArchetype: "agent-lattice",
    accentColor: "#34d399",
    scores: { moat: 69, difficulty: 48, impact: 77 },
    forecasts: {
      y2030: "$340M",
      y2035: "$2.1B",
      y2040: "$7.4B",
      unicornEta: "2032",
    },
    thesis:
      "Skilled trades waste 30% of their week driving to unpaid estimate appointments. Standardized AI scoping eliminates quote friction for both sides.",
    whyNow:
      "Spatial depth estimation on mobile phones + regional material price APIs enable ±5% cost accuracy from video alone.",
    keyAssumptions: [
      "Licensed HVAC/electrical/plumbing shops will accept pre-scoped jobs without an initial site visit",
    ],
    firstExperiment:
      "Scope 50 heat-pump and panel-upgrade installs via video in one metro area and compare AI BOM against final contractor invoices.",
    neededSkills: ["Vision-Language Models", "Contractor Marketplace", "Supply Chain Pricing"],
    canonicalUrl: `${AGI_BASE_URL}/homequote`,
    isEditorialBlueprint: true,
  },
  {
    slug: "commonground",
    title: "CommonGround",
    scoreTitle: "Civic Plaza & Third-Space Activation OS",
    description:
      "Turnkey software, modular street furniture, and micro-permitting platform that transforms underused urban plazas and parking lots into vibrant daily commons.",
    sectorId: "homes-cities",
    sectorLabel: "Homes & Thriving Communities",
    hologramArchetype: "civic-agora",
    accentColor: "#34d399",
    scores: { moat: 66, difficulty: 50, impact: 84 },
    forecasts: {
      y2030: "$220M",
      y2035: "$1.5B",
      y2040: "$5.2B",
      unicornEta: "2034",
    },
    thesis:
      "Cities have plenty of square footage but broken activation loops. CommonGround pre-clears insurance, sound limits, and kiosk booking for local micro-entrepreneurs.",
    whyNow:
      "Downtown business improvement districts are urgently funding foot-traffic revitalization post-office-commute.",
    keyAssumptions: [
      "BIDs and municipalities will sign annual SaaS + modular hardware leases",
    ],
    firstExperiment:
      "Activate 3 dead downtown plazas for 60 days with bookable micro-kiosks and measure footfall uplift.",
    neededSkills: ["Civic Partnerships", "Industrial Design", "Event Marketplace"],
    canonicalUrl: `${AGI_BASE_URL}/commonground`,
    isEditorialBlueprint: true,
  },

  // =========================================================================
  // 2. CLEAN ENERGY & PLANETARY SCALE (4 Ideas)
  // =========================================================================
  {
    slug: "helioterra",
    title: "HelioTerra",
    scoreTitle: "Autonomous Desert Solar & Atmospheric Water Foundry",
    description:
      "Self-deploying robotic solar fields in hyper-arid basins that co-generate gigawatt power, harvest atmospheric water, and create shaded regenerative micro-oases.",
    sectorId: "clean-energy-planet",
    sectorLabel: "Clean Energy & Planetary Scale",
    hologramArchetype: "solar-ring",
    accentColor: "#38bdf8",
    scores: { moat: 89, difficulty: 84, impact: 98 },
    forecasts: {
      y2030: "$1.1B",
      y2035: "$12.5B",
      y2040: "$64.0B",
      unicornEta: "2030",
    },
    thesis:
      "Solar modules are now cheaper than fencing; labor and grid interconnect are the bottlenecks. Autonomous robotic trenching, racking, and co-located compute/water loops unlock desert abundance.",
    whyNow:
      " Solar PV under $0.10/W + ruggedized field robotics allow 24/7 autonomous array construction.",
    keyAssumptions: [
      "Robotic racking reduces soft installation labor costs by >60%",
      "Off-grid AI training clusters and synthetic fuel synthesis monetize stranded gigawatts immediately",
    ],
    firstExperiment:
      "Demonstrate a 2-robot team autonomously staking and mounting a 100kW solar row in Mojave test terrain.",
    neededSkills: ["Field Robotics", "Power Electronics", "Project Finance"],
    canonicalUrl: `${AGI_BASE_URL}/helioterra`,
    isEditorialBlueprint: true,
    featuredInBooth: true,
  },
  {
    slug: "skyhold",
    title: "Skyhold",
    scoreTitle: "Stratospheric Persistent Solar Pseudo-Satellites",
    description:
      "Ultra-lightweight solar-electric stratospheric wings cruising at 65,000 ft for months at a time—delivering sub-millisecond regional broadband, wildfire detection, and hyperspectral Earth imaging.",
    sectorId: "clean-energy-planet",
    sectorLabel: "Clean Energy & Planetary Scale",
    hologramArchetype: "stratosphere-platform",
    accentColor: "#0ea5e9",
    scores: { moat: 91, difficulty: 86, impact: 94 },
    forecasts: {
      y2030: "$850M",
      y2035: "$7.8B",
      y2040: "$32.0B",
      unicornEta: "2030",
    },
    thesis:
      "High-altitude platform stations (HAPS) combine the persistent local dwell of a cell tower with the wide coverage of a satellite at 1/20th the launch cost.",
    whyNow:
      "450 Wh/kg silicon-anode lithium batteries + AI gust-alleviation flight control finally solve the winter stratospheric night endurance barrier.",
    keyAssumptions: [
      "Continuous 90-day stratospheric station-keeping at 35° latitude",
      "FAA/ICAO high-altitude corridor clearance for autonomous fleet ops",
    ],
    firstExperiment:
      "Fly a 12-meter subscale wing with AI gust-load control through a 48-hour continuous solar-recharge cycle.",
    neededSkills: ["Aeroelasticity", "High-Energy Battery Systems", "Avionics Autonomy"],
    canonicalUrl: `${AGI_BASE_URL}/skyhold`,
    isEditorialBlueprint: true,
  },
  {
    slug: "wild-return",
    title: "Wild Return",
    scoreTitle: "Autonomous Ecological Rewilding & Biodiversity Credits",
    description:
      "Drone-seeded mycorrhizal restoration and acoustic/eDNA sensor networks that turn degraded industrial land into verified, high-yield biodiversity corridors.",
    sectorId: "clean-energy-planet",
    sectorLabel: "Clean Energy & Planetary Scale",
    hologramArchetype: "biowall-matrix",
    accentColor: "#22c55e",
    scores: { moat: 80, difficulty: 64, impact: 95 },
    forecasts: {
      y2030: "$410M",
      y2035: "$3.4B",
      y2040: "$15.0B",
      unicornEta: "2032",
    },
    thesis:
      "Rewilding fails when planted monocultures die in year two. Multi-species pelletized seed+fungi pods paired with continuous acoustic & eDNA verification make ecological recovery auditable.",
    whyNow:
      "Corporate nature-positive mandates + low-cost bioacoustic AI sensors create liquid demand for verified ecological uplift.",
    keyAssumptions: [
      "Pelletized mycorrhizal seed pods achieve >35% establishment without irrigation",
    ],
    firstExperiment:
      "Restore a 50-acre post-mining or post-burn parcel alongside an unseeded control plot and publish live acoustic species indices.",
    neededSkills: ["Restoration Ecology", "Bioacoustics ML", "Environmental Markets"],
    canonicalUrl: `${AGI_BASE_URL}/wild-return`,
    isEditorialBlueprint: true,
  },
  {
    slug: "waypoint",
    title: "Waypoint",
    scoreTitle: "Autonomous Megawatt Charging & Freight Micro-Hubs",
    description:
      "Prefabricated, battery-buffered megawatt charging plazas and autonomous trailer-swap depots at highway freight relays.",
    sectorId: "clean-energy-planet",
    sectorLabel: "Clean Energy & Planetary Scale",
    hologramArchetype: "solar-ring",
    accentColor: "#38bdf8",
    scores: { moat: 83, difficulty: 72, impact: 89 },
    forecasts: {
      y2030: "$760M",
      y2035: "$6.2B",
      y2040: "$24.0B",
      unicornEta: "2031",
    },
    thesis:
      "Electric and autonomous Class-8 trucks are bottlenecked by 3-year utility substation queues. Battery-buffered solar micro-hubs deploy in 90 days.",
    whyNow:
      "LFP stationary storage costs below $75/kWh allow megawatt peak shaving on existing distribution lines.",
    keyAssumptions: [
      "Relay drop-and-hook freight corridors concentrate 60% of regional drayage volume on 40 highway nodes",
    ],
    firstExperiment:
      "Deploy one containerized 4MWh battery-buffered charging relay with 2 regional fleet partners.",
    neededSkills: ["Grid Interconnect", "Heavy Fleet Logistics", "Infrastructure Finance"],
    canonicalUrl: `${AGI_BASE_URL}/waypoint`,
    isEditorialBlueprint: true,
  },

  // =========================================================================
  // 3. BIOTECH, HEALTH & LONGEVITY (6 Ideas)
  // =========================================================================
  {
    slug: "biowalls",
    title: "BioWalls",
    scoreTitle: "Active Bio-Filtration & Circadian Living Walls",
    description:
      "Modular architectural plant walls with root-zone microbiome air scrubbers that actively strip VOCs, regulate humidity, and stabilize indoor CO2 for peak cognitive performance.",
    sectorId: "biotech-longevity",
    sectorLabel: "Biotech, Health & Longevity",
    hologramArchetype: "biowall-matrix",
    accentColor: "#a78bfa",
    scores: { moat: 77, difficulty: 58, impact: 87 },
    forecasts: {
      y2030: "$490M",
      y2035: "$3.5B",
      y2040: "$12.8B",
      unicornEta: "2031",
    },
    thesis:
      "Humans spend 90% of life indoors breathing stagnant, high-CO2 air that impairs cognition by 15-30%. Active rhizosphere bio-walls turn walls into living lungs.",
    whyNow:
      "Engineered root-zone consortia + silent aeroponic misting cartridges make living walls self-maintaining and 10x more effective than passive houseplants.",
    keyAssumptions: [
      "Swap-in plant/microbiome cartridges reduce maintenance visits to once per quarter",
      "Measurable VOC/CO2 reduction drives enterprise and longevity-home adoption",
    ],
    firstExperiment:
      "Build 10 instrumented aeroponic rhizosphere wall units and measure cognitive test scores & indoor air quality in closed offices.",
    neededSkills: ["Plant Microbiome", "Industrial & HVAC Design", "Hardware Subscriptions"],
    canonicalUrl: `${AGI_BASE_URL}/biowalls`,
    isEditorialBlueprint: true,
    featuredInBooth: true,
  },
  {
    slug: "bioark",
    title: "BioArk",
    scoreTitle: "Personal Cryo-Biobank & Young-Cell Vault",
    description:
      "Consumer-accessible cryopreservation of your youngest, healthiest autologous stem cells, iPSC lines, and immune repertoire for future regenerative therapies.",
    sectorId: "biotech-longevity",
    sectorLabel: "Biotech, Health & Longevity",
    hologramArchetype: "biobank-vault",
    accentColor: "#c084fc",
    scores: { moat: 88, difficulty: 78, impact: 96 },
    forecasts: {
      y2030: "$680M",
      y2035: "$5.9B",
      y2040: "$28.0B",
      unicornEta: "2031",
    },
    thesis:
      "Your cells today are the youngest they will ever be again. Banking low-mutation autologous tissue now locks in biological optionality for the epigenetic reprogramming era.",
    whyNow:
      "Non-invasive skin punch / peripheral blood iPSC derivation costs have dropped 10x with automated closed-system cell culture.",
    keyAssumptions: [
      "CLIA/FDA tissue banking compliance can be productized at <$1,500 upfront + $25/mo storage",
    ],
    firstExperiment:
      "Partner with 3 longevity clinics to offer turnkey autologous fibroblast & PBMC cryo-banking to 200 founding members.",
    neededSkills: ["Cryobiology", "FDA cGTP Compliance", "Longevity Clinical Ops"],
    canonicalUrl: `${AGI_BASE_URL}/bioark`,
    isEditorialBlueprint: true,
  },
  {
    slug: "biomex",
    title: "BiomeX",
    scoreTitle: "Precision Keystone Microbiome Guild Synthesis",
    description:
      "Defined, synthetic consortia of keystone gut and oral microbes paired with targeted prebiotic glycans to restore metabolic and immune resilience.",
    sectorId: "biotech-longevity",
    sectorLabel: "Biotech, Health & Longevity",
    hologramArchetype: "biobank-vault",
    accentColor: "#a78bfa",
    scores: { moat: 86, difficulty: 80, impact: 93 },
    forecasts: {
      y2030: "$590M",
      y2035: "$4.8B",
      y2040: "$21.0B",
      unicornEta: "2031",
    },
    thesis:
      "Single-strain probiotics wash right through the gut because microbes engraft only as cooperative metabolic guilds with matching substrates.",
    whyNow:
      "Metagenomic metabolic modeling + anaerobic continuous fermentation allow stable co-lyophilization of strict anaerobes.",
    keyAssumptions: [
      "Synbiotic guild + glycan pairing achieves >60% 90-day engraftment in human stool shotgun sequencing",
    ],
    firstExperiment:
      "Run an IRB-approved 60-person n-of-1 crossover study measuring butyrate production and hs-CRP shifts.",
    neededSkills: ["Microbial Ecology", "Anaerobic Bioprocessing", "Clinical Trials"],
    canonicalUrl: `${AGI_BASE_URL}/biomex`,
    isEditorialBlueprint: true,
  },
  {
    slug: "attune",
    title: "Attune",
    scoreTitle: "Closed-Loop Acoustic & Autonomic Sleep Architecture",
    description:
      "Non-invasive bedside and pillow biometric loop that steers slow-wave sleep spindles, thermal micro-climates, and vagal recovery in real time.",
    sectorId: "biotech-longevity",
    sectorLabel: "Biotech, Health & Longevity",
    hologramArchetype: "neural-crown",
    accentColor: "#818cf8",
    scores: { moat: 79, difficulty: 65, impact: 90 },
    forecasts: {
      y2030: "$540M",
      y2035: "$3.9B",
      y2040: "$14.5B",
      unicornEta: "2031",
    },
    thesis:
      "Sleep trackers give you a morning anxiety score without fixing the night. Phase-locked pink noise and thermal steering actively deepen slow-wave glymphatic clearance.",
    whyNow:
      "Millimeter-wave radar + dry-electrode sleep sensing enable clinical-grade staging without strapping on wires.",
    keyAssumptions: [
      "Phase-locked acoustic pulses increase slow-wave power by >18% across consecutive weeks",
    ],
    firstExperiment:
      "Validate real-time slow-wave phase locking on 30 users with overnight EEG headbands.",
    neededSkills: ["Neurotechnology", "Embedded DSP", "Sleep Medicine"],
    canonicalUrl: `${AGI_BASE_URL}/attune`,
    isEditorialBlueprint: true,
  },
  {
    slug: "thoughtline",
    title: "Thoughtline",
    scoreTitle: "Preventative Cognitive Vitality & Neural Reserve Lab",
    description:
      "Longitudinal speech, oculomotor, and metabolic biomarker tracking that detects subtle neuro-vascular drift decades before symptoms and pairs it with targeted intervention protocols.",
    sectorId: "biotech-longevity",
    sectorLabel: "Biotech, Health & Longevity",
    hologramArchetype: "neural-crown",
    accentColor: "#a78bfa",
    scores: { moat: 84, difficulty: 70, impact: 94 },
    forecasts: {
      y2030: "$480M",
      y2035: "$4.2B",
      y2040: "$18.0B",
      unicornEta: "2032",
    },
    thesis:
      "Neurodegeneration begins 20-30 years before clinical diagnosis. High-frequency digital biomarkers + blood p-tau217/GFAP panels make brain longevity measurable and actionable.",
    whyNow:
      "Ultrasensitive plasma biomarkers + phone-based saccade/prosody models cut screening costs by 90%.",
    keyAssumptions: [
      "3-minute monthly digital + annual plasma panel shows high test-retest reliability for intervention tracking",
    ],
    firstExperiment:
      "Enroll 250 APOE4-aware longevity enthusiasts in a 6-month baseline + protocol tracking cohort.",
    neededSkills: ["Computational Neurology", "Diagnostics", "Precision Medicine"],
    canonicalUrl: `${AGI_BASE_URL}/thoughtline`,
    isEditorialBlueprint: true,
  },
  {
    slug: "afterlight",
    title: "Afterlight",
    scoreTitle: "Biophilic End-of-Life & Legacy Sanctuary",
    description:
      "Restorative, nature-immersed sanctuary campuses and biographical preservation studios that replace sterile hospital corridors with dignity, family presence, and living memory.",
    sectorId: "biotech-longevity",
    sectorLabel: "Biotech, Health & Longevity",
    hologramArchetype: "courtyard-village",
    accentColor: "#c084fc",
    scores: { moat: 72, difficulty: 62, impact: 91 },
    forecasts: {
      y2030: "$310M",
      y2035: "$2.2B",
      y2040: "$8.0B",
      unicornEta: "2033",
    },
    thesis:
      "Even as we extend healthspan, how we care for elders and preserve family wisdom defines a civilization's grace.",
    whyNow:
      "Medicare hospice value-based care models + AI oral-history synthesis allow deeply human care at sustainable unit economics.",
    keyAssumptions: [
      "Families strongly prefer sanctuary residences when out-of-pocket costs are parity-matched via Medicare hospice benefits",
    ],
    firstExperiment:
      "Launch the Afterlight Oral History & Family Biography Studio alongside a partner palliative care residence.",
    neededSkills: ["Healthcare Operations", "Biophilic Architecture", "Oral History AI"],
    canonicalUrl: `${AGI_BASE_URL}/afterlight`,
    isEditorialBlueprint: true,
  },

  // =========================================================================
  // 4. AI & ECONOMIC AGENCY (7 Ideas)
  // =========================================================================
  {
    slug: "main-street-legacy",
    title: "Main Street Legacy",
    scoreTitle: "AI-Augmented Succession for Retiring Local Businesses",
    description:
      "Acquisition and transition platform that pairs retiring baby-boomer trade & manufacturing owners with ambitious young operators armed with an AI operational backbone.",
    sectorId: "ai-autonomous-enterprise",
    sectorLabel: "AI & Economic Agency",
    hologramArchetype: "agent-lattice",
    accentColor: "#f59e0b",
    scores: { moat: 85, difficulty: 60, impact: 93 },
    forecasts: {
      y2030: "$920M",
      y2035: "$7.4B",
      y2040: "$29.0B",
      unicornEta: "2030",
    },
    thesis:
      "Over 3 million profitable small businesses face closure as owners retire without heirs. Giving next-gen operators AI back-office automation preserves local jobs and compounds cash flow.",
    whyNow:
      "Voice/document AI agents can ingest 30 years of tribal knowledge from retiring owners during a 90-day transition.",
    keyAssumptions: [
      "AI back-office automation expands EBITDA margins by 600-900 bps within 12 months without layoffs",
    ],
    firstExperiment:
      "Deploy the Legacy Transition OS inside 3 SBA-financed HVAC/precision-machining acquisitions.",
    neededSkills: ["SMB Private Equity / Search Funds", "Vertical AI Agents", "Operations"],
    canonicalUrl: `${AGI_BASE_URL}/main-street-legacy`,
    isEditorialBlueprint: true,
    featuredInBooth: true,
  },
  {
    slug: "AIFounderLab",
    title: "AI Founder Lab",
    scoreTitle: "Autonomous Co-Builder & Validation Studio",
    description:
      "An interactive venture foundry where solo and duo founders pair with specialized agent swarms to validate customer pain, run live landing-page experiments, and ship MVPs in days.",
    sectorId: "ai-autonomous-enterprise",
    sectorLabel: "AI & Economic Agency",
    hologramArchetype: "agent-lattice",
    accentColor: "#fbbf24",
    scores: { moat: 81, difficulty: 55, impact: 91 },
    forecasts: {
      y2030: "$670M",
      y2035: "$5.1B",
      y2040: "$22.0B",
      unicornEta: "2031",
    },
    thesis:
      "Most startup deaths come from building something nobody wants for 12 months. Structured agentic customer discovery compresses falsification cycles from quarters to weekends.",
    whyNow:
      "Code generation + autonomous synthetic/human interview pipelines let one high-taste founder test 10 wedges rapidly.",
    keyAssumptions: [
      "Structured experiment loops 3x the rate of reaching $10k MRR among solo domain experts",
    ],
    firstExperiment:
      "Run a 30-founder cohort where every participant must falsify or validate 3 startup wedges in 21 days.",
    neededSkills: ["Agent Orchestration", "Venture Studio Ops", "Growth Engineering"],
    canonicalUrl: `${AGI_BASE_URL}/AIFounderLab`,
    isEditorialBlueprint: true,
  },
  {
    slug: "agentable",
    title: "Agentable",
    scoreTitle: "Machine-Readable Web & API Wrapper Protocol",
    description:
      "Turns legacy enterprise portals, government forms, and brittle SaaS workflows into deterministic, permissioned, cryptographically audited agent actions.",
    sectorId: "ai-autonomous-enterprise",
    sectorLabel: "AI & Economic Agency",
    hologramArchetype: "agent-lattice",
    accentColor: "#f59e0b",
    scores: { moat: 84, difficulty: 66, impact: 88 },
    forecasts: {
      y2030: "$790M",
      y2035: "$6.0B",
      y2040: "$23.5B",
      unicornEta: "2030",
    },
    thesis:
      "Screen-scraping agents break when a CSS class changes and lack scoped rollback guarantees. Enterprises need verified action contracts for AI agents.",
    whyNow:
      "Explosion of tool-using agents requires SOC2-grade human-in-the-loop approval and deterministic DOM/API state machines.",
    keyAssumptions: [
      "Self-healing action schemas cut enterprise RPA maintenance costs by 75%",
    ],
    firstExperiment:
      "Wrap the top 25 healthcare prior-authorization and freight customs portals into verified MCP/OpenAPI endpoints.",
    neededSkills: ["Browser Automation", "Security & Auth", "Developer Infrastructure"],
    canonicalUrl: `${AGI_BASE_URL}/agentable`,
    isEditorialBlueprint: true,
  },
  {
    slug: "helm",
    title: "Helm",
    scoreTitle: "One-Person Enterprise Cockpit",
    description:
      "Unified command center for 1-to-5 person companies to orchestrate finance, legal, support, fulfillment, and contractor agents with strict budget & approval guardrails.",
    sectorId: "ai-autonomous-enterprise",
    sectorLabel: "AI & Economic Agency",
    hologramArchetype: "orbital-spire",
    accentColor: "#f59e0b",
    scores: { moat: 78, difficulty: 54, impact: 86 },
    forecasts: {
      y2030: "$580M",
      y2035: "$4.4B",
      y2040: "$17.0B",
      unicornEta: "2031",
    },
    thesis:
      "Small teams drown in 25 fragmented SaaS tabs. Helm replaces department sprawl with an exception-driven executive cockpit.",
    whyNow:
      "Multi-agent tool calling is mature enough to handle 90% of routine bookkeeping, vendor follow-ups, and tier-1 support.",
    keyAssumptions: [
      "Founders will consolidate 6+ back-office subscriptions into a single agentic operating plane",
    ],
    firstExperiment:
      "Onboard 25 profitable 2-person agencies/software shops onto the daily Helm Morning Briefing + Approval Queue.",
    neededSkills: ["Fintech & ERP Integrations", "Agent UX", "Security Guardrails"],
    canonicalUrl: `${AGI_BASE_URL}/helm`,
    isEditorialBlueprint: true,
  },
  {
    slug: "proofrun",
    title: "ProofRun",
    scoreTitle: "Continuous Formal & Empirical AI Verification",
    description:
      "Automated sandboxed simulation and formal property verification harness that stress-tests code and agent deployments before they touch production data.",
    sectorId: "ai-autonomous-enterprise",
    sectorLabel: "AI & Economic Agency",
    hologramArchetype: "agent-lattice",
    accentColor: "#fbbf24",
    scores: { moat: 87, difficulty: 76, impact: 90 },
    forecasts: {
      y2030: "$710M",
      y2035: "$5.8B",
      y2040: "$25.0B",
      unicornEta: "2031",
    },
    thesis:
      "As AI writes 90% of code at 100x velocity, human PR review becomes the universal bottleneck. Automated specification & adversarial simulation replace manual line-by-line review.",
    whyNow:
      "LLM-assisted Lean4/TLA+ spec synthesis + deterministic micro-VM state forking make property testing accessible to mainstream teams.",
    keyAssumptions: [
      "Automated invariant checking catches >95% of regressions caused by autonomous coding agents",
    ],
    firstExperiment:
      "Ship a GitHub Action that generates and runs stateful counterfactual simulations on every agent-authored pull request.",
    neededSkills: ["Formal Verification", "Sandboxed Micro-VMs", "DevTools"],
    canonicalUrl: `${AGI_BASE_URL}/proofrun`,
    isEditorialBlueprint: true,
  },
  {
    slug: "sellcraft",
    title: "SellCraft",
    scoreTitle: "Technical Buyer Sandbox & Proof-of-Value Engine",
    description:
      "Replaces cold outbound spam and 6-week sales calls with instant, self-serve interactive technical sandboxes tailored to a prospect's actual stack.",
    sectorId: "ai-autonomous-enterprise",
    sectorLabel: "AI & Economic Agency",
    hologramArchetype: "agent-lattice",
    accentColor: "#f59e0b",
    scores: { moat: 73, difficulty: 50, impact: 79 },
    forecasts: {
      y2030: "$360M",
      y2035: "$2.3B",
      y2040: "$8.1B",
      unicornEta: "2032",
    },
    thesis:
      "AI-generated outbound email killed cold outreach. Engineers and technical buyers want to test the product against synthetic mirrors of their own schema in 5 minutes.",
    whyNow:
      "Ephemeral cloud sandboxes + synthetic data generators spin up realistic POC environments in seconds.",
    keyAssumptions: [
      "Self-serve technical sandboxes convert enterprise pipeline 3x faster than SDR qualification calls",
    ],
    firstExperiment:
      "Build instant synthetic-data POC sandboxes for 5 dev-tool startups and measure conversion to paid pilot.",
    neededSkills: ["Cloud Sandboxing", "Synthetic Data", "B2B GTM"],
    canonicalUrl: `${AGI_BASE_URL}/sellcraft`,
    isEditorialBlueprint: true,
  },
  {
    slug: "easy-exit",
    title: "Easy Exit",
    scoreTitle: "Automated Micro-M&A & Asset Transfer Clearinghouse",
    description:
      "Standardized escrow, automated due diligence, and instant code/revenue verification for buying and selling $50k–$5M profitable digital businesses in under 14 days.",
    sectorId: "ai-autonomous-enterprise",
    sectorLabel: "AI & Economic Agency",
    hologramArchetype: "civic-agora",
    accentColor: "#f59e0b",
    scores: { moat: 76, difficulty: 56, impact: 82 },
    forecasts: {
      y2030: "$430M",
      y2035: "$3.1B",
      y2040: "$11.5B",
      unicornEta: "2032",
    },
    thesis:
      "Builders create thousands of profitable micro-SaaS and niche media assets, but traditional M&A fees make transactions under $5M prohibitively slow.",
    whyNow:
      "Read-only Stripe/Supabase/GitHub cryptographic attestations verify revenue, churn, and IP provenance instantaneously.",
    keyAssumptions: [
      "Standardized reps-and-warranties templates + automated escrow cut closing times from 120 days to 10 days",
    ],
    firstExperiment:
      "Facilitate 20 verified micro-SaaS transfers using automated Stripe/GitHub diligence packets.",
    neededSkills: ["Fintech Escrow", "Automated Auditing", "Marketplace Liquidity"],
    canonicalUrl: `${AGI_BASE_URL}/easy-exit`,
    isEditorialBlueprint: true,
  },

  // =========================================================================
  // 5. HUMAN FLOURISHING & DEEP LEARNING (4 Ideas)
  // =========================================================================
  {
    slug: "deepguide",
    title: "DeepGuide",
    scoreTitle: "Socratic Mastery Tutor & Craft Apprenticeship Engine",
    description:
      "An adaptive Socratic mentor that guides learners through building real-world artifacts—refusing to hand over shallow answers while scaffolding deep mental models.",
    sectorId: "human-flourishing-media",
    sectorLabel: "Human Flourishing & Deep Learning",
    hologramArchetype: "neural-crown",
    accentColor: "#f472b6",
    scores: { moat: 79, difficulty: 54, impact: 94 },
    forecasts: {
      y2030: "$560M",
      y2035: "$4.5B",
      y2040: "$19.0B",
      unicornEta: "2031",
    },
    thesis:
      "Standard chatbots create an illusion of competence by doing the thinking for you. DeepGuide uses Bloom's 2-Sigma Socratic questioning and oral defense to build true mastery.",
    whyNow:
      "Low-latency voice + whiteboard multimodal reasoning can now observe how a student reasons step-by-step.",
    keyAssumptions: [
      "Learners complete 4x more capstone projects when paired with Socratic voice check-ins and peer cohorts",
    ],
    firstExperiment:
      "Run a 4-week Socratic systems-engineering bootcamp with 50 learners defended via live oral walkthroughs.",
    neededSkills: ["Cognitive Science", "Multimodal Voice AI", "Pedagogical Design"],
    canonicalUrl: `${AGI_BASE_URL}/deepguide`,
    isEditorialBlueprint: true,
  },
  {
    slug: "aura",
    title: "Aura",
    scoreTitle: "Intentional Attention & Dopamine Sovereignty Layer",
    description:
      "A personal epistemic filter and calm digest client that turns algorithmic feeds into serene, user-owned briefings aligned with your declared long-term curiosities.",
    sectorId: "human-flourishing-media",
    sectorLabel: "Human Flourishing & Deep Learning",
    hologramArchetype: "neural-crown",
    accentColor: "#ec4899",
    scores: { moat: 72, difficulty: 48, impact: 88 },
    forecasts: {
      y2030: "$320M",
      y2035: "$2.4B",
      y2040: "$9.2B",
      unicornEta: "2032",
    },
    thesis:
      "Ad-funded feeds optimize for outrage and compulsive scrolling. Aura works strictly for the user's pre-committed intellectual diet.",
    whyNow:
      "On-device and personal-cloud semantic ranking can distill 500 noisy sources into a 15-minute high-signal daily folio.",
    keyAssumptions: [
      "Knowledge workers will pay $15/mo for an ad-free, rage-bait-free cross-platform research & culture folio",
    ],
    firstExperiment:
      "Ship a morning e-ink / desktop digest reader for 500 founders and measure reduction in impulsive feed checking.",
    neededSkills: ["Information Retrieval", "Calm Technology UX", "Personal Agents"],
    canonicalUrl: `${AGI_BASE_URL}/aura`,
    isEditorialBlueprint: true,
  },
  {
    slug: "avatarlab",
    title: "AvatarLab",
    scoreTitle: "Expressive Real-Time Spatial Presence & Digital Twins",
    description:
      "Photorealistic and stylized low-bandwidth avatar synthesis that preserves genuine eye contact, micro-expressions, and vocal warmth across spatial workspaces.",
    sectorId: "human-flourishing-media",
    sectorLabel: "Human Flourishing & Deep Learning",
    hologramArchetype: "orbital-spire",
    accentColor: "#f472b6",
    scores: { moat: 82, difficulty: 72, impact: 83 },
    forecasts: {
      y2030: "$490M",
      y2035: "$3.7B",
      y2040: "$14.0B",
      unicornEta: "2031",
    },
    thesis:
      "Video grids cause zoom fatigue, while stiff 3D mannequins feel lifeless. Gaussian-splat & neural-codec avatars transmit authentic human warmth at 1/50th the bandwidth.",
    whyNow:
      "WebGPU + 3D Gaussian Splatting run at 60fps in standard laptop browsers from a single webcam feed.",
    keyAssumptions: [
      "Cryptographic identity watermarking prevents unauthorized impersonation while enabling effortless presence",
    ],
    firstExperiment:
      "Integrate 60fps WebGPU expressive portrait avatars into a 2-person orbital work capsule.",
    neededSkills: ["WebGPU / 3D Gaussian Splatting", "Neural Audio/Video Codecs", "Cryptographic Provenance"],
    canonicalUrl: `${AGI_BASE_URL}/avatarlab`,
    isEditorialBlueprint: true,
  },
  {
    slug: "ownyourreplacement",
    title: "Own Your Replacement",
    scoreTitle: "Worker-Owned Domain Agent Guilds & Royalty Rails",
    description:
      "Platform enabling master craftspeople, analysts, and specialists to train, license, and collect recurring royalties from fine-tuned agents built on their proprietary workflows.",
    sectorId: "human-flourishing-media",
    sectorLabel: "Human Flourishing & Deep Learning",
    hologramArchetype: "civic-agora",
    accentColor: "#f472b6",
    scores: { moat: 80, difficulty: 64, impact: 95 },
    forecasts: {
      y2030: "$520M",
      y2035: "$4.6B",
      y2040: "$21.0B",
      unicornEta: "2031",
    },
    thesis:
      "Instead of having their tacit expertise scraped for free, domain masters should own equity and usage royalties in the specialized agents they teach and supervise.",
    whyNow:
      "High-value vertical tasks require continuous expert RLHF and edge-case escalation that only seasoned practitioners can provide.",
    keyAssumptions: [
      "Enterprises prefer licensing guild-backed expert agents with human-escalation SLAs over generic foundation models",
    ],
    firstExperiment:
      "Form a 20-member guild of senior structural engineers / tax CPAs licensing a verified workflow agent with per-call royalty splits.",
    neededSkills: ["Expert RLHF Pipelines", "Usage Attribution & Metering", "Guild Governance"],
    canonicalUrl: `${AGI_BASE_URL}/ownyourreplacement`,
    isEditorialBlueprint: true,
  },

  // =========================================================================
  // 6. COORDINATION, ROBOTICS & CIVIC TRUST (6 Ideas)
  // =========================================================================
  {
    slug: "murmuration",
    title: "Murmuration",
    scoreTitle: "Decentralized Swarm Robotics & Emergency Response Mesh",
    description:
      "Cooperative multi-drone and ground-rover orchestration OS for rapid wildfire suppression, search-and-rescue, and precision agricultural stewardship.",
    sectorId: "governance-coordination",
    sectorLabel: "Coordination, Robotics & Civic Trust",
    hologramArchetype: "drone-swarm",
    accentColor: "#2dd4bf",
    scores: { moat: 90, difficulty: 82, impact: 97 },
    forecasts: {
      y2030: "$880M",
      y2035: "$8.2B",
      y2040: "$36.0B",
      unicornEta: "2030",
    },
    thesis:
      "Single expensive aircraft arrive hours too late to stop nascent wildfires. Commodity autonomous swarms operating on local mesh consensus detect and extinguish ignitions in minutes.",
    whyNow:
      "Edge vision chips + low-cost NDAA-compliant airframes allow 50-unit cooperative swarms for the cost of one helicopter hour.",
    keyAssumptions: [
      "GPS-denied local visual-inertial mesh coordination scales to 100 heterogeneous units with 1 human supervisor",
    ],
    firstExperiment:
      "Demonstrate 12 cooperative thermal-imaging quadcopters autonomously mapping and triaging a 500-acre controlled burn perimeter.",
    neededSkills: ["Swarm Robotics", "Edge Computer Vision", "Aviation Regulatory (BVLOS)"],
    canonicalUrl: `${AGI_BASE_URL}/murmuration`,
    isEditorialBlueprint: true,
    featuredInBooth: true,
  },
  {
    slug: "civicpath",
    title: "CivicPath",
    scoreTitle: "AI-Accelerated Permitting & Regulatory Compliance Compiler",
    description:
      "Pre-checks architectural plans, environmental reviews, and infrastructure applications against municipal code in minutes—turning 18-month permit backlogs into 14-day approvals.",
    sectorId: "governance-coordination",
    sectorLabel: "Coordination, Robotics & Civic Trust",
    hologramArchetype: "civic-agora",
    accentColor: "#14b8a6",
    scores: { moat: 85, difficulty: 64, impact: 94 },
    forecasts: {
      y2030: "$640M",
      y2035: "$5.3B",
      y2040: "$22.0B",
      unicornEta: "2031",
    },
    thesis:
      "Abundance in housing and clean energy is strangled by paper-era municipal review queues. Compiling building codes into deterministic CAD/BIM checks frees both builders and city staff.",
    whyNow:
      "Multimodal blueprint parsing + citation-grounded statutory engines can flag exact code violations with zero hallucination.",
    keyAssumptions: [
      "Cities will adopt pre-certified submission packets that save municipal plan reviewers 70% of manual check time",
    ],
    firstExperiment:
      "Automate ADU and solar-plus-storage plan check for 2 forward-leaning municipalities.",
    neededSkills: ["Computational Law", "AEC / BIM Parsing", "GovTech Sales"],
    canonicalUrl: `${AGI_BASE_URL}/civicpath`,
    isEditorialBlueprint: true,
  },
  {
    slug: "handraise",
    title: "Handraise",
    scoreTitle: "Micro-Bounties & Verified Proof-of-Help Network",
    description:
      "High-trust coordination protocol where founders, scientists, and civic projects post scoped technical or operational bottlenecks and reward verified contributors.",
    sectorId: "governance-coordination",
    sectorLabel: "Coordination, Robotics & Civic Trust",
    hologramArchetype: "civic-agora",
    accentColor: "#2dd4bf",
    scores: { moat: 75, difficulty: 50, impact: 85 },
    forecasts: {
      y2030: "$370M",
      y2035: "$2.6B",
      y2040: "$9.8B",
      unicornEta: "2032",
    },
    thesis:
      "Traditional hiring takes 3 months for a 10-hour problem. Scoped proof-of-work bounties let builders collaborate across organizational boundaries and build verifiable reputation.",
    whyNow:
      "AI decomposes complex project roadmaps into crisp, testable micro-deliverables with objective acceptance criteria.",
    keyAssumptions: [
      "Portable proof-of-work reputation graphs become a stronger hiring and cofounder signal than static resumes",
    ],
    firstExperiment:
      "Seed 100 scoped engineering & research bounties across AGI Futures blueprints and track completion velocity.",
    neededSkills: ["Reputation Systems", "Marketplace Design", "Developer Relations"],
    canonicalUrl: `${AGI_BASE_URL}/handraise`,
    isEditorialBlueprint: true,
  },
  {
    slug: "proxypilot",
    title: "ProxyPilot",
    scoreTitle: "High-Consensus Citizen Deliberation & Polis Engine",
    description:
      "Bridging-based deliberation platform that maps common ground across polarized stakeholders, surfaces unexpected consensus policies, and prevents vocal-minority capture.",
    sectorId: "governance-coordination",
    sectorLabel: "Coordination, Robotics & Civic Trust",
    hologramArchetype: "civic-agora",
    accentColor: "#2dd4bf",
    scores: { moat: 77, difficulty: 60, impact: 92 },
    forecasts: {
      y2030: "$290M",
      y2035: "$2.1B",
      y2040: "$8.4B",
      unicornEta: "2033",
    },
    thesis:
      "Public hearings and social media reward the loudest 2% of extremists while silencing the pragmatic 80% majority. Bridging algorithms surface what diverse groups actually agree on.",
    whyNow:
      "LLM cluster synthesis + verified local residency credentials enable 10,000-person town halls with high epistemic clarity.",
    keyAssumptions: [
      "Municipalities, DAOs, and large associations will use bridging deliberations to unlock stalled zoning and budget decisions",
    ],
    firstExperiment:
      "Run a 1,000-resident bridging deliberation on a contested local housing or transit corridor proposal.",
    neededSkills: ["Social Choice Mathematics", "Zero-Knowledge Identity", "Civic Engagement"],
    canonicalUrl: `${AGI_BASE_URL}/proxypilot`,
    isEditorialBlueprint: true,
  },
  {
    slug: "whistleworks",
    title: "WhistleWorks",
    scoreTitle: "Cryptographic Supply-Chain & Safety Attestation Ledger",
    description:
      "Zero-knowledge credential verification allowing engineers and quality inspectors to prove component authenticity or flag critical safety defects without exposing trade secrets.",
    sectorId: "governance-coordination",
    sectorLabel: "Coordination, Robotics & Civic Trust",
    hologramArchetype: "agent-lattice",
    accentColor: "#14b8a6",
    scores: { moat: 83, difficulty: 74, impact: 89 },
    forecasts: {
      y2030: "$440M",
      y2035: "$3.3B",
      y2040: "$13.0B",
      unicornEta: "2032",
    },
    thesis:
      "Aerospace, pharma, and frontier AI safety depend on insiders being able to verify compliance or surface red-line risks with cryptographic proof of role and zero retaliation.",
    whyNow:
      "ZK-email and hardware enclave attestations prove 'this report came from a certified QA lead at Vendor X' without revealing identity.",
    keyAssumptions: [
      "Insurers and prime contractors will offer premium reductions for suppliers using continuous cryptographic QA attestations",
    ],
    firstExperiment:
      "Deploy ZK-verified quality-control sign-offs across a 3-tier aerospace component supply chain.",
    neededSkills: ["Applied Cryptography (ZK)", "Industrial QA Compliance", "Enterprise Security"],
    canonicalUrl: `${AGI_BASE_URL}/whistleworks`,
    isEditorialBlueprint: true,
  },
  {
    slug: "public-ai",
    title: "Public AI",
    scoreTitle: "Open-Weight Sovereign Compute & Scientific Commons",
    description:
      "Federated compute cooperative and open scientific dataset commons empowering universities, biotech labs, and civic builders to train frontier models on shared infrastructure.",
    sectorId: "governance-coordination",
    sectorLabel: "Coordination, Robotics & Civic Trust",
    hologramArchetype: "orbital-spire",
    accentColor: "#2dd4bf",
    scores: { moat: 86, difficulty: 80, impact: 97 },
    forecasts: {
      y2030: "$740M",
      y2035: "$6.8B",
      y2040: "$31.0B",
      unicornEta: "2031",
    },
    thesis:
      "Civilizational intelligence shouldn't be locked behind three closed APIs. Federated academic and renewable-powered compute clusters keep foundational science open.",
    whyNow:
      "Low-communication distributed training (DiLoCo) lets geographically dispersed clean-energy clusters train frontier models over standard fiber.",
    keyAssumptions: [
      "Dispersed university and stranded-renewable GPU clusters achieve >80% utilization via federated scheduling",
    ],
    firstExperiment:
      "Coordinate a 4-university distributed training run of an open protein-folding / materials science foundation model.",
    neededSkills: ["Distributed ML Systems", "HPC Networking", "Research Consortium Governance"],
    canonicalUrl: `${AGI_BASE_URL}/public-ai`,
    isEditorialBlueprint: true,
  },
];

// =========================================================================
// Community Idea Seeds (Visually distinct from Curated Editorial Blueprints)
// =========================================================================
export interface CommunityIdeaSeed {
  id: string;
  slug: string;
  descriptor: string;
  oneLiner: string;
  problem: string;
  solutionHypothesis: string;
  authorName: string;
  authorHandle: string;
  sectorId: SectorBoothId;
  createdAt: string;
  votes: {
    world_needs_this: number;
    id_build_this: number;
    id_fund_this: number;
    id_use_this: number;
  };
  isEditorialBlueprint: false;
}

export const INITIAL_COMMUNITY_SEEDS: CommunityIdeaSeed[] = [
  {
    id: "seed-orbital-botany-01",
    slug: "closed-loop-mycelium-acoustics",
    descriptor: "Mycelium Acoustic Panels Grown from Local Coffee Chaff",
    oneLiner:
      "Micro-factories turning urban roastery waste into fire-rated architectural acoustic panels in 7 days.",
    problem:
      "Commercial acoustic panels are made from fiberglass and petro-foams with high embodied carbon and long lead times.",
    solutionHypothesis:
      "Automated tabletop molding trays inoculated with Ganoderma lucidum strains grown on pasteurized local coffee chaff and hemp hurd.",
    authorName: "Elena Vance",
    authorHandle: "elenavance",
    sectorId: "homes-cities",
    createdAt: "2026-10-22",
    votes: {
      world_needs_this: 42,
      id_build_this: 11,
      id_fund_this: 8,
      id_use_this: 29,
    },
    isEditorialBlueprint: false,
  },
  {
    id: "seed-longevity-lab-02",
    slug: "continuous-salivary-cortisol-patch",
    descriptor: "Non-Invasive Intraoral Circadian Cortisol Awakening Tracker",
    oneLiner:
      "Morning retainer sensor strip that measures the 45-minute Cortisol Awakening Response (CAR) without needles or spit tubes.",
    problem:
      "HRV is a noisy proxy for HPA-axis stress; measuring true cortisol curves currently requires 4 timed lab tubes.",
    solutionHypothesis:
      "Aptamer-based electrochemical strip embedded in a standard nightguard/retainer read via NFC on your phone upon waking.",
    authorName: "Marcus Chen",
    authorHandle: "mchen_bio",
    sectorId: "biotech-longevity",
    createdAt: "2026-10-25",
    votes: {
      world_needs_this: 58,
      id_build_this: 14,
      id_fund_this: 19,
      id_use_this: 64,
    },
    isEditorialBlueprint: false,
  },
];

export function getIdeasBySector(sectorId: SectorBoothId): AgiFuturesIdea[] {
  return AGI_FUTURES_IDEAS.filter((idea) => idea.sectorId === sectorId);
}

export function getIdeaBySlug(slug: string): AgiFuturesIdea | undefined {
  return AGI_FUTURES_IDEAS.find(
    (idea) => idea.slug.toLowerCase() === slug.toLowerCase()
  );
}
