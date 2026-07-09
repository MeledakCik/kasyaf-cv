"use client";

import { useEffect, useState, useCallback } from "react";
import { solveChallenge, collectAutomationFlags } from "@/lib/pow-solver";
import { Poppins } from "next/font/google";
import { ShieldCheck, ShieldAlert, Loader2 } from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function CikawanShield() {
  const [status, setStatus] = useState<"solving" | "verifying" | "failed">(
    "solving",
  );
  const [progress, setProgress] = useState(0);

  const runVerification = useCallback(async () => {
    setStatus("solving");
    setProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProgress((p) => Math.min(p + 5, 90));
      }, 200);

      const challengeRes = await fetch("/api/challenge");
      if (!challengeRes.ok) throw new Error("challenge fetch failed");
      const { challenge, seed, difficulty } = await challengeRes.json();

      setProgress(50);
      const { nonce, solveTimeMs } = await solveChallenge(seed, difficulty);

      setProgress(75);
      const automationFlags = collectAutomationFlags();

      setStatus("verifying");
      setProgress(90);

      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dpr: window.devicePixelRatio || 1,
          challenge,
          nonce,
          solveTimeMs,
          automationFlags,
        }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (res.ok) {
        window.location.href = "/";
      } else {
        setStatus("failed");
      }
    } catch {
      setStatus("failed");
    }
  }, []);

  useEffect(() => {
    runVerification();
  }, [runVerification]);

  return (
    <div
      className={`${poppins.className} min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6`}
    >
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden animate-in fade-in duration-500">
        <div className="bg-slate-900 px-6 py-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            {status === "failed" ? (
              <ShieldAlert size={22} className="text-red-400" />
            ) : (
              <ShieldCheck size={22} className="text-emerald-400" />
            )}
          </div>
          <div>
            <h1 className="text-white text-lg font-semibold">
              Portfolio Kasyaf
            </h1>
            <p className="text-slate-400 text-xs">Validasi Keamanan</p>
          </div>
        </div>

        <div className="px-6 py-8">
          {status !== "failed" ? (
            <>
              <h2 className="text-xl font-semibold text-slate-800">
                {status === "solving"
                  ? "Memvalidasi perangkat Anda"
                  : "Memproses validasi"}
              </h2>
              <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                {status === "solving"
                  ? "Kami melakukan pemeriksaan keamanan standar untuk melindungi data Anda."
                  : "Sedang memverifikasi hasil pemeriksaan dengan server."}
              </p>

              <div className="mt-6">
                <div className="flex items-center gap-4">
                  <Loader2
                    size={24}
                    className="text-blue-600 animate-spin shrink-0"
                  />
                  <div className="flex-1">
                    <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5">
                      {progress < 100
                        ? "Proses otomatis, mohon tunggu..."
                        : "Selesai, mengalihkan..."}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
                <p className="text-xs text-blue-700 leading-relaxed">
                  <span className="font-semibold">🛡️ Validasi Otomatis</span>{" "}
                  — Proses ini berlangsung otomatis untuk memastikan keamanan
                  koneksi Anda. Anda akan dialihkan setelah selesai.
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-red-600">
                Validasi gagal
              </h2>
              <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                Kami tidak dapat memverifikasi perangkat Anda. Ini bisa terjadi
                karena koneksi lambat, browser yang tidak didukung, atau
                terdeteksinya akses otomatis.
              </p>

              <div className="mt-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 flex items-start gap-3">
                <ShieldAlert
                  size={18}
                  className="text-red-500 shrink-0 mt-0.5"
                />
                <p className="text-xs text-red-700 leading-relaxed">
                  Coba refresh halaman. Jika terus terjadi, nonaktifkan ekstensi
                  browser atau gunakan browser lain.
                </p>
              </div>

              <button
                onClick={runVerification}
                className="mt-5 w-full rounded-xl bg-slate-900 text-white font-medium py-2.5 text-sm hover:bg-slate-800 transition-colors"
              >
                Coba lagi
              </button>
            </>
          )}
        </div>

        <div className="border-t bg-slate-50 px-6 py-3 flex justify-between text-[10px] text-slate-400">
          <span>Keamanan Tervalidasi</span>
          <span>© {new Date().getFullYear()} Kasyaf</span>
        </div>
      </div>
    </div>
  );
}
