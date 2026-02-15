import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../lib/useAuth'
import * as api from '../lib/api'

const Register: React.FC<{ onClose?: () => void; inline?: boolean; onSwitch?: () => void; focusKey?: number }> = ({ onClose, inline = false, onSwitch, focusKey }) => {
  const { register } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await register(email, password)
      onClose?.()
      // determine role from saved token and redirect accordingly
      try {
        const token = api.getAuth()?.accessToken
        if (token) {
          const parts = token.split('.')
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
            const role = payload?.role ?? payload?.Role ?? null
            window.location.hash = role === 'Admin' ? '#/admin' : '#/'
          } else {
            window.location.hash = '#/'
          }
        } else {
          window.location.hash = '#/'
        }
      } catch {
        try { window.location.hash = '#/' } catch { /* no-op */ }
      }
    } catch (err: any) {
      const msg = err?.message ?? (typeof err === 'string' ? err : err?.body?.message ?? (err?.errors ? JSON.stringify(err.errors) : null))
      setError(msg || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (inline) {
      const t = setTimeout(() => emailRef.current?.focus(), 120)
      return () => clearTimeout(t)
    }
  }, [focusKey, inline])

  const formClass = inline
    ? 'w-full'
    : 'w-full max-w-sm rounded-xl bg-[rgba(10,16,51,0.95)] p-6 shadow-2xl'

  return (
    <div className={inline ? undefined : "fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4"}>
      <form onSubmit={submit} className={formClass}>
        <h3 className="mb-4 text-lg font-semibold text-white">Create account</h3>
        <label className="block text-sm text-white/80">Email</label>
        <input aria-label="Email" ref={emailRef} value={email} onChange={e => setEmail(e.target.value)} className="mt-1 mb-3 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-white" />
        <label className="block text-sm text-white/80">Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 mb-3 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-white" />
        <label className="block text-sm text-white/80">Confirm Password</label>
        <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} className="mt-1 mb-4 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-white" />
        {error && <div className="mb-2 text-sm text-red-400">{error}</div>}
        <div className="flex items-center justify-between">
          <button disabled={loading} type="submit" className="hero-primary-btn">{loading ? 'Creating...' : 'Create account'}</button>
          {!inline && <button type="button" onClick={onClose} className="ml-3 rounded-md border border-white/10 px-3 py-2 text-white/80">Cancel</button>}
        </div>
        {inline && (
          <div className="mt-4 text-sm text-white/60">
            <span>Already have an account? </span>
            <button type="button" onClick={onSwitch} className="ml-1 font-medium text-cyan-300 hover:underline">Sign in</button>
          </div>
        )}
      </form>
    </div>
  )
}

export default Register
