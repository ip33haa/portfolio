type Props = {
  intensity: number;
};

export function TreeScene({ intensity }: Props) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        background: `radial-gradient(ellipse at 50% 42%, rgba(201,162,122,${0.08 + intensity * 0.12}) 0%, transparent 36%)`,
      }}
    />
  );
}
