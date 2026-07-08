import { MutableRefObject } from "react";
import { RefreshCw } from "lucide-react";
import { ChallengeRenderer } from "./ChallengeRenderer";
import { CaptchaState, ChallengeType } from "../types";

interface CaptchaModalProps {
  isOpen: boolean;
  state: CaptchaState;
  mathQuestion: string;
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  honeypotRef: MutableRefObject<HTMLInputElement | null>;
  websiteRef: MutableRefObject<HTMLInputElement | null>;
  isAudioPlaying: boolean;
  onInputChange: (value: string) => void;
  onRefresh: () => void;
  onPlayAudio: () => void;
  onVerify: () => void;
  onCancel: () => void;
  isVerifying: boolean;
}

export const CaptchaModal = ({
  isOpen,
  state,
  mathQuestion,
  canvasRef,
  honeypotRef,
  websiteRef,
  isAudioPlaying,
  onInputChange,
  onRefresh,
  onPlayAudio,
  onVerify,
  onCancel,
  isVerifying,
}: CaptchaModalProps) => {
  if (!isOpen) return null;

  const { type, input, attemptCount, cooldownUntil } = state;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 w-[450px] shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Verify you&apos;re human
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          {type === "text" && "Enter the characters shown in the image below"}
          {type === "math" && "Solve the math problem below"}
          {type === "audio" && "Listen to the audio and enter the characters"}
        </p>
        <input
          ref={websiteRef}
          type="text"
          name="website"
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />
        <input
          ref={honeypotRef}
          type="text"
          name="honeypot"
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        <ChallengeRenderer
          type={type}
          canvasRef={canvasRef}
          mathQuestion={mathQuestion}
          isAudioPlaying={isAudioPlaying}
          onPlayAudio={onPlayAudio}
        />

        <div className="space-y-4">
          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder={
                type === "text"
                  ? "Enter the code above"
                  : type === "math"
                  ? "Enter the answer"
                  : "Enter the characters"
              }
              className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && onVerify()}
            />
            <button
              onClick={onRefresh}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              title="Refresh Challenge"
            >
              <RefreshCw size={20} className="text-gray-600" />
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onCancel}
              className="flex-1 border-2 border-gray-200 rounded-xl py-3 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onVerify}
              disabled={isVerifying}
              className={`flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl py-3 font-medium shadow-md hover:shadow-lg transition-all ${
                isVerifying
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:from-blue-700 hover:to-blue-800"
              }`}
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </button>
          </div>

          {attemptCount > 0 && (
            <p className="text-xs text-orange-600 text-center">
              Attempts: {attemptCount}/3
            </p>
          )}

          {cooldownUntil && Date.now() < cooldownUntil && (
            <p className="text-xs text-red-600 text-center">
              Cooldown: {Math.ceil((cooldownUntil - Date.now()) / 1000)}s
              remaining
            </p>
          )}
        </div>
      </div>
    </div>
  );
};