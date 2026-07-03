"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export const SandEmitter = ({ children }: { children: React.ReactNode }) => {
  const [particles, setParticles] = useState<any[]>([]);
  const spawnSand = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newParticle = {
      id: Date.now(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    setParticles((prev) => [...prev, newParticle]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 800);
  };

  return (
    <div
      onMouseMove={spawnSand}
      className="relative overflow-hidden rounded-full inline-block"
    >
      {children}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, y: p.y, x: p.x }}
          animate={{ opacity: 0, y: p.y + 30 }}
          className="absolute w-1.5 h-1.5 bg-sky-300 rounded-full pointer-events-none z-0"
        />
      ))}
    </div>
  );
};