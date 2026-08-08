"use client";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
}

export default function ExplosionSystem({
  stars,
  setStars,
}: {
  stars: Particle[];
  setStars: React.Dispatch<React.SetStateAction<Particle[]>>;
}) {
  // Fungsi pure untuk menghasilkan angka acak semu dari seed
  const seededRandom = (seed: number): number => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  return (
    <AnimatePresence>
      {stars.map((star) => {
        // Offset deterministik berdasarkan id partikel
        const offsetX = (seededRandom(star.id * 2) - 0.5) * 400;
        const offsetY = (seededRandom(star.id * 2 + 1) - 0.5) * 400;

        return (
          <motion.div
            key={star.id}
            initial={{ left: star.x, top: star.y, opacity: 1, scale: 1 }}
            animate={{
              left: star.x + offsetX,
              top: star.y + offsetY,
              opacity: 0,
              scale: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="fixed z-50 bg-cyan-400 rounded-full pointer-events-none shadow-[0_0_10px_#22d3ee]"
            style={{ width: 8, height: 8 }}
            onAnimationComplete={() =>
              setStars((prev) => prev.filter((s) => s.id !== star.id))
            }
          />
        );
      })}
    </AnimatePresence>
  );
}