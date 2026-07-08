import { useState, useCallback, useRef } from "react";
import { CaptchaState, ChallengeType } from "../types";
import {
  generateTextCaptcha,
  generateMathChallenge,
  generateAudioCaptcha,
  getRandomChallengeType,
} from "../utils/captcha-generator";
import { getCanvasFingerprint } from "../utils/canvas-fingerprint";
import { checkMouseTrajectory, validateResponseTime } from "../utils/validation";
import { useAudio } from "./useAudio";

interface UseCaptchaProps {
  onVerify: (data: any) => Promise<void>;
}

export const useCaptcha = ({ onVerify }: UseCaptchaProps) => {
  const [state, setState] = useState<CaptchaState>({
    type: "text",
    text: "",
    input: "",
    isVerifying: false,
    attemptCount: 0,
    cooldownUntil: null,
    isHuman: false,
    startTime: null,
  });

  const [mathQuestion, setMathQuestion] = useState("");
  const { isPlaying, playAudio, cleanup } = useAudio();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const websiteRef = useRef<HTMLInputElement>(null);

  const generateCaptcha = useCallback(() => {
    const type = getRandomChallengeType();
    let text = "";

    if (type === "text") {
      text = generateTextCaptcha();
    } else if (type === "math") {
      const { question, answer } = generateMathChallenge();
      setMathQuestion(question);
      text = answer;
    } else if (type === "audio") {
      text = generateAudioCaptcha();
    }

    setState((prev) => ({
      ...prev,
      type,
      text,
      startTime: Date.now(),
      isHuman: false,
    }));
  }, []);

  const verifyCaptcha = useCallback(async () => {
    const {
      type,
      text,
      input,
      isVerifying,
      attemptCount,
      cooldownUntil,
      startTime,
    } = state;

    if (isVerifying) return;
    if (cooldownUntil && Date.now() < cooldownUntil) {
      return;
    }
    if (honeypotRef.current?.value || websiteRef.current?.value) {
      return;
    }
    if (!validateResponseTime(startTime)) {
      generateCaptcha();
      return;
    }
    const newAttempts = attemptCount + 1;
    setState((prev) => ({ ...prev, attemptCount: newAttempts }));

    if (newAttempts >= 3) {
      setState((prev) => ({
        ...prev,
        cooldownUntil: Date.now() + 30000,
        attemptCount: 0,
      }));
      generateCaptcha();
      return;
    }
    const isCorrect =
      type === "audio"
        ? input.trim().toUpperCase() === text.toUpperCase()
        : input.trim().toLowerCase() === text.toLowerCase();

    if (isCorrect) {
      setState((prev) => ({ ...prev, input: "" }));
      await onVerify({
        captchaType: type,
        responseTime: Date.now() - (startTime || Date.now()),
      });
    } else {
      generateCaptcha();
      setState((prev) => ({ ...prev, input: "" }));
    }
  }, [state, generateCaptcha, onVerify]);

  const resetCaptcha = useCallback(() => {
    setState({
      type: "text",
      text: "",
      input: "",
      isVerifying: false,
      attemptCount: 0,
      cooldownUntil: null,
      isHuman: false,
      startTime: null,
    });
    generateCaptcha();
  }, [generateCaptcha]);

  return {
    state,
    setState,
    mathQuestion,
    canvasRef,
    honeypotRef,
    websiteRef,
    isPlaying,
    generateCaptcha,
    verifyCaptcha,
    resetCaptcha,
    playAudio,
    cleanup,
  };
};