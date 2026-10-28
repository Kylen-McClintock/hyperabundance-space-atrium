"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Stars, Text, useTexture } from "@react-three/drei";
import * as THREE from "three";
import {
  SPATIAL_WAYPOINTS,
  SpatialWaypoint,
  getWaypointById,
} from "@/lib/spatial/waypoint-registry";
import {
  AGI_FUTURES_IDEAS,
  AgiFuturesIdea,
  SECTOR_BOOTHS,
  SectorBoothId,
} from "@/data/agifutures-catalog";
import { INITIAL_MEMBER_BANNERS } from "@/data/station-briefing";
import { IdeaHologram } from "@/components/spatial/objects/IdeaHologram";

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

// ============================================================================
// 1. PROCEDURAL REALISTIC EARTH & CLOUDS BELOW THE STATION
// ============================================================================
function createEarthSurfaceTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  // Deep ocean gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, 1024);
  oceanGrad.addColorStop(0, "#071a3e");
  oceanGrad.addColorStop(0.45, "#0b2b5e");
  oceanGrad.addColorStop(0.75, "#082046");
  oceanGrad.addColorStop(1, "#041026");
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, 2048, 1024);

  // Continental shelf & landmass shapes
  const continents = [
    { x: 420, y: 360, rx: 260, ry: 170, rot: 0.3 },
    { x: 640, y: 540, rx: 160, ry: 210, rot: -0.2 },
    { x: 1080, y: 340, rx: 320, ry: 160, rot: 0.15 },
    { x: 1160, y: 560, rx: 190, ry: 190, rot: 0.05 },
    { x: 1580, y: 390, rx: 280, ry: 180, rot: -0.25 },
    { x: 1720, y: 690, rx: 140, ry: 110, rot: 0.4 },
  ];

  continents.forEach((c) => {
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.rot);

    // Shallow turquoise coastal shelf
    const shelfGrad = ctx.createRadialGradient(0, 0, c.rx * 0.2, 0, 0, c.rx * 1.15);
    shelfGrad.addColorStop(0, "rgba(26, 155, 158, 0.35)");
    shelfGrad.addColorStop(0.7, "rgba(14, 116, 144, 0.28)");
    shelfGrad.addColorStop(1, "rgba(7, 26, 62, 0)");
    ctx.fillStyle = shelfGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, c.rx * 1.12, c.ry * 1.12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Landmass terrain
    const landGrad = ctx.createLinearGradient(-c.rx, -c.ry, c.rx, c.ry);
    landGrad.addColorStop(0, "#1c3d32");
    landGrad.addColorStop(0.5, "#2b4c38");
    landGrad.addColorStop(0.85, "#4a4332");
    landGrad.addColorStop(1, "#233b2e");
    ctx.fillStyle = landGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, c.rx * 0.88, c.ry * 0.82, 0, 0, Math.PI * 2);
    ctx.fill();

    // Golden night-terminator city light networks & coastal hubs
    for (let i = 0; i < 95; i++) {
      const a = (i / 95) * Math.PI * 2 + (i % 7) * 0.3;
      const r = (0.25 + ((i * 17) % 65) / 100) * c.rx * 0.8;
      const cx = Math.cos(a) * r;
      const cy = Math.sin(a) * (r * (c.ry / c.rx));

      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 14 + (i % 4) * 6);
      glow.addColorStop(0, "rgba(255, 224, 130, 0.92)");
      glow.addColorStop(0.35, "rgba(245, 158, 11, 0.45)");
      glow.addColorStop(1, "rgba(245, 158, 11, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

function createCloudTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, 1024, 512);

  for (let i = 0; i < 240; i++) {
    const x = ((i * 73) % 1000) + 12;
    const y = ((i * 41) % 460) + 25;
    const rx = 28 + (i % 5) * 22;
    const ry = 8 + (i % 3) * 7;
    const grad = ctx.createRadialGradient(x, y, 1, x, y, rx);
    grad.addColorStop(0, "rgba(255, 255, 255, 0.52)");
    grad.addColorStop(0.5, "rgba(224, 242, 254, 0.24)");
    grad.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = grad;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(((i % 7) - 3) * 0.12);
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

function EarthBelow({
  isFocusMode,
  reducedMotion,
  qualityTier,
}: {
  isFocusMode: boolean;
  reducedMotion: boolean;
  qualityTier: QualityTier;
}) {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  const earthTex = useMemo(() => createEarthSurfaceTexture(), []);
  const cloudTex = useMemo(() => createCloudTexture(), []);

  const segments = qualityTier === "high" ? 96 : qualityTier === "balanced" ? 64 : 40;

  useFrame((_, delta) => {
    if (reducedMotion || document.hidden) return;
    // Ultra-subtle rotation; even slower during Focus Mode per spec Section 4
    const speed = isFocusMode ? 0.0018 : 0.0055;
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * speed;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * speed * 1.25;
    }
  });

  return (
    <group position={[0, -142, -52]} rotation={[0.38, -0.4, 0.08]}>
      {/* Primary Earth Sphere */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[136, segments, segments]} />
        <meshStandardMaterial
          map={earthTex}
          roughness={0.62}
          metalness={0.12}
          emissive="#1e3a8a"
          emissiveIntensity={0.28}
        />
      </mesh>

      {/* Atmospheric Cloud Layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[136.9, segments, segments]} />
        <meshStandardMaterial
          map={cloudTex}
          transparent
          opacity={0.78}
          depthWrite={false}
          roughness={0.9}
        />
      </mesh>

      {/* Rayleigh Cyan-Cobalt Atmospheric Limb Glow */}
      <mesh>
        <sphereGeometry args={[138.6, 64, 64]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.18}
          side={THREE.BackSide}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[141.2, 48, 48]} />
        <meshBasicMaterial
          color="#60a5fa"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// ============================================================================
// 2. BRAND PORTAL SIGNAGE (Supplied Actual LEVL & AGI Futures Logos)
// ============================================================================
function BrandPortalSignage({
  onSelectWaypoint,
}: {
  onSelectWaypoint: (id: string) => void;
}) {
  const [levlTex, agiTex] = useTexture([
    "/brands/levl-logo-long.png",
    "/brands/agi-futures-logo.png",
  ]);

  return (
    <group>
      {/* WEST PORTAL: LEVL LONGEVITY LOUNGE */}
      <group
        position={[-13.8, 4.35, -3.5]}
        rotation={[0, Math.PI / 2.6, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectWaypoint("levl-lounge-entry");
        }}
      >
        <mesh position={[0, 0, -0.06]}>
          <planeGeometry args={[5.4, 1.55]} />
          <meshStandardMaterial
            color="#07131e"
            roughness={0.3}
            metalness={0.6}
            emissive="#0d9488"
            emissiveIntensity={0.15}
          />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <planeGeometry args={[4.2, 0.95]} />
          <meshBasicMaterial map={levlTex} transparent toneMapped={false} />
        </mesh>
        <Text
          position={[0, -0.56, 0.02]}
          fontSize={0.18}
          letterSpacing={0.18}
          color="#99f6e4"
        >
          LONGEVITY LOUNGE & PROTOCOL SPA →
        </Text>
      </group>

      {/* EAST PORTAL: AGI FUTURES INVENTOR'S CLUB */}
      <group
        position={[13.8, 4.35, -3.5]}
        rotation={[0, -Math.PI / 2.6, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectWaypoint("agi-club-overview");
        }}
      >
        <mesh position={[0, 0, -0.06]}>
          <planeGeometry args={[5.6, 1.55]} />
          <meshStandardMaterial
            color="#06140e"
            roughness={0.3}
            metalness={0.6}
            emissive="#10b981"
            emissiveIntensity={0.15}
          />
        </mesh>
        <mesh position={[0, 0.06, 0]}>
          <planeGeometry args={[4.8, 1.05]} />
          <meshBasicMaterial map={agiTex} transparent toneMapped={false} />
        </mesh>
        <Text
          position={[0, -0.56, 0.02]}
          fontSize={0.17}
          letterSpacing={0.16}
          color="#6ee7b7"
        >
          ← INVENTOR&apos;S CLUB & 33 HOLO BLUEPRINTS
        </Text>
      </group>
    </group>
  );
}

// ============================================================================
// 3. OUTWARD-PROTRUDING EARTHVIEW BUBBLE PODS (Section 4 Non-Negotiable)
// ============================================================================
function OutwardEarthviewBubblePod({
  waypoint,
  isCurrent,
  onSelect,
}: {
  waypoint: SpatialWaypoint;
  isCurrent: boolean;
  onSelect: () => void;
}) {
  const [mx, my, mz] = waypoint.markerPos;

  return (
    <group position={[mx, my, mz]}>
      {/* 1. Circular Entrance Collar FLUSH with Interior Atrium Hull Wall */}
      <mesh position={[0, 0, 0.45]}>
        <torusGeometry args={[1.65, 0.14, 20, 48]} />
        <meshStandardMaterial
          color="#e7d8c1"
          metalness={0.65}
          roughness={0.22}
          emissive={isCurrent ? "#38bdf8" : "#f59e0b"}
          emissiveIntensity={isCurrent ? 0.55 : 0.25}
        />
      </mesh>

      {/* 2. Convex Glass Bubble Protruding OUTWARD Through the Exterior Hull */}
      <mesh
        position={[0, 0, -1.35]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <sphereGeometry args={[2.15, 36, 36]} />
        <meshPhysicalMaterial
          color="#e0f2fe"
          transparent
          opacity={0.22}
          roughness={0.06}
          metalness={0.05}
          transmission={0.75}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Outward Hull Structural Rib Ring */}
      <mesh position={[0, 0, -1.35]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[2.14, 0.045, 16, 48]} />
        <meshStandardMaterial color="#d6c5ad" metalness={0.7} roughness={0.25} />
      </mesh>

      {/* Interior Pod Floor Platform (Glass Bottom + Warm Walnut Trim) */}
      <mesh position={[0, -1.15, -1.25]}>
        <cylinderGeometry args={[1.72, 1.52, 0.12, 36]} />
        <meshStandardMaterial color="#3e2c1e" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Outward-Facing curved Walnut Work Desk (Faces -Z toward Earth!) */}
      <mesh position={[0, -0.42, -2.25]}>
        <boxGeometry args={[1.65, 0.07, 0.68]} />
        <meshStandardMaterial color="#5c3d28" roughness={0.35} metalness={0.15} />
      </mesh>

      {/* Transparent Dual Holographic Work Monitors Facing Outward */}
      <mesh position={[-0.38, -0.05, -2.42]} rotation={[0, 0.15, 0]}>
        <planeGeometry args={[0.62, 0.38]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.42} />
      </mesh>
      <mesh position={[0.38, -0.05, -2.42]} rotation={[0, -0.15, 0]}>
        <planeGeometry args={[0.62, 0.38]} />
        <meshBasicMaterial color="#34d399" transparent opacity={0.42} />
      </mesh>

      {/* Ergonomic Chair Facing Outward Toward Earth */}
      <mesh position={[0, -0.65, -1.45]}>
        <cylinderGeometry args={[0.32, 0.32, 0.55, 20]} />
        <meshStandardMaterial color="#e5e0d8" roughness={0.6} />
      </mesh>

      {/* Botanical Planters Inside the Bubble Pod */}
      <mesh position={[-1.25, -0.65, -1.5]}>
        <sphereGeometry args={[0.36, 12, 12]} />
        <meshStandardMaterial color="#15803d" roughness={0.8} />
      </mesh>
      <mesh position={[1.25, -0.65, -1.5]}>
        <sphereGeometry args={[0.36, 12, 12]} />
        <meshStandardMaterial color="#166534" roughness={0.8} />
      </mesh>

      {/* Clickable Pod Pill in 3D Space (Hidden when already inside this pod) */}
      {!isCurrent && (
        <Html position={[0, 1.35, 0.4]} center distanceFactor={14} zIndexRange={[10, 0]}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="cursor-pointer rounded-full border border-sky-300/50 bg-slate-950/85 px-3 py-1 text-[11px] font-medium whitespace-nowrap text-sky-100 shadow-lg backdrop-blur-md transition hover:border-sky-300 hover:bg-sky-950/90"
          >
            ◦ {waypoint.shortLabel} ({waypoint.elevationLabel})
          </button>
        </Html>
      )}
    </group>
  );
}

// ============================================================================
// 4. SUNKEN GLASS-BOTTOM LOUNGE PITS (Section 4 Non-Negotiable)
// ============================================================================
function SunkenGlassFloorLoungePit({
  position,
  label,
  onSelect,
}: {
  position: [number, number, number];
  label: string;
  onSelect: () => void;
}) {
  return (
    <group position={position}>
      {/* Outer Champagne-Brass Rim Flush with Atrium Deck */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.65, 4.15, 64]} />
        <meshStandardMaterial
          color="#d6c3a5"
          metalness={0.65}
          roughness={0.25}
          emissive="#f59e0b"
          emissiveIntensity={0.22}
        />
      </mesh>

      {/* Recessed Step Wall */}
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[3.68, 3.45, 0.7, 64, 1, true]} />
        <meshStandardMaterial
          color="#3b2f26"
          roughness={0.45}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* TRANSPARENT GLASS FLOOR INSIDE THE SEATING PIT (Earth Clearly Visible Beneath Feet!) */}
      <mesh
        position={[0, -0.68, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <circleGeometry args={[3.44, 64]} />
        <meshPhysicalMaterial
          color="#bae6fd"
          transparent
          opacity={0.14}
          roughness={0.05}
          metalness={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Structural Glass Radial Mullion Rings so the Glass Floor Reads Clearly Above Earth */}
      <mesh position={[0, -0.67, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.65, 1.71, 48]} />
        <meshBasicMaterial color="#eab308" transparent opacity={0.55} />
      </mesh>
      <mesh position={[0, -0.67, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.35, 3.44, 64]} />
        <meshBasicMaterial color="#eab308" transparent opacity={0.65} />
      </mesh>

      {/* Curved Perimeter Bouclé Sofa Ring (Open at top for step-in, leaving central glass floor unobstructed) */}
      <mesh position={[0, -0.32, 0]} rotation={[Math.PI / 2, 0, 0.4]}>
        <torusGeometry args={[2.75, 0.46, 20, 48, Math.PI * 1.65]} />
        <meshStandardMaterial color="#f5f0e6" roughness={0.75} metalness={0.05} />
      </mesh>

      {/* Glass-Top Coffee Table (Legible Earth View Beneath Table) */}
      <mesh position={[0, -0.32, 0]}>
        <cylinderGeometry args={[1.05, 1.05, 0.04, 36]} />
        <meshPhysicalMaterial
          color="#e0f2fe"
          transparent
          opacity={0.28}
          roughness={0.08}
        />
      </mesh>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.85, 0.85, 0.34, 24, 1, true]} />
        <meshStandardMaterial
          color="#d4af37"
          metalness={0.8}
          roughness={0.2}
          wireframe
        />
      </mesh>

      <Html position={[0, 0.55, 0]} center distanceFactor={14} zIndexRange={[10, 0]}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className="cursor-pointer rounded-full border border-amber-300/45 bg-slate-950/80 px-3 py-1 text-[11px] font-medium whitespace-nowrap text-amber-100 shadow-lg backdrop-blur-md transition hover:border-amber-200"
        >
          ▾ {label} (Earth-Glass Floor)
        </button>
      </Html>
    </group>
  );
}

// ============================================================================
// 5. SHARED ATRIUM, LEVL LOUNGE & AGI FUTURES WING ARCHITECTURE
// ============================================================================
function StationArchitecture({
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
}: {
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
}) {
  const focusPods = useMemo(
    () => SPATIAL_WAYPOINTS.filter((wp) => wp.kind === "focus_pod"),
    []
  );

  // Build atrium deck with two circular cutouts for the sunken glass-bottom lounges
  const atriumDeckGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, -4, 18.5, 0, Math.PI * 2, false);

    const westHole = new THREE.Path();
    westHole.absarc(-5.8, 5.5, 3.65, 0, Math.PI * 2, true);
    shape.holes.push(westHole);

    const eastHole = new THREE.Path();
    eastHole.absarc(5.8, 5.5, 3.65, 0, Math.PI * 2, true);
    shape.holes.push(eastHole);

    return new THREE.ShapeGeometry(shape, 64);
  }, []);

  return (
    <group>
      {/* =================================================================== */}
      {/* A. SHARED ORBITAL ATRIUM                                            */}
      {/* =================================================================== */}
      <mesh
        geometry={atriumDeckGeometry}
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial
          color="#cfc3b2"
          roughness={0.32}
          metalness={0.22}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Sculptural Branching Ivory Structural Ribs */}
      {[-12, -6, 0, 6, 12].map((xOffset, idx) => (
        <group key={idx} position={[xOffset, 0, -6]}>
          <mesh rotation={[0.18, 0, (xOffset / 18) * -0.25]} position={[0, 6.8, -5]}>
            <torusGeometry args={[12.5, 0.34, 16, 64, Math.PI]} />
            <meshStandardMaterial
              color="#efe6d8"
              roughness={0.28}
              metalness={0.22}
            />
          </mesh>
          {/* Warm Cove Light Along Each Rib */}
          <mesh rotation={[0.18, 0, (xOffset / 18) * -0.25]} position={[0, 6.72, -4.9]}>
            <torusGeometry args={[12.22, 0.05, 8, 64, Math.PI]} />
            <meshBasicMaterial color="#fde68a" />
          </mesh>
        </group>
      ))}

      {/* Overhead "HYPERABUNDANCE" Illuminated Arch */}
      <group position={[0, 10.6, -15.5]}>
        <Text
          fontSize={0.78}
          letterSpacing={0.32}
          color="#fef3c7"
          anchorX="center"
          anchorY="middle"
        >
          H Y P E R A B U N D A N C E
        </Text>
      </group>

      {/* Central Botanical Garden Island */}
      <group position={[0, 0, -7.8]}>
        <mesh position={[0, 0.28, 0]}>
          <cylinderGeometry args={[2.6, 2.8, 0.56, 36]} />
          <meshStandardMaterial color="#b49a78" roughness={0.4} metalness={0.3} />
        </mesh>
        <mesh position={[0, 1.6, 0]}>
          <cylinderGeometry args={[0.18, 0.28, 2.4, 12]} />
          <meshStandardMaterial color="#5c4033" roughness={0.85} />
        </mesh>
        <mesh position={[0, 3.1, 0]}>
          <sphereGeometry args={[1.65, 16, 16]} />
          <meshStandardMaterial color="#15803d" roughness={0.8} />
        </mesh>
        <mesh position={[-0.95, 2.5, 0.4]}>
          <sphereGeometry args={[1.1, 14, 14]} />
          <meshStandardMaterial color="#166534" roughness={0.85} />
        </mesh>
        <mesh position={[0.95, 2.6, -0.3]}>
          <sphereGeometry args={[1.15, 14, 14]} />
          <meshStandardMaterial color="#14532d" roughness={0.85} />
        </mesh>
      </group>

      {/* Concierge & Station Briefing Holographic Kiosk */}
      <group
        position={[0, 0, 0.5]}
        onClick={(e) => {
          e.stopPropagation();
          onOpenConciergeDrawer();
        }}
      >
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.7, 0.85, 1.2, 32]} />
          <meshStandardMaterial color="#e5dac9" roughness={0.3} metalness={0.3} />
        </mesh>
        {/* Holographic AI Resident Concierge Avatar (Persistently Badged as AI) */}
        <mesh position={[0, 1.65, 0]}>
          <capsuleGeometry args={[0.22, 0.65, 12, 24]} />
          <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.75} />
        </mesh>
        <Html position={[0, 2.5, 0]} center distanceFactor={12} zIndexRange={[10, 0]}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenConciergeDrawer();
            }}
            className="cursor-pointer rounded-xl border border-sky-400/50 bg-slate-950/85 px-3 py-1.5 text-left shadow-lg backdrop-blur-md transition hover:border-sky-300"
          >
            <div className="text-[9px] font-bold tracking-wider text-sky-300 uppercase">
              AI RESIDENT • CONCIERGE
            </div>
            <div className="text-xs font-semibold whitespace-nowrap text-white">
              Aethel & Station Briefing
            </div>
          </button>
        </Html>
      </group>

      {/* 2 Sunken Glass-Bottom Lounge Pits */}
      <SunkenGlassFloorLoungePit
        position={[-5.8, 0, -5.5]}
        label="West Sunken Lounge"
        onSelect={() => onSelectWaypoint("lounge-pit-west")}
      />
      <SunkenGlassFloorLoungePit
        position={[5.8, 0, -5.5]}
        label="East Sunken Lounge"
        onSelect={() => onSelectWaypoint("lounge-pit-east")}
      />

      {/* 6 Outward-Protruding Earthview Bubble Pods */}
      {focusPods.map((pod) => (
        <OutwardEarthviewBubblePod
          key={pod.id}
          waypoint={pod}
          isCurrent={activeWaypointId === pod.id}
          onSelect={() => onSelectWaypoint(pod.id)}
        />
      ))}

      {/* Upper Botanical Conservatory & Library Mezzanine */}
      <group position={[0, 5.8, 6.2]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.5, 6.5, 48, 1, 0, Math.PI]} />
          <meshStandardMaterial
            color="#e7dccb"
            roughness={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
        <Html position={[0, 1.5, -1.5]} center distanceFactor={15} zIndexRange={[10, 0]}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectWaypoint("conservatory-deck");
            }}
            className="cursor-pointer rounded-full border border-emerald-300/45 bg-slate-950/85 px-3 py-1 text-[11px] font-medium whitespace-nowrap text-emerald-100 shadow-lg backdrop-blur-md hover:border-emerald-300"
          >
            ↑ Botanical Library & Conservatory (+22 ft)
          </button>
        </Html>
      </group>

      {/* Exact Supplied Brand Logos on Left & Right Wing Portals */}
      <BrandPortalSignage onSelectWaypoint={onSelectWaypoint} />

      {/* =================================================================== */}
      {/* B. LEVL LONGEVITY LOUNGE & SPA WING (West Wing: x ≈ -28)            */}
      {/* =================================================================== */}
      <group position={[-28, 0, -6]}>
        {/* Ivory Travertine Floor with Sunken Glass-Floor Cutout */}
        <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[13.5, 64]} />
          <meshStandardMaterial color="#ede6d9" roughness={0.28} metalness={0.12} />
        </mesh>

        {/* LEVL Sunken Glass-Floor Conversation Pit */}
        <SunkenGlassFloorLoungePit
          position={[1.8, 0.02, 1.2]}
          label="LEVL Earth-Glass Lounge"
          onSelect={() => onSelectWaypoint("levl-lounge-entry")}
        />

        {/* Backlit Fluted Alabaster Protocol Bar + AI Bartender (Sora) */}
        <group
          position={[-5.2, 0, 1.5]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectWaypoint("levl-protocol-bar");
            onOpenLevlDrawer();
          }}
        >
          <mesh position={[0, 0.62, 0]}>
            <boxGeometry args={[1.6, 1.24, 6.4]} />
            <meshStandardMaterial
              color="#f8f4ec"
              roughness={0.25}
              emissive="#fde68a"
              emissiveIntensity={0.35}
            />
          </mesh>
          {/* Holographic LEVL Bartender Avatar (Sora) */}
          <mesh position={[-1.1, 1.65, 0]}>
            <capsuleGeometry args={[0.24, 0.72, 12, 24]} />
            <meshBasicMaterial color="#2dd4bf" wireframe transparent opacity={0.8} />
          </mesh>
          <Html position={[-0.6, 2.55, 0]} center distanceFactor={11} zIndexRange={[10, 0]}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectWaypoint("levl-protocol-bar");
                onOpenLevlDrawer();
              }}
              className="cursor-pointer rounded-xl border border-teal-400/50 bg-slate-950/90 px-3 py-1.5 text-left shadow-lg backdrop-blur-md transition hover:border-teal-300"
            >
              <div className="text-[9px] font-bold tracking-wider text-teal-300 uppercase">
                AI RESIDENT • LEVL COACH & BUILDER
              </div>
              <div className="text-xs font-bold whitespace-nowrap text-white">
                Sora • LEVL Protocol Bartender
              </div>
              <div className="text-[10px] text-teal-200/80">
                Ask sourced PubMed questions & draft protocols
              </div>
            </button>
          </Html>
        </group>

        {/* LEVL Research Screening Wall (Prerecorded Screening — Separate from Ambient Audio) */}
        <group
          position={[-0.5, 2.8, -9.2]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectWaypoint("levl-screening-wall");
            onOpenScreeningModal();
          }}
        >
          <mesh>
            <boxGeometry args={[6.4, 3.4, 0.18]} />
            <meshStandardMaterial
              color="#081c24"
              emissive="#0f766e"
              emissiveIntensity={0.35}
            />
          </mesh>
          <Text position={[-1.4, 0.6, 0.12]} fontSize={0.28} color="#f0fdfa">
            Living Longer • Living Better
          </Text>
          <Text position={[-1.4, 0.1, 0.12]} fontSize={0.16} color="#5eead4">
            LEVL Research Screening Wall (Click to Watch / Browse Playlist)
          </Text>
          <Html position={[0, -1.2, 0.2]} center distanceFactor={12} zIndexRange={[10, 0]}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectWaypoint("levl-screening-wall");
                onOpenScreeningModal();
              }}
              className="cursor-pointer rounded-full border border-teal-300/60 bg-teal-950/90 px-3.5 py-1 text-xs font-semibold whitespace-nowrap text-teal-100 shadow-lg hover:bg-teal-900"
            >
              ▶ Open Research Screening Player
            </button>
          </Html>
        </group>

        {/* Spa Modality Stations: Finnish Sauna, Cold Plunge, HBOT & Red Light */}
        <group
          position={[-8.8, 0, -5.5]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectWaypoint("levl-spa-sauna");
            onOpenLevlDrawer("finnish-sauna");
          }}
        >
          {/* Cedar Finnish Sauna Cabin */}
          <mesh position={[0, 1.3, 0]}>
            <boxGeometry args={[2.8, 2.6, 2.8]} />
            <meshStandardMaterial
              color="#9a5b32"
              roughness={0.45}
              emissive="#ea580c"
              emissiveIntensity={0.25}
            />
          </mesh>
          {/* Cold Plunge Basin */}
          <mesh position={[2.6, 0.45, 0.4]}>
            <cylinderGeometry args={[1.1, 1.0, 0.9, 32]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive="#38bdf8"
              emissiveIntensity={0.45}
            />
          </mesh>
          <Html position={[0.8, 2.8, 0]} center distanceFactor={13} zIndexRange={[10, 0]}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectWaypoint("levl-spa-sauna");
                onOpenLevlDrawer("finnish-sauna");
              }}
              className="cursor-pointer rounded-full border border-amber-300/50 bg-slate-950/85 px-3 py-1 text-[11px] font-medium whitespace-nowrap text-amber-100 shadow-lg"
            >
              ♨ Sauna (80°C) & Cold Plunge (12°C) Evidence
            </button>
          </Html>
        </group>

        {/* HBOT Chamber & Red Light Panel */}
        <group
          position={[6.2, 0, -6.8]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectWaypoint("levl-spa-hbot");
            onOpenLevlDrawer("hyperbaric-oxygen-therapy");
          }}
        >
          <mesh position={[0, 1.1, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.95, 2.2, 16, 32]} />
            <meshStandardMaterial
              color="#e2e8f0"
              metalness={0.5}
              roughness={0.2}
              emissive="#38bdf8"
              emissiveIntensity={0.2}
            />
          </mesh>
          <Html position={[0, 2.4, 0]} center distanceFactor={13} zIndexRange={[10, 0]}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectWaypoint("levl-spa-hbot");
                onOpenLevlDrawer("hyperbaric-oxygen-therapy");
              }}
              className="cursor-pointer rounded-full border border-sky-300/50 bg-slate-950/85 px-3 py-1 text-[11px] font-medium whitespace-nowrap text-sky-100 shadow-lg"
            >
              ⊕ 2.0 ATA HBOT & 660nm Red Light Station
            </button>
          </Html>
        </group>
      </group>

      {/* =================================================================== */}
      {/* C. AGI FUTURES INVENTOR'S CLUB WING (East Wing: x ≈ +28)            */}
      {/* =================================================================== */}
      <group position={[28, 0, -6]}>
        {/* Warm Walnut & Graphite Club Floor */}
        <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[13.5, 64]} />
          <meshStandardMaterial color="#1c1917" roughness={0.35} metalness={0.25} />
        </mesh>

        {/* 1. Central Collaborative Holographic Table */}
        <group position={[0, 0, -0.5]}>
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[2.65, 2.2, 0.9, 48]} />
            <meshStandardMaterial
              color="#452c1e"
              roughness={0.32}
              metalness={0.35}
            />
          </mesh>
          <IdeaHologram
            idea={activeIdea}
            position={[0, 1.45, 0]}
            scale={1.25}
            reducedMotion={reducedMotion}
            onSelect={() => {
              onSelectWaypoint("agi-holo-table");
              onOpenIdeaDrawer(activeIdea);
            }}
          />
        </group>

        {/* 2. Recessed Swipable Sector Idea Booths Around the Club Perimeter */}
        {SECTOR_BOOTHS.map((booth, idx) => {
          const angle = -0.55 + idx * 0.48;
          const radius = 8.6;
          const bx = Math.cos(angle) * radius;
          const bz = Math.sin(angle) * radius - 1.0;
          const currentSectorIdea =
            sectorIdeaMap[booth.id] || AGI_FUTURES_IDEAS[idx];

          return (
            <group
              key={booth.id}
              position={[bx, 0, bz]}
              rotation={[0, -angle - Math.PI / 2, 0]}
            >
              {/* Recessed Walnut & Brushed Copper Booth Alcove */}
              <mesh position={[0, 1.85, -0.8]}>
                <boxGeometry args={[3.4, 3.7, 0.25]} />
                <meshStandardMaterial
                  color="#27272a"
                  metalness={0.5}
                  roughness={0.35}
                  emissive={booth.accentHex}
                  emissiveIntensity={0.12}
                />
              </mesh>
              <Text
                position={[0, 3.25, -0.62]}
                fontSize={0.17}
                color={booth.accentHex}
                anchorX="center"
              >
                {booth.boothSignage}
              </Text>
              <IdeaHologram
                idea={currentSectorIdea}
                position={[0, 1.35, 0.1]}
                scale={0.95}
                reducedMotion={reducedMotion}
                onSelect={() => onOpenIdeaDrawer(currentSectorIdea)}
              />
            </group>
          );
        })}

        {/* 3. AI Builder Guide Desk (Kaelen) */}
        <group
          position={[-6.5, 0, 2.0]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectWaypoint("agi-builder-guide");
            onOpenIdeaDrawer(activeIdea);
          }}
        >
          <mesh position={[0, 0.55, 0]}>
            <cylinderGeometry args={[1.2, 1.3, 1.1, 32]} />
            <meshStandardMaterial color="#3f2e21" roughness={0.35} />
          </mesh>
          <mesh position={[0, 1.65, 0]}>
            <capsuleGeometry args={[0.22, 0.68, 12, 24]} />
            <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.8} />
          </mesh>
          <Html position={[0, 2.55, 0]} center distanceFactor={11} zIndexRange={[10, 0]}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectWaypoint("agi-builder-guide");
                onOpenIdeaDrawer(activeIdea);
              }}
              className="cursor-pointer rounded-xl border border-emerald-400/50 bg-slate-950/90 px-3 py-1.5 text-left shadow-lg backdrop-blur-md hover:border-emerald-300"
            >
              <div className="text-[9px] font-bold tracking-wider text-emerald-300 uppercase">
                AI RESIDENT • AGI FUTURES
              </div>
              <div className="text-xs font-bold whitespace-nowrap text-white">
                Kaelen • AI Builder Guide
              </div>
              <div className="text-[10px] text-emerald-200/80">
                Assumptions, 14-day experiments & matching
              </div>
            </button>
          </Html>
        </group>

        {/* 4. Founder Matching Wall (Building / Looking For / Can Help) */}
        <group
          position={[-7.5, 2.2, -1.8]}
          rotation={[0, Math.PI / 2, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectWaypoint("agi-matching-wall");
            onOpenMatchingDrawer();
          }}
        >
          <mesh>
            <boxGeometry args={[4.6, 2.9, 0.16]} />
            <meshStandardMaterial
              color="#18181b"
              metalness={0.6}
              roughness={0.3}
              emissive="#10b981"
              emissiveIntensity={0.18}
            />
          </mesh>
          <Text position={[0, 1.05, 0.1]} fontSize={0.22} color="#fef3c7">
            FOUNDER MATCHING
          </Text>
          <Text position={[0, 0.72, 0.1]} fontSize={0.13} color="#6ee7b7">
            BUILDING  •  LOOKING FOR  •  CAN HELP WITH
          </Text>
          <Html position={[0, -0.35, 0.15]} center distanceFactor={12} zIndexRange={[10, 0]}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectWaypoint("agi-matching-wall");
                onOpenMatchingDrawer();
              }}
              className="cursor-pointer rounded-full border border-emerald-400/60 bg-emerald-950/90 px-3.5 py-1 text-xs font-semibold whitespace-nowrap text-emerald-100 shadow-lg hover:bg-emerald-900"
            >
              ⇄ Open Builder Matching & Banners
            </button>
          </Html>
        </group>
      </group>

      {/* =================================================================== */}
      {/* D. HONEST DIRECTORY MEMBER BANNERS AT DISCRETE DESTINATIONS         */}
      {/* =================================================================== */}
      {INITIAL_MEMBER_BANNERS.map((member, idx) => {
        const wp = getWaypointById(member.currentDestination);
        const offsetAngle = idx * 1.4;
        const pos: [number, number, number] = [
          wp.markerPos[0] + Math.cos(offsetAngle) * 1.3,
          wp.markerPos[1] + 0.5,
          wp.markerPos[2] + Math.sin(offsetAngle) * 1.3,
        ];
        return (
          <group key={member.id} position={pos}>
            <mesh position={[0, 0.4, 0]}>
              <capsuleGeometry args={[0.18, 0.55, 8, 16]} />
              <meshStandardMaterial
                color={member.avatarColor}
                roughness={0.35}
                metalness={0.2}
              />
            </mesh>
            <Html position={[0, 1.15, 0]} center distanceFactor={14} zIndexRange={[10, 0]}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenMatchingDrawer();
                }}
                className="cursor-pointer rounded-lg border border-white/20 bg-slate-950/80 px-2.5 py-1 text-left shadow backdrop-blur-md hover:border-white/40"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      member.presenceStatus === "focus"
                        ? "bg-amber-400"
                        : "bg-emerald-400"
                    }`}
                  />
                  <span className="text-[10px] font-semibold whitespace-nowrap text-white">
                    {member.displayName}
                  </span>
                  <span className="text-[9px] text-slate-400">
                    ({member.roleTag})
                  </span>
                </div>
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

// ============================================================================
// 6. FIRST-PERSON NON-LOCKING CAMERA RIG (Spline Drift + Look + Optional WASD)
// ============================================================================
function FirstPersonDriftRig({
  activeWaypointId,
  reducedMotion,
}: {
  activeWaypointId: string;
  reducedMotion: boolean;
}) {
  const { camera, gl } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 2.5, 11.5));
  const currentLookAt = useRef(new THREE.Vector3(0, 2.2, -28));
  const targetLookAt = useRef(new THREE.Vector3(0, 2.2, -28));

  const yawOffset = useRef(0);
  const pitchOffset = useRef(0);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const keysPressed = useRef<Set<string>>(new Set());

  useEffect(() => {
    const wp = getWaypointById(activeWaypointId);
    targetPos.current.set(...wp.cameraPos);
    targetLookAt.current.set(...wp.lookAt);
    yawOffset.current = 0;
    pitchOffset.current = 0;

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
      if (!isDragging.current) return;
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      lastMouse.current = { x: e.clientX, y: e.clientY };
      yawOffset.current -= dx * 0.0032;
      pitchOffset.current = Math.max(
        -0.65,
        Math.min(0.65, pitchOffset.current - dy * 0.0028)
      );
    };
    const onPointerUp = () => {
      isDragging.current = false;
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
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      dom.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [gl]);

  useFrame((_, delta) => {
    if (document.hidden) return;
    const dt = Math.min(delta, 0.1);

    // Optional WASD / Arrow-Key Free Float
    const moveSpeed = 7.5 * dt;
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();

    if (keysPressed.current.has("w") || keysPressed.current.has("arrowup")) {
      targetPos.current.addScaledVector(forward, moveSpeed);
      targetLookAt.current.addScaledVector(forward, moveSpeed);
    }
    if (keysPressed.current.has("s") || keysPressed.current.has("arrowdown")) {
      targetPos.current.addScaledVector(forward, -moveSpeed);
      targetLookAt.current.addScaledVector(forward, -moveSpeed);
    }
    if (keysPressed.current.has("a") || keysPressed.current.has("arrowleft")) {
      targetPos.current.addScaledVector(right, -moveSpeed);
      targetLookAt.current.addScaledVector(right, -moveSpeed);
    }
    if (keysPressed.current.has("d") || keysPressed.current.has("arrowright")) {
      targetPos.current.addScaledVector(right, moveSpeed);
      targetLookAt.current.addScaledVector(right, moveSpeed);
    }

    // Smooth spline-like zero-G drift toward target waypoint
    const lerpFactor = reducedMotion ? 1 : 1 - Math.exp(-3.2 * dt);
    camera.position.lerp(targetPos.current, lerpFactor);
    currentLookAt.current.lerp(targetLookAt.current, lerpFactor);

    // Apply user drag-to-look offsets around current lookAt vector
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
// 7. MAIN EXPORTED ORBITAL CANVAS
// ============================================================================
export function OrbitalCanvas(props: OrbitalCanvasProps) {
  const [isTabVisible, setIsTabVisible] = useState(true);

  useEffect(() => {
    const onVisChange = () => setIsTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisChange);
    return () => document.removeEventListener("visibilitychange", onVisChange);
  }, []);

  const dpr: [number, number] =
    props.qualityTier === "high"
      ? [1, 2]
      : props.qualityTier === "balanced"
      ? [1, 1.5]
      : [0.85, 1];

  return (
    <div
      className="relative h-full w-full bg-[#030712]"
      aria-label="Interactive 3D Orbital Habitat View. Drag to look around, click any pod, lounge, or holographic booth to drift there, or use the top navigation bar and 2D Directory."
    >
      <Canvas
        dpr={dpr}
        frameloop={isTabVisible ? "always" : "never"}
        camera={{ position: [0, 2.5, 11.5], fov: 56, near: 0.1, far: 600 }}
      >
        <color attach="background" args={["#030816"]} />
        <fog attach="fog" args={["#040b1c", 45, 290]} />

        {/* Warm Architectural Interior Lighting + Cool Earthshine Uplight */}
        <ambientLight intensity={0.68} color="#f8fafc" />
        <directionalLight
          position={[18, 28, 12]}
          intensity={1.35}
          color="#fffbeb"
        />
        <directionalLight
          position={[0, -35, -45]}
          intensity={1.15}
          color="#38bdf8"
        />
        <pointLight position={[0, 7.5, -6]} intensity={1.1} color="#fde68a" distance={36} />
        <pointLight position={[-28, 5, -6]} intensity={1.0} color="#5eead4" distance={28} />
        <pointLight position={[28, 5, -6]} intensity={1.0} color="#34d399" distance={28} />

        {/* Secondary Starfield (Subtle per Section 4: Earth is primary, stars secondary) */}
        <Stars
          radius={210}
          depth={60}
          count={props.qualityTier === "lightweight" ? 700 : 1800}
          factor={2.6}
          saturation={0.1}
          fade
          speed={props.reducedMotion ? 0 : 0.25}
        />

        {/* Monumental Realistic Earth Below & Ahead */}
        <EarthBelow
          isFocusMode={props.isFocusMode}
          reducedMotion={props.reducedMotion}
          qualityTier={props.qualityTier}
        />

        {/* Shared Atrium, Outward Pods, Glass-Floor Lounges, LEVL & AGI Futures Wings */}
        <React.Suspense fallback={null}>
          <StationArchitecture
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
          />
        </React.Suspense>

        {/* Non-Locking First-Person Camera Controller */}
        <FirstPersonDriftRig
          activeWaypointId={props.activeWaypointId}
          reducedMotion={props.reducedMotion}
        />
      </Canvas>
    </div>
  );
}
