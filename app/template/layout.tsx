"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  const isGalaxy = pathname === "/template/GalaxyStarField";

  const [isTemplatesOpen, setIsTemplatesOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const goTo = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <div
      className={`${poppins.className} bg-[#0a0e1a] text-[#e2e8f0] h-screen overflow-hidden select-none`}
    >
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-[#0d1326]/90 backdrop-blur-xl border-b border-white/10">
        <div onClick={() => goTo("/template")} className="cursor-pointer">
          <h1 className="text-lg font-black text-blue-500">TEMPLATE</h1>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open menu"
          className="flex flex-col items-center justify-center gap-1.5 w-10 h-10 rounded-lg hover:bg-white/5 transition"
        >
          <span className="block w-5 h-0.5 bg-white/80 rounded-full" />
          <span className="block w-5 h-0.5 bg-white/80 rounded-full" />
          <span className="block w-5 h-0.5 bg-white/80 rounded-full" />
        </button>
      </header>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden fixed top-0 left-0 z-50 w-72 max-w-[80vw] h-full bg-[#0d1326] border-r border-white/10 p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-10">
                <h1
                  onClick={() => goTo("/template")}
                  className="text-2xl font-black text-blue-500 cursor-pointer"
                >
                  TEMPLATE
                </h1>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-white/60 text-xl"
                >
                  ✕
                </button>
              </div>

              <SidebarNav
                pathname={pathname}
                isTemplatesOpen={isTemplatesOpen}
                setIsTemplatesOpen={setIsTemplatesOpen}
                onNavigate={goTo}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex h-full"
        >
          <aside className="hidden lg:flex w-72 bg-[#0d1326]/80 backdrop-blur-2xl border-r border-white/10 p-6 flex-col fixed h-full">
            <div
              onClick={() => router.push("/template")}
              className="cursor-pointer mb-10"
            >
              <h1 className="text-2xl font-black text-blue-500">TEMPLATE</h1>
            </div>

            <SidebarNav
              pathname={pathname}
              isTemplatesOpen={isTemplatesOpen}
              setIsTemplatesOpen={setIsTemplatesOpen}
              onNavigate={router.push}
            />
          </aside>

          <main
            className={`flex-1 h-full overflow-y-auto pt-16 lg:pt-0 ${
              isGalaxy ? "p-0 lg:p-0" : "lg:ml-72 p-4 sm:p-6 lg:p-8"
            }`}
          >
            {children}
          </main>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SidebarNav({
  pathname,
  isTemplatesOpen,
  setIsTemplatesOpen,
  onNavigate,
}: {
  pathname: string;
  isTemplatesOpen: boolean;
  setIsTemplatesOpen: (v: boolean) => void;
  onNavigate: (path: string) => void;
}) {
  return (
    <nav className="space-y-2 overflow-y-auto">
      <NavItem
        label="Dashboard"
        path="/home"
        active={pathname === "/home"}
        onNavigate={onNavigate}
      />

      <div>
        <div
          onClick={() => setIsTemplatesOpen(!isTemplatesOpen)}
          className="px-5 py-3 rounded-lg cursor-pointer flex justify-between text-white/70 hover:bg-white/5"
        >
          Templates
          <span className={`transition ${isTemplatesOpen ? "rotate-180" : ""}`}>
            ▼
          </span>
        </div>

        {isTemplatesOpen && (
          <div className="pl-5 mt-2 space-y-1">
            <div
              onClick={() => onNavigate("/template")}
              className="px-4 py-2 cursor-pointer hover:bg-white/5 rounded-lg"
            >
              All
            </div>

            {TEMPLATE_CATEGORIES.map((cat) => (
              <div
                key={cat}
                onClick={() => onNavigate(`/template?category=${cat}`)}
                className="px-4 py-2 cursor-pointer hover:bg-white/5 rounded-lg"
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
        onNavigate={onNavigate}
      />

      <NavItem
        label="Back"
        path="/"
        active={pathname === "/"}
        onNavigate={onNavigate}
      />
    </nav>
  );
}

function NavItem({
  label,
  path,
  active,
  onNavigate,
}: {
  label: string;
  path: string;
  active: boolean;
  onNavigate: (path: string) => void;
}) {
  return (
    <div
      onClick={() => onNavigate(path)}
      className={`px-5 py-3 rounded-lg cursor-pointer transition ${
        active ? "bg-indigo-600 text-white" : "text-white/50 hover:bg-white/5"
      }`}
    >
      {label}
    </div>
  );
}
