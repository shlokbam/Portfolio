import { useCallback, useEffect, useRef, useState } from 'react'
import A from './A'
import ChatWidget from './ChatWidget'
import { useSite } from '../lib/site'
import { css } from '../lib/css'
import { RESUME } from '../lib/links'
import { useIstClock } from '../lib/clock'

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

export default function Layout({ page, vtab, curtain, chat, greeting = GREETING, footerStyle, back, children }) {
  const { t, isDark, isLight, toggleTheme } = useSite()
  const [menuOpen, setMenuOpen] = useState(false)
  const clock = useIstClock()
  const root = useRef(null)

  useEffect(() => {
    if (!menuOpen) return
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => { html.style.overflow = prev; window.removeEventListener('keydown', onKey) }
  }, [menuOpen])

  const onMove = useCallback((e) => {
    if (!root.current) return
    root.current.style.setProperty('--cx', e.clientX + 'px')
    root.current.style.setProperty('--cy', e.clientY + 'px')
  }, [])

  const openMenu = () => setMenuOpen(true)
  const closeMenu = () => setMenuOpen(false)
  const current = (PAGES.find((p) => p[4] === page) || PAGES[2])[4]
  const pages = PAGES.map(([n, name, file, desc, key], i) => ({
    n, name, file, desc, style: '--i: ' + i + ((current === key || (page === 'casestudy' && key === 'work')) ? '; color: var(--accent)' : '')
  }))

  const tokens = {
    '--bg': t.bg, '--surface': t.surface, '--surface2': t.surface2, '--line': t.line, '--text': t.text,
    '--muted': t.muted, '--muted2': t.muted2, '--dot': t.dot, '--accent': t.accent, '--onaccent': t.onaccent,
    background: 'var(--bg)', color: 'var(--text)', overflowX: 'clip'
  }

  return (
    <div className={'pg-' + page}>
      <div className="sb" ref={root} onMouseMove={onMove} style={tokens}>
        <a className="skip mono" href="#main">Skip to content</a>
        <div className="prog" style={{ position: 'fixed', top: '0', left: '0', right: '0', height: '2px', background: 'var(--accent)', zIndex: '80' }} />
        {curtain && <div className="curtain" aria-hidden="true"><div className="ct mono">{curtain}</div></div>}

        <header style={{ position: 'fixed', top: '0', left: '0', right: '0', zIndex: '70', background: 'color-mix(in srgb, var(--bg) 78%, transparent)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid var(--line)' }}>
          <div className="wrap" style={{ height: '76px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
            <A href="/" className="sig" aria-label="Shlok Bam — home" style={{ fontSize: '38px', lineHeight: '1' }}>Shlok Bam</A>
            {back
              ? <A className="mono hide-lg ul" href="/work" style={{ color: 'var(--muted)' }}>← Back to all work</A>
              : (
                <span className="mono hide-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: 'var(--muted)' }}>
                  <span className="pulse" style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#2fd47a', color: '#2fd47a' }} />
                  Open to opportunities · Pune, IN · {clock} IST
                </span>
              )}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <A className="pill mono hide-sm" href={RESUME} style={{ height: '44px', padding: '0 18px', borderRadius: '999px', border: '1px solid var(--line)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Résumé{' '}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M12 4v13M6 11l6 6 6-6M5 20h14" /></svg>
              </A>
              <button type="button" className="pill" onClick={toggleTheme} aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'} style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid var(--line)', background: 'transparent', color: 'var(--text)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                {isDark && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <circle cx="12" cy="12" r="4.5" />
                    <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
                  </svg>
                )}
                {isLight && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" /></svg>
                )}
              </button>
              <button type="button" className="pill mono" onClick={openMenu} aria-haspopup="dialog" aria-expanded={menuOpen} style={{ height: '44px', padding: '0 18px', borderRadius: '999px', border: '1px solid var(--text)', background: 'var(--text)', color: 'var(--bg)', display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                Menu{' '}
                <svg width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M0 1h16M6 9h10" /></svg>
              </button>
            </div>
          </div>
        </header>
        <button type="button" className="vtab mono" onClick={openMenu} aria-label="Open menu">
          <span className="vdot" />
          {vtab}
        </button>

        {menuOpen && (
          <div className="menu dots" role="dialog" aria-modal="true" aria-label="Site menu">
            <div className="wrap" style={{ paddingTop: '16px', paddingBottom: '48px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
                <span className="sig" style={{ fontSize: '38px', lineHeight: '1' }}>Shlok Bam</span>
                <button type="button" className="pill mono" onClick={closeMenu} autoFocus style={{ height: '44px', padding: '0 18px', borderRadius: '999px', border: '1px solid var(--text)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                  Close{' '}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19" /></svg>
                </button>
              </div>
              <div className="g-menu" style={{ marginTop: '36px' }}>
                <nav aria-label="Pages">
                  {pages.map((pg) => (
                    <A key={pg.n} className="mlink" href={pg.file} onClick={closeMenu} style={css(pg.style)}>
                      <span className="mono" style={{ color: 'var(--muted)' }}>{pg.n}</span>
                      <span className="mname disp" style={{ fontSize: 'clamp(36px, 5vw, 72px)' }}>{pg.name}</span>
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

        <main id="main">{children}</main>

        <footer style={css(footerStyle)}>
          <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '32px', flexWrap: 'wrap' }}>
            <div>
              <span className="sig" style={{ fontSize: '72px', lineHeight: '1', color: 'var(--accent)' }}>Shlok Bam</span>
              <div className="mono" style={{ color: 'var(--muted)', marginTop: '12px' }}>© {new Date().getFullYear()} · Built with React + FastAPI</div>
            </div>
            <div className="mono" style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
              <A className="ul" href="https://github.com/shlokbam">GitHub ↗</A>
              <A className="ul" href="https://www.linkedin.com/in/shlokbam/">LinkedIn ↗</A>
              <A className="ul" href="https://x.com/shlok_bam">X ↗</A>
              <A className="ul" href={RESUME}>Résumé ↓</A>
            </div>
            <A className="mono ul" href="#top">Back to top ↑</A>
          </div>
        </footer>

        {chat && <ChatWidget greeting={greeting} />}
      </div>
    </div>
  )
}
