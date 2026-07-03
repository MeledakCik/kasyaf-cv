"use client";
import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Poppins } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import { TEMPLATE_CATEGORIES } from "@/lib/templates-data";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(true);

  const activeCategory = searchParams.get("category");
  const goToCategory = (cat: string | null) => {
    router.push(cat ? `/template?category=${cat}` : "/template");
  };

  return (
    <div
      className={`${poppins.className} bg-[#0a0e1a] text-[#e2e8f0] h-screen overflow-hidden select-none`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex h-full"
        >
          <aside className="hidden lg:flex w-72 bg-[#0d1326]/80 backdrop-blur-2xl border-r border-white/10 p-6 flex-col fixed h-full z-50">
            <div
              className="flex items-center gap-3 px-4 mb-10 cursor-pointer"
              onClick={() => router.push("/template")}
            >
              <h1 className="text-2xl font-black tracking-tighter text-blue-500 uppercase">
                TEMPLATE
              </h1>
            </div>

            <nav className="space-y-2">
              <NavItem
                label="Dashboard"
                path="/home"
                active={pathname === "/home"}
              />

              <div className="relative">
                <div
                  onClick={() => setIsTemplatesOpen(!isTemplatesOpen)}
                  className={`px-5 py-3 rounded-[10px] text-xs uppercase tracking-widest cursor-pointer transition-all flex justify-between items-center ${
                    pathname === "/template"
                      ? "bg-white/5 text-white"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Templates
                  <span
                    className={`transition-transform ${isTemplatesOpen ? "rotate-180" : ""}`}
                  >
                    ▼
                  </span>
                </div>

                {isTemplatesOpen && (
                  <div className="pl-8 mt-1 space-y-1 animate-in slide-in-from-top-2">
                    {TEMPLATE_CATEGORIES.map((cat) => (
                      <div
                        key={cat}
                        onClick={() => goToCategory(cat)}
                        className={`px-5 py-3 rounded-[10px] text-xs uppercase tracking-widest cursor-pointer transition-all ${
                          pathname === "/template" && activeCategory === cat
                            ? "text-white font-bold shadow-lg"
                            : "text-white/50 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {cat}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <NavItem
                label="Leaderboard"
                path="/leaderboard"
                active={pathname === "/leaderboard"}
              />
              <NavItem
                label="Back to the beginning"
                path="/"
                active={pathname === "/"}
              />
            </nav>
          </aside>

          <main className="flex-1 lg:ml-72 h-full overflow-y-auto p-8">
            {children}
          </main>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function NavItem({ label, path, active }: any) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(path)}
      className={`px-5 py-3 rounded-[10px] text-xs uppercase tracking-widest cursor-pointer transition-all ${
        active
          ? "bg-indigo-600 text-white font-bold shadow-lg"
          : "text-white/50 hover:text-white hover:bg-white/5"
      }`}
    >
      {label}
    </div>
  );
}
