import A from './A'
import { track } from '../lib/track'
import { SERIES, ARCS, SERIES_POSTS, seriesDate } from '../content/linkedin'

// The LinkedIn series (content/linkedin.js). <SeriesSection> lists every part on the Writing page, grouped by
// arc; <SeriesStrip> is the one-line "latest part" strip on Home, linking to that section.
const Out = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>
)
const open = (p, where) => () => track('series_post_click', { part: p.part, where })

export function SeriesSection() {
  return (
    <section id="series" className="ser" aria-label={'LinkedIn series: ' + SERIES.name}>
      <div className="wrap">
        <div className="ser-head">
          <div>
            <span className="mono" style={{ color: 'var(--muted)' }}>On LinkedIn · a series</span>
            <h2 className="disp ser-name">{SERIES.name}<span style={{ color: 'var(--accent)' }}>.</span></h2>
            <p className="serif ser-about">{SERIES.about}</p>
          </div>
          <A className="btn mono" href={SERIES.follow} onClick={() => track('series_follow_click', { where: 'writing' })} style={{ border: '1px solid var(--text)' }}>
            Follow on LinkedIn <Out />
          </A>
        </div>
        {ARCS.map((arc) => {
          const posts = SERIES_POSTS.filter((p) => p.arc === arc.n)
          return (
            <div key={arc.n} className="ser-arc">
              <div className="mono ser-arcline">
                <span>Arc {arc.n} · {arc.name}</span>
                <span style={{ color: posts.length ? 'var(--muted)' : 'var(--accent)' }}>{arc.status}</span>
              </div>
              {posts.length > 0 && (
                <div className="ser-grid">
                  {posts.map((p) => (
                    <A key={p.url} className="ser-card" href={p.url} onClick={open(p, 'writing')}>
                      <div className="mono ser-meta">
                        <span>Part {p.part}</span>
                        <span style={{ color: 'var(--accent)' }}>{p.topic}</span>
                      </div>
                      <b className="ser-title">{p.title}</b>
                      <span className="ser-sum">{p.summary}</span>
                      <span className="mono ser-foot"><span>{seriesDate(p.date)}</span><span>Read <Out /></span></span>
                    </A>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export function SeriesStrip() {
  const p = SERIES_POSTS[0]
  if (!p) return null
  const arc = ARCS.find((a) => a.n === p.arc)
  return (
    <section className="ser-strip" aria-label="Latest in the LinkedIn series" style={{ borderBottom: '1px solid var(--line)' }}>
      <div className="wrap ser-strip-in">
        <div className="ser-strip-head">
          <span className="mono" style={{ color: 'var(--muted)' }}>On LinkedIn · {SERIES.tag}</span>
          <span className="ser-strip-count">Part {p.part} of {SERIES.name}</span>
          <span className="mono ser-dots" aria-hidden="true">{SERIES_POSTS.slice().reverse().map((x) => <i key={x.url} className={x === p ? 'on' : ''} />)}</span>
        </div>
        <A className="ser-strip-post" href={p.url} onClick={open(p, 'home')}>
          <span className="mono" style={{ color: 'var(--accent)' }}>{p.topic} · {seriesDate(p.date)}{arc ? ' · Arc ' + arc.n + ': ' + arc.name : ''}</span>
          <b>{p.title} <Out /></b>
          <span className="ser-sum">{p.summary}</span>
        </A>
        <A className="btn mono ser-strip-all" href="/writing#series" style={{ border: '1px solid var(--text)' }}>
          All {SERIES_POSTS.length} parts{' '}
          <svg className="arr" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </A>
      </div>
    </section>
  )
}
