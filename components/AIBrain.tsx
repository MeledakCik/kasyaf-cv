"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowUp, RotateCcw, Sparkles, Square, X } from "lucide-react";

/*
 * Portfolio AI assistant.
 * - Streams plain text from /api/chat-ai (server owns the CV context).
 * - Renders a small, safe Markdown subset as React elements (no innerHTML).
 * - Sends the last few turns so follow-up questions work.
 *
 * eval/Function are blocked by the CSP (no 'unsafe-eval' in production,
 * see proxy.ts), so nothing here monkey-patches globals.
 */

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Ceritakan tentang DepUp Office",
  "What is depup.cloud?",
  "Apa saja skill utama Kasyaf?",
  "How can I hire Kasyaf?",
];

const MAX_INPUT = 1000;
const HISTORY_TURNS = 6;

/* ----------------------------- navigation intents ----------------------------- */

const ROUTES: Record<string, string> = {
  template: "/template",
  koleksi: "/template",
  produk: "/template",
};
const NAV_WORDS = ["buka", "lihat", "tunjukkan", "arahkan", "pergi ke", "open", "show me", "go to"];
const SECTIONS: [string, string][] = [
  ["skill", "skills"],
  ["keahlian", "skills"],
  ["tech stack", "skills"],
  ["pengalaman", "experience"],
  ["experience", "experience"],
  ["proyek", "projects"],
  ["project", "projects"],
  ["portfolio", "projects"],
  ["kontak", "contact"],
  ["hubungi", "contact"],
  ["contact", "contact"],
  ["hire", "contact"],
  ["tentang", "about"],
  ["about", "about"],
];

/* ------------------------------ safe markdown ------------------------------ */

const INLINE_RE = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^\s)]+\)|https?:\/\/[^\s)]+)/g;

function renderInline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(INLINE_RE)) {
    const tok = m[0];
    const idx = m.index ?? 0;
    if (idx > last) out.push(text.slice(last, idx));
    const key = `${keyBase}-${i++}`;
    if (tok.startsWith("**")) {
      out.push(
        <strong key={key} className="font-semibold text-[#eaf0fb]">
          {tok.slice(2, -2)}
        </strong>,
      );
    } else if (tok.startsWith("`")) {
      out.push(
        <code key={key} className="rounded bg-white/10 px-1 py-0.5 font-mono text-[0.85em] text-[#7ff3d2]">
          {tok.slice(1, -1)}
        </code>,
      );
    } else {
      const md = tok.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
      const href = md ? md[2] : tok;
      const label = md ? md[1] : tok.replace(/^https?:\/\/(www\.)?/, "");
      out.push(
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="text-[#39e6b5] underline decoration-[#39e6b5]/40 underline-offset-2 hover:decoration-[#39e6b5]"
        >
          {label}
        </a>,
      );
    }
    last = idx + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function Markdown({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  const lines = text.replace(/\r/g, "").split("\n");
  let list: { ordered: boolean; items: string[] } | null = null;
  let para: string[] = [];

  const flushPara = () => {
    if (para.length) {
      const k = `p${blocks.length}`;
      blocks.push(
        <p key={k} className="whitespace-pre-wrap">
          {renderInline(para.join("\n"), k)}
        </p>,
      );
      para = [];
    }
  };
  const flushList = () => {
    if (list) {
      const k = `l${blocks.length}`;
      const items = list.items.map((it, j) => <li key={`${k}-${j}`}>{renderInline(it, `${k}-${j}`)}</li>);
      blocks.push(
        list.ordered ? (
          <ol key={k} className="list-decimal space-y-1 pl-5 marker:text-[#7c8aac]">
            {items}
          </ol>
        ) : (
          <ul key={k} className="list-disc space-y-1 pl-5 marker:text-[#39e6b5]">
            {items}
          </ul>
        ),
      );
      list = null;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const bullet = line.match(/^\s*[-*•]\s+(.*)$/);
    const numbered = line.match(/^\s*\d+[.)]\s+(.*)$/);
    const heading = line.match(/^#{1,4}\s+(.*)$/);
    if (bullet || numbered) {
      flushPara();
      const ordered = !!numbered;
      if (!list || list.ordered !== ordered) {
        flushList();
        list = { ordered, items: [] };
      }
      list.items.push((bullet ?? numbered)![1]);
    } else if (heading) {
      flushPara();
      flushList();
      const k = `h${blocks.length}`;
      blocks.push(
        <p key={k} className="font-semibold text-[#eaf0fb]">
          {renderInline(heading[1], k)}
        </p>,
      );
    } else if (!line.trim()) {
      flushPara();
      flushList();
    } else {
      flushList();
      para.push(line);
    }
  }
  flushPara();
  flushList();
  return <div className="space-y-2.5">{blocks}</div>;
}

/* --------------------------------- component -------------------------------- */

export default function AIBrain() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState<string | null>(null);

  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const fabRef = useRef<HTMLButtonElement>(null);

  // Keep the newest message in view while streaming.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isGenerating, errorMsg]);

  // Focus management + Esc to close.
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        fabRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const detectIntent = useCallback(
    (query: string): string | null => {
      const q = query.toLowerCase();
      if (NAV_WORDS.some((w) => q.includes(w))) {
        for (const [kw, path] of Object.entries(ROUTES)) {
          if (q.includes(kw)) {
            router.push(path);
            return null;
          }
        }
      }
      const hit = SECTIONS.find(([kw]) => q.includes(kw));
      if (!hit) return null;
      const el = document.getElementById(hit[1]);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
      return hit[1];
    },
    [router],
  );

  const send = useCallback(
    async (raw: string) => {
      const query = raw.trim().slice(0, MAX_INPUT);
      if (!query || isGenerating) return;

      const history = messages
        .filter((m) => m.content.trim())
        .slice(-HISTORY_TURNS)
        .map((m) => ({ role: m.role, content: m.content.slice(0, 1200) }));

      setInput("");
      setErrorMsg(null);
      setLastQuery(query);
      setMessages((prev) => [...prev, { role: "user", content: query }]);
      setIsGenerating(true);

      const detectedSection = detectIntent(query);
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch("/api/chat-ai", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "text/plain, application/json, */*" },
          body: JSON.stringify({
            message: query,
            history,
            detectedSection,
            _ts: Date.now(),
            _nonce: crypto.randomUUID(),
          }),
          signal: controller.signal,
        });

        if (!response.ok || !response.body) {
          const text = await response.text().catch(() => "");
          let serverMsg = text;
          try {
            serverMsg = JSON.parse(text).error ?? text;
          } catch {
            /* plain text */
          }
          switch (response.status) {
            case 401:
              throw new Error("Sesi kedaluwarsa. Muat ulang halaman lalu coba lagi.");
            case 403:
              throw new Error(
                /origin/i.test(serverMsg)
                  ? "Permintaan ditolak karena domain ini belum diizinkan."
                  : "Permintaan diblokir oleh proteksi keamanan. Muat ulang halaman lalu coba lagi.",
              );
            case 429:
              throw new Error("Terlalu banyak pesan. Tunggu sebentar lalu coba lagi.");
            case 502:
            case 504:
              throw new Error("Layanan AI sedang tidak tersedia. Coba lagi sebentar lagi.");
            default:
              throw new Error("Terjadi kesalahan. Coba lagi.");
          }
        }

        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          if (!chunk) continue;
          setMessages((prev) => {
            const next = prev.slice();
            const last = next[next.length - 1];
            next[next.length - 1] = { ...last, content: last.content + chunk };
            return next;
          });
        }
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return;
        // Drop an empty assistant bubble if the stream failed before any text.
        setMessages((prev) =>
          prev.length && prev[prev.length - 1].role === "assistant" && !prev[prev.length - 1].content
            ? prev.slice(0, -1)
            : prev,
        );
        setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan. Coba lagi.");
      } finally {
        abortRef.current = null;
        setIsGenerating(false);
      }
    },
    [isGenerating, messages, detectIntent],
  );

  const stop = () => abortRef.current?.abort();

  const reset = () => {
    abortRef.current?.abort();
    setMessages([]);
    setErrorMsg(null);
    setInput("");
    inputRef.current?.focus();
  };

  const retry = () => {
    if (!lastQuery) return;
    setMessages((prev) => (prev.length && prev[prev.length - 1].role === "user" ? prev.slice(0, -1) : prev));
    setErrorMsg(null);
    void send(lastQuery);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void send(input);
    }
  };

  // Auto-grow textarea (max ~5 lines).
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 128) + "px";
  }, [input]);

  const lastIsStreamingAssistant =
    isGenerating && messages.length > 0 && messages[messages.length - 1].role === "assistant";

  return (
    <>
      {/* Launcher */}
      <motion.button
        ref={fabRef}
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 260, damping: 20 }}
        className={`fixed bottom-5 right-5 z-[60] h-14 items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#39e6b5] to-[#1fb88d] text-[#04120d] shadow-[0_10px_30px_-8px_rgba(57,230,181,0.55)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39e6b5]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:bottom-6 sm:right-6 ${
          isOpen ? "hidden w-14 sm:flex" : "flex w-14 sm:w-auto sm:px-5"
        }`}
        aria-label={isOpen ? "Tutup asisten AI" : "Buka asisten AI"}
        aria-expanded={isOpen}
        aria-controls="ai-assistant-panel"
      >
        {isOpen ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <>
            <Sparkles className="h-5 w-5" aria-hidden="true" />
            <span className="hidden text-sm font-semibold sm:inline">Ask AI</span>
          </>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            id="ai-assistant-panel"
            role="dialog"
            aria-modal="false"
            aria-label="Asisten AI portofolio"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-[70] flex h-[88dvh] flex-col overflow-hidden rounded-t-3xl border border-[#1f2c45] bg-[#070c17]/95 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:inset-x-auto sm:bottom-24 sm:right-6 sm:h-[min(640px,calc(100dvh-8rem))] sm:w-[400px] sm:rounded-3xl"
          >
            {/* Header */}
            <header className="flex items-center gap-3 border-b border-[#1f2c45]/80 px-4 py-3.5">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#39e6b5]/25 to-[#38bdf8]/20 ring-1 ring-[#39e6b5]/30">
                  <Sparkles className="h-5 w-5 text-[#39e6b5]" aria-hidden="true" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#070c17] bg-emerald-400" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-[15px] font-semibold text-[#eaf0fb]">Kasyaf&apos;s AI Assistant</h2>
                <p className="truncate text-xs text-[#7c8aac]">Projects, skills &amp; experience · ID / EN</p>
              </div>
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-full p-2 text-[#7c8aac] transition-colors hover:bg-white/5 hover:text-[#eaf0fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39e6b5]/60"
                  aria-label="Mulai percakapan baru"
                  title="Percakapan baru"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-[#7c8aac] transition-colors hover:bg-white/5 hover:text-[#eaf0fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39e6b5]/60"
                aria-label="Tutup asisten AI"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </header>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-5 [scrollbar-color:#1f2c45_transparent] [scrollbar-width:thin]"
              role="log"
              aria-live="polite"
              aria-busy={isGenerating}
            >
              {messages.length === 0 && (
                <div className="flex h-full flex-col justify-end gap-5 pb-1">
                  <div className="space-y-2">
                    <p className="text-[22px] font-semibold leading-tight text-[#eaf0fb]">
                      Halo! <span className="text-[#39e6b5]">Hi there.</span>
                    </p>
                    <p className="text-sm leading-relaxed text-[#9aa8c5]">
                      I can answer questions about Kasyaf&apos;s products, tech stack and experience, in Bahasa
                      Indonesia or English.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => void send(s)}
                        className="group flex items-center justify-between rounded-xl border border-[#1f2c45] bg-white/[0.02] px-3.5 py-2.5 text-left text-[13px] text-[#c3cde3] transition-colors hover:border-[#39e6b5]/40 hover:bg-[#39e6b5]/5 hover:text-[#eaf0fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39e6b5]/60"
                      >
                        {s}
                        <ArrowUp className="h-3.5 w-3.5 rotate-45 text-[#7c8aac] transition-colors group-hover:text-[#39e6b5]" aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) =>
                m.role === "user" ? (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-[#39e6b5] px-3.5 py-2.5 text-sm leading-relaxed text-[#04120d]">
                      {m.content}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex gap-2.5">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#39e6b5]/10 ring-1 ring-[#39e6b5]/20">
                      <Sparkles className="h-3.5 w-3.5 text-[#39e6b5]" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1 break-words text-sm leading-relaxed text-[#c3cde3]">
                      {m.content ? (
                        <Markdown text={m.content} />
                      ) : (
                        <TypingDots />
                      )}
                      {lastIsStreamingAssistant && i === messages.length - 1 && m.content && (
                        <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-[#39e6b5]" aria-hidden="true" />
                      )}
                    </div>
                  </div>
                ),
              )}

              {isGenerating && !lastIsStreamingAssistant && (
                <div className="flex gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#39e6b5]/10 ring-1 ring-[#39e6b5]/20">
                    <Sparkles className="h-3.5 w-3.5 text-[#39e6b5]" aria-hidden="true" />
                  </div>
                  <TypingDots />
                </div>
              )}

              {errorMsg && (
                <div className="flex items-start justify-between gap-3 rounded-xl border border-red-500/25 bg-red-500/[0.08] px-3.5 py-3 text-[13px] text-red-200" role="alert">
                  <span>{errorMsg}</span>
                  {lastQuery && (
                    <button
                      type="button"
                      onClick={retry}
                      className="shrink-0 rounded-full border border-red-400/30 px-2.5 py-1 text-xs text-red-100 transition-colors hover:bg-red-400/10"
                    >
                      Coba lagi
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
              className="border-t border-[#1f2c45]/80 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
            >
              <div className="flex items-end gap-2 rounded-2xl border border-[#1f2c45] bg-[#0b1324] p-1.5 pl-3.5 transition-colors focus-within:border-[#39e6b5]/50">
                <label htmlFor="ai-input" className="sr-only">
                  Pesan untuk asisten AI
                </label>
                <textarea
                  id="ai-input"
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT))}
                  onKeyDown={onKeyDown}
                  rows={1}
                  placeholder="Tanya apa saja… / Ask anything…"
                  className="max-h-32 min-h-[36px] flex-1 resize-none bg-transparent py-2 text-sm text-[#eaf0fb] outline-none placeholder:text-[#5d6b88]"
                  maxLength={MAX_INPUT}
                  enterKeyHint="send"
                />
                {isGenerating ? (
                  <button
                    type="button"
                    onClick={stop}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1f2c45] text-[#eaf0fb] transition-colors hover:bg-[#2b3d5f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39e6b5]/60"
                    aria-label="Hentikan jawaban"
                  >
                    <Square className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#39e6b5] text-[#04120d] transition-colors hover:bg-[#5ff0c6] disabled:cursor-not-allowed disabled:bg-[#1f2c45] disabled:text-[#5d6b88] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39e6b5]/60"
                    aria-label="Kirim pesan"
                  >
                    <ArrowUp className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>
              <p className="mt-2 px-1 text-center text-[10.5px] text-[#5d6b88]">
                AI dapat keliru. Untuk hal penting, hubungi Kasyaf langsung.
              </p>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-2" aria-label="Asisten sedang mengetik">
      {[0, 150, 300].map((d) => (
        <span
          key={d}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#39e6b5]/80"
          style={{ animationDelay: `${d}ms` }}
        />
      ))}
    </span>
  );
}
