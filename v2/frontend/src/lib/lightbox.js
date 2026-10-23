import { useEffect, useState } from 'react'

// Image lightbox state: open(src) shows it, Escape or close() hides it.
export function useLightbox() {
  const [src, setSrc] = useState('')
  useEffect(() => {
    if (!src) return
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    const onKey = (e) => { if (e.key === 'Escape') setSrc('') }
    window.addEventListener('keydown', onKey)
    return () => { html.style.overflow = prev; window.removeEventListener('keydown', onKey) }
  }, [src])
  return { lbOpen: !!src, lbSrc: src, openLb: setSrc, closeLb: () => setSrc('') }
}
