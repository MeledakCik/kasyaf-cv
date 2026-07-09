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
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#05070d] border-b border-[#1f2c45]/20 shadow-lg'
          : 'bg-[#05070d]'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-[#39e6b5]/30 hover:border-[#39e6b5] transition-all duration-300 hover:scale-105">
              <Image
                src="/images/logo.png"
                alt="Kasyaf Logo"
                fill
                sizes="(max-width: 640px) 32px, 36px"
                className="object-cover"
                priority
              />
            </div>
            <span 
              className="text-xs sm:text-sm font-bold tracking-[0.15em] sm:tracking-[0.2em] text-[#39e6b5] hover:text-[#39e6b5]/80 transition-colors hidden xs:inline"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              KASYAF
            </span>
          </Link>
          <div className="hidden md:flex items-center justify-center gap-4 lg:gap-8 flex-1 mx-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[10px] lg:text-sm text-[#7c8aac] hover:text-[#39e6b5] transition-colors tracking-wider font-medium whitespace-nowrap"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <Link
            href="#contact"
            className="hidden md:inline-flex px-4 py-1.5 lg:px-5 lg:py-1.5 border border-[#39e6b5]/20 text-[#39e6b5] rounded-full text-[10px] lg:text-xs tracking-wider hover:bg-[#39e6b5]/10 transition-all hover:border-[#39e6b5] flex-shrink-0"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            HIRE ME
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-[#eaf0fb] hover:text-[#39e6b5] transition-colors p-1"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>

        {isOpen && (
          <>
            <div 
              className="md:hidden fixed inset-0 top-14 sm:top-16 bg-black/50 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            <div className="md:hidden fixed top-14 sm:top-16 left-0 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] w-[75%] max-w-[320px] bg-[#05070d] border-r border-[#1f2c45]/20 z-40 animate-in slide-in-from-left duration-300">
              <div className="flex flex-col h-full px-6 py-8">
                <div className="flex flex-col gap-2">
                  {navItems.map((item, index) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="text-base text-[#7c8aac] hover:text-[#39e6b5] transition-colors tracking-wider font-medium py-3 px-4 hover:bg-[#39e6b5]/5 rounded-lg text-left"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
                <div className="mt-auto pt-6 border-t border-[#1f2c45]/20">
                  <Link
                    href="#contact"
                    onClick={() => setIsOpen(false)}
                    className="block w-full px-6 py-3 border border-[#39e6b5]/30 text-[#39e6b5] rounded-lg text-center hover:bg-[#39e6b5]/10 transition-all"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    HIRE ME
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}