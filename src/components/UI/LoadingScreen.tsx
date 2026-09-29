import { useEffect, useRef } from "react";
import { MagicCircle } from "./MagicCircle";

type Props = {
  progress: number;
  ready: boolean;
  onEnter: () => void;
};

export function LoadingScreen({ progress, ready, onEnter }: Props) {
  const pct = Math.min(100, Math.round(progress * 100));
  const enterRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!ready) return;
    enterRef.current?.focus();
  }, [ready]);

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-black p-4 text-white">
      <div className="my-auto flex flex-col items-center max-w-sm sm:max-w-md w-full px-4 py-6 text-center">
        <MagicCircle progress={progress} ready={ready} />

        <div className="mt-8 sm:mt-10">
          {ready ? (
            <button
              ref={enterRef}
              type="button"
              onClick={onEnter}
              className="rounded-full border border-white/20 bg-white/5 px-6 sm:px-8 py-2.5 sm:py-3 text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] sm:tracking-[0.28em] text-white transition hover:border-white/40 hover:bg-white/10 active:scale-[0.98]"
            >
              ENTER THE JOURNEY
            </button>
          ) : (
            <div>
              <p className="font-light tabular-nums text-xl sm:text-2xl tracking-[0.24em] sm:tracking-[0.28em] text-white/80" aria-live="polite">
                {pct}%
              </p>
              <p className="mt-2.5 sm:mt-3 text-[9px] sm:text-[10px] tracking-[0.28em] sm:tracking-[0.32em] text-white/40">DRAWING THE CIRCLE</p>
            </div>
          )}
        </div>

        {ready ? (
          <p className="mt-6 text-[10px] tracking-[0.32em] text-white/45">THE CIRCLE IS OPEN</p>
        ) : (
          <div
            className="sr-only"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            {pct}%
          </div>
        )}
      </div>
    </div>
  );
}
