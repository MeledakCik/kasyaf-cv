"use client";

import { useEffect, useRef } from "react";
import { getPerfProfile } from "@/lib/perf";

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  parallax: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  baseOpacity: number;
  glow: boolean;
}

interface Layer {
  count: number;
  sizeMin: number;
  sizeMax: number;
  speed: number;
  opacity: number;
  parallax: number;
}

const LAYERS: Layer[] = [
  { count: 120, sizeMin: 0.3, sizeMax: 0.8, speed: 0.15, opacity: 0.4, parallax: 0.02 },
  { count: 80, sizeMin: 0.6, sizeMax: 1.4, speed: 0.25, opacity: 0.7, parallax: 0.04 },
  { count: 40, sizeMin: 1.2, sizeMax: 2.4, speed: 0.35, opacity: 1.0, parallax: 0.08 },
];

const DENSITY = { low: 0.45, mid: 0.7, high: 1 } as const;

/** Pre-rendered glow sprite: replaces per-star `shadowBlur`, which is very slow on mobile GPUs. */
function makeGlowSprite(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = c.height = 32;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, "rgba(57, 230, 181, 0.35)");
  grad.addColorStop(1, "rgba(57, 230, 181, 0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 32, 32);
  return c;
}

export default function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const { tier, reducedMotion, coarsePointer, maxDpr } = getPerfProfile();
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    const density = DENSITY[tier];
    const glowSprite = tier === "low" ? null : makeGlowSprite();

    let width = 0;
    let height = 0;
    let mouseX = 0;
    let mouseY = 0;
    let animationId = 0;
    let lastTime = 0;
    let time = 0;
    let running = false;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      // setTransform (not scale) so repeated resizes don't compound.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const stars: Star[] = [];
    for (const layer of LAYERS) {
      const n = Math.round(layer.count * density);
      for (let i = 0; i < n; i++) {
        const size = layer.sizeMin + Math.random() * (layer.sizeMax - layer.sizeMin);
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size,
          speed: layer.speed + Math.random() * 0.1,
          parallax: layer.parallax,
          twinkleSpeed: 0.5 + Math.random() * 1.5,
          twinkleOffset: Math.random() * Math.PI * 2,
          baseOpacity: layer.opacity,
          glow: size > 1.2,
        });
      }
    }

    const draw = (dt: number) => {
      time += dt;
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      const cx = width * 0.5 + mouseX * 20;
      const cy = height * 0.3 + mouseY * 10;
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, width * 0.6);
      gradient.addColorStop(0, "rgba(57, 230, 181, 0.03)");
      gradient.addColorStop(0.5, "rgba(57, 230, 181, 0.01)");
      gradient.addColorStop(1, "rgba(57, 230, 181, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // dt is in seconds; 60 = the original per-frame tuning at 60 fps.
      const step = dt * 60;

      for (const star of stars) {
        const px = star.x + mouseX * star.parallax * 60;
        const py = star.y + mouseY * star.parallax * 60;
        const twinkle = 0.6 + 0.4 * Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
        const alpha = star.baseOpacity * twinkle;

        if (star.glow && glowSprite) {
          const r = star.size * 5;
          ctx.globalAlpha = alpha;
          ctx.drawImage(glowSprite, px - r, py - r, r * 2, r * 2);
          ctx.globalAlpha = 1;
        }

        ctx.fillStyle = `rgba(234, 240, 251, ${alpha})`;
        if (star.size < 1) {
          // Tiny stars: a rect is indistinguishable from an arc and much cheaper.
          ctx.fillRect(px - star.size, py - star.size, star.size * 2, star.size * 2);
        } else {
          ctx.beginPath();
          ctx.arc(px, py, star.size, 0, Math.PI * 2);
          ctx.fill();
        }

        star.y += star.speed * 0.5 * step;
        if (star.y > height + 10) {
          star.y = -10;
          star.x = Math.random() * width;
        }
      }
    };

    const loop = (now: number) => {
      const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0.016;
      lastTime = now;
      draw(dt);
      animationId = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reducedMotion) return;
      running = true;
      lastTime = 0;
      animationId = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(animationId);
    };

    if (reducedMotion) draw(0);
    else start();

    let resizeRaf = 0;
    const handleResize = () => {
      // Mobile URL bar show/hide only changes height slightly: don't reallocate
      // the canvas for that (it causes a visible flash and a GC spike).
      if (window.innerWidth === width && Math.abs(window.innerHeight - height) < 160) return;
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        resize();
        if (reducedMotion) draw(0);
      });
    };

    const handleMouseMove = (e: PointerEvent) => {
      mouseX = (e.clientX / width - 0.5) * 2;
      mouseY = (e.clientY / height - 0.5) * 2;
    };

    const handleVisibility = () => (document.hidden ? stop() : start());

    window.addEventListener("resize", handleResize, { passive: true });
    if (!coarsePointer) window.addEventListener("pointermove", handleMouseMove, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      stop();
      cancelAnimationFrame(resizeRaf);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 block pointer-events-none"
      style={{ background: "#000000", width: "100vw", height: "100vh", display: "block" }}
    />
  );
}
