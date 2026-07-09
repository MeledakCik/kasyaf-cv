'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

const navItems = [
  { label: 'COVER', href: '/' },
  { label: 'ABOUT', href: '#about' },
  { label: 'SKILLS', href: '#skills' },
  { label: 'EXPERIENCE', href: '#experience' },
  { label: 'PROJECTS', href: '#projects' },
  { label: 'CONTACT', href: '#contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#05070d]/80 backdrop-blur-xl border-b border-[#1f2c45]/20'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-[#39e6b5]/30 hover:border-[#39e6b5] transition-all duration-300 hover:scale-105">
              <Image
                src="/images/logo.png"
                alt="Kasyaf Logo"
                fill
                sizes="36px"
                className="object-cover"
                priority
              />
            </div>
            <span 
              className="text-sm font-bold tracking-[0.2em] text-[#39e6b5] hover:text-[#39e6b5]/80 transition-colors hidden sm:inline"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              KASYAF
            </span>
          </Link>
          <div className="hidden md:flex items-center justify-center gap-6 lg:gap-8 flex-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-xs lg:text-sm text-[#7c8aac] hover:text-[#39e6b5] transition-colors tracking-wider font-medium"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <Link
            href="#contact"
            className="hidden md:inline-flex px-5 py-1.5 border border-[#39e6b5]/20 text-[#39e6b5] rounded-full text-xs tracking-wider hover:bg-[#39e6b5]/10 transition-all hover:border-[#39e6b5] flex-shrink-0"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            HIRE ME
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-[#eaf0fb] hover:text-[#39e6b5] transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {isOpen && (
          <div className="md:hidden py-4 border-t border-[#1f2c45]/20">
            <div className="flex flex-col items-center gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm text-[#7c8aac] hover:text-[#39e6b5] transition-colors tracking-wider"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 border border-[#39e6b5]/30 text-[#39e6b5] rounded-full text-sm hover:bg-[#39e6b5]/10 transition-all text-center"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                HIRE ME
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}