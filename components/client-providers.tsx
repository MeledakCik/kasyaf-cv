"use client";

import { MotionConfig } from "framer-motion";
import { useEffect } from "react";
import { getPerfProfile } from "@/lib/perf";

/**
 * - Honors the OS "reduce motion" setting for every framer-motion animation.
 * - Tags <html data-perf="low|mid|high"> so CSS can drop expensive effects
 *   (backdrop-filter, big blurs) on weaker devices.
 */
export default function ClientProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const { tier } = getPerfProfile();
    document.documentElement.dataset.perf = tier;
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
