type Props = {
  progress: number;
};

export function ScrollProgress({ progress }: Props) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-0 left-0 z-40 h-px bg-white/75"
      style={{ width: `${Math.min(100, progress * 100)}%` }}
    />
  );
}
