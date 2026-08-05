// components/sensor-provider.tsx
"use client";
import { useCvSensor } from "@/lib/sensor-client";

export default function SensorProvider() {
  useCvSensor();
  return null;
}