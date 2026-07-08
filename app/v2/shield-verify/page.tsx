"use client";

import { useEffect, useState } from "react";
import { Poppins } from "next/font/google";
import { ShieldCheck, ShieldAlert } from "lucide-react";

import { StatusDisplay } from "./components/StatusDisplay";
import { CaptchaModal } from "./components/CaptchaModal";
import { useVerification } from "./hooks/useVerification";
import { useCaptcha } from "./hooks/useCaptcha";
import { useMouseTracking } from "./hooks/useMouseTracking";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function CikawanShield() {
  const [isClient, setIsClient] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);

  const { status, isVerifying, rayId, runVerification, setStatus } =
    useVerification();

  const { state, setState, mathQuestion, canvasRef, honeypotRef, websiteRef, isPlaying, generateCaptcha, verifyCaptcha, resetCaptcha, playAudio, cleanup } =
    useCaptcha({
      onVerify: async (data) => {
        const success = await runVerification(
          data,
          trajectory,
          state.type,
          state.startTime
        );
        if (success) {
          setShowCaptcha(false);
          resetCaptcha();
        } else {
          setShowCaptcha(true);
          generateCaptcha();
        }
      },
    });

  const { isHuman, trajectory, resetTrajectory } = useMouseTracking(showCaptcha);
  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    runVerification({}, [], "text", null);
  }, [runVerification]);
  useEffect(() => {
    if (showCaptcha) {
      generateCaptcha();
    }
  }, [showCaptcha, generateCaptcha]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const handleRetry = () => {
    setShowCaptcha(true);
    resetTrajectory();
  };

  if (!isClient) {
    return null;
  }

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
          <StatusDisplay
            status={status}
            rayId={rayId}
            onRetry={handleRetry}
          />
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

      <CaptchaModal
        isOpen={showCaptcha}
        state={state}
        mathQuestion={mathQuestion}
        canvasRef={canvasRef}
        honeypotRef={honeypotRef}
        websiteRef={websiteRef}
        isAudioPlaying={isPlaying}
        onInputChange={(value) =>
          setState((prev) => ({ ...prev, input: value }))
        }
        onRefresh={generateCaptcha}
        onPlayAudio={() => playAudio(state.text)}
        onVerify={verifyCaptcha}
        onCancel={() => {
          setShowCaptcha(false);
          setState((prev) => ({ ...prev, input: "" }));
        }}
        isVerifying={isVerifying}
      />
    </div>
  );
}