import { useState, useRef, useCallback } from "react";

export const useAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playAudio = useCallback(async (text: string) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (
          window.AudioContext || (window as any).webkitAudioContext
        )();
      }

      const audioCtx = audioContextRef.current;
      if (audioCtx.state === "suspended") {
        await audioCtx.resume();
      }

      setIsPlaying(true);

      const duration = 0.3;
      const frequencies = text.split("").map((char) => {
        const code = char.charCodeAt(0);
        return 440 + (code % 12) * 50;
      });

      frequencies.forEach((freq, index) => {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.frequency.value = freq;
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioCtx.currentTime + duration
        );

        oscillator.start(audioCtx.currentTime + index * duration);
        oscillator.stop(audioCtx.currentTime + (index + 1) * duration);
      });

      setTimeout(
        () => setIsPlaying(false),
        frequencies.length * duration * 1000 + 500
      );
    } catch (error) {
      console.error("Audio playback failed:", error);
      setIsPlaying(false);
    }
  }, []);

  const cleanup = useCallback(() => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  }, []);

  return { isPlaying, playAudio, cleanup };
};