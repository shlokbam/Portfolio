import { useEffect, useState } from 'react'
import A from './A'
import { useSite } from '../lib/site'

// Shown in the chat while the API wakes from a cold start (Render's free tier sleeps when idle):
// a "booting the model" log with a time-based progress bar, rotating facts that link around the
// site, and a nudge to the arcade. Typed questions are queued meanwhile (see lib/site.jsx).

const EST = 45 // seconds a cold start usually takes

const LOG = [
  [0, 'cold start: the server was napping 😴'],
  [1.5, 'spinning up a container… ok'],
  [4, 'loading weights… {p}%'],
  [12, 'warming up attention heads…'],
  [22, "reading Shlok's résumé (again)…"],
  [32, 'polishing witty replies…'],
  [42, 'almost there, stretching…']
]

const FACTS = [
  ['185 briefs written by agents', 'See DailyDiff', '/work/dailydiff'],
  ['3 patents across India and South Africa', 'See the patents', '/recognition'],
  ['21 projects shipped, 5 of them flagships', 'Browse the work', '/work'],
  ['Founding Chair of ITSA: a 500+ attendee AI workshop', 'See the journey', '/journey'],
  ['100+ first-year students mentored', 'Meet the community', '/community'],
  ['9.01 CGPA in IT at VIT Pune', 'See the journey', '/journey']
]

// honest-ish: linear to 90% over the usual wait, then creeps towards 98%
const progress = (t) => (t < EST ? (t / EST) * 0.9 : 0.9 + 0.08 * (1 - Math.exp(-(t - EST) / 20)))

export default function WakeBoot({ compact }) {
  const { wakeAt } = useSite()
  const [t, setT] = useState(0)
  useEffect(() => {
    const tick = () => setT(wakeAt ? (Date.now() - wakeAt) / 1000 : 0)
    tick()
    const id = setInterval(tick, 250)
    return () => clearInterval(id)
  }, [wakeAt])

  const p = progress(t)
  const pct = Math.round(p * 100)
  const left = Math.max(0, Math.ceil(EST - t))
  const lines = LOG.filter(([at]) => t >= at)
  const fact = FACTS[Math.floor(t / 5) % FACTS.length]

  return (
    <div className={'wake' + (compact ? ' compact' : '')}>
      <div className="wake-term" role="status" aria-label={'Waking the assistant, about ' + pct + ' percent'}>
        <div className="wake-bar mono" aria-hidden="true">
          <span>boot.log</span>
          <span>{left ? '~' + left + 's left' : 'any second now'}</span>
        </div>
        <div className="wake-lines" aria-hidden="true">
          {lines.map(([at, text], i) => {
            const s = text.replace('{p}', String(pct))
            const last = i === lines.length - 1
            return (
              <div key={at} className={'wake-line' + (last ? ' cur' : '')} style={{ '--n': s.length }}>
                <span className="wake-pr">$</span> <span className="wake-tx">{s}</span>{last && <span className="wake-cur" />}
              </div>
            )
          })}
        </div>
        <div className="wake-prog" aria-hidden="true"><i style={{ transform: 'scaleX(' + p + ')' }} /></div>
      </div>

      <div className="wake-fact" key={fact[0]}>
        <span className="mono wake-k">Did you know?</span>
        <p>{fact[0]}</p>
        <A className="ul mono" href={fact[2]}>{fact[1]} →</A>
      </div>

      <div className="wake-foot">
        <span>Ask anyway: your question waits in line. The quick questions answer instantly.</span>
        <A className="ul mono" href="/contact#arcade">Bored? Play the arcade while you wait →</A>
      </div>
    </div>
  )
}
