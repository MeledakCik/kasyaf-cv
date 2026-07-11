"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const BANDS = 16;
const WAVE_POINTS = 200;
const STAR_COUNT = 80;
const PARTICLE_COUNT = 15;

interface Star {
  x: number;
  y: number;
  s: number;
  speed: number;
  phase: number;
  alpha: number;
}

interface MathParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  symbol: string;
  size: number;
  alpha: number;
  life: number;
}

interface VisualState {
  W: number;
  H: number;
  cx: number;
  cy: number;
  stars: Star[];
  mathParticles: MathParticle[];
  waveAmp: number;
  targetAmp: number;
  waveFreq: number;
  targetFreq: number;
  wavePhase: number;
  targetPhase: number;
  ampLerp: number;
  freqLerp: number;
  phaseLerp: number;
  visualMode: "both" | "wave" | "bars";
  randomEnabled: boolean;
  bpmHistory: number[];
  lastBpmTime: number;
  smoothedBpm: number;
  lastBeat: number;
  beatCooldown: number;
  smoothedTimeData: Float32Array | null;
  smoothedBars: number[];
  lastFormulaChange: number;
  lastFrameTime: number;
  kick: number;
  energy: number;
  started: boolean;
  isPaused: boolean;
}

type SourceMode = "file" | "url" | "social";
type VisualMode = "auto" | "wave" | "peak";

export default function MathWaveVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [playlist, setPlaylist] = useState<string[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);

  const [started, setStarted] = useState<boolean>(false);
  const [sourceMode, setSourceMode] = useState<SourceMode>("file");
  const [convertedMediaUrl, setConvertedMediaUrl] = useState<string | null>(
    null,
  );
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [convertStatus, setConvertStatus] = useState<string>(
    "Masukkan URL lalu klik Konversi",
  );
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentMode, setCurrentMode] = useState<VisualMode>("auto");
  const [bpmDisplay, setBpmDisplay] = useState<string>("--");
  const [showBpm, setShowBpm] = useState<boolean>(false);
  const [formulaText, setFormulaText] = useState<string>(
    "f(x) = A sin(ωx + φ)",
  );
  const [showFormula, setShowFormula] = useState<boolean>(true);
  const [infoA, setInfoA] = useState<string>("60");
  const [infoOmega, setInfoOmega] = useState<string>("0.020");
  const [infoPhi, setInfoPhi] = useState<string>("0.00");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const socialUrlInputRef = useRef<HTMLInputElement>(null);
  const randomCheckRef = useRef<HTMLInputElement>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayFreqRef = useRef<Uint8Array | null>(null);
  const dataArrayTimeRef = useRef<Uint8Array | null>(null);
  const mediaElementRef = useRef<HTMLMediaElement | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const isVideoRef = useRef<boolean>(false);
  const loopIdRef = useRef<number | null>(null);

  const visualStateRef = useRef<VisualState>({
    W: 0,
    H: 0,
    cx: 0,
    cy: 0,
    stars: [],
    mathParticles: [],
    waveAmp: 60,
    targetAmp: 60,
    waveFreq: 0.02,
    targetFreq: 0.02,
    wavePhase: 0,
    targetPhase: 0,
    ampLerp: 1,
    freqLerp: 1,
    phaseLerp: 1,
    visualMode: "both",
    randomEnabled: true,
    bpmHistory: [],
    lastBpmTime: 0,
    smoothedBpm: 120,
    lastBeat: 0,
    beatCooldown: 180,
    smoothedTimeData: null,
    smoothedBars: new Array(BANDS).fill(0),
    lastFormulaChange: 0,
    lastFrameTime: 0,
    kick: 0,
    energy: 0,
    started: false,
    isPaused: false,
  });

  const startVisualizationRef = useRef<
    ((source?: string) => Promise<void>) | null
  >(null);
  const updateFormulaRef = useRef<(() => void) | null>(null);
  const loopRef = useRef<(() => void) | null>(null);

  // ===== RESIZE =====
  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const container = canvas.parentElement;
    const rect = container?.getBoundingClientRect() || {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const W = rect.width || window.innerWidth;
    const H = rect.height || window.innerHeight;

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;

    const cx = W / 2;
    const cy = H / 2;
    visualStateRef.current.W = W;
    visualStateRef.current.H = H;
    visualStateRef.current.cx = cx;
    visualStateRef.current.cy = cy;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  }, []);

  // ===== INIT STARS & PARTICLES =====
  const initStars = useCallback(() => {
    const { W, H } = visualStateRef.current;
    const stars: Star[] = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        s: 0.3 + Math.random() * 1.8,
        speed: 0.002 + Math.random() * 0.01,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.3 + Math.random() * 0.5,
      });
    }
    visualStateRef.current.stars = stars;
  }, []);

  const initParticles = useCallback(() => {
    const { W, H } = visualStateRef.current;
    const symbols = ["∫", "∑", "π", "√", "∞", "∂", "Δ", "θ", "λ", "ω", "φ"];
    const particles: MathParticle[] = [];
    const count = Math.min(PARTICLE_COUNT, 15);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        size: 10 + Math.random() * 15,
        alpha: 0.03 + Math.random() * 0.05,
        life: Math.random() * 200,
      });
    }
    visualStateRef.current.mathParticles = particles;
  }, []);

  // ===== GET BAND =====
  const getBand = useCallback((i: number): number => {
    const dataArrayFreq = dataArrayFreqRef.current;
    if (!dataArrayFreq) return 0;
    const size = Math.floor(dataArrayFreq.length / BANDS);
    let sum = 0;
    for (let j = 0; j < size; j++) {
      sum += dataArrayFreq[i * size + j];
    }
    return sum / size;
  }, []);

  // ===== UTILITY =====
  const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
  const clamp = (v: number, mn: number, mx: number): number =>
    Math.max(mn, Math.min(mx, v));

  // ===== UPDATE FORMULA =====
  const updateFormula = useCallback(() => {
    const formulas = [
      "f(x) = A sin(ωx + φ)",
      "f(x) = A cos(ωx) + B",
      "f(x) = A tan(ωx)",
      "f(x) = A sin(ωx) + B cos(ωx)",
      "f(x) = A e^(kx)",
      "f(x) = A ln(x)",
      "f(x) = A sin(ωx) cos(ωx)",
      "f(x) = A |sin(ωx)|",
      "f(x) = A ∑ sin(nωx)",
      "f(x) = A ∫ sin(ωt) dt",
    ];
    const idx = Math.floor(Math.random() * formulas.length);
    setFormulaText(formulas[idx]);
    setShowFormula(true);
    const vs = visualStateRef.current;
    vs.targetAmp = 35 + Math.random() * 90;
    vs.targetFreq = 0.008 + Math.random() * 0.045;
    vs.targetPhase = Math.random() * Math.PI * 2;
    vs.ampLerp = 0;
    vs.freqLerp = 0;
    vs.phaseLerp = 0;
  }, []);

  updateFormulaRef.current = updateFormula;

  // ===== UPDATE BPM =====
  const updateBpm = useCallback((now: number, energy: number) => {
    const vs = visualStateRef.current;
    if (energy > 80 && now - vs.lastBpmTime > 150) {
      const delta = now - vs.lastBpmTime;
      if (delta > 180 && delta < 850) {
        const instantBpm = 60000 / delta;
        vs.bpmHistory.push(instantBpm);
        if (vs.bpmHistory.length > 10) vs.bpmHistory.shift();
        if (vs.bpmHistory.length >= 3) {
          const avg =
            vs.bpmHistory.reduce((a, b) => a + b, 0) / vs.bpmHistory.length;
          vs.smoothedBpm = vs.smoothedBpm * 0.6 + avg * 0.4;
        }
      }
      vs.lastBpmTime = now;
    }
    if (vs.bpmHistory.length > 2) {
      setShowBpm(true);
      setBpmDisplay(Math.round(vs.smoothedBpm).toString());
    } else {
      setShowBpm(false);
    }
  }, []);

  // ===== DRAW FUNCTIONS =====
  const drawGalaxy = useCallback((time: number, kick: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { W, H, cx, cy, stars } = visualStateRef.current;

    const grad = ctx.createRadialGradient(
      cx - W * 0.15,
      cy - H * 0.15,
      100,
      cx,
      cy,
      Math.max(W, H) * 0.9,
    );
    const hueShift = 260 + kick * 0.05;
    grad.addColorStop(0, `hsl(${hueShift},80%,7%)`);
    grad.addColorStop(0.5, `hsl(${hueShift + 20},70%,4%)`);
    grad.addColorStop(1, "#020108");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    const maxStars = Math.min(stars.length, 80);
    for (let i = 0; i < maxStars; i++) {
      const s = stars[i];
      const flicker = 0.7 + 0.3 * Math.sin(time * s.speed + s.phase);
      const alpha = s.alpha * flicker * 0.6;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "rgb(200,180,255)";
      ctx.shadowBlur = 5;
      ctx.shadowColor = `rgba(150,100,255,${alpha * 0.2})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.s * 0.3 + 0.1, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }, []);

  const drawMathParticles = useCallback((time: number, kick: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { mathParticles, W, H } = visualStateRef.current;

    mathParticles.forEach((p) => {
      p.x += p.vx + Math.sin(time * 0.001 + p.life) * 0.05;
      p.y += p.vy + Math.cos(time * 0.001 + p.life) * 0.05;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
      const alpha = p.alpha * (0.5 + 0.5 * Math.sin(time * 0.002 + p.life));
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `hsl(${280 + kick * 0.1 + (p.life % 20)},80%,70%)`;
      ctx.font = `${p.size}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowBlur = 20;
      ctx.shadowColor = `rgba(160,100,255,${alpha * 0.3})`;
      ctx.fillText(p.symbol, p.x, p.y);
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }, []);

  const drawAxis = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { W, H, cx, cy } = visualStateRef.current;

    const stepX = W / 12,
      stepY = H / 12;
    ctx.strokeStyle = "rgba(180,150,255,0.05)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x < W; x += stepX) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += stepY) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
    ctx.shadowBlur = 12;
    ctx.shadowColor = "rgba(160,120,255,0.15)";
    ctx.strokeStyle = "rgba(200,180,255,0.2)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(W, cy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, H);
    ctx.stroke();
    ctx.fillStyle = "rgba(200,180,255,0.2)";
    ctx.shadowBlur = 0;
    ctx.font = "12px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("x", W - 20, cy + 8);
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText("y", cx + 14, 14);
    ctx.shadowBlur = 0;
  }, []);

  const drawSmoothPath = useCallback(
    (ctx: CanvasRenderingContext2D, points: { x: number; y: number }[]) => {
      if (points.length < 3) {
        points.forEach((p, i) => {
          i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
        });
        return;
      }
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length - 1; i++) {
        const mx = (points[i].x + points[i + 1].x) / 2;
        const my = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, mx, my);
      }
      const last = points[points.length - 1];
      ctx.lineTo(last.x, last.y);
    },
    [],
  );

  const drawWaveform = useCallback(
    (timeData: Uint8Array | Float32Array, kick: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const { W, H, cy } = visualStateRef.current;

      if (!timeData || timeData.length < 2) return;

      const len = Math.min(timeData.length, WAVE_POINTS);
      const step = Math.max(1, Math.floor(timeData.length / len));
      const points: { x: number; y: number }[] = [];

      const filteredData = new Float32Array(timeData.length);
      const filterStrength = 0.3;
      for (let i = 0; i < timeData.length; i++) {
        if (i === 0) {
          filteredData[i] = timeData[i];
        } else {
          filteredData[i] =
            filteredData[i - 1] * filterStrength +
            timeData[i] * (1 - filterStrength);
        }
      }

      for (let i = 0; i < len; i++) {
        const idx = Math.min(i * step, filteredData.length - 1);
        const val = (filteredData[idx] - 128) / 128;
        const x = (i / len) * W;
        const y = cy - val * (H * 0.25);
        points.push({ x, y });
      }

      ctx.save();

      ctx.shadowBlur = 20;
      ctx.shadowColor = `hsla(${280 + kick * 0.15}, 100%, 70%, 0.3)`;

      const gradient = ctx.createLinearGradient(
        0,
        cy - H * 0.25,
        0,
        cy + H * 0.25,
      );
      gradient.addColorStop(0, `hsla(${280 + kick * 0.1}, 100%, 70%, 0.8)`);
      gradient.addColorStop(0.3, `hsla(${300 + kick * 0.1}, 90%, 60%, 0.9)`);
      gradient.addColorStop(0.5, `hsla(${320 + kick * 0.1}, 80%, 50%, 1)`);
      gradient.addColorStop(0.7, `hsla(${300 + kick * 0.1}, 90%, 60%, 0.9)`);
      gradient.addColorStop(1, `hsla(${280 + kick * 0.1}, 100%, 70%, 0.8)`);

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2.2 + kick * 0.02;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      drawSmoothPath(ctx, points);
      ctx.stroke();

      if (kick > 30) {
        ctx.shadowBlur = 40;
        ctx.shadowColor = `hsla(${280 + kick * 0.1}, 100%, 60%, 0.15)`;
        ctx.strokeStyle = `hsla(${280 + kick * 0.1}, 100%, 70%, 0.1)`;
        ctx.lineWidth = 6 + kick * 0.03;
        ctx.beginPath();
        drawSmoothPath(ctx, points);
        ctx.stroke();
      }

      ctx.restore();

      const peaks: number[] = [];
      const peakThreshold = 0.3;
      for (let i = 10; i < points.length - 10; i++) {
        const p = points[i];
        const prev = points[i - 1];
        const next = points[i + 1];
        if (
          p.y < prev.y &&
          p.y < next.y &&
          Math.abs(p.y - cy) > H * peakThreshold
        ) {
          peaks.push(i);
        } else if (
          p.y > prev.y &&
          p.y > next.y &&
          Math.abs(p.y - cy) > H * peakThreshold
        ) {
          peaks.push(i);
        }
      }

      peaks.slice(0, 3).forEach((idx) => {
        const p = points[idx];
        const distance = Math.abs(p.y - cy) / (H * 0.25);
        const opacity = Math.min(1, distance * 0.5);

        ctx.save();
        ctx.globalAlpha = opacity * 0.5;
        ctx.fillStyle = `hsla(${280 + kick * 0.1}, 100%, 80%, ${opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(160,100,255,${opacity * 0.3})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2 + kick * 0.01, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    },
    [drawSmoothPath],
  );

  const drawBars = useCallback((barVals: number[], kick: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { W, H } = visualStateRef.current;

    if (!barVals || barVals.length < 2) return;
    const barWidth = (W / BANDS) * 0.65;
    const gap = (W / BANDS) * 0.35;
    const maxHeight = H * 0.18;
    const bottomY = H - 16;
    for (let i = 0; i < BANDS; i++) {
      const val = barVals[i];
      const height = val * maxHeight;
      const x = i * (W / BANDS) + gap / 2;
      const y = bottomY - height;
      const hue = 260 + i * 4 + kick * 0.1;
      ctx.shadowBlur = 18;
      ctx.shadowColor = `hsl(${hue},100%,60%)`;
      const grad = ctx.createLinearGradient(x, y, x, bottomY);
      grad.addColorStop(0, `hsl(${hue},95%,70%)`);
      grad.addColorStop(1, `hsl(${hue + 20},90%,50%)`);
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, barWidth, height);
      ctx.shadowBlur = 30;
      ctx.shadowColor = "rgba(160,80,255,0.1)";
      ctx.fillStyle = "rgba(255,255,255,0.04)";
      ctx.fillRect(x, y, barWidth, height * 0.3);
    }
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(200,180,255,0.15)";
    ctx.font = "8px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    for (let i = 0; i < BANDS; i += 2) {
      const x = i * (W / BANDS) + W / BANDS / 2;
      ctx.fillText(`${i * 2}Hz`, x, bottomY + 4);
    }
  }, []);

  // ===== MAIN LOOP =====
  const loop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const vs = visualStateRef.current;
    const now = performance.now();

    if (
      !vs.started ||
      !analyserRef.current ||
      !dataArrayFreqRef.current ||
      !dataArrayTimeRef.current
    ) {
      drawGalaxy(now, 0);
      drawMathParticles(now, 0);
      drawAxis();
      vs.lastFrameTime = now;
      loopIdRef.current = requestAnimationFrame(loop);
      return;
    }

    let dt = (now - vs.lastFrameTime) / 1000;
    if (!(dt > 0) || dt > 0.1) dt = 1 / 60;
    vs.lastFrameTime = now;
    analyserRef.current.getByteFrequencyData(
      dataArrayFreqRef.current as Uint8Array<ArrayBuffer>,
    );
    analyserRef.current.getByteTimeDomainData(
      dataArrayTimeRef.current as Uint8Array<ArrayBuffer>,
    );

    const timeData = dataArrayTimeRef.current;
    if (
      !vs.smoothedTimeData ||
      vs.smoothedTimeData.length !== timeData.length
    ) {
      vs.smoothedTimeData = new Float32Array(timeData.length);
    }

    const waveSmoothF = 1 - Math.pow(0.0005, dt / 0.05);
    for (let i = 0; i < timeData.length; i++) {
      vs.smoothedTimeData[i] +=
        (timeData[i] - vs.smoothedTimeData[i]) * waveSmoothF;
    }

    const bandData = Array.from({ length: BANDS }, (_, i) => getBand(i));
    vs.kick = bandData[0] || 0;
    vs.energy = bandData.reduce((a, b) => a + b, 0) / BANDS;
    const threshold = 70 + (1 - Math.min(1, vs.energy / 180)) * 20;

    if (vs.kick > threshold && now - vs.lastBeat > vs.beatCooldown) {
      vs.lastBeat = now;
      updateBpm(now, vs.kick);
      if (
        !vs.isPaused &&
        vs.randomEnabled &&
        now - vs.lastFormulaChange > 140
      ) {
        vs.lastFormulaChange = now;
        updateFormula();
      }
      vs.beatCooldown = 190 - vs.kick / 3;
      vs.beatCooldown = clamp(vs.beatCooldown, 65, 280);
    }

    if (!vs.isPaused) {
      const lerpSpeed = 4.2 * dt;
      vs.ampLerp = Math.min(1, vs.ampLerp + lerpSpeed);
      vs.freqLerp = Math.min(1, vs.freqLerp + lerpSpeed);
      vs.phaseLerp = Math.min(1, vs.phaseLerp + lerpSpeed);
    }

    vs.waveAmp = lerp(vs.waveAmp, vs.targetAmp, vs.ampLerp);
    vs.waveFreq = lerp(vs.waveFreq, vs.targetFreq, vs.freqLerp);
    vs.wavePhase = lerp(vs.wavePhase, vs.targetPhase, vs.phaseLerp);

    setInfoA(vs.waveAmp.toFixed(0));
    setInfoOmega(vs.waveFreq.toFixed(3));
    setInfoPhi(vs.wavePhase.toFixed(2));

    const barSmoothF = 1 - Math.pow(0.001, dt / 0.035);
    for (let i = 0; i < BANDS; i++) {
      const target = bandData[i] / 255;
      vs.smoothedBars[i] += (target - vs.smoothedBars[i]) * barSmoothF;
    }

    drawGalaxy(now, vs.kick);
    drawMathParticles(now, vs.kick);
    drawAxis();

    if (vs.visualMode === "wave" || vs.visualMode === "both") {
      drawWaveform(vs.smoothedTimeData, vs.kick);
    }
    if (vs.visualMode === "bars" || vs.visualMode === "both") {
      drawBars(vs.smoothedBars, vs.kick);
    }

    if (vs.isPaused) {
      ctx.fillStyle = "rgba(251,191,36,0.4)";
      ctx.font = "18px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("⏸ JEDA", vs.cx, 30);
    }

    loopIdRef.current = requestAnimationFrame(loop);
  }, [
    drawGalaxy,
    drawMathParticles,
    drawAxis,
    drawWaveform,
    drawBars,
    getBand,
    updateBpm,
    updateFormula,
  ]);

  loopRef.current = loop;
  const startVisualization = useCallback(
    async (source?: string) => {
      const audio = audioRef.current;
      const video = videoRef.current;
      if (!audio || !video) {
        setErrorMessage("❌ Elemen media tidak ditemukan");
        return;
      }

      let url = source || "";

      try {
        // ---- SAME SOURCE SELECTION LOGIC ----
        if (sourceMode === "file") {
          const file = fileInputRef.current?.files?.[0];
          if (!file) {
            setErrorMessage("❌ Silakan pilih file terlebih dahulu");
            return;
          }
          if (
            !file.type.startsWith("audio/") &&
            !file.type.startsWith("video/")
          ) {
            setErrorMessage("❌ Harap pilih file audio atau video");
            return;
          }
          url = URL.createObjectURL(file);
        } else if (sourceMode === "url") {
          const inputUrl = urlInputRef.current?.value.trim();
          if (!inputUrl) {
            setErrorMessage("❌ Silakan masukkan URL");
            return;
          }
          url = inputUrl;
        } else if (sourceMode === "social") {
          if (!url) {
            setErrorMessage("❌ Silakan konversi URL terlebih dahulu");
            return;
          }
          if (!url.startsWith("http")) {
            setErrorMessage("❌ URL hasil konversi tidak valid");
            return;
          }
        }

        if (!url) {
          setErrorMessage("❌ URL tidak valid");
          return;
        }

        // ---- HIDE UI ----
        const uiElement = document.getElementById("ui");
        if (uiElement) uiElement.style.display = "none";
        document.getElementById("mediaControls")?.classList.add("show");
        document.getElementById("topRight")?.classList.add("show");

        // ---- FUNGSI LOAD MEDIA (PROMISE) ----
        const loadMedia = (
          element: HTMLMediaElement,
          src: string,
        ): Promise<void> => {
          return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error("Timeout loading media (45s)"));
            }, 45000);

            const onReady = () => {
              clearTimeout(timeout);
              element.removeEventListener("canplaythrough", onReady);
              element.removeEventListener("loadedmetadata", onReady);
              element.removeEventListener("error", onError);
              resolve();
            };

            const onError = (e: Event) => {
              clearTimeout(timeout);
              element.removeEventListener("canplaythrough", onReady);
              element.removeEventListener("loadedmetadata", onReady);
              element.removeEventListener("error", onError);

              const error = (e.target as HTMLMediaElement).error;
              let errorMsg = "Unknown error";
              if (error) {
                switch (error.code) {
                  case 1:
                    errorMsg = "Download aborted";
                    break;
                  case 2:
                    errorMsg = "Network error";
                    break;
                  case 3:
                    errorMsg = "Decode error - Format tidak didukung";
                    break;
                  case 4:
                    errorMsg = "Media not found - Cek URL";
                    break;
                  default:
                    errorMsg = error.message || "Unknown error";
                }
              }
              reject(new Error(`Media load error: ${errorMsg}`));
            };

            element.crossOrigin = "anonymous";
            element.preload = "auto";
            element.src = src;
            element.load();

            element.addEventListener("canplaythrough", onReady);
            element.addEventListener("loadedmetadata", onReady);
            element.addEventListener("error", onError);
          });
        };

        // ---- COBA AUDIO DULU ----
        let mediaElement: HTMLMediaElement;
        let isVideo = false;
        try {
          console.log("🔄 Mencoba memuat sebagai audio...");
          await loadMedia(audio, url);
          console.log("✅ Audio loaded successfully");
          mediaElement = audio;
          isVideo = false;
        } catch (audioError) {
          console.warn("❌ Audio gagal, fallback ke video:", audioError);
          try {
            await loadMedia(video, url);
            console.log("✅ Video loaded successfully");
            mediaElement = video;
            isVideo = true;
          } catch (videoError) {
            throw new Error(
              `Gagal memuat media (audio & video): ${(videoError as Error).message}`,
            );
          }
        }

        // ---- SETUP AUDIO CONTEXT & ANALYSER ----
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (
            window.AudioContext || (window as any).webkitAudioContext
          )();
        }
        const audioCtx = audioCtxRef.current;
        await audioCtx.resume();

        if (!analyserRef.current) {
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 2048;
          analyser.smoothingTimeConstant = 0.6;
          analyserRef.current = analyser;
          dataArrayFreqRef.current = new Uint8Array(analyser.frequencyBinCount);
          dataArrayTimeRef.current = new Uint8Array(analyser.fftSize);
        }
        const analyser = analyserRef.current;

        if (!sourceNodeRef.current) {
          const sourceNode = audioCtx.createMediaElementSource(mediaElement);
          sourceNode.connect(analyser);
          analyser.connect(audioCtx.destination);
          sourceNodeRef.current = sourceNode;
        }

        mediaElementRef.current = mediaElement;
        isVideoRef.current = isVideo;

        // ---- UPDATE STATE ----
        const vs = visualStateRef.current;
        vs.started = true;
        vs.isPaused = false;
        vs.visualMode = "both";
        vs.randomEnabled = true;

        setStarted(true);
        setIsPaused(false);
        setCurrentMode("auto");
        setErrorMessage(null);

        updateFormula();

        try {
          await mediaElement.play();
          console.log("▶️ Media playing");
        } catch (playError) {
          console.warn("⚠️ Autoplay failed:", playError);
          vs.isPaused = true;
          setIsPaused(true);
        }

        if (loopIdRef.current) cancelAnimationFrame(loopIdRef.current);
        loop();
      } catch (error) {
        console.error("❌ Error starting visualization:", error);
        const errorMsg = (error as Error).message;
        setErrorMessage(`❌ Gagal memuat media: ${errorMsg}`);

        const uiElement = document.getElementById("ui");
        if (uiElement) uiElement.style.display = "flex";
        document.getElementById("mediaControls")?.classList.remove("show");
        document.getElementById("topRight")?.classList.remove("show");
      }
    },
    [sourceMode, updateFormula, loop],
  );

  startVisualizationRef.current = startVisualization;

  // ===== HANDLE CONVERT =====
  const handleConvert = useCallback(async () => {
    const url = socialUrlInputRef.current?.value.trim();
    if (!url) {
      setConvertStatus("⚠️ Masukkan URL.");
      return;
    }

    setConvertStatus("⏳ Mengonversi...");
    setIsConverting(true);
    setErrorMessage(null);

    try {
      console.log("📤 Sending convert request for:", url);

      const resp = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await resp.json();
      console.log("📥 Convert response:", data);

      if (!resp.ok || !data.success) {
        throw new Error(data.error || "Konversi gagal");
      }

      const mediaUrl = data.media_url || data.audio_url;
      if (!mediaUrl) {
        throw new Error("Tidak ditemukan link media.");
      }

      setConvertedMediaUrl(mediaUrl);
      setConvertStatus(`✅ Berhasil: ${data.title || "Media"}`);

      console.log("🎵 Final Media URL:", mediaUrl);

      // Mulai visualisasi otomatis setelah convert sukses.
      if (startVisualizationRef.current) {
        await startVisualizationRef.current(mediaUrl);
      }
    } catch (err) {
      const errMessage = (err as Error).message;
      setConvertStatus("❌ " + errMessage);
      setErrorMessage(errMessage);
      console.error("❌ Convert error:", err);
    } finally {
      setIsConverting(false);
    }
  }, []);

  // ===== HANDLE UPLOAD =====
  const handleUpload = useCallback(() => {
    if (sourceMode === "file") {
      if (!fileInputRef.current?.files?.[0]) {
        setErrorMessage("❌ Silakan pilih file terlebih dahulu");
        return;
      }
      if (startVisualizationRef.current) {
        startVisualizationRef.current();
      }
    } else if (sourceMode === "url") {
      if (!urlInputRef.current?.value.trim()) {
        setErrorMessage("❌ Silakan masukkan URL");
        return;
      }
      if (startVisualizationRef.current) {
        startVisualizationRef.current();
      }
    } else if (sourceMode === "social") {
      if (!convertedMediaUrl) {
        setErrorMessage("❌ Silakan konversi URL terlebih dahulu");
        return;
      }
      if (startVisualizationRef.current) {
        startVisualizationRef.current(convertedMediaUrl);
      }
    }
  }, [sourceMode, convertedMediaUrl]);

  // ===== CONTROLS =====
  const togglePlayPause = useCallback(() => {
    const vs = visualStateRef.current;
    if (!vs.started || !mediaElementRef.current) return;
    if (vs.isPaused) {
      if (audioCtxRef.current?.state === "suspended") {
        audioCtxRef.current?.resume();
      }
      mediaElementRef.current.play().catch((e) => console.warn(e));
      vs.isPaused = false;
      setIsPaused(false);
    } else {
      mediaElementRef.current.pause();
      vs.isPaused = true;
      setIsPaused(true);
    }
  }, []);

  const restartMedia = useCallback(() => {
    const vs = visualStateRef.current;
    if (!vs.started || !mediaElementRef.current) return;
    mediaElementRef.current.currentTime = 0;
    if (audioCtxRef.current?.state === "suspended") {
      audioCtxRef.current?.resume();
    }
    mediaElementRef.current.play().catch((e) => console.warn(e));
    vs.isPaused = false;
    setIsPaused(false);
    vs.bpmHistory = [];
    vs.smoothedBpm = 120;
    setShowBpm(false);
    vs.targetAmp = 60;
    vs.targetFreq = 0.02;
    vs.targetPhase = 0;
    vs.ampLerp = 1;
    vs.freqLerp = 1;
    vs.phaseLerp = 1;
    vs.waveAmp = vs.targetAmp;
    vs.waveFreq = vs.targetFreq;
    vs.wavePhase = vs.targetPhase;
    setFormulaText("f(x) = A sin(ωx + φ)");
    setShowFormula(true);
    setInfoA(vs.waveAmp.toFixed(0));
    setInfoOmega(vs.waveFreq.toFixed(3));
    setInfoPhi(vs.wavePhase.toFixed(2));
  }, []);

  const randomizeNow = useCallback(() => {
    const vs = visualStateRef.current;
    if (!vs.started) return;
    vs.targetAmp = 30 + Math.random() * 100;
    vs.targetFreq = 0.008 + Math.random() * 0.05;
    vs.targetPhase = Math.random() * Math.PI * 2;
    vs.ampLerp = 0;
    vs.freqLerp = 0;
    vs.phaseLerp = 0;
    updateFormula();
  }, [updateFormula]);

  const handleModeChange = useCallback((mode: VisualMode) => {
    const vs = visualStateRef.current;
    if (!vs.started) return;
    setCurrentMode(mode);
    if (mode === "auto") {
      if (randomCheckRef.current) randomCheckRef.current.checked = true;
      vs.randomEnabled = true;
      vs.visualMode = "both";
    } else if (mode === "wave") {
      if (randomCheckRef.current) randomCheckRef.current.checked = false;
      vs.randomEnabled = false;
      vs.visualMode = "wave";
    } else {
      if (randomCheckRef.current) randomCheckRef.current.checked = false;
      vs.randomEnabled = false;
      vs.visualMode = "bars";
    }
  }, []);

  const nextTrack = useCallback(() => {
    if (playlist.length === 0) return;
    const nextIndex = isShuffling
      ? Math.floor(Math.random() * playlist.length)
      : (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextIndex);
    if (started && mediaElementRef.current && startVisualizationRef.current) {
      const newUrl = playlist[nextIndex];
      startVisualizationRef.current(newUrl);
    }
  }, [playlist, currentTrackIndex, isShuffling, started]);

  const prevTrack = useCallback(() => {
    if (playlist.length === 0) return;
    const prevIndex = isShuffling
      ? Math.floor(Math.random() * playlist.length)
      : (currentTrackIndex - 1 + playlist.length) % playlist.length;
    setCurrentTrackIndex(prevIndex);
    if (started && mediaElementRef.current && startVisualizationRef.current) {
      const newUrl = playlist[prevIndex];
      startVisualizationRef.current(newUrl);
    }
  }, [playlist, currentTrackIndex, isShuffling, started]);

  // ===== INITIAL SETUP =====
  useEffect(() => {
    resize();
    initStars();
    initParticles();
    const onResize = () => {
      resize();
      initStars();
      initParticles();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (loopIdRef.current) {
        cancelAnimationFrame(loopIdRef.current);
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, [resize, initStars, initParticles]);

  // ===== RENDER =====
  return (
    <div className="relative w-full h-full bg-[#05050f] overflow-hidden">
      <video
        ref={videoRef}
        playsInline
        crossOrigin="anonymous"
        className="hidden"
      />
      <audio
        ref={audioRef}
        playsInline
        crossOrigin="anonymous"
        className="hidden"
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-10"
        style={{ display: "block" }}
      />

      {errorMessage && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-red-500/95 text-white p-4 sm:p-6 rounded-2xl max-w-[90%] sm:max-w-md text-center shadow-2xl backdrop-blur-sm">
          <div className="text-3xl sm:text-4xl mb-2">❌</div>
          <p className="font-bold text-base sm:text-lg mb-2">Error</p>
          <p className="text-xs sm:text-sm opacity-90 break-words">
            {errorMessage}
          </p>
          <button
            className="mt-4 px-4 sm:px-6 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all duration-200 text-sm sm:text-base"
            onClick={() => setErrorMessage(null)}
          >
            Tutup
          </button>
        </div>
      )}

      {/* UI */}
      <div
        id="ui"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center flex flex-col items-center gap-2 sm:gap-3 md:gap-4 w-[90%] sm:w-[85%] max-w-[500px] px-2"
        style={{ pointerEvents: "none" }}
      >
        <div className="glow-text text-xs sm:text-sm md:text-base lg:text-xl px-3 sm:px-4 md:px-6 py-1.5 sm:py-2">
          ✦ MATH WAVE · RHYTHM
        </div>
        <div className="sub-text text-[8px] sm:text-[10px] px-2 sm:px-3 py-0.5 sm:py-1">
          upload file, URL langsung, atau konversi dari sosial media
        </div>

        <div
          className="upload-box p-2 sm:p-3 md:p-4 gap-1.5 sm:gap-2 md:gap-3 w-full"
          style={{ pointerEvents: "auto" }}
        >
          <div className="source-selector gap-1 p-0.5 sm:p-1">
            <button
              className={`source-btn text-[8px] sm:text-[10px] md:text-xs px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 ${sourceMode === "file" ? "active" : ""}`}
              onClick={() => setSourceMode("file")}
            >
              📁 File
            </button>
            <button
              className={`source-btn text-[8px] sm:text-[10px] md:text-xs px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 ${sourceMode === "url" ? "active" : ""}`}
              onClick={() => setSourceMode("url")}
            >
              🔗 URL
            </button>
            <button
              className={`source-btn text-[8px] sm:text-[10px] md:text-xs px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 ${sourceMode === "social" ? "active" : ""}`}
              onClick={() => setSourceMode("social")}
            >
              🌐 Sosial
            </button>
          </div>

          <div
            className="input-wrapper"
            style={{ display: sourceMode === "file" ? "flex" : "none" }}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="audio/*,video/*"
              className="text-[8px] sm:text-[10px] md:text-xs px-2 sm:px-3 py-1.5 sm:py-2"
            />
          </div>

          <div
            className="input-wrapper"
            style={{ display: sourceMode === "url" ? "flex" : "none" }}
          >
            <input
              type="text"
              ref={urlInputRef}
              placeholder="https://contoh.com/lagu.mp3"
              className="text-[8px] sm:text-[10px] md:text-xs px-2 sm:px-3 py-1.5 sm:py-2"
            />
            <div className="url-hint text-[6px] sm:text-[8px]">
              * Link langsung ke file media
            </div>
          </div>

          <div
            className="input-wrapper"
            style={{ display: sourceMode === "social" ? "flex" : "none" }}
          >
            <input
              type="text"
              ref={socialUrlInputRef}
              placeholder="https://youtube.com/... atau tiktok.com/..."
              className="text-[8px] sm:text-[10px] md:text-xs px-2 sm:px-3 py-1.5 sm:py-2"
            />
            <button
              className="convert-btn text-[8px] sm:text-[10px] md:text-xs px-2 sm:px-3 py-1.5 sm:py-2"
              onClick={handleConvert}
              disabled={isConverting}
            >
              ⬇️ Konversi
            </button>
            <div className="text-[7px] sm:text-[9px] text-[#c8b8ff] min-h-[1.2em] text-center break-all">
              {convertStatus}
            </div>
          </div>

          <div className="checkbox-row text-[8px] sm:text-[10px] md:text-xs gap-1.5 sm:gap-2">
            <input
              type="checkbox"
              ref={randomCheckRef}
              defaultChecked
              className="w-3 h-3 sm:w-4 sm:h-4"
            />
            <label className="cursor-pointer">✨ Acak Parameter & Rumus</label>
          </div>

          <button
            className="upload-btn text-[10px] sm:text-xs md:text-sm px-2 sm:px-3 py-1.5 sm:py-2.5"
            onClick={handleUpload}
          >
            ▶ Mulai Visualisasi
          </button>
        </div>
      </div>

      {/* Top Right Controls */}
      <div
        id="topRight"
        className={`absolute top-1 sm:top-2 md:top-3 right-1 sm:right-2 md:right-3 z-[18] flex flex-col items-end gap-0.5 sm:gap-1 transition-opacity duration-600 max-w-[75%] sm:max-w-[70%] ${started ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{ pointerEvents: started ? "auto" : "none" }}
      >
        <div className="flex gap-0.5 sm:gap-1 bg-[rgba(8,4,25,0.7)] backdrop-blur-xl px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-[30px] sm:rounded-[40px] border border-[rgba(180,130,255,0.12)]">
          <button
            className={`mode-item text-[7px] sm:text-[10px] px-1 sm:px-2 py-0.5 sm:py-1 ${currentMode === "auto" ? "active" : ""}`}
            onClick={() => handleModeChange("auto")}
          >
            A <span className="sub text-[5px] sm:text-[8px]">auto</span>
          </button>
          <button
            className={`mode-item text-[7px] sm:text-[10px] px-1 sm:px-2 py-0.5 sm:py-1 ${currentMode === "wave" ? "active" : ""}`}
            onClick={() => handleModeChange("wave")}
          >
            W <span className="sub text-[5px] sm:text-[8px]">wave</span>
          </button>
          <button
            className={`mode-item text-[7px] sm:text-[10px] px-1 sm:px-2 py-0.5 sm:py-1 ${currentMode === "peak" ? "active" : ""}`}
            onClick={() => handleModeChange("peak")}
          >
            P <span className="sub text-[5px] sm:text-[8px]">peak</span>
          </button>
        </div>

        <div className="bg-[rgba(8,4,25,0.6)] backdrop-blur-md px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-xl sm:rounded-2xl border border-[rgba(180,130,255,0.08)] flex flex-wrap gap-0.5 sm:gap-1 gap-x-1 sm:gap-x-2 justify-end text-[6px] sm:text-[10px] text-[rgba(200,180,255,0.5)] font-mono">
          <span>
            <span className="opacity-40">A=</span>
            <span className="text-[rgba(220,200,255,0.7)] font-semibold">
              {infoA}
            </span>
          </span>
          <span>
            <span className="opacity-40">ω=</span>
            <span className="text-[rgba(220,200,255,0.7)] font-semibold">
              {infoOmega}
            </span>
          </span>
          <span>
            <span className="opacity-40">φ=</span>
            <span className="text-[rgba(220,200,255,0.7)] font-semibold">
              {infoPhi}
            </span>
          </span>
          <span>
            <span className="opacity-40">mode:</span>
            <span className="text-[rgba(220,200,255,0.7)] font-semibold">
              {currentMode}
            </span>
          </span>
          <span>
            <span className="opacity-40">BANDS:</span>
            <span className="text-[rgba(220,200,255,0.7)] font-semibold">
              {BANDS}
            </span>
          </span>
        </div>
      </div>

      {/* Media Controls */}
      <div
        id="mediaControls"
        className={`absolute bottom-[80px] sm:bottom-[100px] md:bottom-[120px] left-1/2 -translate-x-1/2 z-[15] flex gap-1 sm:gap-2 bg-[rgba(8,4,25,0.7)] backdrop-blur-xl px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-[30px] sm:rounded-[50px] border border-[rgba(180,130,255,0.12)] flex-wrap justify-center transition-opacity duration-600 ${started ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{ pointerEvents: started ? "auto" : "none" }}
      >
        <button
          className="media-btn text-[8px] sm:text-[10px] md:text-xs px-1.5 sm:px-3 py-0.5 sm:py-1"
          onClick={prevTrack}
          title="Lagu Sebelumnya"
        >
          <span className="icon text-[10px] sm:text-sm">⏮</span>
          <span className="hidden xs:inline text-[8px] sm:text-[10px]">
            Prev
          </span>
        </button>

        <button
          className="media-btn text-[8px] sm:text-[10px] md:text-xs px-1.5 sm:px-3 py-0.5 sm:py-1"
          onClick={togglePlayPause}
        >
          <span className="icon text-[10px] sm:text-sm">
            {isPaused ? "▶" : "⏸"}
          </span>
          <span className="hidden xs:inline text-[8px] sm:text-[10px]">
            {isPaused ? "Lanjut" : "Jeda"}
          </span>
        </button>

        <button
          className="media-btn text-[8px] sm:text-[10px] md:text-xs px-1.5 sm:px-3 py-0.5 sm:py-1"
          onClick={nextTrack}
          title="Lagu Selanjutnya"
        >
          <span className="icon text-[10px] sm:text-sm">⏭</span>
          <span className="hidden xs:inline text-[8px] sm:text-[10px]">
            Next
          </span>
        </button>

        <button
          className="media-btn text-[8px] sm:text-[10px] md:text-xs px-1.5 sm:px-3 py-0.5 sm:py-1"
          onClick={restartMedia}
        >
          <span className="icon text-[10px] sm:text-sm">⟳</span>
          <span className="hidden xs:inline text-[8px] sm:text-[10px]">
            Ulangi
          </span>
        </button>

        <button
          className="media-btn text-[8px] sm:text-[10px] md:text-xs px-1.5 sm:px-3 py-0.5 sm:py-1"
          onClick={randomizeNow}
        >
          <span className="icon text-[10px] sm:text-sm">✦</span>
          <span className="hidden xs:inline text-[8px] sm:text-[10px]">
            Acak
          </span>
        </button>

        <button
          className={`media-btn text-[8px] sm:text-[10px] md:text-xs px-1.5 sm:px-3 py-0.5 sm:py-1 ${isShuffling ? "border-purple-500 bg-purple-500/20" : ""}`}
          onClick={() => setIsShuffling(!isShuffling)}
          title="Shuffle"
        >
          <span className="icon text-[10px] sm:text-sm">🔀</span>
          <span className="hidden xs:inline text-[8px] sm:text-[10px]">
            Shuffle
          </span>
        </button>
      </div>

      {/* BPM Badge */}
      <div
        className={`absolute bottom-[40px] sm:bottom-[50px] md:bottom-[60px] left-1/2 -translate-x-1/2 z-[15] px-3 sm:px-5 py-1 sm:py-1.5 text-[8px] sm:text-xs rounded-full bg-[rgba(8,4,25,0.75)] backdrop-blur-xl border border-[rgba(180,130,255,0.15)] text-[#d4c8ff] tracking-[1px] sm:tracking-[2px] font-light shadow-[0_8px_40px_rgba(0,0,0,0.7)] transition-opacity duration-600 ${showBpm ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        ♫ BPM{" "}
        <span className="text-sm sm:text-xl text-[#c084fc] font-bold">
          {bpmDisplay}
        </span>
      </div>

      {/* Formula Box */}
      <div
        className={`absolute top-1 sm:top-2 md:top-3 left-1 sm:left-2 md:left-3 z-[12] text-[8px] sm:text-xs md:text-sm lg:text-base px-1.5 sm:px-3 py-0.5 sm:py-1 max-w-[65%] sm:max-w-[55%] rounded-xl bg-[rgba(0,0,0,0.5)] backdrop-blur-sm border-l-[2px] sm:border-l-[3px] border-purple-500 text-[#c8b8ff] font-light font-mono tracking-[0.5px] sm:tracking-[1px] transition-opacity duration-800 ${showFormula ? "opacity-100" : "opacity-0"}`}
        style={{ pointerEvents: "none" }}
      >
        {formulaText}
      </div>
    </div>
  );
}
