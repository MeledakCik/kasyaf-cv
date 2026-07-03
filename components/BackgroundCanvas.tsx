import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Float } from "@react-three/drei";
import { random } from "maath";
import { useMemo, useRef } from "react";

function StarField({ isAbout }: { isAbout: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const { mouse } = useThree();

  const sphere = useMemo(() => {
    const data = new Float32Array(6000 * 3);
    return random.inSphere(data, { radius: 1.8 }) as Float32Array;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      const targetSpeed = isAbout ? 0.05 : 0.01;
      ref.current.rotation.y += delta * targetSpeed;
      ref.current.rotation.x += delta * (targetSpeed / 2);
      ref.current.scale.lerp(new THREE.Vector3(isAbout ? 1.5 : 1, isAbout ? 1.5 : 1, isAbout ? 1.5 : 1), 0.05);
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={isAbout ? "#8b5cf6" : "#38bdf8"}
          size={0.003}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending} 
        />
      </Points>
    </group>
  );
}

export default function BackgroundCanvas({ isAbout = false }: { isAbout?: boolean }) {
  return (
    <div className="fixed inset-0 -z-10 bg-[#020617]">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ambientLight intensity={0.5} />
        <StarField isAbout={isAbout} />
      </Canvas>
    </div>
  );
}