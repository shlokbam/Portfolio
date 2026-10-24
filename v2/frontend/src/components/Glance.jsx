import { useEffect, useRef, useState } from 'react'
import { PROJECTS } from '../data/projects'

// "At a glance" numbers on the home page. Each tile has its own hover interaction;
// styles live in Home.css (.g-bento / .tile).
const reduced = () => typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

// cursor spotlight, positioned relative to the tile
function spot(e) {
  const el = e.currentTarget, r = el.getBoundingClientRect()
  el.style.setProperty('--mx', e.clientX - r.left + 'px')
  el.style.setProperty('--my', e.clientY - r.top + 'px')
}

function Tile({ className = '', children, ...rest }) {
  return (
    <div className={'tile rv ' + className} onPointerMove={spot} {...rest}>
      <span className="spot" aria-hidden="true" />
      {children}
    </div>
  )
}

// bars wave on hover; pointing at a bar names the project
function Projects() {
  const [hi, setHi] = useState(-1)
  const ai = PROJECTS.filter((p) => p.cats.includes('ai')).length
  const cur = hi >= 0 ? PROJECTS[hi] : null
  return (
    <Tile className="t-proj" onPointerLeave={() => setHi(-1)}>
      <div className="tnum disp"><span className="count" style={{ '--to': '21' }} /></div>
      <div className="mono tlab">Projects shipped</div>
      <div className="pgrid" aria-hidden="true">
        {PROJECTS.map((p, i) => (
          <span key={p.title} className={'pcell' + (p.cats.includes('ai') ? ' ai' : '') + (i === hi ? ' hot' : '')} style={{ '--i': i }} onPointerEnter={() => setHi(i)} />
        ))}
      </div>
      <div className="mono tleg" aria-live="polite">
        {cur
          ? <span className="tread"><b>{String(hi + 1).padStart(2, '0')}</b> {cur.title} <span style={{ color: 'var(--muted)' }}>· {cur.field}</span></span>
          : <><span><i className="sw ai" /> AI / agents {ai}</span><span><i className="sw" /> Web, cloud &amp; DevOps {PROJECTS.length - ai}</span><span className="hint">Point at a bar ↑</span></>}
      </div>
    </Tile>
  )
}

// ring redraws and the number counts up again on hover
function Cgpa() {
  const [v, setV] = useState(9.01)
  const [k, setK] = useState(0)
  const raf = useRef(0)
  useEffect(() => () => cancelAnimationFrame(raf.current), [])
  const play = () => {
    if (reduced()) return
    cancelAnimationFrame(raf.current)
    setK((x) => x + 1)
    const t0 = performance.now()
    const step = (t) => {
      const p = Math.min(1, (t - t0) / 1100)
      setV(9.01 * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
  }
  return (
    <Tile className="t-cgpa" onPointerEnter={play}>
      <div className="ring" aria-hidden="true">
        <svg viewBox="0 0 120 120">
          <circle className="ringdash" cx="60" cy="60" r="58" fill="none" stroke="var(--muted2)" strokeWidth="1" strokeDasharray="1 4.2" />
          <circle cx="60" cy="60" r="50" fill="none" stroke="var(--line)" strokeWidth="8" />
          <circle key={k} className={'ringfill' + (k ? ' redraw' : '')} cx="60" cy="60" r="50" fill="none" stroke="var(--accent)" strokeWidth="8" strokeLinecap="round" pathLength="100" strokeDasharray="90.1 100" transform="rotate(-90 60 60)" />
        </svg>
        <div className="disp ringnum">{v.toFixed(2)}</div>
        <div className="mono ringof">out of 10</div>
      </div>
      <div className="mono tlab" style={{ textAlign: 'center' }}>CGPA · B.Tech IT · VIT Pune</div>
    </Tile>
  )
}

// the three patents fan out like a hand of cards
const PATENTS = [
  ['ZA', 'Granted', 'Wildlife protection with YOLO'],
  ['ZA', 'Filed', 'Fruit & vegetable quality AI'],
  ['IN', 'Published', 'TKPH tyre-health management']
]
function Patents() {
  return (
    <Tile className="t-pat">
      <div className="tnum disp"><span className="count" style={{ '--to': '3' }} /></div>
      <div className="mono tlab">Patents co-invented</div>
      <div className="hand" aria-label="Patents">
        {PATENTS.map(([c, s, t], i) => (
          <div key={t} className={'pcard' + (s === 'Granted' ? ' on' : '')} style={{ '--i': i }}>
            <span className="mono">{s} · {c}</span>
            <b>{t}</b>
          </div>
        ))}
      </div>
    </Tile>
  )
}

// a ripple spreads across the badge grid from the dot under the pointer
function Arcade() {
  const grid = useRef(null)
  const last = useRef(0)
  const ripple = (e) => {
    const g = grid.current, t = e.target
    if (!g || t.parentElement !== g || reduced()) return
    const now = performance.now()
    if (now - last.current < 260) return
    last.current = now
    const ox = t.offsetLeft, oy = t.offsetTop
    for (const d of g.children) {
      const dist = Math.hypot(d.offsetLeft - ox, d.offsetTop - oy)
      d.style.animation = 'none'
      void d.offsetWidth // restart the animation
      d.style.animation = `home-rip .75s ${Math.round(dist * 2.4)}ms cubic-bezier(.16,1,.3,1)`
    }
  }
  return (
    <Tile className="t-arc">
      <div className="tnum disp"><span className="count" style={{ '--to': '90' }} /><span style={{ color: 'var(--accent)' }}>+</span></div>
      <div className="mono tlab">Google Arcade badges</div>
      <div className="dotgrid" ref={grid} onPointerOver={ripple} aria-hidden="true">
        {Array.from({ length: 90 }, (_, i) => <span key={i} style={{ '--i': i }} />)}
      </div>
    </Tile>
  )
}

// the faces spread out and light up one after another
function Mentored() {
  return (
    <Tile className="t-men">
      <div className="tnum disp"><span className="count" style={{ '--to': '100' }} /><span style={{ color: 'var(--accent)' }}>+</span></div>
      <div className="mono tlab">First-years mentored</div>
      <div className="faces" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span key={i} style={{ '--i': i }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8.5" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" /></svg>
          </span>
        ))}
        <span className="more">+94<em>{'\u00a0'}more</em></span>
      </div>
      <div className="mono tsub">Abhivriddhi · ITSA · VIT Pune</div>
    </Tile>
  )
}

export default function Glance() {
  return (
    <section aria-label="At a glance" style={{ borderBottom: '1px solid var(--line)', padding: '88px 0' }}>
      <div className="wrap g-bento">
        <Projects />
        <Cgpa />
        <Patents />
        <Arcade />
        <Mentored />
      </div>
    </section>
  )
}
