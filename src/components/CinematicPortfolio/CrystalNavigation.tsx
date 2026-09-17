import { crystalNav } from "../../data/journey";

type Props = {
  activeCrystal?: number;
  onSelect: (crystal: number) => void;
  mobile?: boolean;
};

export function CrystalNavigation({ activeCrystal, onSelect, mobile = false }: Props) {
  const items = crystalNav.map((scene) => (
    <button
      key={scene.id}
      type="button"
      aria-label={`${scene.title}`}
      aria-current={activeCrystal === scene.crystal ? "true" : undefined}
      onClick={() => scene.crystal && onSelect(scene.crystal)}
      className={`grid h-8 w-8 place-items-center rounded-full text-[10px] tracking-widest ${
        activeCrystal === scene.crystal ? "text-white" : "text-white/40 hover:text-white/80"
      }`}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{
          background: activeCrystal === scene.crystal ? scene.accent : "rgba(255,255,255,0.28)",
          boxShadow: activeCrystal === scene.crystal ? `0 0 12px ${scene.accent}` : "none",
        }}
      />
      <span className="sr-only">{scene.number}</span>
    </button>
  ));

  if (mobile) {
    return (
      <nav
        aria-label="Crystal chapters"
        className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 gap-1 rounded-full border border-white/10 bg-black/40 px-3 py-1 backdrop-blur-md"
      >
        {items}
      </nav>
    );
  }

  return (
    <nav
      aria-label="Crystal chapters"
      className="fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 flex-col gap-1 md:flex"
    >
      {items}
    </nav>
  );
}
