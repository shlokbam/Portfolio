import { useEffect, useRef, useState } from 'react'
import Layout from '../components/Layout'
import A from '../components/A'
import { track } from '../lib/track'
import './Home.css'

// 404: "You broke it." The page renders normally (the prerendered 404.html too), then cracks and every piece
// falls under physics (matter-js, loaded on demand): the giant 4 0 4, the words, the links. Pieces can be
// grabbed and thrown (a counter hands out ranks), clicking the 0 multiplies it, Shake throws everything up,
// Put it back snaps it all into place. A link that is clicked, not dragged, still navigates.
// With reduced motion nothing falls on its own; the buttons still work.

const LINKS = [['/', 'Home'], ['/work', 'Work'], ['/about', 'About'], ['/writing', 'Writing'], ['/contact', 'Contact']]
const RANKS = [[0, 'Visitor'], [3, 'Intern'], [8, 'Junior Page Breaker'], [15, 'Senior Page Breaker'], [30, 'Chief Destruction Officer']]
const rank = (n) => RANKS.filter(([k]) => n >= k).pop()[1]

export default function NotFound() {
  const stage = useRef(null)
  const api = useRef(null)
  const dragged = useRef(false)
  const [broken, setBroken] = useState(false)
  const [live, setLive] = useState(false)
  const [throws, setThrows] = useState(0)

  useEffect(() => { track('404_view', { path: location.pathname.slice(0, 100) }) }, [])

  useEffect(() => {
    const el = stage.current
    if (!el) return
    let disposed = false, stop = () => {}
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

    ;(async () => {
      const mod = await import('matter-js')
      if (disposed) return
      const { Engine, Bodies, Body, Composite, Constraint, Sleeping } = mod.default || mod
      const engine = Engine.create({ enableSleeping: true })
      engine.gravity.y = 1.2
      let W = el.clientWidth, H = el.clientHeight
      const T = 600, FLOOR = 10 // the floor sits a little above the stage's bottom edge, clear of the buttons
      const walls = [
        Bodies.rectangle(W / 2, H - FLOOR + T / 2, W * 4, T, { isStatic: true }),
        Bodies.rectangle(-T / 2, H / 2, T, H * 6, { isStatic: true }),
        Bodies.rectangle(W + T / 2, H / 2, T, H * 6, { isStatic: true })
      ]
      Composite.add(engine.world, walls)

      // measure every piece where the layout put it, then take them out of the flow at the same spot
      const box = el.getBoundingClientRect()
      const items = [...el.querySelectorAll('[data-piece]')].map((node) => {
        const r = node.getBoundingClientRect()
        return { node, w: r.width, h: r.height, home: { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 }, body: null, extra: false }
      })
      const place = (it) => {
        const { x, y } = it.body.position
        it.node.style.transform = `translate(${(x - it.w / 2).toFixed(1)}px, ${(y - it.h / 2).toFixed(1)}px) rotate(${it.body.angle.toFixed(3)}rad)`
      }
      const make = (it) => {
        const round = it.node.dataset.piece === 'pill' || it.node.dataset.piece === 'zero'
        it.body = Bodies.rectangle(it.home.x, it.home.y, it.w, it.h, {
          restitution: it.node.dataset.piece === 'zero' ? 0.6 : 0.35, friction: 0.3, frictionAir: 0.01,
          density: it.node.dataset.piece === 'glyph' ? 0.004 : 0.002, chamfer: round ? { radius: Math.min(it.w, it.h) / 2 - 1 } : { radius: 8 }
        })
        // pinned in place until the page breaks (set after creation, so matter keeps its mass for unpinning)
        Body.setStatic(it.body, true)
        Composite.add(engine.world, it.body)
      }
      items.forEach(make)
      el.classList.add('live')
      items.forEach((it) => { it.node.style.width = it.w + 'px'; it.node.style.height = it.h + 'px'; place(it) })
      setLive(true)

      const kick = (it, power) => {
        Sleeping.set(it.body, false)
        Body.setVelocity(it.body, { x: (Math.random() - 0.5) * power, y: -power * (0.4 + Math.random() * 0.6) })
        Body.setAngularVelocity(it.body, (Math.random() - 0.5) * 0.3)
      }
      const breakIt = () => {
        el.classList.remove('crack'); void el.offsetWidth; el.classList.add('crack')
        setTimeout(() => {
          if (disposed) return
          items.forEach((it, i) => setTimeout(() => {
            if (disposed || !it.body) return
            Body.setStatic(it.body, false); Sleeping.set(it.body, false)
            Body.setAngularVelocity(it.body, (Math.random() - 0.5) * 0.08)
          }, i * 45))
          setBroken(true)
        }, 380)
      }
      const putBack = () => {
        for (const it of items.filter((x) => x.extra)) { Composite.remove(engine.world, it.body); it.node.remove() }
        for (let i = items.length - 1; i >= 0; i--) if (items[i].extra) items.splice(i, 1)
        for (const it of items) {
          Body.setStatic(it.body, true); Body.setAngle(it.body, 0)
          Body.setPosition(it.body, it.home); Body.setVelocity(it.body, { x: 0, y: 0 })
          it.node.classList.add('snap'); place(it)
        }
        setTimeout(() => items.forEach((it) => it.node.classList.remove('snap')), 600)
        setBroken(false)
      }

      // clicking the 0 (not dragging it) spills more zeros
      const spill = (it) => {
        if (items.filter((x) => x.extra).length > 40) return
        for (let k = 0; k < 6; k++) {
          const node = document.createElement('span')
          node.className = 'nf-zero disp'; node.dataset.piece = 'zero'; node.textContent = '0'; node.setAttribute('aria-hidden', 'true')
          el.appendChild(node)
          const s = 34 + Math.random() * 30
          node.style.fontSize = s + 'px'
          const z = { node, w: node.offsetWidth, h: node.offsetHeight, home: { x: it.body.position.x + (Math.random() - 0.5) * 60, y: it.body.position.y - 40 }, body: null, extra: true }
          node.style.width = z.w + 'px'; node.style.height = z.h + 'px'
          make(z); Body.setStatic(z.body, false); kick(z, 14)
          items.push(z); attach(z); place(z)
        }
      }

      // drag and throw
      let grab = null
      const local = (e) => { const r = el.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top } }
      const onDown = (e) => {
        const it = items.find((x) => x.node === e.currentTarget)
        if (!it || !it.body || it.body.isStatic) return
        e.preventDefault()
        const p = local(e)
        Sleeping.set(it.body, false)
        const c = Constraint.create({ pointA: p, bodyB: it.body, pointB: { x: p.x - it.body.position.x, y: p.y - it.body.position.y }, stiffness: 0.2, damping: 0.06, length: 0 })
        Composite.add(engine.world, c)
        grab = { c, it, x0: e.clientX, y0: e.clientY, trail: [[e.clientX, e.clientY, performance.now()]] }
        dragged.current = false
        it.node.setPointerCapture(e.pointerId)
        it.node.classList.add('held')
      }
      const onMove = (e) => {
        if (!grab) return
        grab.c.pointA = local(e)
        grab.trail.push([e.clientX, e.clientY, performance.now()]); if (grab.trail.length > 5) grab.trail.shift()
        if (Math.hypot(e.clientX - grab.x0, e.clientY - grab.y0) > 6) dragged.current = true
      }
      const onUp = () => {
        if (!grab) return
        Composite.remove(engine.world, grab.c)
        grab.it.node.classList.remove('held')
        // a throw: the pointer was still moving fast when it let go (px per ms over the last few moves)
        const [a, z] = [grab.trail[0], grab.trail[grab.trail.length - 1]]
        const speed = z[2] > a[2] ? Math.hypot(z[0] - a[0], z[1] - a[1]) / (z[2] - a[2]) : 0
        if (dragged.current && speed > 0.9) setThrows((n) => n + 1)
        else if (!dragged.current && grab.it.node.dataset.piece === 'glyph' && grab.it.node.textContent === '0') spill(grab.it)
        grab = null
      }
      const attach = (it) => {
        it.node.addEventListener('pointerdown', onDown)
        it.node.addEventListener('pointermove', onMove)
        it.node.addEventListener('pointerup', onUp)
        it.node.addEventListener('pointercancel', onUp)
      }
      items.forEach(attach)

      api.current = {
        breakIt() { track('404_break'); breakIt() },
        putBack,
        shake() { el.classList.remove('crack'); void el.offsetWidth; el.classList.add('crack'); items.forEach((it) => it.body && !it.body.isStatic && kick(it, 22)) }
      }

      const ro = new ResizeObserver(() => {
        const w = el.clientWidth, h = el.clientHeight
        if (w === W && h === H) return
        W = w; H = h
        Body.setPosition(walls[0], { x: W / 2, y: H - FLOOR + T / 2 })
        Body.setPosition(walls[2], { x: W + T / 2, y: H / 2 })
      })
      ro.observe(el)

      let raf = 0, last = 0
      const loop = (t) => {
        const dt = last ? Math.min(32, t - last) : 16
        last = t
        Engine.update(engine, dt)
        for (const it of items) if (it.body && !it.body.isStatic) place(it)
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
      const auto = reduced ? 0 : setTimeout(() => !disposed && breakIt(), 1100)

      stop = () => {
        cancelAnimationFrame(raf); clearTimeout(auto); ro.disconnect()
        items.forEach((it) => { it.node.removeEventListener('pointerdown', onDown); it.node.removeEventListener('pointermove', onMove); it.node.removeEventListener('pointerup', onUp); it.node.removeEventListener('pointercancel', onUp) })
        Engine.clear(engine)
        api.current = null
      }
    })()
    return () => { disposed = true; stop() }
  }, [])

  // a link that was dragged shouldn't navigate when it's let go
  const guard = (e) => { if (dragged.current) { e.preventDefault(); dragged.current = false } }

  return (
    <Layout page="home" chat footerStyle="padding: 56px 0 36px; border-top: 1px solid var(--line)">
      <section className="dots nf" style={{ position: 'relative', paddingTop: '110px' }}>
        <div className="wrap nf-top">
          <span className="mono" style={{ color: 'var(--muted)' }}>{broken ? '404 · You broke it' : '404 · Page not found'}</span>
          <span className="mono nf-rank" aria-live="polite">{live ? `${throws} thrown · ${rank(throws)}` : ''}</span>
        </div>
        <div className="wrap">
          <div ref={stage} className="nf-stage">
            <div className="nf-glyphs" aria-label="404">
              <span className="disp nf-glyph" data-piece="glyph" aria-hidden="true">4</span>
              <span className="disp nf-glyph accent" data-piece="glyph" aria-hidden="true" title="Click me">0</span>
              <span className="disp nf-glyph" data-piece="glyph" aria-hidden="true">4</span>
            </div>
            <div className="nf-words">
              <span className="disp nf-word" data-piece="word">Page</span>
              <span className="disp nf-word" data-piece="word">not</span>
              <span className="disp nf-word" data-piece="word">found<span style={{ color: 'var(--accent)' }}>.</span></span>
            </div>
            <p className="serif nf-line" data-piece="line">This page doesn’t exist. Neither, in a second, will this one.</p>
            <nav className="nf-links" aria-label="Pages that do exist">
              {LINKS.map(([href, label]) => (
                <A key={href} className="mono nf-pill" data-piece="pill" href={href} onClick={guard} draggable={false}>{label} →</A>
              ))}
            </nav>
          </div>
        </div>
        <div className="wrap nf-controls">
          {live && (broken
            ? <>
                <button type="button" className="btn mono nf-btn" onClick={() => api.current && api.current.shake()}>Shake</button>
                <button type="button" className="btn mono nf-btn" onClick={() => api.current && api.current.putBack()}>Put it back</button>
                <span className="mono nf-hint">Drag and throw anything · click the 0</span>
              </>
            : <button type="button" className="btn mono nf-btn" onClick={() => api.current && api.current.breakIt()}>Break it</button>)}
        </div>
      </section>
    </Layout>
  )
}
