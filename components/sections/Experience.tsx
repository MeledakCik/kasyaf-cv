"use client";

import Reveal from "../animations/Reveal";

const ROLES = [
  {
    period: "2023 — Present",
    role: "Full Stack & Mobile Developer / Cyber Security & Designer",
    org: "Freelance / Professional",
    desc: "Building cross-platform mobile apps and full-stack solutions with embedded cyber security protocols, UI/UX design, and end-to-end deployment.",
  },
  {
    period: "2020 — 2023",
    role: "Full Stack Web Developer & Cyber Security / Ethical Hacking",
    org: "Freelance / Contract",
    desc: "Developed robust full-stack web applications while performing active ethical hacking, vulnerability assessments, and web application security auditing.",
  },
  {
    period: "2017 — 2020",
    role: "Cyber Security Specialist & Ethical Hacker",
    org: "Self-Directed / CTF & Security Research",
    desc: "Focused on penetration testing, ethical hacking techniques, CTF competitions, network defense, and identifying security vulnerabilities.",
  },
];

export default function Experience() {
  return (
    <section id="experience" className="relative mx-auto max-w-6xl px-6 py-28">
      <Reveal>
        <span
          className="text-[#39e6b5] text-xs uppercase tracking-[0.28em]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Experience
        </span>
        <h2
          className="mt-4 text-3xl font-semibold text-[#eaf0fb] sm:text-4xl"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Where the time went
        </h2>
      </Reveal>

      <div className="relative mt-14 border-l border-[#1f2c45] pl-8 sm:pl-12">
        {ROLES.map((r, i) => (
          <Reveal
            key={r.role}
            delay={i * 0.08}
            className="relative pb-14 last:pb-0"
          >
            <span className="absolute -left-[calc(2rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full bg-[#39e6b5] shadow-[0_0_12px_2px_rgba(57,230,181,0.6)] sm:-left-[calc(3rem+5px)]" />
            <p
              className="text-xs uppercase tracking-widest text-[#39e6b5]"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {r.period}
            </p>
            <h3
              className="mt-2 text-xl font-semibold text-[#eaf0fb]"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {r.role}
            </h3>
            <p
              className="mt-0.5 text-xs text-[#7c8aac]"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {r.org}
            </p>
            <p
              className="mt-3 max-w-2xl text-[#7c8aac]"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {r.desc}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
