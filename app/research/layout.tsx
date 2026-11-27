import Link from "next/link";
import { Poppins } from "next/font/google";
import { ArrowLeft } from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function ResearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${poppins.className} min-h-screen bg-[#05070d] text-[#e2e8f0]`}>
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#05070d]/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 h-14">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Kembali
          </Link>
          <div className="flex items-center gap-5 text-sm">
            <Link href="/profile" className="text-white/50 hover:text-white transition-colors">
              Profile
            </Link>
            <Link href="/experience" className="text-white/50 hover:text-white transition-colors">
              Experience
            </Link>
            <span className="text-white font-medium">Research</span>
          </div>
        </nav>
      </header>

      {children}

      <footer className="mx-auto max-w-6xl px-4 sm:px-6 pb-10">
        <div className="border-t border-white/[0.06] pt-8 text-xs text-white/30">
          <p>© {new Date().getFullYear()} Muhammad Kasyaf Anugrah</p>
        </div>
      </footer>
    </div>
  );
}
