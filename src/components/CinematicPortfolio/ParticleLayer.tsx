import { useEffect, useRef } from "react";

type Props = {
  color: string;
  density: number;
  enabled: boolean;
};

type Particle = {
  x: number;
  y: number;
  z: number;
  r: number;
  s: number;
  drift: number;
  a: number;
  twinkle: number;
  twinkleSpeed: number;
  glow: boolean;
};

export function ParticleLayer({ color, density, enabled }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorRef = useRef(color);
  colorRef.current = color;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !enabled) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let running = true;

    const spawn = (): Particle => {
      const glow = Math.random() > 0.82;
      return {
        x: Math.random(),
        y: Math.random(),
        z: Math.random(),
        r: glow ? Math.random() * 18 + 10 : Math.random() * 1.6 + 0.5,
        s: glow ? Math.random() * 0.00012 + 0.00004 : Math.random() * 0.00028 + 0.00008,
        drift: (Math.random() - 0.5) * (glow ? 0.00008 : 0.00016),
        a: glow ? Math.random() * 0.08 + 0.03 : Math.random() * 0.35 + 0.12,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.018 + 0.006,
        glow,
      };
    };

    const particles = Array.from({ length: density }, spawn);

    const resize = () => {
      const parent = canvas.parentElement;
      const cssW = parent?.clientWidth || window.innerWidth;
      const cssH = parent?.clientHeight || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(cssW * dpr));
      canvas.height = Math.max(1, Math.floor(cssH * dpr));
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const tick = () => {
      if (!running) return;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      for (const p of particles) {
        const depth = 0.35 + p.z * 0.9;
        p.y -= p.s * depth;
        p.x += p.drift + Math.sin(p.twinkle) * 0.00005;
        p.twinkle += p.twinkleSpeed;
        if (p.y < -0.08) {
          p.y = 1.08;
          p.x = Math.random();
        }
        if (p.x < -0.04) p.x = 1.04;
        if (p.x > 1.04) p.x = -0.04;

        const pulse = 0.65 + 0.35 * Math.sin(p.twinkle);
        ctx.globalAlpha = p.a * pulse;
        ctx.fillStyle = colorRef.current;
        const radius = p.r * depth;
        const px = p.x * width;
        const py = p.y * height;
        if (p.glow) {
          const g = ctx.createRadialGradient(px, py, 0, px, py, radius);
          g.addColorStop(0, colorRef.current);
          g.addColorStop(1, "transparent");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(px, py, radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(px, py, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [density, enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[18] h-full w-full mix-blend-screen"
    />
  );
}
