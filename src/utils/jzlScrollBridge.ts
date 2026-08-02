/**
 * Optional one-liner for https://jzl-seven.vercel.app/ (or any embedded portfolio).
 * Add to that site's layout/root so the Deck right stick can scroll via postMessage:
 *
 *   import "./deckScrollBridge";
 *
 * Cross-origin iframes ignore synthetic wheel events in most browsers; this listener fixes that.
 */
const SOURCE = "steamdeck-portfolio";

if (typeof window !== "undefined") {
  window.addEventListener("message", (event) => {
    const data = event.data;
    if (!data || data.source !== SOURCE || data.type !== "scroll") return;
    const deltaY = Number(data.deltaY) || 0;
    const deltaX = Number(data.deltaX) || 0;
    if (deltaY === 0 && deltaX === 0) return;
    window.scrollBy({ top: deltaY, left: deltaX, behavior: "auto" });
  });
}

export {};
