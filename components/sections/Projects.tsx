"use client";

import { ArrowUpRight, Monitor, Smartphone, Globe, Cloud, Laptop, Download } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import Reveal from "../animations/Reveal";
import { PROJECTS, GITHUB_PROFILE, type PortfolioProject, type ProjectPlatform } from "@/data/projects";

const PLATFORM_ICON: Record<ProjectPlatform, typeof Monitor> = {
  Android: Smartphone,
  iOS: Smartphone,
  Windows: Monitor,
  macOS: Laptop,
  Web: Globe,
  Cloud: Cloud,
};

function hostOf(url: string) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function ProjectLinks({ p }: { p: PortfolioProject }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {p.downloadUrl && (
        <a
          href={p.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#39e6b5] px-3.5 py-1.5 text-xs font-semibold text-[#05070d] transition-colors hover:bg-[#5ff0c6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39e6b5]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070d]"
          aria-label={`Download ${p.name} (latest release on GitHub)`}
        >
          <Download className="h-3.5 w-3.5" aria-hidden="true" />
          Download
        </a>
      )}
      {p.liveUrl && (
        <a
          href={p.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#39e6b5] px-3.5 py-1.5 text-xs font-semibold text-[#05070d] transition-colors hover:bg-[#5ff0c6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39e6b5]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070d]"
          aria-label={`Open ${p.name} (${hostOf(p.liveUrl)})`}
        >
          {hostOf(p.liveUrl)}
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      )}
      {p.repoUrl && (
        <a
          href={p.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-[#1f2c45] px-3.5 py-1.5 text-xs text-[#c3cde3] transition-colors hover:border-[#39e6b5]/40 hover:text-[#39e6b5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39e6b5]/60"
          aria-label={`${p.name} source code on GitHub`}
        >
          <FaGithub className="h-3.5 w-3.5" aria-hidden="true" />
          Source
        </a>
      )}
      {p.extraRepos?.map((r) => (
        <a
          key={r.url}
          href={r.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-[#1f2c45] px-3.5 py-1.5 text-xs text-[#c3cde3] transition-colors hover:border-[#39e6b5]/40 hover:text-[#39e6b5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39e6b5]/60"
          aria-label={`${p.name} ${r.label} source code on GitHub`}
        >
          <FaGithub className="h-3.5 w-3.5" aria-hidden="true" />
          {r.label}
        </a>
      ))}
    </div>
  );
}

function Meta({ p }: { p: PortfolioProject }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-[#7c8aac]">
      <span className="font-mono uppercase tracking-[0.18em]" style={{ color: p.accent }}>
        {p.category}
      </span>
      <span className="h-1 w-1 rounded-full bg-[#1f2c45]" aria-hidden="true" />
      <span className="inline-flex items-center gap-2">
        {p.platforms.map((pl) => {
          const Icon = PLATFORM_ICON[pl];
          return (
            <span key={pl} className="inline-flex items-center gap-1">
              <Icon className="h-3 w-3" aria-hidden="true" />
              {pl}
            </span>
          );
        })}
      </span>
      <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-[#39e6b5]/20 bg-[#39e6b5]/5 px-2 py-0.5 text-[10px] text-[#9fe9d2]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#39e6b5]" aria-hidden="true" />
        {p.status}
      </span>
    </div>
  );
}

function Stack({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
      {items.map((s) => (
        <li
          key={s}
          className="rounded-md border border-[#1f2c45]/70 bg-[#0b1324] px-2 py-0.5 font-mono text-[10.5px] text-[#9fb0cf]"
        >
          {s}
        </li>
      ))}
    </ul>
  );
}

function FeaturedCard({ p }: { p: PortfolioProject }) {
  return (
    <article
      className="group relative flex h-full flex-col gap-5 overflow-hidden rounded-3xl border border-[#1f2c45] bg-[#0a1120]/80 p-6 sm:p-8 transition-colors duration-300 hover:border-[#2b3d5f]"
      aria-labelledby={`proj-${p.slug}`}
    >
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-[0.12] blur-3xl transition-opacity duration-500 group-hover:opacity-20"
        style={{ background: p.accent }}
        aria-hidden="true"
      />
      <Meta p={p} />
      <div>
        <h3 id={`proj-${p.slug}`} className="text-2xl font-semibold tracking-tight text-[#eaf0fb] sm:text-[28px]">
          {p.name}
        </h3>
        <p className="mt-1 text-sm font-medium" style={{ color: p.accent }}>
          {p.tagline}
        </p>
      </div>
      <p className="text-sm leading-relaxed text-[#9aa8c5]">{p.description}</p>
      <ul className="space-y-2">
        {p.highlights.map((h) => (
          <li key={h} className="flex gap-2.5 text-[13px] leading-relaxed text-[#c3cde3]">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: p.accent }} aria-hidden="true" />
            {h}
          </li>
        ))}
      </ul>
      <div className="mt-auto space-y-4 border-t border-[#1f2c45]/60 pt-5">
        <Stack items={p.stack} />
        <ProjectLinks p={p} />
      </div>
    </article>
  );
}

function ProjectCard({ p }: { p: PortfolioProject }) {
  return (
    <article
      className="flex h-full flex-col gap-4 rounded-2xl border border-[#1f2c45] bg-[#0a1120]/70 p-5 sm:p-6 transition-colors duration-300 hover:border-[#2b3d5f]"
      aria-labelledby={`proj-${p.slug}`}
    >
      <Meta p={p} />
      <div>
        <h3 id={`proj-${p.slug}`} className="text-lg font-semibold tracking-tight text-[#eaf0fb]">
          {p.name}
        </h3>
        <p className="mt-0.5 text-[13px] text-[#9fb0cf]">{p.tagline}</p>
      </div>
      <p className="line-clamp-4 text-[13px] leading-relaxed text-[#7c8aac]">{p.description}</p>
      <div className="mt-auto space-y-4">
        <Stack items={p.stack} />
        <ProjectLinks p={p} />
      </div>
    </article>
  );
}

export default function Projects() {
  const featured = PROJECTS.filter((p) => p.featured);
  const others = PROJECTS.filter((p) => !p.featured);

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
    >
      <Reveal>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.28em] text-[#39e6b5]">Selected work</span>
            <h2 id="projects-heading" className="mt-3 text-3xl font-semibold tracking-tight text-[#eaf0fb] sm:text-4xl">
              Products I&apos;ve built &amp; shipped
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#7c8aac] sm:text-[15px]">
              Only products that are live or released and ready to use today: from an offline office suite on
              four platforms to a one-click deployment cloud. Each one designed, built and secured end to end.
            </p>
          </div>
          <a
            href={GITHUB_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-[#1f2c45] px-4 py-2 text-xs text-[#c3cde3] transition-colors hover:border-[#39e6b5]/40 hover:text-[#39e6b5] sm:self-auto"
          >
            <FaGithub className="h-4 w-4" aria-hidden="true" />
            All repositories
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </Reveal>

      <div className="mt-10 grid gap-5 sm:mt-12 lg:grid-cols-2 lg:gap-6">
        {featured.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.06} className="h-full">
            <FeaturedCard p={p} />
          </Reveal>
        ))}
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:mt-6 lg:grid-cols-3 lg:gap-6">
        {others.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.05} className="h-full">
            <ProjectCard p={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
