import React, { useState } from 'react'
import { useAuth } from '../lib/useAuth'

const Login: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      onClose?.()
    } catch (err: any) {
      setError(err?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-xl bg-[rgba(10,16,51,0.95)] p-6 shadow-2xl">
        <h3 className="mb-4 text-lg font-semibold text-white">Sign in</h3>
        <label className="block text-sm text-white/80">Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} className="mt-1 mb-3 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-white" />
        <label className="block text-sm text-white/80">Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 mb-4 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-white" />
        {error && <div className="mb-2 text-sm text-red-400">{error}</div>}
        <div className="flex items-center justify-between">
          <button disabled={loading} type="submit" className="hero-primary-btn">{loading ? 'Signing in...' : 'Sign in'}</button>
          <button type="button" onClick={onClose} className="ml-3 rounded-md border border-white/10 px-3 py-2 text-white/80">Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default Login
