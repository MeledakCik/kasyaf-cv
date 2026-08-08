"use client";

import { useEffect, useRef } from "react";

type SensorType = "bug" | "konten" | "design";
type LogLevel = "info" | "warn" | "error";

interface SensorPayload {
  router_id: SensorType;
  level: LogLevel;
  message: string;
  url: string;
  timestamp: string;
}

const LOG_ENDPOINT = "https://www.kasyaf-ai-agent.my.id/api/log";
const DEBOUNCE_MS = 5000;
const CONTENT_CHECK_DELAY_MS = 3000;
const MIN_SECTION_HTML_LENGTH = 50;

const IGNORED_PATTERNS = [
  "dikhololo_night_1k.hdr",
  "Failed to fetch",
  "ERR_NAME_NOT_RESOLVED",
  "ResizeObserver loop",
  "ChunkLoadError",
  "Loading chunk",
  "hdr",
];

function shouldIgnore(msg: string) {
  if (!msg) return false;
  return IGNORED_PATTERNS.some(p => msg.toLowerCase().includes(p.toLowerCase()));
}

function createSender() {
  let queue: SensorPayload[] = [];
  let timer: ReturnType<typeof setTimeout> | null = null;
  const sentHashes = new Set<string>();

  const flush = () => {
    if (queue.length === 0) return;
    const batch = queue;
    queue = [];
    batch.forEach((payload) => {
      const hash = payload.router_id + payload.message.slice(0, 150);
      if (sentHashes.has(hash)) return;
      sentHashes.add(hash);
      setTimeout(() => sentHashes.delete(hash), 60000);

      try {
        fetch(LOG_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {});
      } catch {}
    });
  };

  return function enqueue(payload: SensorPayload) {
    if (shouldIgnore(payload.message)) {
      console.warn("[KASYAF-SENSOR] Ignored:", payload.message.slice(0, 100));
      return;
    }
    queue.push(payload);
    if (timer) clearTimeout(timer);
    timer = setTimeout(flush, DEBOUNCE_MS);
  };
}

export function useCvSensor() {
  const sendRef = useRef<ReturnType<typeof createSender> | null>(null);

  useEffect(() => {
    if (!sendRef.current) {
      sendRef.current = createSender();
    }
    const send = sendRef.current;

    const report = (router_id: SensorType, message: string, level: LogLevel = "error") => {
      const finalLevel: LogLevel = router_id === "konten" ? "warn" : router_id === "design" ? "warn" : level;
      send({
        router_id,
        level: finalLevel,
        message,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      });
    };

    const handleWindowError = (event: ErrorEvent) => {
      if (shouldIgnore(event.message)) return;
      report(
        "bug",
        JSON.stringify({
          message: event.message,
          stack: event.error?.stack ?? null,
          source: event.filename,
          line: event.lineno,
          column: event.colno,
        }),
        "error"
      );
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const msg = reason instanceof Error ? reason.message : String(reason);
      if (shouldIgnore(msg)) return;
      report(
        "bug",
        JSON.stringify({
          message: msg,
          stack: reason instanceof Error ? reason.stack : null,
        }),
        "error"
      );
    };

    window.addEventListener("error", handleWindowError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    const contentTimer = setTimeout(() => {
      try {
        const bodyText = document.body.innerText || "";
        if (bodyText.includes("Lorem ipsum")) {
          report("konten", "Ditemukan teks placeholder 'Lorem ipsum' di halaman", "warn");
        }
        const sections = document.querySelectorAll("section");
        sections.forEach((section, index) => {
          if (section.innerHTML.length < MIN_SECTION_HTML_LENGTH) {
            report(
              "konten",
              `Section #${index} (${section.id || section.className || "no-id"}) terdeteksi konten kosong (panjang HTML: ${section.innerHTML.length})`,
              "warn"
            );
          }
        });
      } catch {}
    }, CONTENT_CHECK_DELAY_MS);

    const handleResize = () => {
      try {
        const isMobileWidth = window.innerWidth < 768;
        const isOverflowing = document.body.scrollWidth > window.innerWidth;
        if (isMobileWidth && isOverflowing) {
          report(
            "design",
            `Layout rusak di mobile: scrollWidth=${document.body.scrollWidth}px > innerWidth=${window.innerWidth}px`,
            "warn"
          );
        }
      } catch {}
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("error", handleWindowError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.removeEventListener("resize", handleResize);
      clearTimeout(contentTimer);
    };
  }, []);
}

export function reportBoundaryError(
  error: Error,
  componentStack: string | null | undefined
) {
  if (shouldIgnore(error.message)) return;
  try {
    fetch(LOG_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        router_id: "bug",
        level: "error",
        message: JSON.stringify({
          message: error.message,
          stack: error.stack,
          componentStack: componentStack ?? null,
        }),
        url: typeof window !== "undefined" ? window.location.href : "",
        timestamp: new Date().toISOString(),
      } as SensorPayload),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}