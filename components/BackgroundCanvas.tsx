"use client";

import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, PerformanceMonitor } from "@react-three/drei";
import { random } from "maath";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { usePerfProfile, type PerfTier } from "@/lib/perf";

const PARTICLES: Record<PerfTier, number> = { low: 650, mid: 1100, high: 1800 };
const COLOR_HOME = new THREE.Color("#38bdf8");
const COLOR_ABOUT = new THREE.Color("#8b5cf6");

/** Frame-rate independent smoothing factor (same feel at 30, 60 or 120 fps). */
const damp = (lambda: number, delta: number) => 1 - Math.exp(-lambda * delta);

interface StarFieldProps {
  isAbout: boolean;
  count: number;
  reducedMotion: boolean;
  parallax: boolean;
}

const StarField = memo(function StarField({ isAbout, count, reducedMotion, parallax }: StarFieldProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const pointsRef = useRef<THREE.Points>(null!);
  const materialRef = useRef<THREE.PointsMaterial>(null!);
  const speed = useRef(0.01);
  const pointer = useRef({ x: 0, y: 0 });
  const invalidate = useThree((s) => s.invalidate);

  const positions = useMemo(
    () => random.inSphere(new Float32Array(count * 3), { radius: 1.8 }) as Float32Array,
    [count],
  );

  // Fewer particles look sparse; compensate a little with size.
  const size = useMemo(() => 0.003 * (1500 / count) ** 0.25, [count]);

  useEffect(() => {
    if (!parallax) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        pointer.current.x = e.clientX / window.innerWidth - 0.5;
        pointer.current.y = e.clientY / window.innerHeight - 0.5;
        raf = 0;
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [parallax]);

  // Reduced motion: no continuous loop, just snap to the target state.
  useEffect(() => {
    if (!reducedMotion || !pointsRef.current || !materialRef.current) return;
    pointsRef.current.scale.setScalar(isAbout ? 1.5 : 1);
    materialRef.current.color.copy(isAbout ? COLOR_ABOUT : COLOR_HOME);
    invalidate();
  }, [isAbout, reducedMotion, invalidate]);

  useFrame((_, rawDelta) => {
    if (reducedMotion) return;
    const points = pointsRef.current;
    const material = materialRef.current;
    if (!points || !material) return;

    // Clamp so a background tab returning doesn't cause a big jump.
    const delta = Math.min(rawDelta, 1 / 20);

    speed.current += ((isAbout ? 0.05 : 0.012) - speed.current) * damp(2, delta);
    points.rotation.y += delta * speed.current;
    points.rotation.x += delta * speed.current * 0.5;

    const s = THREE.MathUtils.lerp(points.scale.x, isAbout ? 1.5 : 1, damp(3, delta));
    points.scale.setScalar(s);
    material.color.lerp(isAbout ? COLOR_ABOUT : COLOR_HOME, damp(3, delta));

    if (parallax && groupRef.current) {
      const g = groupRef.current;
      g.rotation.x += (pointer.current.y * 0.12 - g.rotation.x) * damp(2.5, delta);
      g.rotation.y += (pointer.current.x * 0.12 - g.rotation.y) * damp(2.5, delta);
    }
  });

  return (
    <group ref={groupRef}>
      <group rotation={[0, 0, Math.PI / 4]}>
        <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
          <PointMaterial
            ref={materialRef}
            color={COLOR_HOME}
            transparent
            size={size}
            sizeAttenuation
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </Points>
      </group>
    </group>
  );
});

export default function BackgroundCanvas({ isAbout = false }: { isAbout?: boolean }) {
  const { tier, reducedMotion, coarsePointer, maxDpr } = usePerfProfile();
  const [dpr, setDpr] = useState(1);

  // Start at 1 and let PerformanceMonitor raise it only if the device keeps up.
  const minDpr = 1;

  return (
    <div className="fixed inset-0 -z-10 bg-[#020617]" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={dpr}
        frameloop={reducedMotion ? "demand" : "always"}
        gl={{
          antialias: false,
          powerPreference: tier === "high" ? "high-performance" : "default",
          stencil: false,
          depth: false,
          alpha: false,
        }}
        onCreated={({ gl }) => gl.setClearColor("#020617")}
      >
        <PerformanceMonitor
          onIncline={() => setDpr(maxDpr)}
          onDecline={() => setDpr(minDpr)}
          flipflops={3}
          onFallback={() => setDpr(minDpr)}
        />
        <StarField
          isAbout={isAbout}
          count={PARTICLES[tier]}
          reducedMotion={reducedMotion}
          parallax={!coarsePointer && !reducedMotion}
        />
      </Canvas>
    </div>
  );
}
