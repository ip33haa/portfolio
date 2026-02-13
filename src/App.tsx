import React, { useEffect, useState } from 'react'
import Hero from './components/Hero'
import AuthPage from './pages/Auth'

export function App() {
  const [route, setRoute] = useState<string>(window.location.hash || '#/')
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '#/')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  if (route.startsWith('#/auth')) return <AuthPage />
  return <Hero />
}

export default App
