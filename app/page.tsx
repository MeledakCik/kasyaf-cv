"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { Poppins } from "next/font/google";

const BackgroundCanvas = dynamic(
  () => import("@/components/BackgroundCanvas"),
  { ssr: false },
);
const LoadingScreen = dynamic(() => import("@/components/LoadingScreen"));
const AboutSection = dynamic(() => import("@/components/PageAbout"));

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const glowRef = useRef<HTMLDivElement>(null);

  const name = "KASYAF";

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
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <main
      className={`${poppins.className} bg-black relative min-h-screen w-full overflow-hidden`}
    >
      <motion.div
        className="fixed inset-0"
        animate={
          isTransitioning
            ? { scale: 1.5, opacity: 0 }
            : { scale: 1, opacity: 1 }
        }
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
        <BackgroundCanvas isAbout={showAbout} />
      </motion.div>

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
            <motion.div
              animate={
                isTransitioning
                  ? { scale: 5, opacity: 0, filter: "blur(20px)" }
                  : { scale: 1, opacity: 1 }
              }
              transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
              className="relative z-20 flex h-full flex-col items-center justify-center text-white px-4"
            >
              <h1 className="text-5xl md:text-[160px] font-bold tracking-[-0.05em] text-center leading-none select-none">
                {name.split("").map((char, index) => (
                  <span key={index} className="inline-block">
                    {char}
                  </span>
                ))}
              </h1>

              <p className="text-xs md:text-lg text-sky-200/70 mt-6 mb-12 tracking-[0.2em] uppercase font-medium text-center">
                Full Stack Developer • Cyber Security
              </p>

              <button
                className="relative cursor-pointer px-10 py-4 rounded-full border border-sky-500/30 bg-sky-950/20 backdrop-blur-md text-xs tracking-[0.2em] uppercase pointer-events-auto hover:border-sky-500/80 transition-all"
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
