"use client";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
}

export default function ExplosionSystem({ stars, setStars }: { stars: Particle[], setStars: React.Dispatch<React.SetStateAction<Particle[]>> }) {
  return (
    <AnimatePresence>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          initial={{ left: star.x, top: star.y, opacity: 1, scale: 1 }}
          animate={{
            left: star.x + (Math.random() - 0.5) * 400,
            top: star.y + (Math.random() - 0.5) * 400,
            opacity: 0,
            scale: 0,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="fixed z-50 bg-cyan-400 rounded-full pointer-events-none shadow-[0_0_10px_#22d3ee]"
          style={{ width: 8, height: 8 }}
          onAnimationComplete={() => setStars((prev) => prev.filter((s) => s.id !== star.id))}
        />
      ))}
    </AnimatePresence>
  );
}