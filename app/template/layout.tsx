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

  const [isTemplatesOpen, setIsTemplatesOpen] =
    useState(true);

  return (
    <div
      className={`${poppins.className} bg-[#0a0e1a] text-[#e2e8f0] h-screen overflow-hidden`}
    >
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
              <h1 className="text-2xl font-black text-blue-500">
                TEMPLATE
              </h1>
            </div>

            <nav className="space-y-2">
              <NavItem
                label="Dashboard"
                path="/home"
                active={pathname === "/home"}
              />

              <div>
                <div
                  onClick={() =>
                    setIsTemplatesOpen(!isTemplatesOpen)
                  }
                  className="px-5 py-3 rounded-lg cursor-pointer flex justify-between text-white/70 hover:bg-white/5"
                >
                  Templates

                  <span
                    className={`transition ${
                      isTemplatesOpen
                        ? "rotate-180"
                        : ""
                    }`}
                  >
                    ▼
                  </span>
                </div>

                {isTemplatesOpen && (
                  <div className="pl-5 mt-2 space-y-1">
                    <div
                      onClick={() =>
                        router.push("/template")
                      }
                      className="px-4 py-2 cursor-pointer hover:bg-white/5 rounded-lg"
                    >
                      All
                    </div>

                    {TEMPLATE_CATEGORIES.map((cat) => (
                      <div
                        key={cat}
                        onClick={() =>
                          router.push(
                            `/template?category=${cat}`
                          )
                        }
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
                active={
                  pathname === "/leaderboard"
                }
              />

              <NavItem
                label="Back"
                path="/"
                active={pathname === "/"}
              />
            </nav>
          </aside>

          <main className="flex-1 lg:ml-72 overflow-auto p-8">
            {children}
          </main>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function NavItem({
  label,
  path,
  active,
}: {
  label: string;
  path: string;
  active: boolean;
}) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(path)}
      className={`px-5 py-3 rounded-lg cursor-pointer transition ${
        active
          ? "bg-indigo-600 text-white"
          : "text-white/50 hover:bg-white/5"
      }`}
    >
      {label}
    </div>
  );
}