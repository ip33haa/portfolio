import { Html } from "@react-three/drei";
import { useDeckStore } from "../store/deckStore";
import { BootScreen } from "./screens/BootScreen";
import { MainMenu } from "./screens/MainMenu";
import { AboutScreen } from "./screens/AboutScreen";
import { GamesScreen } from "./screens/GamesScreen";
import { GamePlayer } from "../games/GamePlayer";
import { isGameApp } from "../data/gamesCatalog";
import { SCREEN_HTML_SIZE } from "../utils/screenHtmlConfig";

export function ScreenOverlay({
  position,
  rotation,
  distanceFactor,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  distanceFactor: number;
}) {
  const currentApp = useDeckStore((s) => s.currentApp);

  return (
    <Html
      transform
      position={position}
      rotation={rotation}
      distanceFactor={distanceFactor}
      occlude={false}
      style={{
        width: SCREEN_HTML_SIZE.width,
        height: SCREEN_HTML_SIZE.height,
        pointerEvents: "auto",
      }}
    >
      <div
        className="w-[1280px] h-[800px] bg-black overflow-hidden text-white font-sans select-none"
        data-testid="deck-screen-ui"
      >
        {currentApp === "boot" && <BootScreen />}
        {currentApp === "menu" && <MainMenu />}
        {currentApp === "about" && <AboutScreen />}
        {currentApp === "games" && <GamesScreen />}
        {isGameApp(currentApp) && <GamePlayer gameId={currentApp} />}
      </div>
    </Html>
  );
}
