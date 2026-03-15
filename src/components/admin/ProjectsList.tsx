import React, { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ExternalLink, FolderOpenDot, Github, Pencil, Plus, Trash2 } from 'lucide-react'
import * as api from '../../lib/api'
import ProjectEditor from './ProjectEditor'

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message
  if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as any).message === 'string') {
    return (error as any).message
  }

  return 'Something went wrong while loading projects.'
}

function getStackTags(value: unknown) {
  if (typeof value !== 'string') return []

  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 6)
}

const ProjectsList: React.FC = () => {
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState<any | null>(null)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin', 'projects'],
    queryFn: () => api.getProjects(),
    staleTime: 30_000,
  })

  const projects = useMemo(() => (Array.isArray(data) ? data : []), [data])

  const createMut = useMutation({
    mutationFn: (payload: any) => api.createProject(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] }),
  })

  const updateMut = useMutation({
    mutationFn: ({ id, payload }: any) => api.updateProject(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] }),
  })

  const deleteMut = useMutation({
    mutationFn: (id: any) => api.deleteProject(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] }),
  })

  const mutationError = createMut.error ?? updateMut.error ?? deleteMut.error
  const busy = createMut.isPending || updateMut.isPending || deleteMut.isPending

  const handleSave = async (payload: any) => {
    if (payload.id) {
      await updateMut.mutateAsync({ id: payload.id, payload })
      return
    }

    await createMut.mutateAsync(payload)
  }

  const handleDelete = async (project: any) => {
    if (!project?.id) return

    const label = project.title ?? 'this project'
    if (!window.confirm(`Delete "${label}"?`)) return

    try {
      await deleteMut.mutateAsync(project.id)
    } catch (deleteError) {
      console.error(deleteError)
    }
  }

  return (
    <div className="admin-section-stack">
      <div className="admin-list-toolbar">
        <div>
          <p className="admin-eyebrow">Projects library</p>
          <h2 className="admin-list-title">Portfolio projects</h2>
        </div>

        <div className="admin-toolbar-actions">
          <span className="admin-counter">{projects.length} total</span>
          <button type="button" className="admin-primary-btn" onClick={() => setEditing({})} disabled={busy}>
            <Plus size={16} />
            New project
          </button>
        </div>
      </div>

      {mutationError && <div className="admin-error-banner">{getErrorMessage(mutationError)}</div>}

      {isLoading && (
        <div className="admin-empty-state">
          <div className="admin-empty-icon">
            <FolderOpenDot size={18} />
          </div>
          <strong>Loading projects</strong>
          <p>Fetching the latest portfolio data.</p>
        </div>
      )}

      {!isLoading && isError && (
        <div className="admin-error-banner">{getErrorMessage(error)}</div>
      )}

      {!isLoading && !isError && projects.length === 0 && (
        <div className="admin-empty-state">
          <div className="admin-empty-icon">
            <Plus size={18} />
          </div>
          <strong>No projects yet</strong>
          <p>Create the first project to populate the portfolio section.</p>
          <button type="button" className="admin-primary-btn" onClick={() => setEditing({})}>
            <Plus size={16} />
            Create project
          </button>
        </div>
      )}

      {!isLoading && !isError && projects.length > 0 && (
        <div className="admin-project-grid">
          {projects.map((project: any) => {
            const projectLink = project.projectUrl ?? project.url
            const githubLink = project.githubUrl ?? project.gitHubUrl
            const stackTags = getStackTags(project.technologiesUsed ?? project.TechnologiesUsed)

            return (
              <article key={project.id ?? project.title} className="admin-project-card">
                <div className="admin-project-media">
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title ?? 'Project preview'}
                      className="admin-project-image"
                    />
                  ) : (
                    <div className="admin-project-placeholder">
                      <FolderOpenDot size={24} />
                      <span>No preview image</span>
                    </div>
                  )}
                </div>

                <div className="admin-project-body">
                  <div className="admin-project-header">
                    <div className="admin-project-title-row">
                      <h3 className="admin-project-title">{project.title ?? 'Untitled project'}</h3>
                      {project.id && <span className="admin-project-id">#{project.id}</span>}
                    </div>
                    <p className="admin-project-summary">{project.description ?? 'No description yet.'}</p>
                  </div>

                  {stackTags.length > 0 && (
                    <div className="admin-tag-row">
                      {stackTags.map((tag) => (
                        <span key={`${project.id ?? project.title}-${tag}`} className="admin-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="admin-project-links">
                    {projectLink && (
                      <a href={projectLink} target="_blank" rel="noreferrer" className="admin-inline-link">
                        <ExternalLink size={14} />
                        Live preview
                      </a>
                    )}
                    {githubLink && (
                      <a href={githubLink} target="_blank" rel="noreferrer" className="admin-inline-link">
                        <Github size={14} />
                        Source code
                      </a>
                    )}
                  </div>

                  <div className="admin-card-actions">
                    <button
                      type="button"
                      className="admin-secondary-btn small"
                      onClick={() => setEditing(project)}
                      disabled={busy}
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-danger-btn small"
                      onClick={() => void handleDelete(project)}
                      disabled={deleteMut.isPending}
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {editing !== null && (
        <ProjectEditor project={editing.id ? editing : undefined} onSave={handleSave} onClose={() => setEditing(null)} />
      )}
    </div>
  )
}

export default ProjectsList
