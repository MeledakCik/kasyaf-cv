"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Reveal from "../animations/Reveal";

interface Repo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  language: string | null;
  topics: string[];
  owner: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRepos() {
      try {
        setError(null);
        const res = await fetch("/api/repos");

        if (!res.ok) throw new Error("Gagal mengambil data repository");

        const data = await res.json();
        if (Array.isArray(data)) {
          setProjects(data);
        }
      } catch (err: any) {
        setError("Gagal memuat repository GitHub.");
      } finally {
        setLoading(false);
      }
    }

    fetchRepos();
  }, []);

  return (
    <section
      id="projects"
      className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28"
    >
      <Reveal>
        <span
          className="text-[#39e6b5] text-xs uppercase tracking-[0.28em]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Projects
        </span>
        <h2
          className="mt-2 sm:mt-4 text-2xl font-semibold text-[#eaf0fb] sm:text-4xl"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          GitHub Repositories
        </h2>
      </Reveal>

      {loading ? (
        <div className="mt-8 sm:mt-12 text-center text-[#7c8aac] text-sm sm:text-base">
          Loading repositories...
        </div>
      ) : error ? (
        <div className="mt-8 sm:mt-12 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center text-red-400 text-xs sm:text-sm">
          {error}
        </div>
      ) : (
        /* Grid Layout: 1 kolom di HP, 2 kolom di Tablet (md), 3 kolom di Desktop lebar (lg) */
        <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.05}>
              <motion.a
                href={p.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-[#1f2c45] bg-[#101b30]/50 p-5 sm:p-7 transition-all duration-300 hover:border-[#39e6b5]/30 hover:bg-[#101b30]/70"
                whileHover={{ y: -4 }}
              >
                <div>
                  {/* Header Card: Stack vertikal di layar super kecil (xs), flex horizontal di sm ke atas */}
                  <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-2 xs:gap-4">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] text-[#39e6b5] block uppercase font-mono mb-0.5 sm:mb-1">
                        @{p.owner}
                      </span>
                      <h3
                        className="text-base sm:text-lg font-semibold text-[#eaf0fb] truncate group-hover:text-[#39e6b5] transition-colors"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                        title={p.name}
                      >
                        {p.name}
                      </h3>
                    </div>

                    <span
                      className="self-start shrink-0 rounded-full border border-[#39e6b5]/30 bg-[#39e6b5]/10 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[10px] uppercase tracking-widest text-[#39e6b5]"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {p.language || "Code"}
                    </span>
                  </div>

                  {/* Deskripsi: Mencegah overflow teks dan mempertahankan line spacing */}
                  <p
                    className="mt-2.5 sm:mt-3 text-[#7c8aac] text-xs sm:text-sm leading-relaxed break-words [overflow-wrap:anywhere] line-clamp-3"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {p.description}
                  </p>
                </div>

                {/* Badges Topics/Tags */}
                {p.topics && p.topics.length > 0 && (
                  <ul className="mt-4 sm:mt-5 flex flex-wrap gap-1.5 sm:gap-2 pt-2 sm:pt-3 border-t border-[#1f2c45]/50">
                    {p.topics.slice(0, 4).map((topic, idx) => (
                      <li
                        key={topic}
                        className="text-[10px] sm:text-[11px] text-[#7c8aac]"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        #{topic}
                        {idx < Math.min(p.topics.length, 4) - 1 && (
                          <span className="ml-1.5 sm:ml-2 text-[#1f2c45]">
                            /
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.a>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
