import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '../../lib/api'

const ContactFormsList: React.FC = () => {
  const queryClient = useQueryClient()
  const { data: contacts } = useQuery({ queryKey: ['admin','contacts'], queryFn: () => api.getContactForms() })

  const markMut = useMutation({ mutationFn: (id: any) => api.markContactFormAsRead(id), onSuccess: () => queryClient.invalidateQueries(['admin','contacts']) })
  const delMut = useMutation({ mutationFn: (id: any) => api.deleteContactFormSubmission(id), onSuccess: () => queryClient.invalidateQueries(['admin','contacts']) })

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium">Contact Submissions</h3>
      </div>

      <div className="space-y-3">
        {(contacts ?? []).map((c: any) => (
          <div key={c.id} className={`rounded border p-3 ${c.isRead ? 'border-white/6 bg-white/2' : 'border-cyan-400 bg-white/3'}`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold text-white">{c.fullName} — <span className="text-sm text-white/70">{c.email}</span></div>
                <div className="text-sm text-white/80 mt-1">{c.message}</div>
              </div>
              <div className="flex flex-col gap-2 ml-4">
                {!c.isRead && <button onClick={() => markMut.mutate(c.id)} className="rounded-md border border-white/10 px-3 py-1 text-white/80">Mark read</button>}
                <button onClick={() => delMut.mutate(c.id)} className="rounded-md border border-red-400 px-3 py-1 text-red-300">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ContactFormsList
