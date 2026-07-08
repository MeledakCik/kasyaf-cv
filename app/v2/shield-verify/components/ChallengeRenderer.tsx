import { MutableRefObject } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { ChallengeType } from "../types";

interface ChallengeRendererProps {
  type: ChallengeType;
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  mathQuestion: string;
  isAudioPlaying: boolean;
  onPlayAudio: () => void;
}

export const ChallengeRenderer = ({
  type,
  canvasRef,
  mathQuestion,
  isAudioPlaying,
  onPlayAudio,
}: ChallengeRendererProps) => {
  if (type === "text") {
    return (
      <div className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-inner bg-white mb-5">
        <canvas
          ref={canvasRef}
          width={380}
          height={100}
          className="w-full h-[100px]"
        />
      </div>
    );
  }

  if (type === "math") {
    return (
      <div className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-inner bg-white mb-5 p-8 text-center">
        <p className="text-3xl font-bold text-gray-800">{mathQuestion}</p>
      </div>
    );
  }

  if (type === "audio") {
    return (
      <div className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-inner bg-white mb-5 p-8 text-center">
        <button
          onClick={onPlayAudio}
          disabled={isAudioPlaying}
          className="inline-flex items-center gap-3 px-6 py-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors disabled:opacity-50"
        >
          {isAudioPlaying ? (
            <>
              <VolumeX size={24} className="text-blue-600" />
              <span className="text-blue-800 font-medium">Playing...</span>
            </>
          ) : (
            <>
              <Volume2 size={24} className="text-blue-600" />
              <span className="text-blue-800 font-medium">
                Listen to Audio
              </span>
            </>
          )}
        </button>
        <p className="text-sm text-gray-500 mt-3">
          Click the button to hear the characters
        </p>
      </div>
    );
  }

  return null;
};