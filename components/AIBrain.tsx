"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { encryptPayload } from "@/lib/crypto";
import { useRouter } from "next/navigation";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ProfileContext {
  skills: string[];
  experience: string[];
  projects: string[];
  about: string;
  contact?: string;
  summary?: string;
}

const PORTFOLIO_KEYS = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "WebGPU",
  "fintech",
  "e-commerce",
  "frontend",
  "embedding",
  "HNSW",
  "RAG",
  "information retrieval",
  "skill",
  "pengalaman",
  "proyek",
  "pendidikan",
  "kontak",
  "engineering",
  "vektor",
  "algoritma",
  "matriks",
  "arsitektur",
];

// Fungsi untuk menyaring data sensitif
const sanitizeText = (text: string): string => {
  if (!text) return "";
  // Hapus email
  let sanitized = text.replace(
    /[\w.-]+@[\w.-]+\.\w+/g,
    "[email disembunyikan]",
  );
  // Hapus nomor telepon (format Indonesia & internasional)
  sanitized = sanitized.replace(
    /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4,}/g,
    "[telepon disembunyikan]",
  );
  return sanitized;
};

export default function AIBrain() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [profileContext, setProfileContext] = useState<ProfileContext | null>(
    null,
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Extract data dari halaman secara otomatis
  const extractProfileContext = useCallback((): ProfileContext => {
    const skills: string[] = [];
    const experience: string[] = [];
    const projects: string[] = [];
    let about = "";
    let contact = "";

    // Extract dari section Skills
    const skillsSection = document.querySelector("#skills");
    if (skillsSection) {
      const skillItems = skillsSection.querySelectorAll(
        "li, .skill-item, span",
      );
      skillItems.forEach((item) => {
        const text = item.textContent?.trim();
        if (text && text.length > 1 && text.length < 50) {
          skills.push(text);
        }
      });
    }

    // Extract dari section Experience
    const experienceSection = document.querySelector("#experience");
    if (experienceSection) {
      const roles = experienceSection.querySelectorAll("h3, p");
      roles.forEach((item) => {
        const text = item.textContent?.trim();
        if (text && text.length > 10) {
          experience.push(text);
        }
      });
    }

    // Extract dari section Projects
    const projectsSection = document.querySelector("#projects");
    if (projectsSection) {
      const projectItems = projectsSection.querySelectorAll(
        "h3, .project-name, a",
      );
      projectItems.forEach((item) => {
        const text = item.textContent?.trim();
        if (text && text.length > 3 && text.length < 100) {
          projects.push(text);
        }
      });
    }

    // Extract tentang (About section)
    const aboutSection = document.querySelector("#about");
    if (aboutSection) {
      const aboutParagraph = aboutSection.querySelector("p");
      const aboutText =
        aboutParagraph?.textContent || aboutSection.textContent || "";
      about = sanitizeText(
        aboutText.replace(/\s+/g, " ").trim().substring(0, 800),
      );
    }

    // Extract kontak (Contact section)
    const contactSection = document.querySelector("#contact");
    if (contactSection) {
      const contactText = contactSection.textContent?.trim() || "";
      contact = sanitizeText(contactText.substring(0, 300));
    }

    const allSkills = [...new Set(skills)].map((s) => s.toLowerCase());

    return {
      skills: allSkills.slice(0, 10),
      experience: [...new Set(experience)].map((e) => sanitizeText(e)),
      projects: [...new Set(projects)].map((p) => sanitizeText(p)),
      about,
      contact: contact || "Informasi kontak dapat dilihat di bagian kontak halaman.",
      summary: `Pemilik portofolio memiliki total ${allSkills.length} keahlian. Berikan jawaban yang detail dan bermanfaat. Jika ditanya tentang keahlian, sebutkan beberapa contoh utama dan jelaskan konteks penggunaannya. Jangan menyebutkan semua keahlian sekaligus.`,
    };
  }, []);

  // Extract context saat component mount & saat halaman berubah
  useEffect(() => {
    const context = extractProfileContext();
    setProfileContext(context);

    const observer = new MutationObserver(() => {
      const newContext = extractProfileContext();
      setProfileContext(newContext);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: false,
    });

    return () => observer.disconnect();
  }, [extractProfileContext]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Navigasi yang lebih selektif
  const autoNavigateToSection = useCallback(
    (userMessage: string) => {
      const message = userMessage.toLowerCase().replace(/[?.,]/g, ""); // Hapus tanda baca

      // Deteksi perintah navigasi ke halaman lain
      const routeMaps: Record<string, string> = {
        template: "/template",
        koleksi: "/template",
        project: "/project",
        proyek: "/project",
      };

      for (const [keyword, path] of Object.entries(routeMaps)) {
        if (message.includes(keyword)) {
          // Periksa kata kerja navigasi untuk kepastian
          const navWords = ["buka", "lihat", "ke", "tunjukkan", "arahkan", "pergi"];
          if (navWords.some((w) => message.includes(w))) {
            router.push(path);
            return keyword; // Kembalikan keyword yang terdeteksi
          }
        }
      }

      // Deteksi perintah navigasi ke section dalam halaman
      const navPhrases = [
        "arahkan ke",
        "tunjukkan",
        "tunjukan",
        "bawa ke",
        "ke bagian",
        "buka bagian",
        "lihat bagian",
        "pergi ke",
        "ke halaman",
      ];
      // Deteksi niat implisit untuk navigasi
      const implicitNavPhrases = ["di mana", "bagaimana cara", "info soal"];
      const hasNavPhrase = navPhrases.some((phrase) =>
        message.includes(phrase),
      );
      const hasImplicitNav = implicitNavPhrases.some(p => message.startsWith(p));
      if (!hasNavPhrase && !hasImplicitNav) return null;

      const sectionMaps: Record<string, string> = {
        skill: "skills",
        keahlian: "skills",
        teknologi: "skills",
        "tech stack": "skills",
        pengalaman: "experience",
        experience: "experience",
        kerja: "experience",
        proyek: "projects",
        project: "projects",
        portfolio: "projects",
        kontak: "contact",
        hubungi: "contact",
        contact: "contact",
        tentang: "about",
        about: "about",
        siapa: "about",
      };

      for (const [keyword, sectionId] of Object.entries(sectionMaps)) {
        if (message.includes(keyword)) {
          const section = document.querySelector(`#${sectionId}`);
          if (section) {
            setTimeout(() => {
              section.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 300);
            return sectionId;
          }
        }
      }

      return null;
    },
    [router],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const query = input.trim();
      if (!query || isGenerating) return;

      setInput("");
      const detectedSection = autoNavigateToSection(query);

      setMessages((prev) => [...prev, { role: "user", content: query }]);
      setIsGenerating(true);
      setErrorMsg(null);

      try {
        const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
        if (!encryptionKey) {
          throw new Error("Kunci enkripsi (NEXT_PUBLIC_ENCRYPTION_KEY) tidak dikonfigurasi di client.");
        }

        const encryptedPayload = await encryptPayload({
          message: query,
          profileContext: profileContext,
          detectedSection: detectedSection,
        }, encryptionKey);

        const response = await fetch("/api/chat-ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payload: encryptedPayload }),
        });

        if (!response.ok || !response.body) {
          const errorText = await response.text();
          throw new Error(
            JSON.parse(errorText).error || "Failed to get response stream",
          );
        }

        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          const chunk = decoder.decode(value, { stream: true });

          if (chunk) {
            setMessages((prevMessages) => {
              const lastMessage = prevMessages[prevMessages.length - 1];
              if (lastMessage && lastMessage.role === "assistant") {
                const updatedMessages = [...prevMessages];
                updatedMessages[updatedMessages.length - 1] = {
                  ...lastMessage,
                  content: lastMessage.content + chunk,
                };
                return updatedMessages;
              }
              return prevMessages;
            });
          }
        }
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : String(err));
      } finally {
        setIsGenerating(false);
      }
    },
    [input, isGenerating, profileContext, autoNavigateToSection, setMessages],
  );

  const highlightKeywords = (text: string) => {
    let allKeywords = [...PORTFOLIO_KEYS];
    if (profileContext?.skills) {
      allKeywords = [...allKeywords, ...profileContext.skills];
    }

    allKeywords = [...new Set(allKeywords)].sort((a, b) => b.length - a.length);

    const regex = new RegExp(
      `(${allKeywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
      "gi",
    );
    return text.split(regex).map((part, idx) =>
      regex.test(part) ? (
        <code
          key={idx}
          className="not-italic font-medium text-cyan-300 bg-cyan-900/30 px-1.5 py-0.5 rounded-md border border-cyan-700/30"
        >
          {part}
        </code>
      ) : (
        part
      ),
    );
  };

  return (
    <>
      <style>{`
        .ai-brain-container, .ai-brain-container * { font-family: 'Poppins', sans-serif; }
        @keyframes ai-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.6); }
          50% { box-shadow: 0 0 30px rgba(6, 182, 212, 0.8); }
        }
        .float-button { animation: ai-float 3s ease-in-out infinite; }
        .pulse-glow { animation: ai-pulse-glow 2s ease-in-out infinite; }
        .message-fade { animation: fadeInUp 0.3s ease-out; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .chat-gradient { background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(20, 28, 50, 0.95) 100%); }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(6, 182, 212, 0.6), rgba(59, 130, 246, 0.6));
          border-radius: 10px;
          transition: background 0.3s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(6, 182, 212, 0.8), rgba(59, 130, 246, 0.8));
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(6, 182, 212, 0.6) rgba(51, 65, 85, 0.3);
        }
        .message-bubble {
          word-wrap: break-word;
          overflow-wrap: break-word;
          line-height: 1.5;
        }
        .message-bubble ul, .message-bubble ol {
          margin: 0.5rem 0 0.5rem 1.5rem;
          padding: 0;
        }
        .message-bubble li {
          margin: 0.25rem 0;
        }
        .message-bubble strong {
          font-weight: 600;
          color: #06b6d4;
        }
      `}</style>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="float-button pulse-glow fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-2xl transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-300"
        aria-label={isOpen ? "Tutup chat AI" : "Buka chat AI"}
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={isOpen ? "close" : "open"}
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="w-7 h-7"
          >
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 0 0-10 10c0 4.42 2.87 8.17 6.84 9.5.6.11.82-.26.82-.57v-2.03c-2.78.6-3.37-1.34-3.37-1.34-.55-1.38-1.33-1.75-1.33-1.75-1.08-.74.08-.72.08-.72 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.48 1 .1-.78.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.93.43.37.82 1.1.82 2.22v3.29c0 .31.22.69.82.57A10 10 0 0 0 22 12 10 10 0 0 0 12 2Z" />
              </svg>
            )}
          </motion.div>
        </AnimatePresence>
      </button>

      {isOpen && (
        <div className="ai-brain-container message-fade fixed bottom-24 right-6 sm:bottom-28 sm:right-6 z-40 w-[calc(100vw-3rem)] max-w-md h-[70vh] rounded-2xl shadow-2xl border border-slate-700 bg-slate-900/80 backdrop-blur-xl overflow-hidden flex flex-col">
          <div className="flex flex-col h-full">
            <header className="px-4 sm:px-5 py-3 border-b border-slate-700 flex-shrink-0">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <h2
                    className="text-base sm:text-lg font-bold tracking-wide text-cyan-300"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    🧠 Brain-in-Browser
                  </h2>
                  <p
                    className="text-xs text-slate-400 mt-1.5"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Tanya tentang pengalaman, skill, atau proyek
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg bg-slate-700/40 hover:bg-slate-600/50 px-3 sm:px-4 py-1.5 text-xs sm:text-sm text-slate-300 hover:text-white transition font-medium"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Tutup
                </button>
              </div>
            </header>

            <div
              className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar"
              style={{ minHeight: 0 }}
            >
              {messages.length === 0 && (
                <div
                  className="rounded-xl border border-dashed border-slate-700 bg-slate-800/30 p-4 sm:p-5 text-xs sm:text-sm text-slate-400 text-center"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  ✨ Tanyakan sesuatu tentang pemilik portofolio untuk memulai
                </div>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`message-fade ${m.role === "user" ? "flex justify-end" : "flex justify-start"}`}
                >
                  <div
                    className={`message-bubble max-w-[85%] rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm leading-relaxed transition ${
                      m.role === "user"
                        ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-br-none"
                        : "bg-slate-700/50 text-slate-200 border border-slate-600/50 rounded-bl-none"
                    }`}
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {m.role === "assistant"
                      ? highlightKeywords(m.content)
                      : m.content}
                  </div>
                </div>
              ))}
              {isGenerating && (
                <div className="flex justify-start message-fade">
                  <div
                    className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 text-slate-100 border border-slate-600/50 rounded-xl px-4 sm:px-5 py-3 sm:py-4 shadow-lg shadow-slate-900/40 rounded-bl-none"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    <span className="inline-flex gap-2">
                      <span
                        className="inline-block w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></span>
                      <span
                        className="inline-block w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></span>
                      <span
                        className="inline-block w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></span>
                    </span>
                  </div>
                </div>
              )}
              {errorMsg && (
                <div
                  className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300 border border-red-500/20"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  ⚠️ <span className="font-medium">{errorMsg}</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSubmit}
              className="border-t border-slate-700 bg-slate-900/80 p-3 sm:p-4 flex gap-2 sm:gap-3 flex-shrink-0"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isGenerating}
                placeholder="Tanya sesuatu..."
                className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-sm text-slate-100 placeholder-slate-400 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 disabled:opacity-50 transition"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
              <button
                type="submit"
                disabled={isGenerating || !input.trim()}
                className="px-4 sm:px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {isGenerating ? "..." : "Kirim"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}