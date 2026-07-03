"use client";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { random } from "maath";
import { useMemo, useRef } from "react";

function StarField() {
  const ref = useRef<THREE.Points>(null);

  const sphere = useMemo(() => {
    const data = new Float32Array(10000 * 3);
    return random.inSphere(data, { radius: 1.8 }) as Float32Array;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime();
      ref.current.rotation.y = t * 0.05;
      ref.current.rotation.x = t * 0.03;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#38bdf8"
          size={0.003}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending} 
        />
      </Points>
    </group>
  );
}

export default function BackgroundCanvasTemplate() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#020617]">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <StarField />
      </Canvas>
    </div>
  );
}