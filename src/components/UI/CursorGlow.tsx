import GlowCursor from "./GlowCursor";
import SplashCursor from "./SplashCursor";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export function CursorGlow() {
  const reduced = useReducedMotion();
  const isCoarse = useMediaQuery("(pointer: coarse)");

  if (reduced || isCoarse) return null;

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[70] hidden h-dvh w-screen overflow-hidden md:block">
        <GlowCursor
          color="#67E8F9"
          secondaryColor="#A78BFA"
          trailLength={40}
          trailWidth={8}
          trailTaper={0.8}
          followSpeed={0.16}
          glowIntensity={1.9}
          glowSpread={1.2}
          hotspot={0.65}
          brightness={1.25}
          opacity={1}
          pulseSpeed={1.1}
          noiseStrength={0.035}
          idleFade
          idleTimeout={700}
          fadeDuration={900}
          blendMode="screen"
          maxDevicePixelRatio={1.5}
          enabled
          className="h-full w-full"
        />
      </div>
      <div className="pointer-events-none fixed inset-0 z-[69] hidden md:block">
        <SplashCursor
          SIM_RESOLUTION={96}
          DYE_RESOLUTION={512}
          DENSITY_DISSIPATION={2.8}
          VELOCITY_DISSIPATION={1.8}
          SPLAT_RADIUS={0.18}
          SPLAT_FORCE={4800}
          SHADING
          COLOR_UPDATE_SPEED={8}
          TRANSPARENT
          RAINBOW_MODE={false}
          COLOR="#67E8F9"
          BACK_COLOR={{ r: 0, g: 0, b: 0 }}
        />
      </div>
    </>
  );
}
