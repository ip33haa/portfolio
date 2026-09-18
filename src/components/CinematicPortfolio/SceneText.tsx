import type { JourneyScene } from "../../data/journey";

type Props = {
  scene: JourneyScene;
  visible: boolean;
  compact?: boolean;
};

export function SceneText({ scene, visible, compact = false }: Props) {
  return (
    <div
      className={`scene-copy max-w-lg transition duration-700 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      } ${compact ? "max-w-md" : ""}`}
    >
      <h2 className="text-5xl font-light tracking-[0.14em] text-white sm:text-6xl lg:text-7xl">
        {scene.title}
      </h2>
      <p className="mt-8 max-w-md whitespace-pre-line text-[15px] leading-7 text-white/70">
        {scene.body}
      </p>
    </div>
  );
}
