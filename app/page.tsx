"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { Poppins } from "next/font/google";
import LoadingScreen from "@/components/LoadingScreen";

const BackgroundCanvas = dynamic(
  () => import("@/components/BackgroundCanvas"),
  { ssr: false, loading: () => <div className="fixed inset-0 bg-[#020617]" /> }
);

const AboutSection = dynamic(() => import("@/components/PageAbout"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black" />,
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: false,
});

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const handleEnter = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowAbout(true);
    }, 700);
  }, []);

  const handleClose = useCallback(() => {
    setShowAbout(false);
    setIsTransitioning(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Cursor glow only for mouse/trackpad; batched to one style write per frame.
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const root = document.documentElement;
    let raf = 0;
    let x = 0;
    let y = 0;
    const handler = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        root.style.setProperty("--x", x + "px");
        root.style.setProperty("--y", y + "px");
        raf = 0;
      });
    };
    window.addEventListener("pointermove", handler, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handler);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <main
      className={`${poppins.className} bg-black relative min-h-screen w-full overflow-hidden`}
    >
      {/* One persistent WebGL canvas for the whole flow: the "enter" transition
          is a warp of the same star field instead of fading it out and
          spinning up a second WebGL context. */}
      {/* z-0 wrapper = own stacking context, so the canvas (-z-10 inside)
          paints above <main>'s black background instead of behind it. */}
      <div className="fixed inset-0 z-0">
        <BackgroundCanvas isAbout={isTransitioning || showAbout} />
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loader" />
        ) : !showAbout ? (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative h-screen w-full"
          >
            <div
              className="pointer-events-none fixed inset-0 z-10"
              style={{
                background: `radial-gradient(circle 70px at var(--x, 50%) var(--y, 50%), rgba(30, 64, 175, 0.15), transparent 70%)`,
              }}
            />

            <motion.div
              animate={
                isTransitioning
                  ? { scale: 1.8, opacity: 0 }
                  : { scale: 1, opacity: 1 }
              }
              transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
              className="relative z-20 flex h-full flex-col items-center justify-center text-white px-4"
            >
              <h1 className="text-[clamp(3.5rem,12vw,160px)] font-bold tracking-[-0.05em] text-center leading-none select-none">
                KASYAF
              </h1>
              <p className="text-base md:text-lg text-sky-200/70 mt-6 mb-12 tracking-[0.2em] uppercase font-medium text-center">
                Full Stack Developer • Cyber Security
              </p>
              <button
                type="button"
                className="relative cursor-pointer px-8 py-3 md:px-10 md:py-4 rounded-full border border-sky-500/30 bg-sky-950/20 backdrop-blur-md text-sm md:text-base tracking-[0.2em] uppercase pointer-events-auto hover:border-sky-500/80 hover:bg-sky-900/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 transition-colors"
                onClick={handleEnter}
              >
                Enter the profile
              </button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="about"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 select-none"
          >
            <AboutSection onClose={handleClose} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}