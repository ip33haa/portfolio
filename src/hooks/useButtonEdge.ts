import { useEffect, useRef } from "react";
import type { ButtonId } from "../store/deckStore";
import { useDeckStore } from "../store/deckStore";

/** Fires once when a deck button transitions from up → down. */
export function useButtonEdge(button: ButtonId, onPress: () => void, enabled = true) {
  const pressedButtons = useDeckStore((s) => s.pressedButtons);
  const wasDown = useRef(false);
  const onPressRef = useRef(onPress);
  onPressRef.current = onPress;

  useEffect(() => {
    if (!enabled) {
      wasDown.current = false;
      return;
    }
    const down = pressedButtons.has(button);
    if (down && !wasDown.current) onPressRef.current();
    wasDown.current = down;
  }, [pressedButtons, button, enabled]);
}
