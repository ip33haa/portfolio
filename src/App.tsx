import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import AuthPage from './pages/Auth'
import Admin from './pages/Admin'

export function App() {
  const [route, setRoute] = useState<string>(window.location.hash || '#/')
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '#/')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  if (route.startsWith('#/auth')) return <AuthPage />
  if (route.startsWith('#/admin')) return <Admin />
  return <Hero />
}

export default App
