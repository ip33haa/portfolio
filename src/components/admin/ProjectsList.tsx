import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '../../lib/api'
import ProjectEditor from './ProjectEditor'

const ProjectsList: React.FC = () => {
  const queryClient = useQueryClient()
  const { data: projects } = useQuery({ queryKey: ['admin','projects'], queryFn: () => api.getProjects() })
  const [editing, setEditing] = useState<any | null>(null)

  const createMut = useMutation({ mutationFn: (payload: any) => api.createProject(payload), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin','projects'] }) })

  const updateMut = useMutation({ mutationFn: ({ id, payload }: any) => api.updateProject(id, payload), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin','projects'] }) })

  const deleteMut = useMutation({ mutationFn: (id: any) => api.deleteProject(id), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin','projects'] }) })

  const handleSave = async (payload: any) => {
    if (payload.id) {
      await updateMut.mutateAsync({ id: payload.id, payload })
    } else {
      await createMut.mutateAsync(payload)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium">Projects</h3>
        <div>
          <button onClick={() => setEditing({})} className="hero-primary-btn">New Project</button>
        </div>
      </div>

      <div className="space-y-3">
        {(projects ?? []).map((p: any) => (
          <div key={p.id ?? p.title} className="rounded border border-white/8 bg-white/2 p-3 flex items-start gap-4">
            {p.imageUrl ? (
              <div className="w-24 h-24 flex-shrink-0 rounded overflow-hidden bg-black/20">
                <img src={p.imageUrl} alt={p.title} className="object-cover w-full h-full" />
                <button onClick={() => setEditing(p)} className="absolute mt-1 ml-1 rounded bg-black/40 text-white text-xs px-2 py-1">Edit</button>
              </div>
            ) : (
              <div className="w-24 h-24 flex-shrink-0 rounded bg-white/5 flex items-center justify-center text-sm text-white/60">No image</div>
            )}

            <div className="flex-1">
              <div className="font-semibold text-white">{p.title}</div>
              <div className="text-sm text-white/70 mt-1">{p.description}</div>
              { (p.technologiesUsed ?? p.TechnologiesUsed) && <div className="mt-2 text-xs text-white/60">Stack: {p.technologiesUsed ?? p.TechnologiesUsed}</div>}
            </div>

            <div className="flex flex-col items-end gap-2">
              <button onClick={() => setEditing(p)} className="rounded-md border border-white/10 px-3 py-1 text-white/80">Edit</button>
              <button onClick={() => deleteMut.mutate(p.id)} className="rounded-md border border-red-400 px-3 py-1 text-red-300">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <ProjectEditor project={editing.id ? editing : undefined} onSave={handleSave} onClose={() => setEditing(null)} />
      )}
    </div>
  )
}

export default ProjectsList
