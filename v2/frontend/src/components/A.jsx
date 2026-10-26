import { Link } from 'react-router-dom'
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
    return <Link to={href} onClick={onClick} {...rest}>{children}</Link>
  }
  if (/^https?:\/\//.test(href) || href.startsWith('/static/')) {
    return <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} {...rest}>{children}</a>
  }
  return <a href={href} onClick={onClick} {...rest}>{children}</a>
}
