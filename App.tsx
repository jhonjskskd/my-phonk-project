import React, { useEffect, useMemo, useRef, useState } from "react"; import { motion } from "framer-motion"; import { Card, CardContent } from "@/components/ui/card"; import { Button } from "@/components/ui/button"; import { Input } from "@/components/ui/input"; import { Play, Pause, RotateCcw, Upload, Sparkles, Music2 } from "lucide-react";

/**

Premium Phonk Visualizer

Single-file React component for Vercel or any React host


Accepts local file upload (best for mobile)


Accepts audio URL (public URL only)


Uses Web Audio API + canvas FFT visualizer


Anime-inspired reactive character built with CSS/SVG-like shapes


Beat flashes, particles, glow, and multiple action poses


Important:

A deployed Vercel app cannot directly read /storage/emulated/0/... from your phone.


Use the file picker here, or upload the mp3 to a public URL. */ export default function PremiumPhonkVisualizer() { const audioRef = useRef<HTMLAudioElement | null>(null); const canvasRef = useRef<HTMLCanvasElement | null>(null); const frameRef = useRef<number | null>(null); const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; r: number; a: number; hue: number }>>([]); const analyserRef = useRef<AnalyserNode | null>(null); const sourceRef = useRef<MediaElementAudioSourceNode | null>(null); const audioCtxRef = useRef<AudioContext | null>(null); const dataArrayRef = useRef<Uint8Array | null>(null); const lastBeatRef = useRef<number>(0);


const [playing, setPlaying] = useState(false); const [trackLoaded, setTrackLoaded] = useState(false); const [fileName, setFileName] = useState<string>("No track loaded"); const [audioUrl, setAudioUrl] = useState<string>(""); const [bass, setBass] = useState(0); const [mid, setMid] = useState(0); const [treble, setTreble] = useState(0); const [energy, setEnergy] = useState(0); const [pose, setPose] = useState<"idle" | "jump" | "spin" | "strike">("idle"); const [flash, setFlash] = useState(0);

const defaultAudioSrc = useMemo( () => "", [] );

const ensureAudioGraph = async () => { const audioEl = audioRef.current; if (!audioEl) return;

if (!audioCtxRef.current) {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  audioCtxRef.current = new AudioContextClass();
}

const ctx = audioCtxRef.current;
if (ctx.state === "suspended") {
  await ctx.resume();
}

if (!analyserRef.current) {
  analyserRef.current = ctx.createAnalyser();
  analyserRef.current.fftSize = 2048;
  analyserRef.current.smoothingTimeConstant = 0.82;
}

if (!sourceRef.current) {
  try {
    sourceRef.current = ctx.createMediaElementSource(audioEl);
    sourceRef.current.connect(analyserRef.current);
    analyserRef.current.connect(ctx.destination);
  } catch {
    // MediaElementAudioSourceNode can only be created once per audio element.
  }
}

dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);

};

const spawnParticles = (count: number, hue: number) => { const canvas = canvasRef.current; if (!canvas) return; const particles = particlesRef.current; for (let i = 0; i < count; i++) { particles.push({ x: canvas.width * 0.5 + (Math.random() - 0.5) * canvas.width * 0.25, y: canvas.height * 0.5 + (Math.random() - 0.5) * canvas.height * 0.15, vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.8) * 4, r: 1.5 + Math.random() * 5, a: 0.6 + Math.random() * 0.4, hue: hue + Math.random() * 50, }); } if (particles.length > 240) particles.splice(0, particles.length - 240); };

const analyze = () => { const analyser = analyserRef.current; const canvas = canvasRef.current; const dataArray = dataArrayRef.current; if (!analyser || !canvas || !dataArray) return;

analyser.getByteFrequencyData(dataArray);

const third = Math.floor(dataArray.length / 3);
let low = 0;
let midSum = 0;
let high = 0;

for (let i = 0; i < third; i++) low += dataArray[i];
for (let i = third; i < third * 2; i++) midSum += dataArray[i];
for (let i = third * 2; i < dataArray.length; i++) high += dataArray[i];

low /= third;
midSum /= third;
high /= dataArray.length - third * 2;

const normalizedLow = low / 255;
const normalizedMid = midSum / 255;
const normalizedHigh = high / 255;
const totalEnergy = Math.min(1, (normalizedLow * 0.55 + normalizedMid * 0.3 + normalizedHigh * 0.15) * 1.65);

setBass(normalizedLow);
setMid(normalizedMid);
setTreble(normalizedHigh);
setEnergy(totalEnergy);

const now = performance.now();
const beatStrength = normalizedLow * 1.2 + normalizedMid * 0.7;
const beatTriggered = beatStrength > 0.42 && now - lastBeatRef.current > 150;

if (beatTriggered) {
  lastBeatRef.current = now;
  setFlash(1);
  spawnParticles(14 + Math.floor(beatStrength * 12), Math.floor(280 * beatStrength + 30));
  const roll = Math.random();
  setPose(roll < 0.28 ? "jump" : roll < 0.55 ? "spin" : roll < 0.82 ? "strike" : "idle");
} else {
  setFlash((v) => Math.max(0, v - 0.06));
  setPose((p) => (Math.random() < 0.01 ? p : p));
}

const ctx = canvas.getContext("2d");
if (!ctx) return;

const w = canvas.width;
const h = canvas.height;
const grad = ctx.createLinearGradient(0, 0, w, h);
const hue = Math.floor(250 + totalEnergy * 110 + bass * 40);
grad.addColorStop(0, `hsl(${hue}, 80%, ${10 + totalEnergy * 12}%)`);
grad.addColorStop(0.5, `hsl(${hue + 35}, 75%, ${8 + totalEnergy * 10}%)`);
grad.addColorStop(1, `hsl(${hue + 90}, 80%, ${5 + totalEnergy * 8}%)`);
ctx.fillStyle = grad;
ctx.fillRect(0, 0, w, h);

// glow clouds
ctx.save();
ctx.globalAlpha = 0.25 + totalEnergy * 0.22;
for (let i = 0; i < 4; i++) {
  const x = w * (0.18 + i * 0.23) + Math.sin(Date.now() * 0.0005 + i) * 40;
  const y = h * (0.22 + (i % 2) * 0.22) + Math.cos(Date.now() * 0.0007 + i) * 26;
  const r = 120 + totalEnergy * 140 + i * 15;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `hsla(${hue + i * 40}, 100%, 65%, 0.55)`);
  g.addColorStop(1, `hsla(${hue + i * 40}, 100%, 15%, 0)`);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}
ctx.restore();

// spectrum bars
const bars = 72;
const barWidth = w / bars;
for (let i = 0; i < bars; i++) {
  const idx = Math.floor((i / bars) * dataArray.length);
  const v = dataArray[idx] / 255;
  const barH = Math.max(10, v * h * (0.18 + totalEnergy * 0.55));
  const x = i * barWidth;
  const y = h - barH - 8;
  const barHue = (hue + i * 3 + v * 130) % 360;
  ctx.fillStyle = `hsla(${barHue}, 100%, ${55 + v * 20}%, ${0.16 + v * 0.65})`;
  ctx.fillRect(x + 1, y, barWidth - 2, barH);
}

// particles
const particles = particlesRef.current;
for (let i = particles.length - 1; i >= 0; i--) {
  const p = particles[i];
  p.x += p.vx;
  p.y += p.vy;
  p.vx *= 0.985;
  p.vy += 0.06;
  p.a *= 0.986;
  p.r *= 0.996;
  if (p.a < 0.03 || p.r < 0.7) {
    particles.splice(i, 1);
    continue;
  }
  ctx.beginPath();
  ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.a})`;
  ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
  ctx.fill();
}

// anime silhouette center
const centerX = w * 0.5;
const baseY = h * 0.72;
const sway = Math.sin(Date.now() * 0.003) * (5 + totalEnergy * 22);
const bounce = Math.sin(Date.now() * 0.008) * (2 + totalEnergy * 10) + (pose === "jump" ? -28 : 0);
const spin = pose === "spin" ? Math.sin(Date.now() * 0.015) * 0.4 : 0;
const strike = pose === "strike" ? Math.sin(Date.now() * 0.02) * 18 : 0;
const scale = 1 + totalEnergy * 0.12 + (pose === "jump" ? 0.04 : 0);

ctx.save();
ctx.translate(centerX + sway, baseY + bounce);
ctx.scale(scale, scale);
ctx.rotate(spin);

// shadow aura
ctx.save();
ctx.globalAlpha = 0.45 + totalEnergy * 0.2;
const aura = ctx.createRadialGradient(0, -80, 10, 0, -80, 160 + totalEnergy * 130);
aura.addColorStop(0, `hsla(${hue + 20}, 100%, 70%, 0.55)`);
aura.addColorStop(0.35, `hsla(${hue + 55}, 100%, 60%, 0.25)`);
aura.addColorStop(1, `hsla(${hue + 100}, 100%, 50%, 0)`);
ctx.fillStyle = aura;
ctx.beginPath();
ctx.arc(0, -74, 160 + totalEnergy * 130, 0, Math.PI * 2);
ctx.fill();
ctx.restore();

// body
const bodyGlow = ctx.createLinearGradient(-35, -120, 50, 40);
bodyGlow.addColorStop(0, `hsl(${hue + 20}, 90%, 85%)`);
bodyGlow.addColorStop(0.4, `hsl(${hue + 65}, 85%, 63%)`);
bodyGlow.addColorStop(1, `hsl(${hue + 130}, 80%, 35%)`);

// legs
ctx.lineCap = "round";
ctx.lineWidth = 20;
ctx.strokeStyle = bodyGlow;
ctx.beginPath();
ctx.moveTo(-14, 0);
ctx.lineTo(-34 - strike * 0.1, 62);
ctx.moveTo(14, 0);
ctx.lineTo(34 + strike * 0.07, 64);
ctx.stroke();

// torso
ctx.lineWidth = 36;
ctx.beginPath();
ctx.moveTo(0, -2);
ctx.lineTo(0, -72);
ctx.stroke();

// arms
ctx.lineWidth = 16;
ctx.beginPath();
if (pose === "strike") {
  ctx.moveTo(-12, -48);
  ctx.lineTo(-70, -18);
  ctx.moveTo(10, -46);
  ctx.lineTo(82, -74);
} else if (pose === "jump") {
  ctx.moveTo(-12, -48);
  ctx.lineTo(-44, -84);
  ctx.moveTo(10, -46);
  ctx.lineTo(40, -92);
} else if (pose === "spin") {
  ctx.moveTo(-12, -48);
  ctx.lineTo(-56, -16);
  ctx.moveTo(10, -46);
  ctx.lineTo(52, -16);
} else {
  ctx.moveTo(-12, -48);
  ctx.lineTo(-48, -30 - strike * 0.15);
  ctx.moveTo(10, -46);
  ctx.lineTo(44, -28 + strike * 0.08);
}
ctx.stroke();

// head glow
ctx.save();
ctx.globalAlpha = 1;
const headR = 42 + totalEnergy * 4;
const headGrad = ctx.createRadialGradient(-8, -118, 10, 0, -118, headR + 20);
headGrad.addColorStop(0, `hsl(${hue + 20}, 95%, 92%)`);
headGrad.addColorStop(0.35, `hsl(${hue + 50}, 80%, 72%)`);
headGrad.addColorStop(1, `hsl(${hue + 95}, 70%, 28%)`);
ctx.fillStyle = headGrad;
ctx.beginPath();
ctx.arc(0, -118, headR, 0, Math.PI * 2);
ctx.fill();

// anime hair spikes
ctx.strokeStyle = `hsla(${hue + 30}, 100%, 78%, 0.95)`;
ctx.lineWidth = 10;
ctx.beginPath();
for (let i = -3; i <= 3; i++) {
  const x = i * 12;
  ctx.moveTo(x, -152);
  ctx.lineTo(x + (i % 2 === 0 ? -8 : 8), -182 - Math.abs(i) * 4 - totalEnergy * 10);
}
ctx.stroke();

// eyes
ctx.fillStyle = "rgba(255,255,255,0.95)";
ctx.beginPath();
ctx.ellipse(-14, -124, 7, 10, 0, 0, Math.PI * 2);
ctx.ellipse(14, -124, 7, 10, 0, 0, Math.PI * 2);
ctx.fill();
ctx.fillStyle = `hsl(${hue + 165}, 100%, 65%)`;
ctx.beginPath();
ctx.arc(-14, -124, 3, 0, Math.PI * 2);
ctx.arc(14, -124, 3, 0, Math.PI * 2);
ctx.fill();

// mouth / expression
ctx.strokeStyle = `rgba(255,255,255,0.95)`;
ctx.lineWidth = 4;
ctx.beginPath();
if (pose === "strike") {
  ctx.moveTo(-8, -104);
  ctx.lineTo(10, -100);
} else if (pose === "jump") {
  ctx.arc(0, -104, 10, 0.1, Math.PI - 0.1);
} else if (pose === "spin") {
  ctx.moveTo(-9, -102);
  ctx.lineTo(8, -106);
} else {
  ctx.moveTo(-8, -104);
  ctx.lineTo(8, -104);
}
ctx.stroke();
ctx.restore();

ctx.restore();

// top vignette / flash overlay
ctx.save();
ctx.globalAlpha = 0.06 + flash * 0.22;
ctx.fillStyle = `hsl(${hue + 20}, 100%, 70%)`;
ctx.fillRect(0, 0, w, h);
ctx.restore();

// bottom light sweep
const sweep = (Date.now() * 0.12) % (w + 260) - 130;
const sweepGrad = ctx.createLinearGradient(sweep - 120, 0, sweep + 120, 0);
sweepGrad.addColorStop(0, "rgba(255,255,255,0)");
sweepGrad.addColorStop(0.5, `hsla(${hue + 40}, 100%, 88%, ${0.08 + totalEnergy * 0.08})`);
sweepGrad.addColorStop(1, "rgba(255,255,255,0)");
ctx.fillStyle = sweepGrad;
ctx.fillRect(0, h * 0.2, w, h * 0.8);

// loop
frameRef.current = requestAnimationFrame(analyze);

};

useEffect(() => { const canvas = canvasRef.current; if (!canvas) return;

const resize = () => {
  const ratio = Math.max(1, window.devicePixelRatio || 1);
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.floor(rect.width * ratio);
  canvas.height = Math.floor(rect.height * ratio);
  const ctx = canvas.getContext("2d");
  if (ctx) ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
};

resize();
window.addEventListener("resize", resize);

const loop = () => {
  if (!frameRef.current) frameRef.current = requestAnimationFrame(analyze);
};
loop();

return () => {
  window.removeEventListener("resize", resize);
  if (frameRef.current) cancelAnimationFrame(frameRef.current);
  frameRef.current = null;
};
// eslint-disable-next-line react-hooks/exhaustive-deps

}, []);

const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file) return; const url = URL.createObjectURL(file); setAudioUrl(url); setTrackLoaded(true); setFileName(file.name); setPlaying(false); setTimeout(() => { const audio = audioRef.current; if (audio) { audio.src = url; audio.load(); } }, 0); };

const onLoadUrl = () => { if (!audioUrl.trim()) return; setTrackLoaded(true); setFileName(audioUrl.trim()); const audio = audioRef.current; if (audio) { audio.src = audioUrl.trim(); audio.load(); } };

const togglePlay = async () => { const audio = audioRef.current; if (!audio) return; await ensureAudioGraph(); if (audio.paused) { await audio.play(); setPlaying(true); } else { audio.pause(); setPlaying(false); } };

const restart = async () => { const audio = audioRef.current; if (!audio) return; await ensureAudioGraph(); audio.currentTime = 0; await audio.play(); setPlaying(true); };

return ( <div className="min-h-screen w-full overflow-hidden bg-black text-white"> <audio ref={audioRef} src={defaultAudioSrc} crossOrigin="anonymous" preload="auto" loop onEnded={() => setPlaying(false)} />

<div className="absolute inset-0">
    <canvas ref={canvasRef} className="h-full w-full" />
  </div>

  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.07),transparent_34%),linear-gradient(to_bottom,rgba(0,0,0,0.06),rgba(0,0,0,0.66))]" />

  <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-between p-4 sm:p-6 lg:p-8">
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between gap-3"
    >
      <div>
        <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-white/70">
          <Sparkles className="h-4 w-4" />
          Premium Phonk Visualizer
        </div>
        <h1 className="text-2xl font-semibold sm:text-4xl">Anime Beat Reactor</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/70 sm:text-base">
          Upload a track or load a public URL. The visualizer will react with energy flashes,
          particle bursts, and a beat-synced anime pose engine.
        </p>
      </div>

      <div className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur md:flex">
        <Music2 className="h-4 w-4" />
        <span className="text-sm text-white/80">{playing ? "Live" : "Ready"}</span>
      </div>
    </motion.div>

    <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <Card className="border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl shadow-black/40">
          <CardContent className="space-y-4 p-4 sm:p-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="group flex cursor-pointer flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-white/20 hover:bg-black/30">
                <div className="flex items-center gap-2 text-sm font-medium text-white/80">
                  <Upload className="h-4 w-4" />
                  Upload MP3 / audio
                </div>
                <Input
                  type="file"
                  accept="audio/*"
                  onChange={onPickFile}
                  className="border-white/10 bg-white/10 text-white file:border-0 file:bg-white file:text-black file:font-medium"
                />
                <div className="text-xs text-white/50">Best on Redmi A3: pick the file locally here.</div>
              </label>

              <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm font-medium text-white/80">Public audio URL</div>
                <Input
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  placeholder="https://.../track.mp3"
                  className="border-white/10 bg-white/10 text-white placeholder:text-white/35"
                />
                <Button onClick={onLoadUrl} variant="secondary" className="rounded-xl">
                  Load URL
                </Button>
                <div className="text-xs text-white/50">Use a public link. A Vercel app cannot read your phone storage directly.</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={togglePlay} className="rounded-2xl px-5 py-6 text-base shadow-lg shadow-black/30">
                {playing ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                {playing ? "Pause" : "Play"}
              </Button>
              <Button onClick={restart} variant="secondary" className="rounded-2xl px-5 py-6 text-base">
                <RotateCcw className="mr-2 h-5 w-5" />
                Restart
              </Button>
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/75">
                Track: <span className="text-white">{fileName}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <Card className="border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl shadow-black/40">
          <CardContent className="space-y-4 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm uppercase tracking-[0.28em] text-white/55">Mood reactor</div>
              <div className="text-xs text-white/50">pose: {pose}</div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                ["Bass", bass],
                ["Mid", mid],
                ["Treble", treble],
              ].map(([label, value]) => (
                <div key={label as string} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                  <div className="text-xs text-white/50">{label}</div>
                  <div className="mt-2 text-2xl font-semibold">{Math.round((value as number) * 100)}</div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-white/65">
                <span>Energy</span>
                <span>{Math.round(energy * 100)}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full transition-[width] duration-75"
                  style={{
                    width: `${Math.max(6, energy * 100)}%`,
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0.45), rgba(255,255,255,0.92), rgba(255,255,255,0.45))",
                  }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
              For TikTok-style recording, keep this page full screen and record the screen while the track plays.
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card className="border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl shadow-black/40">
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-[0.28em] text-white/55">Visual style</div>
              <div className="mt-2 text-lg font-medium">Neon anime mood</div>
              <div className="mt-3 text-sm text-white/70">Reactive colors, aura, flashes, and particles.</div>
        
