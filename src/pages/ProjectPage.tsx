import { Navigate, useParams } from "react-router-dom";
import { ProjectCaseStudy } from "../components/Portfolio/ProjectCaseStudy";
import { getProject } from "../data/projects";

export function ProjectPage() {
  const { slug } = useParams();
  const project = slug ? getProject(slug) : undefined;
  if (!project) return <Navigate to="/" replace />;
  return <ProjectCaseStudy project={project} />;
}
