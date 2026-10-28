"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { PbrTextureSet } from "@/lib/spatial/pbr-materials";

/**
 * Multi-segment curved cream bouclé luxury sectional sofa with walnut outer shell,
 * brushed brass plinth, warm under-seat LED cove lighting, and throw pillows.
 */
export function CurvedBoucleSectionalSofa({
  radius = 3.6,
  arcAngle = Math.PI * 0.72,
  startAngle = -Math.PI * 0.36,
  segments = 7,
  accentColor = "#d97706",
  pbr,
}: {
  radius?: number;
  arcAngle?: number;
  startAngle?: number;
  segments?: number;
  accentColor?: string;
  pbr: PbrTextureSet;
}) {
  const cushionItems = useMemo(() => {
    const arr = [];
    const step = arcAngle / segments;
    for (let i = 0; i < segments; i++) {
      const a = startAngle + (i + 0.5) * step;
      const x = Math.sin(a) * radius;
      const z = Math.cos(a) * radius;
      arr.push({
        key: i,
        position: [x, 0, z] as [number, number, number],
        rotation: [0, a + Math.PI, 0] as [number, number, number],
        hasPillow: i % 2 === 1,
      });
    }
    return arr;
  }, [radius, arcAngle, startAngle, segments]);

  return (
    <group>
      {/* Continuous curved walnut outer shell & brushed brass plinth */}
      <mesh position={[0, 0.36, 0]} castShadow receiveShadow>
        <cylinderGeometry
          args={[
            radius + 0.46,
            radius + 0.48,
            0.72,
            40,
            1,
            true,
            startAngle,
            arcAngle,
          ]}
        />
        <meshPhysicalMaterial
          map={pbr.walnutMap}
          normalMap={pbr.walnutNormal}
          roughnessMap={pbr.walnutRoughness}
          roughness={0.32}
          clearcoat={0.45}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Under-sofa warm LED cove light strip */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry
          args={[
            radius - 0.38,
            radius - 0.38,
            0.05,
            36,
            1,
            true,
            startAngle,
            arcAngle,
          ]}
        />
        <meshBasicMaterial
          color={new THREE.Color(2.4, 1.55, 0.65)}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Individual sculpted cream bouclé seat cushions, backrests, and pillows */}
      {cushionItems.map((c) => (
        <group key={c.key} position={c.position} rotation={c.rotation}>
          {/* Seat base cushion */}
          <RoundedBox
            args={[0.92, 0.28, 0.86]}
            radius={0.09}
            smoothness={4}
            position={[0, 0.26, 0]}
            castShadow
            receiveShadow
          >
            <meshPhysicalMaterial
              map={pbr.boucleMap}
              normalMap={pbr.boucleNormal}
              color="#f8f1e5"
              roughness={0.78}
              sheen={1.0}
              sheenRoughness={0.5}
              sheenColor="#fff8ed"
            />
          </RoundedBox>

          {/* Curved backrest bolster */}
          <RoundedBox
            args={[0.94, 0.48, 0.26]}
            radius={0.11}
            smoothness={4}
            position={[0, 0.56, -0.3]}
            rotation={[-0.12, 0, 0]}
            castShadow
            receiveShadow
          >
            <meshPhysicalMaterial
              map={pbr.boucleMap}
              normalMap={pbr.boucleNormal}
              color="#f4ead8"
              roughness={0.75}
              sheen={1.0}
              sheenRoughness={0.5}
              sheenColor="#fff8ed"
            />
          </RoundedBox>

          {/* Accent throw pillow */}
          {c.hasPillow && (
            <RoundedBox
              args={[0.36, 0.32, 0.14]}
              radius={0.06}
              smoothness={3}
              position={[0.12, 0.52, -0.12]}
              rotation={[-0.25, 0.22, 0.08]}
              castShadow
            >
              <meshPhysicalMaterial
                color={accentColor}
                roughness={0.65}
                sheen={0.9}
                sheenColor="#ffffff"
              />
            </RoundedBox>
          )}
        </group>
      ))}
    </group>
  );
}

/**
 * Recessed circular conversation pit with stepped travertine-and-brass stairs,
 * transparent structural glass floor looking straight down at Earth, brass diagrid beams,
 * twin curved bouclé sectional sofas, coffee table, lanterns, and clickable focus.
 */
export function SunkenGlassFloorLoungePit({
  position,
  radius = 5.2,
  accentColor = "#d97706",
  pbr,
  onSelect,
}: {
  position: [number, number, number];
  radius?: number;
  accentColor?: string;
  pbr: PbrTextureSet;
  onSelect?: () => void;
}) {
  return (
    <group position={position} onClick={(e) => {
      if (onSelect) {
        e.stopPropagation();
        onSelect();
      }
    }}>
      {/* Outer Rim Brushed Brass Guard Ring & Cove Step */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[radius - 0.15, radius + 0.35, 64]} />
        <meshStandardMaterial
          color="#d4af37"
          normalMap={pbr.brassNormal}
          metalness={0.9}
          roughness={0.22}
        />
      </mesh>

      {/* Recessed Travertine Pit Wall Cylinder */}
      <mesh position={[0, -0.42, 0]} receiveShadow>
        <cylinderGeometry args={[radius, radius, 0.84, 64, 1, true]} />
        <meshStandardMaterial
          map={pbr.travertineMap}
          normalMap={pbr.travertineNormal}
          roughnessMap={pbr.travertineRoughness}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Intermediate Step Ring + Warm LED Step Cove */}
      <mesh position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[radius - 0.65, radius, 64]} />
        <meshStandardMaterial
          map={pbr.travertineMap}
          normalMap={pbr.travertineNormal}
          roughness={0.28}
        />
      </mesh>
      <mesh position={[0, -0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.68, radius - 0.63, 64]} />
        <meshBasicMaterial
          color={new THREE.Color(2.6, 1.75, 0.78)}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Transparent Structural Earth-Glass Floor Oculus (y = -0.82) */}
      <mesh position={[0, -0.82, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[radius - 0.62, 64]} />
        <meshPhysicalMaterial
          color="#ccf2ff"
          transmission={0.92}
          transparent
          opacity={0.32}
          roughness={0.05}
          metalness={0.08}
          ior={1.52}
          reflectivity={0.9}
          clearcoat={1.0}
        />
      </mesh>

      {/* Structural Brushed Brass Diagrid Beams Under the Glass Floor */}
      {[-2.2, 0, 2.2].map((offset, idx) => (
        <React.Fragment key={idx}>
          <mesh position={[offset, -0.86, 0]}>
            <boxGeometry args={[0.09, 0.08, (radius - 0.7) * 1.85]} />
            <meshStandardMaterial
              color="#c8a248"
              metalness={0.92}
              roughness={0.22}
            />
          </mesh>
          <mesh position={[0, -0.86, offset]}>
            <boxGeometry args={[(radius - 0.7) * 1.85, 0.08, 0.09]} />
            <meshStandardMaterial
              color="#c8a248"
              metalness={0.92}
              roughness={0.22}
            />
          </mesh>
        </React.Fragment>
      ))}

      {/* Inner Pit Glowing Perimeter Halo Ring */}
      <mesh position={[0, -0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.7, radius - 0.62, 64]} />
        <meshBasicMaterial
          color={new THREE.Color(2.5, 1.7, 0.75)}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Twin Opposing Curved Bouclé Sectional Sofas Inside the Pit */}
      <group position={[0, -0.82, 0]}>
        <CurvedBoucleSectionalSofa
          radius={radius - 1.55}
          arcAngle={Math.PI * 0.74}
          startAngle={-Math.PI * 0.37}
          segments={7}
          accentColor={accentColor}
          pbr={pbr}
        />
        <CurvedBoucleSectionalSofa
          radius={radius - 1.55}
          arcAngle={Math.PI * 0.74}
          startAngle={Math.PI * 0.63}
          segments={7}
          accentColor={accentColor}
          pbr={pbr}
        />

        {/* Central Circular Travertine, Walnut & Brass Coffee Table */}
        <group position={[0, 0, 0]}>
          {/* Brushed brass pedestal base */}
          <mesh position={[0, 0.18, 0]} castShadow>
            <cylinderGeometry args={[0.65, 0.85, 0.36, 32]} />
            <meshStandardMaterial
              color="#d4af37"
              normalMap={pbr.brassNormal}
              metalness={0.92}
              roughness={0.22}
            />
          </mesh>
          {/* Honed travertine table top */}
          <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1.45, 1.45, 0.08, 48]} />
            <meshPhysicalMaterial
              map={pbr.travertineMap}
              normalMap={pbr.travertineNormal}
              roughness={0.16}
              clearcoat={0.6}
            />
          </mesh>
          {/* Warm glowing table lanterns */}
          {[-0.45, 0.48].map((lx, i) => (
            <group key={i} position={[lx, 0.42, i === 0 ? -0.25 : 0.3]}>
              <mesh position={[0, 0.04, 0]}>
                <cylinderGeometry args={[0.1, 0.12, 0.08, 16]} />
                <meshStandardMaterial color="#c8a248" metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh position={[0, 0.16, 0]}>
                <sphereGeometry args={[0.11, 16, 16]} />
                <meshBasicMaterial
                  color={new THREE.Color(3.0, 2.0, 0.9)}
                  toneMapped={false}
                />
              </mesh>
            </group>
          ))}
          {/* Center sculptural bonsai planter bowl */}
          <mesh position={[0, 0.46, 0.05]}>
            <cylinderGeometry args={[0.28, 0.2, 0.12, 24]} />
            <meshStandardMaterial color="#3d2314" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.62, 0.05]}>
            <dodecahedronGeometry args={[0.26, 1]} />
            <meshStandardMaterial color="#15803d" roughness={0.75} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/**
 * Lush biophilic architectural planter bed with curved travertine/brass curb,
 * sculpted organic canopy tree, tropical broadleaf clusters, and warm uplighting.
 */
export function BiophilicPlanterTree({
  position,
  scale = 1.0,
  pbr,
}: {
  position: [number, number, number];
  scale?: number;
  pbr: PbrTextureSet;
}) {
  return (
    <group position={position} scale={scale}>
      {/* Sculpted Travertine & Brass Planter Curb */}
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.65, 1.5, 0.56, 32]} />
        <meshStandardMaterial
          map={pbr.travertineMap}
          normalMap={pbr.travertineNormal}
          roughness={0.35}
        />
      </mesh>
      <mesh position={[0, 0.57, 0]}>
        <torusGeometry args={[1.62, 0.045, 12, 48]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.22} />
      </mesh>
      {/* Dark rich soil bed */}
      <mesh position={[0, 0.52, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.56, 32]} />
        <meshStandardMaterial color="#1c140d" roughness={0.95} />
      </mesh>
      {/* Warm soil uplight ring */}
      <mesh position={[0, 0.54, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.62, 24]} />
        <meshBasicMaterial
          color={new THREE.Color(2.4, 1.65, 0.7)}
          toneMapped={false}
        />
      </mesh>

      {/* Multi-stem sculpted wooden trunks */}
      <mesh position={[0, 1.75, 0]} rotation={[0.08, 0, -0.06]} castShadow>
        <cylinderGeometry args={[0.14, 0.24, 2.6, 12]} />
        <meshStandardMaterial
          map={pbr.walnutMap}
          normalMap={pbr.walnutNormal}
          roughness={0.7}
        />
      </mesh>
      <mesh position={[0.35, 1.5, 0.2]} rotation={[-0.18, 0.2, 0.25]} castShadow>
        <cylinderGeometry args={[0.09, 0.15, 2.1, 10]} />
        <meshStandardMaterial
          map={pbr.walnutMap}
          normalMap={pbr.walnutNormal}
          roughness={0.7}
        />
      </mesh>
      <mesh position={[-0.32, 1.55, -0.18]} rotation={[0.15, -0.2, -0.28]} castShadow>
        <cylinderGeometry args={[0.09, 0.15, 2.2, 10]} />
        <meshStandardMaterial
          map={pbr.walnutMap}
          normalMap={pbr.walnutNormal}
          roughness={0.7}
        />
      </mesh>

      {/* Layered Biophilic Canopy Clusters */}
      {[
        { pos: [0, 3.1, 0], r: 1.25, col: "#14532d" },
        { pos: [0.85, 2.75, 0.45], r: 0.95, col: "#166534" },
        { pos: [-0.8, 2.8, -0.4], r: 0.98, col: "#15803d" },
        { pos: [0.3, 3.45, -0.65], r: 0.88, col: "#166534" },
        { pos: [-0.45, 2.55, 0.75], r: 0.82, col: "#14532d" },
      ].map((leaf, i) => (
        <mesh
          key={i}
          position={leaf.pos as [number, number, number]}
          scale={[1.25, 0.72, 1.25]}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[leaf.r, 1]} />
          <meshStandardMaterial
            color={leaf.col}
            roughness={0.62}
            metalness={0.05}
          />
        </mesh>
      ))}

      {/* Low tropical shrub base around trunk */}
      {[0, 1, 2, 3, 4, 5].map((idx) => {
        const a = (idx / 6) * Math.PI * 2;
        return (
          <mesh
            key={idx}
            position={[Math.cos(a) * 0.95, 0.72, Math.sin(a) * 0.95]}
            scale={[1.1, 0.65, 1.1]}
            castShadow
          >
            <dodecahedronGeometry args={[0.45, 1]} />
            <meshStandardMaterial color="#15803d" roughness={0.68} />
          </mesh>
        );
      })}
    </group>
  );
}

/**
 * Swept Bionic Structural Rib curving from the outer hull floor up into the vaulted ceiling oculus,
 * complete with an inner HDR-blooming warm golden LED cove channel.
 */
export function SweptBionicRib({
  angle,
  outerRadius = 21.5,
  innerTopRadius = 9.0,
  height = 14.2,
  pbr,
}: {
  angle: number;
  outerRadius?: number;
  innerTopRadius?: number;
  height?: number;
  pbr: PbrTextureSet;
}) {
  const { ribGeo, coveGeo } = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, outerRadius),
      new THREE.Vector3(0, height * 0.32, outerRadius + 1.1),
      new THREE.Vector3(0, height * 0.72, outerRadius - 2.8),
      new THREE.Vector3(0, height, innerTopRadius),
    ]);

    const coveCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.4, outerRadius - 0.42),
      new THREE.Vector3(0, height * 0.32, outerRadius + 0.64),
      new THREE.Vector3(0, height * 0.72, outerRadius - 3.22),
      new THREE.Vector3(0, height - 0.15, innerTopRadius - 0.25),
    ]);

    return {
      ribGeo: new THREE.TubeGeometry(curve, 36, 0.44, 12, false),
      coveGeo: new THREE.TubeGeometry(coveCurve, 36, 0.085, 8, false),
    };
  }, [outerRadius, innerTopRadius, height]);

  return (
    <group rotation={[0, angle, 0]}>
      <mesh geometry={ribGeo} castShadow receiveShadow>
        <meshStandardMaterial
          map={pbr.travertineMap}
          normalMap={pbr.travertineNormal}
          roughnessMap={pbr.travertineRoughness}
          roughness={0.28}
        />
      </mesh>
      <mesh geometry={coveGeo}>
        <meshBasicMaterial
          color={new THREE.Color(2.65, 1.82, 0.85)}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/**
 * Outward-protruding spherical glass Earthview Bubble Pod suspended past the hull rim,
 * complete with glass boarding bridge, curved walnut zero-G focus desk, holographic monitor,
 * ergonomic bouclé chair, and warm brass halo rings.
 */
export function EarthviewBubblePodModule({
  position,
  rotationY = 0,
  label,
  isSelected,
  pbr,
  onSelect,
}: {
  position: [number, number, number];
  rotationY?: number;
  label: string;
  isSelected?: boolean;
  pbr: PbrTextureSet;
  onSelect: () => void;
}) {
  const podRadius = 3.1;

  return (
    <group
      position={position}
      rotation={[0, rotationY, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Glass & Brushed Brass Boarding Bridge connecting hull to pod (+Z side of pod) */}
      <group position={[0, -0.95, podRadius + 1.1]}>
        <mesh receiveShadow>
          <boxGeometry args={[2.1, 0.12, 2.6]} />
          <meshPhysicalMaterial
            color="#d8f3ff"
            transmission={0.85}
            transparent
            opacity={0.45}
            roughness={0.08}
            ior={1.5}
          />
        </mesh>
        {[-1.02, 1.02].map((bx, i) => (
          <group key={i} position={[bx, 0.5, 0]}>
            <mesh>
              <boxGeometry args={[0.06, 0.95, 2.6]} />
              <meshPhysicalMaterial
                color="#e0f2fe"
                transmission={0.88}
                transparent
                opacity={0.3}
                roughness={0.05}
              />
            </mesh>
            <mesh position={[0, 0.48, 0]}>
              <boxGeometry args={[0.09, 0.06, 2.65]} />
              <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.2} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Outer Transparent Spherical Biosphere Glass Shell */}
      <mesh>
        <sphereGeometry args={[podRadius, 48, 48]} />
        <meshPhysicalMaterial
          color="#e0f7ff"
          transmission={0.93}
          transparent
          opacity={0.26}
          roughness={0.04}
          metalness={0.05}
          ior={1.48}
          reflectivity={0.92}
          clearcoat={1.0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Twin Sculpted Brushed-Brass Structural Gimbal Rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[podRadius + 0.03, 0.08, 16, 64]} />
        <meshStandardMaterial
          color="#d4af37"
          normalMap={pbr.brassNormal}
          metalness={0.92}
          roughness={0.2}
        />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[podRadius + 0.03, 0.07, 16, 64]} />
        <meshStandardMaterial
          color="#d4af37"
          normalMap={pbr.brassNormal}
          metalness={0.92}
          roughness={0.2}
        />
      </mesh>

      {/* Glowing Warm Halo Ring Around Pod Equator */}
      <mesh position={[0, -0.92, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[podRadius - 0.18, 0.04, 12, 64]} />
        <meshBasicMaterial
          color={
            isSelected
              ? new THREE.Color(0.4, 2.8, 3.2)
              : new THREE.Color(2.6, 1.8, 0.85)
          }
          toneMapped={false}
        />
      </mesh>

      {/* Interior Circular Travertine & Walnut Deck Platform (y = -0.95) */}
      <mesh position={[0, -0.98, 0]} receiveShadow>
        <cylinderGeometry args={[podRadius - 0.25, podRadius - 0.4, 0.16, 48]} />
        <meshStandardMaterial
          map={pbr.travertineMap}
          normalMap={pbr.travertineNormal}
          roughness={0.22}
        />
      </mesh>

      {/* Curved American Walnut Zero-G Focus Desk Facing Earth (-Z) */}
      <group position={[0, -0.9, -0.65]}>
        <mesh position={[0, 0.74, -0.55]} castShadow receiveShadow>
          <cylinderGeometry
            args={[1.65, 1.65, 0.07, 32, 1, false, -Math.PI * 0.35, Math.PI * 0.7]}
          />
          <meshPhysicalMaterial
            map={pbr.walnutMap}
            normalMap={pbr.walnutNormal}
            roughness={0.25}
            clearcoat={0.55}
          />
        </mesh>
        {/* Brushed brass desk legs */}
        {[-0.95, 0.95].map((lx, i) => (
          <mesh key={i} position={[lx, 0.37, -0.85]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.74, 12]} />
            <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.2} />
          </mesh>
        ))}

        {/* Floating Transparent Holographic Focus Telemetry Display */}
        <mesh position={[0, 1.08, -1.15]} rotation={[0.08, 0, 0]}>
          <planeGeometry args={[1.05, 0.46]} />
          <meshBasicMaterial
            color={new THREE.Color(0.35, 1.9, 2.4)}
            transparent
            opacity={0.42}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>

        {/* Warm Brass Desk Lamp */}
        <group position={[0.75, 0.78, -0.85]}>
          <mesh position={[0, 0.14, 0]}>
            <cylinderGeometry args={[0.02, 0.05, 0.28, 12]} />
            <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.28, 0]}>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshBasicMaterial
              color={new THREE.Color(2.9, 2.0, 0.9)}
              toneMapped={false}
            />
          </mesh>
        </group>

        {/* Ergonomic Cream Bouclé Lounge Chair */}
        <group position={[0, 0, 0.15]}>
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.04, 0.26, 0.44, 16]} />
            <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.22} />
          </mesh>
          <RoundedBox
            args={[0.68, 0.14, 0.64]}
            radius={0.06}
            position={[0, 0.46, 0]}
            castShadow
          >
            <meshPhysicalMaterial
              map={pbr.boucleMap}
              normalMap={pbr.boucleNormal}
              color="#f8f1e5"
              roughness={0.75}
              sheen={1.0}
            />
          </RoundedBox>
          <RoundedBox
            args={[0.66, 0.62, 0.14]}
            radius={0.06}
            position={[0, 0.8, 0.26]}
            rotation={[0.15, 0, 0]}
            castShadow
          >
            <meshPhysicalMaterial
              map={pbr.boucleMap}
              normalMap={pbr.boucleNormal}
              color="#f8f1e5"
              roughness={0.75}
              sheen={1.0}
            />
          </RoundedBox>
        </group>
      </group>

      {/* Subtle 3D Pod Designation Plaque on Boarding Arch */}
      <Text
        position={[0, 1.45, podRadius - 0.1]}
        fontSize={0.22}
        color="#fde68a"
        anchorX="center"
        anchorY="middle"
      >
        {label.toUpperCase()}
      </Text>
    </group>
  );
}

/**
 * Animated 3D Holographic AI Resident Avatar (Bartender / Sora / Kaelen)
 */
export function HolographicResidentAvatar({
  position,
  name,
  role,
  color = "#38bdf8",
  onClick,
}: {
  position: [number, number, number];
  name: string;
  role: string;
  color?: string;
  onClick?: () => void;
}) {
  const ringRef = useRef<THREE.Group | null>(null);
  const holoColor = useMemo(() => new THREE.Color(color).multiplyScalar(2.2), [color]);

  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.y = clock.getElapsedTime() * 0.8;
    }
  });

  return (
    <group
      position={position}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
    >
      {/* Brushed Brass Hologram Emitter Pedestal */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.42, 0.5, 0.12, 32]} />
        <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.13, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.36, 32]} />
        <meshBasicMaterial color={holoColor} toneMapped={false} />
      </mesh>

      {/* Sculpted Luminous Holographic Silhouette */}
      <group position={[0, 0.2, 0]}>
        {/* Lower projection cone */}
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.24, 0.08, 1.1, 24, 1, true]} />
          <meshBasicMaterial
            color={holoColor}
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
        {/* Sculpted torso */}
        <mesh position={[0, 1.15, 0]}>
          <capsuleGeometry args={[0.2, 0.45, 12, 24]} />
          <meshBasicMaterial
            color={holoColor}
            wireframe
            transparent
            opacity={0.55}
            toneMapped={false}
          />
        </mesh>
        {/* Holographic head */}
        <mesh position={[0, 1.72, 0]}>
          <sphereGeometry args={[0.15, 20, 20]} />
          <meshBasicMaterial
            color={holoColor}
            transparent
            opacity={0.78}
            toneMapped={false}
          />
        </mesh>

        {/* Orbiting data rings */}
        <group ref={ringRef} position={[0, 1.25, 0]}>
          <mesh rotation={[0.4, 0, 0]}>
            <torusGeometry args={[0.44, 0.012, 8, 48]} />
            <meshBasicMaterial color={holoColor} toneMapped={false} />
          </mesh>
          <mesh rotation={[-0.5, 0.6, 0]}>
            <torusGeometry args={[0.52, 0.01, 8, 48]} />
            <meshBasicMaterial color={holoColor} toneMapped={false} />
          </mesh>
        </group>

        {/* Floating 3D Nameplate */}
        <Text
          position={[0, 2.15, 0]}
          fontSize={0.16}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {name}
        </Text>
        <Text
          position={[0, 1.96, 0]}
          fontSize={0.11}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          {role}
        </Text>
      </group>
    </group>
  );
}

/**
 * Monumental Sculpted Portal Archway with 3D Radiant Typography (LEVL / AGI FUTURES)
 */
export function ArchitecturalPortalArchway({
  position,
  rotationY,
  title,
  subtitle,
  neonColor,
  pbr,
  onEnter,
}: {
  position: [number, number, number];
  rotationY: number;
  title: string;
  subtitle: string;
  neonColor: [number, number, number];
  pbr: PbrTextureSet;
  onEnter: () => void;
}) {
  const hdrColor = useMemo(
    () => new THREE.Color(neonColor[0], neonColor[1], neonColor[2]),
    [neonColor]
  );

  return (
    <group
      position={position}
      rotation={[0, rotationY, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onEnter();
      }}
    >
      {/* Left & Right Sculpted Travertine & Fluted Alabaster Columns */}
      {[-4.6, 4.6].map((px, i) => (
        <group key={i} position={[px, 0, 0]}>
          <mesh position={[0, 3.6, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.62, 0.78, 7.2, 24]} />
            <meshStandardMaterial
              map={pbr.travertineMap}
              normalMap={pbr.travertineNormal}
              roughness={0.28}
            />
          </mesh>
          {/* Vertical neon cove strip inside column */}
          <mesh position={[i === 0 ? 0.58 : -0.58, 3.6, 0]}>
            <boxGeometry args={[0.08, 6.8, 0.14]} />
            <meshBasicMaterial color={hdrColor} toneMapped={false} />
          </mesh>
        </group>
      ))}

      {/* Curved Overhead Portal Entablature & Brushed Brass Arch */}
      <RoundedBox
        args={[10.8, 1.35, 1.4]}
        radius={0.28}
        smoothness={4}
        position={[0, 7.4, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          map={pbr.walnutMap}
          normalMap={pbr.walnutNormal}
          roughness={0.28}
        />
      </RoundedBox>

      {/* Glowing Neon Frame Tubes Around Header */}
      <mesh position={[0, 6.72, 0.72]}>
        <boxGeometry args={[9.8, 0.07, 0.07]} />
        <meshBasicMaterial color={hdrColor} toneMapped={false} />
      </mesh>
      <mesh position={[0, 8.05, 0.72]}>
        <boxGeometry args={[9.8, 0.07, 0.07]} />
        <meshBasicMaterial color={hdrColor} toneMapped={false} />
      </mesh>

      {/* Front & Back 3D Radiant Typography */}
      {[0.74, -0.74].map((zOffset, idx) => (
        <group
          key={idx}
          position={[0, 7.42, zOffset]}
          rotation={[0, idx === 1 ? Math.PI : 0, 0]}
        >
          <Text
            position={[0, 0.12, 0]}
            fontSize={0.72}
            letterSpacing={0.14}
            color={hdrColor}
            anchorX="center"
            anchorY="middle"
          >
            {title}
          </Text>
          <Text
            position={[0, -0.38, 0]}
            fontSize={0.2}
            letterSpacing={0.2}
            color="#fef3c7"
            anchorX="center"
            anchorY="middle"
          >
            {subtitle}
          </Text>
        </group>
      ))}
    </group>
  );
}
