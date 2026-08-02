import { useEffect, useRef } from "react";
import { DpadDirection, useDeckStore } from "../store/deckStore";
import { readEitherStickDirection } from "./deckDirection";

const ARROW_KEYS: Record<DpadDirection, string> = {
  up: "ArrowUp",
  down: "ArrowDown",
  left: "ArrowLeft",
  right: "ArrowRight",
};

function dispatchKey(win: Window, type: "keydown" | "keyup", key: string): boolean {
  try {
    win.dispatchEvent(
      new KeyboardEvent(type, {
        key,
        code: key,
        bubbles: true,
        cancelable: true,
      })
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * Maps D-pad and both sticks to arrow keys for same-origin embedded games only.
 * Cross-origin iframes (CrazyGames, etc.) cannot receive synthetic keys — pass null.
 */
export function useDeckKeyboardBridge(targetWindow: Window | null | undefined, enabled = true) {
  const joystickL = useDeckStore((s) => s.joystickL);
  const joystickR = useDeckStore((s) => s.joystickR);
  const pressedDpad = useDeckStore((s) => s.pressedDpad);
  const activeKey = useRef<string | null>(null);
  const blocked = useRef(false);

  useEffect(() => {
    return () => {
      if (activeKey.current && targetWindow && !blocked.current) {
        dispatchKey(targetWindow, "keyup", activeKey.current);
      }
      activeKey.current = null;
    };
  }, [targetWindow]);

  useEffect(() => {
    blocked.current = false;

    const release = () => {
      if (!activeKey.current || !targetWindow || blocked.current) {
        activeKey.current = null;
        return;
      }
      if (!dispatchKey(targetWindow, "keyup", activeKey.current)) {
        blocked.current = true;
      }
      activeKey.current = null;
    };

    if (!enabled || !targetWindow) {
      release();
      return;
    }

    const stickDir = readEitherStickDirection(joystickL, joystickR);
    const dir: DpadDirection | null = pressedDpad ?? stickDir;

    if (!dir) {
      release();
      return;
    }

    const key = ARROW_KEYS[dir];
    if (activeKey.current === key) return;

    release();
    if (!dispatchKey(targetWindow, "keydown", key)) {
      blocked.current = true;
      return;
    }
    activeKey.current = key;
  }, [joystickL, joystickR, pressedDpad, targetWindow, enabled]);
}
