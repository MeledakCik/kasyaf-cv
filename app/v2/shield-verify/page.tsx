"use client";

import { useEffect, useState, useCallback } from "react";
import { solveChallenge, collectAutomationFlags } from "@/lib/pow-solver";
import { Poppins } from "next/font/google";
import { ShieldCheck, ShieldAlert } from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function CikawanShield() {
  const [rayId, setRayId] = useState("");
  const [status, setStatus] = useState<"solving" | "verifying" | "failed">(
    "solving",
  );

  const runVerification = useCallback(async () => {
    setStatus("solving");
    try {
      const challengeRes = await fetch("/api/challenge");
      if (!challengeRes.ok) throw new Error("challenge fetch failed");
      const { challenge, seed, difficulty } = await challengeRes.json();
      const { nonce, solveTimeMs } = await solveChallenge(seed, difficulty);
      const automationFlags = collectAutomationFlags();
      setStatus("verifying");
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
    setRayId(`CIK-${Math.random().toString(16).substring(2, 18)}`);
    runVerification();
  }, [runVerification]);

  return (
    <div
      className={`${poppins.className} min-h-screen bg-[#f4f5f7] flex items-center justify-center p-6`}
    >
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in duration-500">
        <div className="border-b bg-gradient-to-r from-[#0f172a] to-[#1e293b] px-8 py-7 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
            {status === "failed" ? (
              <ShieldAlert size={32} className="text-red-400" />
            ) : (
              <ShieldCheck size={32} className="text-green-400" />
            )}
          </div>

          <div>
            <h1 className="text-white text-3xl font-bold">Portfolio Kasyaf</h1>
            <p className="text-slate-300 text-sm mt-1">
              Secure Connection Verification
            </p>
          </div>
        </div>

        <div className="px-8 py-10">
          {status !== "failed" ? (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Checking your browser
              </h2>
              <p className="text-gray-500 leading-7">
                We are verifying that your connection is secure before allowing
                access to this website.
              </p>

              <div className="mt-8 rounded-2xl border bg-gray-50 p-6 flex gap-5 items-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-[5px] border-gray-200"></div>
                  <div className="absolute inset-0 rounded-full border-[5px] border-transparent border-t-[#2563eb] animate-spin"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {status === "solving"
                      ? "Solving security challenge"
                      : "Verifying with server"}
                  </h3>
                  <p className="text-gray-500 mt-1">
                    Please wait while Cikawan Shield verifies your browser.
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-[loading_4s_linear_forwards]"></div>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  This process usually takes less than 5 seconds.
                </p>
              </div>

              <div className="mt-10 rounded-xl border border-blue-100 bg-blue-50 p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={22} className="text-blue-600 mt-1" />
                  <div>
                    <p className="font-semibold text-blue-800">
                      Verification is automatic
                    </p>
                    <p className="text-sm text-blue-700 mt-2 leading-6">
                      After the verification is complete, you will be redirected
                      automatically. No further action is required.
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Verification failed
              </h2>
              <p className="text-gray-500 leading-7">
                We could not verify your browser. This may happen on a slow
                connection, an unsupported browser, or if automated access was
                detected.
              </p>

              <div className="mt-8 rounded-2xl border border-red-100 bg-red-50 p-6 flex gap-5 items-center">
                <ShieldAlert size={40} className="text-red-500 shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg text-red-800">
                    Unable to complete verification
                  </h3>
                  <p className="text-red-600 mt-1 text-sm">
                    Please try again. If this keeps happening, disable browser
                    extensions or try a different browser.
                  </p>
                </div>
              </div>

              <button
                onClick={runVerification}
                className="mt-8 w-full rounded-xl bg-[#0f172a] text-white font-medium py-3 hover:bg-[#1e293b] transition-colors"
              >
                Try again
              </button>
            </>
          )}
        </div>

        <div className="border-t bg-gray-50 px-8 py-5 flex flex-col md:flex-row justify-between gap-3 text-xs text-gray-500">
          <div>
            Ray ID:{" "}
            <span className="font-mono font-semibold text-gray-700">
              {rayId}
            </span>
          </div>
          <div className="font-medium">
            Protected by <span className="font-semibold">Cikawan Shield</span>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes loading {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
