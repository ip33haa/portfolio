import { useDeckStore } from "../../store/deckStore";
import { JzlPortfolioEmbed } from "./JzlPortfolioEmbed";

export function AboutScreen() {
  const navigateTo = useDeckStore((s) => s.navigateTo);

  return (
    <div className="w-full h-full relative bg-black">
      <button
        type="button"
        onClick={() => navigateTo("menu")}
        className="absolute top-3 left-3 z-20 text-sm px-3 py-1.5 rounded bg-black/70 border border-neutral-700 hover:bg-neutral-800 backdrop-blur-sm"
      >
        ← B: Menu
      </button>
      <JzlPortfolioEmbed scrollEnabled />
    </div>
  );
}
