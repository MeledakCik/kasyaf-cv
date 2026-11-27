"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck, ChevronDown, FlaskConical } from "lucide-react";
import { securityResearch, type Lang } from "@/data/security-research";

const LABELS: Record<Lang, { more: string; less: string }> = {
  en: { more: "Read the full write-up", less: "Hide details" },
  id: { more: "Baca selengkapnya", less: "Sembunyikan detail" },
};

export default function SecurityResearch({ title = "Security Research" }: { title?: string }) {
  const [lang, setLang] = useState<Lang>("id");
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section aria-labelledby="security-research-heading" className="mb-12">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3
          id="security-research-heading"
          className="text-white font-semibold text-base flex items-center gap-2"
        >
          <ShieldCheck size={16} className="text-emerald-400" /> {title}
        </h3>
        <div className="flex gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1" role="group" aria-label="Language">
          {(["id", "en"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider transition-colors cursor-pointer ${
                lang === l ? "bg-white text-black" : "text-white/50 hover:text-white"
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
      {securityResearch.map((r) => {
        const isOpen = open === r.acronym;
        return (
          <article
            key={r.acronym}
            id={r.acronym.toLowerCase()}
            lang={lang}
            className="scroll-mt-20 rounded-2xl bg-[#10101b] border border-white/[0.06] p-6 hover:border-emerald-500/20 transition-colors"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h4 className="text-lg font-bold text-white">
                  {r.acronym}
                  <span className="ml-2 text-sm font-medium text-white/50">{r.name}</span>
                </h4>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-violet-400 font-medium">
                  <FlaskConical size={12} /> {r.type[lang]}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {r.stack.map((s) => (
                  <span
                    key={s}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-4 text-sm text-white/60 leading-relaxed">{r.summary[lang]}</p>

            <ul className="mt-4 space-y-2.5">
              {r.cv[lang].map((b) => (
                <li key={b} className="flex gap-3 text-sm text-white/70 leading-relaxed">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : r.acronym)}
              aria-expanded={isOpen}
              className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-violet-400 hover:underline cursor-pointer"
            >
              {isOpen ? LABELS[lang].less : LABELS[lang].more}
              <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="mt-5 grid gap-5 border-t border-white/[0.06] pt-5 md:grid-cols-2">
                    {r.detail[lang].map((s) => (
                      <div key={s.heading} className="rounded-xl bg-[#0a0a0f] border border-white/[0.04] p-4">
                        <h5 className="text-sm font-semibold text-white">{s.heading}</h5>
                        {s.body && (
                          <p className="mt-2 text-xs text-white/55 leading-relaxed">{s.body}</p>
                        )}
                        {s.points && (
                          <ul className="mt-2 space-y-1.5 list-disc pl-4 text-xs text-white/55 leading-relaxed marker:text-emerald-400">
                            {s.points.map((p) => (
                              <li key={p}>{p}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </article>
        );
      })}
      </div>
    </section>
  );
}
