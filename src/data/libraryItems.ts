import type { DeckApp } from "../store/deckStore";
import { GAMES_CATALOG } from "./gamesCatalog";
import { posterPath } from "./posterPaths";

export type LibraryItem = {
  id: string;
  title: string;
  app: DeckApp;
  gradient: string;
  posterImage: string;
  deckVerified?: boolean;
  category: "about" | "game";
  native?: boolean;
};

export const LIBRARY_ABOUT: LibraryItem = {
  id: "about",
  title: "About Me",
  app: "about",
  gradient: "from-slate-950 via-indigo-950 to-violet-700",
  posterImage: posterPath("about"),
  deckVerified: true,
  category: "about",
};

export const LIBRARY_ITEMS: LibraryItem[] = [
  LIBRARY_ABOUT,
  ...GAMES_CATALOG.map((game) => ({
    id: game.id,
    title: game.title,
    app: game.id as DeckApp,
    gradient: game.gradient,
    posterImage: game.posterImage,
    deckVerified: game.type === "native",
    category: "game" as const,
    native: game.type === "native",
  })),
];

export type LibraryTabId = "all" | "about" | "games" | "deck" | "installed";

export type LibraryTab = {
  id: LibraryTabId;
  label: string;
  filter: (item: LibraryItem) => boolean;
};

export const LIBRARY_TABS: LibraryTab[] = [
  { id: "all", label: "ALL APPS", filter: () => true },
  { id: "about", label: "ABOUT", filter: (i) => i.category === "about" },
  { id: "games", label: "ALL GAMES", filter: (i) => i.category === "game" },
  {
    id: "deck",
    label: "GREAT ON DECK",
    filter: (i) => i.deckVerified === true,
  },
  {
    id: "installed",
    label: "INSTALLED",
    filter: (i) => i.native === true,
  },
];

export function itemsForTab(tabId: LibraryTabId): LibraryItem[] {
  const tab = LIBRARY_TABS.find((t) => t.id === tabId) ?? LIBRARY_TABS[0];
  return LIBRARY_ITEMS.filter(tab.filter);
}
