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
      <p className="mb-4 text-[11px] tracking-[0.42em] text-white/55">{scene.number}</p>
      <h2 className="text-4xl font-light tracking-[0.08em] sm:text-5xl lg:text-6xl">{scene.title}</h2>
      {scene.subtitle ? (
        <p className="mt-4 text-sm tracking-[0.18em] uppercase" style={{ color: scene.accent }}>
          {scene.subtitle}
        </p>
      ) : null}
      <p className="mt-6 max-w-md whitespace-pre-line text-sm leading-7 text-white/75 sm:text-[15px]">
        {scene.body}
      </p>
      {scene.technologies ? (
        <ul className="mt-6 flex flex-wrap gap-2">
          {scene.technologies.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-white/15 px-3 py-1 text-[10px] tracking-[0.16em] uppercase text-white/70"
            >
              {tech}
            </li>
          ))}
        </ul>
      ) : null}
      {scene.cameraNote ? (
        <p className="mt-8 text-[10px] tracking-[0.2em] text-white/40 uppercase">{scene.cameraNote}</p>
      ) : null}
    </div>
  );
}
