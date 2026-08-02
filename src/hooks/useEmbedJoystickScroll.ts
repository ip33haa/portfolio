import { useEffect, useRef, type RefObject } from "react";
import { JZL_SITE_URL } from "../data/jzlSite";
import { useDeckStore } from "../store/deckStore";

const DEADZONE = 0.22;
/** Pixels per frame at full stick deflection */
const SCROLL_SPEED = 20;

const JZL_ORIGIN = new URL(JZL_SITE_URL).origin;

/**
 * Right stick → scroll inside an embedded iframe (JZL portfolio).
 * Uses synthetic wheel events; also postMessage for sites that listen (see jzlScrollBridge.ts).
 */
export function useEmbedJoystickScroll(
  iframeRef: RefObject<HTMLIFrameElement | null>,
  enabled: boolean
) {
  const rafRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const focusIframe = () => {
      try {
        iframeRef.current?.focus();
      } catch {
        /* ignore */
      }
    };

    focusIframe();

    const tick = () => {
      const iframe = iframeRef.current;
      if (iframe) {
        const { x, y } = useDeckStore.getState().joystickR;

        if (Math.abs(y) > DEADZONE || Math.abs(x) > DEADZONE) {
          const deltaY = y * SCROLL_SPEED;
          const deltaX = x * SCROLL_SPEED;
          const rect = iframe.getBoundingClientRect();
          const clientX = rect.left + rect.width / 2;
          const clientY = rect.top + rect.height / 2;

          iframe.dispatchEvent(
            new WheelEvent("wheel", {
              deltaY,
              deltaX,
              clientX,
              clientY,
              bubbles: true,
              cancelable: true,
            })
          );

          iframe.contentWindow?.postMessage(
            { source: "steamdeck-portfolio", type: "scroll", deltaY, deltaX },
            JZL_ORIGIN
          );
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [enabled, iframeRef]);
}
