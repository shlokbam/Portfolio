// Hover card for a coding profile on the home page: a small chart drawn from the live
// /api/stats data (contest ratings for LeetCode and CodeChef, the contribution calendar for GitHub).
import { useId } from 'react'

const W = 300
const fmt = (v) => {
  const n = typeof v === 'string' && /^\d+$/.test(v) ? Number(v) : v
  return typeof n === 'number' ? n.toLocaleString('en-US') : n || '--'
}

function RatingChart({ data }) {
  const id = 'pk' + useId().replace(/:/g, '')
  if (!data || data.length < 2) return <Empty />
  const H = 110, px = 6, top = 14, bottom = 18
  const lo = Math.min(...data), hi = Math.max(...data)
  const pad = Math.max(10, (hi - lo) * 0.15)
  const y = (v) => top + (1 - (v - lo + pad) / (hi - lo + 2 * pad)) * (H - top - bottom)
  const x = (i) => px + (i / (data.length - 1)) * (W - 2 * px)
  const pts = data.map((v, i) => [x(i), y(v)])
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ')
  const area = line + ` L${x(data.length - 1).toFixed(1)} ${H - bottom} L${px} ${H - bottom} Z`
  const peak = data.indexOf(hi)
  const last = pts[pts.length - 1]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--accent)" stopOpacity=".28" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={px} x2={W - px} y1={top + f * (H - top - bottom)} y2={top + f * (H - top - bottom)} stroke="var(--line)" strokeDasharray="2 4" />
      ))}
      <line x1={px} x2={W - px} y1={H - bottom} y2={H - bottom} stroke="var(--line)" />
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={i === pts.length - 1 ? 4 : 2.2} fill={i === pts.length - 1 ? 'var(--accent)' : 'var(--surface2)'} stroke="var(--accent)" strokeWidth="1.5" />)}
      <text x={pts[peak][0]} y={pts[peak][1] - 8} textAnchor={peak > data.length / 2 ? 'end' : 'start'} className="pk-t">peak {hi}</text>
      {peak !== data.length - 1 && <text x={last[0]} y={last[1] - 9} textAnchor="end" className="pk-t">{data[data.length - 1]}</text>}
      <text x={px} y={H - 4} className="pk-t">contest 1</text>
      <text x={W - px} y={H - 4} textAnchor="end" className="pk-t">{data.length}</text>
    </svg>
  )
}

function Heatmap({ days, start }) {
  if (!days || !days.length || !start) return <Empty />
  const cell = 9, gap = 2, step = cell + gap, top = 14
  const d0 = new Date(start + 'T00:00:00Z')
  const offset = d0.getUTCDay()
  const cols = Math.ceil((days.length + offset) / 7)
  const nz = days.filter((n) => n > 0).sort((a, b) => a - b)
  const q = (f) => nz[Math.min(nz.length - 1, Math.floor(f * nz.length))] || 1
  const cuts = [q(0.25), q(0.5), q(0.75)]
  const level = (n) => (n <= 0 ? 0 : n <= cuts[0] ? 1 : n <= cuts[1] ? 2 : n <= cuts[2] ? 3 : 4)
  const fills = ['var(--line)', 'color-mix(in srgb, var(--accent) 30%, var(--surface2))', 'color-mix(in srgb, var(--accent) 55%, var(--surface2))', 'color-mix(in srgb, var(--accent) 80%, var(--surface2))', 'var(--accent)']
  const months = []
  for (let c = 0; c < cols; c++) {
    const d = new Date(d0.getTime() + (c * 7 - offset) * 864e5)
    const m = d.getUTCMonth()
    if (!months.length || months[months.length - 1].m !== m) months.push({ m, c, label: d.toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' }) })
  }
  const width = cols * step - gap
  return (
    <svg viewBox={`0 0 ${width} ${top + 7 * step - gap}`} width="100%" style={{ display: 'block' }}>
      {months.filter((m, i) => !(i === 0 && months[1] && months[1].c < 3)).map((m) => (
        <text key={m.c} x={m.c * step} y={9} className="pk-t">{m.label}</text>
      ))}
      {days.map((n, i) => {
        const k = i + offset
        return <rect key={i} x={Math.floor(k / 7) * step} y={top + (k % 7) * step} width={cell} height={cell} rx="2" fill={fills[level(n)]}><title>{n} on {new Date(d0.getTime() + i * 864e5).toISOString().slice(0, 10)}</title></rect>
      })}
    </svg>
  )
}

function Empty() {
  return <div className="mono" style={{ color: 'var(--muted)', padding: '28px 0', textAlign: 'center' }}>Live data loading…</div>
}

function Facts({ items }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`, gap: '10px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--line)' }}>
      {items.map(([k, v]) => (
        <div key={k}>
          <div style={{ fontWeight: '700', fontSize: '15px' }}>{fmt(v)}</div>
          <div className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '3px' }}>{k}</div>
        </div>
      ))}
    </div>
  )
}

export default function ProfilePeek({ kind, data = {} }) {
  let title, chart, facts
  if (kind === 'leetcode') {
    const e = data.easy || 0, m = data.medium || 0, h = data.hard || 0, t = e + m + h || 1
    title = 'Contest rating'
    chart = (
      <>
        <RatingChart data={data.ratingHistory} />
        <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', marginTop: '14px', background: 'var(--line)' }}>
          <span style={{ width: (e / t) * 100 + '%', background: '#2fb88a' }} />
          <span style={{ width: (m / t) * 100 + '%', background: '#e7a42c' }} />
          <span style={{ width: (h / t) * 100 + '%', background: '#e5484d' }} />
        </div>
        <div className="mono" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--muted)', marginTop: '6px' }}>
          <span>Easy {e}</span><span>Medium {m}</span><span>Hard {h}</span>
        </div>
      </>
    )
    facts = [['Contest rank', data.contestRanking], ['Global rank', data.ranking]]
  } else if (kind === 'codechef') {
    title = 'Rating history'
    chart = <RatingChart data={data.ratingHistory} />
    facts = [['Highest', data.highestRating], ['Global rank', data.globalRank], ['Stars', data.stars]]
  } else {
    const days = data.contributionDays || []
    title = 'Last 26 weeks'
    chart = <Heatmap days={days} start={data.contributionStart} />
    facts = [['In 26 weeks', days.length ? days.reduce((a, b) => a + b, 0) : undefined], ['Past year', data.contributions], ['Followers', data.followers]]
  }
  return (
    <div className="ppeek" aria-hidden="true">
      <div className="mono" style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', marginBottom: '14px' }}>
        <span>{title}</span>
        <span style={{ color: 'var(--accent)' }}>Live</span>
      </div>
      {chart}
      <Facts items={facts} />
    </div>
  )
}
