"use client";

import { useEffect, useRef } from "react";

type SensorType = "bug" | "konten" | "design";

interface SensorPayload {
  router_id: SensorType;
  message: string;
  url: string;
  timestamp: string;
}
const LOG_ENDPOINT = "https://kasyaf-ai-agen.my.id/api/log";
const DEBOUNCE_MS = 5000;
const CONTENT_CHECK_DELAY_MS = 3000;
const MIN_SECTION_HTML_LENGTH = 50;

function createSender() {
  let queue: SensorPayload[] = [];
  let timer: ReturnType<typeof setTimeout> | null = null;

  const flush = () => {
    if (queue.length === 0) return;
    const batch = queue;
    queue = [];
    batch.forEach((payload) => {
      try {
        fetch(LOG_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {
        });
      } catch {
      }
    });
  };

  return function enqueue(payload: SensorPayload) {
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

    const report = (router_id: SensorType, message: string) => {
      send({
        router_id,
        message,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      });
    };
    const handleWindowError = (event: ErrorEvent) => {
      report(
        "bug",
        JSON.stringify({
          message: event.message,
          stack: event.error?.stack ?? null,
          source: event.filename,
          line: event.lineno,
          column: event.colno,
        })
      );
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      report(
        "bug",
        JSON.stringify({
          message:
            reason instanceof Error ? reason.message : String(reason),
          stack: reason instanceof Error ? reason.stack : null,
        })
      );
    };

    window.addEventListener("error", handleWindowError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    const contentTimer = setTimeout(() => {
      try {
        const bodyText = document.body.innerText || "";

        if (bodyText.includes("Lorem ipsum")) {
          report("konten", "Ditemukan teks placeholder 'Lorem ipsum' di halaman");
        }

        const sections = document.querySelectorAll("section");
        sections.forEach((section, index) => {
          if (section.innerHTML.length < MIN_SECTION_HTML_LENGTH) {
            report(
              "konten",
              `Section #${index} (${
                section.id || section.className || "no-id"
              }) terdeteksi konten kosong (panjang HTML: ${
                section.innerHTML.length
              })`
            );
          }
        });
      } catch (err) {
      }
    }, CONTENT_CHECK_DELAY_MS);
    const handleResize = () => {
      try {
        const isMobileWidth = window.innerWidth < 768;
        const isOverflowing = document.body.scrollWidth > window.innerWidth;

        if (isMobileWidth && isOverflowing) {
          report(
            "design",
            `Layout rusak di mobile: scrollWidth=${document.body.scrollWidth}px > innerWidth=${window.innerWidth}px`
          );
        }
      } catch (err) {
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("error", handleWindowError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
      window.removeEventListener("resize", handleResize);
      clearTimeout(contentTimer);
    };
  }, []);
}

export function reportBoundaryError(
  error: Error,
  componentStack: string | null | undefined
) {
  try {
    fetch(LOG_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        router_id: "bug",
        message: JSON.stringify({
          message: error.message,
          stack: error.stack,
          componentStack: componentStack ?? null,
        }),
        url: typeof window !== "undefined" ? window.location.href : "",
        timestamp: new Date().toISOString(),
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
  }
}