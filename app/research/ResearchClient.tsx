"use client";

import SecurityResearch from "@/components/sections/SecurityResearch";
import { securityResearch } from "@/data/security-research";

export default function ResearchClient() {
  return (
    <div className="w-full animate-in fade-in duration-500 p-4 sm:p-6 mx-auto max-w-5xl">
      <div className="mb-6 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-black text-white">My Research</h1>
        <p className="text-sm sm:text-base text-white/40 font-medium">
          Kumpulan riset keamanan yang saya kerjakan ({securityResearch.length} riset)
        </p>
      </div>

      <SecurityResearch title="Security Research" />
    </div>
  );
}
