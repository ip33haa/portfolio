type Props = {
  glow?: number;
};

export function HallAtmosphere({ glow = 0.45 }: Props) {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[16]"
        style={{
          background: `radial-gradient(ellipse 62% 58% at 50% 42%, transparent 0%, rgba(0,0,0,${0.18 + glow * 0.12}) 58%, rgba(0,0,0,0.78) 100%)`,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[16] bg-gradient-to-b from-black/35 via-transparent to-black/55"
      />
      <div className="pointer-events-none absolute inset-0 z-[17] overflow-hidden">
        <div aria-hidden className="hall-grain" />
      </div>
    </>
  );
}
