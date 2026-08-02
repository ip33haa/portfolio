import type { DeckApp } from "../store/deckStore";

export type MenuItem = { label: string; app: DeckApp; icon: string };

/** Main menu — About embeds JZL; games library is deck-native. */
export const MENU_ITEMS: MenuItem[] = [
  { label: "About Me", app: "about", icon: "👤" },
  { label: "Games", app: "games", icon: "🎮" },
];
