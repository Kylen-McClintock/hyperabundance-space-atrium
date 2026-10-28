"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Sparkles, useTexture } from "@react-three/drei";
import * as THREE from "three";
import {
  SPATIAL_WAYPOINTS,
  StageId,
  getWaypointById,
} from "@/lib/spatial/waypoint-registry";
import {
  AgiFuturesIdea,
  SectorBoothId,
} from "@/data/agifutures-catalog";
import { IdeaHologram } from "@/components/spatial/objects/IdeaHologram";
import { Eye, EyeOff, Compass, Sparkles as SparklesIcon, RotateCcw } from "lucide-react";

export type QualityTier = "high" | "balanced" | "lightweight";

interface OrbitalCanvasProps {
  activeWaypointId: string;
  onSelectWaypoint: (waypointId: string) => void;
  activeIdea: AgiFuturesIdea;
  sectorIdeaMap: Record<SectorBoothId, AgiFuturesIdea>;
  onOpenIdeaDrawer: (idea: AgiFuturesIdea) => void;
  onOpenLevlDrawer: (modalitySlug?: string) => void;
  onOpenScreeningModal: () => void;
  onOpenMatchingDrawer: () => void;
  onOpenConciergeDrawer: () => void;
  isFocusMode: boolean;
  reducedMotion: boolean;
  qualityTier: QualityTier;
}

const STAGE_TEXTURES: Record<StageId, string> = {
  "atrium-grand": "/concepts/atrium-radiant-3.png",
  "atrium-terrace": "/concepts/atrium-radiant-1.png",
  "pods-workbays": "/concepts/atrium-work-bays.png",
  "pods-garden": "/concepts/orbital-garden-pods.png",
  "levl-lounge": "/concepts/levl-lounge.png",
  "agifutures-club": "/concepts/agifutures-club.png",
};

const STAGE_LABELS: { id: StageId; label: string; defaultWaypointId: string }[] = [
  { id: "atrium-grand", label: "Grand Orbital Atrium", defaultWaypointId: "atrium-commons" },
  { id: "atrium-terrace", label: "Bartender, Library & DJ Deck", defaultWaypointId: "atrium-concierge" },
  { id: "levl-lounge", label: "LEVL Longevity Lounge", defaultWaypointId: "levl-lounge-entry" },
  { id: "agifutures-club", label: "AGI Futures Builder Club", defaultWaypointId: "agi-club-overview" },
  { id: "pods-workbays", label: "Earthview Bubble Pods", defaultWaypointId: "pod-earthview-1" },
  { id: "pods-garden", label: "Botanical Canopy Pods", defaultWaypointId: "pod-earthview-2" },
];

// ============================================================================
// 1. CURVED 3D AMPHITHEATER GEOMETRY WITH PERSPECTIVE VAULT & FLOOR CURVATURE
// ============================================================================
function createCurvedAmphitheaterGeometry(
  width = 34,
  height = 19.125,
  segX = 192,
  segY = 108
): THREE.BufferGeometry {
  const geo = new THREE.PlaneGeometry(width, height, segX, segY);
  const pos = geo.attributes.position;
  const uvs = geo.attributes.uv;

  for (let i = 0; i < pos.count; i++) {
    const u = uvs.getX(i); // 0..1 left to right
    const v = uvs.getY(i); // 0..1 bottom to top

    const nx = (u - 0.5) * 2.0; // -1..1
    const ny = (v - 0.5) * 2.0; // -1..1

    // Horizontal wrap-around amphitheater curve so side portals wrap around the viewer
    const horizAngle = nx * 0.62;
    const radius = 26.5;
    const x = Math.sin(horizAngle) * radius;
    let z = -(radius - Math.cos(horizAngle) * radius) * 1.15;

    // Vertical floor & ceiling vault curve (sunken glass floor projects forward, skylight arches overhead)
    if (ny < -0.25) {
      const floorT = Math.abs(ny + 0.25) / 0.75;
      z += Math.pow(floorT, 1.55) * 3.85;
    } else if (ny > 0.35) {
      const vaultT = (ny - 0.35) / 0.65;
      z += Math.pow(vaultT, 1.45) * 2.65;
    }

    const y = ny * (height * 0.5);
    pos.setXYZ(i, x, y, z);
  }

  geo.computeVertexNormals();
  return geo;
}

// ============================================================================
// 2. CUSTOM GLSL PHOTOREALISTIC DEPTH-RELIEF & LIVE ORBITAL SHADER
// ============================================================================
const PHOTOREAL_VERTEX_SHADER = /* glsl */ `
  uniform sampler2D uTexCurrent;
  uniform sampler2D uTexNext;
  uniform float uTransition;
  uniform float uTime;
  uniform float uReducedMotion;

  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying float vDepthRelief;

  float computeSceneDepth(vec4 col, vec2 uv) {
    // Deep blue/cobalt regions (Earth window + glass-floor oculus) sit deeper in 3D space
    float blueDominance = clamp((col.b - col.r * 0.82) * 2.2, 0.0, 1.0);
    // Warm architectural ribs, brass rings, and foreground sofas project forward
    float warmLuminance = dot(col.rgb, vec3(0.35, 0.45, 0.20));
    float edgeFrame = smoothstep(0.15, 0.95, abs(uv.x - 0.5) * 2.0);
    float foregroundFloor = smoothstep(0.42, 0.0, uv.y);

    float relief = (warmLuminance * 0.95 + edgeFrame * 0.45 + foregroundFloor * 0.65) - (blueDominance * 1.45);
    return clamp(relief, -1.35, 1.35);
  }

  void main() {
    vUv = uv;

    vec4 c1 = texture2D(uTexCurrent, uv);
    vec4 c2 = texture2D(uTexNext, uv);
    vec4 blended = mix(c1, c2, uTransition);

    float relief = computeSceneDepth(blended, uv);
    vDepthRelief = relief;

    vec3 displaced = position;
    // Apply smooth 3D depth relief along Z + subtle warp during room transitions
    float transitionWave = sin(uTransition * 3.14159265) * 0.85 * (1.0 - uReducedMotion);
    displaced.z += relief * 0.95 - transitionWave * (1.0 - length(uv - 0.5));

    vec4 worldPosition = modelMatrix * vec4(displaced, 1.0);
    vWorldPos = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const PHOTOREAL_FRAGMENT_SHADER = /* glsl */ `
  uniform sampler2D uTexCurrent;
  uniform sampler2D uTexNext;
  uniform float uTransition;
  uniform float uTime;
  uniform float uFocusMode;
  uniform float uReducedMotion;
  uniform vec2 uPointer;

  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying float vDepthRelief;

  // High-frequency hash for twinkling orbital city lights
  float hash21(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }

  void main() {
    // Subtle depth-based micro-parallax from pointer movement
    vec2 parallaxOffset = uPointer * vDepthRelief * 0.0048 * (1.0 - uReducedMotion);
    vec2 uv = clamp(vUv + parallaxOffset, 0.002, 0.998);

    // Smooth cross-dissolve between rooms
    vec4 colA = texture2D(uTexCurrent, uv);
    vec4 colB = texture2D(uTexNext, uv);
    vec3 color = mix(colA.rgb, colB.rgb, smoothstep(0.0, 1.0, uTransition));

    // 1. Detect Earth Window & Sunken Glass-Floor Lounge Pixels
    float isEarthRegion = smoothstep(0.08, 0.35, color.b - color.r * 0.65);
    float isCityLightOnEarth = smoothstep(0.55, 0.88, color.r) * smoothstep(0.35, 0.78, color.g) * (1.0 - smoothstep(0.45, 0.85, color.b));

    if (uReducedMotion < 0.5) {
      // Twinkling golden city-light networks on Earth & through the glass-floor pits
      float twinkleGrid = hash21(floor(uv * 420.0));
      float twinkle = 0.5 + 0.5 * sin(uTime * (2.4 + twinkleGrid * 4.5) + twinkleGrid * 6.2831);
      color += color * isCityLightOnEarth * twinkle * 0.22;

      // Subtle atmospheric cloud & limb shimmer over Earth
      float cloudWave = sin(uv.x * 18.0 + uTime * 0.35) * cos(uv.y * 14.0 - uTime * 0.25);
      color += vec3(0.04, 0.11, 0.22) * isEarthRegion * (0.5 + 0.5 * cloudWave) * 0.14;

      // Dynamic Specular Light Sweep across polished marble floor, brass rings, and glass pods
      vec2 lightPos = vec2(0.5 + sin(uTime * 0.42) * 0.28 + uPointer.x * 0.25, 0.45 + cos(uTime * 0.31) * 0.22 + uPointer.y * 0.2);
      float distToLight = length(uv - lightPos);
      float luma = dot(color, vec3(0.299, 0.587, 0.114));
      float specMask = smoothstep(0.45, 0.92, luma) * smoothstep(0.55, 0.0, distToLight);
      color += vec3(1.0, 0.93, 0.78) * specMask * 0.09;

      // Subtle diagonal volumetric golden sun-shafts from upper skylight arch
      float rayCoord = uv.x * 0.85 + uv.y * 0.55;
      float godRay = pow(0.5 + 0.5 * sin(rayCoord * 16.0 - uTime * 0.28), 4.0);
      float upperFade = smoothstep(0.15, 0.95, uv.y) * (1.0 - smoothstep(0.0, 0.38, abs(uv.x - 0.5)));
      color += vec3(1.0, 0.88, 0.62) * godRay * upperFade * 0.045;
    }

    // 2. Focus Mode Sanctuary Toning (Warm golden rim + calm ambient dimming)
    if (uFocusMode > 0.01) {
      vec3 focusToned = color * mix(vec3(0.82, 0.86, 0.94), vec3(1.08, 1.02, 0.95), isEarthRegion);
      color = mix(color, focusToned, uFocusMode * 0.65);
    }

    // 3. Soft vignette at extreme outer edges of the 3D dome
    float edgeVignette = smoothstep(1.38, 0.75, length((vUv - 0.5) * vec2(1.65, 1.35)));
    color *= mix(0.72, 1.0, edgeVignette);

    gl_FragColor = vec4(color, 1.0);
  }
`;

// ============================================================================
// 3. PHOTOREALISTIC 3D CURVED STAGE COMPONENT
// ============================================================================
function PhotorealCurvedStage({
  activeStageId,
  isFocusMode,
  reducedMotion,
  pointerRef,
}: {
  activeStageId: StageId;
  isFocusMode: boolean;
  reducedMotion: boolean;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const { gl } = useThree();

  const textures = useTexture(STAGE_TEXTURES);

  // Configure maximum anisotropic filtering & sRGB color space for razor-sharp 4K detail
  useEffect(() => {
    const maxAniso = gl.capabilities.getMaxAnisotropy();
    Object.values(textures).forEach((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = Math.min(16, maxAniso);
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.needsUpdate = true;
    });
  }, [textures, gl]);

  const geometry = useMemo(
    () => createCurvedAmphitheaterGeometry(34, 19.125, 192, 108),
    []
  );

  const prevStageRef = useRef<StageId>(activeStageId);
  const transitionRef = useRef(1);

  const uniforms = useMemo(
    () => ({
      uTexCurrent: { value: textures[activeStageId] },
      uTexNext: { value: textures[activeStageId] },
      uTransition: { value: 1.0 },
      uTime: { value: 0 },
      uFocusMode: { value: 0 },
      uReducedMotion: { value: reducedMotion ? 1.0 : 0.0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (prevStageRef.current !== activeStageId) {
      uniforms.uTexCurrent.value = textures[prevStageRef.current];
      uniforms.uTexNext.value = textures[activeStageId];
      transitionRef.current = reducedMotion ? 1.0 : 0.0;
      uniforms.uTransition.value = transitionRef.current;
      prevStageRef.current = activeStageId;
    } else {
      uniforms.uTexCurrent.value = textures[activeStageId];
      uniforms.uTexNext.value = textures[activeStageId];
    }
  }, [activeStageId, textures, uniforms, reducedMotion]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uReducedMotion.value = reducedMotion ? 1.0 : 0.0;

    // Smoothly interpolate transition between stages
    if (transitionRef.current < 1.0) {
      transitionRef.current = Math.min(1.0, transitionRef.current + dt * 1.85);
      uniforms.uTransition.value = transitionRef.current;
    }

    // Smoothly interpolate focus mode uniform
    const targetFocus = isFocusMode ? 1.0 : 0.0;
    uniforms.uFocusMode.value = THREE.MathUtils.lerp(
      uniforms.uFocusMode.value,
      targetFocus,
      dt * 3.0
    );

    // Smoothly interpolate pointer parallax vector
    uniforms.uPointer.value.lerp(
      new THREE.Vector2(pointerRef.current.x, pointerRef.current.y),
      dt * 6.0
    );
  });

  return (
    <mesh geometry={geometry} position={[0, 0, -11.0]}>
      <shaderMaterial
        vertexShader={PHOTOREAL_VERTEX_SHADER}
        fragmentShader={PHOTOREAL_FRAGMENT_SHADER}
        uniforms={uniforms}
        toneMapped={false}
      />
    </mesh>
  );
}

// ============================================================================
// 4. SLEEK ROOM-SCOPED SPATIAL BEACONS (No Cross-Room Clutter!)
// ============================================================================
interface SpatialBeaconSpec {
  id: string;
  label: string;
  sublabel: string;
  accent: "cyan" | "emerald" | "amber" | "teal";
  position: [number, number, number];
  onTrigger: () => void;
}

function SpatialHotspotBeacon({
  beacon,
  isActive,
  reducedMotion,
}: {
  beacon: SpatialBeaconSpec;
  isActive: boolean;
  reducedMotion: boolean;
}) {
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const colorHex =
    beacon.accent === "emerald"
      ? "#34d399"
      : beacon.accent === "teal"
      ? "#2dd4bf"
      : beacon.accent === "amber"
      ? "#fbbf24"
      : "#38bdf8";

  useFrame((state) => {
    if (!ringRef.current || reducedMotion) return;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.6 + beacon.position[0]) * 0.08;
    ringRef.current.scale.setScalar(hovered || isActive ? pulse * 1.22 : pulse);
  });

  return (
    <group position={beacon.position}>
      {/* Glowing 3D Spatial Target Ring */}
      <mesh
        ref={ringRef}
        onClick={(e) => {
          e.stopPropagation();
          beacon.onTrigger();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <ringGeometry args={[0.26, 0.34, 32]} />
        <meshBasicMaterial
          color={colorHex}
          transparent
          opacity={hovered || isActive ? 0.95 : 0.65}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Center Luminous Dot */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          beacon.onTrigger();
        }}
      >
        <circleGeometry args={[0.1, 24]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={hovered || isActive ? 0.95 : 0.75}
        />
      </mesh>

      {/* Sleek Glassmorphic Spatial Pin */}
      <Html
        position={[0, 0.48, 0]}
        center
        distanceFactor={15}
        zIndexRange={[10, 0]}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            beacon.onTrigger();
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`group flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1 text-left shadow-xl backdrop-blur-md transition-all duration-200 ${
            isActive
              ? "border-amber-300/80 bg-slate-950/90 text-white ring-2 ring-amber-400/30"
              : "border-white/25 bg-slate-950/65 text-slate-100 hover: scale-105 hover:border-sky-300/80 hover:bg-slate-950/90"
          }`}
        >
          <span
            className="h-2 w-2 shrink-0 rounded-full shadow-sm"
            style={{ backgroundColor: colorHex, boxShadow: `0 0 8px ${colorHex}` }}
          />
          <span className="text-[11px] font-semibold tracking-wide whitespace-nowrap">
            {beacon.label}
          </span>
          <span className="hidden text-[10px] text-slate-300/85 group-hover:inline whitespace-nowrap">
            • {beacon.sublabel}
          </span>
        </button>
      </Html>
    </group>
  );
}

// ============================================================================
// 5. ROOM-SCOPED SPATIAL OVERLAYS & HOLOGRAMS
// ============================================================================
function StageInteractiveOverlays({
  activeStageId,
  activeWaypointId,
  onSelectWaypoint,
  activeIdea,
  sectorIdeaMap,
  onOpenIdeaDrawer,
  onOpenLevlDrawer,
  onOpenScreeningModal,
  onOpenMatchingDrawer,
  onOpenConciergeDrawer,
  reducedMotion,
  showBeacons,
}: {
  activeStageId: StageId;
  activeWaypointId: string;
  onSelectWaypoint: (id: string) => void;
  activeIdea: AgiFuturesIdea;
  sectorIdeaMap: Record<SectorBoothId, AgiFuturesIdea>;
  onOpenIdeaDrawer: (idea: AgiFuturesIdea) => void;
  onOpenLevlDrawer: (modalitySlug?: string) => void;
  onOpenScreeningModal: () => void;
  onOpenMatchingDrawer: () => void;
  onOpenConciergeDrawer: () => void;
  reducedMotion: boolean;
  showBeacons: boolean;
}) {
  const beacons = useMemo<SpatialBeaconSpec[]>(() => {
    if (activeStageId === "atrium-grand") {
      return [
        {
          id: "levl-lounge-entry",
          label: "LEVL Longevity Lounge",
          sublabel: "Enter West Wing →",
          accent: "teal",
          position: [-11.8, 0.35, -8.8],
          onTrigger: () => onSelectWaypoint("levl-lounge-entry"),
        },
        {
          id: "agi-club-overview",
          label: "AGI Futures Club",
          sublabel: "Enter East Wing →",
          accent: "emerald",
          position: [11.8, 0.35, -8.8],
          onTrigger: () => onSelectWaypoint("agi-club-overview"),
        },
        {
          id: "lounge-pit-west",
          label: "West Earth-Glass Lounge",
          sublabel: "Sunken Glass Floor",
          accent: "amber",
          position: [-5.4, -3.5, -8.6],
          onTrigger: () => onSelectWaypoint("lounge-pit-west"),
        },
        {
          id: "lounge-pit-east",
          label: "East Earth-Glass Lounge",
          sublabel: "Sunken Glass Floor",
          accent: "amber",
          position: [5.6, -3.5, -8.6],
          onTrigger: () => onSelectWaypoint("lounge-pit-east"),
        },
        {
          id: "pod-earthview-1",
          label: "Bubble Pod α1",
          sublabel: "+24 ft Outward Pod",
          accent: "cyan",
          position: [-8.2, 4.3, -9.2],
          onTrigger: () => onSelectWaypoint("pod-earthview-1"),
        },
        {
          id: "pod-earthview-2",
          label: "Bubble Pod α2",
          sublabel: "+28 ft Apex Pod",
          accent: "cyan",
          position: [-4.6, 5.4, -10.2],
          onTrigger: () => onSelectWaypoint("pod-earthview-2"),
        },
        {
          id: "pod-earthview-3",
          label: "Bubble Pod β1",
          sublabel: "+28 ft Apex Pod",
          accent: "cyan",
          position: [5.4, 2.8, -10.2],
          onTrigger: () => onSelectWaypoint("pod-earthview-3"),
        },
        {
          id: "pod-earthview-4",
          label: "Bubble Pod β2",
          sublabel: "+24 ft Outward Pod",
          accent: "cyan",
          position: [10.2, 4.2, -9.0],
          onTrigger: () => onSelectWaypoint("pod-earthview-4"),
        },
        {
          id: "atrium-concierge",
          label: "Bartender, Library & DJ Terrace",
          sublabel: "AI Concierge & Briefing",
          accent: "amber",
          position: [0.0, -0.8, -10.2],
          onTrigger: () => onSelectWaypoint("atrium-concierge"),
        },
      ];
    }

    if (activeStageId === "atrium-terrace") {
      return [
        {
          id: "levl-protocol-bar",
          label: "Holographic AI Bartender (Sora)",
          sublabel: "Open LEVL Protocol Bar",
          accent: "teal",
          position: [-9.2, -0.4, -9.2],
          onTrigger: () => onOpenLevlDrawer("zone-2-and-vo2max-training"),
        },
        {
          id: "conservatory-deck",
          label: "Circular Glass Botanical Library",
          sublabel: "Station Briefing & Reading Nook",
          accent: "amber",
          position: [-2.2, 0.5, -10.2],
          onTrigger: () => onOpenConciergeDrawer(),
        },
        {
          id: "agi-holo-table",
          label: "AGI Futures Hologram Lab",
          sublabel: "Inspect 33 Startup Blueprints",
          accent: "emerald",
          position: [6.4, -0.8, -9.6],
          onTrigger: () => onOpenIdeaDrawer(activeIdea),
        },
        {
          id: "pod-earthview-1",
          label: "Upper West Bubble Pods",
          sublabel: "Enter Focus Pod Bay",
          accent: "cyan",
          position: [-6.4, 3.8, -9.6],
          onTrigger: () => onSelectWaypoint("pod-earthview-1"),
        },
        {
          id: "pod-earthview-4",
          label: "Upper East Bubble Pods",
          sublabel: "Enter Focus Pod Bay",
          accent: "cyan",
          position: [6.8, 3.8, -9.6],
          onTrigger: () => onSelectWaypoint("pod-earthview-4"),
        },
        {
          id: "atrium-commons",
          label: "← Return to Grand Atrium",
          sublabel: "Overview Vista",
          accent: "cyan",
          position: [0.0, -3.8, -8.8],
          onTrigger: () => onSelectWaypoint("atrium-commons"),
        },
      ];
    }

    if (activeStageId === "levl-lounge") {
      return [
        {
          id: "levl-protocol-bar",
          label: "LEVL Alabaster Protocol Bar",
          sublabel: "Draft Protocol & PubMed RCTs",
          accent: "teal",
          position: [-9.2, -0.9, -9.4],
          onTrigger: () => {
            onSelectWaypoint("levl-protocol-bar");
            onOpenLevlDrawer("zone-2-and-vo2max-training");
          },
        },
        {
          id: "levl-screening-wall",
          label: "Research Screening Wall",
          sublabel: "Living Longer • Living Better (Auto-Ducks DJ)",
          accent: "amber",
          position: [9.4, 0.2, -9.4],
          onTrigger: () => {
            onSelectWaypoint("levl-screening-wall");
            onOpenScreeningModal();
          },
        },
        {
          id: "levl-spa-sauna",
          label: "Finnish Sauna & Cold Plunge Suite",
          sublabel: "80°C Heat & 12°C Cold Evidence",
          accent: "amber",
          position: [-6.4, 2.3, -10.2],
          onTrigger: () => {
            onSelectWaypoint("levl-spa-sauna");
            onOpenLevlDrawer("finnish-sauna");
          },
        },
        {
          id: "levl-spa-hbot",
          label: "HBOT & Photobiomodulation Alcove",
          sublabel: "2.0 ATA Hyperbaric & 660nm NIR",
          accent: "cyan",
          position: [6.4, 2.4, -10.2],
          onTrigger: () => {
            onSelectWaypoint("levl-spa-hbot");
            onOpenLevlDrawer("hyperbaric-oxygen-therapy");
          },
        },
        {
          id: "levl-lounge-entry",
          label: "LEVL Sunken Earth-Glass Pit",
          sublabel: "Center Conversation Lounge",
          accent: "teal",
          position: [0.6, -3.2, -9.0],
          onTrigger: () => onSelectWaypoint("levl-lounge-entry"),
        },
        {
          id: "atrium-commons",
          label: "← Return to Central Atrium",
          sublabel: "Main Hub",
          accent: "cyan",
          position: [-11.5, -3.6, -8.5],
          onTrigger: () => onSelectWaypoint("atrium-commons"),
        },
      ];
    }

    if (activeStageId === "agifutures-club") {
      return [
        {
          id: "agi-booth-homes",
          label: "Booth 1: Homes & Cities",
          sublabel: "Signal House, Porchfront, Hearth",
          accent: "emerald",
          position: [-9.2, -0.6, -9.2],
          onTrigger: () => {
            onSelectWaypoint("agi-booth-homes");
            onOpenIdeaDrawer(sectorIdeaMap["homes-cities"] || activeIdea);
          },
        },
        {
          id: "agi-booth-energy",
          label: "Booth 2: Clean Energy & Planet",
          sublabel: "HelioTerra, Skyhold, Wild Return",
          accent: "amber",
          position: [-5.4, 0.6, -10.2],
          onTrigger: () => {
            onSelectWaypoint("agi-booth-energy");
            onOpenIdeaDrawer(sectorIdeaMap["clean-energy-planet"] || activeIdea);
          },
        },
        {
          id: "agi-booth-biotech",
          label: "Booth 3: Biotech & Longevity",
          sublabel: "BioWalls, BioArk, BiomeX",
          accent: "teal",
          position: [-2.2, 0.9, -10.4],
          onTrigger: () => {
            onSelectWaypoint("agi-booth-biotech");
            onOpenIdeaDrawer(sectorIdeaMap["biotech-longevity"] || activeIdea);
          },
        },
        {
          id: "agi-booth-ai",
          label: "Booth 4: AI & Enterprise",
          sublabel: "Main Street Legacy, AI Founder Lab",
          accent: "cyan",
          position: [5.4, 0.5, -10.2],
          onTrigger: () => {
            onSelectWaypoint("agi-booth-ai");
            onOpenIdeaDrawer(sectorIdeaMap["ai-autonomous-enterprise"] || activeIdea);
          },
        },
        {
          id: "agi-builder-guide",
          label: "AI Builder Guide (Kaelen)",
          sublabel: "14-Day Experiments & Assumptions",
          accent: "emerald",
          position: [9.2, -0.8, -9.2],
          onTrigger: () => {
            onSelectWaypoint("agi-builder-guide");
            onOpenIdeaDrawer(activeIdea);
          },
        },
        {
          id: "agi-matching-wall",
          label: "Founder Matching Wall",
          sublabel: "Building • Looking For • Can Help",
          accent: "amber",
          position: [3.2, 2.2, -10.2],
          onTrigger: () => {
            onSelectWaypoint("agi-matching-wall");
            onOpenMatchingDrawer();
          },
        },
        {
          id: "atrium-commons",
          label: "← Return to Central Atrium",
          sublabel: "Main Hub",
          accent: "cyan",
          position: [-11.5, -3.6, -8.5],
          onTrigger: () => onSelectWaypoint("atrium-commons"),
        },
      ];
    }

    // Pods-workbays or Pods-garden
    return [
      {
        id: "pod-earthview-1",
        label: "Pod α1 (Upper West Bay)",
        sublabel: "+24 ft Earthview Desk",
        accent: "cyan",
        position: [-5.8, 2.6, -9.6],
        onTrigger: () => onSelectWaypoint("pod-earthview-1"),
      },
      {
        id: "pod-earthview-2",
        label: "Pod α2 (Canopy Bubble Pod)",
        sublabel: "+28 ft Botanical Canopy",
        accent: "emerald",
        position: [-4.2, 4.4, -10.0],
        onTrigger: () => onSelectWaypoint("pod-earthview-2"),
      },
      {
        id: "pod-earthview-4",
        label: "Pod β2 (Upper East Bay)",
        sublabel: "+24 ft Earthview Desk",
        accent: "cyan",
        position: [5.8, 2.6, -9.6],
        onTrigger: () => onSelectWaypoint("pod-earthview-4"),
      },
      {
        id: "lounge-pit-west",
        label: "West Sunken Glass Lounge",
        sublabel: "Earth-Glass Floor Below",
        accent: "amber",
        position: [-4.8, -3.4, -8.8],
        onTrigger: () => onSelectWaypoint("lounge-pit-west"),
      },
      {
        id: "lounge-pit-east",
        label: "East Sunken Glass Lounge",
        sublabel: "Earth-Glass Floor Below",
        accent: "amber",
        position: [4.8, -3.4, -8.8],
        onTrigger: () => onSelectWaypoint("lounge-pit-east"),
      },
      {
        id: "atrium-commons",
        label: "← Return to Grand Atrium",
        sublabel: "Central Hub",
        accent: "teal",
        position: [0.0, -3.8, -8.8],
        onTrigger: () => onSelectWaypoint("atrium-commons"),
      },
    ];
  }, [
    activeStageId,
    activeIdea,
    sectorIdeaMap,
    onSelectWaypoint,
    onOpenIdeaDrawer,
    onOpenLevlDrawer,
    onOpenScreeningModal,
    onOpenMatchingDrawer,
    onOpenConciergeDrawer,
  ]);

  return (
    <group>
      {/* In AGI Futures Club, project the live 3D rotating hologram over the central table */}
      {activeStageId === "agifutures-club" && (
        <IdeaHologram
          idea={activeIdea}
          position={[-0.15, -1.35, -8.2]}
          scale={0.95}
          reducedMotion={reducedMotion}
          onSelect={() => {
            onSelectWaypoint("agi-holo-table");
            onOpenIdeaDrawer(activeIdea);
          }}
        />
      )}

      {/* Room-Scoped Spatial Beacons */}
      {showBeacons &&
        beacons.map((b) => (
          <SpatialHotspotBeacon
            key={b.id}
            beacon={b}
            isActive={activeWaypointId === b.id}
            reducedMotion={reducedMotion}
          />
        ))}
    </group>
  );
}

// ============================================================================
// 6. FIRST-PERSON NON-LOCKING CAMERA RIG (Spline Drift + Parallax + Zoom + WASD)
// ============================================================================
function FirstPersonDriftRig({
  activeWaypointId,
  reducedMotion,
  pointerRef,
}: {
  activeWaypointId: string;
  reducedMotion: boolean;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera, gl } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0.35, 9.2));
  const currentLookAt = useRef(new THREE.Vector3(0, 0.25, -12.0));
  const targetLookAt = useRef(new THREE.Vector3(0, 0.25, -12.0));

  const yawOffset = useRef(0);
  const pitchOffset = useRef(0);
  const zoomOffset = useRef(0);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const keysPressed = useRef<Set<string>>(new Set());

  useEffect(() => {
    const wp = getWaypointById(activeWaypointId);
    targetPos.current.set(...wp.cameraPos);
    targetLookAt.current.set(...wp.lookAt);
    yawOffset.current = 0;
    pitchOffset.current = 0;
    zoomOffset.current = 0;

    if (reducedMotion) {
      camera.position.copy(targetPos.current);
      currentLookAt.current.copy(targetLookAt.current);
      camera.lookAt(currentLookAt.current);
    }
  }, [activeWaypointId, camera, reducedMotion]);

  useEffect(() => {
    const dom = gl.domElement;

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      isDragging.current = true;
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      // Normalized pointer coordinates (-1..1) for real-time 3D depth parallax
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -((e.clientY / window.innerHeight) * 2 - 1);
      pointerRef.current = { x: nx, y: ny };

      if (!isDragging.current) return;
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      lastMouse.current = { x: e.clientX, y: e.clientY };
      yawOffset.current = Math.max(
        -0.42,
        Math.min(0.42, yawOffset.current - dx * 0.0024)
      );
      pitchOffset.current = Math.max(
        -0.28,
        Math.min(0.28, pitchOffset.current - dy * 0.002)
      );
    };

    const onPointerUp = () => {
      isDragging.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      zoomOffset.current = Math.max(
        -3.8,
        Math.min(2.2, zoomOffset.current + e.deltaY * 0.004)
      );
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      keysPressed.current.add(e.key.toLowerCase());
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    dom.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    dom.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      dom.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      dom.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [gl, pointerRef]);

  useFrame((state, delta) => {
    if (document.hidden) return;
    const dt = Math.min(delta, 0.1);

    // Optional WASD / Arrow-Key Free Float within stage bounds
    const moveSpeed = 3.2 * dt;
    if (keysPressed.current.has("w") || keysPressed.current.has("arrowup")) {
      zoomOffset.current = Math.max(-3.8, zoomOffset.current - moveSpeed);
    }
    if (keysPressed.current.has("s") || keysPressed.current.has("arrowdown")) {
      zoomOffset.current = Math.min(2.2, zoomOffset.current + moveSpeed);
    }
    if (keysPressed.current.has("a") || keysPressed.current.has("arrowleft")) {
      yawOffset.current = Math.max(-0.42, yawOffset.current + moveSpeed * 0.25);
    }
    if (keysPressed.current.has("d") || keysPressed.current.has("arrowright")) {
      yawOffset.current = Math.min(0.42, yawOffset.current - moveSpeed * 0.25);
    }

    // Subtle zero-G breathing float + mouse parallax sway
    const t = state.clock.elapsedTime;
    const breathX = reducedMotion
      ? 0
      : Math.sin(t * 0.45) * 0.12 + pointerRef.current.x * 0.48;
    const breathY = reducedMotion
      ? 0
      : Math.cos(t * 0.35) * 0.08 + pointerRef.current.y * 0.32;

    const desiredPos = new THREE.Vector3(
      targetPos.current.x + breathX,
      targetPos.current.y + breathY,
      targetPos.current.z + zoomOffset.current
    );

    const lerpFactor = reducedMotion ? 1 : 1 - Math.exp(-3.4 * dt);
    camera.position.lerp(desiredPos, lerpFactor);
    currentLookAt.current.lerp(targetLookAt.current, lerpFactor);

    const baseDir = new THREE.Vector3()
      .subVectors(currentLookAt.current, camera.position)
      .normalize();
    const euler = new THREE.Euler(pitchOffset.current, yawOffset.current, 0, "YXZ");
    baseDir.applyEuler(euler);

    const finalLookTarget = new THREE.Vector3()
      .copy(camera.position)
      .addScaledVector(baseDir, 10);
    camera.lookAt(finalLookTarget);
  });

  return null;
}

// ============================================================================
// 7. MAIN EXPORTED PHOTOREALISTIC ORBITAL CANVAS
// ============================================================================
export function OrbitalCanvas(props: OrbitalCanvasProps) {
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [showBeacons, setShowBeacons] = useState(true);
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onVisChange = () => setIsTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisChange);
    return () => document.removeEventListener("visibilitychange", onVisChange);
  }, []);

  const activeWaypoint = useMemo(
    () => getWaypointById(props.activeWaypointId),
    [props.activeWaypointId]
  );

  const activeStageId = activeWaypoint.stageId;

  const dpr: [number, number] =
    props.qualityTier === "high"
      ? [1.25, 2]
      : props.qualityTier === "balanced"
      ? [1, 1.5]
      : [1, 1];

  return (
    <div
      className="relative h-full w-full bg-[#030712]"
      aria-label="Interactive Photorealistic 3D Orbital Habitat View. Move cursor or drag to look around in 3D, scroll to zoom into any pod or lounge, or click any glowing spatial beacon."
    >
      <Canvas
        dpr={dpr}
        frameloop={isTabVisible ? "always" : "never"}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.NoToneMapping,
        }}
        camera={{ position: [0, 0.35, 9.2], fov: 50, near: 0.1, far: 200 }}
      >
        <color attach="background" args={["#020611"]} />

        <ambientLight intensity={1.1} color="#fffbeb" />
        <pointLight position={[0, 4, 2]} intensity={1.4} color="#fde68a" distance={28} />

        {/* Zero-G Biophilic Golden & Cyan Atmospheric Light Motes */}
        {!props.reducedMotion && (
          <>
            <Sparkles
              count={props.qualityTier === "lightweight" ? 35 : 90}
              scale={[24, 13, 12]}
              position={[0, 0, -4]}
              size={1.6}
              speed={0.22}
              opacity={0.45}
              color="#fde68a"
            />
            <Sparkles
              count={props.qualityTier === "lightweight" ? 20 : 55}
              scale={[22, 11, 10]}
              position={[0, -2, -5]}
              size={1.4}
              speed={0.18}
              opacity={0.38}
              color="#38bdf8"
            />
          </>
        )}

        {/* Photorealistic 3D Curved Depth-Displaced Architectural Stage */}
        <React.Suspense fallback={null}>
          <PhotorealCurvedStage
            activeStageId={activeStageId}
            isFocusMode={props.isFocusMode}
            reducedMotion={props.reducedMotion}
            pointerRef={pointerRef}
          />

          <StageInteractiveOverlays
            activeStageId={activeStageId}
            activeWaypointId={props.activeWaypointId}
            onSelectWaypoint={props.onSelectWaypoint}
            activeIdea={props.activeIdea}
            sectorIdeaMap={props.sectorIdeaMap}
            onOpenIdeaDrawer={props.onOpenIdeaDrawer}
            onOpenLevlDrawer={props.onOpenLevlDrawer}
            onOpenScreeningModal={props.onOpenScreeningModal}
            onOpenMatchingDrawer={props.onOpenMatchingDrawer}
            onOpenConciergeDrawer={props.onOpenConciergeDrawer}
            reducedMotion={props.reducedMotion}
            showBeacons={showBeacons}
          />
        </React.Suspense>

        {/* Non-Locking First-Person Camera Rig */}
        <FirstPersonDriftRig
          activeWaypointId={props.activeWaypointId}
          reducedMotion={props.reducedMotion}
          pointerRef={pointerRef}
        />
      </Canvas>

      {/* Floating Spatial Stage Switcher & Cinema View Toggle (Bottom-Left Above DJ Bar) */}
      <div className="pointer-events-auto fixed bottom-20 left-4 z-20 flex flex-wrap items-center gap-1.5 rounded-2xl border border-white/15 bg-slate-950/75 p-1.5 shadow-2xl backdrop-blur-xl">
        <span className="hidden items-center gap-1 px-2 text-[10px] font-semibold tracking-wider text-sky-300 uppercase sm:inline-flex">
          <Compass className="h-3 w-3" />
          3D Vista:
        </span>
        {STAGE_LABELS.map((st) => {
          const isCurrent = activeStageId === st.id;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => props.onSelectWaypoint(st.defaultWaypointId)}
              className={`cursor-pointer rounded-xl px-2.5 py-1 text-[11px] font-medium transition ${
                isCurrent
                  ? "bg-sky-500/25 text-sky-100 border border-sky-400/50 shadow-sm"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {st.label}
            </button>
          );
        })}

        <div className="mx-0.5 h-4 w-px bg-white/15" />

        <button
          type="button"
          onClick={() => setShowBeacons((prev) => !prev)}
          title={showBeacons ? "Hide 3D spatial pins for unobstructed cinema view" : "Show interactive 3D spatial pins"}
          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-2.5 py-1 text-[11px] font-medium transition ${
            showBeacons
              ? "border-white/15 bg-white/5 text-slate-200 hover:bg-white/10"
              : "border-amber-400/50 bg-amber-500/20 text-amber-100"
          }`}
        >
          {showBeacons ? (
            <>
              <EyeOff className="h-3 w-3 text-slate-300" />
              <span className="hidden md:inline">Clean View</span>
            </>
          ) : (
            <>
              <Eye className="h-3 w-3 text-amber-300" />
              <span className="hidden md:inline">Show Pins</span>
            </>
          )}
        </button>

        {activeWaypoint.kind !== "overview" && (
          <button
            type="button"
            onClick={() => {
              const parentOverview =
                activeStageId === "levl-lounge"
                  ? "levl-lounge-entry"
                  : activeStageId === "agifutures-club"
                  ? "agi-club-overview"
                  : activeStageId === "atrium-terrace"
                  ? "atrium-concierge"
                  : "atrium-commons";
              props.onSelectWaypoint(parentOverview);
            }}
            className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-sky-400/40 bg-sky-500/15 px-2.5 py-1 text-[11px] font-medium text-sky-200 hover:bg-sky-500/25"
          >
            <RotateCcw className="h-3 w-3" />
            Reset Camera
          </button>
        )}
      </div>
    </div>
  );
}
