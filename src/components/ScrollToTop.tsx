import React, { useEffect, useState } from 'react'

const ScrollToTop: React.FC = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}
      className="fixed bottom-6 right-6 z-[9999] inline-flex h-12 w-12 items-center justify-center rounded-full bg-cyan-400/90 text-white shadow-lg hover:scale-105 transition-transform"
    >
      ↑
    </button>
  )
}

export default ScrollToTop
