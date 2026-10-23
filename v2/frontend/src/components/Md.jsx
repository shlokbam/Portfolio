import { Fragment } from 'react'

// Tiny renderer for the chatbot's replies: **bold**, "- " bullet lists, links, emails and phone numbers.
const TOKEN = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.]+|\+91[\s-]?\d{5}[\s-]?\d{5})/g

function inline(text) {
  return text.split(TOKEN).map((part, i) => {
    if (!part) return null
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
    if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>
    const md = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (md) return <a key={i} className="ul" href={md[2]} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>{md[1]}</a>
    if (/^https?:\/\//.test(part)) return <a key={i} className="ul" href={part} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', wordBreak: 'break-all' }}>{part.replace(/^https?:\/\//, '').replace(/\/$/, '')}</a>
    if (/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(part)) return <a key={i} className="ul" href={'mailto:' + part} style={{ color: 'var(--accent)' }}>{part}</a>
    if (/^\+91/.test(part)) return <a key={i} className="ul" href={'tel:' + part.replace(/[\s-]/g, '')} style={{ color: 'var(--accent)' }}>{part}</a>
    return <Fragment key={i}>{part}</Fragment>
  })
}

export default function Md({ text }) {
  const blocks = []
  let list = null
  for (const raw of String(text).split('\n')) {
    const line = raw.trim()
    const li = line.match(/^(?:[-*•]|\d+\.)\s+(.*)$/)
    if (li) {
      if (!list) { list = []; blocks.push({ list }) }
      list.push(li[1])
    } else {
      list = null
      if (line) blocks.push({ p: line })
    }
  }
  return blocks.map((b, i) => b.list
    ? <ul key={i} style={{ margin: '6px 0', paddingLeft: '18px' }}>{b.list.map((x, j) => <li key={j} style={{ margin: '3px 0' }}>{inline(x)}</li>)}</ul>
    : <p key={i} style={{ margin: i ? '8px 0 0' : '0' }}>{inline(b.p)}</p>)
}
