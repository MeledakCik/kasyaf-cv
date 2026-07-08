import { useState, useCallback } from "react";
import { StatusType } from "../types";
import { getCanvasFingerprint } from "../utils/canvas-fingerprint";
import { collectAutomationFlags, solveChallenge } from "@/lib/pow-solver";

export const useVerification = () => {
  const [status, setStatus] = useState<StatusType>("solving");
  const [isVerifying, setIsVerifying] = useState(false);
  const [rayId] = useState(`CIK-${Math.random().toString(16).substring(2, 18)}`);

  const runVerification = useCallback(
    async (
      challengeData: any,
      mouseTrajectory: any[],
      challengeType: string,
      startTime: number | null
    ) => {
      setStatus("solving");
      setIsVerifying(true);

      try {
        const challengeRes = await fetch("/api/challenge");
        if (!challengeRes.ok) throw new Error("challenge fetch failed");
        const { challenge, seed, difficulty } = await challengeRes.json();
        const { nonce, solveTimeMs } = await solveChallenge(seed, difficulty);

        const automationFlags = collectAutomationFlags();
        const fingerprint = getCanvasFingerprint();

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
            fingerprint,
            mouseTrajectory: mouseTrajectory.slice(-20),
            challengeType,
            responseTime: Date.now() - (startTime || Date.now()),
          }),
        });

        if (res.ok) {
          window.location.href = "/";
        } else {
          setStatus("failed");
          return false;
        }
      } catch {
        setStatus("failed");
        return false;
      } finally {
        setIsVerifying(false);
      }

      return true;
    },
    []
  );

  return {
    status,
    isVerifying,
    rayId,
    runVerification,
    setStatus,
  };
};