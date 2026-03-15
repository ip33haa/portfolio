import React, { useEffect, useRef, useState } from 'react'
import { ImagePlus, LoaderCircle, UploadCloud, X } from 'lucide-react'
import * as api from '../../lib/api'

type Props = {
  project?: any
  onSave: (payload: any) => Promise<void>
  onClose: () => void
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message
  if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as any).message === 'string') {
    return (error as any).message
  }

  return 'Something went wrong while saving this project.'
}

const ProjectEditor: React.FC<Props> = ({ project, onSave, onClose }) => {
  const [title, setTitle] = useState(project?.title ?? '')
  const [description, setDescription] = useState(project?.description ?? '')
  const [projectUrl, setProjectUrl] = useState(project?.url ?? project?.projectUrl ?? '')
  const [githubUrl, setGithubUrl] = useState(project?.githubUrl ?? project?.gitHubUrl ?? '')
  const [imageUrl, setImageUrl] = useState(project?.imageUrl ?? '')
  const [stack, setStack] = useState(project?.technologiesUsed ?? project?.TechnologiesUsed ?? '')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setTitle(project?.title ?? '')
    setDescription(project?.description ?? '')
    setProjectUrl(project?.url ?? project?.projectUrl ?? '')
    setGithubUrl(project?.githubUrl ?? project?.gitHubUrl ?? '')
    setImageUrl(project?.imageUrl ?? '')
    setStack(project?.technologiesUsed ?? project?.TechnologiesUsed ?? '')
    setError(null)
  }, [project])

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)
    setUploading(true)

    try {
      const url = await api.uploadFile(file)
      setImageUrl(url)
    } catch (uploadError) {
      setError(getErrorMessage(uploadError))
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.')
      return
    }

    setError(null)
    setLoading(true)

    try {
      const payload: any = {
        title: title.trim(),
        description: description.trim(),
        technologiesUsed: stack.trim() || undefined,
        projectUrl: projectUrl.trim() || undefined,
        gitHubUrl: githubUrl.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
      }

      if (project?.id) payload.id = project.id

      await onSave(payload)
      onClose()
    } catch (saveError) {
      setError(getErrorMessage(saveError))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-modal-backdrop">
      <form onSubmit={submit} className="admin-modal">
        <div className="admin-modal-header">
          <div>
            <p className="admin-eyebrow">Project editor</p>
            <h3>{project ? 'Edit project' : 'Create project'}</h3>
            <p>Update the project content, external links, technologies, and preview image.</p>
          </div>

          <button type="button" className="admin-icon-btn" onClick={onClose} aria-label="Close editor">
            <X size={18} />
          </button>
        </div>

        <div className="admin-modal-body">
          {error && <div className="admin-error-banner">{error}</div>}

          <div className="admin-form-grid">
            <label className="admin-field admin-field--full">
              <span className="admin-label">Title</span>
              <input
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="admin-input"
                placeholder="Project title"
              />
            </label>

            <label className="admin-field admin-field--full">
              <span className="admin-label">Description</span>
              <textarea
                required
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="admin-textarea"
                rows={5}
                placeholder="Summarize the project, impact, and outcome"
              />
            </label>

            <label className="admin-field">
              <span className="admin-label">Project URL</span>
              <input
                value={projectUrl}
                onChange={(event) => setProjectUrl(event.target.value)}
                className="admin-input"
                placeholder="https://example.com"
              />
            </label>

            <label className="admin-field">
              <span className="admin-label">GitHub URL</span>
              <input
                value={githubUrl}
                onChange={(event) => setGithubUrl(event.target.value)}
                className="admin-input"
                placeholder="https://github.com/username/repo"
              />
            </label>

            <label className="admin-field admin-field--full">
              <span className="admin-label">Image URL</span>
              <div className="admin-upload-row">
                <input
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                  className="admin-input"
                  placeholder="https://images.example.com/project-cover.jpg"
                />
                <button
                  type="button"
                  className="admin-upload-btn"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? <LoaderCircle size={16} className="admin-spinner" /> : <UploadCloud size={16} />}
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
              <span className="admin-helper-text">Paste an existing image URL or upload a new image file.</span>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            </label>

            {imageUrl && (
              <div className="admin-field admin-field--full">
                <span className="admin-label">Preview</span>
                <div className="admin-image-preview">
                  <img src={imageUrl} alt="Project preview" />
                </div>
              </div>
            )}

            <label className="admin-field admin-field--full">
              <span className="admin-label">Stack</span>
              <input
                value={stack}
                onChange={(event) => setStack(event.target.value)}
                className="admin-input"
                placeholder="React, TypeScript, ASP.NET Core"
              />
              <span className="admin-helper-text">Separate technologies with commas.</span>
            </label>
          </div>
        </div>

        <div className="admin-form-actions">
          <button type="button" onClick={onClose} className="admin-text-btn">
            Cancel
          </button>
          <button disabled={loading || uploading} type="submit" className="admin-primary-btn">
            {loading ? <LoaderCircle size={16} className="admin-spinner" /> : <ImagePlus size={16} />}
            {loading ? 'Saving...' : 'Save project'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProjectEditor
