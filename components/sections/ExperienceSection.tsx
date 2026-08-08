// components/sections/ExperienceSection.tsx - FULL FIXED VERSION
"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Shield,
  Code,
  Bot,
  ExternalLink,
  X,
  Zap,
  Award,
  User,
  MapPin,
  Mail,
  Sparkles,
  Briefcase,
  Loader2,
  Star,
  GitFork,
} from "lucide-react";
import { SiGithub } from "react-icons/si";
import { Poppins } from "next/font/google";
import Image from "next/image";
import {
  mainExpertise,
  certificates,
  tools,
  experiences,
  type CertificateItem,
} from "@/data/experience";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type LucideIcon = React.ComponentType<{ size?: number; className?: string }>;

const icons: Record<string, LucideIcon> = {
  shield: Shield,
  code: Code,
  bot: Bot,
};

interface TechIcon3DProps {
  name: string;
  icon: LucideIcon;
  color?: string;
  index?: number;
}

interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage?: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
}

const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

function TechIcon3D({
  name,
  icon: IconComponent,
  color = "#8b5cf6",
  index = 0,
}: TechIcon3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const spotlightX = useMotionValue(50);
  const spotlightY = useMotionValue(50);

  const duration = useMemo(() => {
    return 3 + seededRandom(index * 7.3 + 42.1) * 2;
  }, [index]);

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
      initial={{ opacity: 0, y: 15, scale: 0.9 }}
      animate={{
        opacity: 1,
        y: [0, -3, 0],
        scale: 1,
      }}
      transition={{
        opacity: { delay: index * 0.04, duration: 0.3 },
        y: {
          delay: index * 0.04,
          duration: duration,
          repeat: Infinity,
          ease: "easeInOut",
        },
        scale: { delay: index * 0.04, duration: 0.3 },
      }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className="relative group cursor-pointer perspective-1000"
    >
      <motion.div
        className="absolute inset-0 rounded-xl blur-xl -z-10 opacity-0 group-hover:opacity-35 transition-opacity duration-500 pointer-events-none"
        style={{
          backgroundColor: color,
          transform: "translateZ(-15px)",
        }}
      />

      <div
        style={{ transform: "translateZ(40px)" }}
        className="relative flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl bg-[#101011] border border-white/[0.06] group-hover:border-white/[0.15] transition-all duration-300 overflow-hidden shadow-lg"
      >
        <div className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div
            className="absolute -inset-[100%] animate-[spin_4s_linear_infinite]"
            style={{
              background: `conic-gradient(from 0deg at 50% 50%, transparent 0%, transparent 70%, ${color} 90%, #ffffff 100%)`,
            }}
          />
          <div className="absolute inset-[1px] rounded-xl bg-[#101011]" />
        </div>

        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: useTransform(
              [spotlightX, spotlightY],
              ([latestX, latestY]) =>
                `radial-gradient(circle 90px at ${latestX}% ${latestY}%, ${color}26, transparent 70%)`,
            ),
          }}
        />

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent skew-x-12 pointer-events-none" />

        <div className="relative z-10 text-white/60 group-hover:text-white transition-all duration-300 group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]">
          <IconComponent size={22} />
        </div>

        <span className="relative z-10 text-[10px] text-white/30 group-hover:text-white/80 font-medium tracking-wider transition-colors truncate w-full text-center">
          {name}
        </span>

        <div
          className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}`,
          }}
        />
      </div>
    </motion.div>
  );
}

export default function ExperienceSection() {
  const [activeTab, setActiveTab] = useState<"tools" | "experience">("tools");
  const [activeCert, setActiveCert] = useState<CertificateItem | null>(null);

  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchRepos() {
      try {
        setLoading(true);
        const res = await fetch("/api/repos");
        if (!res.ok) throw new Error("Gagal mengambil repositori");

        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          const count = Math.random() < 0.5 ? 3 : 4;
          const shuffled = [...data].sort(() => 0.5 - Math.random());
          setRepos(shuffled.slice(0, Math.min(count, shuffled.length)));
        }
      } catch (err) {
        console.error("Fetch API Error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRepos();
  }, []);

  const workPhotos = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&h=400&auto=format&fit=crop",
      caption: "Kolaborasi & Diskusi Arsitektur Frontend",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&h=400&auto=format&fit=crop",
      caption: "Security Auditing & Code Review",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=600&h=400&auto=format&fit=crop",
      caption: "Optimasi Performa Next.js & Redis",
    },
  ];

  const gradients = [
    "from-purple-900/40 via-violet-800/20 to-black",
    "from-emerald-900/40 via-teal-800/20 to-black",
    "from-blue-900/40 via-indigo-800/20 to-black",
    "from-rose-900/40 via-pink-800/20 to-black",
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${poppins.className} mx-auto max-w-6xl px-4 sm:px-6 pt-12 pb-20`}
    >
      {/* TOP - ABOUT ME & WORK PHOTOS FEATURE */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-3xl bg-gradient-to-br from-[#15151f] to-[#0e0e15] border border-white/[0.07] p-1 mb-12 shadow-2xl overflow-hidden"
      >
        <div className="rounded-[22px] bg-[#0a0a0f] p-5 sm:p-8 flex flex-col md:flex-row gap-6 items-center md:items-center justify-between">
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5 flex-1 w-full text-center sm:text-left">
            <div className="relative group shrink-0">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-violet-500 to-emerald-400 opacity-40 blur-md group-hover:opacity-80 transition duration-500" />
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-white/10 bg-[#12121c] shadow-xl flex items-center justify-center">
                {/* ✅ Gambar LinkedIn - sudah dikonfigurasi di next.config.ts */}
                <Image
                  src="https://media.licdn.com/dms/image/v2/D5603AQElMlzBsWT5ag/profile-displayphoto-scale_200_200/B56ZxCQ8h5GYAY-/0/1770638266986?e=2147483647&v=beta&t=BQ_GhUv_6ThpcW9wjuqcGkpr1F0NVkca0Dvhx_sqm0k"
                  alt="Profile Kasyaf"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 112px, 128px"
                />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Kasyaf — Frontend & Security
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] sm:text-xs font-bold tracking-widest text-emerald-400">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  AVAILABLE FOR WORK
                </span>
              </div>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-white/60 max-w-2xl">
                Indie developer fokus di{" "}
                <span className="text-white font-medium">
                  Web Security Audit & Frontend Performance
                </span>
                . Membangun tools seperti Sentinel-ID & Audit-Otomatis dengan
                Next.js 14 + Redis.
              </p>
              <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2 text-xs text-white/50">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/5">
                  <MapPin size={12} className="text-violet-400" /> Bandung,
                  Indonesia
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/5">
                  <Mail size={12} className="text-violet-400" />{" "}
                  kakangkasyaf@gmail.com
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/5">
                  <User size={12} className="text-violet-400" /> 4y0+ Projects
                  Shipped
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Work Photos Grid */}
        <div className="px-5 sm:px-8 pb-6 sm:pb-8 pt-2">
          <h3 className="text-white font-semibold text-sm flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-violet-400" /> Behind the Code &
            Work Session
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {workPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                className="relative group rounded-2xl overflow-hidden border border-white/15 aspect-[16/10] bg-[#12121c]"
              >
                {/* ✅ Gambar Unsplash - sudah dikonfigurasi di next.config.ts */}
                <Image
                  src={photo.url}
                  alt={photo.caption}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-xs text-white font-medium">
                    {photo.caption}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.3em] text-emerald-400 border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 rounded-full">
            <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
            EXPERIENCE
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-white leading-tight">
            Experience &{" "}
            <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
              Expertise
            </span>
          </h2>
        </div>
      </div>
      <p className="text-sm text-white/50 max-w-xl mb-10 -mt-2 leading-relaxed">
        Perjalanan, skill, dan pencapaian profesional dalam ekosistem digital
        dan keamanan siber.
      </p>

      {/* 3 EXPERTISE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        {mainExpertise.map((item, index) => {
          const Icon = icons[item.icon] || Code;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="group rounded-2xl bg-[#10101b] border border-white/[0.06] p-6 hover:border-violet-500/20 hover:-translate-y-1 transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white group-hover:bg-violet-600 transition-colors">
                <Icon size={18} />
              </div>
              <h4 className="mt-5 text-base font-semibold text-white">
                {item.title}
              </h4>
              <p className="mt-1 text-sm text-white/40 leading-relaxed">
                {item.description}
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-emerald-400 rounded-full"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-white">
                  {item.percent}%
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* FEATURED PROJECTS FROM GITHUB API */}
      <h3 className="text-white font-semibold text-base flex items-center gap-2 mb-4">
        <Zap size={16} className="text-emerald-400" /> Featured Repositories
      </h3>

      {loading ? (
        <div className="flex items-center justify-center py-12 gap-2 text-white/40">
          <Loader2 size={18} className="animate-spin text-emerald-400" />
          <span className="text-xs">Memuat data dari GitHub...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 mb-12">
          {repos.map((p, index) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="rounded-2xl bg-[#10101b] border border-white/[0.06] overflow-hidden hover:border-white/10 transition-all group flex flex-col justify-between"
            >
              <div>
                <div
                  className={`h-24 bg-gradient-to-br ${
                    gradients[index % gradients.length]
                  } relative p-3 flex justify-between items-start`}
                >
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-emerald-400 border border-emerald-500/20">
                    {p.language || "Project"}
                  </span>

                  <div className="flex items-center gap-2 text-[10px] text-white/60 bg-black/40 px-2 py-0.5 rounded-full border border-white/10">
                    <span className="flex items-center gap-0.5">
                      <Star size={10} className="text-yellow-400" />
                      {p.stargazers_count}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <GitFork size={10} />
                      {p.forks_count}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h4
                    className="text-base font-semibold text-white truncate"
                    title={p.name}
                  >
                    {p.name}
                  </h4>
                  <p className="text-sm text-white/40 mt-1 line-clamp-2 min-h-[2.5rem]">
                    {p.description || "Tidak ada deskripsi repositori."}
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5 pt-0 flex gap-4 text-xs font-medium">
                {p.homepage && (
                  <a
                    href={p.homepage}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white flex items-center gap-1 hover:text-emerald-400 transition-colors"
                  >
                    <ExternalLink size={12} />
                    Demo
                  </a>
                )}
                <a
                  href={p.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/40 flex items-center gap-1 hover:text-white transition-colors"
                >
                  <SiGithub size={12} />
                  Code
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* BOTTOM SECTION (CERTIFICATES & TOOLS / EXPERIENCE TABS) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Certificates */}
        <div className="lg:col-span-2 rounded-2xl bg-[#10101b] border border-white/[0.06] p-6">
          <h3 className="text-white font-semibold text-sm flex items-center gap-2 mb-6">
            <Award size={14} className="text-violet-400" /> Sertifikat & Lisensi
          </h3>
          <div className="border-l border-white/10 pl-6 space-y-6">
            {certificates.map((c) => (
              <div key={c.title} className="relative">
                <span className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 bg-violet-500 rounded-full ring-4 ring-violet-500/20" />
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-emerald-400">
                  {c.year}
                </span>
                <h4 className="mt-2 text-sm font-semibold text-white leading-tight">
                  {c.title}
                </h4>
                <p className="text-xs text-white/40 mt-0.5">{c.issuer}</p>
                <button
                  onClick={() => setActiveCert(c)}
                  className="mt-2 text-xs font-medium text-violet-400 hover:underline inline-block cursor-pointer"
                >
                  Lihat Sertifikat →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Tools & Experience Tabs */}
        <div className="lg:col-span-3 rounded-2xl bg-[#10101b] border border-white/[0.06] p-6">
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => setActiveTab("tools")}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-colors ${
                activeTab === "tools"
                  ? "bg-white text-black"
                  : "bg-white/[0.06] text-white/40 border border-white/10 hover:text-white"
              }`}
            >
              TOOLS
            </button>
            <button
              onClick={() => setActiveTab("experience")}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-colors ${
                activeTab === "experience"
                  ? "bg-white text-black"
                  : "bg-white/[0.06] text-white/40 border border-white/10 hover:text-white"
              }`}
            >
              EXPERIENCE
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "tools" ? (
              <motion.div
                key="tools"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-3 sm:grid-cols-5 gap-2.5"
              >
                {tools.map((t, index) => (
                  <TechIcon3D
                    key={t.name}
                    name={t.name}
                    icon={t.Icon}
                    color="#8b5cf6"
                    index={index}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="experience"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="border-l border-white/10 pl-6 space-y-6 my-2"
              >
                {experiences.map((e, idx) => (
                  <div key={idx} className="relative group">
                    <span className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-4 ring-emerald-400/20 group-hover:scale-125 transition-transform" />

                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 font-medium">
                        {e.period}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-white leading-snug">
                      {e.role}
                    </h4>

                    <div className="flex items-center gap-1.5 text-xs text-violet-400 font-medium mt-0.5">
                      <Briefcase size={12} />
                      <span>{e.org}</span>
                    </div>

                    <p className="text-xs text-white/50 mt-2 leading-relaxed bg-[#0a0a0f] p-3 rounded-xl border border-white/[0.04]">
                      {e.desc}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* MODAL CERTIFICATE */}
      <AnimatePresence>
        {activeCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveCert(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#15151f] border border-white/10 rounded-2xl p-5 max-w-lg w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-white font-semibold text-sm truncate pr-2">
                  {activeCert.title}
                </h4>
                <button
                  onClick={() => setActiveCert(null)}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 text-white shrink-0 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="bg-black rounded-xl min-h-[220px] flex items-center justify-center overflow-hidden border border-white/5 p-2 relative">
                {activeCert.image ? (
                  // ✅ Gambar sertifikat - gunakan unoptimized jika domain tidak dikenal
                  <Image
                    src={activeCert.image}
                    alt={activeCert.title}
                    width={500}
                    height={300}
                    className="max-h-[300px] w-full object-contain rounded"
                    unoptimized={
                      !activeCert.image.includes("linkedin") &&
                      !activeCert.image.includes("unsplash")
                    }
                  />
                ) : (
                  <span className="text-white/20 text-xs">
                    Gambar sertifikat belum tersedia
                  </span>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}