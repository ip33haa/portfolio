import React, { createContext, useContext, useEffect, useState } from 'react'
import * as api from './api'

type AuthState = { accessToken?: string; expiresAt?: number } | null

const AuthContext = createContext<{
  auth: AuthState
  role?: string | null
  isAdmin: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
} | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const a = api.getAuth()
    return a ? { accessToken: a.accessToken, expiresAt: a.expiresAt } : null
  })

  const [role, setRole] = useState<string | null>(() => {
    try {
      const a = api.getAuth()
      if (a?.accessToken) {
        const parts = a.accessToken.split('.')
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
          return payload?.role ?? payload?.Role ?? null
        }
      }
    } catch {
      // ignore
    }
    return null
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const a = api.getAuth()
      setAuth(a ? { accessToken: a.accessToken, expiresAt: a.expiresAt } : null)
      try {
        if (a?.accessToken) {
          const parts = a.accessToken.split('.')
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
            setRole(payload?.role ?? payload?.Role ?? null)
          } else {
            setRole(null)
          }
        } else {
          setRole(null)
        }
      } catch {
        setRole(null)
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const login = async (email: string, password: string) => {
    const data = await api.login(email, password)
    setAuth({ accessToken: data.accessToken, expiresAt: data.expiresAt })
    try {
      if (data?.accessToken) {
        const parts = data.accessToken.split('.')
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
          setRole(payload?.role ?? payload?.Role ?? null)
        }
      }
    } catch {
      setRole(null)
    }
  }

  const register = async (email: string, password: string) => {
    const data = await api.register(email, password)
    setAuth({ accessToken: data.accessToken, expiresAt: data.expiresAt })
    try {
      if (data?.accessToken) {
        const parts = data.accessToken.split('.')
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
          setRole(payload?.role ?? payload?.Role ?? null)
        }
      }
    } catch {
      setRole(null)
    }
  }

  const logout = async () => {
    await api.logout()
    setAuth(null)
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ auth, role, isAdmin: role === 'Admin', login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
