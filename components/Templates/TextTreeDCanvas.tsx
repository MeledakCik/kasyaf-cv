"use client";

import { useFrame, Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Text3D, Center } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// ---------- Fungsi seeded random (deterministik) ----------
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// ---------- Komponen Teks 3D ----------
function TextOrb({
  text,
  color,
  basePosition,
}: {
  text: string;
  color: string;
  basePosition: [number, number, number];
}) {
  const group = useRef<THREE.Group>(null!);
  return (
    <group ref={group} position={basePosition}>
      <Center>
        <Text3D
          font="/fonts/Poppins_ExtraBold.json"
          size={1.5}
          height={0.5}
          bevelEnabled={true}
          bevelSize={0.03}
          bevelThickness={0.04}
          curveSegments={32}
        >
          {text}
          <meshPhysicalMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.2}
            roughness={0.2}
            metalness={0.1}
            toneMapped={false}
          />
        </Text3D>
      </Center>
      <pointLight color={color} intensity={2} distance={3} />
    </group>
  );
}

// ---------- Konfigurasi bintang warp ----------
const STAR_COUNT = 6000;
const WARP_SPEED = 6;
const FAR_Z = -300;
const NEAR_Z = 40;

// ---------- Komponen bintang (dengan perbaikan) ----------
function WarpStars() {
  const linesRef = useRef<THREE.LineSegments>(null!);

  // 1. Buat array posisi dan warna (hanya sekali, pure)
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(STAR_COUNT * 2 * 3);
    const col = new Float32Array(STAR_COUNT * 2 * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      const idx = i * 6;
      // warna: gradasi biru ke putih (bisa disesuaikan)
      col[idx] = 0.15;
      col[idx + 1] = 0.15;
      col[idx + 2] = 0.18;
      col[idx + 3] = 1.0;
      col[idx + 4] = 1.0;
      col[idx + 5] = 1.0;
    }
    return { positions: pos, colors: col };
  }, []);

  // 2. Data bintang disimpan di ref (boleh dimutasi di useFrame)
  const starsRef = useRef(
    Array.from({ length: STAR_COUNT }).map((_, i) => {
      const seed = i * 1000 + 12345;
      return {
        ang: seededRandom(seed) * Math.PI * 2,
        r: 0.3 + seededRandom(seed + 1) * 1.0,
        z: FAR_Z + seededRandom(seed + 2) * (NEAR_Z - FAR_Z),
        prevX: 0,
        prevY: 0,
        prevZ: 0,
        first: true,
      };
    })
  );

  // 3. Animasi di setiap frame
  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const posAttr = linesRef.current.geometry.attributes
      .position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    const stars = starsRef.current;

    for (let i = 0; i < STAR_COUNT; i++) {
      const s = stars[i];
      s.z += WARP_SPEED * dt;
      if (s.z > NEAR_Z) {
        s.z = FAR_Z;
        s.ang = Math.random() * Math.PI * 2;
        s.r = 0.3 + Math.random() * 1.0;
        s.first = true;
      }
      const lateral = s.r * (1 + (s.z - FAR_Z) * 0.06);
      const x = Math.cos(s.ang) * lateral;
      const y = Math.sin(s.ang) * lateral * 0.55;
      const z = s.z;

      const idx = i * 6;
      if (s.first) {
        arr[idx] = x;
        arr[idx + 1] = y;
        arr[idx + 2] = z;
        s.first = false;
      } else {
        arr[idx] = s.prevX;
        arr[idx + 1] = s.prevY;
        arr[idx + 2] = s.prevZ;
      }
      arr[idx + 3] = x;
      arr[idx + 4] = y;
      arr[idx + 5] = z;

      s.prevX = x;
      s.prevY = y;
      s.prevZ = z;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}

// ---------- Canvas utama ----------
export default function BackgroundCanvas() {
  return (
    <div className="absolute inset-0 -z-10 bg-[#020617]">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 1.5, 17], fov: 50 }}>
        <fog attach="fog" args={["#020617", 14, 30]} />
        <directionalLight position={[3, 4, 6]} intensity={1.1} />
        <ambientLight intensity={0.25} color="#223344" />
        <Environment preset="night" />
        <group position={[0, 0, 0]}>
          <TextOrb text="M" color="#ffffff" basePosition={[-6, 0, 0]} />
          <TextOrb text="KASYAF" color="#ffffff" basePosition={[0, 0, 0]} />
          <TextOrb text="A" color="#ffffff" basePosition={[6, 0, 0]} />
        </group>
        <WarpStars />
        <OrbitControls
          enablePan={false}
          minDistance={7}
          maxDistance={30}
          autoRotate={false}
          autoRotateSpeed={0.4}
          enableDamping
          dampingFactor={0.08}
        />
        <EffectComposer>
          <Bloom
            intensity={0.5}
            luminanceThreshold={0.5}
            luminanceSmoothing={0.7}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}