import React, { useState, useEffect, useRef } from 'react'
import * as api from '../../lib/api'

type Props = {
  project?: any
  onSave: (payload: any) => Promise<void>
  onClose: () => void
}

const ProjectEditor: React.FC<Props> = ({ project, onSave, onClose }) => {
  const [title, setTitle] = useState(project?.title ?? '')
  const [description, setDescription] = useState(project?.description ?? '')
  const [projectUrl, setProjectUrl] = useState(project?.url ?? project?.projectUrl ?? '')
  const [githubUrl, setGithubUrl] = useState(project?.githubUrl ?? project?.gitHubUrl ?? '')
  const [imageUrl, setImageUrl] = useState(project?.imageUrl ?? project?.imageUrl ?? '')
  const [stack, setStack] = useState(project?.technologiesUsed ?? project?.TechnologiesUsed ?? '')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setTitle(project?.title ?? '')
    setDescription(project?.description ?? '')
    setProjectUrl(project?.url ?? project?.projectUrl ?? '')
    setGithubUrl(project?.githubUrl ?? project?.gitHubUrl ?? '')
    setImageUrl(project?.imageUrl ?? '')
    setStack(project?.technologiesUsed ?? project?.TechnologiesUsed ?? '')
  }, [project])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload: any = {
        title,
        description,
        technologiesUsed: stack,
        projectUrl,
        gitHubUrl: githubUrl,
        imageUrl,
        // backend also accepts StartDate/EndDate/DisplayOrder; leave defaults if not provided
      }
      if (project?.id) payload.id = project.id
      await onSave(payload)
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4">
      <form onSubmit={submit} className="w-full max-w-2xl rounded-xl bg-[rgba(10,16,51,0.95)] p-6 shadow-2xl">
        <h3 className="mb-4 text-lg font-semibold text-white">{project ? 'Edit Project' : 'Create Project'}</h3>
        <label className="block text-sm text-white/80">Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} className="mt-1 mb-3 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-white" />

        <label className="block text-sm text-white/80">Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} className="mt-1 mb-3 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-white" rows={4} />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label className="block text-sm text-white/80">Project URL</label>
            <input value={projectUrl} onChange={e => setProjectUrl(e.target.value)} className="mt-1 mb-3 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-white" />
          </div>
          <div>
            <label className="block text-sm text-white/80">GitHub URL</label>
            <input value={githubUrl} onChange={e => setGithubUrl(e.target.value)} className="mt-1 mb-3 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-white" />
          </div>
        </div>

        <label className="block text-sm text-white/80">Image URL</label>
        <div className="flex items-center gap-3">
          <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="mt-1 mb-3 flex-1 rounded-md border border-white/10 bg-transparent px-3 py-2 text-white" />
          <button type="button" onClick={() => fileRef.current?.click()} className="rounded-md border border-white/10 px-3 py-2 text-white/80">Upload</button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={async e => {
          const f = e.target.files?.[0]
          if (!f) return
          setUploading(true)
          try {
            const url = await api.uploadFile(f)
            setImageUrl(url)
          } catch (err) {
            console.error('Upload failed', err)
          } finally {
            setUploading(false)
          }
        }} />
        {uploading && <div className="text-sm text-white/70 mb-2">Uploading...</div>}
        {imageUrl && (
          <div className="mb-3">
            <img src={imageUrl} alt="preview" style={{ maxHeight: 160, borderRadius: 8 }} />
          </div>
        )}

        <label className="block text-sm text-white/80">Stack (comma separated)</label>
        <input value={stack} onChange={e => setStack(e.target.value)} className="mt-1 mb-4 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-white" />

        <div className="flex items-center justify-between">
          <button disabled={loading} type="submit" className="hero-primary-btn">{loading ? 'Saving...' : 'Save'}</button>
          <button type="button" onClick={onClose} className="ml-3 rounded-md border border-white/10 px-3 py-2 text-white/80">Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default ProjectEditor
