import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { getAdjacentProjects, type Project } from "../../data/projects";
import { Button } from "../UI/Button";
import { Icon } from "../UI/Icon";

type Props = {
  project: Project;
};

function Block({ title, body }: { title: string; body?: string }) {
  if (!body) return null;
  return (
    <section className="space-y-3">
      <h2 className="text-[11px] tracking-[0.28em] text-white/45 uppercase">{title}</h2>
      <p className="max-w-3xl text-sm leading-7 text-white/75 whitespace-pre-line">{body}</p>
    </section>
  );
}

export function ProjectCaseStudy({ project }: Props) {
  const { prev, next } = getAdjacentProjects(project.slug);
  const links = [
    ...(project.liveUrl ? [{ label: "Live", href: project.liveUrl }] : []),
    ...(project.liveUrls ?? []),
    ...(project.github ? [{ label: "GitHub", href: project.github }] : []),
  ];

  return (
    <article className="min-h-dvh bg-[#07080a] px-6 py-20 text-white md:px-16">
      <Link to="/#work" className="text-[11px] tracking-[0.24em] text-white/50 uppercase">
        ← Back to projects
      </Link>
      <header className="mt-10 max-w-4xl">
        <p className="text-[11px] tracking-[0.28em] uppercase" style={{ color: project.glow }}>
          {project.role}
          {project.year ? ` · ${project.year}` : ""}
        </p>
        <h1 className="mt-4 text-4xl font-light tracking-wide md:text-6xl">{project.title}</h1>
      </header>
      <img
        src={project.image}
        alt=""
        className="mt-12 h-72 w-full rounded-sm object-cover object-top opacity-90 md:h-[420px]"
      />
      {project.screenshots && project.screenshots.length > 1 ? (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {project.screenshots.map((shot) => (
            <li key={shot.href}>
              <a href={shot.href} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-sm border border-white/10">
                <img src={shot.href} alt={shot.label} className="h-40 w-full object-cover object-top" />
                <p className="px-3 py-2 text-[10px] tracking-[0.2em] uppercase text-white/50">{shot.label}</p>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-14 space-y-12">
        <Block title="Overview" body={project.overview} />
        <Block title="Situation" body={project.situation} />
        <Block title="Task" body={project.task} />
        <Block title="Action" body={project.action} />
        <Block title="Result" body={project.result} />
        <section>
          <h2 className="text-[11px] tracking-[0.28em] text-white/45 uppercase">Technologies</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <li key={tech} className="border border-white/15 px-3 py-1 text-[11px] tracking-[0.16em] uppercase">
                {tech}
              </li>
            ))}
          </ul>
        </section>
        {links.length ? (
          <section>
            <h2 className="text-[11px] tracking-[0.28em] text-white/45 uppercase">Links</h2>
            <ul className="mt-4 flex flex-wrap gap-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Button href={link.href} variant="ghost">
                    {link.label}
                    <Icon icon={ExternalLink} label="Opens in a new tab" className="h-3.5 w-3.5" />
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
      <nav className="mt-20 flex items-center justify-between border-t border-white/10 pt-8 text-[11px] tracking-[0.2em] uppercase">
        {prev ? (
          <Link to={`/work/${prev.slug}`} className="flex items-center gap-2 text-white/70">
            <Icon icon={ArrowLeft} label="Previous" />
            Previous project
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/work/${next.slug}`} className="flex items-center gap-2 text-white/70">
            Next project
            <Icon icon={ArrowRight} label="Next" />
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
