"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Compass,
  Sparkles,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Eye,
  EyeOff,
  ArrowUpRight,
} from "lucide-react";
import { getWaypointById } from "@/lib/spatial/waypoint-registry";
import { AgiFuturesIdea, SectorBoothId } from "@/data/agifutures-catalog";

export type QualityTier = "high" | "balanced" | "lightweight";

interface OrbitalCanvasProps {
  activeWaypointId: string;
  onSelectWaypoint: (waypointId: string) => void;
  activeIdea: AgiFuturesIdea;
  sectorIdeaMap: Record<SectorBoothId, AgiFuturesIdea>;
  onOpenIdeaDrawer: (idea?: AgiFuturesIdea) => void;
  onOpenLevlDrawer: (modalitySlug?: string) => void;
  onOpenScreeningModal: () => void;
  onOpenMatchingDrawer: () => void;
  onOpenConciergeDrawer: () => void;
  isFocusMode?: boolean;
  qualityTier: QualityTier;
  reducedMotion: boolean;
  onAutoDowngradeQuality?: () => void;
}

type MasterSceneId =
  | "atrium-front"
  | "atrium-rear"
  | "tobehuman-interior"
  | "levl-interior"
  | "agifutures-interior";

interface SceneHotspot {
  id: string;
  label: string;
  sublabel: string;
  xPercent: number; // 0..100 on the 16:9 master photograph
  yPercent: number; // 0..100 on the 16:9 master photograph
  badgeTone: "amber" | "teal" | "emerald" | "violet" | "sky";
  isPortal?: boolean;
  targetWaypointId?: string;
  zoomTarget?: { zoom: number; focusX: number; focusY: number };
  actionType?:
    | "waypoint"
    | "open_levl"
    | "open_ideas"
    | "open_concierge"
    | "open_matching"
    | "open_screening";
}

interface MasterSceneConfig {
  id: MasterSceneId;
  title: string;
  subtitle: string;
  resolutionBadge: string;
  imageSrc: string;
  aspectRatio: number; // 5504 / 3072 = 1.7916667
  defaultZoom: number;
  defaultFocusX: number; // 0..1
  defaultFocusY: number; // 0..1
  hotspots: SceneHotspot[];
}

const MASTER_SCENES: Record<MasterSceneId, MasterSceneConfig> = {
  "atrium-front": {
    id: "atrium-front",
    title: "Grand Orbital Atrium — Facing Planet Earth",
    subtitle:
      "Drag or scroll to explore the 5.5K panorama • Click any portal or pod to glide in, or Turn 180° Around",
    resolutionBadge: "5.5K (5504 × 3072) Unstitched Master",
    imageSrc: "/concepts/atrium-front-improved.jpg",
    aspectRatio: 5504 / 3072,
    defaultZoom: 1.16,
    defaultFocusX: 0.5,
    defaultFocusY: 0.5,
    hotspots: [
      {
        id: "hs-front-levl-portal",
        label: "LEVL Longevity Wing",
        sublabel: "Enter Wing • Protocol Bar & Spa",
        xPercent: 9.8,
        yPercent: 51.5,
        badgeTone: "teal",
        isPortal: true,
        targetWaypointId: "levl-lounge-entry",
        actionType: "waypoint",
      },
      {
        id: "hs-front-agi-portal",
        label: "AGI FUTURES Club",
        sublabel: "Enter Wing • 33 Holo-Ideas",
        xPercent: 91.5,
        yPercent: 51.5,
        badgeTone: "emerald",
        isPortal: true,
        targetWaypointId: "agi-club-overview",
        actionType: "waypoint",
      },
      {
        id: "hs-front-astrolabe",
        label: "Orbital Telemetry Hearth",
        sublabel: "Inspect Live Astrolabe & Briefing",
        xPercent: 50.4,
        yPercent: 62.5,
        badgeTone: "amber",
        zoomTarget: { zoom: 1.85, focusX: 0.504, focusY: 0.61 },
        actionType: "open_concierge",
      },
      {
        id: "hs-front-west-pit",
        label: "West Sunken Earth-Glass Pit",
        sublabel: "Glide into Conversation Lounge",
        xPercent: 24.5,
        yPercent: 80.5,
        badgeTone: "amber",
        targetWaypointId: "lounge-pit-west",
        actionType: "waypoint",
      },
      {
        id: "hs-front-east-pit",
        label: "East Sunken Earth-Glass Pit",
        sublabel: "Glide into Conversation Lounge",
        xPercent: 73.5,
        yPercent: 81.5,
        badgeTone: "amber",
        targetWaypointId: "lounge-pit-east",
        actionType: "waypoint",
      },
      {
        id: "hs-front-pod-west",
        label: "Earthview Glass Pod α1",
        sublabel: "Zoom 2.2× into Cantilevered Focus Sphere",
        xPercent: 21.4,
        yPercent: 16.5,
        badgeTone: "sky",
        targetWaypointId: "pod-earthview-1",
        actionType: "waypoint",
      },
      {
        id: "hs-front-pod-midwest",
        label: "Upper Canopy Glass Pod α2",
        sublabel: "Zoom 2.3× into Upper Mezzanine Pod",
        xPercent: 37.8,
        yPercent: 12.2,
        badgeTone: "sky",
        targetWaypointId: "pod-earthview-2",
        actionType: "waypoint",
      },
      {
        id: "hs-front-pod-east",
        label: "Earthview Glass Pod γ1",
        sublabel: "Zoom 2.2× into Eastern Focus Sphere",
        xPercent: 90.0,
        yPercent: 18.5,
        badgeTone: "sky",
        targetWaypointId: "pod-earthview-5",
        actionType: "waypoint",
      },
    ],
  },

  "atrium-rear": {
    id: "atrium-rear",
    title: "Grand Orbital Atrium — 180° Rear Rotunda",
    subtitle:
      "Space-Elevator Arrival Shaft, TO BE HUMAN Wing Portal, Backlit Alabaster Bar & Aurora Earth-Glass Oculi",
    resolutionBadge: "5.5K (5504 × 3072) Unstitched Master",
    imageSrc: "/concepts/atrium-back-tobehuman.jpg",
    aspectRatio: 5504 / 3072,
    defaultZoom: 1.16,
    defaultFocusX: 0.5,
    defaultFocusY: 0.5,
    hotspots: [
      {
        id: "hs-rear-tobehuman-portal",
        label: "TO BE HUMAN Sanctuary",
        sublabel: "Enter Wing • Purpose & Consciousness",
        xPercent: 13.8,
        yPercent: 49.5,
        badgeTone: "violet",
        isPortal: true,
        targetWaypointId: "tobehuman-sanctuary",
        actionType: "waypoint",
      },
      {
        id: "hs-rear-space-elevator",
        label: "Space-Elevator & Concierge Desk",
        sublabel: "Station Briefing, AI Concierge & 2D Map",
        xPercent: 50.2,
        yPercent: 56.5,
        badgeTone: "amber",
        zoomTarget: { zoom: 1.75, focusX: 0.502, focusY: 0.52 },
        actionType: "open_concierge",
      },
      {
        id: "hs-rear-alabaster-bar",
        label: "Backlit Fluted-Alabaster Lounge Bar",
        sublabel: "Glide to Social Bar & Resident Lounge",
        xPercent: 89.5,
        yPercent: 59.5,
        badgeTone: "amber",
        targetWaypointId: "atrium-concierge",
        actionType: "waypoint",
      },
      {
        id: "hs-rear-dj-terrace",
        label: "Orbital DJ Soundscape Terrace",
        sublabel: "Zoom to Upper Mezzanine Acoustic Console",
        xPercent: 88.2,
        yPercent: 28.5,
        badgeTone: "sky",
        zoomTarget: { zoom: 1.95, focusX: 0.882, focusY: 0.285 },
      },
      {
        id: "hs-rear-aurora-oculus",
        label: "Aurora Borealis Earth-Glass Oculi",
        sublabel: "Look Down 418 km at Emerald Aurora Ribbon",
        xPercent: 50.0,
        yPercent: 88.0,
        badgeTone: "teal",
        zoomTarget: { zoom: 1.78, focusX: 0.5, focusY: 0.86 },
      },
    ],
  },

  "tobehuman-interior": {
    id: "tobehuman-interior",
    title: "TO BE HUMAN Sanctuary — Purpose & Consciousness in the AGI Era",
    subtitle:
      "Zero-G Obsidian Reflection Pool, Ancient Bonsai Tree of Life, Neural-Cosmos Sculpture & Socratic Amphitheater",
    resolutionBadge: "5.5K (5504 × 3072) Unstitched Master",
    imageSrc: "/concepts/tobehuman-wing-interior.jpg",
    aspectRatio: 5504 / 3072,
    defaultZoom: 1.16,
    defaultFocusX: 0.5,
    defaultFocusY: 0.5,
    hotspots: [
      {
        id: "hs-tbh-tree-cosmos",
        label: "Bonsai Tree of Life & Neural-Cosmos",
        sublabel: "Zoom into Golden Resonance Rings & Aurora",
        xPercent: 50.0,
        yPercent: 46.5,
        badgeTone: "violet",
        zoomTarget: { zoom: 1.85, focusX: 0.5, focusY: 0.45 },
      },
      {
        id: "hs-tbh-amphitheater",
        label: "Socratic Dialogue Amphitheater",
        sublabel: "Philosophical Salons & Member Connection",
        xPercent: 14.5,
        yPercent: 60.0,
        badgeTone: "amber",
        targetWaypointId: "tobehuman-amphitheater",
        actionType: "open_matching",
      },
      {
        id: "hs-tbh-wisdom-library",
        label: "Two-Story Wisdom & Consciousness Library",
        sublabel: "Glide to Walnut Philosophy Stacks",
        xPercent: 90.0,
        yPercent: 50.0,
        badgeTone: "amber",
        targetWaypointId: "tobehuman-library",
        actionType: "waypoint",
      },
      {
        id: "hs-tbh-reflection-pool",
        label: "Zero-G Obsidian Reflection Pool",
        sublabel: "Mirror-Still Water & Floating Lanterns",
        xPercent: 50.0,
        yPercent: 79.0,
        badgeTone: "teal",
        zoomTarget: { zoom: 1.75, focusX: 0.5, focusY: 0.78 },
      },
    ],
  },

  "levl-interior": {
    id: "levl-interior",
    title: "LEVL Longevity Lounge & Evidence Spa",
    subtitle:
      "Fluted-Alabaster Protocol Bar, Sora AI Longevity Coach, Research Screening Wall & Earth-Glass Lounge",
    resolutionBadge: "Photorealistic Wing View",
    imageSrc: "/concepts/levl-lounge.png",
    aspectRatio: 16 / 9,
    defaultZoom: 1.14,
    defaultFocusX: 0.5,
    defaultFocusY: 0.5,
    hotspots: [
      {
        id: "hs-levl-bar",
        label: "LEVL Protocol Bar & Sora AI Coach",
        sublabel: "Open PubMed Evidence & mylevl.ai Handoff",
        xPercent: 22.0,
        yPercent: 52.0,
        badgeTone: "teal",
        actionType: "open_levl",
      },
      {
        id: "hs-levl-screening",
        label: "Research Screening Wall",
        sublabel: "Watch Longevity Talks (Auto-Ducks DJ)",
        xPercent: 49.5,
        yPercent: 28.5,
        badgeTone: "amber",
        actionType: "open_screening",
      },
      {
        id: "hs-levl-pit",
        label: "Sunken Recovery Earth-Glass Pit",
        sublabel: "Zoom into Botanical Recovery Lounge",
        xPercent: 72.0,
        yPercent: 76.0,
        badgeTone: "teal",
        zoomTarget: { zoom: 1.65, focusX: 0.72, focusY: 0.76 },
      },
      {
        id: "hs-levl-return",
        label: "← Return to Grand Atrium",
        sublabel: "Back to 5.5K Earth Panorama",
        xPercent: 88.0,
        yPercent: 45.0,
        badgeTone: "amber",
        isPortal: true,
        targetWaypointId: "atrium-commons",
        actionType: "waypoint",
      },
    ],
  },

  "agifutures-interior": {
    id: "agifutures-interior",
    title: "AGI Futures Inventor's Club & Holo-Table",
    subtitle:
      "Central Collaborative 3D Hologram Table, 6 Sector Idea Booths (33 Canonical Ideas), Kaelen AI & Founder Matching",
    resolutionBadge: "Photorealistic Wing View",
    imageSrc: "/concepts/agifutures-club.png",
    aspectRatio: 16 / 9,
    defaultZoom: 1.14,
    defaultFocusX: 0.5,
    defaultFocusY: 0.5,
    hotspots: [
      {
        id: "hs-agi-holotable",
        label: "Central Holographic Blueprint Table",
        sublabel: "Inspect All 33 AGI Futures Startup Ideas",
        xPercent: 58.0,
        yPercent: 75.0,
        badgeTone: "emerald",
        actionType: "open_ideas",
      },
      {
        id: "hs-agi-booths",
        label: "6 Sector Idea Booths (Robotics, Homes, Biotech)",
        sublabel: "Browse Sector Blueprints & Plant Seeds",
        xPercent: 41.0,
        yPercent: 44.0,
        badgeTone: "emerald",
        actionType: "open_ideas",
      },
      {
        id: "hs-agi-matching",
        label: "Founder Matching Wall & Kaelen AI",
        sublabel: "Building / Looking For / Can Help Board",
        xPercent: 12.5,
        yPercent: 42.0,
        badgeTone: "sky",
        actionType: "open_matching",
      },
      {
        id: "hs-agi-return",
        label: "← Return to Grand Atrium",
        sublabel: "Back to 5.5K Earth Panorama",
        xPercent: 91.0,
        yPercent: 48.0,
        badgeTone: "amber",
        isPortal: true,
        targetWaypointId: "atrium-commons",
        actionType: "waypoint",
      },
    ],
  },
};

/**
 * Maps any waypointId in the station to its corresponding Master Scene and exact
 * camera zoom + focus coordinates on that unstitched photograph.
 */
function resolveWaypointCamera(waypointId: string): {
  sceneId: MasterSceneId;
  zoom: number;
  focusX: number;
  focusY: number;
} {
  switch (waypointId) {
    // 1. Front Atrium 5.5K Master & Sub-Vantages
    case "atrium-commons":
      return { sceneId: "atrium-front", zoom: 1.16, focusX: 0.5, focusY: 0.5 };
    case "lounge-pit-west":
      return { sceneId: "atrium-front", zoom: 1.75, focusX: 0.245, focusY: 0.805 };
    case "lounge-pit-east":
      return { sceneId: "atrium-front", zoom: 1.75, focusX: 0.735, focusY: 0.815 };
    case "pod-earthview-1":
      return { sceneId: "atrium-front", zoom: 2.18, focusX: 0.214, focusY: 0.165 };
    case "pod-earthview-2":
      return { sceneId: "atrium-front", zoom: 2.25, focusX: 0.378, focusY: 0.122 };
    case "pod-earthview-3":
      return { sceneId: "atrium-front", zoom: 2.25, focusX: 0.385, focusY: 0.285 };
    case "pod-earthview-4":
      return { sceneId: "atrium-front", zoom: 2.25, focusX: 0.745, focusY: 0.28 };
    case "pod-earthview-5":
      return { sceneId: "atrium-front", zoom: 2.18, focusX: 0.9, focusY: 0.185 };
    case "pod-earthview-6":
      return { sceneId: "atrium-front", zoom: 2.2, focusX: 0.77, focusY: 0.505 };

    // 2. 180° Rear Atrium 5.5K Master & Sub-Vantages
    case "atrium-rear-rotunda":
      return { sceneId: "atrium-rear", zoom: 1.16, focusX: 0.5, focusY: 0.5 };
    case "orbital-elevator-ascent":
      return { sceneId: "atrium-rear", zoom: 1.68, focusX: 0.502, focusY: 0.48 };
    case "atrium-concierge":
      return { sceneId: "atrium-rear", zoom: 1.75, focusX: 0.885, focusY: 0.55 };

    // 3. TO BE HUMAN Sanctuary 5.5K Master & Sub-Vantages
    case "tobehuman-sanctuary":
      return {
        sceneId: "tobehuman-interior",
        zoom: 1.16,
        focusX: 0.5,
        focusY: 0.5,
      };
    case "tobehuman-amphitheater":
      return {
        sceneId: "tobehuman-interior",
        zoom: 1.75,
        focusX: 0.145,
        focusY: 0.6,
      };
    case "tobehuman-library":
    case "conservatory-deck":
      return {
        sceneId: "tobehuman-interior",
        zoom: 1.75,
        focusX: 0.9,
        focusY: 0.5,
      };

    // 4. LEVL Wing
    case "levl-lounge-entry":
      return { sceneId: "levl-interior", zoom: 1.14, focusX: 0.5, focusY: 0.5 };
    case "levl-protocol-bar":
      return { sceneId: "levl-interior", zoom: 1.55, focusX: 0.24, focusY: 0.52 };
    case "levl-screening-wall":
      return { sceneId: "levl-interior", zoom: 1.65, focusX: 0.495, focusY: 0.285 };
    case "levl-spa-sauna":
    case "levl-spa-hbot":
      return { sceneId: "levl-interior", zoom: 1.55, focusX: 0.72, focusY: 0.48 };

    // 5. AGI Futures Wing
    case "agi-club-overview":
      return {
        sceneId: "agifutures-interior",
        zoom: 1.14,
        focusX: 0.5,
        focusY: 0.5,
      };
    case "agi-holo-table":
      return {
        sceneId: "agifutures-interior",
        zoom: 1.6,
        focusX: 0.58,
        focusY: 0.75,
      };
    case "agi-matching-wall":
    case "agi-builder-guide":
      return {
        sceneId: "agifutures-interior",
        zoom: 1.6,
        focusX: 0.14,
        focusY: 0.48,
      };
    default: {
      const wp = getWaypointById(waypointId);
      if (wp.wing === "tobehuman") {
        return {
          sceneId: "tobehuman-interior",
          zoom: 1.16,
          focusX: 0.5,
          focusY: 0.5,
        };
      }
      if (wp.wing === "levl") {
        return { sceneId: "levl-interior", zoom: 1.14, focusX: 0.5, focusY: 0.5 };
      }
      if (wp.wing === "agifutures") {
        return {
          sceneId: "agifutures-interior",
          zoom: 1.14,
          focusX: 0.5,
          focusY: 0.5,
        };
      }
      return { sceneId: "atrium-front", zoom: 1.16, focusX: 0.5, focusY: 0.5 };
    }
  }
}

const TONE_CLASSES: Record<
  SceneHotspot["badgeTone"],
  { pill: string; dot: string; ring: string }
> = {
  amber: {
    pill: "border-amber-300/60 bg-slate-950/80 text-amber-100 hover:bg-amber-950/90 hover:border-amber-300",
    dot: "bg-amber-300 shadow-[0_0_12px_#fcd34d]",
    ring: "border-amber-300/50",
  },
  teal: {
    pill: "border-teal-300/60 bg-slate-950/80 text-teal-100 hover:bg-teal-950/90 hover:border-teal-300",
    dot: "bg-teal-300 shadow-[0_0_12px_#5eead4]",
    ring: "border-teal-300/50",
  },
  emerald: {
    pill: "border-emerald-300/60 bg-slate-950/80 text-emerald-100 hover:bg-emerald-950/90 hover:border-emerald-300",
    dot: "bg-emerald-300 shadow-[0_0_12px_#6ee7b7]",
    ring: "border-emerald-300/50",
  },
  violet: {
    pill: "border-violet-300/60 bg-slate-950/80 text-violet-100 hover:bg-violet-950/90 hover:border-violet-300",
    dot: "bg-violet-300 shadow-[0_0_12px_#c4b5fd]",
    ring: "border-violet-300/50",
  },
  sky: {
    pill: "border-sky-300/60 bg-slate-950/80 text-sky-100 hover:bg-sky-950/90 hover:border-sky-300",
    dot: "bg-sky-300 shadow-[0_0_12px_#7dd3fc]",
    ring: "border-sky-300/50",
  },
};

export function OrbitalCanvas({
  activeWaypointId,
  onSelectWaypoint,
  activeIdea,
  onOpenIdeaDrawer,
  onOpenLevlDrawer,
  onOpenScreeningModal,
  onOpenMatchingDrawer,
  onOpenConciergeDrawer,
  isFocusMode = false,
  reducedMotion,
}: OrbitalCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const hotspotScaleRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Viewport size for exact cover-box clamping (guarantees zero black edges)
  const [viewportSize, setViewportSize] = useState({ w: 1440, h: 900 });
  const [showHotspots, setShowHotspots] = useState(true);
  const [zoomReadout, setZoomReadout] = useState(1.16);

  // Active & outgoing scene state for smooth optical cross-dissolve transitions
  const initialCam = useMemo(
    () => resolveWaypointCamera(activeWaypointId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const [activeSceneId, setActiveSceneId] = useState<MasterSceneId>(
    initialCam.sceneId
  );
  const [outgoingSceneId, setOutgoingSceneId] = useState<MasterSceneId | null>(
    null
  );
  const [isTransitioningScene, setIsTransitioningScene] = useState(false);

  const activeScene = MASTER_SCENES[activeSceneId];
  const outgoingScene = outgoingSceneId ? MASTER_SCENES[outgoingSceneId] : null;

  // Compute exact 16:9 cover stage dimensions so (x%, y%) matches image pixels 1:1
  const stageDims = useMemo(() => {
    const { w, h } = viewportSize;
    const aspect = activeScene.aspectRatio;
    if (w / h > aspect) {
      return { width: w, height: w / aspect };
    }
    return { width: h * aspect, height: h };
  }, [viewportSize, activeScene.aspectRatio]);

  // Camera transform refs (animated at 60/120fps on GPU compositor thread via translate3d + scale)
  const currentZoom = useRef(initialCam.zoom);
  const targetZoom = useRef(initialCam.zoom);
  const currentOffsetX = useRef(0);
  const currentOffsetY = useRef(0);
  const targetOffsetX = useRef(0);
  const targetOffsetY = useRef(0);

  // Pointer drag & gentle mouse parallax state
  const isDragging = useRef(false);
  const dragMoved = useRef(false);
  const prevPointer = useRef({ x: 0, y: 0 });
  const pointerParallax = useRef({ x: 0, y: 0 });
  const keysPressed = useRef<Record<string, boolean>>({});

  // Preload all 5.5K master photographs on mount so switching views is instant
  useEffect(() => {
    Object.values(MASTER_SCENES).forEach((scene) => {
      const img = new Image();
      img.src = scene.imageSrc;
    });
  }, []);

  // Measure viewport container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setViewportSize({ w: rect.width, h: rect.height });
      }
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Helper to compute clamped pixel offsets for a given (focusX, focusY, zoom)
  const computeClampedOffsets = useCallback(
    (focusX: number, focusY: number, zoom: number) => {
      const maxX = Math.max(0, (stageDims.width * zoom - viewportSize.w) / 2);
      const maxY = Math.max(0, (stageDims.height * zoom - viewportSize.h) / 2);
      const rawX = (0.5 - focusX) * stageDims.width * zoom;
      const rawY = (0.5 - focusY) * stageDims.height * zoom;
      return {
        x: Math.max(-maxX, Math.min(maxX, rawX)),
        y: Math.max(-maxY, Math.min(maxY, rawY)),
        maxX,
        maxY,
      };
    },
    [stageDims.width, stageDims.height, viewportSize.w, viewportSize.h]
  );

  // Move camera to a focus point + zoom on the current scene
  const setCameraTarget = useCallback(
    (focusX: number, focusY: number, zoom: number, instant = false) => {
      const clampedZoom = Math.max(1.0, Math.min(2.65, zoom));
      const { x, y } = computeClampedOffsets(focusX, focusY, clampedZoom);
      targetZoom.current = clampedZoom;
      targetOffsetX.current = x;
      targetOffsetY.current = y;
      setZoomReadout(Number(clampedZoom.toFixed(2)));

      if (instant || reducedMotion) {
        currentZoom.current = clampedZoom;
        currentOffsetX.current = x;
        currentOffsetY.current = y;
      }
    },
    [computeClampedOffsets, reducedMotion]
  );

  // Sync when activeWaypointId changes
  useEffect(() => {
    const resolved = resolveWaypointCamera(activeWaypointId);
    if (resolved.sceneId !== activeSceneId) {
      if (!reducedMotion) {
        setOutgoingSceneId(activeSceneId);
        setIsTransitioningScene(true);
        const timer = setTimeout(() => {
          setOutgoingSceneId(null);
          setIsTransitioningScene(false);
        }, 560);
        setActiveSceneId(resolved.sceneId);
        // Start incoming scene slightly zoomed in so it settles smoothly
        currentZoom.current = Math.min(2.5, resolved.zoom + 0.14);
        const { x, y } = computeClampedOffsets(
          resolved.focusX,
          resolved.focusY,
          resolved.zoom
        );
        currentOffsetX.current = x;
        currentOffsetY.current = y;
        targetZoom.current = resolved.zoom;
        targetOffsetX.current = x;
        targetOffsetY.current = y;
        setZoomReadout(Number(resolved.zoom.toFixed(2)));
        return () => clearTimeout(timer);
      } else {
        setActiveSceneId(resolved.sceneId);
        setCameraTarget(resolved.focusX, resolved.focusY, resolved.zoom, true);
      }
    } else {
      setCameraTarget(resolved.focusX, resolved.focusY, resolved.zoom, false);
    }
  }, [
    activeWaypointId,
    activeSceneId,
    reducedMotion,
    computeClampedOffsets,
    setCameraTarget,
  ]);

  // Pointer drag, wheel zoom, and keyboard pan loop
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      // Ignore clicks on buttons/HUD
      if ((e.target as HTMLElement)?.closest("button, a, select, input")) {
        return;
      }
      isDragging.current = true;
      dragMoved.current = false;
      prevPointer.current = { x: e.clientX, y: e.clientY };
      el.setPointerCapture?.(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      // Subtle ambient lens drift when moving mouse without dragging
      const normX = (e.clientX / Math.max(1, viewportSize.w) - 0.5) * 2;
      const normY = (e.clientY / Math.max(1, viewportSize.h) - 0.5) * 2;
      pointerParallax.current = {
        x: -normX * 18,
        y: -normY * 12,
      };

      if (!isDragging.current) return;
      const dx = e.clientX - prevPointer.current.x;
      const dy = e.clientY - prevPointer.current.y;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        dragMoved.current = true;
      }
      prevPointer.current = { x: e.clientX, y: e.clientY };

      const zoom = targetZoom.current;
      const maxX = Math.max(0, (stageDims.width * zoom - viewportSize.w) / 2);
      const maxY = Math.max(0, (stageDims.height * zoom - viewportSize.h) / 2);

      targetOffsetX.current = Math.max(
        -maxX,
        Math.min(maxX, targetOffsetX.current + dx * 1.15)
      );
      targetOffsetY.current = Math.max(
        -maxY,
        Math.min(maxY, targetOffsetY.current + dy * 1.15)
      );
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging.current) return;
      isDragging.current = false;
      el.releasePointerCapture?.(e.pointerId);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const oldZoom = targetZoom.current;
      const nextZoom = Math.max(
        1.0,
        Math.min(2.65, oldZoom - e.deltaY * 0.0012)
      );
      if (Math.abs(nextZoom - oldZoom) < 0.001) return;

      const ratio = nextZoom / oldZoom;
      const maxX = Math.max(
        0,
        (stageDims.width * nextZoom - viewportSize.w) / 2
      );
      const maxY = Math.max(
        0,
        (stageDims.height * nextZoom - viewportSize.h) / 2
      );

      targetZoom.current = nextZoom;
      targetOffsetX.current = Math.max(
        -maxX,
        Math.min(maxX, targetOffsetX.current * ratio)
      );
      targetOffsetY.current = Math.max(
        -maxY,
        Math.min(maxY, targetOffsetY.current * ratio)
      );
      setZoomReadout(Number(nextZoom.toFixed(2)));
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      keysPressed.current[e.code] = true;
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = false;
    };

    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    el.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [stageDims.width, stageDims.height, viewportSize.w, viewportSize.h]);

  // 60/120fps GPU compositor animation loop (transform: translate3d + scale only)
  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const keys = keysPressed.current;
      const panSpeed = 520 * dt;
      if (
        keys["KeyA"] ||
        keys["ArrowLeft"] ||
        keys["KeyD"] ||
        keys["ArrowRight"] ||
        keys["KeyW"] ||
        keys["ArrowUp"] ||
        keys["KeyS"] ||
        keys["ArrowDown"]
      ) {
        if (keys["KeyA"] || keys["ArrowLeft"]) targetOffsetX.current += panSpeed;
        if (keys["KeyD"] || keys["ArrowRight"]) targetOffsetX.current -= panSpeed;
        if (keys["KeyW"] || keys["ArrowUp"]) targetOffsetY.current += panSpeed;
        if (keys["KeyS"] || keys["ArrowDown"]) targetOffsetY.current -= panSpeed;
      }

      const z = targetZoom.current;
      const maxX = Math.max(0, (stageDims.width * z - viewportSize.w) / 2);
      const maxY = Math.max(0, (stageDims.height * z - viewportSize.h) / 2);

      // Apply subtle pointer drift when not actively dragging, strictly clamped inside bounds
      const desiredX = Math.max(
        -maxX,
        Math.min(
          maxX,
          targetOffsetX.current +
            (reducedMotion ? 0 : pointerParallax.current.x)
        )
      );
      const desiredY = Math.max(
        -maxY,
        Math.min(
          maxY,
          targetOffsetY.current +
            (reducedMotion ? 0 : pointerParallax.current.y)
        )
      );

      const lerp = reducedMotion ? 1.0 : 1.0 - Math.exp(-8.5 * dt);
      currentZoom.current += (z - currentZoom.current) * lerp;
      currentOffsetX.current += (desiredX - currentOffsetX.current) * lerp;
      currentOffsetY.current += (desiredY - currentOffsetY.current) * lerp;

      if (stageRef.current) {
        stageRef.current.style.transform = `translate3d(${currentOffsetX.current.toFixed(
          2
        )}px, ${currentOffsetY.current.toFixed(
          2
        )}px, 0) scale(${currentZoom.current.toFixed(4)})`;
      }

      // Keep hotspot badges crisp & constant size regardless of zoom level
      const invScale = (1 / Math.max(1, currentZoom.current)).toFixed(4);
      for (const key in hotspotScaleRefs.current) {
        const btn = hotspotScaleRefs.current[key];
        if (btn) {
          btn.style.transform = `translate(-50%, -50%) scale(${invScale})`;
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [
    stageDims.width,
    stageDims.height,
    viewportSize.w,
    viewportSize.h,
    reducedMotion,
  ]);

  // Hotspot activation handler
  const handleHotspotClick = useCallback(
    (hs: SceneHotspot) => {
      if (dragMoved.current) return;

      if (hs.zoomTarget) {
        setCameraTarget(
          hs.zoomTarget.focusX,
          hs.zoomTarget.focusY,
          hs.zoomTarget.zoom,
          false
        );
      }

      if (hs.actionType === "waypoint" && hs.targetWaypointId) {
        onSelectWaypoint(hs.targetWaypointId);
      } else if (hs.actionType === "open_levl") {
        onOpenLevlDrawer();
      } else if (hs.actionType === "open_ideas") {
        onOpenIdeaDrawer(activeIdea);
      } else if (hs.actionType === "open_concierge") {
        onOpenConciergeDrawer();
      } else if (hs.actionType === "open_matching") {
        onOpenMatchingDrawer();
      } else if (hs.actionType === "open_screening") {
        onOpenScreeningModal();
      }
    },
    [
      activeIdea,
      onOpenConciergeDrawer,
      onOpenIdeaDrawer,
      onOpenLevlDrawer,
      onOpenMatchingDrawer,
      onOpenScreeningModal,
      onSelectWaypoint,
      setCameraTarget,
    ]
  );

  // Flip 180° between Front Earth View and Rear Rotunda
  const handleToggle180Atrium = useCallback(() => {
    if (activeSceneId === "atrium-front") {
      onSelectWaypoint("atrium-rear-rotunda");
    } else {
      onSelectWaypoint("atrium-commons");
    }
  }, [activeSceneId, onSelectWaypoint]);

  const handleStepZoom = useCallback(
    (delta: number) => {
      const nextZoom = Math.max(
        1.0,
        Math.min(2.6, targetZoom.current + delta)
      );
      const maxX = Math.max(
        0,
        (stageDims.width * nextZoom - viewportSize.w) / 2
      );
      const maxY = Math.max(
        0,
        (stageDims.height * nextZoom - viewportSize.h) / 2
      );
      targetZoom.current = nextZoom;
      targetOffsetX.current = Math.max(
        -maxX,
        Math.min(maxX, targetOffsetX.current)
      );
      targetOffsetY.current = Math.max(
        -maxY,
        Math.min(maxY, targetOffsetY.current)
      );
      setZoomReadout(Number(nextZoom.toFixed(2)));
    },
    [stageDims.width, stageDims.height, viewportSize.w, viewportSize.h]
  );

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-[#030712] cursor-grab active:cursor-grabbing select-none"
      aria-label={activeScene.title}
    >
      {/* Outgoing Scene Layer (During 550ms Optical Portal / 180° Cross-Dissolve) */}
      {outgoingScene && isTransitioningScene && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center transition-all duration-500 ease-out"
          style={{
            opacity: 0,
            transform: "scale(1.12)",
          }}
        >
          <img
            src={outgoingScene.imageSrc}
            alt=""
            className="h-full w-full object-cover"
            draggable={false}
          />
        </div>
      )}

      {/* Active 5.5K Unstitched Master Stage (Centered & GPU-Transformed) */}
      <div className=" absolute inset-0 flex items-center justify-center overflow-hidden">
        <div
          ref={stageRef}
          className={`relative will-change-transform transition-opacity duration-500 ${
            isTransitioningScene ? "opacity-95" : "opacity-100"
          }`}
          style={{
            width: `${stageDims.width}px`,
            height: `${stageDims.height}px`,
          }}
        >
          {/* High-Bitrate 5.5K Architectural Photograph */}
          <img
            src={activeScene.imageSrc}
            alt={activeScene.title}
            className="pointer-events-none h-full w-full object-fill"
            draggable={false}
            fetchPriority="high"
          />

          {/* Subtle Atmospheric Light Vignette (Preserves 100% Center Sharpness) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, transparent 62%, rgba(2, 6, 23, 0.36) 100%)",
            }}
          />

          {/* Pixel-Locked Interactive Spatial Hotspots on the 5.5K Photograph */}
          {showHotspots &&
            !isFocusMode &&
            activeScene.hotspots.map((hs) => {
              const tone = TONE_CLASSES[hs.badgeTone];
              return (
                <button
                  key={hs.id}
                  ref={(el) => {
                    hotspotScaleRefs.current[hs.id] = el;
                  }}
                  type="button"
                  onClick={() => handleHotspotClick(hs)}
                  style={{
                    left: `${hs.xPercent}%`,
                    top: `${hs.yPercent}%`,
                    transform: "translate(-50%, -50%) scale(1)",
                  }}
                  className={`group pointer-events-auto absolute z-10 flex cursor-pointer items-center gap-2.5 rounded-2xl border px-3 py-2 text-left shadow-[0_8px_32px_rgba(0,0,0,0.65)] backdrop-blur-xl transition-colors duration-200 ${tone.pill}`}
                >
                  {/* Pulsing Spatial Anchor Beacon */}
                  <span className="relative flex h-3 w-3 shrink-0 items-center justify-center">
                    <span
                      className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-65 ${tone.dot}`}
                    />
                    <span
                      className={`relative inline-flex h-2.5 w-2.5 rounded-full ${tone.dot}`}
                    />
                  </span>

                  <span className="flex flex-col leading-tight">
                    <span className="flex items-center gap-1 text-xs font-bold tracking-wide text-white">
                      {hs.label}
                      {hs.isPortal && (
                        <ArrowUpRight className="h-3.5 w-3.5 opacity-85 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      )}
                    </span>
                    <span className="text-[10px] font-medium opacity-80">
                      {hs.sublabel}
                    </span>
                  </span>
                </button>
              );
            })}
        </div>
      </div>

      {/* Bottom-Center Spatial Vantage & 180° Rotation Dock (Above Focus/DJ Bar) */}
      <div
        className={`pointer-events-auto fixed bottom-16 left-1/2 z-20 flex -translate-x-1/2 flex-wrap items-center justify-center gap-1.5 rounded-2xl border border-white/15 bg-slate-950/82 px-3 py-2 text-xs text-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.75)] backdrop-blur-2xl transition-opacity duration-300 ${
          isFocusMode ? "opacity-25 hover:opacity-95" : "opacity-100"
        }`}
      >
        {/* 3 Core 5.5K Master Views Switcher */}
        <button
          type="button"
          onClick={() => onSelectWaypoint("atrium-commons")}
          className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 font-semibold transition ${
            activeSceneId === "atrium-front"
              ? "bg-amber-300 text-slate-950 shadow-[0_0_15px_rgba(252,211,77,0.4)]"
              : "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
          }`}
        >
          <Compass className="h-3.5 w-3.5" />
          <span>Front: Earth View (5.5K)</span>
        </button>

        <button
          type="button"
          onClick={handleToggle180Atrium}
          className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 font-semibold transition ${
            activeSceneId === "atrium-rear"
              ? "bg-amber-300 text-slate-950 shadow-[0_0_15px_rgba(252,211,77,0.4)]"
              : "border border-amber-300/35 bg-amber-950/50 text-amber-200 hover:bg-amber-900/60"
          }`}
          title="Flip 180° between Front Earth Panorama and Rear Space-Elevator Rotunda"
        >
          <RotateCw className="h-3.5 w-3.5" />
          <span>
            {activeSceneId === "atrium-rear"
              ? "Viewing 180° Rear Rotunda (5.5K)"
              : "Turn 180° Around (Rear 5.5K)"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectWaypoint("tobehuman-sanctuary")}
          className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 font-semibold transition ${
            activeSceneId === "tobehuman-interior"
              ? "bg-violet-300 text-slate-950 shadow-[0_0_15px_rgba(196,181,253,0.45)]"
              : "border border-violet-400/35 bg-violet-950/50 text-violet-200 hover:bg-violet-900/60"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>TO BE HUMAN Sanctuary (5.5K)</span>
        </button>

        <span className="mx-1 hidden h-4 w-px bg-white/15 sm:inline-block" />

        {/* Optical Lens Zoom & Full-Frame Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleStepZoom(-0.22)}
            aria-label="Zoom out"
            title="Zoom Out (Wide Angle)"
            className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setCameraTarget(0.5, 0.5, 1.0, false)}
            title="Reset to 100% Full Uncropped 5.5K Frame (1.0x)"
            className="cursor-pointer rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-mono text-slate-200 hover:bg-white/10"
          >
            {zoomReadout.toFixed(1)}×
          </button>

          <button
            type="button"
            onClick={() => handleStepZoom(0.25)}
            aria-label="Zoom in to 5.5K detail"
            title="Zoom In to Inspect 5.5K Architectural Detail"
            className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() =>
              setCameraTarget(
                activeScene.defaultFocusX,
                activeScene.defaultFocusY,
                1.0,
                false
              )
            }
            aria-label="Fit entire 5.5K image"
            title="View Full 1.0× Wide Frame"
            className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            aria-pressed={!showHotspots}
            onClick={() => setShowHotspots((prev) => !prev)}
            title={
              showHotspots
                ? "Hide Interactive Pins (Pure Photography View)"
                : "Show Interactive Spatial Pins"
            }
            className={`cursor-pointer rounded-lg border p-1.5 transition ${
              !showHotspots
                ? "border-amber-300/50 bg-amber-950/60 text-amber-200"
                : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            {showHotspots ? (
              <Eye className="h-3.5 w-3.5" />
            ) : (
              <EyeOff className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Subtle Top-Right Resolution & Control Hint Pill */}
      <div className="pointer-events-none fixed top-16 right-4 z-10 hidden items-center gap-2 rounded-full border border-white/10 bg-slate-950/65 px-3 py-1 text-[11px] text-slate-300 backdrop-blur-md xl:flex">
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        <span>{activeScene.resolutionBadge}</span>
        <span className="text-slate-500">•</span>
        <span className="text-slate-400">Drag to Pan • Scroll to Zoom 2.6×</span>
      </div>
    </div>
  );
}
