"use client";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050508]"
    >
      <div className="w-64 h-64">
        <DotLottieReact
          src="https://lottie.host/2c22458c-3182-4f79-b333-cc4057e09fe0/N9JaTjZ4lr.lottie"
          loop
          autoplay
        />
      </div>
      <p className="text-sky-200/50 text-xs tracking-[0.3em] uppercase font-light mt-4">
        Loading...
      </p>
    </motion.div>
  );
}