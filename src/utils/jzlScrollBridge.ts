/**
 * Add to https://jzl-seven.vercel.app/ (import once from main/layout):
 *
 *   import "./deckScrollBridge";
 *
 * Cross-origin embeds cannot receive synthetic keys from the parent page;
 * this listener maps Deck arrow-key postMessages to scroll.
 */
const SOURCE = "steamdeck-portfolio";

const KEY_SCROLL: Record<string, [number, number]> = {
  ArrowDown: [0, 56],
  ArrowUp: [0, -56],
  ArrowRight: [56, 0],
  ArrowLeft: [-56, 0],
};

if (typeof window !== "undefined") {
  window.addEventListener("message", (event) => {
    const data = event.data;
    if (!data || data.source !== SOURCE) return;

    if (data.type === "keydown" && typeof data.key === "string") {
      const delta = KEY_SCROLL[data.key];
      if (delta) {
        window.scrollBy({ left: delta[0], top: delta[1], behavior: "auto" });
      }
      return;
    }

    // Legacy scroll deltas from older Deck builds
    if (data.type === "scroll") {
      const deltaY = Number(data.deltaY) || 0;
      const deltaX = Number(data.deltaX) || 0;
      if (deltaY !== 0 || deltaX !== 0) {
        window.scrollBy({ top: deltaY, left: deltaX, behavior: "auto" });
      }
    }
  });
}

export {};
