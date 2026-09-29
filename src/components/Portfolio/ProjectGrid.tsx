import { projects } from "../../data/projects";
import { SpellbookCard } from "./SpellbookCard";

export function ProjectGrid() {
  return (
    <section id="work" className="relative z-10 bg-[#07080a] px-4 sm:px-6 md:px-12 lg:px-16 py-16 sm:py-24">
      <p className="text-[10px] sm:text-[11px] tracking-[0.3em] sm:tracking-[0.4em] text-white/45">ARTIFACTS</p>
      <h2 className="mt-3 sm:mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-[0.08em] sm:tracking-[0.12em] text-white">MY PROJECTS</h2>
      <p className="mt-3 sm:mt-4 max-w-xl text-xs sm:text-sm text-white/60">Things I've built along the way.</p>
      <div className="mt-10 sm:mt-14 grid gap-5 sm:gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <SpellbookCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
