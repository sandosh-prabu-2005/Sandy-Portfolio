"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useMotionValueEvent } from "framer-motion";

// Comprehensive catalog of Coding Languages, Frameworks, and AI Agents
const TECH_NODES = [
  // ── Coding Languages & Runtimes ─────────────────────────────────
  { name: "C", category: "LANGUAGE", color: "#60a5fa", glow: "rgba(96, 165, 250, 0.9)", symbol: "C", type: "lang" },
  { name: "C++", category: "LANGUAGE", color: "#38bdf8", glow: "rgba(56, 189, 248, 0.9)", symbol: "C++", type: "lang" },
  { name: "Java", category: "LANGUAGE", color: "#fb923c", glow: "rgba(251, 146, 60, 0.9)", symbol: "☕", type: "lang" },
  { name: "Python", category: "LANGUAGE", color: "#facc15", glow: "rgba(250, 204, 21, 0.9)", symbol: "🐍", type: "lang" },
  { name: "JavaScript", category: "LANGUAGE", color: "#facc15", glow: "rgba(250, 204, 21, 0.9)", symbol: "JS", type: "lang" },
  { name: "TypeScript", category: "LANGUAGE", color: "#60a5fa", glow: "rgba(96, 165, 250, 0.9)", symbol: "TS", type: "lang" },
  { name: "HTML5", category: "MARKUP", color: "#f97316", glow: "rgba(249, 115, 22, 0.9)", symbol: "HTML", type: "lang" },
  { name: "CSS3", category: "STYLING", color: "#38bdf8", glow: "rgba(56, 189, 248, 0.9)", symbol: "CSS", type: "lang" },
  { name: "React", category: "FRAMEWORK", color: "#22d3ee", glow: "rgba(34, 211, 238, 0.9)", symbol: "⚛", type: "framework" },
  { name: "Node.js", category: "RUNTIME", color: "#4ade80", glow: "rgba(74, 222, 128, 0.9)", symbol: "⬢", type: "runtime" },
  { name: "Angular", category: "FRAMEWORK", color: "#f43f5e", glow: "rgba(244, 63, 94, 0.9)", symbol: "🅰", type: "framework" },
  { name: "MongoDB", category: "DATABASE", color: "#34d399", glow: "rgba(52, 211, 153, 0.9)", symbol: "🍃", type: "database" },
  { name: "Next.js", category: "FRAMEWORK", color: "#f8fafc", glow: "rgba(248, 250, 252, 0.9)", symbol: "▲", type: "framework" },
  { name: "Docker", category: "DEVOPS", color: "#38bdf8", glow: "rgba(56, 189, 248, 0.9)", symbol: "🐳", type: "devops" },
  { name: "SQL", category: "DATABASE", color: "#a78bfa", glow: "rgba(167, 139, 250, 0.9)", symbol: "🗄", type: "database" },
  { name: "Rust", category: "LANGUAGE", color: "#fb923c", glow: "rgba(251, 146, 60, 0.9)", symbol: "⚙", type: "lang" },
  { name: "Go", category: "LANGUAGE", color: "#22d3ee", glow: "rgba(34, 211, 238, 0.9)", symbol: "GO", type: "lang" },
  { name: "GitHub", category: "DEVOPS", color: "#e2e8f0", glow: "rgba(226, 232, 240, 0.9)", symbol: "🐙", type: "devops" },

  // ── AI Agents & Autonomous Frameworks ───────────────────────────
  { name: "Antigravity", category: "AGENTIC AI", color: "#06b6d4", glow: "rgba(6, 182, 212, 0.95)", symbol: "✦", type: "agent" },
  { name: "OpenAI", category: "AI AGENT", color: "#10b981", glow: "rgba(16, 185, 129, 0.95)", symbol: "✳", type: "agent" },
  { name: "Claude", category: "AI AGENT", color: "#f97316", glow: "rgba(249, 115, 22, 0.95)", symbol: "✺", type: "agent" },
  { name: "Gemini", category: "AI AGENT", color: "#a855f7", glow: "rgba(168, 85, 247, 0.95)", symbol: "✧", type: "agent" },
  { name: "LangChain", category: "AGENT OPS", color: "#10b981", glow: "rgba(16, 185, 129, 0.95)", symbol: "🦜", type: "agent" },
  { name: "AutoGen", category: "MULTI-AGENT", color: "#38bdf8", glow: "rgba(56, 189, 248, 0.95)", symbol: "🤖", type: "agent" },
  { name: "CrewAI", category: "AGENT CREW", color: "#f43f5e", glow: "rgba(244, 63, 94, 0.95)", symbol: "👥", type: "agent" },
  { name: "DeepSeek", category: "REASONING AI", color: "#3b82f6", glow: "rgba(59, 130, 246, 0.95)", symbol: "🧠", type: "agent" },
  { name: "Ollama", category: "LOCAL LLM", color: "#f8fafc", glow: "rgba(248, 250, 252, 0.9)", symbol: "🦙", type: "agent" },
  { name: "HuggingFace", category: "AI HUB", color: "#fbbf24", glow: "rgba(251, 191, 36, 0.95)", symbol: "🤗", type: "agent" },
  { name: "Cursor", category: "AGENT IDE", color: "#c084fc", glow: "rgba(192, 132, 252, 0.95)", symbol: "⚡", type: "agent" },
  { name: "AI Agent", category: "AUTONOMOUS", color: "#22d3ee", glow: "rgba(34, 211, 238, 0.95)", symbol: "⚙", type: "agent" },
];

/**
 * Creates a high-DPI holographic badge texture for a tech / AI agent item.
 */
function createTechBadgeTexture(item) {
  const canvas = document.createElement("canvas");
  canvas.width = 384;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const w = 360;
  const h = 104;
  const x = 12;
  const y = 12;
  const radius = 28;

  // 1. Background Pill Glass Fill
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  const bgGrad = ctx.createLinearGradient(x, y, x + w, y + h);
  bgGrad.addColorStop(0, "rgba(9, 14, 26, 0.88)");
  bgGrad.addColorStop(1, "rgba(15, 23, 42, 0.78)");
  ctx.fillStyle = bgGrad;
  ctx.fill();

  // 2. Glowing Neon Border
  ctx.strokeStyle = item.color;
  ctx.lineWidth = 2.5;
  ctx.shadowColor = item.glow;
  ctx.shadowBlur = 14;
  ctx.stroke();
  ctx.restore();

  // 3. Icon Capsule on the Left
  ctx.save();
  const iconX = x + 16;
  const iconY = y + 14;
  const iconSize = 76;
  ctx.beginPath();
  ctx.arc(iconX + iconSize / 2, iconY + iconSize / 2, iconSize / 2, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  ctx.fill();
  ctx.strokeStyle = item.color;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Draw Symbol / Icon
  ctx.font = "bold 34px 'Space Grotesk', system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = item.glow;
  ctx.shadowBlur = 10;
  ctx.fillText(item.symbol, iconX + iconSize / 2, iconY + iconSize / 2 + 1);
  ctx.restore();

  // 4. Tech / Agent Name & Category Text
  ctx.save();
  const textLeft = iconX + iconSize + 18;

  // Category Tag (e.g. "AI AGENT", "LANGUAGE", "FRAMEWORK")
  ctx.font = "bold 13px 'Orbitron', monospace, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillStyle = item.color;
  ctx.shadowColor = item.glow;
  ctx.shadowBlur = 6;
  ctx.fillText(item.category, textLeft, y + 22);

  // Main Name (e.g. "Antigravity", "React", "Python", "OpenAI")
  ctx.font = "bold 32px 'Orbitron', 'Space Grotesk', system-ui, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = item.glow;
  ctx.shadowBlur = 12;
  ctx.fillText(item.name, textLeft, y + 46);

  // Accent Dot
  ctx.beginPath();
  ctx.arc(x + w - 24, y + 26, 4, 0, Math.PI * 2);
  ctx.fillStyle = item.color;
  ctx.shadowColor = item.glow;
  ctx.shadowBlur = 8;
  ctx.fill();
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

/**
 * Creates circular glowing particle texture.
 */
function createDotTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.3, "rgba(34, 211, 238, 0.9)"); // Cyan core
    gradient.addColorStop(0.7, "rgba(16, 185, 129, 0.45)"); // Emerald glow
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  return texture;
}

/**
 * Cubic smooth easing helper
 */
function cubicEase(t) {
  const clamped = Math.min(1, Math.max(0, t));
  return clamped < 0.5 ? 4 * clamped * clamped * clamped : 1 - Math.pow(-2 * clamped + 2, 3) / 2;
}

/**
 * Builds morphing particle grid geometry (Plane <-> Sphere <-> Vortex)
 */
function buildMorphingGrid(cols, rows, colSpacing, rowSpacing, palette, sphereRadius) {
  const count = cols * rows;
  const currentPos = new Float32Array(count * 3);
  const basePlane = new Float32Array(count * 3);
  const baseSphere = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const baseColors = new Float32Array(count * 3);

  const tempColor = new THREE.Color();
  const halfW = (cols * colSpacing) / 2;
  const halfH = (rows * rowSpacing) / 2;

  let idx = 0;
  for (let u = 0; u < cols; u++) {
    for (let v = 0; v < rows; v++) {
      const px = (u - cols / 2) * colSpacing;
      const pz = (v - rows / 2) * rowSpacing;

      // Base Plane
      basePlane[idx] = px;
      basePlane[idx + 1] = 0;
      basePlane[idx + 2] = pz;

      // Base Sphere
      const uNorm = u / (cols - 1);
      const vNorm = v / (rows - 1);
      const theta = uNorm * Math.PI * 2;
      const phi = vNorm * Math.PI;
      const sx = sphereRadius * Math.sin(phi) * Math.cos(theta);
      const sy = sphereRadius * Math.cos(phi);
      const sz = sphereRadius * Math.sin(phi) * Math.sin(theta);

      baseSphere[idx] = sx;
      baseSphere[idx + 1] = sy;
      baseSphere[idx + 2] = sz;

      currentPos[idx] = px;
      currentPos[idx + 1] = 0;
      currentPos[idx + 2] = pz;

      // Color sampling
      const colorHex = palette[(u + v) % palette.length];
      tempColor.set(colorHex);
      tempColor.offsetHSL((Math.random() - 0.5) * 0.05, 0.1, 0.05);

      // Vignette intensity falloff from center
      const edgeFactor = Math.cos((px / halfW) * (Math.PI / 2)) * Math.cos((pz / halfH) * (Math.PI / 2));
      const bright = 0.55 + 0.45 * Math.max(0, Math.pow(Math.max(0, edgeFactor), 1.4));

      const r = tempColor.r * bright;
      const g = tempColor.g * bright;
      const b = tempColor.b * bright;

      colors[idx] = r;
      colors[idx + 1] = g;
      colors[idx + 2] = b;
      baseColors[idx] = r;
      baseColors[idx + 1] = g;
      baseColors[idx + 2] = b;

      idx += 3;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(currentPos, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.userData = { basePlane, baseSphere, baseColors };

  return geometry;
}

function isWebGLAvailable() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      typeof window !== "undefined" &&
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
}

export default function AntigravityScene({ scrollYProgress }) {
  const mountRef = useRef(null);
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
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (!isWebGLAvailable()) return;
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // ── 1. Renderer ──────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x020617, 0); // Transparent to blend with cyber gradient
    container.appendChild(renderer.domElement);

    // ── 2. Scene & Camera ────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.022);

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 11.5);

    const dotTexture = createDotTexture();

    // ── 3. Particle Palettes ─────────────────────────────────────────
    const primaryPalette = ["#14b8a6", "#22d3ee", "#38bdf8", "#06b6d4", "#10b981", "#3b82f6"];
    const secondaryPalette = ["#0d9488", "#0284c7", "#059669", "#6366f1", "#0891b2"];

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Primary Particle Wave Grid (130 x 20)
    const cols1 = 130;
    const rows1 = 20;
    const geom1 = buildMorphingGrid(cols1, rows1, 0.23, 0.23, primaryPalette, 4.6);
    const mat1 = new THREE.PointsMaterial({
      size: 0.22,
      map: dotTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const waveMesh1 = new THREE.Points(geom1, mat1);
    mainGroup.add(waveMesh1);

    // Secondary Ambient Particle Grid (90 x 14)
    const cols2 = 90;
    const rows2 = 14;
    const geom2 = buildMorphingGrid(cols2, rows2, 0.33, 0.33, secondaryPalette, 4.0);
    const mat2 = new THREE.PointsMaterial({
      size: 0.16,
      map: dotTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const waveMesh2 = new THREE.Points(geom2, mat2);
    mainGroup.add(waveMesh2);

    // ── 4. Floating 3D Tech & Agent Badges (Inspired by Fiesta Music Notes) ──
    const techTextures = [];
    const techMaterials = [];
    const floatingSprites = [];
    const badgesGroup = new THREE.Group();
    mainGroup.add(badgesGroup);

    // Pre-create textures and materials for all tech & agents
    TECH_NODES.forEach((node) => {
      const tex = createTechBadgeTexture(node);
      techTextures.push(tex);
      const mat = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        opacity: 0.94,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      techMaterials.push(mat);
    });

    const totalFloatingBadges = 55;
    for (let i = 0; i < totalFloatingBadges; i++) {
      const techIdx = i % TECH_NODES.length;
      const mat = techMaterials[techIdx];
      const sprite = new THREE.Sprite(mat);

      // Orbital parameters
      const orbitRadius = 3.2 + (i % 6) * 2.8 + Math.random() * 2.5;
      const angle = (i / totalFloatingBadges) * Math.PI * 2 + Math.random() * 0.5;
      const speed = 0.008 + (Math.random() * 0.018);
      const phase = Math.random() * Math.PI * 2;
      const baseY = -7.5 + ((i % 8) / 7) * 15.0 + (Math.random() - 0.5) * 2.0;

      // Aspect ratio scale for the badge pill (384x128 -> 3:1)
      const baseScale = 0.65 + Math.random() * 0.45;
      sprite.scale.set(baseScale * 2.8, baseScale * 0.95, 1);

      sprite.position.x = Math.cos(angle) * orbitRadius;
      sprite.position.z = Math.sin(angle) * orbitRadius * 0.8;
      sprite.position.y = baseY;

      sprite.userData = {
        orbitRadius,
        angle,
        speed,
        phase,
        baseY,
        baseScale,
        rotSpeed: (Math.random() - 0.5) * 0.008,
      };

      badgesGroup.add(sprite);
      floatingSprites.push(sprite);
    }

    // ── 5. Ambient Stardust Field ─────────────────────────────────────
    const starCount = 500;
    const starGeom = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 10 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);
    }
    starGeom.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.12,
      map: dotTexture,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const starField = new THREE.Points(starGeom, starMat);
    scene.add(starField);

    // ── 6. Animation Loop with Physics & Scroll Velocity ──────────────
    const clock = new THREE.Clock();
    let smoothedScroll = 0;
    let prevScroll = 0;
    let animationFrameId;

    const tempColor = new THREE.Color();

    const updateGridPhysics = (mesh, cols, rows, time, scrollVal, scrollMorph, yOffset = 0) => {
      const posAttr = mesh.geometry.attributes.position;
      const colAttr = mesh.geometry.attributes.color;
      const posArray = posAttr.array;
      const colArray = colAttr.array;
      const { basePlane, baseSphere, baseColors } = mesh.geometry.userData;

      const waveFreq = 0.22 + scrollVal * 0.08;
      const waveAmp = 0.45 + scrollVal * 0.55;

      let idx = 0;
      for (let u = 0; u < cols; u++) {
        for (let v = 0; v < rows; v++) {
          const px = basePlane[idx];
          const pz = basePlane[idx + 2];

          // Trigonometric wave harmonics
          const wave =
            Math.sin(px * waveFreq + pz * 0.18 + time * 1.8) * waveAmp +
            Math.sin((px + pz) * 0.1 + time * 1.1) * (waveAmp * 0.4) +
            Math.cos(px * 0.28 - pz * 0.2 + time * 0.7) * (waveAmp * 0.25);

          const planeX = px;
          const planeY = wave + yOffset;
          const planeZ = pz;

          // Sphere coordinates with ripple expansion
          const sx = baseSphere[idx];
          const sy = baseSphere[idx + 1];
          const sz = baseSphere[idx + 2];
          const sDist = Math.sqrt(sx * sx + sy * sy + sz * sz) || 1;
          const normX = sx / sDist;
          const normY = sy / sDist;
          const normZ = sz / sDist;
          const ripple = wave * 0.55;

          const sphereX = sx + normX * ripple;
          const sphereY = sy + normY * ripple;
          const sphereZ = sz + normZ * ripple;

          // Morph between Plane and Sphere based on scroll
          posArray[idx] = planeX * (1 - scrollMorph) + sphereX * scrollMorph;
          posArray[idx + 1] = planeY * (1 - scrollMorph) + sphereY * scrollMorph;
          posArray[idx + 2] = planeZ * (1 - scrollMorph) + sphereZ * scrollMorph;

          // Dynamic HSL Color Modulation
          if (baseColors) {
            tempColor.setRGB(baseColors[idx], baseColors[idx + 1], baseColors[idx + 2]);
            const hslShift = Math.sin(px * 0.12 + wave * 0.85 + time * 0.9) * 0.08;
            tempColor.offsetHSL(hslShift, 0.05, 0.05);
            colArray[idx] = tempColor.r;
            colArray[idx + 1] = tempColor.g;
            colArray[idx + 2] = tempColor.b;
          }

          idx += 3;
        }
      }

      posAttr.needsUpdate = true;
      if (colAttr) colAttr.needsUpdate = true;
    };

    const tick = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime() * 0.22;

      // Mouse smoothing
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      // Scroll smoothing & velocity tracking
      const targetScroll = Math.max(0, Math.min(1, scrollProgressRef.current));
      smoothedScroll += (targetScroll - smoothedScroll) * 0.08;
      const scrollVelocity = Math.abs(smoothedScroll - prevScroll);
      prevScroll = smoothedScroll;

      // Scroll morph stages (Plane -> Sphere -> Deep Vortex)
      const morphStage1 = cubicEase(smoothedScroll / 0.35);
      const morphStage2 = cubicEase((smoothedScroll - 0.35) / 0.35);
      const morphStage3 = cubicEase((smoothedScroll - 0.7) / 0.3);

      const sphereMorph = cubicEase(Math.min(1, smoothedScroll * 1.7));
      const camZ = 11.5 - morphStage1 * 1.4 - morphStage2 * 4.2 + morphStage3 * 3.2;
      const camY = 0.5 - morphStage1 * 0.3 - morphStage2 * 1.5 + morphStage3 * 1.0;

      // 1. Update Particle Waves
      updateGridPhysics(waveMesh1, cols1, rows1, time, smoothedScroll, sphereMorph, 0);
      updateGridPhysics(waveMesh2, cols2, rows2, time, smoothedScroll, sphereMorph, -0.6);

      // 2. Update Orbiting Tech & Agent Badges
      const scrollSpeedBoost = 1 + scrollVelocity * 32;
      floatingSprites.forEach((sprite) => {
        const d = sprite.userData;
        d.angle += d.speed * scrollSpeedBoost * (1 + delta * 5) * 0.35;

        const effectiveOrbit = d.orbitRadius + scrollVelocity * 7.5;
        sprite.position.x = Math.cos(d.angle) * effectiveOrbit;
        sprite.position.z = Math.sin(d.angle) * effectiveOrbit * 0.82;

        // Wave elevation matching + gentle hover bobbing
        const waveLift = Math.sin(sprite.position.x * 0.2 + sprite.position.z * 0.15 + time * 1.5) * 0.45;
        sprite.position.y =
          d.baseY +
          waveLift +
          Math.sin(d.angle * 2.2 + d.phase) * 0.5 +
          scrollVelocity * 2.5;

        // Subtle dynamic tilt
        sprite.material.rotation = Math.sin(time + d.phase) * 0.12;

        // Interactive mouse repulsion on badges
        const dx = sprite.position.x - mouse.x * 6;
        const dy = sprite.position.y - mouse.y * 4;
        const distSq = dx * dx + dy * dy;
        if (distSq < 16) {
          const dist = Math.sqrt(distSq);
          if (dist > 0.01) {
            const force = ((4 - dist) / 4) * 0.18;
            sprite.position.x += (dx / dist) * force;
            sprite.position.y += (dy / dist) * force;
          }
        }
      });

      // 3. Stardust gentle drift
      starField.rotation.y = -time * 0.03;
      starField.rotation.x = time * 0.015;

      // 4. Main Group & Camera Parallax
      const targetGroupRotY = mouse.x * 0.12 + smoothedScroll * Math.PI * 0.55;
      const targetGroupRotX = -0.55 + morphStage2 * 0.2 + mouse.y * 0.08 + sphereMorph * 0.55;

      mainGroup.rotation.y += (targetGroupRotY - mainGroup.rotation.y) * 0.04;
      mainGroup.rotation.x += (targetGroupRotX - mainGroup.rotation.x) * 0.04;

      const sideOffset = window.innerWidth >= 1024 ? 1.8 + morphStage2 * 1.0 : 0;
      mainGroup.position.x += (sideOffset - mainGroup.position.x) * 0.04;

      camera.position.x += (mouse.x * 0.4 + morphStage1 * 0.2 - camera.position.x) * 0.03;
      camera.position.y += (-mouse.y * 0.25 + camY - camera.position.y) * 0.04;
      camera.position.z += (camZ - camera.position.z) * 0.06;
      camera.lookAt(0.1 + morphStage2 * 0.3, -morphStage1 * 0.2 + sphereMorph * 0.4, 0);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    // ── 7. Resize Handler ─────────────────────────────────────────────
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    };

    window.addEventListener("resize", handleResize);

    // ── 8. Cleanup ────────────────────────────────────────────────────
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      renderer.dispose();
      dotTexture.dispose();
      geom1.dispose();
      mat1.dispose();
      geom2.dispose();
      mat2.dispose();
      starGeom.dispose();
      starMat.dispose();

      techTextures.forEach((t) => t.dispose());
      techMaterials.forEach((m) => m.dispose());

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 bg-[#020617] overflow-hidden">
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-full block" />

      {/* Cyber Ambient Glow Overlays (matching Sandy-Portfolio & Faculty Fiesta) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 15% -5%, rgba(6, 182, 212, 0.22), transparent 55%), radial-gradient(circle at 85% 5%, rgba(16, 185, 129, 0.16), transparent 50%), radial-gradient(circle at 50% 95%, rgba(59, 130, 246, 0.18), transparent 60%)",
        }}
      />

      {/* Translucent dark vignette layer to guarantee optimal text readability */}
      <div className="absolute inset-0 bg-slate-950/65 pointer-events-none" />
    </div>
  );
}
