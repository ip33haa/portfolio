import { projects } from "../../data/projects";
import { SpellbookCard } from "./SpellbookCard";

export function ProjectGrid() {
  return (
    <section id="work" className="relative z-10 bg-[#07080a] px-6 py-24 md:px-16">
      <p className="text-[11px] tracking-[0.4em] text-white/45">ARTIFACTS</p>
      <h2 className="mt-4 text-4xl font-light tracking-[0.12em] text-white md:text-6xl">MY PROJECTS</h2>
      <p className="mt-4 max-w-xl text-sm text-white/60">Things I've built along the way.</p>
      <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <SpellbookCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
