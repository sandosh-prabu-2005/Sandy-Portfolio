"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * ThreeBackground
 * ---------------
 * A sparse, gently drifting star-field rendered on a fixed canvas
 * behind all page content. Design goals:
 *   - Low particle count (900) so the scene stays calm.
 *   - Very slow rotation so it never distracts.
 *   - Subtle teal/cyan hue on ~15 % of particles; rest are white/grey.
 *   - Mild parallax on mouse move.
 *   - Zero frame-rate aggression: uses requestAnimationFrame naturally.
 */
export default function ThreeBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const el = mountRef.current;
    if (!el) return;

    // ── Renderer ──────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0x000000, 0); // transparent — body bg shows through
    el.appendChild(renderer.domElement);

    // ── Scene / Camera ────────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, el.clientWidth / el.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // ── Particles ─────────────────────────────────────────────────────────
    const TOTAL   = 900;
    const geo     = new THREE.BufferGeometry();
    const pos     = new Float32Array(TOTAL * 3);
    const colors  = new Float32Array(TOTAL * 3);
    const sizes   = new Float32Array(TOTAL);

    const white  = new THREE.Color("#c8d8e8");
    const grey   = new THREE.Color("#6b7f92");
    const teal   = new THREE.Color("#14b8a6");
    const cyan   = new THREE.Color("#22d3ee");

    for (let i = 0; i < TOTAL; i++) {
      // Spread across a wide cube so edges are never empty
      pos[i * 3]     = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;

      // ~15 % teal/cyan; rest neutral
      const r = Math.random();
      const c = r < 0.08 ? teal : r < 0.15 ? cyan : r < 0.55 ? white : grey;
      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      // Vary sizes slightly for depth cue
      sizes[i] = 0.6 + Math.random() * 1.4;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color",    new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("size",     new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
      size:         0.06,
      vertexColors: true,
      transparent:  true,
      opacity:       0.55,   // keep it muted
      sizeAttenuation: true,
      depthWrite:   false,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // ── Mouse parallax ────────────────────────────────────────────────────
    const mouse = { x: 0, y: 0 };
    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);

    // ── Resize ────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // ── Animation loop ────────────────────────────────────────────────────
    let raf;
    const clock = new THREE.Clock();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Very slow group drift
      points.rotation.y = t * 0.012;
      points.rotation.x = t * 0.007;

      // Gentle parallax
      camera.position.x += (mouse.x * 0.25 - camera.position.x) * 0.02;
      camera.position.y += (-mouse.y * 0.25 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize",    onResize);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full z-0 pointer-events-none"
    />
  );
}
