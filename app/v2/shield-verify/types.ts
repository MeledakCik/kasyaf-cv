export type ChallengeType = "text" | "math" | "audio";
export type StatusType = "solving" | "verifying" | "failed";
export interface MouseTrajectoryPoint {
  x: number;
  y: number;
  time: number;
}

export interface CaptchaState {
  type: ChallengeType;
  text: string;
  input: string;
  isVerifying: boolean;
  attemptCount: number;
  cooldownUntil: number | null;
  isHuman: boolean;
  startTime: number | null;
}

export interface VerificationState {
  status: StatusType;
  rayId: string;
  showCaptcha: boolean;
}