import type { Metadata } from "next";
import ExperienceSection from "@/components/sections/ExperienceSection";

export const metadata: Metadata = {
  title: "Experience & Expertise",
  description:
    "Work experience, expertise, certificates and featured work of Muhammad Kasyaf Anugrah, Full Stack Developer & Cyber Security from Bandung, Indonesia.",
  alternates: { canonical: "/experience" },
};

export default function ExperiencePage() {
  return (
    <main className="relative min-h-screen w-full bg-[#05070d]">
      <ExperienceSection />
      <footer className="mx-auto max-w-6xl px-6 pb-10">
        <div className="border-t border-white/[0.06] pt-8 flex justify-between text- text-white/30">
          <p>© {new Date().getFullYear()} Muhammad Kasyaf Anugrah</p>
          <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"/> System online</p>
        </div>
      </footer>
    </main>
  );
}