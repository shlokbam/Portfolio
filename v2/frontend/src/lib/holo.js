import { useEffect } from 'react'

// Holographic tilt for cards marked [data-holo]: the card turns toward the pointer and a foil
// layer (.foil inside it) follows the light. Uses the individual `rotate` property so it stacks
// with the scroll-reveal `transform` animations instead of fighting them.
export function useHolo() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || matchMedia('(hover: none)').matches) return
    const cards = [...document.querySelectorAll('[data-holo]')]
    const offs = cards.map((el) => {
      let raf = 0
      const move = (e) => {
        const r = el.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(() => {
          const ax = (0.5 - y), ay = (x - 0.5)
          el.style.rotate = `${ax.toFixed(3)} ${ay.toFixed(3)} 0 ${(Math.hypot(ax, ay) * 22).toFixed(2)}deg`
          el.style.setProperty('--hx', (x * 100).toFixed(1) + '%')
          el.style.setProperty('--hy', (y * 100).toFixed(1) + '%')
          el.classList.add('holo-on')
        })
      }
      const leave = () => { cancelAnimationFrame(raf); el.style.rotate = ''; el.classList.remove('holo-on') }
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', leave)
      return () => { cancelAnimationFrame(raf); el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave) }
    })
    return () => offs.forEach((f) => f())
  }, [])
}

// Adds .stamped to [data-stamp] elements the first time they are mostly in view.
export function useStamp() {
  useEffect(() => {
    const els = [...document.querySelectorAll('[data-stamp]')]
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('stamped')); return }
    const io = new IntersectionObserver((ens) => ens.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('stamped'); io.unobserve(en.target) }
    }), { threshold: 0.55 })
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [])
}
