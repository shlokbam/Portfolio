// Scroll-reveal fallback for browsers without CSS scroll-driven animations.
// Chromium runs the original CSS (animation-timeline: view()); elsewhere this
// adds .in to elements as they enter the viewport and drives the progress bars.
const SELECTOR = '.rv, .orbit-in, .lit, .count, .railfill'

export function startReveal() {
  const html = document.documentElement
  if (!html.classList.contains('no-sda')) return
  // Elements waiting to be revealed. A position check (rather than IntersectionObserver)
  // also catches elements jumped past via anchors and the zero-height timeline rail.
  const pending = new Set()
  const check = () => {
    const limit = innerHeight * 0.92
    for (const el of pending) {
      if (!el.isConnected) { pending.delete(el); continue }
      const box = (el.classList.contains('railfill') ? el.parentElement : el).getBoundingClientRect()
      if (box.top < limit) { el.classList.add('in'); pending.delete(el) }
    }
  }
  const scan = (root) => {
    if (root.matches && root.matches(SELECTOR)) pending.add(root)
    if (root.querySelectorAll) root.querySelectorAll(SELECTOR).forEach((el) => { if (!el.classList.contains('in')) pending.add(el) })
  }
  scan(document.body)
  new MutationObserver((muts) => {
    for (const m of muts) m.addedNodes.forEach((n) => { if (n.nodeType === 1) scan(n) })
    requestAnimationFrame(check)
  }).observe(document.body, { childList: true, subtree: true })

  // page progress bar
  let raf = 0
  const onScroll = () => {
    if (raf) return
    raf = requestAnimationFrame(() => {
      raf = 0
      const max = html.scrollHeight - innerHeight
      const p = max > 0 ? Math.min(1, scrollY / max) : 0
      document.querySelectorAll('.prog').forEach((el) => el.style.setProperty('--p', p))
      check()
    })
  }
  addEventListener('scroll', onScroll, { passive: true })
  addEventListener('resize', onScroll)
  onScroll()

  // horizontal strip progress (Work page)
  document.addEventListener('scroll', (e) => {
    const el = e.target
    if (!(el instanceof Element) || !el.classList.contains('hs')) return
    const bar = el.closest('.hs-wrap') && el.closest('.hs-wrap').querySelector('.hs-prog')
    if (!bar) return
    const max = el.scrollWidth - el.clientWidth
    bar.style.setProperty('--p', max > 0 ? el.scrollLeft / max : 0)
  }, { capture: true, passive: true })
}
