"use client";

import React, { useMemo } from "react";
import { MeshReflectorMaterial, Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { PbrTextureSet } from "@/lib/spatial/pbr-materials";
import {
  BiophilicPlanterTree,
  HolographicResidentAvatar,
  SunkenGlassFloorLoungePit,
  SweptBionicRib,
} from "./SharedArchitecturalPieces";
import { QualityTier } from "../OrbitalCanvas";

interface LevlLongevityWingProps {
  pbr: PbrTextureSet;
  qualityTier: QualityTier;
  onSelectWaypoint: (id: string) => void;
  onOpenLevlDrawer: (modalitySlug?: string) => void;
  onOpenScreeningModal: () => void;
  onFloorClick?: (point: THREE.Vector3) => void;
}

export function LevlLongevityWing({
  pbr,
  qualityTier,
  onSelectWaypoint,
  onOpenLevlDrawer,
  onOpenScreeningModal,
  onFloorClick,
}: LevlLongevityWingProps) {
  // Floor shape centered at [-35, 0, 0] with radius 16.5m and a central 4.5m hole for the sunken Earth-glass pit
  const levlFloorGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, 16.6, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.absarc(0, 0, 4.45, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    return new THREE.ShapeGeometry(shape, 64);
  }, []);

  // Bionic ribs around the LEVL rotunda (leaving the East +X portal connection to the Atrium open)
  const ribAngles = useMemo(() => {
    const arr: number[] = [];
    const total = 12;
    for (let i = 0; i < total; i++) {
      const a = (i / total) * Math.PI * 2;
      // Skip East (+X -> sin(a) ~ 1) where the Atrium portal connects
      if (Math.sin(a) > 0.78) continue;
      arr.push(a);
    }
    return arr;
  }, []);

  return (
    <group position={[-35, 0, 0]} name="levl-longevity-wing">
      {/* =================================================================== */}
      {/* 1. MIRROR-HONED TRAVERTINE FLOOR WITH CENTRAL SUNKEN PIT CUTOUT     */}
      {/* =================================================================== */}
      <mesh
        geometry={levlFloorGeo}
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
          />
        ) : (
          <MeshReflectorMaterial
            mirror={0.46}
            blur={[280, 80]}
            resolution={qualityTier === "high" ? 1024 : 512}
            mixBlur={0.82}
            mixStrength={1.3}
            roughness={0.24}
            metalness={0.12}
            color="#eef5f3"
            map={pbr.travertineMap}
            normalMap={pbr.travertineNormal}
            normalScale={new THREE.Vector2(0.3, 0.3)}
            roughnessMap={pbr.travertineRoughness}
          />
        )}
      </mesh>

      {/* Connecting Promenade Bridge Deck Between Atrium (-20.8) and LEVL Wing (-18.4) */}
      <mesh
        position={[14.2, 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[8.5, 9.2]} />
        <meshStandardMaterial
          map={pbr.travertineMap}
          normalMap={pbr.travertineNormal}
          roughness={0.24}
        />
      </mesh>

      {/* Perimeter Cyan-Teal & Warm Gold Floor Cove Ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[16.25, 16.55, 72]} />
        <meshBasicMaterial
          color={new THREE.Color(0.25, 2.8, 2.5)}
          toneMapped={false}
        />
      </mesh>

      {/* =================================================================== */}
      {/* 2. CENTRAL SUNKEN EARTH-GLASS RECOVERY CONVERSATION PIT             */}
      {/* =================================================================== */}
      <SunkenGlassFloorLoungePit
        position={[0, 0, 0]}
        radius={4.45}
        accentColor="#14b8a6"
        pbr={pbr}
        onSelect={() => onSelectWaypoint("levl-lounge-entry")}
      />

      {/* =================================================================== */}
      {/* 3. 360° SWEPT BIONIC RIBS, BOTANICAL SKYLIGHT & PANORAMIC HULL      */}
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

      {/* Overhead Vaulted Ceiling Ring & Cyan-Gold Botanical Oculus (y = 11.8m) */}
      <group position={[0, 11.8, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[11.2, 0.65, 16, 72]} />
          <meshStandardMaterial
            map={pbr.travertineMap}
            normalMap={pbr.travertineNormal}
            roughness={0.28}
          />
        </mesh>
        <mesh position={[0, -0.38, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[10.7, 0.1, 12, 72]} />
          <meshBasicMaterial
            color={new THREE.Color(0.3, 2.9, 2.6)}
            toneMapped={false}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[6.8, 0.45, 16, 64]} />
          <meshStandardMaterial
            map={pbr.travertineMap}
            normalMap={pbr.travertineNormal}
            roughness={0.28}
          />
        </mesh>
        <mesh position={[0, -0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[6.45, 0.09, 12, 64]} />
          <meshBasicMaterial
            color={new THREE.Color(2.6, 1.85, 0.85)}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* Curved Panoramic Glass Hull Around North, West, and South Perimeter */}
      <mesh position={[0, 5.2, 0]}>
        <cylinderGeometry
          args={[16.6, 16.6, 10.4, 64, 1, true, Math.PI * 0.72, Math.PI * 1.56]}
        />
        <meshPhysicalMaterial
          color="#d8f8ff"
          transmission={0.9}
          transparent
          opacity={0.18}
          roughness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Biophilic Canopy Trees Inside the LEVL Sanctuary */}
      <BiophilicPlanterTree position={[-6.8, 0, -7.2]} scale={0.95} pbr={pbr} />
      <BiophilicPlanterTree position={[6.8, 0, -7.2]} scale={0.95} pbr={pbr} />
      <BiophilicPlanterTree position={[6.8, 0, 7.2]} scale={0.95} pbr={pbr} />

      {/* =================================================================== */}
      {/* 4. WEST WALL (x = -11.5 local / -46.5 world):                       */}
      {/*    LEVL FLUTED ALABASTER PROTOCOL BAR & SORA AI BARTENDER           */}
      {/* =================================================================== */}
      <group
        position={[-11.5, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectWaypoint("levl-protocol-bar");
          onOpenLevlDrawer("zone-2-and-vo2max-training");
        }}
      >
        {/* Curved Backlit Fluted Alabaster Bar Front */}
        <RoundedBox
          args={[9.2, 1.12, 1.25]}
          radius={0.25}
          smoothness={4}
          position={[0, 0.56, 0]}
          castShadow
          receiveShadow
        >
          <meshPhysicalMaterial
            color="#f5fffd"
            normalMap={pbr.flutedNormal}
            roughness={0.22}
            transmission={0.58}
            thickness={1.0}
          />
        </RoundedBox>
        {/* Internal glowing cyan-gold alabaster backlight */}
        <mesh position={[0, 0.54, 0.05]}>
          <boxGeometry args={[8.7, 0.88, 0.95]} />
          <meshBasicMaterial
            color={new THREE.Color(1.8, 2.2, 1.6)}
            toneMapped={false}
          />
        </mesh>
        {/* Polished American Walnut Countertop */}
        <RoundedBox
          args={[9.5, 0.1, 1.45]}
          radius={0.04}
          position={[0, 1.15, 0]}
          castShadow
          receiveShadow
        >
          <meshPhysicalMaterial
            map={pbr.walnutMap}
            normalMap={pbr.walnutNormal}
            roughness={0.2}
            clearcoat={0.6}
          />
        </RoundedBox>
        {/* Brushed Brass Footrail */}
        <mesh position={[0, 0.2, 0.78]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 8.8, 16]} />
          <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.2} />
        </mesh>

        {/* 7 Barstools in Front of the Protocol Bar */}
        {[-3.6, -2.4, -1.2, 0, 1.2, 2.4, 3.6].map((sx, idx) => (
          <group key={idx} position={[sx, 0, 1.35]}>
            <mesh position={[0, 0.38, 0]}>
              <cylinderGeometry args={[0.04, 0.18, 0.76, 12]} />
              <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.78, 0]} castShadow>
              <cylinderGeometry args={[0.25, 0.23, 0.12, 20]} />
              <meshPhysicalMaterial
                map={pbr.boucleMap}
                normalMap={pbr.boucleNormal}
                color="#f8f1e5"
                roughness={0.72}
              />
            </mesh>
          </group>
        ))}

        {/* Back-Bar Illuminated Apothecary Shelving & Glowing Longevity Vials */}
        <group position={[0, 2.6, -1.35]}>
          <RoundedBox args={[8.8, 3.6, 0.48]} radius={0.08} castShadow receiveShadow>
            <meshStandardMaterial
              map={pbr.walnutMap}
              normalMap={pbr.walnutNormal}
              roughness={0.32}
            />
          </RoundedBox>
          {[-0.95, 0, 0.95].map((sy, tier) => (
            <group key={tier} position={[0, sy, 0.26]}>
              <mesh position={[0, -0.18, 0]}>
                <boxGeometry args={[8.1, 0.05, 0.32]} />
                <meshBasicMaterial
                  color={new THREE.Color(0.35, 2.6, 2.3)}
                  toneMapped={false}
                />
              </mesh>
              {/* Glowing apothecary bottles on each shelf */}
              {[-3.2, -2.4, -1.6, -0.8, 0.8, 1.6, 2.4, 3.2].map((bx, bIdx) => (
                <mesh key={bIdx} position={[bx, 0.05, 0]}>
                  <cylinderGeometry args={[0.08, 0.08, 0.34, 12]} />
                  <meshBasicMaterial
                    color={
                      (bIdx + tier) % 2 === 0
                        ? new THREE.Color(0.3, 2.6, 2.4)
                        : new THREE.Color(2.6, 1.8, 0.7)
                    }
                    toneMapped={false}
                  />
                </mesh>
              ))}
            </group>
          ))}

          <Text
            position={[0, 2.25, 0.1]}
            fontSize={0.44}
            letterSpacing={0.14}
            color={new THREE.Color(0.3, 3.0, 2.6)}
            anchorX="center"
            anchorY="middle"
          >
            LEVL LONGEVITY PROTOCOL BAR
          </Text>
          <Text
            position={[0, 1.82, 0.1]}
            fontSize={0.16}
            letterSpacing={0.16}
            color="#fef3c7"
            anchorX="center"
            anchorY="middle"
          >
            MOVEMENT • NUTRITION • COGNITIVE FOCUS • RECOVERY
          </Text>
        </group>

        {/* Sora (LEVL AI Longevity Bartender & Coach) */}
        <HolographicResidentAvatar
          position={[0, 0.95, -0.55]}
          name="SORA"
          role="LEVL Longevity AI Coach (PubMed RCT Grounded)"
          color="#2dd4bf"
          onClick={() => onOpenLevlDrawer("zone-2-and-vo2max-training")}
        />
      </group>

      {/* =================================================================== */}
      {/* 5. NORTH-WEST DECK ([-3.0, 0, -12.8] local):                        */}
      {/*    THERMAL CONDITIONING SUITE — FINNISH SAUNA & COLD PLUNGE         */}
      {/* =================================================================== */}
      <group
        position={[-3.0, 0, -12.8]}
        rotation={[0, 0.15, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectWaypoint("levl-spa-sauna");
          onOpenLevlDrawer("finnish-sauna");
        }}
      >
        {/* Warm Cedar-Slatted Finnish Sauna Chamber */}
        <RoundedBox
          args={[5.2, 3.2, 3.2]}
          radius={0.12}
          position={[-2.2, 1.6, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            map={pbr.walnutMap}
            normalMap={pbr.walnutNormal}
            color="#b46934"
            roughness={0.42}
          />
        </RoundedBox>
        {/* Sauna Glass Front Wall */}
        <mesh position={[-2.2, 1.6, 1.62]}>
          <planeGeometry args={[4.6, 2.8]} />
          <meshPhysicalMaterial
            color="#ffe4c4"
            transmission={0.85}
            transparent
            opacity={0.32}
            roughness={0.08}
          />
        </mesh>
        {/* Glowing Amber Finnish Sauna Heater & Stones */}
        <mesh position={[-2.2, 0.75, 0.6]}>
          <cylinderGeometry args={[0.45, 0.5, 0.9, 20]} />
          <meshBasicMaterial
            color={new THREE.Color(3.2, 1.25, 0.35)}
            toneMapped={false}
          />
        </mesh>

        {/* Illuminated 12°C Cold Plunge Basin */}
        <group position={[2.6, 0, 0.4]}>
          <RoundedBox
            args={[3.4, 0.92, 2.4]}
            radius={0.14}
            position={[0, 0.46, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial
              map={pbr.travertineMap}
              normalMap={pbr.travertineNormal}
              roughness={0.25}
            />
          </RoundedBox>
          {/* Glowing Cryo-Turquoise Plunge Water Surface */}
          <mesh position={[0, 0.88, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.9, 1.9]} />
            <meshBasicMaterial
              color={new THREE.Color(0.25, 2.4, 2.9)}
              toneMapped={false}
            />
          </mesh>
        </group>

        <Text
          position={[0, 3.55, 1.2]}
          fontSize={0.24}
          letterSpacing={0.12}
          color="#fde68a"
          anchorX="center"
          anchorY="middle"
        >
          FINNISH SAUNA (80°C+) & COLD PLUNGE (12°C) SUITE
        </Text>
      </group>

      {/* =================================================================== */}
      {/* 6. SOUTH-WEST DECK ([-9.0, 0, 11.8] local):                         */}
      {/*    HBOT HYPERBARIC (2.0 ATA) & 660nm PHOTOBIOMODULATION ALCOVE      */}
      {/* =================================================================== */}
      <group
        position={[-8.8, 0, 11.2]}
        rotation={[0, 2.45, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectWaypoint("levl-spa-hbot");
          onOpenLevlDrawer("hyperbaric-oxygen-therapy");
        }}
      >
        {/* Horizontal Cylindrical Glass & Brass 2.0 ATA Hyperbaric Chamber */}
        <mesh position={[-1.4, 1.35, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[1.15, 1.15, 3.8, 36]} />
          <meshPhysicalMaterial
            color="#d8f8ff"
            transmission={0.86}
            transparent
            opacity={0.38}
            roughness={0.06}
            ior={1.5}
          />
        </mesh>
        {[-3.1, -1.4, 0.3].map((hx, i) => (
          <mesh key={i} position={[hx, 1.35, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[1.18, 0.08, 12, 48]} />
            <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.2} />
          </mesh>
        ))}

        {/* 660nm / 850nm Red & Near-Infrared Photobiomodulation Light Array */}
        <group position={[2.4, 1.6, 0]}>
          <RoundedBox args={[2.2, 2.8, 0.32]} radius={0.08} castShadow>
            <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
          </RoundedBox>
          {[-0.65, 0, 0.65].map((px, i) => (
            <mesh key={i} position={[px, 0, 0.18]}>
              <boxGeometry args={[0.42, 2.3, 0.04]} />
              <meshBasicMaterial
                color={new THREE.Color(3.4, 0.28, 0.38)}
                toneMapped={false}
              />
            </mesh>
          ))}
        </group>

        <Text
          position={[0.2, 3.35, 0.5]}
          fontSize={0.22}
          letterSpacing={0.12}
          color="#fca5a5"
          anchorX="center"
          anchorY="middle"
        >
          2.0 ATA HBOT & 660nm PHOTOBIOMODULATION
        </Text>
      </group>

      {/* =================================================================== */}
      {/* 7. SOUTH-EAST WALL ([+2.0, 0, 13.8] local / [-33, 0, 13.8] world):  */}
      {/*    LEVL RESEARCH SCREENING WALL (LIVING LONGER • LIVING BETTER)     */}
      {/* =================================================================== */}
      <group
        position={[2.0, 0, 13.8]}
        rotation={[0, Math.PI, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectWaypoint("levl-screening-wall");
          onOpenScreeningModal();
        }}
      >
        {/* Walnut Acoustic Slat Backdrop Wall */}
        <RoundedBox
          args={[7.8, 4.4, 0.38]}
          radius={0.08}
          position={[0, 2.2, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            map={pbr.walnutMap}
            normalMap={pbr.walnutNormal}
            roughness={0.32}
          />
        </RoundedBox>

        {/* Glowing Cinema Screen Frame */}
        <mesh position={[0, 2.35, 0.22]}>
          <planeGeometry args={[6.4, 3.3]} />
          <meshBasicMaterial
            color={new THREE.Color(0.12, 0.42, 0.52)}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, 2.35, 0.21]}>
          <planeGeometry args={[6.56, 3.46]} />
          <meshBasicMaterial
            color={new THREE.Color(0.3, 2.8, 2.5)}
            toneMapped={false}
          />
        </mesh>

        <Text
          position={[0, 2.75, 0.26]}
          fontSize={0.34}
          letterSpacing={0.12}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          LEVL RESEARCH SCREENING WALL
        </Text>
        <Text
          position={[0, 2.2, 0.26]}
          fontSize={0.2}
          letterSpacing={0.16}
          color="#5eead4"
          anchorX="center"
          anchorY="middle"
        >
          LIVING LONGER • LIVING BETTER — CLICK TO WATCH TALKS
        </Text>
        <Text
          position={[0, 1.72, 0.26]}
          fontSize={0.14}
          color="#cbd5e1"
          anchorX="center"
          anchorY="middle"
        >
          Auto-ducks Orbital DJ audio while screening clinical trials
        </Text>
      </group>
    </group>
  );
}
