"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface LottieIconProps {
  src: string;
}
export default function LottieIcon({ src }: LottieIconProps) {
  return (
    <div className="w-45 h-45 mb-4 flex items-center justify-center">
      <DotLottieReact
        src={src}
        loop
        autoplay
        style={{ width: "100%", height: "100%" }} 
      />
    </div>
  );
}
