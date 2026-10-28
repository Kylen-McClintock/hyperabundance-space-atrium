"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshReflectorMaterial, Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { PbrTextureSet } from "@/lib/spatial/pbr-materials";
import {
  ArchitecturalPortalArchway,
  BiophilicPlanterTree,
  EarthviewBubblePodModule,
  HolographicResidentAvatar,
  SunkenGlassFloorLoungePit,
  SweptBionicRib,
} from "./SharedArchitecturalPieces";
import { QualityTier } from "../OrbitalCanvas";

interface GrandAtriumWingProps {
  pbr: PbrTextureSet;
  activeWaypointId: string;
  qualityTier: QualityTier;
  onSelectWaypoint: (id: string) => void;
  onOpenConcierge: () => void;
  onFloorClick?: (point: THREE.Vector3) => void;
}

export function GrandAtriumWing({
  pbr,
  activeWaypointId,
  qualityTier,
  onSelectWaypoint,
  onOpenConcierge,
  onFloorClick,
}: GrandAtriumWingProps) {
  const djBarsRef = useRef<THREE.Group | null>(null);

  // 1. Custom Floor Shape with Two True Circular Cutouts for the Sunken Glass-Floor Lounge Pits
  const atriumFloorGeo = useMemo(() => {
    const outerRadius = 21.8;
    const shape = new THREE.Shape();
    shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);

    // Note: When rotated [-Math.PI / 2, 0, 0], local (x, y) maps to world (x, -z).
    // Since the sunken pits are at world z = -2.5, that corresponds to shape y = +2.5.
    const westHole = new THREE.Path();
    westHole.absarc(-8.5, 2.5, 5.05, 0, Math.PI * 2, true);
    shape.holes.push(westHole);

    const eastHole = new THREE.Path();
    eastHole.absarc(8.5, 2.5, 5.05, 0, Math.PI * 2, true);
    shape.holes.push(eastHole);

    const geo = new THREE.ShapeGeometry(shape, 72);
    return geo;
  }, []);

  // 2. Angles for the 14 Swept Bionic Structural Ribs (leaving West -PI/2 and East +PI/2 open for portals)
  const ribAngles = useMemo(() => {
    const angles: number[] = [];
    const total = 16;
    for (let i = 0; i < total; i++) {
      const a = (i / total) * Math.PI * 2;
      // Skip directly over West (-X -> angle ~ 3*PI/2 or -PI/2) and East (+X -> angle ~ PI/2)
      const distEast = Math.abs(Math.sin(a) - 1);
      const distWest = Math.abs(Math.sin(a) + 1);
      if (distEast < 0.08 || distWest < 0.08) continue;
      angles.push(a);
    }
    return angles;
  }, []);

  // 3. Helical Staircase Treads (connecting main floor y=0 to mezzanine y=4.8)
  const stairTreads = useMemo(() => {
    const steps = 18;
    const arr = [];
    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      const y = 0.24 + t * 4.56;
      const angle = t * Math.PI * 0.85;
      arr.push({ idx: i, y, angle });
    }
    return arr;
  }, []);

  // Animate DJ spectrum bars on the South-East Terrace
  useFrame(({ clock }) => {
    if (!djBarsRef.current) return;
    const t = clock.getElapsedTime();
    djBarsRef.current.children.forEach((child, i) => {
      const s = 0.35 + 0.65 * Math.abs(Math.sin(t * 4.2 + i * 0.75));
      child.scale.y = s;
    });
  });

  return (
    <group name="grand-atrium-wing">
      {/* =================================================================== */}
      {/* 1. MIRROR-HONED TRAVERTINE MAIN PLAZA FLOOR (WITH SUNKEN PIT HOLES) */}
      {/* =================================================================== */}
      <mesh
        geometry={atriumFloorGeo}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
        onClick={(e) => {
          if (onFloorClick) {
            e.stopPropagation();
            onFloorClick(e.point);
          }
        }}
      >
        {qualityTier === "lightweight" ? (
          <meshStandardMaterial
            map={pbr.travertineMap}
            normalMap={pbr.travertineNormal}
            roughnessMap={pbr.travertineRoughness}
            roughness={0.22}
            metalness={0.1}
          />
        ) : (
          <MeshReflectorMaterial
            mirror={0.48}
            blur={[320, 90]}
            resolution={qualityTier === "high" ? 1024 : 512}
            mixBlur={0.82}
            mixStrength={1.35}
            roughness={0.24}
            metalness={0.12}
            color="#f2e8d5"
            map={pbr.travertineMap}
            normalMap={pbr.travertineNormal}
            normalScale={new THREE.Vector2(0.35, 0.35)}
            roughnessMap={pbr.travertineRoughness}
          />
        )}
      </mesh>

      {/* Outer Perimeter Brushed Brass & Warm LED Cove Floor Ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[21.3, 21.85, 96]} />
        <meshStandardMaterial
          color="#d4af37"
          normalMap={pbr.brassNormal}
          metalness={0.92}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[21.18, 21.28, 96]} />
        <meshBasicMaterial
          color={new THREE.Color(2.6, 1.8, 0.85)}
          toneMapped={false}
        />
      </mesh>

      {/* Central Compass Rose Brass Medallion Inlay on the Atrium Floor */}
      <group position={[0, 0.015, 3.2]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.1, 2.28, 64]} />
          <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.2} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.85, 0.96, 48]} />
          <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.2} />
        </mesh>
      </group>

      {/* =================================================================== */}
      {/* 2. TWIN SUNKEN EARTH-GLASS CONVERSATION PITS (WEST & EAST)          */}
      {/* =================================================================== */}
      <SunkenGlassFloorLoungePit
        position={[-8.5, 0, -2.5]}
        radius={5.05}
        accentColor="#d97706"
        pbr={pbr}
        onSelect={() => onSelectWaypoint("lounge-pit-west")}
      />
      <SunkenGlassFloorLoungePit
        position={[8.5, 0, -2.5]}
        radius={5.05}
        accentColor="#0d9488"
        pbr={pbr}
        onSelect={() => onSelectWaypoint("lounge-pit-east")}
      />

      {/* =================================================================== */}
      {/* 3. LUSH BIOPHILIC PLANTER BEDS & SCULPTED CANOPY TREES              */}
      {/* =================================================================== */}
      <BiophilicPlanterTree position={[-14.2, 0, -2.2]} scale={1.1} pbr={pbr} />
      <BiophilicPlanterTree position={[14.2, 0, -2.2]} scale={1.1} pbr={pbr} />
      <BiophilicPlanterTree position={[-3.2, 0, -9.2]} scale={0.95} pbr={pbr} />
      <BiophilicPlanterTree position={[3.2, 0, -9.2]} scale={0.95} pbr={pbr} />
      <BiophilicPlanterTree position={[-14.8, 0, 9.5]} scale={1.0} pbr={pbr} />
      <BiophilicPlanterTree position={[14.8, 0, 9.5]} scale={1.0} pbr={pbr} />

      {/* =================================================================== */}
      {/* 4. 360° SWEPT BIONIC RIBS & VAULTED CEILING OCULUS DOME             */}
      {/* =================================================================== */}
      {ribAngles.map((angle, idx) => (
        <SweptBionicRib
          key={idx}
          angle={angle}
          outerRadius={21.4}
          innerTopRadius={8.8}
          height={14.2}
          pbr={pbr}
        />
      ))}

      {/* Vaulted Ceiling Ring & Skylight Oculus at y = 14.2m */}
      <group position={[0, 14.2, 0]}>
        {/* Outer Travertine Ceiling Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]} receiveShadow>
          <torusGeometry args={[14.8, 0.85, 20, 96]} />
          <meshStandardMaterial
            map={pbr.travertineMap}
            normalMap={pbr.travertineNormal}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[14.1, 0.12, 12, 96]} />
          <meshBasicMaterial
            color={new THREE.Color(2.7, 1.85, 0.85)}
            toneMapped={false}
          />
        </mesh>

        {/* Inner Oculus Ring & Brushed Brass Skylight Diagrid */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[8.8, 0.55, 20, 96]} />
          <meshStandardMaterial
            map={pbr.travertineMap}
            normalMap={pbr.travertineNormal}
            roughness={0.28}
          />
        </mesh>
        <mesh position={[0, -0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[8.4, 0.1, 12, 96]} />
          <meshBasicMaterial
            color={new THREE.Color(2.9, 1.95, 0.9)}
            toneMapped={false}
          />
        </mesh>

        {/* Skylight Glass Dome */}
        <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[8.6, 64]} />
          <meshPhysicalMaterial
            color="#dff6ff"
            transmission={0.9}
            transparent
            opacity={0.22}
            roughness={0.05}
            ior={1.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Curved Panoramic Structural Glass Hull Curtain Wall (North & South Arcs) */}
      {[-Math.PI * 0.36, Math.PI * 0.64].map((startAng, i) => (
        <group key={i}>
          <mesh position={[0, 6.2, 0]}>
            <cylinderGeometry
              args={[21.55, 21.55, 12.4, 64, 1, true, startAng, Math.PI * 0.72]}
            />
            <meshPhysicalMaterial
              color="#d8f3ff"
              transmission={0.92}
              transparent
              opacity={0.18}
              roughness={0.04}
              ior={1.5}
              reflectivity={0.9}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Horizontal Brushed Brass Curtain-Wall Transom Rings */}
          {[1.2, 4.8, 9.2].map((ty, j) => (
            <mesh key={j} position={[0, ty, 0]}>
              <cylinderGeometry
                args={[21.52, 21.52, 0.12, 64, 1, true, startAng, Math.PI * 0.72]}
              />
              <meshStandardMaterial
                color="#d4af37"
                metalness={0.92}
                roughness={0.22}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* =================================================================== */}
      {/* 5. UPPER MEZZANINE 360° PROMENADE BALCONY (y = +4.8m) & STAIRCASES  */}
      {/* =================================================================== */}
      <group position={[0, 4.8, 0]}>
        {/* North & South Curved Mezzanine Balcony Decks (leaving West/East portal heights grand) */}
        {[-Math.PI * 0.38, Math.PI * 0.62].map((startA, idx) => (
          <group key={idx}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow>
              <ringGeometry
                args={[16.2, 21.3, 64, 1, startA - Math.PI / 2, Math.PI * 0.76]}
              />
              <meshStandardMaterial
                map={pbr.travertineMap}
                normalMap={pbr.travertineNormal}
                roughness={0.25}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Mezzanine Inner Rim Glowing Golden Cove Strip */}
            <mesh position={[0, -0.08, 0]}>
              <cylinderGeometry
                args={[16.2, 16.2, 0.18, 64, 1, true, startA, Math.PI * 0.76]}
              />
              <meshBasicMaterial
                color={new THREE.Color(2.6, 1.8, 0.82)}
                toneMapped={false}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Mezzanine Structural Glass Balustrade & Brushed Brass Handrail */}
            <mesh position={[0, 0.55, 0]}>
              <cylinderGeometry
                args={[16.25, 16.25, 1.05, 64, 1, true, startA, Math.PI * 0.76]}
              />
              <meshPhysicalMaterial
                color="#e0f7ff"
                transmission={0.9}
                transparent
                opacity={0.32}
                roughness={0.05}
                side={THREE.DoubleSide}
              />
            </mesh>
            <mesh position={[0, 1.08, 0]}>
              <cylinderGeometry
                args={[16.25, 16.25, 0.08, 64, 1, true, startA, Math.PI * 0.76]}
              />
              <meshStandardMaterial
                color="#d4af37"
                metalness={0.92}
                roughness={0.2}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Twin Sweeping Helical Staircases (North-West & North-East) */}
      {[-1, 1].map((side) => (
        <group
          key={side}
          position={[side * 15.2, 0, -6.5]}
          rotation={[0, side === -1 ? 0.3 : -2.4, 0]}
        >
          {stairTreads.map((step) => {
            const r = 3.2;
            const sx = Math.cos(step.angle) * r;
            const sz = Math.sin(step.angle) * r;
            return (
              <group
                key={step.idx}
                position={[sx, step.y, sz]}
                rotation={[0, -step.angle, 0]}
              >
                <RoundedBox
                  args={[1.45, 0.1, 0.48]}
                  radius={0.03}
                  castShadow
                  receiveShadow
                >
                  <meshStandardMaterial
                    map={pbr.travertineMap}
                    normalMap={pbr.travertineNormal}
                    roughness={0.26}
                  />
                </RoundedBox>
                <mesh position={[0, -0.06, 0]}>
                  <boxGeometry args={[1.35, 0.025, 0.38]} />
                  <meshBasicMaterial
                    color={new THREE.Color(2.4, 1.65, 0.72)}
                    toneMapped={false}
                  />
                </mesh>
              </group>
            );
          })}
        </group>
      ))}

      {/* =================================================================== */}
      {/* 6. 6 OUTWARD-PROTRUDING EARTHVIEW BUBBLE PODS (NORTH HULL)          */}
      {/* =================================================================== */}
      <EarthviewBubblePodModule
        position={[-14.0, 1.9, -22.5]}
        rotationY={0.32}
        label="Pod α1 • West"
        isSelected={activeWaypointId === "pod-earthview-1"}
        pbr={pbr}
        onSelect={() => onSelectWaypoint("pod-earthview-1")}
      />
      <EarthviewBubblePodModule
        position={[-5.0, 1.9, -24.2]}
        rotationY={0.1}
        label="Pod α2 • Center-West"
        isSelected={activeWaypointId === "pod-earthview-2"}
        pbr={pbr}
        onSelect={() => onSelectWaypoint("pod-earthview-2")}
      />
      <EarthviewBubblePodModule
        position={[5.0, 1.9, -24.2]}
        rotationY={-0.1}
        label="Pod β1 • Center-East"
        isSelected={activeWaypointId === "pod-earthview-3"}
        pbr={pbr}
        onSelect={() => onSelectWaypoint("pod-earthview-3")}
      />
      <EarthviewBubblePodModule
        position={[14.0, 1.9, -22.5]}
        rotationY={-0.32}
        label="Pod β2 • East"
        isSelected={activeWaypointId === "pod-earthview-4"}
        pbr={pbr}
        onSelect={() => onSelectWaypoint("pod-earthview-4")}
      />
      {/* Upper Mezzanine Bubble Pods (+18 ft) */}
      <EarthviewBubblePodModule
        position={[-9.8, 6.6, -22.8]}
        rotationY={0.22}
        label="Pod γ1 • Upper West"
        isSelected={activeWaypointId === "pod-earthview-5"}
        pbr={pbr}
        onSelect={() => onSelectWaypoint("pod-earthview-5")}
      />
      <EarthviewBubblePodModule
        position={[9.8, 6.6, -22.8]}
        rotationY={-0.22}
        label="Pod γ2 • Upper East"
        isSelected={activeWaypointId === "pod-earthview-6"}
        pbr={pbr}
        onSelect={() => onSelectWaypoint("pod-earthview-6")}
      />

      {/* =================================================================== */}
      {/* 7. SOUTH ATRIUM (180° REAR VIEW):                                   */}
      {/*    - CENTER-SOUTH: Space-Elevator Arrival Rotunda                   */}
      {/*    - SOUTH-WEST: Circular Glass Botanical Reading Library           */}
      {/*    - SOUTH-EAST: Holographic Bartender Bar & Orbital DJ Terrace     */}
      {/* =================================================================== */}

      {/* 7A. Center-South: Grand Space-Elevator Arrival Rotunda (z = +20.5) */}
      <group position={[0, 0, 20.2]}>
        {/* Elevated Travertine Docking Plinth */}
        <mesh position={[0, 0.18, 0]} receiveShadow>
          <cylinderGeometry args={[3.8, 4.2, 0.36, 48]} />
          <meshStandardMaterial
            map={pbr.travertineMap}
            normalMap={pbr.travertineNormal}
            roughness={0.26}
          />
        </mesh>
        <mesh position={[0, 0.37, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.4, 3.65, 48]} />
          <meshBasicMaterial
            color={new THREE.Color(0.5, 2.2, 2.8)}
            toneMapped={false}
          />
        </mesh>

        {/* Soaring 14m Glass & Brushed Brass Space-Elevator Tube */}
        <mesh position={[0, 7.2, 0]}>
          <cylinderGeometry args={[2.6, 2.6, 13.8, 40, 1, true]} />
          <meshPhysicalMaterial
            color="#d8f3ff"
            transmission={0.9}
            transparent
            opacity={0.26}
            roughness={0.05}
            side={THREE.DoubleSide}
          />
        </mesh>
        {[-2.55, 2.55].map((rx, i) => (
          <mesh key={i} position={[rx, 7.2, 0]}>
            <boxGeometry args={[0.16, 13.8, 0.24]} />
            <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.2} />
          </mesh>
        ))}

        {/* Docked Illuminated Space-Elevator Ascent Capsule */}
        <group position={[0, 2.2, 0]}>
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[2.15, 2.15, 0.22, 36]} />
            <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.2} />
          </mesh>
          <mesh position={[0, -1.5, 0]}>
            <cylinderGeometry args={[2.15, 2.15, 0.22, 36]} />
            <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.2} />
          </mesh>
          <mesh position={[0, 1.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[2.0, 0.06, 12, 48]} />
            <meshBasicMaterial
              color={new THREE.Color(2.8, 1.9, 0.85)}
              toneMapped={false}
            />
          </mesh>
        </group>

        <Text
          position={[0, 4.3, -2.65]}
          rotation={[0, Math.PI, 0]}
          fontSize={0.28}
          letterSpacing={0.14}
          color="#fde68a"
          anchorX="center"
          anchorY="middle"
        >
          ORBITAL TETHER ELEVATOR • 418 KM LEO
        </Text>
      </group>

      {/* 7B. South-West: Circular Glass-Walled Botanical Reading Library ([-10.5, 0, 15.5]) */}
      <group
        position={[-10.5, 0, 15.5]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectWaypoint("conservatory-deck");
          onOpenConcierge();
        }}
      >
        {/* Walnut Inlaid Library Floor Disc */}
        <mesh position={[0, 0.04, 0]} receiveShadow>
          <cylinderGeometry args={[4.4, 4.5, 0.08, 48]} />
          <meshPhysicalMaterial
            map={pbr.walnutMap}
            normalMap={pbr.walnutNormal}
            roughness={0.26}
            clearcoat={0.5}
          />
        </mesh>

        {/* Curved Glass Conservatory Enclosure */}
        <mesh position={[0, 2.3, 0]}>
          <cylinderGeometry
            args={[4.35, 4.35, 4.5, 48, 1, true, Math.PI * 0.25, Math.PI * 1.45]}
          />
          <meshPhysicalMaterial
            color="#e0f7ff"
            transmission={0.9}
            transparent
            opacity={0.24}
            roughness={0.05}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0, 4.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[4.35, 0.1, 16, 64]} />
          <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.2} />
        </mesh>

        {/* Curved American Walnut Bookcases with Illuminated Book Shelves */}
        {[-1.9, -0.95, 0, 0.95, 1.9].map((angOffset, bIdx) => {
          const a = Math.PI + angOffset * 0.45;
          const bx = Math.sin(a) * 3.85;
          const bz = Math.cos(a) * 3.85;
          return (
            <group key={bIdx} position={[bx, 1.8, bz]} rotation={[0, a, 0]}>
              <RoundedBox args={[1.45, 3.4, 0.42]} radius={0.04} castShadow receiveShadow>
                <meshStandardMaterial
                  map={pbr.walnutMap}
                  normalMap={pbr.walnutNormal}
                  roughness={0.32}
                />
              </RoundedBox>
              {/* Warm LED backlit shelf strips */}
              {[-1.1, -0.35, 0.4, 1.15].map((sy, sIdx) => (
                <mesh key={sIdx} position={[0, sy, 0.22]}>
                  <boxGeometry args={[1.28, 0.04, 0.04]} />
                  <meshBasicMaterial
                    color={new THREE.Color(2.6, 1.75, 0.78)}
                    toneMapped={false}
                  />
                </mesh>
              ))}
            </group>
          );
        })}

        {/* Central Botanical Library Tree & Reading Armchairs */}
        <BiophilicPlanterTree position={[0, 0.04, 0]} scale={0.78} pbr={pbr} />

        <Text
          position={[0, 4.1, -4.38]}
          rotation={[0, Math.PI, 0]}
          fontSize={0.24}
          letterSpacing={0.12}
          color="#fde68a"
          anchorX="center"
          anchorY="middle"
        >
          BOTANICAL LIBRARY & BRIEFING CONSERVATORY
        </Text>
      </group>

      {/* 7C. South-East: Holographic Bartender Cocktail Bar & Orbital DJ Terrace ([+10.5, 0, 15.5]) */}
      <group
        position={[10.5, 0, 15.5]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectWaypoint("atrium-concierge");
          onOpenConcierge();
        }}
      >
        {/* Backlit Fluted Alabaster & Brushed Brass Circular Cocktail Bar */}
        <mesh position={[0, 0.56, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[2.85, 2.75, 1.12, 48, 1, true]} />
          <meshPhysicalMaterial
            color="#fff6e6"
            normalMap={pbr.flutedNormal}
            roughness={0.25}
            transmission={0.55}
            thickness={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Warm internal alabaster bar core glow */}
        <mesh position={[0, 0.52, 0]}>
          <cylinderGeometry args={[2.68, 2.68, 0.96, 40]} />
          <meshBasicMaterial
            color={new THREE.Color(2.3, 1.5, 0.65)}
            toneMapped={false}
          />
        </mesh>
        {/* Polished Walnut & Brass Bar Counter Top */}
        <mesh position={[0, 1.14, 0]} castShadow receiveShadow>
          <torusGeometry args={[2.8, 0.32, 16, 64]} />
          <meshPhysicalMaterial
            map={pbr.walnutMap}
            normalMap={pbr.walnutNormal}
            roughness={0.2}
            clearcoat={0.65}
          />
        </mesh>
        {/* Brushed Brass Footrail */}
        <mesh position={[0, 0.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3.08, 0.04, 12, 64]} />
          <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.2} />
        </mesh>

        {/* 6 Barstools Around the North Side of the Cocktail Bar */}
        {[-1.2, -0.72, -0.24, 0.24, 0.72, 1.2].map((ang, idx) => {
          const a = Math.PI + ang;
          const sx = Math.sin(a) * 3.55;
          const sz = Math.cos(a) * 3.55;
          return (
            <group key={idx} position={[sx, 0, sz]}>
              <mesh position={[0, 0.38, 0]}>
                <cylinderGeometry args={[0.04, 0.18, 0.76, 12]} />
                <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.2} />
              </mesh>
              <mesh position={[0, 0.78, 0]} castShadow>
                <cylinderGeometry args={[0.26, 0.24, 0.12, 20]} />
                <meshPhysicalMaterial
                  map={pbr.boucleMap}
                  normalMap={pbr.boucleNormal}
                  color="#f8f1e5"
                  roughness={0.7}
                />
              </mesh>
            </group>
          );
        })}

        {/* Holographic Resident Concierge & Bartender (Aria) */}
        <HolographicResidentAvatar
          position={[0, 0.9, 0]}
          name="ARIA"
          role="Orbital Concierge & Resident Mixologist"
          color="#fbbf24"
          onClick={onOpenConcierge}
        />

        {/* Live Orbital DJ Console & Audio-Reactive 3D Equalizer Halo */}
        <group position={[3.6, 0.2, -2.2]} rotation={[0, -2.4, 0]}>
          <RoundedBox args={[2.2, 1.05, 0.9]} radius={0.12} position={[0, 0.52, 0]} castShadow>
            <meshStandardMaterial
              map={pbr.walnutMap}
              normalMap={pbr.walnutNormal}
              roughness={0.28}
            />
          </RoundedBox>
          <group ref={djBarsRef} position={[-0.75, 1.15, 0]}>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((b) => (
              <mesh key={b} position={[b * 0.21, 0.25, 0]}>
                <boxGeometry args={[0.1, 0.55, 0.1]} />
                <meshBasicMaterial
                  color={new THREE.Color(0.4, 2.4, 2.8)}
                  toneMapped={false}
                />
              </mesh>
            ))}
          </group>
          <Text
            position={[0, 1.85, 0]}
            fontSize={0.16}
            color="#38bdf8"
            anchorX="center"
            anchorY="middle"
          >
            LIVE ORBITAL DJ SOUNDSCAPE
          </Text>
        </group>
      </group>

      {/* =================================================================== */}
      {/* 8. WEST (-X) & EAST (+X) MONUMENTAL PORTAL ARCHWAYS                 */}
      {/* =================================================================== */}
      <ArchitecturalPortalArchway
        position={[-20.8, 0, 0]}
        rotationY={Math.PI / 2}
        title="LEVL"
        subtitle="LONGEVITY LOUNGE • PROTOCOL BAR & SPA"
        neonColor={[0.25, 3.1, 2.75]}
        pbr={pbr}
        onEnter={() => onSelectWaypoint("levl-lounge-entry")}
      />

      <ArchitecturalPortalArchway
        position={[20.8, 0, 0]}
        rotationY={-Math.PI / 2}
        title="AGI FUTURES"
        subtitle="INVENTOR'S CLUB • 33 HOLOGRAPHIC BLUEPRINTS"
        neonColor={[0.3, 3.3, 1.55]}
        pbr={pbr}
        onEnter={() => onSelectWaypoint("agi-club-overview")}
      />
    </group>
  );
}
