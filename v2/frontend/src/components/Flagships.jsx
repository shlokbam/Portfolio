import A from './A'
import { track } from '../lib/track'
import { PROJECTS, slug } from '../content/projects'

// Home "Selected work": the five flagship projects (the first five in content/projects.js) as rows that open
// their place on the Work page (DailyDiff: its case study), so visitors who land on Home reach the work.
const FLAGSHIPS = 5

export default function Flagships() {
  const items = PROJECTS.slice(0, FLAGSHIPS)
  return (
    <section className="flag" aria-labelledby="flag-h" style={{ borderBottom: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="flag-head">
          <div>
            <span className="mono" style={{ color: 'var(--muted)' }}>Selected work · {FLAGSHIPS} of {PROJECTS.length}</span>
            <h2 id="flag-h" className="disp flag-h">What I’ve built<span style={{ color: 'var(--accent)' }}>.</span></h2>
          </div>
          <A className="btn mono" href="/work" onClick={() => track('home_project_click', { project: 'all' })} style={{ border: '1px solid var(--text)' }}>
            All {PROJECTS.length} projects{' '}
            <svg className="arr" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </A>
        </div>
        <ol className="flag-list">
          {items.map((p, i) => {
            const href = p.title === 'DailyDiff' ? '/work/dailydiff' : '/work#' + slug(p.title)
            return (
              <li key={p.title}>
                <A className="flag-row" href={href} onClick={() => track('home_project_click', { project: p.title })}>
                  <span className="mono flag-n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="flag-main">
                    <b className="flag-t">{p.title}</b>
                    <span className="flag-d">{p.desc}</span>
                  </span>
                  <span className="mono flag-tags hide-sm">{p.tags}</span>
                  <span className="flag-go" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </span>
                </A>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
