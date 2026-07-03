"use client";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Points, PointMaterial } from "@react-three/drei";
import { random } from "maath";

const noise3D = createNoise3D();

function GalaxyStars() {
  const ref = useRef<THREE.Points>(null);
  const stars = useMemo(
    () => random.inSphere(new Float32Array(3000 * 3), { radius: 10 }),
    [],
  );
  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.y -= delta * 0.05;
  });

  return (
    <Points ref={ref} positions={stars as Float32Array} stride={3}>
      <PointMaterial
        color="#ffffff"
        size={0.02}
        sizeAttenuation={true}
        transparent
        opacity={0.5}
      />
    </Points>
  );
}

function ElectricLines() {
  const count = 60;
  const pointsPerLine = 100;
  const lines = useMemo(
    () =>
      Array.from({ length: count }, () => new Float32Array(pointsPerLine * 3)),
    [],
  );
  const lineRefs = useRef<THREE.Line[]>([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.3;
    lineRefs.current.forEach((line) => {
      if (!line) return;
      const positions = line.geometry.attributes.position.array as Float32Array;
      let x = (Math.random() - 0.5) * 12;
      let y = (Math.random() - 0.5) * 12;
      for (let i = 0; i < pointsPerLine * 3; i += 3) {
        const angle = noise3D(x * 0.2, y * 0.2, t) * Math.PI * 3;
        positions[i] = x;
        positions[i + 1] = y;
        x += Math.cos(angle) * 0.15;
        y += Math.sin(angle) * 0.15;
      }
      line.geometry.attributes.position.needsUpdate = true;
    });
  });

  return (
    <>
      {lines.map((data, i) => (
        <line
          key={i}
          ref={(el) => {
            //@ts-ignore

            if (el) lineRefs.current[i] = el;
          }}
        >
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[data, 3]} />
          </bufferGeometry>
          <lineBasicMaterial
            color="#075985"
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
          />
        </line>
      ))}
    </>
  );
}

function LightningClick() {
  const [clicks, setClicks] = useState<
    { id: number; x: number; y: number; time: number }[]
  >([]);
  const { camera } = useThree();

  const handlePointerDown = (e: any) => {
    const vector = new THREE.Vector3(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1,
      0.5,
    );
    vector.unproject(camera);
    setClicks((prev) => [
      ...prev,
      { id: Date.now(), x: vector.x, y: vector.y, time: 0 },
    ]);
  };

  useFrame((_, delta) => {
    setClicks((prev) =>
      prev
        .map((c) => ({ ...c, time: c.time + delta }))
        .filter((c) => c.time < 0.3),
    );
  });

  return (
    <group onPointerDown={handlePointerDown}>
      <mesh visible={false}>
        <planeGeometry args={[100, 100]} />
      </mesh>
      {clicks.map((c) => (
        //@ts-ignore
        <line key={c.id} position={[c.x, c.y, 0] as any}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[
                new Float32Array([
                  0,
                  0,
                  0,
                  (Math.random() - 0.5) * 2,
                  (Math.random() - 0.5) * 2,
                  0,
                ]),
                3,
              ]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#075985" transparent opacity={0.5} />
        </line>
      ))}
    </group>
  );
}

export default function BackgroundCanvas() {
  return (
    <div
      className="fixed inset-0 -z-10 bg-[#020202] select-none"
      style={{ userSelect: "none" }}
    >
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <GalaxyStars />
        <ElectricLines />
        <LightningClick />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.5}
            intensity={0.8}
            radius={0.2}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
