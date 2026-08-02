import { useEffect, useState } from "react";
import * as THREE from "three";

interface LoadState {
  active: boolean;
  progress: number;
}

/** Tracks three.js DefaultLoadingManager — same source drei Loader uses. */
function useAssetLoadState(): LoadState {
  const [state, setState] = useState<LoadState>({ active: false, progress: 0 });

  useEffect(() => {
    const mgr = THREE.DefaultLoadingManager;

    mgr.onStart = () => setState({ active: true, progress: 0 });

    mgr.onProgress = (_url, loaded, total) => {
      const progress = total > 0 ? (loaded / total) * 100 : 0;
      setState({ active: true, progress });
    };

    mgr.onLoad = () => setState({ active: false, progress: 100 });

    mgr.onError = () => setState((s) => ({ ...s, active: false }));

    return () => {
      mgr.onStart = () => {};
      mgr.onProgress = () => {};
      mgr.onLoad = () => {};
      mgr.onError = () => {};
    };
  }, []);

  return state;
}

export function LoadingOverlay() {
  const { active, progress } = useAssetLoadState();

  if (!active) return null;

  const rounded = Math.min(100, Math.round(progress));

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-neutral-950/95 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-label={`Loading Steam Deck model, ${rounded} percent`}
      data-testid="loading-overlay"
    >
      <div className="flex flex-col items-center gap-6 px-8 max-w-sm w-full">
        <div className="text-center space-y-1">
          <p className="text-white text-lg font-semibold tracking-wide">Steam Deck Portfolio</p>
          <p className="text-neutral-400 text-sm">Loading 3D model &amp; textures…</p>
        </div>

        <div className="w-full space-y-2">
          <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-[width] duration-200 ease-out"
              style={{ width: `${rounded}%` }}
            />
          </div>
          <p className="text-center text-neutral-300 text-sm tabular-nums">{rounded}%</p>
        </div>

        <p className="text-neutral-500 text-xs text-center leading-relaxed">
          First visit downloads ~100 MB of textures.
          <br />
          Subsequent loads are much faster.
        </p>
      </div>
    </div>
  );
}
