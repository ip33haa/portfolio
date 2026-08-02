import { useDeckStore } from "../store/deckStore";
import { useJoystickAxisNav } from "./joystickNav";

/** Left stick vertical tilt → move menu selection (with hold-to-repeat). */
export function useLeftJoystickNav(maxItems: number, enabled = true) {
  const joystickL = useDeckStore((s) => s.joystickL);
  const moveSelection = useDeckStore((s) => s.moveSelection);

  useJoystickAxisNav(
    enabled ? joystickL.y : 0,
    (sign) => moveSelection(sign, maxItems),
    enabled && maxItems > 0
  );
}
