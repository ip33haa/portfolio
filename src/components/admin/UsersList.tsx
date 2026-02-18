import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '../../lib/api'

const UsersList: React.FC = () => {
  const qc = useQueryClient()
  const { data: usersRaw } = useQuery({ queryKey: ['admin','users'], queryFn: () => api.getUsers() })
  const users = usersRaw ?? []

  const createMut = useMutation({ mutationFn: (payload: any) => api.createUser(payload), onSuccess: () => qc.invalidateQueries({ queryKey: ['admin','users'] }) })
  const updateMut = useMutation({ mutationFn: ({ id, payload }: any) => api.updateUser(id, payload), onSuccess: () => qc.invalidateQueries({ queryKey: ['admin','users'] }) })
  const deleteMut = useMutation({ mutationFn: (id: any) => api.deleteUser(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['admin','users'] }) })

  const [editing, setEditing] = useState<any | null>(null)
  const [creating, setCreating] = useState(false)

  const handleSave = async (payload: any) => {
    if (payload.id) await updateMut.mutateAsync({ id: payload.id, payload })
    else await createMut.mutateAsync(payload)
    setEditing(null)
    setCreating(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
      <div className="bg-white/3 rounded p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium">Users</h3>
          <div>
            <button onClick={() => { setCreating(true); setEditing({}) }} className="hero-primary-btn">New User</button>
          </div>
        </div>

        <div className="space-y-2">
          {users.map((u: any) => (
            <div key={u.id} className="user-item p-3 rounded bg-white/2 flex items-center justify-between">
              <div>
                <div className="font-semibold">{u.email}</div>
                <div className="text-sm text-white/70">{u.name ?? u.displayName ?? ''}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setEditing(u)} className="action-btn">Edit</button>
                <button onClick={() => deleteMut.mutate(u.id)} className="action-btn danger">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mail-detail p-3">
        {(editing || creating) ? (
          <UserEditor user={editing} onSave={handleSave} onClose={() => { setEditing(null); setCreating(false) }} />
        ) : (
          <div className="text-white/70">Select a user to edit or create a new one.</div>
        )}
      </div>
    </div>
  )
}

function UserEditor({ user, onSave, onClose }: any) {
  const [email, setEmail] = useState(user?.email ?? '')
  const [name, setName] = useState(user?.name ?? '')
  const [isAdmin, setIsAdmin] = useState(!!user?.roles?.includes?.('Admin'))

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ id: user?.id, email, name, roles: isAdmin ? ['Admin'] : [] }) }} className="grid gap-3">
      <div>
        <label className="block text-xs text-white/80">Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} className="w-full mt-1 p-2 rounded bg-white/5 text-white" required />
      </div>
      <div>
        <label className="block text-xs text-white/80">Name</label>
        <input value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 p-2 rounded bg-white/5 text-white" />
      </div>
      <div className="flex items-center gap-2">
        <input id="isAdmin" type="checkbox" checked={isAdmin} onChange={e => setIsAdmin(e.target.checked)} />
        <label htmlFor="isAdmin" className="text-sm text-white/80">Admin</label>
      </div>
      <div className="flex items-center gap-2 justify-end">
        <button type="button" onClick={onClose} className="rounded-md border border-white/10 px-3 py-1">Cancel</button>
        <button type="submit" className="hero-primary-btn">Save</button>
      </div>
    </form>
  )
}

export default UsersList
