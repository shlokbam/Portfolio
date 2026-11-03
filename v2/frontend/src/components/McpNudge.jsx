import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import A from './A'
import { track } from '../lib/track'

// A small card, bottom-left, that points visitors to /ai (connect the MCP server to your own AI).
// Shows once per visit, after 25 s on the site or half-way down a page, and never over the chat or the
// "API is awake" notice. Closing it hides it for HIDE_DAYS; clicking through hides it for good.
// Ignored, it slides away after 15 s. Client-only: nothing is rendered on the server.
const KEY = 'sb-mcp-nudge'          // localStorage: 'done', or the time until which it stays hidden
const SEEN = 'sb-mcp-nudge-seen'    // sessionStorage: already shown in this visit
const START = 'sb-visit-start'      // sessionStorage: when this visit began (the timer spans page changes)
const HIDE_DAYS = 3
const AFTER_MS = 25000
const STAY_MS = 15000
const SKIP = ['/ai', '/contact', '/resume']
const QUESTIONS = ['What are Shlok’s best projects?', 'Is he a fit for an AI intern role?', 'What did he build with LangGraph?', 'Show me his patents.']

const store = (s, k, v) => { try { if (v === undefined) return s.getItem(k); s.setItem(k, v) } catch (e) { return null } }

function allowed() {
  if (typeof window === 'undefined') return false
  const v = store(localStorage, KEY)
  if (v === 'done' || (v && Number(v) > Date.now())) return false
  return !store(sessionStorage, SEEN)
}

// the chat window or the wake-up notice is on screen: wait
const busy = () => !!document.querySelector('.woke') || !!document.querySelector('.chatdock [aria-expanded="true"]')

function useTyping(on) {
  const [text, setText] = useState('')
  useEffect(() => {
    if (!on) return
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) { setText(QUESTIONS[0]); return }
    let q = 0, i = 0, dir = 1, t
    const step = () => {
      const full = QUESTIONS[q]
      i += dir
      setText(full.slice(0, i))
      if (dir > 0 && i >= full.length) { dir = -1; t = setTimeout(step, 1700); return }
      if (dir < 0 && i <= 0) { dir = 1; q = (q + 1) % QUESTIONS.length; t = setTimeout(step, 350); return }
      t = setTimeout(step, dir > 0 ? 45 : 18)
    }
    t = setTimeout(step, 500)
    return () => clearTimeout(t)
  }, [on])
  return text
}

export default function McpNudge() {
  const { pathname } = useLocation()
  const [state, setState] = useState('off') // off → in → out
  const shown = useRef(false)
  const text = useTyping(state === 'in')

  useEffect(() => {
    if (SKIP.includes(pathname) || !allowed()) return
    if (!store(sessionStorage, START)) store(sessionStorage, START, String(Date.now()))
    const since = Number(store(sessionStorage, START)) || Date.now()
    const show = () => {
      if (shown.current || !allowed()) return
      if (busy()) return // try again on the next tick
      shown.current = true
      store(sessionStorage, SEEN, '1')
      setState('in')
      track('mcp_nudge_shown', { page: location.pathname })
    }
    const halfway = () => {
      const max = document.documentElement.scrollHeight - innerHeight
      if (max > 0 && scrollY / max >= 0.5) show()
    }
    const tick = setInterval(() => { if (Date.now() - since >= AFTER_MS) show() }, 1000)
    addEventListener('scroll', halfway, { passive: true })
    return () => { clearInterval(tick); removeEventListener('scroll', halfway) }
  }, [pathname])

  // ignored: slide away after a while (it can show again on a later visit)
  useEffect(() => {
    if (state !== 'in') return
    const t = setTimeout(() => setState('out'), STAY_MS)
    return () => clearTimeout(t)
  }, [state])

  if (state === 'off') return null
  const close = () => { store(localStorage, KEY, String(Date.now() + HIDE_DAYS * 86400000)); track('mcp_nudge_closed'); setState('out') }
  const go = () => { store(localStorage, KEY, 'done'); track('mcp_nudge_clicked', { page: location.pathname }); setState('out') }
  return (
    <aside className={'mcpn' + (state === 'out' ? ' out' : '')} aria-label="Ask your own AI about Shlok" onAnimationEnd={(e) => e.target === e.currentTarget && state === 'out' && setState('off')}>
      <div className="mcpn-top mono">
        <span><span className="mcpn-dot" aria-hidden="true" />New · MCP server</span>
        <button type="button" onClick={close} aria-label="Close">✕</button>
      </div>
      <b className="mcpn-title">Ask your own AI about me.</b>
      <div className="mcpn-term mono" aria-hidden="true"><span>&gt; claude:</span> “{text}<span className="mcpn-caret" />”</div>
      <p className="mcpn-sub">Add my portfolio to Claude, ChatGPT or Cursor in a minute.</p>
      <A className="mcpn-go mono" href="/ai" onClick={go}>See how it works →</A>
    </aside>
  )
}
