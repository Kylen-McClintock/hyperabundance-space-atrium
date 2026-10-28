"use client";

import React, { useMemo } from "react";
import { MeshReflectorMaterial, Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { PbrTextureSet } from "@/lib/spatial/pbr-materials";
import {
  AgiFuturesIdea,
  SECTOR_BOOTHS,
  SectorBoothId,
} from "@/data/agifutures-catalog";
import {
  BiophilicPlanterTree,
  CurvedBoucleSectionalSofa,
  HolographicResidentAvatar,
  SweptBionicRib,
} from "./SharedArchitecturalPieces";
import { IdeaHologram } from "../objects/IdeaHologram";
import { QualityTier } from "../OrbitalCanvas";

interface AgiFuturesClubWingProps {
  pbr: PbrTextureSet;
  activeIdea: AgiFuturesIdea;
  sectorIdeaMap: Record<SectorBoothId, AgiFuturesIdea>;
  qualityTier: QualityTier;
  reducedMotion: boolean;
  onSelectWaypoint: (id: string) => void;
  onOpenIdeaDrawer: (idea?: AgiFuturesIdea) => void;
  onOpenMatchingDrawer: () => void;
  onFloorClick?: (point: THREE.Vector3) => void;
}

export function AgiFuturesClubWing({
  pbr,
  activeIdea,
  sectorIdeaMap,
  qualityTier,
  reducedMotion,
  onSelectWaypoint,
  onOpenIdeaDrawer,
  onOpenMatchingDrawer,
  onFloorClick,
}: AgiFuturesClubWingProps) {
  // Floor shape centered at [+36, 0, 0] with radius 16.6m and a central 3.8m glass oculus hole under the Holo-Table
  const clubFloorGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, 16.6, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.absarc(0, 0, 3.85, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    return new THREE.ShapeGeometry(shape, 64);
  }, []);

  // Bionic ribs around the AGI Futures rotunda (leaving the West -X portal connection to the Atrium open)
  const ribAngles = useMemo(() => {
    const arr: number[] = [];
    const total = 12;
    for (let i = 0; i < total; i++) {
      const a = (i / total) * Math.PI * 2;
      // Skip West (-X -> sin(a) ~ -1) where the Atrium portal connects
      if (Math.sin(a) < -0.78) continue;
      arr.push(a);
    }
    return arr;
  }, []);

  // 6 Sector Booth positions around the North (z = -11.5) and South (z = +11.5) club perimeter
  const boothConfigs = useMemo(
    () => [
      {
        booth: SECTOR_BOOTHS[0],
        waypointId: "agi-booth-homes",
        pos: [-6.5, 0, -11.2] as [number, number, number],
        rotY: 0,
      },
      {
        booth: SECTOR_BOOTHS[1],
        waypointId: "agi-booth-energy",
        pos: [0.5, 0, -11.8] as [number, number, number],
        rotY: 0,
      },
      {
        booth: SECTOR_BOOTHS[2],
        waypointId: "agi-booth-biotech",
        pos: [7.5, 0, -11.2] as [number, number, number],
        rotY: 0,
      },
      {
        booth: SECTOR_BOOTHS[3],
        waypointId: "agi-booth-ai",
        pos: [-6.5, 0, 11.2] as [number, number, number],
        rotY: Math.PI,
      },
      {
        booth: SECTOR_BOOTHS[4],
        waypointId: "agi-holo-table",
        pos: [0.5, 0, 11.8] as [number, number, number],
        rotY: Math.PI,
      },
      {
        booth: SECTOR_BOOTHS[5],
        waypointId: "agi-holo-table",
        pos: [7.5, 0, 11.2] as [number, number, number],
        rotY: Math.PI,
      },
    ],
    []
  );

  return (
    <group position={[36, 0, 0]} name="agi-futures-club-wing">
      {/* =================================================================== */}
      {/* 1. REFLECTIVE CLUB FLOOR WITH EARTH-GLASS OCULUS UNDER HOLO-TABLE   */}
      {/* =================================================================== */}
      <mesh
        geometry={clubFloorGeo}
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
            roughness={0.22}
          />
        ) : (
          <MeshReflectorMaterial
            mirror={0.46}
            blur={[280, 80]}
            resolution={qualityTier === "high" ? 1024 : 512}
            mixBlur={0.82}
            mixStrength={1.3}
            roughness={0.24}
            metalness={0.14}
            color="#f2eadc"
            map={pbr.travertineMap}
            normalMap={pbr.travertineNormal}
            normalScale={new THREE.Vector2(0.3, 0.3)}
            roughnessMap={pbr.travertineRoughness}
          />
        )}
      </mesh>

      {/* Connecting Promenade Bridge Deck Between Atrium (+20.8) and AGI Futures Wing */}
      <mesh
        position={[-14.5, 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[8.8, 9.2]} />
        <meshStandardMaterial
          map={pbr.travertineMap}
          normalMap={pbr.travertineNormal}
          roughness={0.24}
        />
      </mesh>

      {/* Transparent Earth-Glass Oculus Directly Beneath the Central Holo-Table */}
      <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.85, 64]} />
        <meshPhysicalMaterial
          color="#d1fae5"
          transmission={0.92}
          transparent
          opacity={0.3}
          roughness={0.05}
          ior={1.52}
        />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.78, 4.08, 64]} />
        <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.68, 3.76, 64]} />
        <meshBasicMaterial
          color={new THREE.Color(0.3, 3.2, 1.5)}
          toneMapped={false}
        />
      </mesh>

      {/* Perimeter Radiant Emerald & Warm Brass Floor Cove Ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[16.25, 16.55, 72]} />
        <meshBasicMaterial
          color={new THREE.Color(0.3, 3.1, 1.45)}
          toneMapped={false}
        />
      </mesh>

      {/* =================================================================== */}
      {/* 2. 360° BIONIC RIBS, MULTI-RING BRASS CHANDELIER & PANORAMIC HULL   */}
      {/* =================================================================== */}
      {ribAngles.map((a, idx) => (
        <SweptBionicRib
          key={idx}
          angle={a}
          outerRadius={16.5}
          innerTopRadius={6.8}
          height={11.8}
          pbr={pbr}
        />
      ))}

      {/* Suspended 3-Ring Brushed Brass & Radiant Emerald Orbital Chandelier */}
      <group position={[0, 8.8, 0]}>
        {[
          { r: 5.2, y: 1.2, col: [2.7, 1.85, 0.8] },
          { r: 3.6, y: 0.4, col: [0.3, 3.2, 1.5] },
          { r: 2.1, y: -0.3, col: [2.7, 1.85, 0.8] },
        ].map((ring, idx) => (
          <group key={idx} position={[0, ring.y, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[ring.r, 0.11, 16, 64]} />
              <meshStandardMaterial
                color="#d4af37"
                metalness={0.92}
                roughness={0.18}
              />
            </mesh>
            <mesh position={[0, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[ring.r, 0.045, 12, 64]} />
              <meshBasicMaterial
                color={new THREE.Color(ring.col[0], ring.col[1], ring.col[2])}
                toneMapped={false}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Curved Panoramic Glass Hull Around North, East, and South Perimeter */}
      <mesh position={[0, 5.2, 0]}>
        <cylinderGeometry
          args={[16.6, 16.6, 10.4, 64, 1, true, -Math.PI * 0.28, Math.PI * 1.56]}
        />
        <meshPhysicalMaterial
          color="#d8f8ee"
          transmission={0.9}
          transparent
          opacity={0.18}
          roughness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Biophilic Canopy Trees Framing the Club Entrance */}
      <BiophilicPlanterTree position={[-8.2, 0, -6.2]} scale={0.92} pbr={pbr} />
      <BiophilicPlanterTree position={[-8.2, 0, 6.2]} scale={0.92} pbr={pbr} />

      {/* =================================================================== */}
      {/* 3. CENTRAL COLLABORATIVE HOLOGRAPHIC BLUEPRINT TABLE ([0, 0, 0])    */}
      {/* =================================================================== */}
      <group
        position={[0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectWaypoint("agi-holo-table");
          onOpenIdeaDrawer(activeIdea);
        }}
      >
        {/* Brushed Brass & Fluted Walnut Central Table Base */}
        <mesh position={[0, 0.42, 0]} castShadow>
          <cylinderGeometry args={[1.35, 1.65, 0.84, 40]} />
          <meshStandardMaterial
            map={pbr.walnutMap}
            normalMap={pbr.walnutNormal}
            roughness={0.28}
          />
        </mesh>
        {/* Monumental Circular Walnut & Brass Table Top (Radius 2.45m) */}
        <mesh position={[0, 0.88, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[2.45, 2.45, 0.12, 64]} />
          <meshPhysicalMaterial
            map={pbr.walnutMap}
            normalMap={pbr.walnutNormal}
            roughness={0.18}
            clearcoat={0.65}
          />
        </mesh>
        <mesh position={[0, 0.88, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.46, 0.055, 12, 64]} />
          <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.2} />
        </mesh>
        {/* Glowing Emerald Hologram Projection Well */}
        <mesh position={[0, 0.95, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.15, 1.32, 48]} />
          <meshBasicMaterial
            color={new THREE.Color(0.3, 3.2, 1.6)}
            toneMapped={false}
          />
        </mesh>

        {/* Live 3D Architectural Startup Blueprint Hologram */}
        <IdeaHologram
          idea={activeIdea}
          position={[0, 1.55, 0]}
          scale={1.15}
          reducedMotion={reducedMotion}
          showFloatingCard={false}
          onSelect={() => onOpenIdeaDrawer(activeIdea)}
        />

        {/* Crisp 3D Floating Hologram Title Above the Central Table */}
        <Text
          position={[0, 2.95, 0]}
          fontSize={0.26}
          letterSpacing={0.08}
          color="#6ee7b7"
          anchorX="center"
          anchorY="middle"
        >
          {activeIdea.title.toUpperCase()}
        </Text>
        <Text
          position={[0, 2.66, 0]}
          fontSize={0.14}
          color="#fef3c7"
          anchorX="center"
          anchorY="middle"
        >
          {`${activeIdea.scoreTitle.slice(0, 68)} • Click to Open 33 Blueprints`}
        </Text>

        {/* 8 Club Armchairs Surrounding the Central Holo-Table */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((chairIdx) => {
          const a = (chairIdx / 8) * Math.PI * 2;
          const cx = Math.sin(a) * 3.15;
          const cz = Math.cos(a) * 3.15;
          return (
            <group key={chairIdx} position={[cx, 0, cz]} rotation={[0, a + Math.PI, 0]}>
              <mesh position={[0, 0.22, 0]}>
                <cylinderGeometry args={[0.04, 0.24, 0.44, 12]} />
                <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.2} />
              </mesh>
              <RoundedBox
                args={[0.66, 0.14, 0.62]}
                radius={0.05}
                position={[0, 0.46, 0]}
                castShadow
              >
                <meshPhysicalMaterial
                  map={pbr.boucleMap}
                  normalMap={pbr.boucleNormal}
                  color="#f8f1e5"
                  roughness={0.75}
                />
              </RoundedBox>
              <RoundedBox
                args={[0.66, 0.52, 0.14]}
                radius={0.05}
                position={[0, 0.74, -0.26]}
                castShadow
              >
                <meshStandardMaterial
                  map={pbr.walnutMap}
                  normalMap={pbr.walnutNormal}
                  roughness={0.3}
                />
              </RoundedBox>
            </group>
          );
        })}
      </group>

      {/* =================================================================== */}
      {/* 4. 6 CURVED WALNUT & BRASS SECTOR IDEA BOOTHS (NORTH & SOUTH ARCS)  */}
      {/* =================================================================== */}
      {boothConfigs.map(({ booth, waypointId, pos, rotY }) => {
        const boothIdea = sectorIdeaMap[booth.id] || activeIdea;
        return (
          <group
            key={booth.id}
            position={pos}
            rotation={[0, rotY, 0]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectWaypoint(waypointId);
              onOpenIdeaDrawer(boothIdea);
            }}
          >
            {/* Semi-Circular Curved Walnut Booth Privacy Alcove Shell */}
            <mesh position={[0, 1.45, 0]} castShadow receiveShadow>
              <cylinderGeometry
                args={[2.55, 2.55, 2.9, 32, 1, true, Math.PI * 0.6, Math.PI * 0.8]}
              />
              <meshStandardMaterial
                map={pbr.walnutMap}
                normalMap={pbr.walnutNormal}
                roughness={0.28}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Brushed Brass Arch Rim */}
            <mesh position={[0, 2.92, 0]}>
              <cylinderGeometry
                args={[2.58, 2.58, 0.1, 32, 1, true, Math.PI * 0.6, Math.PI * 0.8]}
              />
              <meshStandardMaterial
                color="#d4af37"
                metalness={0.92}
                roughness={0.2}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Curved Cream Bouclé Banquette Sofa Inside the Booth */}
            <CurvedBoucleSectionalSofa
              radius={1.95}
              arcAngle={Math.PI * 0.72}
              startAngle={Math.PI * 0.64}
              segments={5}
              accentColor={booth.accentHex}
              pbr={pbr}
            />

            {/* Booth Walnut & Brass Hologram Table */}
            <mesh position={[0, 0.36, 0.2]} castShadow>
              <cylinderGeometry args={[0.72, 0.55, 0.72, 24]} />
              <meshStandardMaterial
                map={pbr.walnutMap}
                normalMap={pbr.walnutNormal}
                roughness={0.25}
              />
            </mesh>

            {/* Sector 3D Startup Blueprint Hologram */}
            <IdeaHologram
              idea={boothIdea}
              position={[0, 1.15, 0.2]}
              scale={0.62}
              reducedMotion={reducedMotion}
              showFloatingCard={false}
              onSelect={() => onOpenIdeaDrawer(boothIdea)}
            />

            {/* Backlit 3D Sector Booth Header Sign */}
            <Text
              position={[0, 3.28, 0]}
              fontSize={0.22}
              letterSpacing={0.08}
              color="#6ee7b7"
              anchorX="center"
              anchorY="middle"
            >
              {booth.boothSignage.toUpperCase()}
            </Text>
            <Text
              position={[0, 3.02, 0]}
              fontSize={0.14}
              color="#fef3c7"
              anchorX="center"
              anchorY="middle"
            >
              {boothIdea.title}
            </Text>
          </group>
        );
      })}

      {/* =================================================================== */}
      {/* 5. EAST OBSERVATORY WALL (x = +13.2 local / +49.2 world):           */}
      {/*    - NORTH-EAST: KAELEN AI BUILDER GUIDE DESK                       */}
      {/*    - SOUTH-EAST: FOUNDER MATCHING WALL                              */}
      {/* =================================================================== */}

      {/* 5A. Kaelen AI Builder Guide Desk ([+13.2, 0, -4.0]) */}
      <group
        position={[13.2, 0, -4.0]}
        rotation={[0, -Math.PI / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectWaypoint("agi-builder-guide");
          onOpenIdeaDrawer(activeIdea);
        }}
      >
        <RoundedBox
          args={[3.6, 1.05, 1.1]}
          radius={0.16}
          position={[0, 0.52, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            map={pbr.walnutMap}
            normalMap={pbr.walnutNormal}
            roughness={0.26}
          />
        </RoundedBox>
        <mesh position={[0, 1.06, 0]}>
          <boxGeometry args={[3.4, 0.05, 0.95]} />
          <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.2} />
        </mesh>

        <HolographicResidentAvatar
          position={[0, 0.95, -0.25]}
          name="KAELEN"
          role="AGI Futures AI Builder Guide (14-Day Experiments)"
          color="#34d399"
          onClick={() => onOpenIdeaDrawer(activeIdea)}
        />
      </group>

      {/* 5B. Founder Matching Wall ([+13.2, 0, +5.0]) */}
      <group
        position={[13.2, 0, 5.0]}
        rotation={[0, -Math.PI / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectWaypoint("agi-matching-wall");
          onOpenMatchingDrawer();
        }}
      >
        <RoundedBox
          args={[5.6, 3.8, 0.35]}
          radius={0.1}
          position={[0, 1.9, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            map={pbr.walnutMap}
            normalMap={pbr.walnutNormal}
            roughness={0.3}
          />
        </RoundedBox>

        {/* 6 Glowing Holographic Builder Intention Cards */}
        {[-1.7, 0, 1.7].map((cx, col) =>
          [1.25, 2.25].map((cy, row) => (
            <group key={`${col}-${row}`} position={[cx, cy, 0.2]}>
              <mesh>
                <planeGeometry args={[1.45, 0.78]} />
                <meshBasicMaterial
                  color={
                    (col + row) % 2 === 0
                      ? new THREE.Color(0.2, 1.8, 1.1)
                      : new THREE.Color(1.8, 1.3, 0.4)
                  }
                  transparent
                  opacity={0.38}
                  toneMapped={false}
                />
              </mesh>
            </group>
          ))
        )}

        <Text
          position={[0, 3.3, 0.22]}
          fontSize={0.28}
          letterSpacing={0.12}
          color="#6ee7b7"
          anchorX="center"
          anchorY="middle"
        >
          FOUNDER MATCHING WALL
        </Text>
        <Text
          position={[0, 2.95, 0.22]}
          fontSize={0.15}
          letterSpacing={0.14}
          color="#fef3c7"
          anchorX="center"
          anchorY="middle"
        >
          BUILDING • LOOKING FOR • CAN HELP WITH — CLICK TO CONNECT
        </Text>
      </group>
    </group>
  );
}
