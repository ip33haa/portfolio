import { useEffect } from 'react'

export default function useLazyLoadImage(ref: React.RefObject<HTMLImageElement>, src: string) {
  useEffect(() => {
    const img = ref.current
    if (!img) return

    if ('loading' in HTMLImageElement.prototype) {
      // browser supports native lazy loading; nothing to do
      img.src = src
      return
    }

    let observer: IntersectionObserver | null = null
    if (window.IntersectionObserver) {
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            img.src = src
            observer?.disconnect()
          }
        })
      }, { rootMargin: '200px' })
      observer.observe(img)
    } else {
      // fallback
      img.src = src
    }

    return () => observer?.disconnect()
  }, [ref, src])
}

/*
Usage example:

import React, { useRef } from 'react'
import useLazyLoadImage from '../lib/useLazyLoadImage'

function MyImage() {
  const ref = useRef<HTMLImageElement | null>(null)
  useLazyLoadImage(ref, '/path/to/image.jpg')
  return <img ref={ref} alt="" />
}

*/
