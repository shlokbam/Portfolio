import { useEffect, useState } from 'react'
import A from './A'
import { api } from '../lib/api'
import { track } from '../lib/track'
import { OSS_SNAPSHOT, ossView, stars, ossDate } from '../content/opensource'

// Open source contributions (content/opensource.js). Rendered from the build's snapshot, so the prerendered
// HTML has real data, then refreshed from the live API (backend /api/opensource, GitHub search, cached 3 h).
// <OpenSourceSection> is the full list on the Work page; <OpenSourceStrip> the latest merge on Home.
const LABEL = { merged: 'Merged', open: 'In review', closed: 'Closed' }
const GH_PRS = 'https://github.com/pulls?q=is%3Apr+author%3Ashlokbam+-user%3Ashlokbam'

function useOpenSource() {
  const [data, setData] = useState(OSS_SNAPSHOT)
  useEffect(() => {
    let live = true
    api('/api/opensource', { timeout: 65000 })
      .then((res) => { if (live && res.data && res.data.prs && res.data.prs.length) setData(res.data) })
      .catch(() => {})
    return () => { live = false }
  }, [])
  return ossView(data)
}

const Out = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>
)
const click = (p, where) => () => track('oss_pr_click', { repo: p.repo, state: p.state, where })

export function OpenSourceSection() {
  const v = useOpenSource()
  if (!v.total) return null
  return (
    <section id="open-source" className="oss" aria-labelledby="oss-h" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="oss-head">
          <div>
            <span className="mono" style={{ color: 'var(--muted)' }}>Open source · live from GitHub</span>
            <h2 id="oss-h" className="disp oss-h">Upstream<span style={{ color: 'var(--accent)' }}>.</span></h2>
            <p className="serif oss-about">Fixes and features in other people’s projects, mostly LLM evaluation and document tooling.</p>
          </div>
          <A className="btn mono" href={GH_PRS} onClick={() => track('oss_all_click', { where: 'work' })} style={{ border: '1px solid var(--text)' }}>
            All on GitHub <Out />
          </A>
        </div>
        <div className="mono oss-stats">
          <span><b>{v.merged}</b> merged</span>
          <span><b>{v.open}</b> in review</span>
          {v.closed > 0 && <span><b>{v.closed}</b> closed</span>}
          <span><b>{v.repos.length}</b> projects</span>
        </div>
        <div className="oss-grid">
          {v.repos.map((r) => (
            <article key={r.name} className="oss-repo">
              <div className="oss-rtop">
                <A className="oss-rname" href={r.url}>
                  <span className="mono" style={{ color: 'var(--muted)' }}>{r.owner} /</span>
                  <b>{r.short}</b>
                </A>
                {r.stars != null && <span className="mono oss-stars" title={r.stars + ' stars on GitHub'}>★ {stars(r.stars)}</span>}
              </div>
              {r.description && <p className="oss-desc">{r.description}</p>}
              <ul className="oss-prs">
                {r.prs.map((p) => (
                  <li key={p.url}>
                    <A className={'oss-pr ' + p.state} href={p.url} onClick={click(p, 'work')}>
                      <span className="mono oss-state">{LABEL[p.state]}</span>
                      <span className="oss-title">{p.title}</span>
                      {p.note && <span className="oss-note">{p.note}</span>}
                      <span className="mono oss-meta">#{p.number} · {ossDate(p.merged || p.closed || p.created)}</span>
                    </A>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function OpenSourceStrip() {
  const v = useOpenSource()
  if (!v.total) return null
  const p = v.lastMerged || v.repos[0].prs[0]
  const repo = v.repos.find((r) => r.name === p.repo)
  return (
    <section className="oss-strip" aria-label="Open source contributions" style={{ borderBottom: '1px solid var(--line)' }}>
      <div className="wrap ser-strip-in">
        <div className="ser-strip-head">
          <span className="mono" style={{ color: 'var(--muted)' }}>Open source</span>
          <span className="ser-strip-count">{v.merged} merged · {v.open} in review</span>
          <span className="mono" style={{ color: 'var(--muted)', fontSize: '10px' }}>across {v.repos.length} projects</span>
        </div>
        <A className="ser-strip-post" href={p.url} onClick={click(p, 'home')}>
          <span className="mono" style={{ color: 'var(--accent)' }}>{p.state === 'merged' ? 'Latest merge' : LABEL[p.state]} · {p.repo}{repo && repo.stars != null ? ' · ★ ' + stars(repo.stars) : ''} · {ossDate(p.merged || p.created)}</span>
          <b>{p.title} <Out /></b>
        </A>
        <A className="btn mono ser-strip-all" href="/work#open-source" style={{ border: '1px solid var(--text)' }}>
          All {v.total} PRs{' '}
          <svg className="arr" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </A>
      </div>
    </section>
  )
}
