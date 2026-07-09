'use client';

import { motion } from 'framer-motion';
import Reveal from '../animations/Reveal';

const PROJECTS = [
  {
    name: 'SecurePay Gateway',
    tag: 'Full Stack',
    desc: 'A payment orchestration dashboard with role-based access, audit logging, and PCI-conscious data handling end to end.',
    stack: ['Next.js', 'Node.js', 'PostgreSQL'],
  },
  {
    name: 'NetScan Toolkit',
    tag: 'Security',
    desc: 'A lightweight internal tool for scheduled network scans and vulnerability reporting, built to replace manual audit checklists.',
    stack: ['Python', 'Nmap', 'React'],
  },
  {
    name: 'Orbit CMS',
    tag: 'Front End',
    desc: 'A headless-CMS admin interface with a real-time preview pane, drag-and-drop layout blocks, and offline draft support.',
    stack: ['React', 'TypeScript', 'GraphQL'],
  },
  {
    name: 'Sentinel Auth',
    tag: 'Back End',
    desc: 'A drop-in authentication service with hardened JWT rotation, anomaly detection on login, and rate-limited endpoints.',
    stack: ['Node.js', 'Redis', 'Docker'],
  },
];

export default function Projects() {
  return (
    <section id="projects" className="relative mx-auto max-w-6xl px-6 py-28">
      <Reveal>
        <span
          className="text-[#39e6b5] text-xs uppercase tracking-[0.28em]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Projects
        </span>
        <h2
          className="mt-4 text-3xl font-semibold text-[#eaf0fb] sm:text-4xl"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Selected work
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {PROJECTS.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.08}>
            <motion.div
              className="flex h-full flex-col rounded-2xl border border-[#1f2c45] bg-[#101b30]/50 p-7 transition-all duration-300 hover:border-[#39e6b5]/30 hover:bg-[#101b30]/70"
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center justify-between">
                <h3
                  className="text-lg font-semibold text-[#eaf0fb]"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {p.name}
                </h3>
                <span
                  className="rounded-full border border-[#39e6b5]/30 bg-[#39e6b5]/10 px-3 py-1 text-[10px] uppercase tracking-widest text-[#39e6b5]"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {p.tag}
                </span>
              </div>
              <p
                className="mt-3 flex-1 text-[#7c8aac]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {p.desc}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {p.stack.map((s, idx) => (
                  <li
                    key={s}
                    className="text-[11px] text-[#7c8aac]"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {s}
                    {idx < p.stack.length - 1 && <span className="ml-2 text-[#1f2c45]">/</span>}
                  </li>
                ))}
              </ul>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}