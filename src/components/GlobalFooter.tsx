import type { MouseEvent } from 'react'

type Props = {
  snap?: boolean
}

export default function GlobalFooter({ snap = false }: Props) {
  const year = new Date().getFullYear()

  const sectionLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Skills', href: '#skills' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ]

  const pageLinks = [
    { label: 'Projects', href: '#/projects' },
    { label: 'Documentation', href: '#/documentation' }
  ]

  const scrollToSection = (id: string) => {
    const performScroll = () => {
      const target = document.getElementById(id)
      const container = document.querySelector('main') as HTMLElement | null

      if (!target || !container) return false

      const navEl = document.querySelector('.site-nav') as HTMLElement | null
      const navHeight = navEl?.offsetHeight ?? 0
      const containerRect = container.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()
      const scrollTop = container.scrollTop + (targetRect.top - containerRect.top) - navHeight - 12

      container.scrollTo({ top: Math.max(scrollTop, 0), behavior: 'smooth' })
      history.replaceState(null, '', `#${id}`)
      return true
    }

    if (performScroll()) return

    window.location.hash = `#${id}`

    let attempts = 0
    const timer = window.setInterval(() => {
      attempts += 1
      if (performScroll() || attempts > 20) window.clearInterval(timer)
    }, 80)
  }

  const handleSectionLinkClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault()
    const id = href.replace('#', '').trim()
    if (!id) return
    scrollToSection(id)
  }

  return (
    <footer
      className={`relative z-20 border-t border-white/10 bg-[rgba(2,6,23,0.9)] backdrop-blur-md ${snap ? 'snap-start' : ''}`}
      aria-label="Global footer"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="grid gap-8 border-b border-white/10 pb-8 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-4">
            <a href="#/" className="inline-flex items-center gap-3" aria-label="Homepage">
              <img src="/logo-1.gif" alt="John Philip Garcia" className="h-11 w-auto logo-img" loading="lazy" />
            </a>
            <p className="max-w-sm text-sm leading-relaxed text-white/65">
              Portfolio, projects, and admin workspace for delivering modern web experiences with clean architecture and polished UI.
            </p>
            <a
              href="#contact"
              onClick={(event) => handleSectionLinkClick(event, '#contact')}
              className="inline-flex text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
            >
              Start a conversation →
            </a>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/85">Sections</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              {sectionLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={(event) => handleSectionLinkClick(event, item.href)}
                    className="transition hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/85">Resources</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              {pageLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="transition hover:text-white">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/85">Contact</h3>
            <div className="space-y-2 text-sm text-white/70">
              <a href="mailto:johnphilip.garcia27@gmail.com" className="block transition hover:text-white">
                johnphilip.garcia27@gmail.com
              </a>
              <p>Open to collaborations, freelance projects, and full-time opportunities.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                const container = document.querySelector('main') as HTMLElement | null
                if (!container) return
                container.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="inline-flex text-sm font-medium text-white/75 transition hover:text-white"
            >
              Back to top ↑
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} John Philip Garcia. All rights reserved.</p>
          <p>Built with React, TypeScript, and .NET API services.</p>
        </div>
      </div>
    </footer>
  )
}
