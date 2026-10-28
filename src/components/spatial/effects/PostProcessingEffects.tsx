"use client";

import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { QualityTier } from "../OrbitalCanvas";

export function PostProcessingEffects({
  qualityTier,
}: {
  qualityTier: QualityTier;
}) {
  const { gl, scene, camera, size } = useThree();

  const composer = useMemo(() => {
    const renderTarget = new THREE.WebGLRenderTarget(size.width, size.height, {
      type: THREE.HalfFloatType,
      samples: qualityTier === "high" ? 4 : 2,
    });
    const comp = new EffectComposer(gl, renderTarget);
    const renderPass = new RenderPass(scene, camera);
    comp.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      0.42, // subtle, realistic optical bloom strength
      0.65, // bloom radius
      0.95 // threshold so only HDR (>1.0) emissive strips, neon signs & holograms bloom
    );
    comp.addPass(bloomPass);

    const outputPass = new OutputPass();
    comp.addPass(outputPass);

    return comp;
  }, [gl, scene, camera, qualityTier, size.width, size.height]);

  useEffect(() => {
    composer.setSize(size.width, size.height);
    composer.setPixelRatio(gl.getPixelRatio());
  }, [composer, size, gl]);

  useEffect(() => {
    return () => {
      composer.dispose();
    };
  }, [composer]);

  // Render at priority 1 so EffectComposer takes over the final frame output
  useFrame(() => {
    if (qualityTier === "lightweight") return;
    composer.render();
  }, 1);

  return null;
}
