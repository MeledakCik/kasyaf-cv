"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import BackgroundCanvasTemplate from "@/components/Templates/BackgroundCanvas";
export function TiltCard({
  card,
  onClick,
}: {
  card: any;
  onClick: () => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  const opacity = useTransform(mouseYSpring, [-0.5, 0.5], [0.8, 0.95]);
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <motion.div
      layoutId={`card-${card.id}`}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        opacity,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: 1.05 }}
      className="w-64 h-80 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl flex items-center justify-center cursor-pointer shadow-2xl"
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-transparent opacity-50 pointer-events-none" />
      <div
        className="text-center p-6"
        style={{ transform: "translateZ(50px)" }}
      >
        <h2 className="text-xl text-white font-light">{card.title}</h2>
        <p className="text-white/70 mt-2 text-sm">{card.content}</p>
      </div>
    </motion.div>
  );
}
export default function Template() {
  const CARDS = [
    {
      id: "3d",
      title: "3D Model",
      content: "Tampilan 3D dengan interaksi mouse.",
    },
  ];
  return (
    <main className="relative min-h-screen w-full bg-[#020617] flex items-center justify-center">
      <div className="fixed inset-0 z-0">
        <BackgroundCanvasTemplate />
      </div>

      <div className="relative z-10 flex gap-8">
        {CARDS.map((card) => (
          <TiltCard
            key={card.id}
            card={card}
            onClick={() => {}}
          />
        ))}
      </div>
    </main>
  );
}
