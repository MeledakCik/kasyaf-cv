import { MouseTrajectoryPoint } from "../types";

export const checkMouseTrajectory = (
  trajectory: MouseTrajectoryPoint[]
): boolean => {
  if (trajectory.length < 10) return false;

  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumX2 = 0;
  const n = trajectory.length;

  for (const point of trajectory) {
    sumX += point.x;
    sumY += point.y;
    sumXY += point.x * point.y;
    sumX2 += point.x * point.x;
  }

  const correlation =
    (n * sumXY - sumX * sumY) /
    Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY * sumY - sumY * sumY));

  return Math.abs(correlation) > 0.9;
};

export const validateResponseTime = (startTime: number | null): boolean => {
  const elapsedTime = Date.now() - (startTime || Date.now());
  return elapsedTime >= 800;
};

export const validateHoneypot = (honeypot: string, website: string): boolean => {
  return !honeypot && !website;
};