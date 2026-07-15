'use client';

import { motion } from 'framer-motion';
import { 
  Mail, 
  GitBranchIcon as Github, 
  LucideLink2 as Linkedin, 
  Send, 
  ArrowRight, 
  MapPin, 
  Clock, 
  FileText,
  Sparkles
} from 'lucide-react';
import Reveal from '../animations/Reveal';

const LINKS = [
  { 
    label: 'Email', 
    value: 'kakangkasyaf@gmail.com', 
    href: 'mailto:kakangkasyaf@gmail.com',
    icon: Mail,
    color: 'from-[#39e6b5]/20 to-[#39e6b5]/5',
    borderColor: 'border-[#39e6b5]/30'
  },
  { 
    label: 'GitHub', 
    value: 'github.com/K4K4NG', 
    href: 'https://github.com/K4K4NG',
    icon: Github,
    color: 'from-purple-500/20 to-purple-500/5',
    borderColor: 'border-purple-500/30'
  },
  { 
    label: 'LinkedIn', 
    value: 'linkedin.com/in/muhammad-kasyaf-anugrah', 
    href: 'https://linkedin.com/in/muhammad-kasyaf-anugrah',
    icon: Linkedin,
    color: 'from-blue-500/20 to-blue-500/5',
    borderColor: 'border-blue-500/30'
  },
];

const AVAILABILITY = {
  status: 'Available for work',
  emoji: '🟢',
  detail: 'Open to full stack roles, security projects, and freelance'
};

export default function Contact() {
  return (
    <section 
      id="contact" 
      className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28 lg:py-32 overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[#39e6b5]/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[#39e6b5]/[0.02] blur-2xl" />
      </div>

      <div className="relative z-10">
        <Reveal>
          <div className="text-center">
            <motion.span
              className="inline-block text-[#39e6b5] text-[11px] sm:text-xs uppercase tracking-[0.28em] mb-3 font-medium"
              style={{ fontFamily: "'Poppins', sans-serif" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="inline w-3 h-3 mr-2 text-[#39e6b5]" />
              Get In Touch
            </motion.span>
            
            <h2
              className="mt-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#eaf0fb] leading-[1.1]"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Let&apos;s build something
              <br />
              worth{' '}
              <span className="relative inline-block">
                <span className="text-[#39e6b5] relative z-10">
                  securing.
                </span>
                <motion.span 
                  className="absolute -bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-[#39e6b5]/0 via-[#39e6b5] to-[#39e6b5]/0"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.4 }}
                />
                <motion.span 
                  className="absolute -bottom-1 left-1/2 w-1/2 h-[3px] bg-[#39e6b5]/50 blur-sm"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.6 }}
                />
              </span>
            </h2>
            
            <motion.p
              className="mx-auto mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base text-[#7c8aac] leading-relaxed px-4"
              style={{ fontFamily: "'Poppins', sans-serif" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {AVAILABILITY.detail}. Reach out and I&apos;ll get back to you within a day or two.
            </motion.p>

            {/* Status badge */}
            <motion.div
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#39e6b5]/20 bg-[#39e6b5]/5 px-4 py-1.5 text-xs text-[#39e6b5] backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39e6b5] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#39e6b5]" />
              </span>
              {AVAILABILITY.status}
            </motion.div>

            <motion.div
              className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.a
                href="mailto:kakangkasyaf@gmail.com"
                className="inline-flex items-center gap-3 rounded-full border border-[#39e6b5]/40 bg-[#39e6b5]/10 px-8 py-4 text-xs sm:text-sm uppercase tracking-widest text-[#39e6b5] transition-all hover:bg-[#39e6b5] hover:text-[#05070d] hover:shadow-[0_0_40px_rgba(57,230,181,0.25)] group"
                style={{ fontFamily: "'Poppins', sans-serif" }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                Say Hello
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </motion.a>
            </motion.div>
          </div>

          {/* Contact cards grid */}
          <motion.div 
            className="mt-16 sm:mt-20 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {LINKS.map((link, index) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center justify-center p-6 rounded-2xl border border-[#1f2c45]/50 bg-gradient-to-br from-[#0a0f1a]/80 to-[#0a0f1a]/40 backdrop-blur-sm transition-all duration-300 hover:border-[#39e6b5]/30 hover:shadow-[0_0_40px_rgba(57,230,181,0.05)] hover:-translate-y-1"
                style={{ fontFamily: "'Poppins', sans-serif" }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * (index + 1) }}
              >
                {/* Glow effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${link.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Border glow */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-[#39e6b5]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <div className="p-3 rounded-full bg-[#39e6b5]/5 border border-[#39e6b5]/10 group-hover:bg-[#39e6b5]/10 group-hover:border-[#39e6b5]/20 transition-all duration-300">
                    <link.icon className="w-5 h-5 text-[#7c8aac] group-hover:text-[#39e6b5] transition-colors" />
                  </div>
                  <span className="text-[11px] font-medium text-[#7c8aac]/60 group-hover:text-[#39e6b5] transition-colors">
                    {link.label}
                  </span>
                  <span className="text-sm text-[#eaf0fb]/80 group-hover:text-[#eaf0fb] transition-colors text-center truncate max-w-[200px]">
                    {link.value}
                  </span>
                  <div className="w-6 h-[1px] bg-gradient-to-r from-transparent via-[#39e6b5]/30 to-transparent group-hover:via-[#39e6b5]/60 transition-all duration-500" />
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* Footer info */}
          <motion.div 
            className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex items-center gap-2 text-xs text-[#7c8aac]/50" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <MapPin className="w-3.5 h-3.5" />
              <span>Bandung, Indonesia</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-[#1f2c45]" />
            <div className="flex items-center gap-2 text-xs text-[#7c8aac]/50" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <Clock className="w-3.5 h-3.5" />
              <span>Response within 24 hours</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-[#1f2c45]" />
            <div className="flex items-center gap-2 text-xs text-[#7c8aac]/50" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39e6b5] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#39e6b5]" />
              </span>
              <span>Open to work</span>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}