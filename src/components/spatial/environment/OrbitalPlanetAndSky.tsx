"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer, Sparkles } from "@react-three/drei";
import * as THREE from "three";

const EARTH_VERTEX_SHADER = /* glsl */ `
  varying vec3 vNormalWorld;
  varying vec3 vWorldPos;
  varying vec2 vUv;
  varying vec3 vObjectPos;

  void main() {
    vUv = uv;
    vObjectPos = normalize(position);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPosition.xyz;
    vNormalWorld = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const EARTH_FRAGMENT_SHADER = /* glsl */ `
  uniform float uTime;
  uniform vec3 uSunDir;

  varying vec3 vNormalWorld;
  varying vec3 vWorldPos;
  varying vec2 vUv;
  varying vec3 vObjectPos;

  float hash(vec3 p) {
    p = fract(p * vec3(443.897, 441.423, 437.195));
    p += dot(p, p.yzx + 19.19);
    return fract((p.x + p.y) * p.z);
  }

  float noise3D(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(
        mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
        mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x),
        f.y
      ),
      mix(
        mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
        mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x),
        f.y
      ),
      f.z
    );
  }

  float fbm3D(vec3 p) {
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 6; i++) {
      v += amp * noise3D(p);
      p = p * 2.07 + vec3(13.1, 7.7, 19.3);
      amp *= 0.5;
    }
    return v;
  }

  void main() {
    vec3 N = normalize(vNormalWorld);
    vec3 V = normalize(cameraPosition - vWorldPos);
    vec3 L = normalize(uSunDir);

    // Slowly rotating planetary coordinates
    float rotAngle = uTime * 0.008;
    mat3 rotY = mat3(
      cos(rotAngle), 0.0, sin(rotAngle),
      0.0, 1.0, 0.0,
      -sin(rotAngle), 0.0, cos(rotAngle)
    );
    vec3 P = rotY * vObjectPos;

    // Continental domain-warped elevation
    vec3 q = vec3(
      fbm3D(P * 3.2 + vec3(1.2, 3.4, 5.6)),
      fbm3D(P * 3.2 + vec3(8.1, 2.3, 4.7)),
      fbm3D(P * 3.2 + vec3(4.5, 9.2, 1.8))
    );
    float continent = fbm3D(P * 4.2 + q * 1.45);
    float detail = fbm3D(P * 24.0 + q * 2.0);
    float elev = continent * 0.78 + detail * 0.22;

    float seaLevel = 0.49;
    float landMask = smoothstep(seaLevel - 0.015, seaLevel + 0.018, elev);
    float shelfMask = smoothstep(seaLevel - 0.08, seaLevel, elev) * (1.0 - landMask);

    // Ocean colors: abyssal navy -> royal sapphire -> turquoise coastal shelf
    vec3 deepOcean = vec3(0.012, 0.055, 0.175);
    vec3 midOcean = vec3(0.025, 0.14, 0.36);
    vec3 turquoiseShelf = vec3(0.06, 0.48, 0.64);
    vec3 oceanCol = mix(deepOcean, midOcean, smoothstep(0.25, seaLevel, elev));
    oceanCol = mix(oceanCol, turquoiseShelf, shelfMask * 0.85);

    // Land colors: lush coastal emerald -> warm ochre/sienna highlands -> snow peaks
    float arid = smoothstep(0.35, 0.72, noise3D(P * 6.5));
    vec3 lushLand = vec3(0.06, 0.22, 0.12);
    vec3 aridLand = vec3(0.34, 0.24, 0.14);
    vec3 mountainRock = vec3(0.22, 0.20, 0.19);
    vec3 snowPeak = vec3(0.88, 0.92, 0.96);

    vec3 landCol = mix(lushLand, aridLand, arid);
    landCol = mix(landCol, mountainRock, smoothstep(0.60, 0.72, elev));
    landCol = mix(landCol, snowPeak, smoothstep(0.73, 0.82, elev));

    vec3 surfaceAlbedo = mix(oceanCol, landCol, landMask);

    // Cloud layer (animated atmospheric swirls)
    vec3 cloudCoord = P * 5.8 + vec3(uTime * 0.005, -uTime * 0.002, uTime * 0.004);
    float cloudWarp = fbm3D(cloudCoord * 1.4);
    float clouds = fbm3D(cloudCoord * 2.6 + vec3(cloudWarp * 1.3));
    float cloudMask = smoothstep(0.47, 0.68, clouds);

    // Illumination & twilight terminator
    float ndl = dot(N, L);
    float dayFactor = smoothstep(-0.18, 0.32, ndl);
    float twilightBand = smoothstep(-0.22, 0.06, ndl) * (1.0 - smoothstep(0.06, 0.35, ndl));

    // Specular solar ocean reflection (sun glint across orbital water)
    vec3 H = normalize(L + V);
    float spec = pow(max(dot(N, H), 0.0), 96.0) * (1.0 - landMask) * (1.0 - cloudMask * 0.8);
    vec3 sunGlint = vec3(1.35, 1.05, 0.72) * spec * smoothstep(-0.05, 0.4, ndl) * 1.4;

    // Night-side & twilight golden metropolitan city networks
    float metroCluster = smoothstep(0.54, 0.72, noise3D(P * 18.0 + q * 1.2));
    float cityGrid = smoothstep(0.48, 0.76, fbm3D(P * 95.0));
    float highwayWeb = pow(max(0.0, 1.0 - abs(noise3D(P * 52.0) - 0.5) * 14.0), 2.5);
    float coastBonus = smoothstep(seaLevel + 0.14, seaLevel, elev) * landMask;

    float cityIntensity = landMask * (metroCluster * cityGrid * 1.5 + highwayWeb * 0.75) * (0.55 + coastBonus * 0.95);
    float nightVisibility = 1.0 - smoothstep(-0.12, 0.38, ndl);
    float shimmer = 0.88 + 0.12 * sin(uTime * 2.8 + detail * 45.0);
    vec3 cityCol = mix(vec3(1.0, 0.55, 0.15), vec3(1.0, 0.88, 0.52), cityGrid) * cityIntensity * (0.45 + 0.75 * nightVisibility) * shimmer * 2.6;

    // Combine day surface, twilight warmth, and clouds
    vec3 dayLit = surfaceAlbedo * (0.28 + 0.92 * max(ndl, 0.0)) + sunGlint;
    vec3 twilightGlow = vec3(0.95, 0.45, 0.18) * twilightBand * 0.32;
    vec3 cloudColor = mix(vec3(0.14, 0.24, 0.42), vec3(0.98, 0.97, 0.95), dayFactor) + vec3(1.0, 0.62, 0.32) * twilightBand * 0.55;

    vec3 planetColor = mix(surfaceAlbedo * 0.22, dayLit, dayFactor) + twilightGlow;
    planetColor += cityCol * (1.0 - cloudMask * 0.65);
    planetColor = mix(planetColor, cloudColor, cloudMask * 0.78);

    // Rayleigh atmospheric scattering rim on the planet surface
    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.2);
    vec3 rayleigh = mix(vec3(0.12, 0.52, 1.0), vec3(0.98, 0.72, 0.38), twilightBand * 0.65);
    planetColor += rayleigh * fresnel * 0.85;

    gl_FragColor = vec4(planetColor, 1.0);
  }
`;

const ATMOSPHERE_VERTEX_SHADER = /* glsl */ `
  varying vec3 vNormalWorld;
  varying vec3 vWorldPos;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPosition.xyz;
    vNormalWorld = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const ATMOSPHERE_FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uSunDir;
  varying vec3 vNormalWorld;
  varying vec3 vWorldPos;

  void main() {
    vec3 N = normalize(vNormalWorld);
    vec3 V = normalize(cameraPosition - vWorldPos);
    vec3 L = normalize(uSunDir);

    float viewDot = dot(N, -V);
    float rim = pow(clamp(1.0 - abs(viewDot), 0.0, 1.0), 2.6);
    float sunFacing = smoothstep(-0.35, 0.65, dot(N, L));

    vec3 deepBlue = vec3(0.08, 0.46, 0.98);
    vec3 cyanHorizon = vec3(0.28, 0.78, 1.0);
    vec3 goldenSunrise = vec3(1.0, 0.72, 0.35);

    vec3 col = mix(deepBlue, cyanHorizon, rim);
    col = mix(col, goldenSunrise, pow(rim, 3.0) * sunFacing * 0.55);

    float alpha = rim * (0.35 + 0.65 * sunFacing) * 0.88;
    gl_FragColor = vec4(col * 1.45, alpha);
  }
`;

export function OrbitalPlanetAndSky({ reducedMotion }: { reducedMotion: boolean }) {
  const earthMatRef = useRef<THREE.ShaderMaterial | null>(null);
  const starsRef = useRef<THREE.Points | null>(null);

  const earthUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSunDir: { value: new THREE.Vector3(0.45, 0.55, -0.7).normalize() },
    }),
    []
  );

  const atmosphereUniforms = useMemo(
    () => ({
      uSunDir: { value: new THREE.Vector3(0.45, 0.55, -0.7).normalize() },
    }),
    []
  );

  // Generate 4,500 multi-temperature stars across the 360° celestial sphere
  const starGeo = useMemo(() => {
    const count = 4500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 680 + Math.random() * 120;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const temp = Math.random();
      if (temp < 0.25) {
        // Warm gold star
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.88;
        colors[i * 3 + 2] = 0.72;
      } else if (temp < 0.6) {
        // Crisp blue-white star
        colors[i * 3] = 0.78;
        colors[i * 3 + 1] = 0.88;
        colors[i * 3 + 2] = 1.0;
      } else {
        // Pure white star
        colors[i * 3] = 0.96;
        colors[i * 3 + 1] = 0.97;
        colors[i * 3 + 2] = 1.0;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (reducedMotion) return;
    const t = clock.getElapsedTime();
    if (earthMatRef.current) {
      earthMatRef.current.uniforms.uTime.value = t;
    }
    if (starsRef.current) {
      starsRef.current.rotation.y = t * 0.0015;
    }
  });

  return (
    <group name="orbital-planet-and-sky">
      {/* 1. HDR Image-Based Lighting (IBL) Cubemap for Photorealistic PBR Reflections */}
      <Environment resolution={512} frames={1}>
        <color attach="background" args={["#040a18"]} />
        {/* Warm golden overhead architectural cove strips */}
        <Lightformer
          form="rect"
          intensity={3.4}
          color="#ffe3b3"
          position={[0, 15, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[36, 36, 1]}
        />
        <Lightformer
          form="ring"
          intensity={2.8}
          color="#ffcf87"
          position={[0, 12, -8]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[22, 22, 1]}
        />
        {/* Deep sapphire & cyan Earth horizon bounce light from below and north */}
        <Lightformer
          form="rect"
          intensity={2.4}
          color="#1e90ff"
          position={[0, -18, -25]}
          rotation={[-Math.PI / 3, 0, 0]}
          scale={[65, 35, 1]}
        />
        {/* LEVL West Wing cyan-teal bounce light */}
        <Lightformer
          form="rect"
          intensity={2.2}
          color="#2dd4bf"
          position={[-38, 4, 0]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[24, 10, 1]}
        />
        {/* AGI Futures East Wing radiant emerald & warm brass bounce light */}
        <Lightformer
          form="rect"
          intensity={2.2}
          color="#34d399"
          position={[38, 4, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[24, 10, 1]}
        />
      </Environment>

      {/* 2. 360° Deep Space Starfield */}
      <points ref={starsRef} geometry={starGeo}>
        <pointsMaterial
          size={1.6}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation={false}
          depthWrite={false}
        />
      </points>

      {/* Subtle zero-G dust motes floating in the sunlit upper atrium */}
      <Sparkles
        count={120}
        scale={[64, 14, 38]}
        position={[0, 5.5, 0]}
        size={1.6}
        speed={reducedMotion ? 0 : 0.18}
        opacity={0.32}
        color="#fde68a"
      />

      {/* 3. Monumental 3D Planet Earth Below & Ahead of the Orbital Ring */}
      {/* Positioned so the horizon curves majestically outside the North windows AND fills the glass floors below */}
      <group position={[0, -455, -115]} rotation={[0.28, -0.35, 0.08]}>
        <mesh receiveShadow={false} castShadow={false}>
          <sphereGeometry args={[448, 128, 128]} />
          <shaderMaterial
            ref={earthMatRef}
            vertexShader={EARTH_VERTEX_SHADER}
            fragmentShader={EARTH_FRAGMENT_SHADER}
            uniforms={earthUniforms}
          />
        </mesh>

        {/* Rayleigh/Mie Atmospheric Limb Halo */}
        <mesh>
          <sphereGeometry args={[460, 96, 96]} />
          <shaderMaterial
            vertexShader={ATMOSPHERE_VERTEX_SHADER}
            fragmentShader={ATMOSPHERE_FRAGMENT_SHADER}
            uniforms={atmosphereUniforms}
            transparent
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* 4. Global Orbital Sunlight & Earth Albedo Bounce Lights */}
      <directionalLight
        position={[35, 42, -55]}
        intensity={2.2}
        color="#fff2d6"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={10}
        shadow-camera-far={160}
        shadow-camera-left={-55}
        shadow-camera-right={55}
        shadow-camera-top={35}
        shadow-camera-bottom={-35}
        shadow-bias={-0.0005}
      />
      {/* Upward sapphire Earth-glow illuminating the underside of the ribs & sunken lounges */}
      <directionalLight
        position={[0, -35, -20]}
        intensity={1.15}
        color="#38bdf8"
      />
      <hemisphereLight
        args={["#ffe8c2", "#0ea5e9", 0.75]}
      />
    </group>
  );
}
