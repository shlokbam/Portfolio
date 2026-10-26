import { useEffect, useRef, useState } from 'react'
import A from './A'
import { NOW, UPDATED } from '../data/now'

// Home "Right now": the blocks from data/now.js as blips on a radar. The sweep turns (while on screen)
// and lights each blip as it passes, highlighting its line; hovering or focusing a line holds the sweep on it.
const PERIOD = 9000 // ms per turn
const R = 150

export default function NowRadar() {
  const blocks = NOW.filter((b) => b.text)
  const n = blocks.length
  const [active, setActive] = useState(0)
  const [held, setHeld] = useState(null)
  // how far through the month we are; set after hydration so the prerendered HTML stays stable
  const [month, setMonth] = useState(null)
  useEffect(() => {
    const d = new Date()
    setMonth({ day: d.getDate(), days: new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate() })
  }, [])
  const sweep = useRef(null)
  const box = useRef(null)
  const heldRef = useRef(held)
  heldRef.current = held

  // blip i sits a little after the start of its slice, at its own distance from the centre
  const blip = (i) => {
    const a = ((i + 0.55) / n) * 2 * Math.PI - Math.PI / 2, r = R * (0.42 + 0.5 * ((i * 37) % 10) / 10)
    return { x: Math.cos(a) * r, y: Math.sin(a) * r }
  }

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0, on = false, t0 = performance.now(), last = -1
    const tick = (now) => {
      if (heldRef.current === null) {
        const deg = (((now - t0) % PERIOD) / PERIOD) * 360
        if (sweep.current) sweep.current.setAttribute('transform', 'rotate(' + deg.toFixed(1) + ')')
        const i = Math.floor((deg / 360) * n) % n
        if (i !== last) { last = i; setActive(i) }
      } else t0 = now - (((heldRef.current + 0.6) / n) * PERIOD)
      raf = on ? requestAnimationFrame(tick) : 0
    }
    const io = new IntersectionObserver(([e]) => {
      on = e.isIntersecting
      if (on && !raf) raf = requestAnimationFrame(tick)
    })
    if (box.current) io.observe(box.current)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [n])

  const cur = held === null ? active : held
  const hold = (i) => () => setHeld(i)
  const release = () => setHeld(null)

  return (
    <section id="now" className="nowr" ref={box} style={{ padding: '110px 0', borderBottom: '1px solid var(--line)' }}>
      <div className="wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <span className="mono" style={{ color: 'var(--muted)' }}><span className="nowr-live" aria-hidden="true" />Right now · {UPDATED}</span>
            <h2 className="disp rv" style={{ margin: '20px 0 0', fontSize: 'clamp(48px, 6.4vw, 100px)' }}>
              On my{' '}
              <span className="serif" style={{ textTransform: 'none', fontWeight: '400', color: 'var(--accent)' }}>radar</span>
            </h2>
          </div>
          <div className="nowr-month mono" aria-hidden="true">
            <span>{month ? 'Day ' + month.day + ' of ' + month.days : 'This month'}</span>
            <span className="nowr-track"><i style={{ transform: 'scaleX(' + (month ? month.day / month.days : 0) + ')' }} /></span>
          </div>
        </div>

        <div className="nowr-grid">
          <svg className="nowr-radar" viewBox="-170 -170 340 340" aria-hidden="true">
            <defs>
              <radialGradient id="nowr-glow"><stop offset="0" stopColor="var(--accent)" stopOpacity=".18" /><stop offset="1" stopColor="var(--accent)" stopOpacity="0" /></radialGradient>
              <linearGradient id="nowr-beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="var(--accent)" stopOpacity="0" /><stop offset="1" stopColor="var(--accent)" stopOpacity=".55" /></linearGradient>
            </defs>
            <circle r={R + 12} fill="url(#nowr-glow)" />
            {[0.25, 0.5, 0.75, 1].map((k) => <circle key={k} r={R * k} className="nowr-ring" />)}
            <path d={`M${-R} 0H${R}M0 ${-R}V${R}`} className="nowr-ring" />
            <g ref={sweep} transform={'rotate(' + (((cur + 0.6) / n) * 360).toFixed(1) + ')'}>
              <path d={`M0 0L0 ${-R}A${R} ${R} 0 0 1 ${(R * Math.sin(Math.PI / 4)).toFixed(1)} ${(-R * Math.cos(Math.PI / 4)).toFixed(1)}Z`} fill="url(#nowr-beam)" transform="rotate(-45)" />
              <line x1="0" y1="0" x2="0" y2={-R} className="nowr-arm" />
            </g>
            {blocks.map((b, i) => {
              const p = blip(i)
              return (
                <g key={b.key} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`} className={'nowr-blip' + (i === cur ? ' on' : '')} onMouseEnter={hold(i)} onMouseLeave={release}>
                  <circle r="16" className="nowr-ping" />
                  <circle r="5" className="nowr-dot" />
                  <text y="-12" textAnchor="middle" className="nowr-tag">{b.key}</text>
                </g>
              )
            })}
            <circle r="3" fill="var(--accent)" />
          </svg>

          <ol className="nowr-list">
            {blocks.map((b, i) => (
              <li key={b.key} className={'nowr-item' + (i === cur ? ' on' : '')} onMouseEnter={hold(i)} onMouseLeave={release} onFocus={hold(i)} onBlur={release} tabIndex={0}>
                <span className="mono nowr-k"><span>{String(i + 1).padStart(2, '0')}</span>{b.key}</span>
                <p>{b.text}</p>
                {b.link && <A className="ul mono nowr-l" href={b.link[1]}>{b.link[0]} →</A>}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
