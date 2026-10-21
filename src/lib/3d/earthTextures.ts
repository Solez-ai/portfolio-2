import * as THREE from 'three';

/**
 * Procedurally generates high-frequency night-side city lights on an equirectangular canvas.
 * Follows actual continental outlines approximately and concentrates light clusters.
 */
export function createProceduralNightLightsTexture(): THREE.CanvasTexture {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const fallbackCanvas = document.createElement('canvas');
    return new THREE.CanvasTexture(fallbackCanvas);
  }

  // Base deep space night surface
  ctx.fillStyle = '#04060a';
  ctx.fillRect(0, 0, width, height);

  // Pseudo-continents mask function
  // Checks if UV coords roughly map to major continental landmasses
  const isLand = (u: number, v: number): boolean => {
    // Americas (u: 0.15 - 0.38, v: 0.18 - 0.85)
    if (u > 0.14 && u < 0.36 && v > 0.18 && v < 0.52) return true; // N. America
    if (u > 0.22 && u < 0.36 && v > 0.52 && v < 0.88) return true; // S. America
    // Europe & Africa (u: 0.45 - 0.62)
    if (u > 0.44 && u < 0.60 && v > 0.16 && v < 0.42) return true; // Europe
    if (u > 0.46 && u < 0.62 && v > 0.40 && v < 0.82) return true; // Africa
    // Asia & India & Bangladesh (u: 0.58 - 0.88)
    if (u > 0.58 && u < 0.88 && v > 0.16 && v < 0.54) return true; // Asia
    if (u > 0.66 && u < 0.74 && v > 0.40 && v < 0.56) return true; // India / South Asia (Dhaka hub)
    // Australia & Japan
    if (u > 0.78 && u < 0.92 && v > 0.65 && v < 0.86) return true; // Australia
    if (u > 0.82 && u < 0.88 && v > 0.30 && v < 0.42) return true; // Japan
    return false;
  };

  // 1. Draw subtle continent terrain silhouette
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  for (let y = 0; y < height; y++) {
    const v = y / height;
    for (let x = 0; x < width; x++) {
      const u = x / width;
      const idx = (y * width + x) * 4;

      if (isLand(u, v)) {
        // Subtle dark oceanic vs terrestrial landmass contrast
        data[idx] = 12;     // R
        data[idx + 1] = 16; // G
        data[idx + 2] = 22; // B
        data[idx + 3] = 255;
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);

  // 2. Generate procedural clusters of gold/amber city lights
  const clusterCount = 380;
  for (let c = 0; c < clusterCount; c++) {
    const u = Math.random();
    const v = Math.random();

    if (!isLand(u, v)) continue;

    const cx = u * width;
    const cy = v * height;
    const size = Math.random() * 28 + 10;
    const density = Math.floor(Math.random() * 45 + 15);

    // Major golden city hub glow
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, size);
    grad.addColorStop(0, 'rgba(255, 210, 120, 0.95)');
    grad.addColorStop(0.35, 'rgba(255, 140, 40, 0.65)');
    grad.addColorStop(0.7, 'rgba(220, 70, 20, 0.25)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, size, 0, Math.PI * 2);
    ctx.fill();

    // Micro city light speckles
    for (let p = 0; p < density; p++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.pow(Math.random(), 1.8) * size * 1.2;
      const px = cx + Math.cos(angle) * dist;
      const py = cy + Math.sin(angle) * dist;

      ctx.fillStyle = Math.random() > 0.4 ? '#FFF5D0' : '#FF9933';
      ctx.fillRect(px, py, Math.random() * 2 + 1, Math.random() * 2 + 1);
    }
  }

  // 3. Highlight South Asia / Bangladesh region with extra intensity
  const dX = 0.70 * width;
  const dY = 0.44 * height;
  const dhakaGlow = ctx.createRadialGradient(dX, dY, 0, dX, dY, 45);
  dhakaGlow.addColorStop(0, 'rgba(255, 230, 150, 1.0)');
  dhakaGlow.addColorStop(0.5, 'rgba(255, 120, 20, 0.7)');
  dhakaGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = dhakaGlow;
  ctx.beginPath();
  ctx.arc(dX, dY, 45, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Creates subtle procedural clouds texture with soft alpha
 */
export function createProceduralCloudsTexture(): THREE.CanvasTexture {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(document.createElement('canvas'));
  }

  ctx.clearRect(0, 0, width, height);

  // Swirling soft atmospheric cloud bands
  for (let i = 0; i < 90; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radiusX = Math.random() * 110 + 40;
    const radiusY = Math.random() * 35 + 15;
    const rotation = (Math.random() - 0.5) * 0.4;

    const grad = ctx.createRadialGradient(x, y, 0, x, y, radiusX);
    grad.addColorStop(0, 'rgba(230, 235, 255, 0.28)');
    grad.addColorStop(0.5, 'rgba(200, 215, 255, 0.12)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(1, radiusY / radiusX);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, radiusX, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}
