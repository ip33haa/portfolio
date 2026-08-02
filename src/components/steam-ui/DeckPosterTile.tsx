import type { LibraryItem } from "../../data/libraryItems";

type DeckPosterTileProps = {
  item: LibraryItem;
  selected: boolean;
  onSelect: () => void;
  onActivate: () => void;
  tileRef?: (el: HTMLButtonElement | null) => void;
};

/** Vertical Steam Deck library poster tile. */
export function DeckPosterTile({
  item,
  selected,
  onSelect,
  onActivate,
  tileRef,
}: DeckPosterTileProps) {
  return (
    <button
      type="button"
      ref={tileRef}
      data-testid={`library-tile-${item.id}`}
      onMouseEnter={onSelect}
      onFocus={onSelect}
      onClick={onActivate}
      className={`relative aspect-[2/3] rounded-sm overflow-hidden outline-none transition-transform duration-150 ${
        selected ? "ring-[3px] ring-white scale-[1.02] z-10" : "ring-1 ring-black/40 hover:ring-white/30"
      }`}
    >
      <img
        src={item.posterImage}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
        draggable={false}
      />
      <div className={`absolute inset-0 bg-gradient-to-b ${item.gradient} mix-blend-multiply opacity-40`} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_15%,rgba(255,255,255,0.15),transparent_55%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-2.5">
        <p className="text-[13px] font-bold leading-tight text-white drop-shadow-md line-clamp-3">
          {item.title}
        </p>
      </div>

      {item.deckVerified && (
        <span
          className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-[#1a9fff] border border-white/30 flex items-center justify-center shadow-md"
          title="Great on Deck"
        >
          <svg viewBox="0 0 16 16" className="w-3 h-3 fill-white" aria-hidden>
            <path d="M6.5 11.5L3 8l1.2-1.2 2.3 2.3 5.3-5.3L13 5.8z" />
          </svg>
        </span>
      )}
    </button>
  );
}
