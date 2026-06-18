"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, useState } from "react";
import * as THREE from "three";
import "./PlanetShader"; // register procedural shaders

const SUN_POS = [0, -2.5, -115];

// Accurate config for our custom procedural planets (positioned to fly past the sides)
const PLANETS = [
  {
    name: "Neptune",
    type: 7,
    radius: 0.6,
    pos: [2.5, 0.2, 100],
    baseColor: new THREE.Color(0x0f2a6b),
    detailColor: new THREE.Color(0x08163a),
    accentColor: new THREE.Color(0x2d68c4),
    rotSpeed: 0.15,
    glowColor: new THREE.Color(0x2563eb)
  },
  {
    name: "Uranus",
    type: 6,
    radius: 0.65,
    pos: [-2.6, -0.2, 75],
    baseColor: new THREE.Color(0x56a6a6),
    detailColor: new THREE.Color(0x2d6b6b),
    accentColor: new THREE.Color(0x8cd3d3),
    rotSpeed: 0.12,
    tilt: [0.1, 0, 0.4],
    hasRings: true,
    glowColor: new THREE.Color(0x2dd4bf)
  },
  {
    name: "Saturn",
    type: 5,
    radius: 0.85,
    pos: [2.8, 0.3, 50],
    baseColor: new THREE.Color(0x8c7855),
    detailColor: new THREE.Color(0x594c33),
    accentColor: new THREE.Color(0xbfa57d),
    rotSpeed: 0.22,
    hasSaturnRings: true,
    glowColor: new THREE.Color(0xf59e0b)
  },
  {
    name: "Jupiter",
    type: 4,
    radius: 1.3,
    pos: [-3.2, 0.4, 25],
    baseColor: new THREE.Color(0x8a6e45),
    detailColor: new THREE.Color(0x5c4222),
    accentColor: new THREE.Color(0xcfa370),
    rotSpeed: 0.28,
    glowColor: new THREE.Color(0xea580c)
  },
  {
    name: "Mars",
    type: 3,
    radius: 0.45,
    pos: [2.0, -0.2, -5],
    baseColor: new THREE.Color(0x8c3315),
    detailColor: new THREE.Color(0x4a1807),
    accentColor: new THREE.Color(0xbf6747),
    rotSpeed: 0.1,
    glowColor: new THREE.Color(0xef4444)
  },
  {
    name: "Earth",
    type: 2,
    radius: 0.65,
    pos: [-2.2, 0.2, -35],
    baseColor: new THREE.Color(0x0f3460),
    detailColor: new THREE.Color(0x228b22),
    accentColor: new THREE.Color(0x8b5a2b),
    rotSpeed: 0.15,
    hasMoon: true,
    glowColor: new THREE.Color(0x60a5fa)
  },
  {
    name: "Venus",
    type: 1,
    radius: 0.6,
    pos: [2.0, 0.1, -65],
    baseColor: new THREE.Color(0x8c5e26),
    detailColor: new THREE.Color(0xbf8b4e),
    accentColor: new THREE.Color(0xd9b273),
    rotSpeed: -0.05,
    glowColor: new THREE.Color(0xfacc15)
  },
  {
    name: "Mercury",
    type: 0,
    radius: 0.38,
    pos: [-1.6, -0.1, -85],
    baseColor: new THREE.Color(0x404040),
    detailColor: new THREE.Color(0x1a1a1a),
    accentColor: new THREE.Color(0x666666),
    rotSpeed: 0.08,
    glowColor: new THREE.Color(0x94a3b8)
  }
];

// Cinematic Camera Path Keyframes - Expanded scale linear bypass trajectory
const KEYFRAMES = [
  { p: 0.0, pos: [0, 0.2, 125], target: [0, 0.2, -220] },    // Neptune approaching
  { p: 0.12, pos: [0, 0.2, 100], target: [0, 0.2, -220] },    // Straight past Neptune
  { p: 0.24, pos: [0, 0.2, 75], target: [0, 0.2, -220] },    // Straight past Uranus
  { p: 0.38, pos: [0, 0.2, 50], target: [0, 0.2, -220] },    // Straight past Saturn
  { p: 0.52, pos: [0, 0.2, 25], target: [0, 0.2, -220] },    // Straight past Jupiter
  { p: 0.64, pos: [0, 0.2, -5], target: [0, 0.2, -220] },    // Straight past Mars
  { p: 0.74, pos: [0, 0.2, -35], target: [0, 0.2, -220] },    // Straight past Earth
  { p: 0.84, pos: [0, 0.2, -65], target: [0, 0.2, -220] },    // Straight past Venus
  { p: 0.88, pos: [0, 0.2, -85], target: [0, 0.2, -220] },    // Straight past Mercury
  { p: 0.94, pos: [0, 2.2, -115], target: [0, 0.2, -220] },    // Clear Sun by rising slightly
  { p: 1.0, pos: [0, 0.0, -170], target: [0, 0.0, -220] }     // Face Galaxy directly
];

// Eased lerp based on scroll progress
function getInterpolatedState(p) {
  p = Math.max(0, Math.min(1, p));
  let i = 0;
  for (; i < KEYFRAMES.length - 1; i++) {
    if (p >= KEYFRAMES[i].p && p <= KEYFRAMES[i + 1].p) {
      break;
    }
  }
  const k1 = KEYFRAMES[i];
  const k2 = KEYFRAMES[i + 1];
  const t = (p - k1.p) / (k2.p - k1.p);
  const smoothT = t * t * (3 - 2 * t); // ease-in-out

  const pos = new THREE.Vector3().fromArray(k1.pos).lerp(new THREE.Vector3().fromArray(k2.pos), smoothT);
  const target = new THREE.Vector3().fromArray(k1.target).lerp(new THREE.Vector3().fromArray(k2.target), smoothT);

  return { pos, target };
}

// ----------------- Procedural Starry Sky Dome Mesh -----------------
function StarrySky() {
  const ref = useRef(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.uTime = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh scale={240}>
      <sphereGeometry args={[1, 32, 32]} />
      <starrySkyMaterial ref={ref} side={THREE.BackSide} depthWrite={false} />
    </mesh>
  );
}

// ----------------- Procedural Solid Disk Spiral Galaxy Mesh -----------------
function SpiralGalaxy({ opacity }) {
  const ref = useRef(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.uTime = state.clock.getElapsedTime();
    }
  });

  if (opacity <= 0) return null;

  return (
    <group position={[0, 0, -220]}>
      {/* Volumetric central core glow */}
      <mesh>
        <sphereGeometry args={[2.0, 32, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={opacity * 0.4} />
      </mesh>

      {/* Nebula haze clouds background */}
      <mesh scale={7}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={opacity * 0.14} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Solid Circular Disk Galaxy Plane */}
      <mesh rotation={[-0.45, 0.4, 0.12]}>
        <planeGeometry args={[36, 36]} />
        <spiralGalaxyMaterial ref={ref} transparent depthWrite={false} blending={THREE.AdditiveBlending} uOpacity={opacity} />
      </mesh>
    </group>
  );
}

// ----------------- Solar Planets (Solid Meshes + Atmospheric Halos) -----------------
function PlanetKeyed({ planet, sunPos }) {
  const meshRef = useRef(null);
  const cloudRef = useRef(null);
  const moonRef = useRef(null);

  const matRef = useRef(null);
  const cloudMatRef = useRef(null);
  const ringMatRef = useRef(null);
  const glowMatRef = useRef(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * planet.rotSpeed;
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y += delta * (planet.rotSpeed * 1.15);
      cloudRef.current.rotation.x += delta * 0.01;
    }
    if (matRef.current) {
      matRef.current.uTime = state.clock.getElapsedTime();
    }
    if (cloudMatRef.current) {
      cloudMatRef.current.uTime = state.clock.getElapsedTime();
    }

    if (moonRef.current) {
      const time = state.clock.getElapsedTime() * 0.45;
      moonRef.current.position.x = Math.sin(time) * 1.4;
      moonRef.current.position.z = Math.cos(time) * 1.4;
      moonRef.current.rotation.y = time;
    }

    // Camera clipping distance-based opacity fade
    const camPos = state.camera.position;
    const planetPos = new THREE.Vector3(...planet.pos);
    const dist = camPos.distanceTo(planetPos);

    const minThreshold = planet.radius * 1.4;
    const maxThreshold = planet.radius * 2.4;

    let targetOpacity = 1;
    if (dist < maxThreshold) {
      targetOpacity = Math.max(0, (dist - minThreshold) / (maxThreshold - minThreshold));
    }

    let currentOpacity = matRef.current ? matRef.current.uOpacity : 1;
    let nextOpacity = THREE.MathUtils.lerp(currentOpacity, targetOpacity, delta * 9);
    if (Math.abs(nextOpacity - targetOpacity) < 0.01) nextOpacity = targetOpacity;

    if (matRef.current) matRef.current.uOpacity = nextOpacity;
    if (cloudMatRef.current) cloudMatRef.current.uOpacity = nextOpacity;
    if (ringMatRef.current) ringMatRef.current.uOpacity = nextOpacity;
    if (glowMatRef.current) glowMatRef.current.uOpacity = nextOpacity;
  });

  return (
    <group position={planet.pos} rotation={planet.tilt || [0, 0, 0]}>
      {/* Solid Atmospheric Fresnel Halo Glow */}
      <mesh scale={planet.radius * 1.16}>
        <sphereGeometry args={[1, 32, 32]} />
        <atmosphereGlowMaterial ref={glowMatRef} transparent depthWrite={false} blending={THREE.AdditiveBlending} uGlowColor={planet.glowColor} uIntensity={1.4} />
      </mesh>

      {/* Planet Surface Sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[planet.radius, 48, 48]} />
        <planetMaterial
          ref={matRef}
          transparent
          uType={planet.type}
          uBaseColor={planet.baseColor}
          uDetailColor={planet.detailColor}
          uAccentColor={planet.accentColor}
          uSunPos={sunPos}
        />
      </mesh>

      {/* Cloud layer (Earth only) */}
      {planet.name === "Earth" && (
        <mesh ref={cloudRef} scale={1.012}>
          <sphereGeometry args={[planet.radius, 48, 48]} />
          <earthCloudsMaterial ref={cloudMatRef} transparent depthWrite={false} uSunPos={sunPos} />
        </mesh>
      )}

      {/* Moon (Earth only) */}
      {planet.hasMoon && (
        <group ref={moonRef}>
          <mesh position={[1.4, 0, 0]} scale={0.24}>
            <sphereGeometry args={[planet.radius, 24, 24]} />
            <meshStandardMaterial color="#888888" roughness={0.9} metalness={0.1} />
          </mesh>
        </group>
      )}

      {/* Vertical Ring (Uranus only) */}
      {planet.tilt && planet.hasRings && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[planet.radius * 1.35, planet.radius * 1.45, 64]} />
          <meshBasicMaterial color="#a5f3fc" transparent opacity={0.12} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      )}

      {/* Gorgeous Rings (Saturn only) */}
      {planet.hasSaturnRings && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[planet.radius * 1.35, planet.radius * 2.5, 64]} />
          <saturnRingMaterial ref={ringMatRef} transparent side={THREE.DoubleSide} uRingColor={planet.accentColor} />
        </mesh>
      )}
    </group>
  );
}

// ----------------- Glowing Sun Mesh -----------------
function SunKeyed({ sunPos }) {
  const sunRef = useRef(null);
  const coronaRef = useRef(null);
  const glowMatRef = useRef(null);

  const matRef = useRef(null);
  const coronaMatRef = useRef(null);

  useFrame((state, delta) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += delta * 0.04;
    }
    if (matRef.current) {
      matRef.current.uTime = state.clock.getElapsedTime();
    }

    // Distance-based fade
    const camPos = state.camera.position;
    const sPos = new THREE.Vector3(...sunPos);
    const dist = camPos.distanceTo(sPos);

    const minThreshold = 4.2; // Sun radius is 3
    const maxThreshold = 6.0;

    let targetOpacity = 1;
    if (dist < maxThreshold) {
      targetOpacity = Math.max(0, (dist - minThreshold) / (maxThreshold - minThreshold));
    }

    let currentOpacity = matRef.current ? matRef.current.uOpacity : 1;
    let nextOpacity = THREE.MathUtils.lerp(currentOpacity, targetOpacity, delta * 9);
    if (Math.abs(nextOpacity - targetOpacity) < 0.01) nextOpacity = targetOpacity;

    if (matRef.current) matRef.current.uOpacity = nextOpacity;
    if (coronaMatRef.current) coronaMatRef.current.uOpacity = nextOpacity;
    if (glowMatRef.current) glowMatRef.current.uOpacity = nextOpacity;
  });

  return (
    <group position={sunPos}>
      {/* Giant Atmospheric Fresnel Corona Glow */}
      <mesh scale={3.4}>
        <sphereGeometry args={[1, 32, 32]} />
        <atmosphereGlowMaterial ref={glowMatRef} transparent depthWrite={false} blending={THREE.AdditiveBlending} uGlowColor={new THREE.Color(0xfb923c)} uIntensity={0.5} />
      </mesh>

      {/* Convection Surface */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[3.0, 64, 64]} />
        <livingSunMaterial ref={matRef} transparent />
      </mesh>

      {/* Corona Atmosphere */}
      <mesh ref={coronaRef} scale={1.05}>
        <sphereGeometry args={[3.0, 32, 32]} />
        <sunCoronaMaterial ref={coronaMatRef} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Main light emitted by the Sun */}
      <pointLight intensity={2.8} distance={120} color="#ffdfbb" />
    </group>
  );
}

// ----------------- Core Solar Rig -----------------
function SolarRig({ scrollYProgress }) {
  const cameraTarget = useRef(new THREE.Vector3(0, 0, 0));
  const [galaxyOpacity, setGalaxyOpacity] = useState(0);

  useFrame((state, delta) => {
    const progress = scrollYProgress.get(); // 0.0 to 1.0

    const { pos, target } = getInterpolatedState(progress);

    state.camera.position.lerp(pos, delta * 3.2);
    cameraTarget.current.lerp(target, delta * 3.2);
    state.camera.lookAt(cameraTarget.current);

    // Smoothly fade in the spiral galaxy as we bypass the Sun
    let targetGalOpacity = 0;
    if (progress > 0.88) {
      targetGalOpacity = Math.min(1.0, (progress - 0.88) / 0.11);
    }
    setGalaxyOpacity(targetGalOpacity);
  });

  return (
    <>
      <StarrySky />

      {PLANETS.map((p) => (
        <PlanetKeyed key={p.name} planet={p} sunPos={SUN_POS} />
      ))}

      <SunKeyed sunPos={SUN_POS} />

      <SpiralGalaxy opacity={galaxyOpacity} />
    </>
  );
}

export default function AntigravityScene({ scrollYProgress, onLoaded }) {
  return (
    <div className="fixed inset-0 w-full h-[100vh] -z-10 pointer-events-none overflow-hidden bg-black">
      <Canvas
        camera={{ position: [0, 0.2, 125], fov: 32 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        onCreated={() => onLoaded && onLoaded()}
      >
        {/* Soft background ambient fill */}
        <ambientLight intensity={0.16} />

        {/* Soft fill lighting following the camera slightly to illuminate dark side features */}
        <directionalLight position={[2, 3, 5]} intensity={0.48} color="#cbd5e1" />

        <SolarRig scrollYProgress={scrollYProgress} />
      </Canvas>
    </div>
  );
}
