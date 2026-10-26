import { useEffect, useRef, useState } from 'react'
import Layout from '../components/Layout'
import A from '../components/A'
import { NOW, UPDATED } from '../data/now'
import './Home.css'
import './Now.css'

// /now: what Shlok is focused on this month. Content lives in data/now.js.
// The header carries a heartbeat line with a travelling pulse; each block is shown as a running "process"
// with a live activity trace, and a spotlight follows the pointer across the cards.

// one heartbeat: flat, small bump, sharp spike, dip, recovery (repeated across the width)
const BEAT = 'l40 0 l10 -10 l10 10 l14 0 l8 -64 l10 96 l8 -40 l12 8 l40 0'
const ECG = 'M0 70 ' + Array.from({ length: 9 }, () => BEAT).join(' ')

function Trace({ seed }) {
  // a small random-walk activity line, refreshed while on screen (decoration only, no numbers)
  const [pts, setPts] = useState(() => Array.from({ length: 24 }, (_, i) => 12 + 6 * Math.sin(i * 0.7 + seed)))
  const ref = useRef(null)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let id = 0
    const io = new IntersectionObserver(([e]) => {
      clearInterval(id)
      if (e.isIntersecting) id = setInterval(() => setPts((p) => p.slice(1).concat(Math.max(2, Math.min(22, p[p.length - 1] + (Math.random() - 0.5) * 9)))), 380)
    })
    if (ref.current) io.observe(ref.current)
    return () => { io.disconnect(); clearInterval(id) }
  }, [])
  const d = pts.map((y, i) => (i ? 'L' : 'M') + (i * 4).toFixed(1) + ' ' + y.toFixed(1)).join(' ')
  return (
    <svg ref={ref} className="now-trace" viewBox="0 0 92 24" aria-hidden="true">
      <path d={d + ' L92 24 L0 24 Z'} className="now-trace-fill" />
      <path d={d} className="now-trace-line" />
    </svg>
  )
}

export default function Now() {
  // how far through the month we are; set after hydration so the prerendered HTML stays stable
  const [month, setMonth] = useState(null)
  useEffect(() => {
    const d = new Date(), days = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
    setMonth({ day: d.getDate(), days })
  }, [])
  const blocks = NOW.filter((b) => b.text)
  const spot = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', (e.clientX - r.left) + 'px')
    e.currentTarget.style.setProperty('--my', (e.clientY - r.top) + 'px')
  }

  return (
    <Layout page="home" nav="now" chat greeting="Want to know more about what Shlok is working on? Ask me." footerStyle="padding: 56px 0 36px; border-top: 1px solid var(--line)">
      <section id="top" className="dots now-hero" style={{ position: 'relative', overflow: 'hidden', paddingTop: '190px', paddingBottom: '72px', borderBottom: '1px solid var(--line)' }}>
        <svg className="now-ecg" viewBox="0 0 1368 140" preserveAspectRatio="none" aria-hidden="true">
          <path d={ECG} className="now-ecg-base" />
          <path d={ECG} className="now-ecg-pulse" pathLength="1000" />
        </svg>
        <div className="wrap" style={{ position: 'relative' }}>
          <span className="mono" style={{ color: 'var(--muted)' }}><span className="now-live" aria-hidden="true" />Live · updated {UPDATED}</span>
          <h1 className="disp" style={{ margin: '24px 0 0', fontSize: 'clamp(72px, 15vw, 230px)' }}>
            <span className="mask"><span className="rise" style={{ '--d': '.1s' }}>Now<span className="now-dot" style={{ color: 'var(--accent)' }}>.</span></span></span>
          </h1>
          <p className="serif fade" style={{ '--d': '.4s', margin: '24px 0 0', fontSize: 'clamp(26px, 2.6vw, 38px)', color: 'var(--muted)', maxWidth: '760px', lineHeight: '1.15' }}>What I'm focused on this month, in thirty seconds.</p>
          <div className="now-month fade mono" style={{ '--d': '.55s' }} aria-hidden="true">
            <span>{month ? 'Day ' + month.day + ' of ' + month.days : 'This month'}</span>
            <span className="now-track"><i style={{ transform: 'scaleX(' + (month ? month.day / month.days : 0) + ')' }} /></span>
          </div>
        </div>
      </section>
      <section style={{ padding: '72px 0 110px' }}>
        <div className="wrap">
          <div className="now-grid">
            {blocks.map((b, i) => (
              <article key={b.key} className="now-card rv" onPointerMove={spot}>
                <div className="now-top">
                  <h2 className="mono now-k"><span>{String(i + 1).padStart(2, '0')}</span>{b.key}</h2>
                  <span className="mono now-run"><i aria-hidden="true" />running</span>
                </div>
                <p>{b.text}</p>
                <div className="now-bot">
                  {b.link ? <A className="ul mono now-l" href={b.link[1]}>{b.link[0]} →</A> : <span />}
                  <Trace seed={i * 1.7} />
                </div>
              </article>
            ))}
          </div>
          <p className="mono" style={{ margin: '48px 0 0', color: 'var(--muted)', fontSize: '11px' }}>
            A <A className="ul" href="https://nownownow.com/about">now page</A>, updated every month or so.
          </p>
        </div>
      </section>
    </Layout>
  )
}
