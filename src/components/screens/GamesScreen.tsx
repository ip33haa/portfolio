import { useEffect } from "react";
import { useDeckStore } from "../../store/deckStore";
import { GAMES_CATALOG, GameEntry } from "../../data/gamesCatalog";
import { useDeckGridNav } from "../../hooks/useDeckGridNav";

const GRID_COLUMNS = 3;

function GameCapsule({
  game,
  selected,
  onSelect,
  onPlay,
}: {
  game: GameEntry;
  selected: boolean;
  onSelect: () => void;
  onPlay: () => void;
}) {
  return (
    <button
      type="button"
      data-testid={`game-tile-${game.id}`}
      onMouseEnter={onSelect}
      onFocus={onSelect}
      onClick={onPlay}
      className={`group text-left rounded overflow-hidden transition-all duration-200 outline-none ${
        selected
          ? "ring-2 ring-[#66c0f4] shadow-[0_0_24px_rgba(102,192,244,0.35)] scale-[1.02]"
          : "ring-1 ring-[#2a475e] hover:ring-[#66c0f4]/60 hover:scale-[1.01]"
      }`}
    >
      <div
        className={`relative aspect-[460/215] bg-gradient-to-br ${game.gradient} overflow-hidden`}
      >
        <img
          src={game.posterImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-top"
          loading="lazy"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-transparent mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-lg font-bold text-white drop-shadow-md leading-tight">{game.title}</p>
          <p className="text-[11px] text-white/70 mt-0.5">{game.tagline}</p>
        </div>
        {game.type === "native" && (
          <span className="absolute top-2 right-2 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#66c0f4] text-[#171a21] font-bold">
            Deck
          </span>
        )}
      </div>
      <div className="px-2 py-1.5 bg-[#16202d] flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1">
          {game.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[9px] px-1.5 py-0.5 rounded bg-[#2a475e] text-[#acb2b8]"
            >
              {tag}
            </span>
          ))}
        </div>
        {game.hoursPlayed && (
          <span className="text-[10px] text-[#8f98a0] shrink-0">{game.hoursPlayed} hrs</span>
        )}
      </div>
    </button>
  );
}

export function GamesScreen() {
  const navigateTo = useDeckStore((s) => s.navigateTo);
  const selectedIndex = useDeckStore((s) => s.selectedIndex);
  const setSelectedIndex = useDeckStore((s) => s.setSelectedIndex);
  const pressedButtons = useDeckStore((s) => s.pressedButtons);
  const selected = GAMES_CATALOG[selectedIndex] ?? GAMES_CATALOG[0];

  useDeckGridNav(GAMES_CATALOG.length, GRID_COLUMNS, selectedIndex, setSelectedIndex);

  useEffect(() => {
    if (pressedButtons.has("A") && selected) {
      navigateTo(selected.id);
    }
  }, [pressedButtons, selected, navigateTo]);

  return (
    <div className="w-full h-full flex flex-col bg-[#1b2838] text-[#c7d5e0]">
      {/* Steam-style top bar */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-[#171a21] border-b border-[#0e1419] shrink-0">
        <button
          type="button"
          onClick={() => navigateTo("menu")}
          className="text-xs px-3 py-1.5 rounded bg-[#2a475e] hover:bg-[#66c0f4] hover:text-[#171a21] transition-colors"
        >
          ← Menu
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[#66c0f4] font-bold tracking-wide text-sm">LIBRARY</span>
          <span className="text-[#8f98a0] text-xs">|</span>
          <span className="text-xs text-[#8f98a0]">{GAMES_CATALOG.length} games</span>
        </div>
        <div className="ml-auto flex gap-1">
          <span className="w-7 h-7 rounded bg-[#2a475e] flex items-center justify-center text-xs">▦</span>
          <span className="w-7 h-7 rounded bg-[#1b2838] flex items-center justify-center text-xs text-[#8f98a0]">
            ☰
          </span>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="w-44 shrink-0 bg-[#171a21] border-r border-[#0e1419] p-3 flex flex-col gap-1">
          <p className="text-[10px] uppercase tracking-widest text-[#8f98a0] px-2 mb-1">Collections</p>
          {["All Games", "Free to Play", "Deck Native", "Puzzle", "Arcade"].map((label, i) => (
            <button
              key={label}
              type="button"
              className={`text-left text-xs px-2 py-1.5 rounded transition-colors ${
                i === 0
                  ? "bg-[#2a475e] text-white"
                  : "text-[#acb2b8] hover:bg-[#2a475e]/50 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </aside>

        {/* Main library */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {/* Hero banner — selected game */}
          {selected && (
            <div
              className={`relative h-36 shrink-0 bg-gradient-to-r ${selected.gradient} overflow-hidden`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(255,255,255,0.12),transparent_50%)]" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
              <div className="relative h-full flex flex-col justify-end p-5">
                <p className="text-[10px] uppercase tracking-widest text-[#66c0f4] mb-1">
                  {selected.tags.join(" · ")}
                </p>
                <h2 className="text-3xl font-bold text-white drop-shadow-lg">{selected.title}</h2>
                <p className="text-sm text-white/75 mt-1 max-w-md">{selected.tagline}</p>
                <button
                  type="button"
                  onClick={() => navigateTo(selected.id)}
                  className="mt-3 self-start px-6 py-2 rounded-sm bg-[#75b022] hover:bg-[#8cd926] text-[#171a21] text-sm font-bold uppercase tracking-wide transition-colors shadow-lg"
                >
                  Play
                </button>
              </div>
            </div>
          )}

          {/* Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <p className="text-xs text-[#8f98a0] mb-1 uppercase tracking-wide">All games</p>
            <p className="text-[10px] text-[#66c0f4]/80 mb-3">
              Left stick: up/down · Right stick: left/right · D-pad · A to play
            </p>
            <div className="grid grid-cols-3 gap-3">
              {GAMES_CATALOG.map((game, index) => (
                <GameCapsule
                  key={game.id}
                  game={game}
                  selected={index === selectedIndex}
                  onSelect={() => setSelectedIndex(index)}
                  onPlay={() => navigateTo(game.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
