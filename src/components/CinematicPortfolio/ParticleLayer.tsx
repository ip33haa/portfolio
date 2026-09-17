import { useEffect, useRef } from "react";

type Props = {
  color: string;
  density: number;
  enabled: boolean;
};

type Particle = {
  x: number;
  y: number;
  r: number;
  s: number;
  drift: number;
  a: number;
  twinkle: number;
  twinkleSpeed: number;
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

    const spawn = (): Particle => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.4 + 0.9,
      s: Math.random() * 0.00035 + 0.00012,
      drift: (Math.random() - 0.5) * 0.00018,
      a: Math.random() * 0.28 + 0.22,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.02 + 0.008,
    });

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
        p.y -= p.s;
        p.x += p.drift + Math.sin(p.twinkle) * 0.00006;
        p.twinkle += p.twinkleSpeed;
        if (p.y < -0.02) {
          p.y = 1.02;
          p.x = Math.random();
        }
        if (p.x < -0.02) p.x = 1.02;
        if (p.x > 1.02) p.x = -0.02;

        const pulse = 0.7 + 0.3 * Math.sin(p.twinkle);
        ctx.globalAlpha = p.a * pulse;
        ctx.fillStyle = colorRef.current;
        ctx.beginPath();
        ctx.arc(p.x * width, p.y * height, p.r, 0, Math.PI * 2);
        ctx.fill();
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
