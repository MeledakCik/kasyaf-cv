'use client';

import { motion } from 'framer-motion';
import Reveal from '../animations/Reveal';
import { 
  Layout, 
  Server, 
  Shield, 
  Code, 
  Cloud,
  GitBranch
} from 'lucide-react';

const SKILL_GROUPS = [
  {
    title: 'Front End',
    prompt: 'client/',
    icon: Layout,
    items: [
      'React', 'Next.JS', 'React Native', 'TypeScript', 
      'Tailwind CSS', 'Three.js', 'Framer Motion',
      'Front-End Engineering', 'Front-End Design', 'Front End UI Development',
      '3D Layout Design', 'GUI Testing'
    ],
  },
  {
    title: 'Back End',
    prompt: 'server/',
    icon: Server,
    items: [
      'Go', 'Rust', 'Java', 'Python',
      'Node.js', 'Express', 'REST APIs',
      'PostgreSQL', 'MongoDB', 'Docker',
      'Back End Web Development', 'Back End Development',
      'Server Engineering', 'Engineering Problem Solving'
    ],
  },
  {
    title: 'Cyber Security',
    prompt: 'security/',
    icon: Shield,
    items: [
      'Ethical Hacking', 'Cyber Security Engineering', 'Cyber Security Analysis',
      'Keamanan Siber', 'OWASP Top 10', 'Pentesting',
      'Auth & JWT hardening', 'Nmap / Burp Suite',
      'Network security', 'Secure code review',
      'Vulnerability Assessment', 'Bug Tracking', 'Issue Tracking Software'
    ],
  },
  {
    title: 'DevOps & Tools',
    prompt: 'devops/',
    icon: Cloud,
    items: [
      'Docker', 'Git', 'CI/CD', 'Linux',
      'Nginx', 'Cloud Computing', 'Infrastructure as Code',
      'Monitoring', 'Logging', 'Performance Optimization'
    ],
  },
  {
    title: 'Programming Languages',
    prompt: 'lang/',
    icon: Code,
    items: [
      'TypeScript', 'JavaScript', 'Python', 'Go',
      'Rust', 'Java', 'C++', 'SQL',
      'Hack Programming Language', 'Vibe Coding'
    ],
  },
  {
    title: 'Additional Skills',
    prompt: 'tools/',
    icon: GitBranch,
    items: [
      'Crack Injection', 'Reverse Engineering', 'Malware Analysis',
      'Security Auditing', 'Risk Assessment', 'Compliance Testing',
      'Agile Methodologies', 'Scrum', 'Team Leadership'
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="relative mx-auto max-w-6xl px-6 py-28">
      <Reveal>
        <span
          className="text-[#39e6b5] text-xs uppercase tracking-[0.28em]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Skills
        </span>
        <h2
          className="mt-4 text-3xl font-semibold text-[#eaf0fb] sm:text-4xl"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Tools &amp; Technologies I work with
        </h2>
        <p
          className="mt-2 text-sm text-[#7c8aac]/60"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          A comprehensive list of technologies, frameworks, and tools in my arsenal
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SKILL_GROUPS.map((group, index) => {
          const Icon = group.icon;
          return (
            <Reveal key={group.title} delay={index * 0.08}>
              <motion.div
                className="h-full rounded-2xl border border-[#1f2c45] bg-[#101b30]/40 p-6 transition-all duration-300 hover:border-[#39e6b5]/30 hover:bg-[#101b30]/70 hover:shadow-xl hover:shadow-[#39e6b5]/5 group"
                whileHover={{ y: -6 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-[#39e6b5]/10 border border-[#39e6b5]/10 group-hover:bg-[#39e6b5]/20 transition-all">
                    <Icon className="w-4 h-4 text-[#39e6b5]" />
                  </div>
                  <div>
                    <p
                      className="text-xs text-[#39e6b5]/70 font-mono"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {group.prompt}
                    </p>
                    <h3
                      className="text-base font-semibold text-[#eaf0fb]"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {group.title}
                    </h3>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <motion.span
                      key={item}
                      className="px-2.5 py-1 text-[10px] rounded-full border border-[#1f2c45]/30 bg-[#05070d]/40 text-[#7c8aac]/80 hover:text-[#eaf0fb] hover:border-[#39e6b5]/20 transition-all"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-[#1f2c45]/20 flex justify-between items-center">
                  <span className="text-[9px] text-[#7c8aac]/40" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {group.items.length} skills
                  </span>
                  <span className="text-[#39e6b5]/20 group-hover:text-[#39e6b5]/40 transition-all">✦</span>
                </div>
              </motion.div>
            </Reveal>
          );
        })}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-16 text-center"
      >
        <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full border border-[#1f2c45]/30 bg-[#101b30]/30 backdrop-blur-sm">
          <span className="text-2xl font-bold text-[#39e6b5]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {SKILL_GROUPS.reduce((acc, g) => acc + g.items.length, 0)}
          </span>
          <span className="text-sm text-[#7c8aac]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Total skills &amp; technologies mastered
          </span>
        </div>
      </motion.div>
    </section>
  );
}