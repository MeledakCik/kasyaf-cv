"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

interface TechIcon3DProps {
  name: string;
  icon: any;
  color?: string;
  index?: number; // penting buat stagger
}

export function TechIcon3D({ name, icon: IconComponent, color = "#8b5cf6", index = 0 }: TechIcon3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  
  const spotlightX = useMotionValue(50);
  const spotlightY = useMotionValue(50);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
    spotlightX.set((mouseX / rect.width) * 100);
    spotlightY.set((mouseY / rect.height) * 100);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    spotlightX.set(50);
    spotlightY.set(50);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      // UPGRADE 1 & 2: Stagger + Floating
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        y: [0, -4, 0], // floating loop
        scale: 1 
      }}
      transition={{
        opacity: { delay: index * 0.05, duration: 0.4 },
        y: { 
          delay: index * 0.05,
          duration: 3 + Math.random() * 2, // biar gak sinkron
          repeat: Infinity, 
          ease: "easeInOut" 
        },
        scale: { delay: index * 0.05, duration: 0.4 }
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative group cursor-pointer"
    >
      {/* UPGRADE 3: Shadow 3D yang ngikutin tilt */}
      <motion.div 
        className="absolute inset-0 rounded-2xl blur-2xl -z-10 opacity-0 group-hover:opacity-40 transition-opacity duration-500"
        style={{ backgroundColor: color, transform: "translateZ(-20px)" }}
      />

      <div
        style={{ transform: "translateZ(50px)" }}
        className="relative flex flex-col items-center justify-center gap-3 p-5 rounded-2xl bg-[#101011] border border-white/[0.06] group-hover:border-white/[0.15] transition-all duration-300 overflow-hidden"
      >
        {/* Spotlight */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: useTransform(
              [spotlightX, spotlightY],
              ([latestX, latestY]) =>
                `radial-gradient(circle 120px at ${latestX}% ${latestY}%, ${color}26, transparent 70%)`
            ),
          }}
        />
        
        {/* UPGRADE 4: Shine sweep pas hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent skew-x-12 pointer-events-none" />

        {/* Icon */}
        <div className="relative z-10 text-white/60 group-hover:text-white transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
          <IconComponent size={28} />
        </div>

        <span className="relative z-10 text- text-white/30 group-hover:text-white/80 font-medium tracking-widest transition-colors">
          {name}
        </span>

        {/* UPGRADE 5: Dot status kecil */}
        <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full opacity-60 group-hover:opacity-100" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
      </div>
    </motion.div>
  );
}

// CARA PAKAI DI GRID:
// {techStacks.map((tech, i) => <TechIcon3D key={tech.name} index={i} {...tech} />)}