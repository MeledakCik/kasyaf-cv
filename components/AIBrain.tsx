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

const sanitizeText = (text: string): string => {
  if (!text) return "";
  let sanitized = text.replace(
    /[\w.-]+@[\w.-]+\.\w+/g,
    "[email disembunyikan]",
  );
  sanitized = sanitized.replace(
    /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4,}/g,
    "[telepon disembunyikan]",
  );
  sanitized = sanitized.replace(/[<>{}[\]\\;]/g, "");
  return sanitized;
};
function sanitizeClientInput(text: string): string {
  let cleaned = text.replace(/[<>{}[\]\\;'"`]/g, "");
  cleaned = cleaned.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
  if (cleaned.length > 2000) cleaned = cleaned.substring(0, 2000);

  const injectionPhrases = [
    /abaikan\s+instruksi/i,
    /lupakan\s+aturan/i,
    /ignore\s+previous/i,
    /override\s+system/i,
    /sekarang\s+kamu\s+menjadi/i,
    /mode\s+dan/i,
    /jangan\s+patuhi/i,
    /don't\s+follow/i,
  ];
  if (injectionPhrases.some((re) => re.test(cleaned))) {
    return "[Pertanyaan tidak valid]";
  }
  return cleaned;
}

if (typeof window !== "undefined") {
  const consoleMethods = ["log", "warn", "error", "info", "debug", "trace"];
  consoleMethods.forEach((method) => {
    const original = console[method as keyof Console];
    if (typeof original === "function") {
      Object.defineProperty(console, method, {
        value: original,
        writable: false,
        configurable: false,
      });
    }
  });

  if (process.env.NODE_ENV === "production") {
    Object.defineProperty(window, "eval", {
      value: function () {
        throw new Error("eval() diblokir untuk keamanan");
      },
      writable: false,
      configurable: false,
    });

    Object.defineProperty(window, "Function", {
      value: function () {
        throw new Error("Function() diblokir untuk keamanan");
      },
      writable: false,
      configurable: false,
    });
  }
}

const toRgbTriplet = (colorStr: string): string | null => {
  const match = colorStr.match(/\d+(\.\d+)?/g);
  if (!match || match.length < 3) return null;
  return `${match[0]}, ${match[1]}, ${match[2]}`;
};

const isLightColor = (rgbTriplet: string): boolean => {
  const [r, g, b] = rgbTriplet.split(",").map((n) => parseFloat(n.trim()));
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55;
};

const DEFAULT_BG_TRIPLET = "15, 23, 42";

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

  const [bgTriplet, setBgTriplet] = useState<string>("15, 23, 42");

  useEffect(() => {
    const detectBg = () => {
      const candidates = [
        document.querySelector("#profile"),
        document.querySelector("#about"),
        document.querySelector("main"),
        document.body,
      ].filter(Boolean) as Element[];

      for (const el of candidates) {
        const bg = getComputedStyle(el).backgroundColor;
        if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
          const triplet = toRgbTriplet(bg);
          if (triplet) {
            setBgTriplet(triplet);
            return;
          }
        }
      }
      setBgTriplet(DEFAULT_BG_TRIPLET);
    };

    detectBg();
    const observer = new MutationObserver(detectBg);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style", "class"],
      childList: true,
      subtree: true,
    });
    return () => observer.disconnect();
  }, []);

  const isLight = isLightColor(bgTriplet);
  const cardBg = `rgba(${bgTriplet}, 0.85)`;
  const headerBorder = isLight ? "border-black/10" : "border-white/10";
  const textPrimary = isLight ? "#1c1c1e" : "#f5f5f7";
  const textSecondary = isLight
    ? "rgba(28,28,30,0.55)"
    : "rgba(245,245,247,0.55)";
  const emptyStateBorder = isLight ? "border-black/15" : "border-white/15";
  const emptyStateBg = isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)";
  const assistantBubbleBg = isLight
    ? "rgba(0,0,0,0.06)"
    : "rgba(255,255,255,0.10)";
  const assistantBubbleBorder = isLight
    ? "rgba(0,0,0,0.06)"
    : "rgba(255,255,255,0.08)";
  const inputBg = isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.08)";
  const scrollbarTrack = isLight
    ? "rgba(0,0,0,0.06)"
    : "rgba(255,255,255,0.06)";

  const extractProfileContext = useCallback((): ProfileContext => {
    const skills: string[] = [];
    const experience: string[] = [];
    const projects: string[] = [];
    let about = "";
    let contact = "";

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

    const aboutSection = document.querySelector("#about");
    if (aboutSection) {
      const aboutParagraph = aboutSection.querySelector("p");
      const aboutText =
        aboutParagraph?.textContent || aboutSection.textContent || "";
      about = sanitizeText(
        aboutText.replace(/\s+/g, " ").trim().substring(0, 800),
      );
    }

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
      contact:
        contact || "Informasi kontak dapat dilihat di bagian kontak halaman.",
      summary: `Pemilik portofolio memiliki total ${allSkills.length} keahlian. Berikan jawaban yang detail dan bermanfaat. Jika ditanya tentang keahlian, sebutkan beberapa contoh utama dan jelaskan konteks penggunaannya. Jangan menyebutkan semua keahlian sekaligus.`,
    };
  }, []);

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

  const autoNavigateToSection = useCallback(
    (userMessage: string) => {
      const message = userMessage.toLowerCase().replace(/[?.,]/g, "");

      const routeMaps: Record<string, string> = {
        template: "/template",
        koleksi: "/template",
        project: "/project",
        proyek: "/project",
      };
      for (const [keyword, path] of Object.entries(routeMaps)) {
        if (message.includes(keyword)) {
          const navWords = [
            "buka",
            "lihat",
            "ke",
            "tunjukkan",
            "arahkan",
            "pergi",
          ];
          if (navWords.some((w) => message.includes(w))) {
            router.push(path);
            return keyword; 
          }
        }
      }

      const sectionMaps: Record<string, string> = {
        // Skills
        skill: "skills",
        keahlian: "skills",
        teknologi: "skills",
        "tech stack": "skills",

        // Experience
        pengalaman: "experience",
        experience: "experience",
        kerja: "experience",

        // Projects
        proyek: "projects",
        project: "projects",
        portfolio: "projects",

        // Contact
        kontak: "contact",
        hubungi: "contact",
        contact: "contact",

        // About
        tentang: "about",
        about: "about",
        siapa: "about",

        // PROFILE
        profile: "profile",
        profil: "profile",
      };

      let foundSection: string | null = null;
      for (const [keyword, sectionId] of Object.entries(sectionMaps)) {
        if (message.includes(keyword)) {
          foundSection = sectionId;
          break;
        }
      }

      if (!foundSection) return null;

      const section = document.querySelector(`#${foundSection}`);
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300);
        return foundSection;
      }

      return null;
    },
    [router],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const rawQuery = input.trim();
      if (!rawQuery || isGenerating) return;

      const query = sanitizeClientInput(rawQuery);
      if (query === "[Pertanyaan tidak valid]") {
        setErrorMsg("Pertanyaan mengandung kata yang tidak diizinkan.");
        setTimeout(() => setErrorMsg(null), 3000);
        return;
      }

      setInput("");

      const detectedSection = autoNavigateToSection(query);

      setMessages((prev) => [...prev, { role: "user", content: query }]);
      setIsGenerating(true);
      setErrorMsg(null);

      try {
        const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
        if (!encryptionKey) {
          throw new Error("Kunci enkripsi tidak dikonfigurasi.");
        }

        const encryptedPayload = await encryptPayload(
          {
            message: query,
            profileContext: profileContext,
            detectedSection: detectedSection,
          },
          encryptionKey,
        );

        const response = await fetch("/api/chat-ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payload: encryptedPayload }),
        });

        const contentType = response.headers.get("content-type") || "";
        console.log("Response status:", response.status);
        console.log("Content-Type:", contentType);

        if (response.status === 429) {
          const data = await response.json();
          setErrorMsg(
            data.error || "Terlalu banyak permintaan. Tunggu sebentar.",
          );
          setIsGenerating(false);
          return;
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            JSON.parse(errorText).error || "Gagal mendapatkan respons",
          );
        }

        if (contentType.includes("application/json")) {
          const data = await response.json();
          console.log("JSON response:", data);
          const assistantMsg =
            data.response || data.message || "Maaf, terjadi kesalahan.";
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: assistantMsg },
          ]);
          setIsGenerating(false);
          return;
        }

        if (!response.body) {
          throw new Error("Tidak ada body response");
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
        console.error("Chat error:", err);
        setErrorMsg(err instanceof Error ? err.message : String(err));
      } finally {
        setIsGenerating(false);
      }
    },
    [input, isGenerating, profileContext, autoNavigateToSection],
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
          className="not-italic font-medium px-1.5 py-0.5 rounded-md"
          style={{
            color: "#007AFF",
            backgroundColor: isLight
              ? "rgba(0,122,255,0.08)"
              : "rgba(0,122,255,0.15)",
            border: `1px solid ${isLight ? "rgba(0,122,255,0.15)" : "rgba(0,122,255,0.25)"}`,
          }}
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
        .ai-brain-container, .ai-brain-container * { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        @keyframes ai-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 122, 255, 0.6); }
          50% { box-shadow: 0 0 30px rgba(0, 122, 255, 0.8); }
        }
        .float-button { animation: ai-float 3s ease-in-out infinite; }
        .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .message-fade { animation: fadeInUp 0.3s ease-out; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ai-brain-scrollbar::-webkit-scrollbar { width: 6px; }
        .ai-brain-scrollbar::-webkit-scrollbar-track {
          background: ${scrollbarTrack};
          border-radius: 10px;
        }
        .ai-brain-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 122, 255, 0.4);
          border-radius: 10px;
        }
        .ai-brain-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 122, 255, 0.6);
        }
        .ai-brain-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 122, 255, 0.4) ${scrollbarTrack};
        }
        .message-bubble { word-wrap: break-word; overflow-wrap: break-word; line-height: 1.5; }
        .message-bubble ul, .message-bubble ol { margin: 0.5rem 0 0.5rem 1.5rem; padding: 0; }
        .message-bubble li { margin: 0.25rem 0; }
        .message-bubble strong { font-weight: 600; color: #007AFF; }
        .ai-brain-input::placeholder { color: ${isLight ? "rgba(28,28,30,0.35)" : "rgba(245,245,247,0.35)"}; }
      `}</style>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="float-button pulse-glow fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#007AFF] text-white shadow-2xl transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-300"
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a10 10 0 0 0-10 10c0 4.42 2.87 8.17 6.84 9.5.6.11.82-.26.82-.57v-2.03c-2.78.6-3.37-1.34-3.37-1.34-.55-1.38-1.33-1.75-1.33-1.75-1.08-.74.08-.72.08-.72 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.48 1 .1-.78.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.93.43.37.82 1.1.82 2.22v3.29c0 .31.22.69.82.57A10 10 0 0 0 22 12 10 10 0 0 0 12 2Z" />
              </svg>
            )}
          </motion.div>
        </AnimatePresence>
      </button>

      {isOpen && (
        <div
          className="ai-brain-container message-fade fixed bottom-24 right-6 sm:bottom-28 sm:right-6 z-40 w-[calc(100vw-2.5rem)] max-w-sm h-[60vh] max-h-[80vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          style={{
            backgroundColor: cardBg,
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)"}`,
          }}
        >
          <div className="flex flex-col h-full">
            <header
              className={`px-4 py-3 border-b ${headerBorder} flex items-center justify-between flex-shrink-0`}
            >
              <div>
                <h2
                  className="text-base font-extrabold"
                  style={{ color: textPrimary }}
                >
                  AGEN AI
                </h2>
                <p className="text-xs" style={{ color: textSecondary }}>
                  Tanya tentang pemilik
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium"
                style={{ color: "#007AFF" }}
              >
                Tutup
              </button>
            </header>
            <div
              className="ai-brain-scrollbar flex-1 overflow-y-auto p-4 space-y-3"
              style={{ minHeight: 0 }}
            >
              {messages.length === 0 && (
                <div
                  className={`rounded-xl border border-dashed ${emptyStateBorder} p-4 text-xs sm:text-sm text-center`}
                  style={{
                    backgroundColor: emptyStateBg,
                    color: textSecondary,
                  }}
                >
                  ✨ Tanyakan sesuatu tentang pemilik portofolio
                </div>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`message-fade flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`message-bubble max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-[#007AFF] text-white rounded-br-md"
                        : "rounded-bl-md"
                    }`}
                    style={
                      m.role === "assistant"
                        ? {
                            backgroundColor: assistantBubbleBg,
                            border: `1px solid ${assistantBubbleBorder}`,
                            color: textPrimary,
                          }
                        : undefined
                    }
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
                    className="rounded-2xl px-4 py-3 rounded-bl-md"
                    style={{
                      backgroundColor: assistantBubbleBg,
                      border: `1px solid ${assistantBubbleBorder}`,
                    }}
                  >
                    <span className="flex gap-1">
                      <span
                        className="w-2 h-2 bg-[#007AFF] rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></span>
                      <span
                        className="w-2 h-2 bg-[#007AFF] rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></span>
                      <span
                        className="w-2 h-2 bg-[#007AFF] rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></span>
                    </span>
                  </div>
                </div>
              )}
              {errorMsg && (
                <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300 border border-red-500/20">
                  ⚠️ <span className="font-medium">{errorMsg}</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSubmit}
              className={`border-t ${headerBorder} p-3 flex gap-2 flex-shrink-0`}
            >
              <input
                value={input}
                onChange={(e) => {
                  const sanitized = sanitizeClientInput(e.target.value);
                  setInput(sanitized);
                }}
                onPaste={(e) => {
                  const pasted = e.clipboardData.getData("text");
                  const sanitized = sanitizeClientInput(pasted);
                  if (sanitized !== pasted) {
                    e.preventDefault();
                    setInput(sanitized);
                  }
                }}
                disabled={isGenerating}
                placeholder="Tanya sesuatu..."
                className="ai-brain-input flex-1 border-0 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#007AFF] disabled:opacity-50 transition"
                style={{ backgroundColor: inputBg, color: textPrimary }}
                maxLength={2000}
              />
              <button
                type="submit"
                disabled={
                  isGenerating ||
                  !input.trim() ||
                  input === "[Pertanyaan tidak valid]"
                }
                className="px-4 py-2 rounded-full bg-[#007AFF] text-white text-sm font-medium disabled:opacity-50 transition"
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
