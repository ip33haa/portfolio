import { useEffect, useRef } from "react";
import { DpadDirection, useDeckStore } from "../store/deckStore";
import { useJoystickAxisNav } from "./joystickNav";

function clampIndex(index: number, max: number) {
  return Math.max(0, Math.min(max - 1, index));
}

function stepGridIndex(index: number, dir: DpadDirection, columns: number, max: number) {
  switch (dir) {
    case "up":
      return clampIndex(index - columns, max);
    case "down":
      return clampIndex(index + columns, max);
    case "left":
      return clampIndex(index - 1, max);
    case "right":
      return clampIndex(index + 1, max);
  }
}

/**
 * Games library grid: left stick = up/down rows, right stick = left/right columns, D-pad = any direction.
 */
export function useDeckGridNav(
  itemCount: number,
  columns: number,
  selectedIndex: number,
  onSelectIndex: (index: number) => void,
  enabled = true
) {
  const joystickL = useDeckStore((s) => s.joystickL);
  const joystickR = useDeckStore((s) => s.joystickR);
  const lastDpad = useDeckStore((s) => s.lastDpad);

  const indexRef = useRef(selectedIndex);
  indexRef.current = selectedIndex;

  const move = (dir: DpadDirection) => {
    if (itemCount <= 0) return;
    const next = stepGridIndex(indexRef.current, dir, columns, itemCount);
    if (next !== indexRef.current) onSelectIndex(next);
  };

  const moveRef = useRef(move);
  moveRef.current = move;

  useEffect(() => {
    if (!enabled || !lastDpad) return;
    moveRef.current(lastDpad);
  }, [lastDpad, enabled]);

  useJoystickAxisNav(
    enabled ? joystickL.y : 0,
    (sign) => moveRef.current(sign > 0 ? "down" : "up"),
    enabled
  );

  useJoystickAxisNav(
    enabled ? joystickR.x : 0,
    (sign) => moveRef.current(sign > 0 ? "right" : "left"),
    enabled
  );
}
