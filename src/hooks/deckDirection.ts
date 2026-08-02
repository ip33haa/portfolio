import { DpadDirection } from "../store/deckStore";

export const JOYSTICK_DEADZONE = 0.35;

export function readJoystickDirection(
  x: number,
  y: number,
  deadzone = JOYSTICK_DEADZONE
): DpadDirection | null {
  if (Math.abs(x) < deadzone && Math.abs(y) < deadzone) return null;
  if (Math.abs(x) > Math.abs(y)) return x > 0 ? "right" : "left";
  return y > 0 ? "down" : "up";
}

/** Either stick can drive movement — left stick wins if both are tilted. */
export function readEitherStickDirection(
  left: { x: number; y: number },
  right: { x: number; y: number },
  deadzone = JOYSTICK_DEADZONE
): DpadDirection | null {
  return readJoystickDirection(left.x, left.y, deadzone) ?? readJoystickDirection(right.x, right.y, deadzone);
}
