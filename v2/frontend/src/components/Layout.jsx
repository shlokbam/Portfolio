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

const SOCIAL = [
  ['GitHub', 'https://github.com/shlokbam', <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" /></svg>],
  ['LinkedIn', 'https://www.linkedin.com/in/shlokbam/', <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" /></svg>],
  ['X', 'https://x.com/shlok_bam', <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" aria-hidden="true"><path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64Z" /></svg>],
  ['LeetCode', 'https://leetcode.com/u/shlokbam05/', <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" aria-hidden="true"><path d="M13.48 0a1.37 1.37 0 0 0-.96.44L7.12 6.21l-2.8 3.02a5.55 5.55 0 0 0-1.27 2.52 5.62 5.62 0 0 0 .1 2.55c.17.62.45 1.21.83 1.75.22.31.46.6.73.86l4.35 4.4c1.12 1.13 2.66 1.69 4.24 1.69 1.57 0 3.12-.56 4.24-1.69l2.33-2.35a1.37 1.37 0 1 0-1.95-1.93l-2.33 2.35c-.56.57-1.4.88-2.29.88-.9 0-1.73-.31-2.29-.88l-4.35-4.4a2.9 2.9 0 0 1-.83-2.05c0-.78.3-1.52.83-2.05l2.79-3.02 5.4-5.77A1.37 1.37 0 0 0 13.48 0Zm-2.85 13.04a1.37 1.37 0 1 0 0 2.74h9.9a1.37 1.37 0 1 0 0-2.74h-9.9Z" /></svg>],
  ['Email', 'mailto:shlokbam19103@gmail.com', <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>]
]

// Header clock: its own component so the per-second tick re-renders only this text.
function LiveClock() {
  const now = useIstDateTime()
  return <span suppressHydrationWarning style={{ fontVariantNumeric: 'tabular-nums' }}>{now}</span>
}

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/_*#%'

// Brand wordmark: the letters "decode" from random glyphs, like tokens resolving,
// on first load and again on hover. Rendered as plain text on the server.
function useScramble(text) {
  const [out, setOut] = useState(text)
  const raf = useRef(0)
  const play = useCallback(() => {
    if (typeof window === 'undefined' || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    cancelAnimationFrame(raf.current)
    const t0 = performance.now()
    const step = (t) => {
      const k = (t - t0) / 55 - 3
      if (k >= text.length) { setOut(text); return }
      let s = ''
      for (let i = 0; i < text.length; i++) s += text[i] === ' ' || i < k ? text[i] : GLYPHS[(Math.random() * GLYPHS.length) | 0]
      setOut(s)
      raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
  }, [text])
  useEffect(() => { play(); return () => cancelAnimationFrame(raf.current) }, [play])
  return [out, play]
}

// Mark: an "AI core" — three tilted orbits with electrons circling a pulsing nucleus.
function Orb() {
  const ref = useRef(null)
  useEffect(() => {
    if (ref.current && matchMedia('(prefers-reduced-motion: reduce)').matches) ref.current.pauseAnimations()
  }, [])
  return (
    <svg ref={ref} className="orb" viewBox="0 0 44 44" width="44" height="44" aria-hidden="true">
      {[0, 60, 120].map((r, i) => (
        <g key={r} transform={`rotate(${r} 22 22)`}>
          <ellipse cx="22" cy="22" rx="19" ry="7" fill="none" stroke="currentColor" strokeOpacity=".45" strokeWidth="1.1" />
          <circle r="2.1" fill="var(--accent)">
            <animateMotion dur={`${2.4 + i * 0.7}s`} repeatCount="indefinite" path="M3 22a19 7 0 1 0 38 0a19 7 0 1 0 -38 0" />
          </circle>
        </g>
      ))}
      <circle className="orb-core" cx="22" cy="22" r="4.2" fill="currentColor" />
    </svg>
  )
}

function Brand({ as: Tag = A, ...props }) {
  const [text, play] = useScramble('PORTFOLIO')
  return (
    <Tag className="brand" onMouseEnter={play} {...props}>
      <Orb />
      <span className="brand-name mono" aria-hidden="true">{text}<span className="brand-caret" /></span>
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
            <Brand href="/" aria-label="Shlok Bam, home" />
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
                <Brand as="span" aria-hidden="true" />
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
                      <span className="mname disp" style={{ fontSize: 'clamp(30px, min(4.3vw, 6.2vh), 66px)' }}>{pg.name}</span>
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
          <div className="wrap">
            <div className="foot-top">
              <div>
                <p className="serif" style={{ margin: '0', fontSize: 'clamp(28px, 3vw, 44px)', lineHeight: '1.08', maxWidth: '16ch' }}>Turning messy problems into systems that think.</p>
                <A className="foot-mail" href="mailto:shlokbam19103@gmail.com">shlokbam19103@gmail.com <span aria-hidden="true">↗</span></A>
                <div className="foot-social">
                  {SOCIAL.map(([label, href, icon]) => (
                    <A key={label} href={href} className="soc" aria-label={label} title={label}>{icon}</A>
                  ))}
                </div>
              </div>
              <nav className="foot-col" aria-label="Footer">
                <div className="mono fh">Pages</div>
                {PAGES.map(([, name, file]) => <A key={file} className="ul" href={file}>{name}</A>)}
              </nav>
              <div className="foot-col">
                <div className="mono fh">Profiles</div>
                <A className="ul" href="https://leetcode.com/u/shlokbam05/">LeetCode ↗</A>
                <A className="ul" href="https://www.codechef.com/users/shlokbam">CodeChef ↗</A>
                <A className="ul" href="https://github.com/shlokbam">GitHub ↗</A>
              </div>
              <div className="foot-col">
                <div className="mono fh">Contact</div>
                <A className="ul" href="tel:+917974670370">+91 79746 70370</A>
                <span style={{ color: 'var(--muted)' }}>Pune, India · open to relocate</span>
                <A className="btn mono" href={RESUME} style={{ marginTop: '10px', alignSelf: 'flex-start', height: '46px', background: 'var(--accent)', color: 'var(--onaccent)' }}>Résumé ↓</A>
              </div>
            </div>
            <div className="mono foot-bar">
              <span>© {new Date().getFullYear()} Shlok Bam. All rights reserved. · <A className="ul" href="/resume">Résumé</A> · <A className="ul" href="/privacy">Privacy</A></span>
              <span>AI / Generative AI Engineer · building agentic &amp; LLM-powered systems</span>
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
