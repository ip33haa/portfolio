import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '../../lib/api'

const TestimonialsList: React.FC = () => {
  const queryClient = useQueryClient()
  const { data: items } = useQuery({ queryKey: ['admin','testimonials'], queryFn: () => api.getTestimonials() })
  const [editing, setEditing] = useState<any | null>(null)

  const createMut = useMutation({ mutationFn: (payload: any) => api.createTestimonial(payload), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin','testimonials'] }) })
  const updateMut = useMutation({ mutationFn: ({ id, payload }: any) => api.updateTestimonial(id, payload), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin','testimonials'] }) })
  const deleteMut = useMutation({ mutationFn: (id: any) => api.deleteTestimonial(id), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin','testimonials'] }) })

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
        <h3 className="text-lg font-medium">Testimonials</h3>
        <div>
          <button onClick={() => setEditing({ author: '', text: '' })} className="hero-primary-btn">New Testimonial</button>
        </div>
      </div>

      <div className="space-y-3">
        {(items ?? []).map((t: any) => (
          <div key={t.id ?? t.author} className="rounded border border-white/8 bg-white/2 p-3">
            <div className="font-semibold text-white">{t.author}</div>
            <div className="text-sm text-white/80 mt-1">{t.text}</div>
            <div className="mt-2 flex gap-2 justify-end">
              <button onClick={() => setEditing(t)} className="rounded-md border border-white/10 px-3 py-1 text-white/80">Edit</button>
              <button onClick={() => deleteMut.mutate(t.id)} className="rounded-md border border-red-400 px-3 py-1 text-red-300">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="mt-4 rounded border p-4 bg-white/3">
          <label className="block text-sm text-white/80">Author</label>
          <input value={editing.author ?? ''} onChange={e => setEditing({ ...editing, author: e.target.value })} className="w-full mt-2 p-2 bg-black/10 rounded" />
          <label className="block text-sm text-white/80 mt-2">Text</label>
          <textarea value={editing.text ?? ''} onChange={e => setEditing({ ...editing, text: e.target.value })} className="w-full mt-2 p-2 bg-black/10 rounded" />
          <div className="mt-3 flex gap-2 justify-end">
            <button onClick={() => setEditing(null)} className="rounded-md border border-white/10 px-3 py-1">Cancel</button>
            <button onClick={() => handleSave(editing)} className="hero-primary-btn">Save</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TestimonialsList
