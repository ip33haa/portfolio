import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Spline from '@splinetool/react-spline'
import TextType from './TextType'
// ChromaGrid (projects) moved to its own page
import FloatingLines from './FloatingLines'
import SkillsSection from './SkillsSection'
import AboutSection from './AboutSection'
// SiteNav is rendered globally in App.tsx; don't import here
import ContactSection from './ContactSection'
// Projects and documentation moved to dedicated pages
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

  // Projects and documentation are rendered on their own pages (#/projects, #/documentation)

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

  useEffect(() => {
    // ensure the currently selected switch is visible and highlighted
    const el = switchesRef.current?.querySelector(`[data-soundset="${soundSet}"]`) as HTMLElement | null
    if (el) {
      try {
        el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      } catch (e) {}
      // move focus for keyboard users when selection changes programmatically
      // but avoid stealing focus if the user is currently interacting elsewhere
      if (document.activeElement === document.body) {
        el.focus({ preventScroll: true })
      }
    }
  }, [soundSet])

  return (
    <>
      <section id="home" className="hero-shell h-screen snap-start">
      <div className="hero-stage relative overflow-hidden h-screen">
        {/* DotGrid - overlay scoped to the hero stage */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <FloatingLines
              enabledWaves={["top","middle","bottom"]}
              lineCount={5}
              lineDistance={5}
              bendRadius={5}
              bendStrength={-0.5}
              interactive={true}
              parallax={true}
            />
          </div>
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

            <div
              ref={switchesRef}
              className="flex gap-3 overflow-x-auto items-center no-scrollbar max-w-[520px] px-1"
              role="listbox"
              aria-label="Keyboard sound sets"
            >
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
                    data-soundset={key}
                    role="option"
                    aria-selected={isSelected}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setSoundSet(key)
                      } else if (e.key === 'ArrowRight') {
                        e.preventDefault(); scrollSwitches(220)
                      } else if (e.key === 'ArrowLeft') {
                        e.preventDefault(); scrollSwitches(-220)
                      }
                    }}
                    className={`flex-shrink-0 overflow-hidden rounded-lg p-2 transition-transform duration-150 focus:outline-none ${isSelected ? 'ring-4 ring-white/40 scale-105' : 'ring-1 ring-white/10'} ${isSelected ? 'focus:ring-4 focus:ring-white/40' : 'focus:ring-2 focus:ring-white/10'}`}
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

        {/* Header is rendered globally by App.tsx (SiteNav) */}

        <div className="relative z-9 mx-auto flex h-full w-full max-w-6xl items-center px-6 py-12 lg:py-16">
          <div className="grid w-full gap-12 lg:grid-cols-2 lg:items-center">

            {/* Left: textual placeholders (role, name, copy, CTAs) */}
            <div className="hero-fade hero-text space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white/70">
                <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                .NET Developer
              </div>
              <h1 className="hero-title font-display text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                John Philip Garcia
                <div className="mt-3 text-lg font-normal text-white/80 sm:text-xl">
                  <TextType
                    as="span"
                    text={["Let's build something amazing", "for your websites", "Let's Connect!"]}
                    typingSpeed={75}
                    pauseDuration={1500}
                    showCursor
                  />
                </div>
              </h1>
              <p className="hero-subtitle max-w-xl text-base text-white/70 sm:text-lg">
                Use headphones for realistic key sounds. Start typing on the interactive 3D keyboard for the full experience.
              </p>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => { window.location.hash = '#/projects' }} className="hero-primary-btn">View Projects</button>
                <a href="#contact" className="hero-secondary-btn inline-flex items-center justify-center">Contact Me</a>
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

      {/* Skills section (rendered by component to avoid duplicate IDs) */}
      <SkillsSection />

      {/* Projects moved to separate page: #/projects */}



      {showLogin && <Login onClose={() => setShowLogin(false)} />}
      {showRegister && <Register onClose={() => setShowRegister(false)} />}

      <AboutSection />
      <ContactSection />
    </>
  )
}

export default Hero


