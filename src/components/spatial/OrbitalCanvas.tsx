"use client";

import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  getWaypointById,
} from "@/lib/spatial/waypoint-registry";
import { getOrbitalPbrTextures } from "@/lib/spatial/pbr-materials";
import { AgiFuturesIdea, SectorBoothId } from "@/data/agifutures-catalog";
import { OrbitalPlanetAndSky } from "./environment/OrbitalPlanetAndSky";
import { GrandAtriumWing } from "./architecture/GrandAtriumWing";
import { LevlLongevityWing } from "./architecture/LevlLongevityWing";
import { AgiFuturesClubWing } from "./architecture/AgiFuturesClubWing";
import { PostProcessingEffects } from "./effects/PostProcessingEffects";

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

/**
 * Full 360° First-Person Walkable & Zero-G Camera Rig:
 * - Supports unlimited 360° horizontal rotation (drag mouse/touch or Q/E keys)
 * - Supports vertical pitch from -75° (looking straight down through glass floors at Earth)
 *   to +75° (looking up at the vaulted skylight dome and chandeliers)
 * - Supports WASD / Arrow-Key walking & strafing across all connected wings
 * - Supports click-on-floor walking (glide to any clicked floor point)
 * - Supports smooth waypoint autopilot that yields immediately to user look/move input
 */
function FirstPerson360CameraRig({
  activeWaypointId,
  walkTarget,
  turnAroundTrigger,
  reducedMotion,
}: {
  activeWaypointId: string;
  walkTarget: THREE.Vector3 | null;
  turnAroundTrigger: number;
  reducedMotion: boolean;
}) {
  const { camera, gl } = useThree();

  const currentPos = useRef(new THREE.Vector3(0, 2.3, 11.5));
  const targetPos = useRef(new THREE.Vector3(0, 2.3, 11.5));

  // Spherical look angles: yaw (0 = looking -Z North) and pitch
  const currentYaw = useRef(0);
  const targetYaw = useRef(0);
  const currentPitch = useRef(-0.04);
  const targetPitch = useRef(-0.04);

  const isDragging = useRef(false);
  const prevPointer = useRef({ x: 0, y: 0 });
  const keysPressed = useRef<Record<string, boolean>>({});

  // Compute yaw/pitch from waypoint cameraPos -> lookAt when activeWaypointId changes
  useEffect(() => {
    const wp = getWaypointById(activeWaypointId);
    const camV = new THREE.Vector3(...wp.cameraPos);
    const lookV = new THREE.Vector3(...wp.lookAt);
    const dir = lookV.clone().sub(camV).normalize();

    // Yaw: atan2(-dir.x, -dir.z) so dir = (0, 0, -1) gives yaw = 0
    const computedYaw = Math.atan2(-dir.x, -dir.z);
    const computedPitch = Math.asin(THREE.MathUtils.clamp(dir.y, -0.92, 0.92));

    // Shortest angular path for smooth yaw interpolation
    let deltaYaw = computedYaw - targetYaw.current;
    while (deltaYaw > Math.PI) deltaYaw -= Math.PI * 2;
    while (deltaYaw < -Math.PI) deltaYaw += Math.PI * 2;

    targetPos.current.copy(camV);
    targetYaw.current = targetYaw.current + deltaYaw;
    targetPitch.current = computedPitch;

    if (reducedMotion) {
      currentPos.current.copy(camV);
      currentYaw.current = targetYaw.current;
      currentPitch.current = targetPitch.current;
    }
  }, [activeWaypointId, reducedMotion]);

  // Handle click-to-walk on any floor surface
  useEffect(() => {
    if (!walkTarget) return;
    targetPos.current.set(walkTarget.x, Math.max(1.85, walkTarget.y + 1.85), walkTarget.z);
    if (reducedMotion) {
      currentPos.current.copy(targetPos.current);
    }
  }, [walkTarget, reducedMotion]);

  // Handle 1-click "Turn 180° Around" button
  useEffect(() => {
    if (turnAroundTrigger === 0) return;
    targetYaw.current += Math.PI;
    if (reducedMotion) {
      currentYaw.current = targetYaw.current;
    }
  }, [turnAroundTrigger, reducedMotion]);

  // Pointer drag-to-look (360° yaw + pitch) and wheel zoom/step
  useEffect(() => {
    const dom = gl.domElement;

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      isDragging.current = true;
      prevPointer.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - prevPointer.current.x;
      const dy = e.clientY - prevPointer.current.y;
      prevPointer.current = { x: e.clientX, y: e.clientY };

      // Drag left/right rotates 360° continuously; drag up/down tilts pitch
      targetYaw.current -= dx * 0.0045;
      targetPitch.current = THREE.MathUtils.clamp(
        targetPitch.current - dy * 0.0038,
        -1.28,
        1.22
      );
    };

    const onPointerUp = () => {
      isDragging.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      // Scroll wheel steps forward/backward along view direction
      const forward = new THREE.Vector3(
        -Math.sin(currentYaw.current),
        0,
        -Math.cos(currentYaw.current)
      ).normalize();
      const step = -e.deltaY * 0.008;
      targetPos.current.addScaledVector(forward, step);
      targetPos.current.x = THREE.MathUtils.clamp(targetPos.current.x, -51, 51);
      targetPos.current.z = THREE.MathUtils.clamp(targetPos.current.z, -28, 22);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      keysPressed.current[e.code] = true;
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = false;
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
  }, [gl]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    const keys = keysPressed.current;

    // Keyboard rotation (Q / E or Left / Right Arrow)
    const rotSpeed = 1.65 * dt;
    if (keys["KeyQ"] || keys["ArrowLeft"]) {
      targetYaw.current += rotSpeed;
    }
    if (keys["KeyE"] || keys["ArrowRight"]) {
      targetYaw.current -= rotSpeed;
    }

    // Keyboard walking / strafing (WASD or Up/Down Arrows)
    const moveSpeed = (keys["ShiftLeft"] || keys["ShiftRight"] ? 14.0 : 8.5) * dt;
    const forward = new THREE.Vector3(
      -Math.sin(currentYaw.current),
      0,
      -Math.cos(currentYaw.current)
    ).normalize();
    const right = new THREE.Vector3(
      Math.cos(currentYaw.current),
      0,
      -Math.sin(currentYaw.current)
    ).normalize();

    if (keys["KeyW"] || keys["ArrowUp"]) {
      targetPos.current.addScaledVector(forward, moveSpeed);
    }
    if (keys["KeyS"] || keys["ArrowDown"]) {
      targetPos.current.addScaledVector(forward, -moveSpeed);
    }
    if (keys["KeyD"]) {
      targetPos.current.addScaledVector(right, moveSpeed);
    }
    if (keys["KeyA"]) {
      targetPos.current.addScaledVector(right, -moveSpeed);
    }
    // Vertical elevation (R / F to float up to mezzanine or down to sunken pits)
    if (keys["KeyR"] || keys["PageUp"]) {
      targetPos.current.y = THREE.MathUtils.clamp(
        targetPos.current.y + moveSpeed * 0.65,
        1.1,
        9.5
      );
    }
    if (keys["KeyF"] || keys["PageDown"]) {
      targetPos.current.y = THREE.MathUtils.clamp(
        targetPos.current.y - moveSpeed * 0.65,
        1.1,
        9.5
      );
    }

    // Keep within habitat bounds (Grand Atrium + LEVL West Wing + AGI Futures East Wing + North Bubble Pods)
    targetPos.current.x = THREE.MathUtils.clamp(targetPos.current.x, -51.5, 51.5);
    targetPos.current.z = THREE.MathUtils.clamp(targetPos.current.z, -28.5, 22.5);

    const lerpFactor = reducedMotion ? 1.0 : 1.0 - Math.exp(-5.2 * dt);
    currentPos.current.lerp(targetPos.current, lerpFactor);
    currentYaw.current = THREE.MathUtils.lerp(
      currentYaw.current,
      targetYaw.current,
      lerpFactor
    );
    currentPitch.current = THREE.MathUtils.lerp(
      currentPitch.current,
      targetPitch.current,
      lerpFactor
    );

    camera.position.copy(currentPos.current);

    const lookDir = new THREE.Vector3(
      -Math.sin(currentYaw.current) * Math.cos(currentPitch.current),
      Math.sin(currentPitch.current),
      -Math.cos(currentYaw.current) * Math.cos(currentPitch.current)
    );
    const lookTarget = currentPos.current.clone().add(lookDir.multiplyScalar(10));
    camera.lookAt(lookTarget);
  });

  return null;
}

function Habitat3DScene({
  activeWaypointId,
  onSelectWaypoint,
  activeIdea,
  sectorIdeaMap,
  onOpenIdeaDrawer,
  onOpenLevlDrawer,
  onOpenScreeningModal,
  onOpenMatchingDrawer,
  onOpenConciergeDrawer,
  qualityTier,
  reducedMotion,
  walkTarget,
  onFloorClick,
  turnAroundTrigger,
}: OrbitalCanvasProps & {
  walkTarget: THREE.Vector3 | null;
  onFloorClick: (pt: THREE.Vector3) => void;
  turnAroundTrigger: number;
}) {
  const pbr = useMemo(() => getOrbitalPbrTextures(), []);

  return (
    <>
      <FirstPerson360CameraRig
        activeWaypointId={activeWaypointId}
        walkTarget={walkTarget}
        turnAroundTrigger={turnAroundTrigger}
        reducedMotion={reducedMotion}
      />

      {/* 1. 3D Planet Earth, Moving Clouds, Rayleigh Atmosphere, 360° Stars & HDR Lightformers */}
      <OrbitalPlanetAndSky reducedMotion={reducedMotion} />

      {/* 2. Center: Full 360° Grand Orbital Atrium, Sunken Pits, Mezzanine, 6 Bubble Pods & South Conservatory */}
      <GrandAtriumWing
        pbr={pbr}
        activeWaypointId={activeWaypointId}
        qualityTier={qualityTier}
        onSelectWaypoint={onSelectWaypoint}
        onOpenConcierge={onOpenConciergeDrawer}
        onFloorClick={onFloorClick}
      />

      {/* 3. West Wing (-X): Full 360° LEVL Longevity Lounge, Protocol Bar, Sauna/Plunge, HBOT & Screening Wall */}
      <LevlLongevityWing
        pbr={pbr}
        qualityTier={qualityTier}
        onSelectWaypoint={onSelectWaypoint}
        onOpenLevlDrawer={onOpenLevlDrawer}
        onOpenScreeningModal={onOpenScreeningModal}
        onFloorClick={onFloorClick}
      />

      {/* 4. East Wing (+X): Full 360° AGI Futures Inventor's Club, Central Holo-Table & 6 Sector Booths */}
      <AgiFuturesClubWing
        pbr={pbr}
        activeIdea={activeIdea}
        sectorIdeaMap={sectorIdeaMap}
        qualityTier={qualityTier}
        reducedMotion={reducedMotion}
        onSelectWaypoint={onSelectWaypoint}
        onOpenIdeaDrawer={onOpenIdeaDrawer}
        onOpenMatchingDrawer={onOpenMatchingDrawer}
        onFloorClick={onFloorClick}
      />

      {/* 5. HDR Post-Processing Optical Bloom Pass */}
      <PostProcessingEffects qualityTier={qualityTier} />
    </>
  );
}

export function OrbitalCanvas(props: OrbitalCanvasProps) {
  const [walkTarget, setWalkTarget] = useState<THREE.Vector3 | null>(null);
  const [turnAroundTrigger, setTurnAroundTrigger] = useState(0);

  const handleFloorClick = useCallback((pt: THREE.Vector3) => {
    setWalkTarget(pt.clone());
  }, []);

  const handleTurnAround = useCallback(() => {
    setTurnAroundTrigger((c) => c + 1);
  }, []);

  const dpr: [number, number] =
    props.qualityTier === "high"
      ? [1, 2]
      : props.qualityTier === "balanced"
        ? [1, 1.5]
        : [1, 1];

  return (
    <div className="relative h-full w-full select-none overflow-hidden bg-[#030712]">
      <Canvas
        shadows={props.qualityTier !== "lightweight"}
        dpr={dpr}
        camera={{ position: [0, 2.3, 11.5], fov: 56, near: 0.1, far: 1200 }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.08,
        }}
      >
        <Suspense fallback={null}>
          <Habitat3DScene
            {...props}
            walkTarget={walkTarget}
            onFloorClick={handleFloorClick}
            turnAroundTrigger={turnAroundTrigger}
          />
        </Suspense>
      </Canvas>

      {/* Bottom-Left 360° Spatial Navigation & Quick-Turn HUD Bar */}
      <div className="pointer-events-auto fixed bottom-16 left-4 z-20 flex flex-wrap items-center gap-1.5 rounded-2xl border border-white/15 bg-slate-950/80 px-2.5 py-1.5 text-[11px] text-slate-200 shadow-2xl backdrop-blur-xl">
        <span className="px-1.5 font-semibold tracking-wider uppercase text-amber-300/90">
          360° Habitat Zones:
        </span>
        {[
          { id: "atrium-commons", label: "Grand Atrium" },
          { id: "atrium-concierge", label: "South Bar & Library (180°)" },
          { id: "lounge-pit-west", label: "Sunken Glass Pit" },
          { id: "pod-earthview-2", label: "Earthview Bubble Pod" },
          { id: "levl-lounge-entry", label: "LEVL Lounge (West)" },
          { id: "agi-club-overview", label: "AGI Futures Club (East)" },
        ].map((zone) => {
          const isActive = props.activeWaypointId === zone.id;
          return (
            <button
              key={zone.id}
              type="button"
              onClick={() => props.onSelectWaypoint(zone.id)}
              className={`cursor-pointer rounded-xl px-2.5 py-1 font-medium transition ${
                isActive
                  ? "bg-amber-300 text-slate-950 font-semibold shadow-sm"
                  : "bg-white/5 text-slate-300 hover:bg-white/15 hover:text-white"
              }`}
            >
              {zone.label}
            </button>
          );
        })}

        <div className="mx-1 h-3.5 w-px bg-white/15" />

        <button
          type="button"
          onClick={handleTurnAround}
          className="cursor-pointer rounded-xl border border-sky-400/40 bg-sky-950/60 px-2.5 py-1 font-semibold text-sky-200 transition hover:bg-sky-900/70"
          title="Rotate camera 180° to look behind you in the current room"
        >
          ↻ Turn 180° Around
        </button>

        <span className="hidden pl-1 text-[10px] text-slate-400 xl:inline">
          Drag to look 360° • WASD / Arrows to walk • R/F up/down
        </span>
      </div>
    </div>
  );
}
