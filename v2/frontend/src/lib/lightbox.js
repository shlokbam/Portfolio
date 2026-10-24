import { useEffect, useState } from 'react'
import { lockScroll, unlockScroll } from './smooth'

// Image lightbox state: open(src) shows it, Escape or close() hides it.
export function useLightbox() {
  const [src, setSrc] = useState('')
  useEffect(() => {
    if (!src) return
    lockScroll()
    const onKey = (e) => { if (e.key === 'Escape') setSrc('') }
    window.addEventListener('keydown', onKey)
    return () => { unlockScroll(); window.removeEventListener('keydown', onKey) }
  }, [src])
  return { lbOpen: !!src, lbSrc: src, openLb: setSrc, closeLb: () => setSrc('') }
}
