"use client";

import Reveal from "../animations/Reveal";

const STATS = [
  { value: "5+", label: "Years building software" },
  { value: "30+", label: "Projects shipped" },
  { value: "15+", label: "Security audits" },
  { value: "10+", label: "Happy clients" },
];

const ALL_SKILLS = [
  "Vibe Coding",
  "Hack Programming Language",
  "GUI Testing",
  "Crack Injection",
  "Ethical Hacking",
  "Bug Tracking",
  "Issue Tracking Software",
  "TypeScript",
  "Tailwind CSS",
  "React",
  "React Native",
  "React.JS",
  "3D Layout Design",
  "REST APIs",
  "Go",
  "Rust",
  "Java",
  "Engineering Problem Solving",
  "Cyber Security Engineering",
  "Cyber Security Analysis",
  "Keamanan Siber",
  "Back End Web Development",
  "Back End Development",
  "Front-End Engineering",
  "Front-End Design",
  "Front End UI Development",
  "Server Engineering",
  "Next.JS",
  "Python",
];

export default function About() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-6 py-28">
      <Reveal>
        <span
          className="text-[#39e6b5] text-xs uppercase tracking-[0.28em]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          About
        </span>
      </Reveal>

      <div className="mt-6 grid gap-14 md:grid-cols-[1.1fr_0.9fr]">
        <Reveal delay={0.05}>
          <h2
            className="text-3xl font-semibold leading-snug text-[#eaf0fb] sm:text-4xl"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Full Stack Developer &amp; Cyber Security Enthusiast
            <br />
            <span className="text-[#39e6b5]">
              Building secure, scalable, and beautiful web experiences.
            </span>
          </h2>

          <div
            className="mt-6 space-y-4 text-[#7c8aac]"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <p>
              I&apos;m{" "}
              <span className="text-[#eaf0fb]">Muhammad Kasyaf Anugrah</span>, a{" "}
              <span className="text-[#39e6b5]/80">Full Stack Developer</span>{" "}
              and
              <span className="text-[#39e6b5]/80">
                {" "}
                Cyber Security Enthusiast{" "}
              </span>{" "}
              with a passion for building applications that are both secure and
              user-friendly. Currently pursuing my Bachelor&apos;s degree in
              Information Technology at
              <span className="text-[#eaf0fb]">
                {" "}
                Universitas Komputer Indonesia
              </span>{" "}
              (expected graduation: July 2029).
            </p>
            <p>
              My expertise spans across the entire stack — from{" "}
              <span className="text-[#eaf0fb]">front-end engineering </span>
              (React, Next.js, React Native, Tailwind CSS, TypeScript) to{" "}
              <span className="text-[#eaf0fb]">back-end development </span>
              (Go, Rust, Java, Python, REST APIs) — with a strong foundation in{" "}
              <span className="text-[#eaf0fb]">cyber security </span>
              and <span className="text-[#eaf0fb]">ethical hacking</span>.
            </p>
            <p>
              I believe great software is software that{" "}
              <span className="text-[#39e6b5]">holds up under attack</span> and
              <span className="text-[#39e6b5]"> feels effortless to use</span>.
              Every line of code I write balances security, performance, and
              user experience. Outside of development, I spend time on CTF
              challenges, security research, and contributing to open-source
              projects.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="border-l border-[#1f2c45] pl-4">
                <p
                  className="text-2xl font-bold text-[#39e6b5]"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {s.value}
                </p>
                <p
                  className="mt-1 text-xs text-[#7c8aac]"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-[#1f2c45] bg-[#101b30]/60">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(57,230,181,0.15),transparent_60%)]" />
            <div className="flex h-full flex-col items-center justify-start gap-3 p-6 text-center overflow-y-auto">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#39e6b5]/40 bg-[#39e6b5]/10 text-2xl font-bold text-[#39e6b5] flex-shrink-0">
                <img
                  src="/images/logo.png"
                  alt="Kasyaf Logo"
                  sizes="36px"
                  className="object-cover rounded-full"
                />
              </div>
              <div>
                <p
                  className="text-sm font-semibold text-[#eaf0fb]"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Muhammad Kasyaf Anugrah
                </p>
                <p
                  className="text-xs text-[#7c8aac]"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Bandung, Indonesia
                </p>
              </div>
              <div className="w-full rounded-lg border border-[#1f2c45] bg-[#05070d]/70 p-3 text-left backdrop-blur flex-shrink-0">
                <p
                  className="text-[#39e6b5] text-xs"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  $ whoami
                </p>
                {ALL_SKILLS.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 text-[8px] rounded-full border border-[#1f2c45]/30 bg-[#101b30]/30 text-[#7c8aac]/60"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="w-full rounded-lg border border-[#1f2c45] bg-[#05070d]/70 p-3 text-left backdrop-blur flex-shrink-0">
                <p
                  className="text-[#39e6b5] text-[9px] mb-2"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  🎓 Education
                </p>
                <p style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Universitas Komputer Indonesia
                </p>
                <p
                  className="text-[9px] text-[#7c8aac]/60"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  B.Tech in Information Technology · 2029
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
      <style jsx>{`
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
