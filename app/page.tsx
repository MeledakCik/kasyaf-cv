"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BackgroundCanvas from "@/components/BackgroundCanvas";
import ExplosionSystem from "@/components/ExplosionSystem";
import LoadingScreen from "@/components/LoadingScreen";
import AboutSection from "@/components/PageAbout";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [stars, setStars] = useState<{ id: number; x: number; y: number }[]>(
    [],
  );
  const [showAbout, setShowAbout] = useState(false);

  const name = "KASYAF";

  const handleEnter = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowAbout(true);
    }, 700);
  };

  const handleExplosion = (e: React.MouseEvent) => {
    const newStars = Array.from({ length: 15 }).map((_, i) => ({
      id: Date.now() + i,
      x: e.clientX,
      y: e.clientY,
    }));
    setStars((prev) => [...prev, ...newStars].slice(-60));
  };
  const handleClose = () => {
    setShowAbout(false);
    setIsTransitioning(false);
  };

  const nameVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 10 },
    },
  };

  const containerVariants = {
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const buttonVariants = {
    initial: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: {
      scale: 1.05,
      borderColor: "rgba(56, 189, 248, 0.8)",
      boxShadow: "0 0 30px rgba(56, 189, 248, 0.3)",
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
    },
    tap: { scale: 0.95 },
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        setMousePosition({ x: touch.clientX, y: touch.clientY });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <main
      className={`${poppins.className} relative min-h-screen w-full overflow-hidden`}
      onClick={handleExplosion}
    >
      <motion.div
        className="fixed inset-0"
        animate={
          isTransitioning
            ? { scale: 1.5, opacity: 0 }
            : { scale: 1, opacity: 1 }
        }
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
        <BackgroundCanvas />
      </motion.div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loader" />
        ) : !showAbout ? (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative h-screen w-full"
          >
            <ExplosionSystem stars={stars} setStars={setStars} />

            <div
              className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle 70px at ${mousePosition.x}px ${mousePosition.y}px, rgba(30, 64, 175, 0.15), transparent 70%)`,
              }}
            />

            <motion.div
              animate={
                isTransitioning
                  ? { scale: 5, opacity: 0, filter: "blur(20px)" }
                  : { scale: 1, opacity: 1 }
              }
              transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
              className="relative z-20 flex h-full flex-col items-center justify-center text-white px-4 sm:px-6 md:px-10"
            >
              <motion.h1
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[160px] font-bold tracking-[-0.03em] sm:tracking-[-0.05em] select-none text-center leading-none"
              >
                {name.split("").map((char, index) => (
                  <motion.span
                    key={index}
                    variants={nameVariants}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-[11px] xs:text-xs sm:text-sm md:text-base lg:text-lg text-sky-200/70 mt-4 sm:mt-6 mb-8 sm:mb-12 tracking-[0.15em] sm:tracking-[0.2em] uppercase font-medium select-none text-center px-2"
              >
                Full Stack Developer • Front End & Back End • Cyber Security
              </motion.p>

              <motion.button
                variants={buttonVariants}
                initial="initial"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
                transition={{ delay: 0.1 }}
                className="relative cursor-pointer overflow-hidden px-6 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4 rounded-full border border-sky-500/30 bg-sky-950/20 backdrop-blur-md text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEnter();
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-sky-500/20"
                  variants={{ hover: { scale: [1, 1.5], opacity: [0.5, 0] } }}
                  transition={{ duration: 0.8, ease: "circOut" }}
                />
                <span className="relative z-10 select-none whitespace-nowrap">
                  Enter the profile
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="about"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 select-none"
          >
            <AboutSection onClose={handleClose} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
