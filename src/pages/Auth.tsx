import React, { useState, useEffect } from 'react'
import Login from '../components/Login'
import Register from '../components/Register'
import SplashCursor from '../components/SplashCursor'

function useHashMode() {
  const getMode = () => {
    try {
      const hash = window.location.hash || ''
      if (!hash.startsWith('#/auth')) return null
      const qs = new URLSearchParams(hash.replace('#/auth', ''))
      return qs.get('mode') || 'login'
    } catch {
      return 'login'
    }
  }
  const [mode, setMode] = useState<string | null>(getMode())
  useEffect(() => {
    const h = () => setMode(getMode())
    window.addEventListener('hashchange', h)
    return () => window.removeEventListener('hashchange', h)
  }, [])
  return { mode, setMode }
}

const AuthPage: React.FC = () => {
  const { mode, setMode } = useHashMode()
  const active = mode || 'login'
  const [focusKey, setFocusKey] = useState(0)

  useEffect(() => {
    // bump focusKey whenever active mode changes to signal forms to autofocus
    setFocusKey(k => k + 1)
  }, [active])

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_#07102a,_#02040a)]">
      <SplashCursor />
      <header className="fixed inset-x-0 top-0 z-30 bg-transparent">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#/" className="flex items-center gap-3" aria-label="Home">
            <img src="/logo-1.gif" alt="logo" className="h-10 w-auto" />
          </a>
          <div />
        </div>
      </header>

      <main className="pt-20">
        <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl grid-cols-1 gap-6 px-4 py-8 md:grid-cols-2">
          {/* Left: form */}
          <div className="flex items-center">
            <div className="w-full max-w-md">
              <h1 className="mb-2 text-3xl font-semibold text-white">{active === 'login' ? 'Welcome back' : 'Create your account'}</h1>
              <p className="mb-6 text-sm text-white/70">{active === 'login' ? 'Sign in to access your dashboard.' : 'Register to create an account.'}</p>

              <div className="rounded-xl bg-[rgba(10,16,51,0.95)] p-6 shadow-2xl relative overflow-hidden" style={{ minHeight: 450 }}>
                <div className={`absolute inset-0 transition-all duration-500 ${active === 'login' ? 'opacity-100 translate-x-0 z-20' : 'opacity-0 -translate-x-6 z-10 pointer-events-none'}`}>
                  <div className="h-full w-full p-6">
                  <Login inline onSwitch={() => { window.location.hash = '#/auth?mode=register'; setMode('register') }} focusKey={focusKey} />
                  </div>
                </div>
                <div className={`absolute inset-0 transition-all duration-500 ${active === 'register' ? 'opacity-100 translate-x-0 z-20' : 'opacity-0 translate-x-6 z-10 pointer-events-none'}`}>
                  <div className="h-full w-full p-6">
                    <Register inline onSwitch={() => { window.location.hash = '#/auth?mode=login'; setMode('login') }} focusKey={focusKey} />
                  </div>
                </div>
              </div>

              <div className="mt-4 text-sm text-white/60">
                <a href="#/" className="text-cyan-300 hover:underline">Return to homepage</a>
              </div>
            </div>
          </div>

          {/* Right: spline placeholder */}
          <div className="order-first md:order-last flex items-center justify-center">
            <div className="w-full max-w-3xl">
              <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#07102a] to-[#02040a] p-6 shadow-inner md:h-[720px] md:p-10">
                <div className="spline-placeholder flex h-full w-full items-center justify-center rounded-lg">
                  <div className="text-center">
                    <div className="mb-3 text-2xl font-semibold text-white/80">3D Scene Placeholder</div>
                    <div className="text-sm text-white/60">Spline scene will be embedded here. Interactive 3D viewport goes to the right on large screens.</div>
                  </div>
                </div>
                <div className="absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-[rgba(34,211,238,0.06)] blur-3xl md:-right-32 md:-bottom-32" aria-hidden />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AuthPage
