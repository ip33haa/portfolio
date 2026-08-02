import { useEffect, useRef } from "react";

/** Tilt past this to register a nav step. */
export const NAV_ACTIVATE_THRESHOLD = 0.52;
/** Return below this before the same direction can step again. */
export const NAV_RELEASE_THRESHOLD = 0.28;
export const NAV_REPEAT_DELAY_MS = 550;
export const NAV_REPEAT_INTERVAL_MS = 280;

/**
 * One stick axis for menu/grid navigation — hysteresis avoids jitter near center,
 * hold-to-repeat is slower than raw stick updates.
 */
export function useJoystickAxisNav(
  value: number,
  onStep: (sign: 1 | -1) => void,
  enabled: boolean
) {
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const repeatTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeSign = useRef<0 | 1 | -1>(0);
  const onStepRef = useRef(onStep);
  onStepRef.current = onStep;

  const clearTimers = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    if (repeatTimer.current) clearInterval(repeatTimer.current);
    holdTimer.current = null;
    repeatTimer.current = null;
  };

  useEffect(() => () => clearTimers(), []);

  useEffect(() => {
    if (!enabled) {
      clearTimers();
      activeSign.current = 0;
      return;
    }

    const magnitude = Math.abs(value);

    if (magnitude < NAV_RELEASE_THRESHOLD) {
      clearTimers();
      activeSign.current = 0;
      return;
    }

    if (magnitude < NAV_ACTIVATE_THRESHOLD) return;

    const sign: 1 | -1 = value > 0 ? 1 : -1;
    if (activeSign.current === sign) return;

    clearTimers();
    activeSign.current = sign;
    onStepRef.current(sign);

    holdTimer.current = setTimeout(() => {
      repeatTimer.current = setInterval(() => {
        onStepRef.current(sign);
      }, NAV_REPEAT_INTERVAL_MS);
    }, NAV_REPEAT_DELAY_MS);
  }, [value, enabled]);
}
