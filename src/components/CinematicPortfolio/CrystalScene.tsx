import { journey } from "../../data/journey";

type Props = {
  crystal?: number;
  glow: number;
};

export function CrystalScene({ crystal, glow }: Props) {
  const scene = journey.find((item) => item.crystal === crystal);
  if (!scene) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 mix-blend-screen"
      style={{
        opacity: 0.15 + glow * 0.45,
        background: `radial-gradient(circle at 50% 55%, ${scene.accent}, transparent 46%)`,
      }}
    />
  );
}
