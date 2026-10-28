"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { AgiFuturesIdea } from "@/data/agifutures-catalog";

interface IdeaHologramProps {
  idea: AgiFuturesIdea;
  position?: [number, number, number];
  scale?: number;
  reducedMotion?: boolean;
  onSelect?: () => void;
  showFloatingCard?: boolean;
}

export function IdeaHologram({
  idea,
  position = [0, 0, 0],
  scale = 1,
  reducedMotion = false,
  onSelect,
  showFloatingCard = true,
}: IdeaHologramProps) {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (reducedMotion || document.hidden) return;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.38;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x = Math.sin(Date.now() * 0.0015) * 0.12;
    }
  });

  const color = idea.accentColor || "#34d399";

  return (
    <group position={position} scale={scale}>
      {/* Holographic Projector Emitter Pedestal */}
      <mesh position={[0, -0.52, 0]}>
        <cylinderGeometry args={[0.68, 0.78, 0.08, 32]} />
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.8}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* Glowing Base Ring */}
      <mesh position={[0, -0.46, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.52, 0.65, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.75}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Volumetric Hologram Light Cone */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.85, 0.55, 1.25, 24, 1, true]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.07}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Rotating 3D Archetype Sculpture */}
      <group
        ref={groupRef}
        position={[0, 0.18, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.();
        }}
      >
        <group ref={innerRef}>
          {idea.hologramArchetype === "courtyard-village" && (
            <group>
              {/* Central Courtyard Ring + 6 Pocket Cottages */}
              <mesh position={[0, -0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.18, 0.52, 32]} />
                <meshBasicMaterial color={color} wireframe />
              </mesh>
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const angle = (i / 6) * Math.PI * 2;
                return (
                  <mesh
                    key={i}
                    position={[
                      Math.cos(angle) * 0.36,
                      -0.08 + (i % 2) * 0.06,
                      Math.sin(angle) * 0.36,
                    ]}
                  >
                    <boxGeometry args={[0.16, 0.24 + (i % 2) * 0.1, 0.16]} />
                    <meshStandardMaterial
                      color={color}
                      emissive={color}
                      emissiveIntensity={0.65}
                      wireframe
                    />
                  </mesh>
                );
              })}
              <mesh position={[0, 0.05, 0]}>
                <sphereGeometry args={[0.14, 16, 16]} />
                <meshBasicMaterial color="#6ee7b7" wireframe />
              </mesh>
            </group>
          )}

          {idea.hologramArchetype === "solar-ring" && (
            <group>
              {/* Central Solar Collectors + Concentric Energy Rings */}
              <mesh>
                <icosahedronGeometry args={[0.24, 1]} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={0.9}
                  wireframe
                />
              </mesh>
              <mesh rotation={[Math.PI / 3, 0.2, 0]}>
                <torusGeometry args={[0.45, 0.018, 12, 48]} />
                <meshBasicMaterial color={color} />
              </mesh>
              <mesh rotation={[-Math.PI / 4, -0.3, 0]}>
                <torusGeometry args={[0.56, 0.012, 12, 48]} />
                <meshBasicMaterial color="#bae6fd" />
              </mesh>
            </group>
          )}

          {idea.hologramArchetype === "biowall-matrix" && (
            <group>
              {/* Living Botanical Double-Helix / Cellular Lattice */}
              <mesh>
                <torusKnotGeometry args={[0.28, 0.07, 64, 12, 2, 3]} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={0.75}
                  wireframe
                />
              </mesh>
              <mesh>
                <sphereGeometry args={[0.46, 16, 12]} />
                <meshBasicMaterial
                  color={color}
                  transparent
                  opacity={0.18}
                  wireframe
                />
              </mesh>
            </group>
          )}

          {idea.hologramArchetype === "agent-lattice" && (
            <group>
              {/* Nested Octahedral Agentic Compute Core */}
              <mesh>
                <octahedronGeometry args={[0.36, 0]} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={0.8}
                  wireframe
                />
              </mesh>
              <mesh rotation={[0.5, 0.5, 0]}>
                <boxGeometry args={[0.44, 0.44, 0.44]} />
                <meshBasicMaterial color="#fde68a" wireframe />
              </mesh>
            </group>
          )}

          {idea.hologramArchetype === "drone-swarm" && (
            <group>
              {/* Cooperative Swarm Constellation */}
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                const a = (i / 8) * Math.PI * 2;
                const r = i % 2 === 0 ? 0.42 : 0.26;
                return (
                  <mesh
                    key={i}
                    position={[
                      Math.cos(a) * r,
                      Math.sin(a * 2) * 0.18,
                      Math.sin(a) * r,
                    ]}
                  >
                    <octahedronGeometry args={[0.075, 0]} />
                    <meshBasicMaterial color={color} />
                  </mesh>
                );
              })}
              <mesh>
                <dodecahedronGeometry args={[0.38, 0]} />
                <meshBasicMaterial
                  color={color}
                  wireframe
                  transparent
                  opacity={0.35}
                />
              </mesh>
            </group>
          )}

          {(idea.hologramArchetype === "neural-crown" ||
            idea.hologramArchetype === "stratosphere-platform" ||
            idea.hologramArchetype === "biobank-vault" ||
            idea.hologramArchetype === "civic-agora" ||
            idea.hologramArchetype === "orbital-spire") && (
            <group>
              <mesh>
                <dodecahedronGeometry args={[0.34, 1]} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={0.75}
                  wireframe
                />
              </mesh>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.48, 0.015, 16, 48]} />
                <meshBasicMaterial color={color} />
              </mesh>
            </group>
          )}
        </group>
      </group>

      {/* Interactive Floating Holographic Tag */}
      {showFloatingCard && (
        <Html
          position={[0, 0.92, 0]}
          center
          distanceFactor={8}
          zIndexRange={[10, 0]}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.();
            }}
            className="group cursor-pointer rounded-xl border border-emerald-400/40 bg-slate-950/85 px-3 py-1.5 text-left shadow-lg backdrop-blur-md transition hover:border-emerald-300 hover:bg-slate-900"
          >
            <div className="flex items-center gap-1.5">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-[10px] font-semibold tracking-wider text-emerald-300 uppercase">
                {idea.sectorLabel.split(" ")[0]} HOLO
              </span>
            </div>
            <div className="text-xs font-bold whitespace-nowrap text-white group-hover:text-emerald-200">
              {idea.title}
            </div>
            <div className="text-[10px] whitespace-nowrap text-slate-300">
              Impact {idea.scores.impact} • 2035 Est {idea.forecasts.y2035}
            </div>
          </button>
        </Html>
      )}
    </group>
  );
}
