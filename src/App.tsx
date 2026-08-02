import { Scene } from "./components/Scene";
import { ModelErrorBoundary } from "./components/ModelErrorBoundary";
import { LoadingOverlay } from "./components/LoadingOverlay";
import Ferrofluid from "./components/Ferrofluid";
import { PowerToggle } from "./components/PowerToggle";

export default function App() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 z-0" aria-hidden>
        <Ferrofluid
          colors={["#ffffff", "#ffffff", "#ffffff"]}
          backgroundColor="#03010A"
          speed={0.5}
          scale={1.6}
          turbulence={1}
          fluidity={0.1}
          rimWidth={0.2}
          sharpness={2.5}
          shimmer={1.5}
          glow={2}
          flowDirection="down"
          opacity={1}
          mouseInteraction
          mouseStrength={1}
          mouseRadius={0.35}
        />
      </div>

      <LoadingOverlay />

      <ModelErrorBoundary>
        <div className="absolute inset-0 z-10">
          <Scene />
        </div>
      </ModelErrorBoundary>

      <PowerToggle />
    </div>
  );
}
