import { useEffect, useRef } from "react";
import type { CameraState } from "../../data/camera";
import { SEQUENCE_COUNT } from "../../data/assets";
import { sequenceLoader } from "../../data/sequenceLoader";

type Props = {
  camera: CameraState;
  reduced: boolean;
  parallax?: { x: number; y: number };
};

export function CameraScene({ camera, reduced, parallax = { x: 0, y: 0 } }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef({ w: 0, h: 0 });
  const staticImgRef = useRef<HTMLImageElement | null>(null);

  // Extract sequence frame index if camera is sequenced
  const frameMatch = camera.plate.match(/frame_(\d{4})\./);
  const frameIndex = frameMatch
    ? Math.min(SEQUENCE_COUNT - 1, Math.max(0, parseInt(frameMatch[1], 10) - 1))
    : null;

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

      ctx.save();
      const scale = camera.sequenced || reduced ? 1 : camera.scale;
      const rotate = camera.sequenced || reduced ? 0 : camera.rotate;
      const x = camera.sequenced || reduced ? 0 : camera.x;
      const y = camera.sequenced || reduced ? 0 : camera.y;

      if (scale !== 1 || rotate !== 0 || x !== 0 || y !== 0) {
        const ox = w * camera.origin.x;
        const oy = h * camera.origin.y;
        ctx.translate(ox + (w * x) / 100, oy + (h * y) / 100);
        ctx.rotate((rotate * Math.PI) / 180);
        ctx.scale(scale, scale);
        ctx.translate(-ox, -oy);
      }

      ctx.drawImage(img, cx, cy, nw, nh);
      ctx.restore();
    };

    if (camera.sequenced && frameIndex !== null) {
      const img = sequenceLoader.getFrame(frameIndex);
      if (img && img.complete && img.naturalWidth > 0) {
        draw(img);
      } else {
        // Fallback: load and draw as soon as ready
        sequenceLoader.preload(frameIndex);
        const temp = new Image();
        temp.onload = () => draw(temp);
        temp.src = camera.plate;
      }
    } else {
      // Static plates (overhead, final wide)
      if (!staticImgRef.current || staticImgRef.current.src !== camera.plate) {
        const img = new Image();
        img.onload = () => draw(img);
        img.src = camera.plate;
        staticImgRef.current = img;
        if (img.complete && img.naturalWidth > 0) {
          draw(img);
        }
      } else {
        draw(staticImgRef.current);
      }
    }
  }, [camera, frameIndex, reduced]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <canvas
        ref={canvasRef}
        className="h-full w-full origin-center object-cover will-change-transform"
        style={{
          filter: camera.blur > 0.05 && !reduced ? `blur(${camera.blur}px)` : "none",
          transform: reduced
            ? undefined
            : `translate3d(${parallax.x * 22}px, ${parallax.y * 14}px, 0) scale(1.1)`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-black/15" />
      <div
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{
          opacity: camera.flash,
          background:
            "radial-gradient(circle at 70% 50%, rgba(255,176,222,0.85), rgba(255,255,255,0.92) 42%, transparent 70%)",
        }}
      />
    </div>
  );
}
