import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import AuthPage from './pages/Auth'
import Admin from './pages/Admin'
import ScrollToTop from './components/ScrollToTop'

export function App() {
  const [route, setRoute] = useState<string>(window.location.hash || '#/')
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '#/')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  if (route.startsWith('#/auth')) return <AuthPage />
  if (route.startsWith('#/admin')) return <Admin />
  return (
    <div className="relative h-screen w-screen overflow-y-auto snap-y snap-mandatory">
      {/* DotGrid moved into Hero so it shows only on the hero section */}
      <Hero />
      <ScrollToTop />
    </div>
  )
}

export default App
