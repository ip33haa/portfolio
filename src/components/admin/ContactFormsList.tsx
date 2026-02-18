import React, { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '../../lib/api'

const ContactFormsList: React.FC = () => {
  const queryClient = useQueryClient()
  const { data: contactsRaw } = useQuery({ queryKey: ['admin','contacts'], queryFn: () => api.getContactForms() })
  const contacts = contactsRaw ?? []

  const markMut = useMutation({ mutationFn: (id: any) => api.markContactFormAsRead(id), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin','contacts'] }) })
  const delMut = useMutation({ mutationFn: (id: any) => api.deleteContactFormSubmission(id), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin','contacts'] }) })

  const [selectedId, setSelectedId] = useState<string | number | null>(null)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return contacts
    return contacts.filter((c: any) => (c.fullName + ' ' + c.email + ' ' + (c.message || '')).toLowerCase().includes(q))
  }, [contacts, query])

  const selected = contacts.find((c: any) => c.id === selectedId) || filtered[0] || null

  return (
    <div className="inbox-container">
      <div className="inbox-list">
        <div className="inbox-controls">
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search messages" className="search-input" />
          <button onClick={() => queryClient.invalidateQueries({ queryKey: ['admin','contacts'] })} className="refresh-btn">Refresh</button>
        </div>

        <div className="mail-list">
          {filtered.map((c: any) => (
            <div key={c.id} onClick={() => setSelectedId(c.id)} className={`mail-item ${c.id === selectedId ? 'selected' : ''} ${c.isRead ? '' : 'unread'}`}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="dot" />
                  <div className="name">{c.fullName}</div>
                  <div className="meta" style={{ marginLeft: 8 }}>{c.email}</div>
                </div>
                <div className="snippet">{(c.message || '').replace(/<[^>]*>/g, '').slice(0, 160)}</div>
              </div>
              <div className="meta">{new Date(c.createdAt || c.created || Date.now()).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mail-detail">
        {selected ? (
          <div>
            <div className="detail-header">
              <div>
                <div className="subject">{selected.fullName}</div>
                <div className="detail-meta">{selected.email} • {new Date(selected.createdAt || selected.created || Date.now()).toLocaleString()}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {!selected.isRead && <button onClick={() => markMut.mutate(selected.id)} className="action-btn">Mark read</button>}
                <button onClick={() => delMut.mutate(selected.id)} className="action-btn danger">Delete</button>
              </div>
            </div>

            <div className="prose max-w-none text-white/90" dangerouslySetInnerHTML={{ __html: selected.message || '' }} />
          </div>
        ) : (
          <div className="admin-empty">No message selected.</div>
        )}
      </div>
    </div>
  )
}

export default ContactFormsList
