import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import SiteNav from './components/SiteNav'
import GlobalFooter from './components/GlobalFooter'
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

  const isAuthRoute = route.startsWith('#/auth')
  const isAdminRoute = route.startsWith('#/admin')
  const isProjectsRoute = route.startsWith('#/projects')
  const isDocumentationRoute = route.startsWith('#/documentation')
  const isLandingRoute = !isAuthRoute && !isAdminRoute && !isProjectsRoute && !isDocumentationRoute
  const shouldShowTopNav = !isAuthRoute && !isAdminRoute

  return (
    <main
      className={`relative h-screen w-screen overflow-y-auto ${isLandingRoute ? 'snap-y snap-mandatory' : ''}`}
      role="main"
    >
      <Seo />
      {shouldShowTopNav && <SiteNav />}
      {isAuthRoute ? (
        <AuthPage />
      ) : isAdminRoute ? (
        <Admin />
      ) : isProjectsRoute ? (
        <Projects />
      ) : isDocumentationRoute ? (
        <Documentation />
      ) : (
        <Hero />
      )}
      <GlobalFooter snap={isLandingRoute} />
      <ScrollToTop />
    </main>
  )
}

export default App
