import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { prefersReducedMotion } from '@/lib/motion/engine';
import {
  createProceduralCloudsTexture,
  createProceduralNightLightsTexture,
} from '@/lib/3d/earthTextures';

interface EarthHeroSceneProps {
  scrollProgress: number; // 0 (Hero view: half Earth right side) to 1 (Scrolled: dynamic slide & full exposure)
}

export const EarthHeroScene: React.FC<EarthHeroSceneProps> = ({ scrollProgress }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef(scrollProgress);
  scrollRef.current = scrollProgress;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 2. Earth Group (holds Earth body, night lights, clouds, atmosphere)
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    // Initial position: sitting on the right half of the hero screen
    const baseScale = width < 768 ? 1.25 : 1.75;
    earthGroup.scale.set(baseScale, baseScale, baseScale);

    // Base position when scrollProgress = 0: shifted to right so half globe is visible
    earthGroup.position.set(width < 768 ? 0.95 : 1.7, -0.15, 0.2);

    // 3. Earth Globe Geometry & Shaders
    const earthRadius = 1.0;
    const globeGeo = new THREE.SphereGeometry(earthRadius, 64, 64);

    // Textures
    const nightLightsMap = createProceduralNightLightsTexture();
    const cloudsMap = createProceduralCloudsTexture();

    // Custom Shader Material for Photorealistic Night Earth + Golden Rim Terminator
    const earthMat = new THREE.ShaderMaterial({
      uniforms: {
        tNightLights: { value: nightLightsMap },
        uSunDirection: { value: new THREE.Vector3(-0.6, 0.45, 0.6).normalize() },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tNightLights;
        uniform vec3 uSunDirection;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(-vPosition);
          
          float sunDot = dot(normal, uSunDirection);
          vec4 nightColor = texture2D(tNightLights, vUv);

          // Deep cosmic black on oceans with faint blue reflectivity
          vec3 darkSurface = vec3(0.015, 0.02, 0.035);

          // Vibrant golden night city clusters
          vec3 cityLights = nightColor.rgb * 3.4;

          // Atmospheric Fresnel Rim (Electric cyan to deep violet dusk)
          float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
          vec3 atmosphereGlow = vec3(0.15, 0.48, 1.0) * fresnel * 2.2;

          // Sunset twilight terminator rim (fiery amber/orange)
          float twilight = smoothstep(-0.35, 0.25, sunDot) * smoothstep(0.4, 0.0, sunDot);
          vec3 twilightGlow = vec3(1.0, 0.38, 0.08) * twilight * 1.8;

          vec3 finalColor = darkSurface + cityLights + atmosphereGlow + twilightGlow;

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });

    const earthMesh = new THREE.Mesh(globeGeo, earthMat);
    earthGroup.add(earthMesh);

    // 4. Subtle Outer Clouds Sphere
    const cloudsGeo = new THREE.SphereGeometry(earthRadius * 1.012, 48, 48);
    const cloudsMat = new THREE.MeshBasicMaterial({
      map: cloudsMap,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    earthGroup.add(cloudsMesh);

    // 5. Volumetric Atmospheric Halo Shield
    const haloGeo = new THREE.SphereGeometry(earthRadius * 1.08, 48, 48);
    const haloMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
          // Ethereal royal blue / neon violet halo
          gl_FragColor = vec4(0.2, 0.5, 1.0, 1.0) * intensity * 0.75;
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    earthGroup.add(haloMesh);

    // 6. Deep Space Background Starfield
    const starCount = 650;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 25 + Math.random() * 20;

      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);
      starSizes[i] = Math.random() * 1.8 + 0.5;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

    const starMat = new THREE.PointsMaterial({
      color: 0xe0e6ff,
      size: 0.045,
      transparent: true,
      opacity: 0.65,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 7. Animation Loop with Dynamic Scroll Interpolation
    let animId: number;
    let clock = new THREE.Clock();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const p = scrollRef.current; // 0 to 1

      // Earth axial rotation
      if (!prefersReducedMotion()) {
        earthMesh.rotation.y += delta * 0.065;
        cloudsMesh.rotation.y += delta * 0.082;
        starField.rotation.y -= delta * 0.005;
      }

      // Dynamic Scroll Interpolation:
      // At p = 0: Half Earth sitting on right (x: 1.35, y: -0.2, scale: baseScale)
      // At p = 0.5: Slides dramatically across screen exposing full spherical body (x: 0, y: 0.1, z: 0.5, scale: baseScale * 1.15)
      // At p = 1.0: Glides smoothly out / docked toward left background
      const isMobile = window.innerWidth < 768;

      let targetX = 0;
      let targetY = 0;
      let targetZ = 0;
      let targetScale = baseScale;
      let targetOpacity = 1;

      if (p <= 0.5) {
        // First phase of scroll: Move from right-half to center exposing full 3D body
        const t = p * 2; // 0 to 1
        const easeT = t * t * (3 - 2 * t); // smoothstep
        const startX = isMobile ? 0.95 : 1.7;
        targetX = THREE.MathUtils.lerp(startX, isMobile ? 0 : 0.05, easeT);
        targetY = THREE.MathUtils.lerp(-0.15, 0.05, easeT);
        targetZ = THREE.MathUtils.lerp(0.2, 0.45, easeT);
        targetScale = THREE.MathUtils.lerp(baseScale, baseScale * 1.08, easeT);
        targetOpacity = 1;
      } else {
        // Second phase: Glide aside to unveil the node graph seamlessly
        const t = (p - 0.5) * 2; // 0 to 1
        const easeT = t * t * (3 - 2 * t);
        const midX = isMobile ? 0 : 0.05;
        targetX = THREE.MathUtils.lerp(midX, isMobile ? -2.2 : -3.2, easeT);
        targetY = THREE.MathUtils.lerp(0.05, -0.6, easeT);
        targetZ = THREE.MathUtils.lerp(0.45, -1.2, easeT);
        targetScale = THREE.MathUtils.lerp(baseScale * 1.08, baseScale * 0.7, easeT);
        targetOpacity = THREE.MathUtils.lerp(1, 0, Math.pow(t, 1.3));
      }

      // Smooth camera / object interpolation
      earthGroup.position.x = THREE.MathUtils.damp(earthGroup.position.x, targetX, 8, delta);
      earthGroup.position.y = THREE.MathUtils.damp(earthGroup.position.y, targetY, 8, delta);
      earthGroup.position.z = THREE.MathUtils.damp(earthGroup.position.z, targetZ, 8, delta);

      const currentScale = earthGroup.scale.x;
      const nextScale = THREE.MathUtils.damp(currentScale, targetScale, 8, delta);
      earthGroup.scale.set(nextScale, nextScale, nextScale);

      // Fade canvas opacity when scrolled past
      if (renderer.domElement) {
        renderer.domElement.style.opacity = `${targetOpacity}`;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      globeGeo.dispose();
      cloudsGeo.dispose();
      haloGeo.dispose();
      starGeo.dispose();
      earthMat.dispose();
      cloudsMat.dispose();
      haloMat.dispose();
      starMat.dispose();
      nightLightsMap.dispose();
      cloudsMap.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
      style={{ transition: 'opacity 300ms ease' }}
    />
  );
};
