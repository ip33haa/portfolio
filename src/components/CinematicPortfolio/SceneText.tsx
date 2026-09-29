import type { JourneyScene } from "../../data/journey";

type Props = {
  scene: JourneyScene;
  visible: boolean;
  compact?: boolean;
};

export function SceneText({ scene, visible, compact = false }: Props) {
  return (
    <div
      className={`scene-copy max-w-xl transition duration-700 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      } ${compact ? "max-w-md" : ""}`}
    >
      <h2
        className={`font-light text-white tracking-[0.08em] sm:tracking-[0.12em] md:tracking-[0.14em] ${
          compact
            ? "text-2xl xs:text-3xl sm:text-4xl md:text-5xl"
            : "text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
        }`}
      >
        {scene.title}
      </h2>
      <p
        className={`whitespace-pre-line text-white/70 ${
          compact
            ? "mt-3 sm:mt-5 max-w-md text-xs sm:text-sm leading-5 sm:leading-6"
            : "mt-4 sm:mt-6 md:mt-8 max-w-md text-xs sm:text-sm md:text-[15px] leading-relaxed md:leading-7"
        }`}
      >
        {scene.body}
      </p>
    </div>
  );
}
