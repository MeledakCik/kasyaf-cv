"use client";
import BackgroundCanvasTemplate from "@/components/Templates/TextTreeDCanvas";

export default function Template() {

  return (
    <main className="relative min-h-screen w-full bg-[#020617] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <BackgroundCanvasTemplate />
      </div>
    </main>
  );
}
