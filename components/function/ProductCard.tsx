import { useMotionValue, useSpring, useTransform } from "framer-motion";
import { motion } from "framer-motion";
import Image from "next/image";
import type { Product } from "@/lib/products-data";

export function ProductCard({ product }: { product: Product }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      whileHover={{ scale: 1.03 }}
      className="flex h-full flex-col overflow-hidden rounded-3xl border border-gray-800 bg-[#0d1326]/60 backdrop-blur-md shadow-2xl"
    >
      <div className="h-44 sm:h-48 w-full relative overflow-hidden">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover"
          style={{ transform: "translateZ(20px)" }}
        />
      </div>

      <div
        className="flex flex-1 flex-col p-4 sm:p-5"
        style={{ transform: "translateZ(40px)" }}
      >
        <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold">
          {product.category}
        </span>
        <h2 className="mt-1 text-lg font-semibold text-white">
          {product.title}
        </h2>
        <p className="mt-2 text-sm text-white/50 leading-relaxed line-clamp-3 flex-1">
          {product.description}
        </p>

        <a
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-indigo-500"
        >
          Lihat Produk
        </a>
      </div>
    </motion.div>
  );
}
