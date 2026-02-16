import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '../../lib/api'

const AboutEditor: React.FC = () => {
  const queryClient = useQueryClient()
  const { data } = useQuery({ queryKey: ['admin','about'], queryFn: () => api.getAbout() })
  const [model, setModel] = useState<any>(null)

  useEffect(() => {
    if (data) setModel(data)
  }, [data])

  const updateMut = useMutation({ mutationFn: (payload: any) => api.updateAbout(payload), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin','about'] }) })

  if (!model) return <div>Loading…</div>

  return (
    <div>
      <h3 className="text-lg font-medium mb-3">About</h3>
      <label className="block text-sm text-white/80">Name</label>
      <input value={model.name ?? ''} onChange={e => setModel({ ...model, name: e.target.value })} className="w-full mt-2 p-2 bg-black/10 rounded" />
      <label className="block text-sm text-white/80 mt-2">Title</label>
      <input value={model.title ?? ''} onChange={e => setModel({ ...model, title: e.target.value })} className="w-full mt-2 p-2 bg-black/10 rounded" />
      <label className="block text-sm text-white/80 mt-2">Bio</label>
      <textarea value={model.bio ?? ''} onChange={e => setModel({ ...model, bio: e.target.value })} className="w-full mt-2 p-2 bg-black/10 rounded" />
      <div className="mt-3 flex gap-2 justify-end">
        <button onClick={() => queryClient.invalidateQueries({ queryKey: ['admin','about'] })} className="rounded-md border border-white/10 px-3 py-1">Reset</button>
        <button onClick={() => updateMut.mutate(model)} className="hero-primary-btn">Save</button>
      </div>
    </div>
  )
}

export default AboutEditor
