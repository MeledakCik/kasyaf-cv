"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Background from "@/components/BackgroundCanvas";
import { SandEmitter } from "@/components/function/SabdEmitter";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import { RippleButton } from "./ui/ripple-button";

const AboutIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-white/80"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const TemplatesIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-white/80"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const ExperienceIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-white/80"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const CARDS = [
  {
    id: "aboutme",
    title: "About Me",
    content: "Informasi detail tentang saya...",
    icon: <AboutIcon />,
  },
  {
    id: "templates",
    title: "Templates",
    content: "Daftar koleksi template saya",
    icon: <TemplatesIcon />,
  },
  {
    id: "experience",
    title: "Experience",
    content: "Tech stack dan pengalaman kerja",
    icon: <ExperienceIcon />,
  },
];

const NAVIGATE_ROUTES: Record<string, string> = {
  aboutme: "/profile",
  templates: "/template",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
  exit: { opacity: 0 },
};

const cardVariants = {
  hidden: { rotateY: -30, opacity: 0, scale: 0.9 },
  visible: {
    rotateY: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 80, damping: 12, mass: 1 },
  },
} as const;

const BackButton = ({ onClick }: { onClick: () => void }) => {
  const text = "back to the beginning".split("");
  return (
    <SandEmitter>
      <RippleButton
        whileHover="hover"
        initial="initial"
        onClick={onClick}
        rippleColor="bg-[#075985]/50"
        className="px-5 py-2 sm:px-12 sm:py-3 md:px-16 md:py-3 bg-[#075985]/20 border border-[#075985]/40 rounded-full transition-all duration-300 text-xs sm:text-base md:text-lg backdrop-blur-md flex items-center justify-center"
      >
        <motion.div
          className="flex whitespace-nowrap"
          variants={{
            hover: { y: "-100%", opacity: 0 },
            initial: { y: 0, opacity: 1 },
          }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {text.map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
          initial={{ y: "100%" }}
          variants={{ hover: { y: 0 } }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {text.map((char, i) => (
            <span key={i}>{char === " " ? "\u00A0" : char}</span>
          ))}
        </motion.div>
      </RippleButton>
    </SandEmitter>
  );
};

export default function AboutSection({ onClose }: { onClose: () => void }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleNavigate = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    setIsLoading(true);
    setTimeout(() => {
      router.push(path);
    }, 800);
  };

  const handleSelect = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedId(id);
  };

  return (
    <main className="relative select-none h-dvh w-full text-white flex flex-col items-center justify-center overflow-hidden px-4 py-3 sm:px-6 sm:py-12">
      <motion.div
        className="fixed inset-0 pointer-events-none -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Background />
      </motion.div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingScreen />
          </motion.div>
        ) : (
          !selectedId && (
            <motion.div
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              transition={{ duration: 0.3 }}
              className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-3 sm:gap-6 md:gap-8 z-10 w-full max-w-5xl flex-1 min-h-0 sm:flex-none"
            >
              {CARDS.map((card) => {
                const navigateTo = NAVIGATE_ROUTES[card.id];

                return (
                  <motion.div
                    key={card.id}
                    layoutId={navigateTo ? undefined : `card-${card.id}`}
                    variants={cardVariants}
                    onClick={
                      navigateTo
                        ? (e) => handleNavigate(e, navigateTo)
                        : (e) => handleSelect(e, card.id)
                    }
                    className="w-full max-w-sm sm:w-56 md:w-64 h-42 sm:h-72 md:h-80 flex-shrink-0 bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center gap-2 sm:gap-4 md:gap-5 cursor-pointer border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
                    whileHover={
                      navigateTo
                        ? {
                            scale: 1.05,
                            backgroundColor: "rgba(255,255,255,0.1)",
                            borderColor: "rgba(255,255,255,0.2)",
                            boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
                          }
                        : {
                            scale: 1.08,
                            rotateY: 15,
                            z: 50,
                            backgroundColor: "rgba(255,255,255,0.1)",
                            borderColor: "rgba(255,255,255,0.2)",
                            boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
                          }
                    }
                    whileTap={{ scale: 0.95 }}
                    style={{
                      background: "rgba(255, 255, 255, 0.08)",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                    }}
                  >
                    {/* 🟢 Icon Custom */}
                    <div className="w-32 h-28 sm:w-24 sm:h-24 md:w-34 md:h-34 flex-shrink-0 opacity-90 flex items-center justify-center">
                      {card.icon}
                    </div>

                    <div className="text-center">
                      <h2 className="text-sm sm:text-xl md:text-2xl font-light tracking-wide text-white/90 drop-shadow-lg">
                        {card.title}
                      </h2>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )
        )}
      </AnimatePresence>

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex-shrink-0 mt-4 sm:mt-10 md:mt-12"
        >
          <BackButton onClick={onClose} />
        </motion.div>
      )}
    </main>
  );
}