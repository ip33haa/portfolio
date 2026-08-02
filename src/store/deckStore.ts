import { create } from "zustand";
import type { GameAppId } from "../data/gamesCatalog";

/**
 * "currentApp" mirrors what's shown on the Steam Deck's screen —
 * exactly like switching apps on a real device.
 */
export type DeckApp = "boot" | "menu" | "about" | "games" | GameAppId;

export type DpadDirection = "up" | "down" | "left" | "right";

export type ButtonId =
  | "A"
  | "B"
  | "X"
  | "Y"
  | "L1"
  | "R1"
  | "L2"
  | "R2"
  | "Power"
  | "Menu"
  | "QuickAccess";

interface DeckState {
  poweredOn: boolean;
  currentApp: DeckApp;
  selectedIndex: number; // for menu navigation via joystick/dpad
  pressedButtons: Set<ButtonId>;
  joystickL: { x: number; y: number };
  joystickR: { x: number; y: number };
  trackpadLActive: boolean;
  trackpadRActive: boolean;
  pressedDpad: DpadDirection | null;
  lastDpad: DpadDirection | null;

  powerOn: () => void;
  powerOff: () => void;
  navigateTo: (app: DeckApp) => void;
  pressButton: (id: ButtonId) => void;
  releaseButton: (id: ButtonId) => void;
  setJoystick: (side: "L" | "R", x: number, y: number) => void;
  setTrackpadActive: (side: "L" | "R", active: boolean) => void;
  pressDpad: (direction: DpadDirection) => void;
  releaseDpad: () => void;
  moveSelection: (delta: number, max: number) => void;
  setSelectedIndex: (index: number) => void;
}

export const useDeckStore = create<DeckState>((set, get) => ({
  poweredOn: false,
  currentApp: "boot",
  selectedIndex: 0,
  pressedButtons: new Set(),
  joystickL: { x: 0, y: 0 },
  joystickR: { x: 0, y: 0 },
  trackpadLActive: false,
  trackpadRActive: false,
  pressedDpad: null,
  lastDpad: null,

  powerOn: () =>
    set({ poweredOn: true, currentApp: "boot" }),

  powerOff: () => set({ poweredOn: false, currentApp: "boot" }),

  navigateTo: (app) => set({ currentApp: app, selectedIndex: 0 }),

  pressButton: (id) => {
    const next = new Set(get().pressedButtons);
    next.add(id);
    set({ pressedButtons: next });

    const app = get().currentApp;

    // Menu / library screens handle A themselves (grid select).
    if (id === "A" && (app === "menu" || app === "games")) {
      return;
    }

    if (id === "B" && app !== "menu") {
      set({ currentApp: "menu" });
    }
    if (id === "Power") {
      get().poweredOn ? get().powerOff() : get().powerOn();
    }
  },

  releaseButton: (id) => {
    const next = new Set(get().pressedButtons);
    next.delete(id);
    set({ pressedButtons: next });
  },

  setJoystick: (side, x, y) =>
    set(side === "L" ? { joystickL: { x, y } } : { joystickR: { x, y } }),

  setTrackpadActive: (side, active) =>
    set(side === "L" ? { trackpadLActive: active } : { trackpadRActive: active }),

  pressDpad: (direction) => {
    set({ pressedDpad: direction, lastDpad: direction });
    const app = get().currentApp;
    if (app === "menu" || app === "games") return;
  },

  releaseDpad: () => set({ pressedDpad: null }),

  moveSelection: (delta, max) => {
    const cur = get().selectedIndex;
    let next = cur + delta;
    if (next < 0) next = max - 1;
    if (next >= max) next = 0;
    set({ selectedIndex: next });
  },

  setSelectedIndex: (index) => set({ selectedIndex: index }),
}));
