"use client";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { random } from "maath";
import { useMemo, useRef, memo } from "react";

const StarField = memo(({ isAbout }: { isAbout: boolean }) => {
  const ref = useRef<THREE.Points>(null!);
  const materialRef = useRef<THREE.PointsMaterial>(null!);
  const sphere = useMemo(() => {
    const data = new Float32Array(1500 * 3);
    return random.inSphere(data, { radius: 1.8 }) as Float32Array;
  }, []);

  const targetColor = useMemo(() => {
    return isAbout ? new THREE.Color("#8b5cf6") : new THREE.Color("#38bdf8");
  }, [isAbout]);

  useFrame((state, delta) => {
    if (!ref.current || !materialRef.current) return;

    const targetSpeed = isAbout ? 0.05 : 0.01;
    ref.current.rotation.y += delta * targetSpeed;
    ref.current.rotation.x += delta * (targetSpeed / 2);

    const targetScale = isAbout ? 1.5 : 1;
    ref.current.scale.setScalar(
      THREE.MathUtils.lerp(ref.current.scale.x, targetScale, 0.05)
    );
    materialRef.current.color.lerp(targetColor, 0.05);
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          ref={materialRef}
          transparent
          size={0.003}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
});
StarField.displayName = "StarField";

export default function BackgroundCanvas({ isAbout = false }: { isAbout?: boolean }) {
  return (
    <div className="fixed inset-0 -z-10 bg-[#020617]">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={1}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
          alpha: false,
        }}
        key="bg-canvas"
      >
        <StarField isAbout={isAbout} />
      </Canvas>
    </div>
  );
}