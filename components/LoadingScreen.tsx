"use client";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050508]" // Samakan warna background dengan aplikasi Anda
    >
      <div className="w-64 h-64">
        <DotLottieReact
          src="https://lottie.host/2c22458c-3182-4f79-b333-cc4057e09fe0/N9JaTjZ4lr.lottie"
          loop
          autoplay
        />
      </div>
    </motion.div>
  );
}