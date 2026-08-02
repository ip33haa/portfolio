import { useRef, useState } from "react";
import { JZL_SITE_URL } from "../../data/jzlSite";
import { useEmbedJoystickScroll } from "../../hooks/useEmbedJoystickScroll";

type JzlPortfolioEmbedProps = {
  className?: string;
  title?: string;
  /** When true, right stick scrolls the embedded page */
  scrollEnabled?: boolean;
};

/** Embedded JZL site — stays on the Deck screen, no external tab needed. */
export function JzlPortfolioEmbed({
  className = "w-full h-full border-0 bg-black",
  title = "JZL Portfolio",
  scrollEnabled = false,
}: JzlPortfolioEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEmbedJoystickScroll(iframeRef, scrollEnabled && loaded);

  return (
    <div className="relative w-full h-full min-h-0 bg-black" data-testid="jzl-embed">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center text-neutral-500 text-sm">
          Loading portfolio…
        </div>
      )}
      {scrollEnabled && loaded && (
        <div className="absolute top-2 right-2 z-10 text-[10px] text-neutral-400 bg-black/60 px-2 py-1 rounded pointer-events-none">
          Right stick → arrow keys
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={JZL_SITE_URL}
        title={title}
        className={className}
        tabIndex={0}
        loading="eager"
        onLoad={() => {
          setLoaded(true);
          iframeRef.current?.focus();
        }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        allow="fullscreen"
      />
    </div>
  );
}
