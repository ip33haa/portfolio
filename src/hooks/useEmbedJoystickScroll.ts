import { useEffect, useRef, type RefObject } from "react";
import { JZL_SITE_URL } from "../data/jzlSite";
import { DpadDirection, useDeckStore } from "../store/deckStore";
import { getControllableIframeWindow } from "../utils/iframeAccess";
import { readJoystickDirection } from "./deckDirection";
import {
  NAV_ACTIVATE_THRESHOLD,
  NAV_RELEASE_THRESHOLD,
  NAV_REPEAT_DELAY_MS,
  NAV_REPEAT_INTERVAL_MS,
} from "./joystickNav";

const ARROW_KEYS: Record<DpadDirection, string> = {
  up: "ArrowUp",
  down: "ArrowDown",
  left: "ArrowLeft",
  right: "ArrowRight",
};

const JZL_ORIGIN = new URL(JZL_SITE_URL).origin;

function dispatchKey(target: EventTarget, type: "keydown" | "keyup", key: string): void {
  try {
    target.dispatchEvent(
      new KeyboardEvent(type, {
        key,
        code: key,
        bubbles: true,
        cancelable: true,
      })
    );
  } catch {
    /* ignore */
  }
}

function sendArrowKey(
  iframe: HTMLIFrameElement,
  type: "keydown" | "keyup",
  key: string
): void {
  iframe.focus();
  const win = getControllableIframeWindow(iframe);
  if (win) {
    dispatchKey(win, type, key);
  } else if (iframe.contentWindow) {
    iframe.contentWindow.postMessage(
      { source: "steamdeck-portfolio", type, key },
      JZL_ORIGIN
    );
  }
  dispatchKey(iframe, type, key);
}

/**
 * Right stick → arrow keys inside the embedded JZL portfolio iframe.
 * Same-origin: synthetic key events on contentWindow. Cross-origin: postMessage (see jzlScrollBridge.ts).
 */
export function useEmbedJoystickScroll(
  iframeRef: RefObject<HTMLIFrameElement | null>,
  enabled: boolean
) {
  const activeKey = useRef<string | null>(null);
  const lockedDir = useRef<DpadDirection | null>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const repeatTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const clearRepeat = () => {
      if (holdTimer.current) clearTimeout(holdTimer.current);
      if (repeatTimer.current) clearInterval(repeatTimer.current);
      holdTimer.current = null;
      repeatTimer.current = null;
    };

    const release = () => {
      const iframe = iframeRef.current;
      const key = activeKey.current;
      if (iframe && key) sendArrowKey(iframe, "keyup", key);
      activeKey.current = null;
      lockedDir.current = null;
      clearRepeat();
    };

    const press = (dir: DpadDirection) => {
      const iframe = iframeRef.current;
      if (!iframe) return;
      const key = ARROW_KEYS[dir];
      sendArrowKey(iframe, "keydown", key);
      activeKey.current = key;
      lockedDir.current = dir;

      clearRepeat();
      holdTimer.current = setTimeout(() => {
        repeatTimer.current = setInterval(() => {
          const { x, y } = useDeckStore.getState().joystickR;
          const held =
            readJoystickDirection(x, y, NAV_ACTIVATE_THRESHOLD) === lockedDir.current;
          const frame = iframeRef.current;
          if (held && frame && lockedDir.current) {
            sendArrowKey(frame, "keydown", ARROW_KEYS[lockedDir.current]);
          }
        }, NAV_REPEAT_INTERVAL_MS);
      }, NAV_REPEAT_DELAY_MS);
    };

    iframeRef.current?.focus();

    let raf = 0;
    const tick = () => {
      const { x, y } = useDeckStore.getState().joystickR;
      const magnitude = Math.max(Math.abs(x), Math.abs(y));

      if (magnitude < NAV_RELEASE_THRESHOLD) {
        if (activeKey.current) release();
      } else if (magnitude >= NAV_ACTIVATE_THRESHOLD) {
        const dir = readJoystickDirection(x, y, NAV_ACTIVATE_THRESHOLD);
        if (dir && dir !== lockedDir.current) {
          release();
          press(dir);
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      release();
    };
  }, [enabled, iframeRef]);
}
