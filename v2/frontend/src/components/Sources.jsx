import { useLocation } from 'react-router-dom'
import A from './A'
import { scrollToEl, flash } from '../lib/smooth'

// "From: Work › PaisaWise" under an assistant reply: the parts of the site the answer came from.
// A link to the page you're already on just scrolls there (the router would ignore a repeat hash).
export default function Sources({ items, onGo }) {
  const { pathname } = useLocation()
  if (!items || !items.length) return null
  const go = (href) => (e) => {
    const [path, id] = href.split('#')
    const el = id && path === pathname && document.getElementById(id)
    if (el) { e.preventDefault(); scrollToEl(el); flash(el) }
    onGo && onGo()
  }
  return (
    <div className="srcs">
      <span className="mono">From</span>
      {items.map((s) => <A key={s.href} className="src mono" href={s.href} onClick={go(s.href)}>{s.label}</A>)}
    </div>
  )
}
