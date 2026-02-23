import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import SiteNav from './components/SiteNav'
import Seo from './lib/Seo'
import AuthPage from './pages/Auth'
import Admin from './pages/Admin'
import Projects from './pages/Projects'
import Documentation from './pages/Documentation'
import ScrollToTop from './components/ScrollToTop'

export function App() {
  const [route, setRoute] = useState<string>(window.location.hash || '#/')
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '#/')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return (
    <main className="relative h-screen w-screen overflow-y-auto snap-y snap-mandatory" role="main">
      <Seo />
      <SiteNav />
      {/* Render route-specific content, SiteNav visible on all pages */}
      {route.startsWith('#/auth') ? <AuthPage /> : route.startsWith('#/admin') ? <Admin /> : route.startsWith('#/projects') ? <Projects /> : route.startsWith('#/documentation') ? <Documentation /> : <Hero />}
      <ScrollToTop />
    </main>
  )
}

export default App
