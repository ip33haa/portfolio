import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Spline from '@splinetool/react-spline'
import TextType from './TextType'
import ChromaGrid from './ChromaGrid'
import DotGrid from './DotGrid'
import SkillsSection from './SkillsSection'
import AboutSection from './AboutSection'
import ContactSection from './ContactSection'
import * as api from '../lib/api'
import { useQuery } from '@tanstack/react-query'
import Login from './Login'
import Register from './Register'

export function Hero() {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const splineAppRef = useRef<any>(null)
  const audioRef = useRef<Record<string, HTMLAudioElement | undefined>>({})
  const switchesRef = useRef<HTMLDivElement | null>(null)
  const [soundSet, setSoundSet] = useState<string>('turquoise')
  // soundSets and colors are implicit in the switches images list

  const { data: projectsRaw } = useQuery({ queryKey: ['projects'], queryFn: () => api.getProjects(), staleTime: 1000 * 60 * 2, retry: 1 })

  const scrollToContact = () => {
    const el = document.getElementById('contact')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }
  const projects = (projectsRaw?.data ?? projectsRaw) || []

  useEffect(() => {
    // choose a sound set (turquoise folder exists in public)
    const base = `/keyboard-sounds/${soundSet}`
    const pressMap: Record<string,string> = {
      ENTER: `${base}/press/ENTER.mp3`,
      BACKSPACE: `${base}/press/BACKSPACE.mp3`,
      SPACE: `${base}/press/SPACE.mp3`
    }
    // prepare multiple GENERIC variants for realism (GENERIC_R0..R4)
    const genericVariants = [0,1,2,3,4].map(i => `${base}/press/GENERIC_R${i}.mp3`)

    const releaseMap: Record<string,string> = {
      GENERIC: `${base}/release/GENERIC.mp3`,
      ENTER: `${base}/release/ENTER.mp3`,
      BACKSPACE: `${base}/release/BACKSPACE.mp3`,
      SPACE: `${base}/release/SPACE.mp3`
    }

    const audioStore: Record<string, HTMLAudioElement> = {}
    // preload press variants + other sounds
    Object.values({...pressMap, ...releaseMap}).forEach((src) => {
      try {
        const a = new Audio(src)
        a.preload = 'auto'
        audioStore[src] = a
      } catch (e) {}
    })
    // preload GENERIC variants
    genericVariants.forEach((src) => {
      try {
        const a = new Audio(src)
        a.preload = 'auto'
        audioStore[src] = a
      } catch (e) {}
    })
    audioRef.current = audioStore

    const play = (kind: 'press' | 'release', keyName: string) => {
      const mapKey = ['ENTER','BACKSPACE','SPACE'].includes(keyName) ? keyName : 'GENERIC'
      if (kind === 'press' && mapKey === 'GENERIC') {
        // pick a random GENERIC variant for realism
        const candidate = genericVariants[Math.floor(Math.random() * genericVariants.length)]
        const a = audioRef.current[candidate]
        if (a) {
          try { a.currentTime = 0 } catch (e) {}
          a.play().catch(() => {})
          return
        }
      }

      const src = (kind === 'press' ? pressMap : releaseMap)[mapKey] ?? (kind === 'press' ? genericVariants[0] : releaseMap.GENERIC)
      const a = audioRef.current[src]
      if (a) {
        try { a.currentTime = 0 } catch (e) {}
        a.play().catch(() => {})
      }
    }

    const tryAnimate = (keyRaw: string) => {
      const app = splineAppRef.current || (window as any).__splineApp
      if (!app) return
      const key = keyRaw === ' ' ? 'SPACE' : keyRaw.toUpperCase()
      const tryNames = [key, `KEY_${key}`, `Key ${key}`, key.replace(' ', '')]
      try {
        if (typeof app.emitEvent === 'function') {
          for (const name of tryNames) {
            try { app.emitEvent(name, 'onPointerDown'); break } catch (e) {}
          }
          return
        }

        const findObj = (n: string) => app.findOne?.(n) || app.scene?.getObjectByName?.(n) || app.scene?.find?.((o: any) => o.name === n)
        for (const name of tryNames) {
          const obj = findObj(name)
          if (obj) {
            const target = obj.scale ?? obj.position
            gsap.fromTo(target, { y: (target.y ?? 0) }, { y: (target.y ?? 0) - 0.06, duration: 0.08, yoyo: true, repeat: 1 })
            break
          }
        }
      } catch (e) {}
    }

    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key === ' ' ? 'SPACE' : (e.key === 'Enter' ? 'ENTER' : (e.key === 'Backspace' ? 'BACKSPACE' : 'GENERIC'))
      play('press', k)
      tryAnimate(k === 'GENERIC' ? e.key : k)
    }
    const onKeyUp = (e: KeyboardEvent) => {
      const k = e.key === ' ' ? 'SPACE' : (e.key === 'Enter' ? 'ENTER' : (e.key === 'Backspace' ? 'BACKSPACE' : 'GENERIC'))
      play('release', k)
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [soundSet])

  const scrollSwitches = (delta = 200) => {
    const el = switchesRef.current
    if (!el) return
    el.scrollBy({ left: delta, behavior: 'smooth' })
  }

  return (
    <>
      <section className="hero-shell h-screen snap-start">
      <div className="hero-stage relative overflow-hidden h-screen">
        {/* DotGrid - overlay scoped to the hero stage */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <DotGrid
            dotSize={5}
            gap={15}
            baseColor="#271E37"
            activeColor="#5227FF"
            proximity={120}
            shockRadius={250}
            shockStrength={5}
            resistance={750}
            returnDuration={1.5}
          />
        </div>

            <div className="absolute inset-0 z-[1] pointer-events-none">
          <Spline
            scene="https://prod.spline.design/UxCl2VYZxAvj0Pol/scene.splinecode"
            className="h-full w-full"
            style={{ background: 'transparent' }}
            onLoad={(splineApp: any) => {
              // store spline instance for animations and in ref
              ;(window as any).__splineApp = splineApp
              splineAppRef.current = splineApp
            }}
          />
        </div>

        {/* removed hero-veil and hero-vignette per request */}
        <div className="hero-grain" aria-hidden="true" />

        {/* Bottom-aligned switches selector with scroll buttons (large screens) */}
        <div className="absolute left-0 right-0 bottom-6 z-30 flex justify-center px-6">
          <div className="flex items-center gap-3">
            <button
              aria-label="Scroll left"
              onClick={() => scrollSwitches(-220)}
              className="h-10 w-10 rounded-full bg-white/5 text-white/80 flex items-center justify-center hover:bg-white/10 transition"
            >
              ‹
            </button>

            <div ref={switchesRef} className="flex gap-3 overflow-x-auto items-center no-scrollbar max-w-[520px] px-1">
              {[
                'alpaca.webp',
                'black-ink.webp',
                'blue-alps.webp',
                'cream.webp',
                'holy_panda.webp',
                'mx-black.webp',
                'mx-blue.webp',
                'mx-brown.png',
                'red-ink.webp',
                'turquoise.webp'
              ].map((name) => {
                const key = name.split('.')[0].replace(/[-_]/g, '')
                const isSelected = soundSet === key
                return (
                  <button
                    key={name}
                    onClick={() => setSoundSet(key)}
                    className={`flex-shrink-0 overflow-hidden rounded-lg p-2 transition-transform duration-150 ${isSelected ? 'ring-4 ring-white/40 scale-105' : 'ring-1 ring-white/10'}`}
                    style={{ background: 'rgba(255,255,255,0.02)' }}
                    title={key}
                  >
                    <img src={`/switches/${name}`} alt={name.replace(/[-_\.]/g, ' ')} className="h-20 w-auto object-contain" loading="lazy" />
                  </button>
                )
              })}
            </div>

            <button
              aria-label="Scroll right"
              onClick={() => scrollSwitches(220)}
              className="h-10 w-10 rounded-full bg-white/5 text-white/80 flex items-center justify-center hover:bg-white/10 transition"
            >
              ›
            </button>
          </div>
        </div>

        <header className="relative z-10">
          <Nav onSignIn={scrollToContact} />
        </header>

        <div className="relative z-9 mx-auto flex h-full w-full max-w-6xl items-center px-6 py-12 lg:py-16">
          <div className="grid w-full gap-12 lg:grid-cols-2 lg:items-center">

            {/* Left: textual placeholders (role, name, copy, CTAs) */}
            <div className="hero-fade hero-text space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white/70">
                <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                .NET Developer
              </div>
              <h1 className="hero-title font-display text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                <TextType
                  as="span"
                  text={["Let's build something amazing", "for your websites", "Let's Connect!"]}
                  typingSpeed={75}
                  pauseDuration={1500}
                  showCursor
                  cursorCharacter="_"
                  deletingSpeed={50}
                  cursorBlinkDuration={0.5}
                />
              </h1>
              <p className="hero-subtitle max-w-xl text-base text-white/70 sm:text-lg">
                Use headphones for realistic key sounds. Start typing on the interactive 3D keyboard for the full experience.
              </p>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => { window.location.hash = '#projects' }} className="hero-primary-btn">View Projects</button>
                <button onClick={scrollToContact} className="hero-secondary-btn">Contact Me</button>
              </div>
                <div className="text-xs uppercase tracking-[0.3em] text-white/40">
                  Available for select collaborations
                </div>

                {/* sound-set buttons removed here; images on right act as selectors */}
              </div>

            {/* switches row moved to bottom-aligned overlay for better placement on hero */}
            </div>
          </div>
        </div>
        </section>

      {/* Skills section placed directly below the hero stage */}
      <section id="skills" className="relative z-10 min-h-screen snap-start flex items-center">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 w-full">
          <SkillsSection />
        </div>
      </section>

      <section id="projects" className="relative z-10 bg-transparent min-h-screen snap-start flex items-center">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 w-full">
          <div className="mb-8 text-center">
            <h2 className="font-display text-2xl font-semibold text-white">Projects</h2>
            <p className="mt-2 text-sm text-white/70">A visual showcase of selected projects.</p>
          </div>

          <div className="mt-6 w-full">
            {(() => {
              const palette = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']
              const items = projects.map((p: any, i: number) => {
                const rawStack = p.technologiesUsed ?? p.TechnologiesUsed ?? p.stack ?? p.technologies ?? p.tech
                let stackArr: string[] = []
                if (Array.isArray(rawStack)) stackArr = rawStack.map((s: any) => String(s).trim())
                else if (typeof rawStack === 'string') stackArr = rawStack.split(/[,;]\s*/).map(s => s.trim()).filter(Boolean)

                return {
                  image: p.imageUrl ?? '/Media.jpg',
                  title: p.title ?? 'Untitled',
                  subtitle: (p.description ?? '').slice(0, 140),
                  stack: stackArr,
                  handle: p.handle ?? '',
                  borderColor: palette[i % palette.length],
                  gradient: `linear-gradient(145deg, ${palette[i % palette.length]}, #000)`,
                  url: p.projectUrl ?? p.ProjectUrl
                }
              })

              return (
                <ChromaGrid items={items} radius={300} damping={0.45} fadeOut={0.6} ease="power3.out" />
              )
            })()}
          </div>
        </div>
      </section>



      {showLogin && <Login onClose={() => setShowLogin(false)} />}
      {showRegister && <Register onClose={() => setShowRegister(false)} />}

      <AboutSection />
      <ContactSection />
    </>
  )
}

export default Hero

function Nav({ onSignIn }: { onSignIn?: () => void }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mx-auto site-nav grid w-full max-w-6xl grid-cols-[auto_1fr_auto] items-center px-4 py-4">
      <div className="flex items-center gap-3">
        <a href="#home" aria-label="Home">
          <img src="/logo-1.gif" alt="John Philip Garcia" className="h-10 w-auto logo-img" loading="eager" />
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
            <a className="transition hover:text-white" href="#skills">
              Skills
            </a>
          </li>
          <li>
            
            <a className="transition hover:text-white" href="#projects">
              Projects
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
          <button onClick={() => onSignIn?.()} className="hero-primary-btn hero-nav-cta">Contact Me</button>
        </div>

        {/* Hamburger for small screens */}
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

        {/* Mobile menu overlay */}
        {open && (
          <div className="mobile-menu fixed z-11 inset-0 flex items-start justify-center px-6 py-20">
            <div className="mobile-menu-panel w-full max-w-md rounded-xl bg-[rgba(10,16,51,0.92)] p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <img src="/logo-1.gif" alt="logo" className="h-9 w-auto logo-img" loading="eager" />
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
                  <div>
                    <button onClick={() => { setOpen(false); onSignIn?.() }} className="hero-primary-btn w-full">Contact Me</button>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
