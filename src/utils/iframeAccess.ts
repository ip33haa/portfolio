/** True when the parent page may dispatch keyboard events into the iframe. */
export function getControllableIframeWindow(
  iframe: HTMLIFrameElement | null
): Window | null {
  if (!iframe) return null;

  try {
    const win = iframe.contentWindow;
    if (!win) return null;
    // Cross-origin iframes throw when touching location.
    void win.location.href;
    return win;
  } catch {
    return null;
  }
}

export function isCrossOriginIframe(iframe: HTMLIFrameElement | null): boolean {
  if (!iframe) return false;
  return getControllableIframeWindow(iframe) === null && !!iframe.contentWindow;
}
