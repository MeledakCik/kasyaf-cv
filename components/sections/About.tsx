"use client";

import Reveal from "../animations/Reveal";

const STATS = [
  { value: "5+", label: "Years building software" },
  { value: "30+", label: "Projects shipped" },
  { value: "15+", label: "Security audits" },
  { value: "10+", label: "Happy clients" },
];

const SKILL_GROUPS = [
  {
    label: "Front-end",
    skills: ["React", "Next.js", "React Native", "TypeScript", "Tailwind CSS"],
  },
  {
    label: "Back-end",
    skills: ["Go", "Rust", "Java", "Python", "REST APIs"],
  },
  {
    label: "Security",
    skills: [
      "Ethical Hacking",
      "Cyber Security Analysis",
      "Cyber Security Engineering",
      "CTF / Bug Hunting",
    ],
  },
  {
    label: "Tooling",
    skills: ["Git", "Issue Tracking", "GUI Testing", "3D Layout Design"],
  },
];

const MONO = "'JetBrains Mono', 'Fira Code', ui-monospace, monospace";
const SANS = "'Poppins', sans-serif";

export default function About() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-6 py-28">
      <Reveal>
        <span
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#39e6b5]"
          style={{ fontFamily: MONO }}
        >
          <span className="text-[#39e6b5]/60">$</span> ABOUT
        </span>
      </Reveal>

      <div className="mt-6 grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        {/* Left: narrative */}
        <Reveal delay={0.05}>
          <h2
            className="text-3xl font-semibold leading-snug text-[#eaf0fb] sm:text-4xl"
            style={{ fontFamily: SANS }}
          >
            Full Stack Developer &amp; Cyber Security Enthusiast
            <br />
            <span className="text-[#39e6b5]">
              Building secure, scalable, and beautiful web experiences.
            </span>
          </h2>

          <div
            className="mt-6 space-y-4 text-[15px] leading-relaxed text-[#7c8aac]"
            style={{ fontFamily: SANS }}
          >
            <p>
              I&apos;m <span className="text-[#eaf0fb]">Muhammad Kasyaf Anugrah</span>,
              a <span className="text-[#39e6b5]/80">Full Stack Developer</span> and{" "}
              <span className="text-[#39e6b5]/80">Cyber Security Enthusiast</span>{" "}
              with a passion for building applications that are both secure and
              user-friendly. Currently pursuing my Bachelor&apos;s degree in
              Information Technology at{" "}
              <span className="text-[#eaf0fb]">Universitas Komputer Indonesia</span>{" "}
              (expected graduation: July 2029).
            </p>
            <p>
              My expertise spans the entire stack — from{" "}
              <span className="text-[#eaf0fb]">front-end engineering</span> to{" "}
              <span className="text-[#eaf0fb]">back-end development</span> — with a
              strong foundation in <span className="text-[#eaf0fb]">cyber security</span>{" "}
              and <span className="text-[#eaf0fb]">ethical hacking</span>.
            </p>
            <p>
              I believe great software{" "}
              <span className="text-[#39e6b5]">holds up under attack</span> and{" "}
              <span className="text-[#39e6b5]">feels effortless to use</span>. Outside
              of development, I spend time on CTF challenges, security research, and
              open-source.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[#1f2c45] bg-[#1f2c45] sm:grid-cols-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="group bg-[#0a0e1a] px-4 py-5 transition-colors hover:bg-[#0d1424]"
              >
                <p
                  className="text-2xl font-bold text-[#39e6b5] transition-transform group-hover:-translate-y-0.5"
                  style={{ fontFamily: MONO }}
                >
                  {s.value}
                </p>
                <p
                  className="mt-1 text-xs text-[#7c8aac]"
                  style={{ fontFamily: SANS }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Right: terminal signature element */}
        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-xl border border-[#1f2c45] bg-[#0a0e1a] shadow-[0_0_40px_-15px_rgba(57,230,181,0.25)]">
            {/* window chrome */}
            <div className="flex items-center gap-1.5 border-b border-[#1f2c45] bg-[#0d1424] px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]/70" />
              <span
                className="ml-3 text-[11px] text-[#7c8aac]"
                style={{ fontFamily: MONO }}
              >
                kasyaf@portfolio: ~
              </span>
            </div>

            {/* terminal body */}
            <div
              className="space-y-2 px-5 py-6 text-[13px] leading-relaxed"
              style={{ fontFamily: MONO }}
            >
              <p className="text-[#7c8aac]">
                <span className="text-[#39e6b5]">$</span> about
              </p>
              <p className="text-[#eaf0fb]">Muhammad Kasyaf Anugrah</p>

              <p className="pt-2 text-[#7c8aac]">
                <span className="text-[#39e6b5]">$</span> cat role.txt
              </p>
              <p className="text-[#eaf0fb]">Full Stack Developer</p>
              <p className="text-[#eaf0fb]">Cyber Security Enthusiast</p>

              <p className="pt-2 text-[#7c8aac]">
                <span className="text-[#39e6b5]">$</span> status --check
              </p>
              <p className="text-[#39e6b5]">
                ✓ access: granted
                <span className="ml-1 inline-block h-3.5 w-[7px] translate-y-[2px] animate-[blink_1s_steps(1)_infinite] bg-[#39e6b5]" />
              </p>
            </div>
          </div>

          {/* skill groups */}
          <div className="mt-8">
            <p
              className="mb-4 text-xs uppercase tracking-[0.2em] text-[#7c8aac]"
              style={{ fontFamily: MONO }}
            >
              <span className="text-[#39e6b5]/60">$</span> ls skills/
            </p>
            <div className="space-y-4">
              {SKILL_GROUPS.map((group) => (
                <div key={group.label}>
                  <p
                    className="mb-2 text-[11px] uppercase tracking-wide text-[#39e6b5]/70"
                    style={{ fontFamily: MONO }}
                  >
                    {group.label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md border border-[#1f2c45] bg-[#0d1424] px-2.5 py-1 text-[12px] text-[#eaf0fb]/90 transition-colors hover:border-[#39e6b5]/50 hover:text-[#39e6b5]"
                        style={{ fontFamily: MONO }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <style jsx>{`
        @keyframes blink {
          0%,
          49% {
            opacity: 1;
          }
          50%,
          100% {
            opacity: 0;
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1f2c45;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #39e6b5;
        }
      `}</style>
    </section>
  );
}