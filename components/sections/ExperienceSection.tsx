"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import { SiGithub } from "react-icons/si";
import { Poppins } from "next/font/google";
import {
  mainExpertise,
  featuredProjects,
  certificates,
  tools,
  experiences,
  type CertificateItem,
} from "@/data/experience";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const icons: Record<string, any> = { shield: Shield, code: Code, bot: Bot };

export default function ExperienceSection() {
  const [activeTab, setActiveTab] = useState<"tools" | "experience">("tools");
  const [activeCert, setActiveCert] = useState<CertificateItem | null>(null);

  const workPhotos = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&h=400&auto=format&fit=crop",
      caption: "Kolaborasi & Diskusi Arsitektur Frontend",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1605379399642-8702623c7bb5?q=80&w=600&h=400&auto=format&fit=crop",
      caption: "Security Auditing & Code Review",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=600&h=400&auto=format&fit=crop",
      caption: "Optimasi Performa Next.js & Redis",
    },
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
        <div className="rounded-[22px] bg-[#0a0a0f] p-5 sm:p-8 flex flex-col lg:flex-row gap-6 items-start justify-between">
          {/* Text Profile Section */}
          <div className="flex-1 text-center lg:text-left w-full">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Kasyaf — Frontend & Security
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] sm:text-xs font-bold tracking-widest text-emerald-400">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                AVAILABLE FOR WORK
              </span>
            </div>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-white/60 max-w-2xl mx-auto lg:mx-0">
              Indie developer fokus di{" "}
              <span className="text-white font-medium">
                Web Security Audit & Frontend Performance
              </span>
              . Membangun tools seperti Sentinel-ID & Audit-Otomatis dengan
              Next.js 14 + Redis.
            </p>
            <div className="mt-4 flex flex-wrap justify-center lg:justify-start gap-2 text-xs text-white/50">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/5">
                <MapPin size={12} className="text-violet-400" /> Bandung,
                Indonesia
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/5">
                <Mail size={12} className="text-violet-400" />{" "}
                kasyaf@example.com
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/5">
                <User size={12} className="text-violet-400" /> 20+ Projects
                Shipped
              </span>
            </div>
          </div>
        </div>

        {/* Work Photos / Feature Cards Grid */}
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
                className="relative group rounded-2xl overflow-hidden border border-white/10 aspect-[16/10] bg-[#12121c]"
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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

      {/* FEATURED PROJECTS */}
      <h3 className="text-white font-semibold text-base flex items-center gap-2 mb-4">
        <Zap size={16} className="text-emerald-400" /> Featured Projects
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        {featuredProjects.map((p, index) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="rounded-2xl bg-[#10101b] border border-white/[0.06] overflow-hidden hover:border-white/10 transition-all group"
          >
            <div className={`h-28 bg-gradient-to-br ${p.gradient} relative`}>
              <div className="absolute bottom-2 left-3 text-[10px] font-bold px-2 py-1 rounded-full bg-black/60 text-white border border-white/10">
                LIVE • v1.0
              </div>
            </div>
            <div className="p-5">
              <h4 className="text-base font-semibold text-white truncate">
                {p.title}
              </h4>
              <p className="text-sm text-white/40 mt-1 line-clamp-2">
                {p.description}
              </p>
              <div className="mt-4 flex gap-4 text-xs font-medium">
                <a
                  href={p.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white flex items-center gap-1 hover:text-emerald-400 transition-colors"
                >
                  <ExternalLink size={12} />
                  Demo
                </a>
                <a
                  href={p.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/40 flex items-center gap-1 hover:text-white transition-colors"
                >
                  <SiGithub size={12} />
                  Code
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

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
                className="grid grid-cols-3 sm:grid-cols-5 gap-3"
              >
                {tools.map((t) => (
                  <div
                    key={t.name}
                    className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-[#0a0a0f] border border-white/[0.05] hover:border-white/10 transition-colors"
                  >
                    <t.Icon size={20} className="text-white/70" />
                    <span className="text-[11px] text-white/40 font-medium text-center truncate w-full">
                      {t.name}
                    </span>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="experience"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {experiences.map((e) => (
                  <div
                    key={e.period}
                    className="p-4 rounded-xl bg-[#0a0a0f] border border-white/[0.05]"
                  >
                    <span className="text-xs font-mono text-emerald-400">
                      {e.period}
                    </span>
                    <h4 className="text-sm font-semibold text-white mt-1">
                      {e.role}
                    </h4>
                    <p className="text-xs text-white/40 mt-1 leading-relaxed">
                      {e.org} — {e.desc}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* MODAL / POPUP CERTIFICATE */}
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
              <div className="bg-black rounded-xl min-h-[220px] flex items-center justify-center overflow-hidden border border-white/5 p-2">
                {activeCert.image ? (
                  <img
                    src={activeCert.image}
                    alt={activeCert.title}
                    className="max-h-[300px] w-full object-contain rounded"
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
