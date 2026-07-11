"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const MathWaveVisualizer = dynamic(
  () => import("@/components/MathWaveVisualizer"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-[#05050f]">
        <div className="text-[#dcc8ff] text-xl">Loading Visualizer...</div>
      </div>
    ),
  },
);

export default function MelodyPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-full bg-[#05050f]">
        <div className="text-[#dcc8ff] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#05050f] overflow-hidden">
      <MathWaveVisualizer />
    </div>
  );
}
