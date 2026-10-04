import { projects } from "../../data/projects";
import { SpellbookCard } from "./SpellbookCard";

export function ProjectGrid() {
  return (
    <section id="work" className="relative z-10 overflow-hidden bg-[#050608] px-4 py-24 sm:px-6 sm:py-32 md:px-12 lg:px-16">
      <p className="text-center text-[10px] tracking-[0.42em] text-white/40 sm:text-[11px]">THE ARCHIVE</p>
      <h2 className="hall-title mt-4 text-center text-5xl font-light tracking-[0.08em] text-white sm:text-6xl md:text-7xl">
        Artifacts
      </h2>
      <p className="mx-auto mt-5 max-w-xl text-center text-sm leading-7 text-white/55">
        Work collected along the path — live rooms you can still enter.
      </p>
      <div className="mt-10 sm:mt-14 grid gap-5 sm:gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <SpellbookCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
