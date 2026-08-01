import ExperienceSection from "@/components/sections/ExperienceSection";

export default function ExperiencePage() {
  return (
    <main className="relative min-h-screen w-full bg-[#05070d]">
      <ExperienceSection />
      <footer className="mx-auto max-w-6xl px-6 pb-10">
        <div className="border-t border-white/[0.06] pt-8 flex justify-between text- text-white/30">
          <p>© 2026 Kasyaf • Built with Next.js</p>
          <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"/> System online</p>
        </div>
      </footer>
    </main>
  );
}