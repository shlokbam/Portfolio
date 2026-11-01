import { Link, useNavigate } from 'react-router-dom'
import { pageFor } from '../routes'
import { scrollToTop, scrollToEl } from '../lib/smooth'

// One anchor for every link in the mockup markup:
// internal routes use the router, "#top" and other same-page "#id" links scroll smoothly,
// files and external sites open in a new tab.
export default function A({ href = '', children, onClick, ...rest }) {
  if (href === '#top') {
    const top = (e) => { e.preventDefault(); scrollToTop(); onClick && onClick(e) }
    return <a href="#top" onClick={top} {...rest}>{children}</a>
  }
  if (href.startsWith('#')) {
    const to = (e) => {
      const el = document.getElementById(href.slice(1))
      if (el) { e.preventDefault(); scrollToEl(el) }
      onClick && onClick(e)
    }
    return <a href={href} onClick={to} {...rest}>{children}</a>
  }
  if (href.startsWith('/') && !href.startsWith('/static/')) {
    return <RouteLink href={href} onClick={onClick} {...rest}>{children}</RouteLink>
  }
  if (/^https?:\/\//.test(href) || href.startsWith('/static/')) {
    return <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} {...rest}>{children}</a>
  }
  return <a href={href} onClick={onClick} {...rest}>{children}</a>
}

// An in-app link that fetches its page's chunk on hover or touch, and on a click before it has
// arrived, waits for it and then navigates (instead of showing an empty page while it loads).
function RouteLink({ href, onClick, children, ...rest }) {
  const navigate = useNavigate()
  const Page = pageFor(href.split(/[?#]/)[0])
  const warm = () => { Page.load().catch(() => {}) }
  const click = (e) => {
    onClick && onClick(e)
    if (e.defaultPrevented || Page.ready() || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    Page.load().then(() => navigate(href), () => { location.href = href })
  }
  return <Link to={href} onClick={click} onMouseEnter={warm} onTouchStart={warm} onFocus={warm} {...rest}>{children}</Link>
}
