import { useEffect, useRef, useState } from 'react'

// "The route so far": a scroll-driven road on the Journey page. As the visitor scrolls, the road
// draws itself, a comet travels along it, milestones light up and a giant year counter rolls
// from 2010 to now. Without motion (or JS) the whole route is shown at once.

const STOPS = [
  { year: 2010, title: 'School begins', sub: 'Grades 1–12' },
  { year: 2021, title: 'Class 10', sub: 'Secondary school done' },
  { year: 2023, title: 'Class 12', sub: 'Higher secondary done' },
  { year: 2023, title: 'VIT Pune', sub: 'B.Tech IT begins' },
  { year: 2023, title: 'First internship', sub: 'UI/UX · Herbs Magic' },
  { year: 2024, title: 'Club leadership', sub: 'Abhivriddhi · Catalyst · CSI' },
  { year: 2025, title: 'Founding chair', sub: 'ITSA · 50+ member team' },
  { year: 2026, title: 'PharmaACE', sub: 'Agentic AI intern' },
  { year: 2027, title: 'Next stop', sub: 'Graduating May 2027', future: true }
]

// winding road through the stops (desktop: left → right, phone: top → bottom)
const WIDE = { w: 1200, h: 520, d: 'M40 430 C 160 430, 170 300, 260 300 S 380 420, 470 380 S 540 180, 640 200 S 760 380, 850 300 S 900 110, 1000 120 S 1110 260, 1160 90' }
const TALL = { w: 400, h: 980, d: 'M60 40 C 60 140, 320 120, 330 230 S 70 330, 80 450 S 330 540, 320 650 S 80 760, 90 860 S 260 950, 330 940' }

export default function JourneyRoute() {
  const sec = useRef(null)
  const road = useRef(null)
  const [shape, setShape] = useState(WIDE)
  const [pts, setPts] = useState([]) // milestone positions along the road
  const [p, setP] = useState(1) // scroll progress 0..1 (1 = everything shown)
  const [len, setLen] = useState(0)
  const [still, setStill] = useState(true)

  useEffect(() => {
    const narrow = matchMedia('(max-width: 700px)').matches
    setShape(narrow ? TALL : WIDE)
    setStill(matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  // place the stops along the path once its geometry is known
  useEffect(() => {
    const el = road.current
    if (!el) return
    const L = el.getTotalLength()
    setLen(L)
    const n = STOPS.length
    setPts(STOPS.map((s, i) => {
      const at = (i / (n - 1)) * L
      const q = el.getPointAtLength(at)
      return { x: q.x, y: q.y, t: i / (n - 1) }
    }))
  }, [shape])

  // scroll progress through the tall section
  useEffect(() => {
    if (still) { setP(1); return }
    let raf = 0
    const upd = () => {
      raf = 0
      const el = sec.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const span = el.offsetHeight - innerHeight
      setP(Math.max(0, Math.min(1, span > 0 ? -r.top / span : 1)))
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(upd) }
    upd()
    addEventListener('scroll', on, { passive: true })
    addEventListener('resize', on)
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); cancelAnimationFrame(raf) }
  }, [still])

  // drawn length stops just short of the future (dashed) stop
  const lastReal = (STOPS.length - 2) / (STOPS.length - 1)
  const prog = Math.min(p * 1.02, 1)
  const drawn = Math.min(prog, lastReal)
  const head = road.current && len ? road.current.getPointAtLength(drawn * len) : null
  const active = pts.filter((q) => q.t <= drawn + 0.001).length
  const a = Math.max(0, active - 1)
  // interpolate the year between stops for the rolling counter
  const seg = drawn * (STOPS.length - 1)
  const i0 = Math.min(STOPS.length - 2, Math.floor(seg))
  const year = Math.round(STOPS[i0].year + (STOPS[i0 + 1].year - STOPS[i0].year) * (seg - i0))
  const cur = STOPS[a]

  return (
    <section ref={sec} className={'route' + (still ? ' still' : '')} aria-label="The route so far">
      <div className="route-stage">
        <div className="wrap route-head">
          <div>
            <span className="mono" style={{ color: 'var(--muted)' }}>The route so far</span>
            <h2 className="disp" style={{ margin: '14px 0 0', fontSize: 'clamp(36px, 5vw, 76px)' }}>
              2010 <span className="serif" style={{ textTransform: 'none', fontWeight: '400', color: 'var(--accent)' }}>to</span> now
            </h2>
          </div>
          <div className="route-now" aria-live="polite">
            <span className="mono" style={{ color: 'var(--accent)' }}>{cur.year}</span>
            <b>{cur.title}</b>
            <span style={{ color: 'var(--muted)' }}>{cur.sub}</span>
          </div>
        </div>
        <div className="route-year disp" aria-hidden="true">{year}</div>
        <div className="wrap route-map">
          <svg viewBox={`0 0 ${shape.w} ${shape.h}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <defs>
              <filter id="route-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" /></filter>
            </defs>
            <path d={shape.d} fill="none" stroke="var(--line)" strokeWidth="14" strokeLinecap="round" />
            <path d={shape.d} fill="none" stroke="var(--muted2)" strokeWidth="1.5" strokeDasharray="2 10" strokeLinecap="round" />
            <path ref={road} d={shape.d} fill="none" stroke="var(--accent)" strokeWidth="6" strokeLinecap="round"
              strokeDasharray={len ? `${len} ${len}` : undefined} strokeDashoffset={len ? len * (1 - drawn) : 0} />
            {pts.map((q, i) => {
              const s = STOPS[i]
              const on = i < active
              const below = shape === WIDE ? q.y < 260 : false
              return (
                <g key={i} className={'stop' + (on ? ' on' : '') + (s.future ? ' future' : '') + (i === a ? ' cur' : '')} transform={`translate(${q.x} ${q.y})`}>
                  <circle className="ring" r="20" />
                  <circle className="pin" r="9" />
                  <text className="yr" y={below ? 44 : -30} textAnchor="middle">{s.year}</text>
                  <text className="nm" y={below ? 62 : -14} textAnchor="middle">{s.title}</text>
                </g>
              )
            })}
            {head && !still && (
              <g transform={`translate(${head.x} ${head.y})`}>
                <circle r="16" fill="var(--accent)" opacity=".5" filter="url(#route-glow)" />
                <circle r="7" fill="var(--text)" />
              </g>
            )}
          </svg>
        </div>
        <div className="wrap route-bar" aria-hidden="true"><span style={{ transform: `scaleX(${prog})` }} /></div>
      </div>
    </section>
  )
}
