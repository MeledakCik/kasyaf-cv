import { useState, useEffect } from "react";
import { MouseTrajectoryPoint } from "../types";

export const useMouseTracking = (isActive: boolean) => {
  const [isHuman, setIsHuman] = useState(false);
  const [trajectory, setTrajectory] = useState<MouseTrajectoryPoint[]>([]);

  useEffect(() => {
    if (!isActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      setIsHuman(true);
      setTrajectory((prev) => {
        const newTrajectory = [
          ...prev,
          { x: e.clientX, y: e.clientY, time: Date.now() },
        ];
        return newTrajectory.length > 50 ? newTrajectory.slice(-50) : newTrajectory;
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [isActive]);

  const resetTrajectory = () => {
    setTrajectory([]);
    setIsHuman(false);
  };

  return { isHuman, trajectory, resetTrajectory };
};