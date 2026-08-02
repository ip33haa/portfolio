import type { DeckApp } from "../store/deckStore";
import { posterPath } from "./posterPaths";

export type GameAppId =
  | "game-snake"
  | "game-2048"
  | "game-hextris"
  | "game-minesweeper"
  | "game-pacman"
  | "game-tetris";

export type GameEntry = {
  id: GameAppId;
  title: string;
  tagline: string;
  type: "native" | "embed";
  embedUrl?: string;
  /** Tailwind gradient stops for capsule art */
  gradient: string;
  /** Vertical library poster (placeholder SVG in /public/posters/) */
  posterImage: string;
  tags: string[];
  hoursPlayed?: string;
};

export const GAMES_CATALOG: GameEntry[] = [
  {
    id: "game-snake",
    title: "Deck Snake",
    tagline: "Both sticks or D-pad to steer",
    type: "native",
    gradient: "from-sky-950 via-blue-800 to-cyan-500",
    posterImage: posterPath("game-snake"),
    tags: ["Arcade", "Deck Native"],
    hoursPlayed: "∞",
  },
  {
    id: "game-2048",
    title: "2048",
    tagline: "Merge tiles to reach 2048",
    type: "embed",
    embedUrl: "https://www.crazygames.com/embed/2048",
    gradient: "from-amber-950 via-orange-800 to-yellow-500",
    posterImage: posterPath("game-2048"),
    tags: ["Puzzle", "Free"],
  },
  {
    id: "game-hextris",
    title: "Hextris",
    tagline: "Spinning hex puzzle action",
    type: "embed",
    embedUrl: "https://hextris.github.io/hextris/",
    gradient: "from-fuchsia-950 via-purple-800 to-pink-500",
    posterImage: posterPath("game-hextris"),
    tags: ["Puzzle", "Free"],
  },
  {
    id: "game-minesweeper",
    title: "Minesweeper",
    tagline: "Classic grid deduction",
    type: "embed",
    embedUrl: "https://www.crazygames.com/embed/minesweeper",
    gradient: "from-emerald-950 via-green-800 to-lime-500",
    posterImage: posterPath("game-minesweeper"),
    tags: ["Strategy", "Free"],
  },
  {
    id: "game-pacman",
    title: "Pac-Man",
    tagline: "Eat dots, dodge ghosts",
    type: "embed",
    embedUrl: "https://www.crazygames.com/embed/pacman",
    gradient: "from-yellow-950 via-amber-700 to-yellow-400",
    posterImage: posterPath("game-pacman"),
    tags: ["Arcade", "Free"],
  },
  {
    id: "game-tetris",
    title: "Tetris",
    tagline: "Stack blocks, clear lines",
    type: "embed",
    embedUrl: "https://www.crazygames.com/embed/tetris",
    gradient: "from-indigo-950 via-violet-800 to-blue-500",
    posterImage: posterPath("game-tetris"),
    tags: ["Puzzle", "Free"],
  },
];

export function isGameApp(app: DeckApp): app is GameAppId {
  return app.startsWith("game-");
}

export function getGameById(id: GameAppId): GameEntry | undefined {
  return GAMES_CATALOG.find((g) => g.id === id);
}
