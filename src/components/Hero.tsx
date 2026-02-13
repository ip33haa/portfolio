import React, { useState } from 'react'
import DotGrid from './DotGrid'
import ProfileCard from './ProfileCard'
import * as api from '../lib/api'
import { useQuery } from '@tanstack/react-query'
import Login from './Login'

export function Hero() {
  const [showLogin, setShowLogin] = useState(false)

  const { data: aboutRaw } = useQuery(['about'], () => api.getAbout(), { staleTime: 1000 * 60 * 5, retry: 1 })
  const { data: projectsRaw } = useQuery(['projects'], () => api.getProjects(), { staleTime: 1000 * 60 * 2, retry: 1 })

  const about = aboutRaw?.data ?? aboutRaw
  const projects = (projectsRaw?.data ?? projectsRaw) || []

  return (
    <section className="hero-shell relative overflow-hidden">
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />

      {/* DotGrid background */}
      <div className="absolute inset-0 z-0 opacity-95">
        <DotGrid
          dotSize={6}
          gap={20}
          baseColor="#0a0f1f"
          activeColor="#22d3ee"
          proximity={140}
          shockRadius={200}
          shockStrength={6}
          resistance={600}
          returnDuration={1.5}
          className="h-full w-full"
        />
      </div>

      <header className="relative z-10">
        <Nav onSignIn={() => setShowLogin(true)} />
      </header>

      <div className="mx-auto flex min-h-[86vh] w-full max-w-6xl items-center px-6 pb-16 pt-8 lg:pt-12">
        <div className="grid w-full gap-12 lg:grid-cols-2 lg:items-center">

          {/* Left: textual placeholders (role, name, copy, CTAs) */}
          <div className="hero-fade space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white/70">
              <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
              Placeholder Role
            </div>
            <h1 className="font-display text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              Placeholder Name
            </h1>
            <p className="max-w-xl text-base text-white/70 sm:text-lg">
              Placeholder headline about building clean and scalable systems. Replace with final copy when ready.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="hero-primary-btn">View Projects</button>
              <button className="hero-secondary-btn">Contact Me</button>
            </div>
            <div className="text-xs uppercase tracking-[0.3em] text-white/40">
              Available for select collaborations
            </div>
          </div>

          {/* Right: Spline placeholder (will embed Spline scene here later) */}
          <div className="hero-fade flex items-center justify-center">
            <div className="hero-spline-frame w-full max-w-md">
              <div className="spline-placeholder flex h-72 w-full items-center justify-center rounded-[18px]">
                <div className="text-center text-sm text-white/60">
                  3D Spline placeholder
                  <div className="mt-2 text-xs text-white/40">Embed Spline scene here</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile panel */}
      <section id="projects" className="relative z-10 bg-transparent">
        <div className="mx-auto w-full max-w-6xl px-6 py-20">
          <div className="mb-8 text-center">
            <h2 className="font-display text-3xl font-semibold text-white">Profile</h2>
            <p className="mt-2 text-sm text-white/70">A quick profile preview — details on the right.</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 items-start">
            <div
              className="flex justify-center lg:justify-start"
              style={{
                // apply provided icon overlay CSS variables so ProfileCard picks them up
                '--icon': 'url(/logo-overlay.png)',
                '--grain': 'url(/logo-overlay.png)',
                '--inner-gradient': 'linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)',
                '--behind-glow-color': 'rgba(125, 190, 255, 0.67)',
                '--behind-glow-size': '50%',
                '--pointer-x': '50.00918879070229%',
                '--pointer-y': '50.000372784121886%',
                '--background-x': '50.003%',
                '--background-y': '50%',
                '--pointer-from-center': '0.00018392698831004706',
                '--pointer-from-top': '0.5000037278412188',
                '--pointer-from-left': '0.5000918879070229',
                '--rotate-x': '-0.002deg',
                '--rotate-y': '0deg'
              } as React.CSSProperties}
            >
              <ProfileCard
                name={about?.name ?? 'John Philip Garcia'}
                title={about?.title ?? 'Full Stack Developer'}
                handle={about?.handle ?? 'ip33haa'}
                status={about?.status ?? 'Online'}
                contactText="Contact Me"
                avatarUrl={about?.avatarUrl ?? '/Media.jpg'}
                showUserInfo
                enableTilt={true}
                enableMobileTilt
                onContactClick={() => console.log('Contact clicked')}
                showIcon
                showBehindGlow
                behindGlowColor={about?.behindGlowColor ?? 'rgba(125, 190, 255, 0.67)'}
                innerGradient={about?.innerGradient ?? 'linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)'}
              />
            </div>

            <div className="prose max-w-xl text-white/80">
              {projects && projects.length > 0 ? (
                <div>
                  <h3 className="text-xl font-semibold">Projects</h3>
                  <div className="mt-4 grid gap-4">
                    {projects.map((p: any) => (
                      <article key={p.id || p.title} className="rounded-lg border border-white/8 bg-white/2 p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-semibold text-white">{p.title}</h4>
                            <p className="mt-1 text-sm text-white/70">{p.description}</p>
                            {p.stack && <div className="mt-2 text-xs text-white/60">Stack: {p.stack}</div>}
                          </div>
                          {p.url && (
                            <div className="flex-shrink-0">
                              <a href={p.url} target="_blank" rel="noreferrer" className="text-cyan-300 hover:underline">
                                View
                              </a>
                            </div>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-semibold">About</h3>
                  <p>
                    I am a .NET Developer with over two years of experience building web applications and APIs using
                    ASP.NET Core, C#, and SQL Server. I develop scalable backend systems that support real business
                    operations and build REST APIs for frontend integration.
                  </p>
                  <h4 className="mt-4 font-semibold">Contact</h4>
                  <p className="text-sm">Mobile: 09272602231 • Email: johnphilip.garcia27@gmail.com</p>
                  <h4 className="mt-4 font-semibold">Top Skills</h4>
                  <ul className="list-inside list-disc text-sm">
                    <li>API Development</li>
                    <li>ASP.NET Core / C#</li>
                    <li>SQL Server</li>
                    <li>React / Vite</li>
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </section>
  )
}

export default Hero

function Nav({ onSignIn }: { onSignIn?: () => void }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mx-auto site-nav grid w-full max-w-6xl grid-cols-[auto_1fr_auto] items-center px-4 py-4">
      <div className="flex items-center gap-3">
        <a href="#home" aria-label="Home">
          <img src="/logo-1.gif" alt="John Philip Garcia" className="h-10 w-auto logo-img" />
        </a>
      </div>

      <nav className="hidden md:flex justify-center" aria-label="Primary">
        <ul className="flex items-center gap-10 text-sm font-medium text-white/70">
          <li>
            <a className="transition hover:text-white" href="#home">
              Home
            </a>
          </li>
          <li>
            <a className="transition hover:text-white" href="#projects">
              Projects
            </a>
          </li>
          <li>
            <a className="transition hover:text-white" href="#skills">
              Skills
            </a>
          </li>
          <li>
            <a className="transition hover:text-white" href="#about">
              About
            </a>
          </li>
        </ul>
      </nav>

      <div className="flex items-center justify-end">
        {/* Contact CTA visible on md+ */}
        <div className="hidden md:flex items-center gap-3">
          <a href="#contact">
            <button className="hero-primary-btn hero-nav-cta">Contact Me</button>
          </a>
          <button onClick={() => onSignIn?.()} className="rounded-md border border-white/10 px-3 py-2 text-sm text-white/90">Sign In</button>
        </div>

        {/* Hamburger for small screens */}
        <button
          className="md:hidden ml-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/3 text-white/80"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 7H20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M4 12H20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M4 17H20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        {/* Mobile menu overlay */}
        {open && (
          <div className="mobile-menu fixed inset-0 z-50 flex items-start justify-center px-6 py-20">
            <div className="mobile-menu-panel w-full max-w-md rounded-xl bg-[rgba(10,16,51,0.92)] p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <img src="/logo-1.gif" alt="logo" className="h-9 w-auto logo-img" />
                <button
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/3 text-white/80"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu">
                  ✕
                </button>
              </div>
              <nav className="mt-6">
                <ul className="flex flex-col gap-4 text-lg font-medium text-white">
                  <li>
                    <a href="#home" onClick={() => setOpen(false)}>
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="#projects" onClick={() => setOpen(false)}>
                      Projects
                    </a>
                  </li>
                  <li>
                    <a href="#skills" onClick={() => setOpen(false)}>
                      Skills
                    </a>
                  </li>
                  <li>
                    <a href="#about" onClick={() => setOpen(false)}>
                      About
                    </a>
                  </li>
                </ul>
                <div className="mt-6">
                  <a href="#contact">
                    <button className="hero-primary-btn w-full">Contact Me</button>
                  </a>
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
