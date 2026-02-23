import { useEffect, useState } from 'react'

export default function SiteNav() {
  const [open, setOpen] = useState(false)

  const handleNavClick = (e: any, id: string) => {
    try {
      if (e && e.preventDefault) e.preventDefault()
      const el = document.getElementById(id)
      console.debug('[Nav] clicked', id, 'el?', !!el)
      if (el) {
        // scroll within the main scroll container if present
        const container = document.querySelector('main') as HTMLElement | null || document.scrollingElement as HTMLElement | null
        const navEl = document.querySelector('.site-nav') as HTMLElement | null
        const navHeight = navEl?.offsetHeight ?? 0
        const elRect = el.getBoundingClientRect()
        const containerRect = container?.getBoundingClientRect()
        let offset = elRect.top - (containerRect?.top ?? 0) - navHeight - 12
        if (container) {
          try {
            container.scrollBy({ top: offset, behavior: 'smooth' })
            history.replaceState(null, '', `#${id}`)
          } catch (e) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
            history.replaceState(null, '', `#${id}`)
          }
        } else {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          history.replaceState(null, '', `#${id}`)
        }
      } else {
        window.location.hash = `#${id}`
      }
    } catch (err) {
      console.error('[Nav] handleNavClick error', err)
      if (e && e.preventDefault) e.preventDefault()
      window.location.hash = `#${id}`
    } finally {
      setOpen(false)
    }
  }

  useEffect(() => {
    const updateScrollMargin = () => {
      const navEl = document.querySelector('.site-nav') as HTMLElement | null
      const navHeight = navEl?.offsetHeight ?? 0
      document.querySelectorAll('section[id]').forEach((s) => {
        (s as HTMLElement).style.scrollMarginTop = `${navHeight + 8}px`
      })
    }

    updateScrollMargin()
    window.addEventListener('resize', updateScrollMargin)
    return () => window.removeEventListener('resize', updateScrollMargin)
  }, [])

  // On mount and when the hash changes, if the hash is a plain fragment (not a route like #/...)
  // attempt to scroll to the matching section ID. This ensures links like `/#about` work.
  useEffect(() => {
    const scrollToHashFragment = () => {
      const h = window.location.hash || ''
      if (!h) return
      if (h.startsWith('#/')) return
      const id = h.replace('#', '')
      if (!id) return
      const el = document.getElementById(id)
      if (!el) return

      const attemptScroll = () => {
        const container = document.querySelector('main') as HTMLElement | null || document.scrollingElement as HTMLElement | null
        const navEl = document.querySelector('.site-nav') as HTMLElement | null
        const navHeight = navEl?.offsetHeight ?? 0
        const elRect = el.getBoundingClientRect()
        const containerRect = container?.getBoundingClientRect()
        if (containerRect && elRect.top === 0) {
          // layout not ready yet; try again shortly
          window.requestAnimationFrame(() => setTimeout(attemptScroll, 50))
          return
        }
        const offset = elRect.top - (containerRect?.top ?? 0) - navHeight - 12
        if (container) {
          container.scrollBy({ top: offset, behavior: 'smooth' })
        } else {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }

      // try after a brief delay to allow heavy assets/layout to settle
      setTimeout(attemptScroll, 80)
    }

    // run once on mount
    scrollToHashFragment()
    window.addEventListener('hashchange', scrollToHashFragment)
    return () => window.removeEventListener('hashchange', scrollToHashFragment)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="mx-auto site-nav grid w-full max-w-6xl grid-cols-[auto_1fr_auto] items-center px-4 py-4">
      <div className="flex items-center gap-3">
        <a href="#home" aria-label="Home" onClick={(e) => handleNavClick(e, 'home')}>
          <img src="/logo-1.gif" alt="John Philip Garcia" className="h-10 w-auto logo-img" loading="eager" />
        </a>
      </div>

      <nav className="hidden md:flex justify-center" aria-label="Primary">
        <ul className="flex items-center gap-10 text-sm font-medium text-white/70">
          <li>
            <a className="transition hover:text-white" href="#home" onClick={(e) => handleNavClick(e, 'home')}>
              Home
            </a>
          </li>
          <li>
            <a className="transition hover:text-white" href="#skills" onClick={(e) => handleNavClick(e, 'skills')}>
              Skills
            </a>
          </li>
          <li>
            <a className="transition hover:text-white" href="#/projects" onClick={(e) => { e.preventDefault(); window.location.hash = '#/projects' }}>
              Projects
            </a>
          </li>
          <li>
            <a className="transition hover:text-white" href="#about" onClick={(e) => handleNavClick(e, 'about')}>
              About
            </a>
          </li>
          <li>
            <a className="transition hover:text-white" href="#/documentation" onClick={(e) => { e.preventDefault(); window.location.hash = '#/documentation' }}>
              Documentation
            </a>
          </li>
        </ul>
      </nav>

      <div className="flex items-center justify-end">
        <div className="hidden md:flex items-center gap-3">
          <a href="#contact" className="hero-primary-btn hero-nav-cta">Contact Me</a>
        </div>

        <button
          className="md:hidden ml-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/3 text-white/80 relative z-[100]"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 7H20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M4 12H20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M4 17H20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        {open && (
          <div className="mobile-menu fixed z-11 inset-0 flex items-start justify-center px-6 py-20">
            <div className="mobile-menu-panel w-full max-w-md rounded-xl bg-[rgba(10,16,51,0.92)] p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <img src="/logo-1.gif" alt="John Philip Garcia logo" className="h-9 w-auto logo-img" loading="eager" />
                <button className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/3 text-white/80" onClick={() => setOpen(false)} aria-label="Close menu">✕</button>
              </div>
              <nav className="mt-6">
                <ul className="flex flex-col gap-4 text-lg font-medium text-white">
                  <li><a href="#home" onClick={(e) => handleNavClick(e, 'home')}>Home</a></li>
                  <li><a href="#/projects" onClick={(e) => { e.preventDefault(); window.location.hash = '#/projects' }}>Projects</a></li>
                  <li><a href="#skills" onClick={(e) => handleNavClick(e, 'skills')}>Skills</a></li>
                  <li><a href="#about" onClick={(e) => handleNavClick(e, 'about')}>About</a></li>
                  <li><a href="#/documentation" onClick={(e) => { e.preventDefault(); window.location.hash = '#/documentation' }}>Documentation</a></li>
                </ul>
                <div className="mt-6"><div><a href="#contact" onClick={() => setOpen(false)} className="hero-primary-btn w-full">Contact Me</a></div></div>
              </nav>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  )
}
