import { useEffect, useRef, useState } from "react";
import { useDeckStore } from "../store/deckStore";
import { GameAppId, getGameById } from "../data/gamesCatalog";
import { SnakeGame } from "./SnakeGame";
import { useDeckKeyboardBridge } from "../hooks/useDeckKeyboardBridge";
import { getControllableIframeWindow, isCrossOriginIframe } from "../utils/iframeAccess";

type GamePlayerProps = {
  gameId: GameAppId;
};

function EmbeddedGame({ gameId }: { gameId: GameAppId }) {
  const navigateTo = useDeckStore((s) => s.navigateTo);
  const game = getGameById(gameId);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [gameWindow, setGameWindow] = useState<Window | null>(null);
  const [crossOrigin, setCrossOrigin] = useState(false);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const bindWindow = () => {
      const controllable = getControllableIframeWindow(iframe);
      setGameWindow(controllable);
      setCrossOrigin(isCrossOriginIframe(iframe));

      try {
        iframe.focus();
      } catch {
        /* ignore */
      }
    };

    iframe.addEventListener("load", bindWindow);
    bindWindow();

    return () => iframe.removeEventListener("load", bindWindow);
  }, [game?.embedUrl]);

  useDeckKeyboardBridge(gameWindow, !!gameWindow);

  if (!game?.embedUrl) return null;

  return (
    <div className="w-full h-full flex flex-col bg-black">
      <div className="flex items-center justify-between px-4 py-2 bg-[#171a21] border-b border-[#2a475e] shrink-0 gap-2">
        <button
          type="button"
          onClick={() => navigateTo("games")}
          className="text-xs px-3 py-1.5 rounded bg-[#2a475e] hover:bg-[#66c0f4] hover:text-[#171a21] text-[#c7d5e0] transition-colors shrink-0"
        >
          ← Library
        </button>
        <span className="text-sm font-medium text-[#c7d5e0] truncate">{game.title}</span>
        <span className="text-[10px] text-[#8f98a0] uppercase tracking-wide hidden sm:inline shrink-0">
          {crossOrigin ? "Click game · use keyboard" : "Sticks / D-pad → arrows"}
        </span>
      </div>
      {crossOrigin && (
        <p className="text-[10px] text-[#8f98a0] px-4 py-1 bg-[#0e1419] border-b border-[#2a475e]">
          Embedded games run on an external site — click inside the game, then use your keyboard.
          Deck sticks work in Deck Snake.
        </p>
      )}
      <iframe
        ref={iframeRef}
        src={game.embedUrl}
        title={game.title}
        className="flex-1 w-full border-0 bg-black"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-popups"
      />
    </div>
  );
}

export function GamePlayer({ gameId }: GamePlayerProps) {
  const game = getGameById(gameId);

  if (!game) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#1b2838] text-neutral-300">
        Game not found
      </div>
    );
  }

  if (game.type === "native" && gameId === "game-snake") {
    return <SnakeGame />;
  }

  if (game.type === "embed") {
    return <EmbeddedGame gameId={gameId} />;
  }

  return null;
}
