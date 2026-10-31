import { useEffect, useState } from 'react'
import A from './A'
import { api } from '../lib/api'

// Home "Shipping": recent commits to public GitHub repos (backend /api/shipping, automated commits
// left out) as a ticker that drifts sideways and stops under the pointer. Shows this week's count,
// or the month's when the week is quiet. Fetched after hydration; the prerendered HTML has the frame.
const GH = 'https://github.com/shlokbam'

function ago(iso) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000
  if (s < 3600) return Math.max(1, Math.round(s / 60)) + 'm ago'
  if (s < 86400) return Math.round(s / 3600) + 'h ago'
  const d = Math.round(s / 86400)
  return d === 1 ? 'yesterday' : d + 'd ago'
}

// "feat(pipeline): same-day retry" -> { kind: 'feat', text: 'Same-day retry' }
function parse(msg) {
  const m = msg.match(/^(\w+)(?:\([^)]*\))?!?:\s*(.+)$/)
  const text = m ? m[2] : msg
  return { kind: m ? m[1].toLowerCase() : '', text: text.charAt(0).toUpperCase() + text.slice(1) }
}

export default function Shipping() {
  const [data, setData] = useState(null) // null: loading · false: unavailable
  useEffect(() => {
    let live = true
    api('/api/shipping', { timeout: 65000 })
      .then((res) => { if (live) setData(res.data && res.data.commits.length ? res.data : false) })
      .catch(() => { if (live) setData(false) })
    return () => { live = false }
  }, [])

  const week = data && data.week >= 3
  const commits = data ? data.commits : []
  const head = data === null ? 'Checking GitHub…' : !data ? 'Commits are on GitHub' : week
    ? data.week + ' commits · ' + data.weekRepos + (data.weekRepos === 1 ? ' repo' : ' repos')
    : data.month + ' commits this month'

  return (
    <section className="ship" aria-label="Recently shipped" style={{ borderBottom: '1px solid var(--line)' }}>
      <div className="wrap ship-in">
        <div className="ship-head">
          <span className="mono" style={{ color: 'var(--muted)' }}><span className="ship-led" aria-hidden="true" />{week ? 'Shipped this week' : 'Recently shipped'}</span>
          <b className="ship-count">{head}</b>
        </div>
        <div className="ship-rail">
          {commits.length > 0 && (
            // the list twice, so the loop has no seam; the copy is hidden from screen readers
            <div className="ship-track" style={{ '--n': commits.length }}>
              {[0, 1].map((k) => (
                <ul key={k} className="ship-list" aria-hidden={k === 1 || undefined}>
                  {commits.map((c) => {
                    const p = parse(c.message)
                    return (
                      <li key={c.url}>
                        <A className="ship-item" href={c.url} tabIndex={k ? -1 : undefined}>
                          <span className="mono ship-repo">{c.repo}</span>
                          {p.kind && <span className="mono ship-kind">{p.kind}</span>}
                          <span className="ship-msg">{p.text}</span>
                          <span className="mono ship-ago">{ago(c.date)}</span>
                        </A>
                      </li>
                    )
                  })}
                </ul>
              ))}
            </div>
          )}
        </div>
        <A className="ul mono ship-gh" href={GH}>GitHub →</A>
      </div>
    </section>
  )
}
