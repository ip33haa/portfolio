import { useEffect } from "react";
import { DpadDirection, useDeckStore } from "../store/deckStore";
import { readEitherStickDirection } from "./deckDirection";

/**
 * Fires when the player pushes the D-pad or either stick into a new direction.
 * Useful for native games that change heading on discrete input (e.g. Snake).
 */
export function useDeckJoystickDirection(
  onDirection: (direction: DpadDirection) => void,
  enabled = true
) {
  const joystickL = useDeckStore((s) => s.joystickL);
  const joystickR = useDeckStore((s) => s.joystickR);
  const lastDpad = useDeckStore((s) => s.lastDpad);

  useEffect(() => {
    if (!enabled || !lastDpad) return;
    onDirection(lastDpad);
  }, [lastDpad, enabled, onDirection]);

  useEffect(() => {
    if (!enabled) return;
    const dir = readEitherStickDirection(joystickL, joystickR);
    if (dir) onDirection(dir);
  }, [joystickL, joystickR, enabled, onDirection]);
}
