import Lenis from 'lenis'

// Inertia scrolling for mouse/trackpad on desktop. Touch devices and people who
// prefer reduced motion keep native scrolling. Lenis drives the real window scroll,
// so CSS scroll-driven animations, sticky cards and the reveal fallback all still work.
let lenis = null
let locks = 0

export function startSmooth() {
  if (lenis || typeof window === 'undefined') return
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (matchMedia('(pointer: coarse)').matches) return
  lenis = new Lenis({
    autoRaf: true,
    lerp: 0.12,
    anchors: { offset: -96 },
    allowNestedScroll: true, // menu, chat history, textarea and sideways strips scroll on their own
    prevent: (node) => !!(node.closest && node.closest('.menu, .chatpanel, .lightbox, textarea, .hs'))
  })
}

export function scrollToTop({ immediate = false } = {}) {
  if (lenis) lenis.scrollTo(0, { immediate, force: true })
  else window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' })
}

export function scrollToEl(el, { immediate = false } = {}) {
  if (lenis) lenis.scrollTo(el, { offset: -96, immediate, force: true })
  else el.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' })
}

// Freeze page scrolling while an overlay (menu, lightbox) is open. Counted, so overlays can nest.
export function lockScroll() {
  locks++
  if (locks > 1) return
  document.documentElement.style.overflow = 'hidden'
  if (lenis) lenis.stop()
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1)
  if (locks) return
  document.documentElement.style.overflow = ''
  if (lenis) lenis.start()
}
