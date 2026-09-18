import { useEffect, useState } from "react";
import type { CameraState } from "../../data/camera";

type Props = {
  camera: CameraState;
  reduced: boolean;
};

export function CameraScene({ camera, reduced }: Props) {
  const [shown, setShown] = useState(camera.plate);
  const scale = camera.sequenced || reduced ? 1 : camera.scale;
  const blur = camera.sequenced || reduced ? 0 : camera.blur;

  useEffect(() => {
    if (shown === camera.plate) return;
    const img = new Image();
    img.onload = () => setShown(camera.plate);
    img.src = camera.plate;
  }, [camera.plate, shown]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <img
        src={shown}
        alt="Interior of a bronze dome with a flowering tree and six glowing crystals"
        className="h-full w-full object-cover will-change-transform"
        style={{
          transformOrigin: `${camera.origin.x * 100}% ${camera.origin.y * 100}%`,
          transform: camera.sequenced
            ? "none"
            : `translate3d(${camera.x}%, ${camera.y}%, 0) scale(${scale}) rotate(${camera.rotate}deg)`,
          filter: blur > 0.05 ? `blur(${blur}px)` : "none",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-black/45" />
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          opacity: camera.flash,
          background:
            "radial-gradient(circle at 70% 50%, rgba(255,176,222,0.85), rgba(255,255,255,0.92) 42%, transparent 70%)",
        }}
      />
    </div>
  );
}
