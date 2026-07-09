'use client';

import { motion } from 'framer-motion';
import { Mail, GitGraph, Link2Off, Send, ArrowRight } from 'lucide-react';
import Reveal from '../animations/Reveal';

const LINKS = [
  { 
    label: 'Email', 
    value: 'kakangkasyaf@gmail.com', 
    href: 'mailto:kakangkasyaf@gmail.com',
    icon: Mail,
    color: 'hover:border-[#39e6b5]/40'
  },
  { 
    label: 'GitHub', 
    value: 'github.com/K4K4NG', 
    href: 'https://github.com/K4K4NG',
    icon: GitGraph,
    color: 'hover:border-[#39e6b5]/40'
  },
  { 
    label: 'LinkedIn', 
    value: 'linkedin.com/in/muhammad-kasyaf-anugrah', 
    href: 'https://linkedin.com/in/muhammad-kasyaf-anugrah',
    icon: Link2Off,
    color: 'hover:border-[#39e6b5]/40'
  },
];

export default function Contact() {
  return (
    <section id="contact" className="relative mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-28 lg:py-32">
      <Reveal>
        <div className="text-center">
          <span
            className="inline-block text-[#39e6b5] text-[11px] sm:text-xs uppercase tracking-[0.28em] mb-2"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Get In Touch
          </span>
          
          <h2
            className="mt-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#eaf0fb] leading-[1.1]"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Let&apos;s build something
            <br />
            worth <span className="text-[#39e6b5] relative inline-block">
              securing.
              <motion.span 
                className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#39e6b5]/30"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </span>
          </h2>
          
          <p
            className="mx-auto mt-4 sm:mt-6 max-w-xl text-sm sm:text-base text-[#7c8aac] leading-relaxed px-4"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Open to full stack roles, security-minded projects, and freelance work. 
            Reach out and I&apos;ll get back to you within a day or two.
          </p>

          <motion.a
            href="mailto:hello@kasyaf.dev"
            className="mt-8 sm:mt-10 inline-flex items-center gap-3 rounded-full border border-[#39e6b5]/40 bg-[#39e6b5]/10 px-6 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm uppercase tracking-widest text-[#39e6b5] transition-all hover:bg-[#39e6b5] hover:text-[#05070d] hover:shadow-[0_0_30px_rgba(57,230,181,0.2)] group"
            style={{ fontFamily: "'Poppins', sans-serif" }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            Say Hello
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </motion.a>
        </div>

        <motion.div 
          className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-t border-[#1f2c45] pt-8 sm:pt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {LINKS.map((link, index) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 p-4 sm:p-5 rounded-xl border border-[#1f2c45]/30 bg-[#0a0f1a]/30 backdrop-blur-sm transition-all duration-300 hover:border-[#39e6b5]/30 hover:bg-[#39e6b5]/5 hover:shadow-[0_0_30px_rgba(57,230,181,0.05)]"
              style={{ fontFamily: "'Poppins', sans-serif" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * (index + 1) }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center">
                <div className="p-2 rounded-full bg-[#39e6b5]/5 border border-[#39e6b5]/10 group-hover:bg-[#39e6b5]/10 group-hover:border-[#39e6b5]/20 transition-all duration-300">
                  <link.icon className="w-4 h-4 text-[#7c8aac] group-hover:text-[#39e6b5] transition-colors" />
                </div>
                <span className="text-[11px] sm:text-xs font-medium text-[#7c8aac]/60 group-hover:text-[#39e6b5] transition-colors">
                  {link.label}
                </span>
              </div>
              <span className="text-xs sm:text-sm text-[#eaf0fb]/80 group-hover:text-[#eaf0fb] transition-colors truncate max-w-[180px] sm:max-w-none">
                {link.value}
              </span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#39e6b5]/0 via-[#39e6b5]/0 to-[#39e6b5]/0 group-hover:from-[#39e6b5]/5 group-hover:via-[#39e6b5]/0 group-hover:to-[#39e6b5]/5 transition-all duration-500" />
            </motion.a>
          ))}
        </motion.div>

        <motion.div 
          className="mt-8 sm:mt-10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-[10px] sm:text-xs text-[#7c8aac]/40" style={{ fontFamily: "'Poppins', sans-serif" }}>
            📍 Available for remote and on-site opportunities
          </p>
        </motion.div>
      </Reveal>
    </section>
  );
}