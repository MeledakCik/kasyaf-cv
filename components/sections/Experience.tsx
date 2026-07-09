'use client';

import Reveal from '../animations/Reveal';

const ROLES = [
  {
    period: '2024 — Present',
    role: 'Full Stack Developer',
    org: 'Freelance / Contract',
    desc: 'Designing and shipping full stack web applications for clients, from data modeling to production deployment, with security review built into every release.',
  },
  {
    period: '2023 — 2024',
    role: 'Back End Engineer',
    org: 'Startup Project',
    desc: 'Built and hardened REST APIs, set up authentication and role-based access control, and ran regular vulnerability assessments before launches.',
  },
  {
    period: '2022 — 2023',
    role: 'Front End Developer',
    org: 'Agency Work',
    desc: 'Delivered responsive, accessible interfaces in React and Next.js, and introduced automated testing and performance budgets to the team.',
  },
  {
    period: '2021 — 2022',
    role: 'Cyber Security Enthusiast',
    org: 'Self-directed / CTF',
    desc: 'Started in security through capture-the-flag competitions and self-study, focused on web exploitation and network fundamentals.',
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
          <Reveal key={r.role} delay={i * 0.08} className="relative pb-14 last:pb-0">
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