"use client";
import dynamic from "next/dynamic";

const MathWaveVisualizer = dynamic(
  () => import("@/components/MathWaveVisualizer"),
  { ssr: false }
);

export default function MelodyPage() {
  return (
    <div className="fixed inset-0 w-screen h- bg-[#05050f] z-10">
      <MathWaveVisualizer />
    </div>
  );
}