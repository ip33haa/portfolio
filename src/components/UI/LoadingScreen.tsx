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

  useEffect(() => {
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center overflow-hidden overscroll-none bg-black p-4 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,rgba(0,0,0,0.55)_100%)]" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div aria-hidden className="hall-grain" />
      </div>
      <div className="relative z-10 flex max-h-full w-full max-w-sm flex-col items-center overflow-hidden px-4 py-6 text-center sm:max-w-md">
        <MagicCircle progress={progress} ready={ready} />

        <div className="mt-8 sm:mt-10">
          {ready ? (
            <button
              ref={enterRef}
              type="button"
              onClick={onEnter}
              className="rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-[10px] font-semibold tracking-[0.22em] text-white transition hover:border-white/40 hover:bg-white/10 active:scale-[0.98] sm:px-8 sm:py-3 sm:text-[11px] sm:tracking-[0.28em]"
            >
              ENTER THE JOURNEY
            </button>
          ) : (
            <div>
              <p className="font-light tabular-nums text-xl tracking-[0.24em] text-white/80 sm:text-2xl sm:tracking-[0.28em]" aria-live="polite">
                {pct}%
              </p>
              <p className="mt-2.5 text-[9px] tracking-[0.28em] text-white/40 sm:mt-3 sm:text-[10px] sm:tracking-[0.32em]">DRAWING THE CIRCLE</p>
            </div>
          )}
        </div>

        {ready ? (
          <p className="mt-6 text-[10px] tracking-[0.42em] text-white/45">THE HALL IS OPEN</p>
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
