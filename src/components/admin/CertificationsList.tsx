import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '../../lib/api'

const CertificationsList: React.FC = () => {
  const queryClient = useQueryClient()
  const { data: items } = useQuery({ queryKey: ['admin','certifications'], queryFn: () => api.getCertifications() })
  const [editing, setEditing] = useState<any | null>(null)

  const createMut = useMutation({ mutationFn: (payload: any) => api.createCertification(payload), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin','certifications'] }) })
  const updateMut = useMutation({ mutationFn: ({ id, payload }: any) => api.updateCertification(id, payload), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin','certifications'] }) })
  const deleteMut = useMutation({ mutationFn: (id: any) => api.deleteCertification(id), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin','certifications'] }) })

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
        <h3 className="text-lg font-medium">Certifications</h3>
        <div>
          <button onClick={() => setEditing({ title: '' })} className="hero-primary-btn">New Certification</button>
        </div>
      </div>

      <div className="space-y-3">
        {(items ?? []).map((c: any) => (
          <div key={c.id ?? c.title} className="rounded border border-white/8 bg-white/2 p-3 flex items-center justify-between">
            <div>
              <div className="font-semibold text-white">{c.title}</div>
              {c.issuer && <div className="text-sm text-white/70">{c.issuer}</div>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(c)} className="rounded-md border border-white/10 px-3 py-1 text-white/80">Edit</button>
              <button onClick={() => deleteMut.mutate(c.id)} className="rounded-md border border-red-400 px-3 py-1 text-red-300">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="mt-4 rounded border p-4 bg-white/3">
          <label className="block text-sm text-white/80">Title</label>
          <input value={editing.title ?? ''} onChange={e => setEditing({ ...editing, title: e.target.value })} className="w-full mt-2 p-2 bg-black/10 rounded" />
          <label className="block text-sm text-white/80 mt-2">Issuer</label>
          <input value={editing.issuer ?? ''} onChange={e => setEditing({ ...editing, issuer: e.target.value })} className="w-full mt-2 p-2 bg-black/10 rounded" />
          <div className="mt-3 flex gap-2 justify-end">
            <button onClick={() => setEditing(null)} className="rounded-md border border-white/10 px-3 py-1">Cancel</button>
            <button onClick={() => handleSave(editing)} className="hero-primary-btn">Save</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CertificationsList
