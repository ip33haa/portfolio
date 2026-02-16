import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '../../lib/api'

const SkillsList: React.FC = () => {
  const queryClient = useQueryClient()
  const { data: skills, isLoading, isError, error } = useQuery({
    queryKey: ['admin','skills'],
    queryFn: () => api.getSkills()
  })
  const [editing, setEditing] = useState<any | null>(null)

  const createMut = useMutation({ mutationFn: (payload: any) => api.createSkill(payload), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin','skills'] }) })
  const updateMut = useMutation({ mutationFn: ({ id, payload }: any) => api.updateSkill(id, payload), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin','skills'] }) })
  const deleteMut = useMutation({ mutationFn: (id: any) => api.deleteSkill(id), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin','skills'] }) })

  const handleSave = async (payload: any) => {
    try {
      if (payload.id) {
        await updateMut.mutateAsync({ id: payload.id, payload })
      } else {
        await createMut.mutateAsync(payload)
      }
      setEditing(null)
    } catch (err) {
      console.error('Failed to save skill', err)
      // optional: show user-friendly notification here
    }
  }

  const handleDelete = async (id: any) => {
    try {
      await deleteMut.mutateAsync(id)
    } catch (err) {
      console.error('Failed to delete skill', err)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium">Skills</h3>
        <div>
          <button onClick={() => setEditing({ name: '' })} className="hero-primary-btn">New Skill</button>
        </div>
      </div>

      <div className="space-y-3">
        {isLoading && <div className="text-sm text-white/60">Loading skills...</div>}
        {isError && <div className="text-sm text-red-300">Failed to load skills: {(error as any)?.message ?? 'Unknown error'}</div>}
        {!isLoading && !isError && (skills ?? []).map((s: any) => (
          <div key={s.id ?? s.name} className="rounded border border-white/8 bg-white/2 p-3 flex items-center justify-between">
            <div className="font-semibold text-white">{s.name}</div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(s)} className="rounded-md border border-white/10 px-3 py-1 text-white/80">Edit</button>
              <button onClick={() => handleDelete(s.id)} className="rounded-md border border-red-400 px-3 py-1 text-red-300">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="mt-4 rounded border p-4 bg-white/3">
          <label className="block text-sm text-white/80">Name</label>
          <input value={editing.name ?? ''} onChange={e => setEditing({ ...editing, name: e.target.value })} className="w-full mt-2 p-2 bg-black/10 rounded" />
          <div className="mt-3 flex gap-2 justify-end">
            <button onClick={() => setEditing(null)} className="rounded-md border border-white/10 px-3 py-1">Cancel</button>
            <button onClick={() => handleSave(editing)} className="hero-primary-btn">Save</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SkillsList
