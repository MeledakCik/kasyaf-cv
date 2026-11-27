"use client";

import { useState } from "react";
import { ArrowRight, ShieldCheck, FlaskConical, FileLock2 } from "lucide-react";
import { securityResearch, type Lang } from "@/data/security-research";

const T: Record<
  Lang,
  {
    eyebrow: string;
    title: string;
    lead: string;
    facts: [string, string][];
    index: string;
    read: string;
    highlights: string;
    stack: string;
    type: string;
    ethics: string;
  }
> = {
  id: {
    eyebrow: "Security Research",
    title: "Riset Keamanan",
    lead: "Riset mandiri tentang bagaimana fitur bawaan framework web modern bisa berubah menjadi risiko keamanan, dan bagaimana menutupnya. Semua pengujian dilakukan dengan persetujuan, di lab terisolasi, dan disampaikan lewat responsible disclosure.",
    facts: [
      ["Riset", String(securityResearch.length)],
      ["Lingkungan", "Lab terisolasi"],
      ["Publikasi", "Responsible disclosure"],
    ],
    index: "Daftar riset",
    read: "Baca riset",
    highlights: "Ringkasan",
    stack: "Teknologi",
    type: "Jenis",
    ethics: "Tulisan ini sengaja tidak memuat payload, langkah exploit, maupun data pihak lain. Fokusnya pada pola risiko dan perbaikannya.",
  },
  en: {
    eyebrow: "Security Research",
    title: "Security Research",
    lead: "Independent research into how built-in features of modern web frameworks turn into security risk, and how to close those gaps. All testing is approved in advance, runs in an isolated lab and is shared through responsible disclosure.",
    facts: [
      ["Papers", String(securityResearch.length)],
      ["Environment", "Isolated lab"],
      ["Publication", "Responsible disclosure"],
    ],
    index: "Research index",
    read: "Read paper",
    highlights: "Summary",
    stack: "Stack",
    type: "Type",
    ethics: "These write-ups intentionally contain no payloads, exploit steps or third-party data. They focus on risk patterns and their fixes.",
  },
};

const pad = (n: number) => String(n + 1).padStart(2, "0");

export default function ResearchClient() {
  const [lang, setLang] = useState<Lang>("id");
  const t = T[lang];

  return (
    <main lang={lang} className="mx-auto max-w-6xl px-4 sm:px-6 pt-12 sm:pt-16 pb-20">
      {/* Header */}
      <section className="border-b border-white/[0.06] pb-10 sm:pb-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            <ShieldCheck size={14} /> {t.eyebrow}
          </p>
          <div
            className="flex gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1"
            role="group"
            aria-label="Language"
          >
            {(["id", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider transition-colors cursor-pointer ${
                  lang === l ? "bg-white text-black" : "text-white/50 hover:text-white"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <h1 className="mt-5 text-3xl sm:text-5xl font-semibold tracking-tight text-white">
          {t.title}
        </h1>
        <p className="mt-5 max-w-3xl text-base sm:text-lg leading-relaxed text-white/60">{t.lead}</p>

        <dl className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-px overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.06]">
          {t.facts.map(([k, v]) => (
            <div key={k} className="bg-[#05070d] px-5 py-4">
              <dt className="text-[11px] uppercase tracking-wider text-white/40">{k}</dt>
              <dd className="mt-1 text-sm font-medium text-white">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Index */}
      <section aria-labelledby="index-heading" className="py-10 sm:py-14 border-b border-white/[0.06]">
        <h2 id="index-heading" className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
          {t.index}
        </h2>
        <ol className="mt-6 divide-y divide-white/[0.06] border-y border-white/[0.06]">
          {securityResearch.map((r, i) => (
            <li key={r.acronym}>
              <a
                href={`#${r.acronym.toLowerCase()}`}
                className="group grid gap-3 py-6 sm:grid-cols-[4rem_1fr_auto] sm:items-start sm:gap-6"
              >
                <span className="font-mono text-sm text-white/30">{pad(i)}</span>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                    {r.name} <span className="font-normal text-white/40">({r.acronym})</span>
                  </h3>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/55">{r.summary[lang]}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm text-white/50 group-hover:text-white transition-colors">
                  {t.read}
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </a>
            </li>
          ))}
        </ol>
      </section>

      {/* Papers */}
      {securityResearch.map((r, i) => (
        <article
          key={r.acronym}
          id={r.acronym.toLowerCase()}
          aria-labelledby={`${r.acronym}-title`}
          className="scroll-mt-20 grid gap-10 py-12 sm:py-16 border-b border-white/[0.06] lg:grid-cols-[16rem_1fr]"
        >
          <aside className="lg:sticky lg:top-24 lg:self-start space-y-6">
            <p className="font-mono text-sm text-emerald-400">
              {pad(i)} / {r.acronym}
            </p>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-white/40">{t.type}</p>
              <p className="mt-2 flex items-start gap-2 text-sm text-white/70">
                <FlaskConical size={14} className="mt-0.5 shrink-0 text-white/40" />
                {r.type[lang]}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-white/40">{t.stack}</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {r.stack.map((s) => (
                  <li
                    key={s}
                    className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-xs text-white/70"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="min-w-0 max-w-3xl">
            <h2 id={`${r.acronym}-title`} className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              {r.name}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/60">{r.summary[lang]}</p>

            <div className="mt-8 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">{t.highlights}</h3>
              <ul className="mt-4 space-y-3">
                {r.cv[lang].map((b) => (
                  <li key={b} className="flex gap-3 text-sm leading-relaxed text-white/75">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 space-y-9">
              {r.detail[lang].map((s, j) => (
                <section key={s.heading}>
                  <h3 className="flex items-baseline gap-3 text-lg font-semibold text-white">
                    <span className="font-mono text-xs text-white/30">
                      {i + 1}.{j + 1}
                    </span>
                    {s.heading}
                  </h3>
                  {s.body && <p className="mt-3 text-[15px] leading-7 text-white/60">{s.body}</p>}
                  {s.points && (
                    <ul className="mt-3 space-y-2 list-disc pl-5 text-[15px] leading-7 text-white/60 marker:text-white/30">
                      {s.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          </div>
        </article>
      ))}

      <p className="mt-10 flex max-w-3xl items-start gap-2 text-xs leading-relaxed text-white/35">
        <FileLock2 size={14} className="mt-0.5 shrink-0" />
        {t.ethics}
      </p>
    </main>
  );
}
