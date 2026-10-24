import { useCallback, useEffect, useRef, useState } from 'react'
import A from './A'
import ChatWidget from './ChatWidget'
import { useSite } from '../lib/site'
import { css } from '../lib/css'
import { RESUME } from '../lib/links'
import { useIstDateTime } from '../lib/clock'
import { lockScroll, unlockScroll, scrollToTop } from '../lib/smooth'

const PAGES = [
  ['00', 'Home', '/', 'Index', 'home'],
  ['01', 'About', '/about', 'Story & toolkit', 'about'],
  ['02', 'Work', '/work', '21 projects', 'work'],
  ['03', 'Journey', '/journey', 'Work · lead · study', 'journey'],
  ['04', 'Recognition', '/recognition', 'Patents & awards', 'recognition'],
  ['05', 'Community', '/community', 'Beyond code', 'community'],
  ['06', 'Writing', '/writing', 'Journal', 'writing'],
  ['07', 'Contact', '/contact', "Let's talk", 'contact']
]

const GREETING = "Hi! Ask me about Shlok's projects, patents, VIT Pune record or how to reach him."

// Header clock: its own component so the per-second tick re-renders only this text.
function LiveClock() {
  const now = useIstDateTime()
  return <span suppressHydrationWarning style={{ fontVariantNumeric: 'tabular-nums' }}>{now}</span>
}

function Brand({ as: Tag = A, ...props }) {
  return (
    <Tag className="brand" {...props}>
      <span className="brand-mark disp" aria-hidden="true">SB</span>
      <span className="brand-name disp">Shlok Bam<span style={{ color: 'var(--accent)' }}>.</span></span>
    </Tag>
  )
}

// Fixed "back to top" button; shows once the visitor has scrolled past the first screen.
function ToTop({ chat }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <button type="button" className={'totop' + (show ? ' on' : '') + (chat ? ' with-chat' : '')} onClick={() => scrollToTop()} aria-label="Back to top" tabIndex={show ? 0 : -1}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 20V5M6 11l6-6 6 6" /></svg>
    </button>
  )
}

export default function Layout({ page, curtain, chat, greeting = GREETING, footerStyle, back, children }) {
  const { toggleTheme } = useSite()
  const [menuOpen, setMenuOpen] = useState(false)
  const root = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return
    lockScroll()
    const opener = document.activeElement
    if (menuRef.current) menuRef.current.focus({ preventScroll: true })
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => {
      unlockScroll()
      window.removeEventListener('keydown', onKey)
      if (opener && opener.focus && document.contains(opener)) opener.focus({ preventScroll: true })
    }
  }, [menuOpen])

  // Mouse-follow glow: write the position only to [data-glow] elements, once per frame.
  // (Setting it on the page root made every element recalculate styles on each mouse move.)
  const raf = useRef(0)
  const onMove = useCallback((e) => {
    const x = e.clientX, y = e.clientY
    if (raf.current) return
    raf.current = requestAnimationFrame(() => {
      raf.current = 0
      if (!root.current) return
      root.current.querySelectorAll('[data-glow]').forEach((el) => {
        el.style.setProperty('--cx', x + 'px')
        el.style.setProperty('--cy', y + 'px')
      })
    })
  }, [])
  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  const openMenu = () => setMenuOpen(true)
  const closeMenu = () => setMenuOpen(false)
  const current = (PAGES.find((p) => p[4] === page) || PAGES[2])[4]
  const pages = PAGES.map(([n, name, file, desc, key], i) => ({
    n, name, file, desc, style: '--i: ' + i + ((current === key || (page === 'casestudy' && key === 'work')) ? '; color: var(--accent)' : '')
  }))

  return (
    <div className={'pg-' + page}>
      <div className="sb" ref={root} onMouseMove={onMove}>
        <a className="skip mono" href="#main">Skip to content</a>
        <div className="prog" style={{ position: 'fixed', top: '0', left: '0', right: '0', height: '2px', background: 'var(--accent)', zIndex: '80' }} />
        {curtain && <div className="curtain" aria-hidden="true"><div className="ct mono">{curtain}</div></div>}

        <header style={{ position: 'fixed', top: '0', left: '0', right: '0', zIndex: '70', background: 'color-mix(in srgb, var(--bg) 78%, transparent)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid var(--line)' }}>
          <div className="wrap" style={{ height: '76px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
            <Brand href="/" aria-label="Shlok Bam — home" />
            {back
              ? <A className="mono hide-lg ul" href="/work" style={{ color: 'var(--muted)' }}>← Back to all work</A>
              : (
                <span className="mono hide-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: 'var(--muted)' }}>
                  <span className="pulse" style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent)', color: 'var(--accent)' }} />
                  <LiveClock /> IST
                </span>
              )}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <A className="pill mono hide-sm" href={RESUME} style={{ height: '44px', padding: '0 18px', borderRadius: '999px', border: '1px solid var(--line)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Résumé{' '}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M12 4v13M6 11l6 6 6-6M5 20h14" /></svg>
              </A>
              <button type="button" className="pill" onClick={toggleTheme} aria-label="Toggle colour theme" style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid var(--line)', background: 'transparent', color: 'var(--text)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                {/* both icons render; CSS shows the one for the current theme */}
                <svg className="ic-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <circle cx="12" cy="12" r="4.5" />
                  <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
                </svg>
                <svg className="ic-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" /></svg>
              </button>
              <button type="button" className="pill mono" onClick={openMenu} aria-haspopup="dialog" aria-expanded={menuOpen} style={{ height: '44px', padding: '0 18px', borderRadius: '999px', border: '1px solid var(--text)', background: 'var(--text)', color: 'var(--bg)', display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                Menu{' '}
                <svg width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M0 1h16M6 9h10" /></svg>
              </button>
            </div>
          </div>
        </header>
        {page !== 'contact' && (
          <aside aria-label="Availability">
            <A className="vtab mono" href="/contact">
              <span className="vdot" style={{ background: '#2fd47a' }} />
              Open to opportunities · Let's talk
            </A>
          </aside>
        )}

        {menuOpen && (
          // a click anywhere that isn't a link closes the menu (links close it as they navigate)
          <div className="menu dots" role="dialog" aria-modal="true" aria-label="Site menu" tabIndex={-1} ref={menuRef} onClick={(e) => { if (!e.target.closest('a, button')) closeMenu() }}>
            <div className="wrap" style={{ paddingTop: '16px', paddingBottom: '48px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
                <Brand as="span" />
                <span className="mono" style={{ color: 'var(--muted)' }}>
                  <span className="hide-sm">Click anywhere to close · Esc</span>
                  <button type="button" className="sr-only" onClick={closeMenu}>Close menu</button>
                </span>
              </div>
              <div className="g-menu" style={{ marginTop: '36px' }}>
                <nav aria-label="Pages">
                  {pages.map((pg) => (
                    <A key={pg.n} className="mlink" href={pg.file} onClick={closeMenu} style={css(pg.style)}>
                      <span className="mono" style={{ color: 'var(--muted)' }}>{pg.n}</span>
                      <span className="mname disp" style={{ fontSize: 'clamp(34px, 4.3vw, 66px)' }}>{pg.name}</span>
                      <span className="mdesc mono hide-sm">{pg.desc}</span>
                    </A>
                  ))}
                </nav>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '26px', paddingBottom: '12px' }}>
                  <div>
                    <div className="mono" style={{ color: 'var(--muted)' }}>Email</div>
                    <A className="ul" href="mailto:shlokbam19103@gmail.com" style={{ display: 'inline-block', marginTop: '10px', fontSize: '21px', fontWeight: '600' }}>shlokbam19103@gmail.com</A>
                  </div>
                  <div>
                    <div className="mono" style={{ color: 'var(--muted)' }}>Phone</div>
                    <A className="ul" href="tel:+917974670370" style={{ display: 'inline-block', marginTop: '10px', fontSize: '18px' }}>+91 79746 70370</A>
                  </div>
                  <div>
                    <div className="mono" style={{ color: 'var(--muted)' }}>Elsewhere</div>
                    <div style={{ display: 'flex', gap: '20px', marginTop: '10px', flexWrap: 'wrap', fontSize: '18px' }}>
                      <A className="ul" href="https://github.com/shlokbam">GitHub ↗</A>
                      <A className="ul" href="https://www.linkedin.com/in/shlokbam/">LinkedIn ↗</A>
                      <A className="ul" href="https://x.com/shlok_bam">X ↗</A>
                    </div>
                  </div>
                  <A className="btn mono" href={RESUME} style={{ alignSelf: 'flex-start', background: 'var(--accent)', color: 'var(--onaccent)' }}>
                    Download résumé{' '}
                    <svg className="arr" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M12 4v13M6 11l6 6 6-6" /></svg>
                  </A>
                </div>
              </div>
            </div>
          </div>
        )}

        <main id="main" tabIndex={-1}>{children}</main>

        <footer className="site-foot" style={css(footerStyle)}>
          <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '32px', flexWrap: 'wrap' }}>
            <div>
              <p className="serif" style={{ margin: '0', fontSize: 'clamp(26px, 2.6vw, 36px)', lineHeight: '1.1' }}>Turning messy problems into systems that think.</p>
              <div className="mono" style={{ color: 'var(--muted)', marginTop: '14px' }}>© {new Date().getFullYear()} Shlok Bam · Designed &amp; engineered in Pune, India</div>
            </div>
            <div className="mono" style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
              <A className="ul" href="https://github.com/shlokbam">GitHub ↗</A>
              <A className="ul" href="https://www.linkedin.com/in/shlokbam/">LinkedIn ↗</A>
              <A className="ul" href="https://x.com/shlok_bam">X ↗</A>
              <A className="ul" href={RESUME}>Résumé ↓</A>
            </div>
          </div>
          <div className="foot-big disp" aria-hidden="true">Shlok Bam</div>
        </footer>

        <ToTop chat={chat} />
        {chat && <ChatWidget greeting={greeting} />}
      </div>
    </div>
  )
}
