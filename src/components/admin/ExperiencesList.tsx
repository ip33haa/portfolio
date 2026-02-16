import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '../../lib/api'

const ExperiencesList: React.FC = () => {
  const queryClient = useQueryClient()
  const { data: items } = useQuery({ queryKey: ['admin','experiences'], queryFn: () => api.getExperiences() })
  const [editing, setEditing] = useState<any | null>(null)

  const createMut = useMutation({ mutationFn: (payload: any) => api.createExperience(payload), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin','experiences'] }) })
  const updateMut = useMutation({ mutationFn: ({ id, payload }: any) => api.updateExperience(id, payload), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin','experiences'] }) })
  const deleteMut = useMutation({ mutationFn: (id: any) => api.deleteExperience(id), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin','experiences'] }) })

  const handleSave = async (payload: any) => {
    if (payload.id) {
      await updateMut.mutateAsync({ id: payload.id, payload })
    } else {
      await createMut.mutateAsync(payload)
    }
    setEditing(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium">Experiences</h3>
        <div>
          <button onClick={() => setEditing({ title: '', company: '' })} className="hero-primary-btn">New Experience</button>
        </div>
      </div>

      <div className="space-y-3">
        {(items ?? []).map((e: any) => (
          <div key={e.id ?? e.title} className="rounded border border-white/8 bg-white/2 p-3">
            <div className="font-semibold text-white">{e.title} — <span className="text-sm text-white/70">{e.company}</span></div>
            <div className="mt-2 flex gap-2 justify-end">
              <button onClick={() => setEditing(e)} className="rounded-md border border-white/10 px-3 py-1 text-white/80">Edit</button>
              <button onClick={() => deleteMut.mutate(e.id)} className="rounded-md border border-red-400 px-3 py-1 text-red-300">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="mt-4 rounded border p-4 bg-white/3">
          <label className="block text-sm text-white/80">Title</label>
          <input value={editing.title ?? ''} onChange={e => setEditing({ ...editing, title: e.target.value })} className="w-full mt-2 p-2 bg-black/10 rounded" />
          <label className="block text-sm text-white/80 mt-2">Company</label>
          <input value={editing.company ?? ''} onChange={e => setEditing({ ...editing, company: e.target.value })} className="w-full mt-2 p-2 bg-black/10 rounded" />
          <label className="block text-sm text-white/80 mt-2">Description</label>
          <textarea value={editing.description ?? ''} onChange={e => setEditing({ ...editing, description: e.target.value })} className="w-full mt-2 p-2 bg-black/10 rounded" />
          <div className="mt-3 flex gap-2 justify-end">
            <button onClick={() => setEditing(null)} className="rounded-md border border-white/10 px-3 py-1">Cancel</button>
            <button onClick={() => handleSave(editing)} className="hero-primary-btn">Save</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExperiencesList
