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
      className={`relative z-[1] grid h-9 w-9 sm:h-8 sm:w-8 place-items-center rounded-full text-[10px] tracking-widest transition duration-200 ${
        activeCrystal === scene.crystal ? "text-white scale-110" : "text-white/40 hover:text-white/80 active:scale-95"
      }`}
    >
      <span
        className={`rounded-full transition-all duration-300 ${
          activeCrystal === scene.crystal ? "h-2.5 w-2.5" : "h-2 w-2"
        }`}
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
        className="fixed bottom-3 sm:bottom-4 left-1/2 z-40 flex -translate-x-1/2 gap-1 sm:gap-1.5 rounded-full border border-white/10 bg-black/55 px-2.5 sm:px-3 py-1 sm:py-1.5 backdrop-blur-md shadow-lg shadow-black/50"
      >
        {items}
      </nav>
    );
  }

  return (
    <nav
      aria-label="Crystal chapters"
      className="fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 flex-col items-center gap-2 md:flex lg:right-7"
    >
      <span aria-hidden className="absolute inset-y-3 w-px bg-white/15" />
      {items}
    </nav>
  );
}
