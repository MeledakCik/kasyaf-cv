"use client";

import { useSyncExternalStore } from "react";

export type PerfTier = "low" | "mid" | "high";

export interface PerfProfile {
  tier: PerfTier;
  reducedMotion: boolean;
  coarsePointer: boolean;
  /** Max device pixel ratio worth rendering at for this device. */
  maxDpr: number;
}

const DEFAULT_PROFILE: PerfProfile = {
  tier: "mid",
  reducedMotion: false,
  coarsePointer: false,
  maxDpr: 1.25,
};

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

/**
 * Cheap, synchronous device classification. Runs once on the client.
 * Signals: CPU cores, RAM (Chromium only), Save-Data, slow network,
 * screen size and pointer type.
 */
export function detectPerfProfile(): PerfProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;

  const nav = navigator as NavigatorWithHints;
  const cores = nav.hardwareConcurrency || 4;
  const memory = nav.deviceMemory ?? 4;
  const saveData = !!nav.connection?.saveData;
  const slowNet = /(^|-)2g$|^3g$/.test(nav.connection?.effectiveType || "");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const smallScreen = Math.min(window.innerWidth, window.innerHeight) < 500;

  let tier: PerfTier = "high";
  if (saveData || slowNet || cores <= 2 || memory <= 2) tier = "low";
  else if (cores <= 4 || memory <= 4 || (coarsePointer && smallScreen)) tier = "mid";

  const maxDpr = tier === "low" ? 1 : tier === "mid" ? 1.25 : 1.75;
  return { tier, reducedMotion, coarsePointer, maxDpr };
}

let cached: PerfProfile | null = null;

export function getPerfProfile(): PerfProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  if (!cached) cached = detectPerfProfile();
  return cached;
}

function subscribe(onChange: () => void): () => void {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const handler = () => {
    cached = { ...getPerfProfile(), reducedMotion: mq.matches };
    onChange();
  };
  mq.addEventListener("change", handler);
  return () => mq.removeEventListener("change", handler);
}

/** React hook; DEFAULT_PROFILE on the server, the real (cached) profile on the client. */
export function usePerfProfile(): PerfProfile {
  return useSyncExternalStore(subscribe, getPerfProfile, () => DEFAULT_PROFILE);
}
