"use client";

import StarfieldCanvas from "@/components/starfield/StarfieldCanvas";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import AIBrain from "@/components/AIBrain";

export default function Home() {
  return (
    <main className="relative select-none min-h-screen bg-black text-[#eaf0fb] overflow-x-hidden">
      <AIBrain />
      <div className="fixed inset-0 z-0">
        <StarfieldCanvas />
      </div>
      <div className="relative z-10">
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />

        <Navbar />
        <div className="p-4">
          <Hero />
        </div>
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
