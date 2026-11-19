"use client";
import { motion } from "framer-motion";

/**
 * Lightweight loader: pure CSS, no remote .lottie file and no WASM player
 * (the previous DotLottie loader pulled ~1 MB of WASM + a third-party fetch
 * just to show a spinner for one second).
 */
export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeInOut" } }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050508]"
      role="status"
      aria-live="polite"
    >
      <div className="loader-orbit" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p className="text-sky-200/50 text-xs tracking-[0.3em] uppercase font-light mt-8">
        Loading...
      </p>
    </motion.div>
  );
}
