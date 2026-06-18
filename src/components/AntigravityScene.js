"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useMotionValueEvent } from "framer-motion";

function createCircleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.3, "rgba(96, 165, 250, 0.8)"); // Sky blue glow
    gradient.addColorStop(0.7, "rgba(59, 130, 246, 0.4)");  // Blue halo
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 16, 16);
  }
  return new THREE.CanvasTexture(canvas);
}

function isWebGLAvailable() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      typeof window !== "undefined" &&
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
}

export default function AntigravityScene({ scrollYProgress }) {
  const canvasRef = useRef(null);
  const scrollProgressRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    scrollProgressRef.current = v;
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (!isWebGLAvailable()) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0.5, 7.5);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0x60a5fa, 1.5);
    directionalLight1.position.set(5, 5, 8);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0x3b82f6, 1.0);
    directionalLight2.position.set(-5, -3, -5);
    scene.add(directionalLight2);

    const dotTexture = createCircleTexture();

    const hologramGroup = new THREE.Group();
    scene.add(hologramGroup);

    const N = 4000;
    const wavePositions = new Float32Array(N * 3);
    const spherePositions = new Float32Array(N * 3);
    const torusPositions = new Float32Array(N * 3);
    const vortexPositions = new Float32Array(N * 3);

    const waveColors = new Float32Array(N * 3);
    const sphereColors = new Float32Array(N * 3);
    const torusColors = new Float32Array(N * 3);
    const vortexColors = new Float32Array(N * 3);

    const gridSize = Math.floor(Math.sqrt(N));
    for (let i = 0; i < N; i++) {
      const xIndex = i % gridSize;
      const zIndex = Math.floor(i / gridSize);
      const x = ((xIndex / gridSize) - 0.5) * 11.0;
      const z = ((zIndex / (N / gridSize)) - 0.5) * 11.0;
      wavePositions[i * 3] = x;
      wavePositions[i * 3 + 1] = 0;
      wavePositions[i * 3 + 2] = z;

      const rMix = Math.random() * 0.15;
      waveColors[i * 3] = 0.133 + rMix;
      waveColors[i * 3 + 1] = 0.827 - rMix;
      waveColors[i * 3 + 2] = 0.933;
    }

    const radius = 2.8;
    for (let i = 0; i < N; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / N);
      const theta = Math.sqrt(N * Math.PI) * phi;

      spherePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      spherePositions[i * 3 + 1] = radius * Math.cos(phi);
      spherePositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      const rMix = Math.random() * 0.15;
      sphereColors[i * 3] = 0.231 + rMix;
      sphereColors[i * 3 + 1] = 0.510;
      sphereColors[i * 3 + 2] = 0.965 - rMix;
    }

    const torusRadius = 3.0;
    const tubeRadius = 0.9;
    for (let i = 0; i < N; i++) {
      const theta = (i / N) * Math.PI * 2 * 6;
      const phi = (i / N) * Math.PI * 2 * 50;

      torusPositions[i * 3] = (torusRadius + tubeRadius * Math.cos(phi)) * Math.cos(theta);
      torusPositions[i * 3 + 1] = (torusRadius + tubeRadius * Math.cos(phi)) * Math.sin(theta);
      torusPositions[i * 3 + 2] = tubeRadius * Math.sin(phi);

      const rMix = Math.random() * 0.15;
      torusColors[i * 3] = 0.655 - rMix;
      torusColors[i * 3 + 1] = 0.545 + rMix;
      torusColors[i * 3 + 2] = 0.980;
    }

    for (let i = 0; i < N; i++) {
      const t = (i / N) * Math.PI * 2 * 6;
      const isSecondHelix = i % 2 === 0 ? 1 : -1;
      const rVal = 1.0 + (i / N) * 1.6;
      
      vortexPositions[i * 3] = rVal * Math.cos(t) * isSecondHelix;
      vortexPositions[i * 3 + 1] = ((i / N) - 0.5) * 6.0;
      vortexPositions[i * 3 + 2] = rVal * Math.sin(t) * isSecondHelix;

      const rMix = Math.random() * 0.15;
      vortexColors[i * 3] = 0.961;
      vortexColors[i * 3 + 1] = 0.620 + rMix;
      vortexColors[i * 3 + 2] = 0.043 - rMix;
    }

    const particleGeom = new THREE.BufferGeometry();
    const currentPositions = new Float32Array(N * 3);
    const currentColors = new Float32Array(N * 3);
    
    currentPositions.set(wavePositions);
    currentColors.set(waveColors);

    particleGeom.setAttribute("position", new THREE.BufferAttribute(currentPositions, 3));
    particleGeom.setAttribute("color", new THREE.BufferAttribute(currentColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.22,
      map: dotTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(particleGeom, particleMat);
    hologramGroup.add(particleSystem);

    const dustCount = 800;
    const dustGeom = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const r = 12 + Math.random() * 18;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      dustPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      dustPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      dustPositions[i * 3 + 2] = r * Math.cos(phi);
    }
    dustGeom.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0x3b82f6,
      size: 0.12,
      map: dotTexture,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dustField = new THREE.Points(dustGeom, dustMat);
    scene.add(dustField);

    const cameraPoints = [
      new THREE.Vector3(0, 0.8, 8.5),
      new THREE.Vector3(2.8, -0.6, 3.2),
      new THREE.Vector3(-4.5, 3.5, 6.8),
      new THREE.Vector3(0, 8.0, 1.0)
    ];

    const lookAtPoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.8, -0.2, 0.4),
      new THREE.Vector3(-0.8, 0.4, -0.4),
      new THREE.Vector3(0, 0, 0)
    ];

    const cameraPath = new THREE.CatmullRomCurve3(cameraPoints);
    const lookAtPath = new THREE.CatmullRomCurve3(lookAtPoints);

    let currentScroll = scrollProgressRef.current;
    let time = 0;
    let animationFrameId;

    const tick = () => {
      time += 0.005;

      const targetScroll = scrollProgressRef.current;
      currentScroll = targetScroll; // perfectly synchronized with content scroll

      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      dustField.rotation.y = -time * 0.02;
      dustField.rotation.x = time * 0.01;

      const clampedScroll = Math.max(0, Math.min(1, currentScroll));
      
      let pSource, pTarget, cSource, cTarget, localT = 0;

      if (clampedScroll <= 0.33) {
        pSource = wavePositions; pTarget = spherePositions;
        cSource = waveColors; cTarget = sphereColors;
        localT = clampedScroll / 0.33;
      } else if (clampedScroll <= 0.66) {
        pSource = spherePositions; pTarget = torusPositions;
        cSource = sphereColors; cTarget = torusColors;
        localT = (clampedScroll - 0.33) / 0.33;
      } else {
        pSource = torusPositions; pTarget = vortexPositions;
        cSource = torusColors; cTarget = vortexColors;
        localT = (clampedScroll - 0.66) / 0.34;
      }

      const easeT = localT * localT * (3 - 2 * localT);
      const posAttr = particleGeom.attributes.position;
      const posArray = posAttr.array;
      const colAttr = particleGeom.attributes.color;
      const colArray = colAttr.array;

      const mouseVec = new THREE.Vector3(mouse.x * 4.5, mouse.y * 3.5, 0);

      for (let i = 0; i < N; i++) {
        const i3 = i * 3;
        let x = pSource[i3] + (pTarget[i3] - pSource[i3]) * easeT;
        let y = pSource[i3 + 1] + (pTarget[i3 + 1] - pSource[i3 + 1]) * easeT;
        let z = pSource[i3 + 2] + (pTarget[i3 + 2] - pSource[i3 + 2]) * easeT;

        if (clampedScroll < 0.33) {
          const waveWeight = 1.0 - (clampedScroll / 0.33);
          const ripple = Math.sin(x * 0.6 + time * 2.0) * Math.cos(z * 0.6 + time * 2.0) * 0.5 * waveWeight;
          y += ripple;
        }

        const dx = x - mouseVec.x;
        const dy = y - mouseVec.y;
        const dz = z - mouseVec.z;
        const distSq = dx * dx + dy * dy + dz * dz;
        const maxDistSq = 4.0;

        if (distSq < maxDistSq) {
          const dist = Math.sqrt(distSq);
          if (dist > 0.01) {
            const force = (2.0 - dist) / 2.0 * 0.45;
            x += (dx / dist) * force;
            y += (dy / dist) * force;
            z += (dz / dist) * force;
          }
        }

        posArray[i3] = x;
        posArray[i3 + 1] = y;
        posArray[i3 + 2] = z;

        colArray[i3] = cSource[i3] + (cTarget[i3] - cSource[i3]) * easeT;
        colArray[i3 + 1] = cSource[i3 + 1] + (cTarget[i3 + 1] - cSource[i3 + 1]) * easeT;
        colArray[i3 + 2] = cSource[i3 + 2] + (cTarget[i3 + 2] - cSource[i3 + 2]) * easeT;
      }

      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;

      hologramGroup.rotation.y = time * 0.08 + currentScroll * Math.PI * 0.5;
      hologramGroup.rotation.x = mouse.y * 0.15;
      hologramGroup.rotation.z = mouse.x * 0.15;

      const camPos = cameraPath.getPointAt(clampedScroll);
      const lookPos = lookAtPath.getPointAt(clampedScroll);

      camera.position.set(camPos.x, camPos.y, camPos.z);
      camera.lookAt(lookPos);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      renderer.dispose();
      dotTexture.dispose();
      particleGeom.dispose();
      particleMat.dispose();
      dustGeom.dispose();
      dustMat.dispose();
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 bg-[#020617] overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Translucent dark layer between 3D background and foreground content to guarantee text readability */}
      <div className="absolute inset-0 bg-slate-950/70" />
    </div>
  );
}
