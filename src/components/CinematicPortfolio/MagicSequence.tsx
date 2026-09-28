import { useEffect, useRef } from "react";
import { contact } from "../../data/contact";
import { MAGIC_COUNT, MAGIC_CV_FROM, magicFrame } from "../../data/assets";
import { useScrollProgress } from "../../hooks/useScrollProgress";

export function MagicSequence() {
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef({ w: 0, h: 0 });
  const cacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const lastDrawnRef = useRef<number>(0);

  const { progress } = useScrollProgress(trackRef);
  const index = Math.min(MAGIC_COUNT - 1, Math.max(0, Math.round(progress * (MAGIC_COUNT - 1))));
  const showCv = index >= MAGIC_CV_FROM;

  // Handle canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      const w = parent?.clientWidth || window.innerWidth;
      const h = parent?.clientHeight || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      sizeRef.current = { w, h };
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement || canvas);

    return () => ro.disconnect();
  }, []);

  // Preload sliding window around current index
  useEffect(() => {
    const cache = cacheRef.current;
    const start = Math.max(0, index - 4);
    const end = Math.min(MAGIC_COUNT - 1, index + 16);
    for (let i = start; i <= end; i++) {
      if (!cache.has(i)) {
        const img = new Image();
        img.src = magicFrame(i);
        if (typeof img.decode === "function") {
          img
            .decode()
            .then(() => cache.set(i, img))
            .catch(() => {
              img.onload = () => cache.set(i, img);
            });
        } else {
          img.onload = () => cache.set(i, img);
        }
      }
    }
  }, [index]);

  // Draw frame on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const { w, h } = sizeRef.current;
    if (w === 0 || h === 0) return;

    const draw = (img: HTMLImageElement) => {
      if (!img || !img.complete || img.naturalWidth === 0) return;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const r = Math.max(w / iw, h / ih);
      const nw = iw * r;
      const nh = ih * r;
      const cx = (w - nw) * 0.5;
      const cy = (h - nh) * 0.5;
      ctx.drawImage(img, cx, cy, nw, nh);
    };

    const cache = cacheRef.current;
    const currentImg = cache.get(index);
    if (currentImg && currentImg.complete && currentImg.naturalWidth > 0) {
      lastDrawnRef.current = index;
      draw(currentImg);
    } else if (cache.has(lastDrawnRef.current)) {
      draw(cache.get(lastDrawnRef.current)!);
    } else {
      // Direct load fallback
      const temp = new Image();
      temp.onload = () => {
        cache.set(index, temp);
        lastDrawnRef.current = index;
        draw(temp);
      };
      temp.src = magicFrame(index);
    }
  }, [index]);

  return (
    <section
      ref={trackRef}
      id="cv-chest"
      data-testid="magic-sequence"
      className="relative"
      style={{ height: "480vh" }}
    >
      <div className="sticky top-0 h-dvh overflow-hidden bg-black">
        <canvas
          ref={canvasRef}
          className="h-full w-full object-cover will-change-transform"
        />
        {showCv ? (
          <a
            href={contact.cv}
            target="_blank"
            rel="noreferrer"
            data-testid="cv-paper"
            className="absolute left-[31.8%] top-[0%] z-10 block h-[100%] w-[40%] overflow-hidden bg-white"
            aria-label="Open CV"
          >
            <img
              src={contact.cvPreview}
              alt="John Philip Garcia CV"
              className="h-full w-full object-cover"
            />
          </a>
        ) : null}
      </div>
    </section>
  );
}
