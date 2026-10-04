import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { Project } from "../../data/projects";

type Props = {
  project: Project;
};

export function SpellbookCard({ project }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  return (
    <Link
      ref={ref}
      to={`/work/${project.slug}`}
      onMouseMove={(event) => {
        if (window.matchMedia("(pointer: coarse)").matches) return;
        const box = ref.current?.getBoundingClientRect();
        if (!box) return;
        const px = (event.clientX - box.left) / box.width - 0.5;
        const py = (event.clientY - box.top) / box.height - 0.5;
        setTilt({ x: py * -8, y: px * 10 });
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className="spellbook group block"
      style={{ perspective: 1200 }}
    >
      <motion.article
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: "spring", stiffness: 240, damping: 18 }}
        className="relative overflow-hidden rounded-sm border border-white/10 bg-[#14110e]"
        style={{
          boxShadow: `0 20px 50px rgba(0,0,0,0.45), inset 0 0 40px ${project.glow}22`,
        }}
      >
        <div className="relative h-40 overflow-hidden sm:h-44 md:h-48">
          <img
            src={project.image}
            alt={project.title}
            className="h-[115%] w-[115%] max-w-none object-cover object-top opacity-80 transition duration-700 ease-out group-hover:scale-110"
            style={{
              transform: `translate3d(${tilt.y * -1.4}px, ${tilt.x * 1.2}px, 0)`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14110e] to-transparent" />
        </div>
        <div className="space-y-2.5 sm:space-y-3 p-4 sm:p-5">
          <p className="text-[10px] tracking-[0.24em] sm:tracking-[0.28em] uppercase" style={{ color: project.glow }}>
            {project.role}
            {project.year ? ` · ${project.year}` : ""}
          </p>
          <h3 className="text-xl font-light tracking-wide text-white group-hover:text-white">
            {project.title}
          </h3>
          <p className="text-sm leading-6 text-white/65">{project.shortDescription}</p>
          <ul className="flex flex-wrap gap-1.5 pt-1">
            {project.technologies.slice(0, 4).map((tech) => (
              <li key={tech} className="text-[10px] tracking-[0.14em] text-white/45 uppercase">
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </motion.article>
    </Link>
  );
}

export { SpellbookCard as ProjectCard };
