"use client";

import * as THREE from "three";

export interface PbrTextureSet {
  travertineMap: THREE.CanvasTexture;
  travertineNormal: THREE.CanvasTexture;
  travertineRoughness: THREE.CanvasTexture;
  walnutMap: THREE.CanvasTexture;
  walnutNormal: THREE.CanvasTexture;
  walnutRoughness: THREE.CanvasTexture;
  brassNormal: THREE.CanvasTexture;
  boucleMap: THREE.CanvasTexture;
  boucleNormal: THREE.CanvasTexture;
  flutedNormal: THREE.CanvasTexture;
}

let cachedPbrSet: PbrTextureSet | null = null;

function fract(x: number): number {
  return x - Math.floor(x);
}

function hash2(x: number, y: number): number {
  return fract(Math.sin(x * 127.1 + y * 311.7) * 43758.5453123);
}

function valueNoise(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash2(ix, iy);
  const b = hash2(ix + 1, iy);
  const c = hash2(ix, iy + 1);
  const d = hash2(ix + 1, iy + 1);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

function fbm(x: number, y: number, octaves = 4): number {
  let v = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    v += amp * valueNoise(x * freq, y * freq);
    freq *= 2.03;
    amp *= 0.5;
  }
  return v;
}

function configureRepeat(
  tex: THREE.CanvasTexture,
  repeatX: number,
  repeatY: number,
  isColor = false
): THREE.CanvasTexture {
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  if (isColor) {
    tex.colorSpace = THREE.SRGBColorSpace;
  }
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates and caches high-detail procedural PBR textures for the orbital habitat:
 * - Honed Vein-Cut Ivory Travertine (Albedo, Normal, Roughness)
 * - Warm American Walnut Timber (Albedo, Normal, Roughness)
 * - Brushed Champagne Brass (Anisotropic Normal)
 * - Cream Bouclé Upholstery Weave (Albedo, Normal)
 * - Vertical Fluted Alabaster / Ribbed Glass (Normal)
 */
export function getOrbitalPbrTextures(): PbrTextureSet {
  if (cachedPbrSet) return cachedPbrSet;

  const size = 512;

  // 1. Honed Vein-Cut Ivory Travertine
  const travCanvas = document.createElement("canvas");
  const travNormCanvas = document.createElement("canvas");
  const travRoughCanvas = document.createElement("canvas");
  travCanvas.width = travNormCanvas.width = travRoughCanvas.width = size;
  travCanvas.height = travNormCanvas.height = travRoughCanvas.height = size;

  const travCtx = travCanvas.getContext("2d")!;
  const travNormCtx = travNormCanvas.getContext("2d")!;
  const travRoughCtx = travRoughCanvas.getContext("2d")!;

  const travImg = travCtx.createImageData(size, size);
  const travNormImg = travNormCtx.createImageData(size, size);
  const travRoughImg = travRoughCtx.createImageData(size, size);

  const heightBuffer = new Float32Array(size * size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const v = y / size;

      // Sedimentary horizontal travertine banding + organic mineral flow
      const warp = fbm(u * 4.0, v * 4.0, 3) * 0.18;
      const band = Math.sin((v + warp) * Math.PI * 14.0) * 0.5 + 0.5;
      const fineGrain = fbm(u * 18.0, v * 36.0, 4);
      const microPore = valueNoise(u * 96.0, v * 48.0);

      // Subtle architectural stone tile seam grid
      const seamX = Math.min(u * 2 - Math.floor(u * 2), 1 - (u * 2 - Math.floor(u * 2)));
      const seamY = Math.min(v * 2 - Math.floor(v * 2), 1 - (v * 2 - Math.floor(v * 2)));
      const seamFactor = seamX < 0.008 || seamY < 0.008 ? 0.88 : 1.0;

      const poreDip = microPore < 0.14 ? 0.86 : 1.0;
      const tone = (0.86 + band * 0.08 + fineGrain * 0.06) * seamFactor * poreDip;

      const idx = (y * size + x) * 4;
      // Warm ivory/cream travertine palette (#f3ead8 -> #dccab0)
      travImg.data[idx] = Math.min(255, Math.floor(245 * tone));
      travImg.data[idx + 1] = Math.min(255, Math.floor(233 * tone));
      travImg.data[idx + 2] = Math.min(255, Math.floor(214 * tone));
      travImg.data[idx + 3] = 255;

      const h = tone;
      heightBuffer[y * size + x] = h;

      // Polished stone roughness (low roughness ~0.18 on honed flat, higher in pores/seams)
      const roughVal =
        seamFactor < 1.0 ? 180 : poreDip < 1.0 ? 145 : Math.floor(38 + (1 - band) * 28);
      travRoughImg.data[idx] = roughVal;
      travRoughImg.data[idx + 1] = roughVal;
      travRoughImg.data[idx + 2] = roughVal;
      travRoughImg.data[idx + 3] = 255;
    }
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const hL = heightBuffer[y * size + ((x - 1 + size) % size)];
      const hR = heightBuffer[y * size + ((x + 1) % size)];
      const hU = heightBuffer[((y - 1 + size) % size) * size + x];
      const hD = heightBuffer[((y + 1) % size) * size + x];
      const dx = (hL - hR) * 3.5;
      const dy = (hU - hD) * 3.5;
      const idx = (y * size + x) * 4;
      travNormImg.data[idx] = Math.min(255, Math.max(0, Math.floor((dx * 0.5 + 0.5) * 255)));
      travNormImg.data[idx + 1] = Math.min(255, Math.max(0, Math.floor((dy * 0.5 + 0.5) * 255)));
      travNormImg.data[idx + 2] = 235;
      travNormImg.data[idx + 3] = 255;
    }
  }

  travCtx.putImageData(travImg, 0, 0);
  travNormCtx.putImageData(travNormImg, 0, 0);
  travRoughCtx.putImageData(travRoughImg, 0, 0);

  // 2. Warm American Walnut Timber
  const walCanvas = document.createElement("canvas");
  const walNormCanvas = document.createElement("canvas");
  const walRoughCanvas = document.createElement("canvas");
  walCanvas.width = walNormCanvas.width = walRoughCanvas.width = size;
  walCanvas.height = walNormCanvas.height = walRoughCanvas.height = size;

  const walCtx = walCanvas.getContext("2d")!;
  const walNormCtx = walNormCanvas.getContext("2d")!;
  const walRoughCtx = walRoughCanvas.getContext("2d")!;

  const walImg = walCtx.createImageData(size, size);
  const walNormImg = walNormCtx.createImageData(size, size);
  const walRoughImg = walRoughCtx.createImageData(size, size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const v = y / size;
      const grainWarp = fbm(u * 3.5, v * 12.0, 4) * 0.35;
      const ring = Math.sin((u * 10.0 + grainWarp) * Math.PI * 2.0) * 0.5 + 0.5;
      const fineFiber = valueNoise(u * 140.0, v * 18.0);
      const w = 0.55 + ring * 0.32 + fineFiber * 0.13;

      const idx = (y * size + x) * 4;
      // Rich oiled American walnut (#3d2314 -> #754628)
      walImg.data[idx] = Math.min(255, Math.floor(112 * w));
      walImg.data[idx + 1] = Math.min(255, Math.floor(66 * w));
      walImg.data[idx + 2] = Math.min(255, Math.floor(38 * w));
      walImg.data[idx + 3] = 255;

      const nx = (fineFiber - 0.5) * 0.35;
      walNormImg.data[idx] = Math.floor((nx + 0.5) * 255);
      walNormImg.data[idx + 1] = 128;
      walNormImg.data[idx + 2] = 245;
      walNormImg.data[idx + 3] = 255;

      const rVal = Math.floor(48 + (1 - ring) * 35);
      walRoughImg.data[idx] = rVal;
      walRoughImg.data[idx + 1] = rVal;
      walRoughImg.data[idx + 2] = rVal;
      walRoughImg.data[idx + 3] = 255;
    }
  }

  walCtx.putImageData(walImg, 0, 0);
  walNormCtx.putImageData(walNormImg, 0, 0);
  walRoughCtx.putImageData(walRoughImg, 0, 0);

  // 3. Brushed Champagne Brass Normal Map
  const brassCanvas = document.createElement("canvas");
  brassCanvas.width = brassCanvas.height = 256;
  const brassCtx = brassCanvas.getContext("2d")!;
  const brassImg = brassCtx.createImageData(256, 256);
  for (let y = 0; y < 256; y++) {
    for (let x = 0; x < 256; x++) {
      const streak = valueNoise(x * 0.15, y * 1.8);
      const idx = (y * 256 + x) * 4;
      brassImg.data[idx] = 128;
      brassImg.data[idx + 1] = Math.floor(110 + streak * 36);
      brassImg.data[idx + 2] = 248;
      brassImg.data[idx + 3] = 255;
    }
  }
  brassCtx.putImageData(brassImg, 0, 0);

  // 4. Cream Bouclé Upholstery Weave
  const boucleCanvas = document.createElement("canvas");
  const boucleNormCanvas = document.createElement("canvas");
  boucleCanvas.width = boucleNormCanvas.width = 256;
  boucleCanvas.height = boucleNormCanvas.height = 256;
  const boucleCtx = boucleCanvas.getContext("2d")!;
  const boucleNormCtx = boucleNormCanvas.getContext("2d")!;
  const boucleImg = boucleCtx.createImageData(256, 256);
  const boucleNormImg = boucleNormCtx.createImageData(256, 256);

  for (let y = 0; y < 256; y++) {
    for (let x = 0; x < 256; x++) {
      const n1 = valueNoise(x * 0.45, y * 0.45);
      const n2 = Math.sin(x * 0.9) * Math.cos(y * 0.9) * 0.5 + 0.5;
      const knot = n1 * 0.65 + n2 * 0.35;
      const idx = (y * 256 + x) * 4;
      const bTone = 0.88 + knot * 0.12;
      boucleImg.data[idx] = Math.floor(248 * bTone);
      boucleImg.data[idx + 1] = Math.floor(239 * bTone);
      boucleImg.data[idx + 2] = Math.floor(224 * bTone);
      boucleImg.data[idx + 3] = 255;

      boucleNormImg.data[idx] = Math.floor(105 + n1 * 50);
      boucleNormImg.data[idx + 1] = Math.floor(105 + n2 * 50);
      boucleNormImg.data[idx + 2] = 230;
      boucleNormImg.data[idx + 3] = 255;
    }
  }
  boucleCtx.putImageData(boucleImg, 0, 0);
  boucleNormCtx.putImageData(boucleNormImg, 0, 0);

  // 5. Fluted Alabaster / Ribbed Glass Normal Map
  const flutedCanvas = document.createElement("canvas");
  flutedCanvas.width = flutedCanvas.height = 256;
  const flutedCtx = flutedCanvas.getContext("2d")!;
  const flutedImg = flutedCtx.createImageData(256, 256);
  for (let y = 0; y < 256; y++) {
    for (let x = 0; x < 256; x++) {
      const flute = Math.cos((x / 256) * Math.PI * 32.0);
      const idx = (y * 256 + x) * 4;
      flutedImg.data[idx] = Math.floor((flute * 0.45 + 0.5) * 255);
      flutedImg.data[idx + 1] = 128;
      flutedImg.data[idx + 2] = 235;
      flutedImg.data[idx + 3] = 255;
    }
  }
  flutedCtx.putImageData(flutedImg, 0, 0);

  cachedPbrSet = {
    travertineMap: configureRepeat(new THREE.CanvasTexture(travCanvas), 6, 6, true),
    travertineNormal: configureRepeat(new THREE.CanvasTexture(travNormCanvas), 6, 6),
    travertineRoughness: configureRepeat(new THREE.CanvasTexture(travRoughCanvas), 6, 6),
    walnutMap: configureRepeat(new THREE.CanvasTexture(walCanvas), 3, 3, true),
    walnutNormal: configureRepeat(new THREE.CanvasTexture(walNormCanvas), 3, 3),
    walnutRoughness: configureRepeat(new THREE.CanvasTexture(walRoughCanvas), 3, 3),
    brassNormal: configureRepeat(new THREE.CanvasTexture(brassCanvas), 4, 4),
    boucleMap: configureRepeat(new THREE.CanvasTexture(boucleCanvas), 8, 8, true),
    boucleNormal: configureRepeat(new THREE.CanvasTexture(boucleNormCanvas), 8, 8),
    flutedNormal: configureRepeat(new THREE.CanvasTexture(flutedCanvas), 8, 2),
  };

  return cachedPbrSet;
}
