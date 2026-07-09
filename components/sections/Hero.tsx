"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GitGraph, Link2OffIcon, Mail } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="top"
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
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Available for work
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] mb-3"
              style={{ fontFamily: "'Poppins', sans-serif" }}
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
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Full Stack Developer &amp; Cyber Security Enthusiast
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
              className="text-sm text-[#7c8aac]/60 max-w-lg leading-relaxed"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Building secure, scalable, and beautiful web experiences
              <br />
              <span className="text-xs">
                B.Tech in Information Technology · Universitas Komputer
                Indonesia
              </span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
              className="flex flex-wrap items-center justify-start gap-2 mt-5 mb-8"
            >
              {[
                "Full Stack",
                "Front End",
                "Back End",
                "Cyber Security",
                "REST APIs",
                "Bug Tracking",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-[11px] rounded-full border border-[#1f2c45]/40 bg-[#101b30]/30 text-[#7c8aac]/80 backdrop-blur-sm"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
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
                href="#about"
                className="group inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#39e6b5] text-[#05070d] text-sm font-medium transition-all hover:bg-[#39e6b5]/90 hover:shadow-[0_0_30px_rgba(57,230,181,0.2)]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                About Me
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#projects"
                className="group inline-flex items-center gap-2 px-8 py-3 rounded-full border border-[#1f2c45]/40 text-[#eaf0fb] text-sm transition-all hover:border-[#39e6b5]/30 hover:text-[#39e6b5] hover:bg-[#39e6b5]/5"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                View Projects
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.55, ease: "easeOut" }}
              className="flex items-center justify-start gap-4 mt-8"
            >
              {[
                { icon: GitGraph, href: "https://github.com/K4K4NG", label: "GitHub" },
                {
                  icon: Link2OffIcon,
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
                  className="p-2 rounded-full border border-[#1f2c45]/30 text-[#7c8aac]/60 hover:text-[#39e6b5] hover:border-[#39e6b5]/30 transition-all duration-300"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="relative flex-shrink-0 hidden lg:block"
          >
            <motion.div
              className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96"
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
            >
              <motion.div
                className="absolute inset-0 rounded-2xl bg-[#39e6b5]/5 blur-2xl"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#39e6b5]/10 bg-gradient-to-br from-[#39e6b5]/5 to-transparent p-[2px] shadow-2xl shadow-[#39e6b5]/5">
                <div className="w-full h-full rounded-2xl overflow-hidden bg-[#05070d]">
                  <Image
                    src="/images/profile.png"
                    alt="Muhammad Kasyaf Profile"
                    width={500}
                    height={500}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    priority
                    sizes="(max-width: 768px) 256px, (max-width: 1024px) 320px, 384px"
                  />
                </div>
              </div>
              <motion.div
                className="absolute -inset-4 rounded-2xl border border-[#39e6b5]/5"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#39e6b5]/30" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
                className="absolute -top-4 -right-4 bg-[#101b30]/80 backdrop-blur-sm border border-[#39e6b5]/10 rounded-lg px-3 py-1.5"
              >
                <span
                  className="text-[11px] text-[#39e6b5]/70"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  🚀 5+ Years
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.85, ease: "easeOut" }}
                className="absolute -bottom-3 -left-3 bg-[#101b30]/80 backdrop-blur-sm border border-[#1f2c45]/30 rounded-lg px-3 py-1.5"
              >
                <span
                  className="text-[11px] text-[#7c8aac]/70"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  <span className="text-[#39e6b5]/60">✦</span> 30+ Projects
                </span>
              </motion.div>
              <div className="absolute -top-1.5 -left-1.5 w-5 h-5 border-t border-l border-[#39e6b5]/10 rounded-tl" />
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 border-t border-r border-[#39e6b5]/10 rounded-tr" />
              <div className="absolute -bottom-1.5 -left-1.5 w-5 h-5 border-b border-l border-[#39e6b5]/10 rounded-bl" />
              <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 border-b border-r border-[#39e6b5]/10 rounded-br" />
            </motion.div>
          </motion.div>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-full bg-gradient-to-b from-transparent to-[#05070d] z-[3]" />
    </section>
  );
}
