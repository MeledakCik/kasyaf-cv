import { useMotionValue, useSpring, useTransform } from "framer-motion";
import { motion } from "framer-motion";
import Image from "next/image";

export function TiltCard({ card, onClick }: { card: any, onClick?: () => void }) {
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
      className="max-w-4xl h-80 backdrop-blur-md border border-gray-800 rounded-3xl flex flex-col items-center cursor-pointer shadow-2xl overflow-hidden"
    >
      <div className="h-48 w-full relative overflow-hidden rounded-t-3xl">
        <Image
          src={card.image} 
          alt={card.title}
          fill
          priority
          className="object-cover"
          style={{ transform: "translateZ(20px)" }}
        />
      </div>
      <div
        className="p-4 text-center flex-1 flex flex-col justify-center"
        style={{ transform: "translateZ(50px)" }}
      >
        <h2 className="text-xl text-white font-medium">{card.title}</h2>
        <p className="text-white/60 text-xs mt-1">{card.category}</p>
      </div>
    </motion.div>
  );
}
