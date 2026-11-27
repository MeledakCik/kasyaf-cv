"use client";

import { motion } from "framer-motion";
import BrandMark from "@/components/BrandMark";
import { PROJECTS } from "@/data/projects";
import Link from "next/link";
import { ArrowRight, Mail, MapPin } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";

// Distinct platforms the shipped products run on (Cloud is hosting, not a platform).
const PLATFORM_COUNT = new Set(PROJECTS.flatMap((p) => p.platforms).filter((x) => x !== "Cloud")).size;

export default function Hero() {
  return (
    <section
      id="profile"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 sm:px-6 py-20"
    >
      <div className="relative z-10 container mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-20">
          <div className="flex-1 text-left w-full">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#39e6b5]/15 bg-[#39e6b5]/5 backdrop-blur-sm mb-6"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39e6b5] opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#39e6b5]" />
              </span>
              <span
                className="text-[11px] text-[#39e6b5]/80 tracking-[0.2em] uppercase"
                style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
              >
                Available for work
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] mb-3"
              style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
            >
              <span className="text-[#eaf0fb]">Muhammad</span>
              <br />
              <span className="bg-gradient-to-r from-[#39e6b5]/90 via-[#39e6b5]/70 to-[#39e6b5]/50 bg-clip-text text-transparent">
                Kasyaf
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-base sm:text-lg text-[#7c8aac] mb-2 max-w-lg leading-relaxed"
              style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
            >
              Full Stack Developer &amp; Cyber Security Enthusiast
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
              className="text-sm text-[#7c8aac]/60 max-w-lg leading-relaxed"
              style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
            >
              I build secure products end to end: Android, iOS and Windows apps, cloud
              platforms and the web, with security designed in from day one.
              <br />
              <span className="mt-2 inline-flex items-center gap-1.5 text-xs">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                Bandung, Indonesia · Information Technology, Universitas Komputer Indonesia
              </span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
              className="flex flex-wrap items-center justify-start gap-2 mt-5 mb-8"
            >
              {[
                "Next.js",
                "TypeScript",
                "Kotlin",
                "C# .NET",
                "Cloud & DevOps",
                "Cyber Security",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-[11px] rounded-full border border-[#1f2c45]/40 bg-[#101b30]/30 text-[#7c8aac]/80 backdrop-blur-sm"
                  style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
                >
                  {tag}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
              className="flex flex-wrap items-center justify-start gap-4"
            >
              <Link
                href="#projects"
                className="group inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#39e6b5] text-[#05070d] text-sm font-medium transition-all hover:bg-[#39e6b5]/90 hover:shadow-[0_0_30px_rgba(57,230,181,0.2)]"
                style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
              >
                View Projects
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#contact"
                className="group inline-flex items-center gap-2 px-8 py-3 rounded-full border border-[#1f2c45]/40 text-[#eaf0fb] text-sm transition-all hover:border-[#39e6b5]/30 hover:text-[#39e6b5] hover:bg-[#39e6b5]/5"
                style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
              >
                Get in Touch
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.55, ease: "easeOut" }}
              className="flex items-center justify-start gap-4 mt-8"
            >
              {[
                { icon: FaGithub, href: "https://github.com/MeledakCik", label: "GitHub" },
                {
                  icon: FaLinkedinIn,
                  href: "https://www.linkedin.com/in/muhammad-kasyaf-anugrah/",
                  label: "LinkedIn",
                },
                { icon: Mail, href: "mailto:kakangkasyaf@gmail.com", label: "Email" },
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full border border-[#1f2c45]/50 text-[#9fb0cf] hover:text-[#39e6b5] hover:border-[#39e6b5]/30 transition-all duration-300"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                >
                  <social.icon className="w-[18px] h-[18px]" aria-hidden="true" />
                </motion.a>
              ))}
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative hidden w-full max-w-sm flex-shrink-0 lg:block xl:max-w-md"
          >
            <div className="pointer-events-none absolute -inset-6 rounded-[32px] bg-[#3b82f6]/10 blur-3xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-3xl border border-[#1f2c45] bg-[#0a1120]/90 shadow-2xl shadow-black/40 backdrop-blur-sm">
              <div className="flex items-center gap-4 border-b border-[#1f2c45]/70 p-6">
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-[#1f2c45] bg-[#05070d]">
                  <BrandMark className="h-11 w-11" title="Kasyaf logo" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-[#eaf0fb]">Muhammad Kasyaf Anugrah</p>
                  <p className="mt-0.5 text-xs text-[#7c8aac]">Full Stack Developer · Cyber Security</p>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-[#9fb0cf]">
                    <MapPin className="h-3 w-3" aria-hidden="true" /> Bandung, Indonesia · Remote
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 divide-x divide-[#1f2c45]/70 border-b border-[#1f2c45]/70 text-center">
                {[
                  { value: String(PROJECTS.length), label: "Live products" },
                  { value: String(PLATFORM_COUNT), label: "Platforms" },
                  { value: "5+", label: "Years" },
                ].map((s) => (
                  <div key={s.label} className="px-3 py-4">
                    <p className="text-xl font-semibold text-[#eaf0fb]">{s.value}</p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-[#7c8aac]">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="p-6">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.24em] text-[#39e6b5]">Shipped &amp; in use</p>
                <ul className="space-y-2.5">
                  {PROJECTS.slice(0, 4).map((p) => (
                    <li key={p.slug} className="flex items-center gap-3">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: p.accent }} aria-hidden="true" />
                      <span className="flex-1 truncate text-sm text-[#c3cde3]">{p.name}</span>
                      <span className="shrink-0 text-[10px] text-[#7c8aac]">{p.status}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-full bg-gradient-to-b from-transparent to-[#05070d] z-[3]" />
    </section>
  );
}
