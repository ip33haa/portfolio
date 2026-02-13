import React, { createContext, useContext, useEffect, useState } from 'react'
import * as api from './api'

type AuthState = { accessToken?: string; expiresAt?: number } | null

const AuthContext = createContext<{
  auth: AuthState
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
} | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const a = api.getAuth()
    return a ? { accessToken: a.accessToken, expiresAt: a.expiresAt } : null
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const a = api.getAuth()
      setAuth(a ? { accessToken: a.accessToken, expiresAt: a.expiresAt } : null)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const login = async (email: string, password: string) => {
    const data = await api.login(email, password)
    setAuth({ accessToken: data.accessToken, expiresAt: data.expiresAt })
  }

  const register = async (email: string, password: string) => {
    const data = await api.register(email, password)
    setAuth({ accessToken: data.accessToken, expiresAt: data.expiresAt })
  }

  const logout = async () => {
    await api.logout()
    setAuth(null)
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout, register } as any}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
