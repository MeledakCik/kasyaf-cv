"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  parallax: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  baseOpacity: number;
}

interface Layer {
  count: number;
  sizeMin: number;
  sizeMax: number;
  speed: number;
  opacity: number;
  parallax: number;
}

export default function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.scale(dpr, dpr);

    let mouseX = 0;
    let mouseY = 0;

    const layers: Layer[] = [
      {
        count: 120,
        sizeMin: 0.3,
        sizeMax: 0.8,
        speed: 0.15,
        opacity: 0.4,
        parallax: 0.02,
      },
      {
        count: 80,
        sizeMin: 0.6,
        sizeMax: 1.4,
        speed: 0.25,
        opacity: 0.7,
        parallax: 0.04,
      },
      {
        count: 40,
        sizeMin: 1.2,
        sizeMax: 2.4,
        speed: 0.35,
        opacity: 1.0,
        parallax: 0.08,
      },
    ];

    const stars: Star[] = [];

    layers.forEach((layer) => {
      for (let i = 0; i < layer.count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: layer.sizeMin + Math.random() * (layer.sizeMax - layer.sizeMin),
          speed: layer.speed + Math.random() * 0.1,
          opacity: layer.opacity,
          parallax: layer.parallax,
          twinkleSpeed: 0.5 + Math.random() * 1.5,
          twinkleOffset: Math.random() * Math.PI * 2,
          baseOpacity: layer.opacity,
        });
      }
    });

    let time = 0;
    let animationId: number;

    const draw = () => {
      time += 0.016;
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);
      const gradient = ctx.createRadialGradient(
        width * 0.5 + mouseX * 20,
        height * 0.3 + mouseY * 10,
        0,
        width * 0.5 + mouseX * 20,
        height * 0.3 + mouseY * 10,
        width * 0.6,
      );
      gradient.addColorStop(0, "rgba(57, 230, 181, 0.03)");
      gradient.addColorStop(0.5, "rgba(57, 230, 181, 0.01)");
      gradient.addColorStop(1, "rgba(57, 230, 181, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      stars.forEach((star) => {
        const parallaxX = star.x + mouseX * star.parallax * 60;
        const parallaxY = star.y + mouseY * star.parallax * 60;
        const twinkle =
          0.6 + 0.4 * Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
        const finalOpacity = star.baseOpacity * twinkle;
        if (star.size > 1.2) {
          ctx.shadowColor = `rgba(57, 230, 181, ${finalOpacity * 0.3})`;
          ctx.shadowBlur = 8;
        }

        ctx.beginPath();
        ctx.arc(parallaxX, parallaxY, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(234, 240, 251, ${finalOpacity})`;
        ctx.fill();
        ctx.shadowBlur = 0;
        star.y += star.speed * 0.5;
        if (star.y > height + 10) {
          star.y = -10;
          star.x = Math.random() * width;
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.scale(dpr, dpr);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / width - 0.5) * 2;
      mouseY = (e.clientY / height - 0.5) * 2;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 block pointer-events-none"
      style={{
        background: "#000000",
        width: "100vw",
        height: "100vh",
        display: "block",
      }}
    />
  );
}
