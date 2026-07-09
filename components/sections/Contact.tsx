'use client';

import { motion } from 'framer-motion';
import Reveal from '../animations/Reveal';

const LINKS = [
  { label: 'Email', value: 'hello@kasyaf.dev', href: 'mailto:hello@kasyaf.dev' },
  { label: 'GitHub', value: 'github.com/kasyaf', href: 'https://github.com' },
  { label: 'LinkedIn', value: 'linkedin.com/in/kasyaf', href: 'https://linkedin.com' },
];

export default function Contact() {
  return (
    <section id="contact" className="relative mx-auto max-w-4xl px-6 py-32 text-center">
      <Reveal>
        <span
          className="text-[#39e6b5] text-xs uppercase tracking-[0.28em]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Contact
        </span>
        <h2
          className="mt-4 text-4xl font-bold text-[#eaf0fb] sm:text-5xl"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Let&apos;s build something
          <br />
          worth <span className="text-[#39e6b5]">securing.</span>
        </h2>
        <p
          className="mx-auto mt-6 max-w-md text-[#7c8aac]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Open to full stack roles, security-minded projects, and freelance work. Reach out
          and I&apos;ll get back to you within a day or two.
        </p>

        <motion.a
          href="mailto:hello@kasyaf.dev"
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-[#39e6b5]/40 bg-[#39e6b5]/10 px-8 py-4 text-xs uppercase tracking-widest text-[#39e6b5] transition-all hover:bg-[#39e6b5] hover:text-[#05070d]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Say hello ↗
        </motion.a>

        <div className="mt-14 flex flex-col items-center justify-center gap-4 border-t border-[#1f2c45] pt-10 sm:flex-row sm:gap-10">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="group flex items-center gap-2 text-xs text-[#7c8aac] transition-colors hover:text-[#39e6b5]"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <span className="text-[#39e6b5]/60 group-hover:text-[#39e6b5]">{l.label}</span>
              <span>{l.value}</span>
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}