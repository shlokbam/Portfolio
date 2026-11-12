import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { api } from './api'
import { track } from './track'

const SiteCtx = createContext(null)

// Colour tokens live in styles/global.css (keyed by html[data-theme]) so prerendered HTML
// is identical for both themes; only the page background colour is needed here.
const BG = { dark: '#0B0B0A', light: '#F2EFE7' }

const CHAT_FAIL = "Sorry, I couldn't reach my brain just now. Please try again in a moment, or email Shlok at shlokbam19103@gmail.com."

function applyTheme(theme) {
  const d = document.documentElement
  d.dataset.theme = theme
  d.style.background = BG[theme]
  d.style.colorScheme = theme
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', BG[theme])
  try { localStorage.setItem('sb-theme', theme) } catch (e) { /* storage blocked */ }
}

// The theme switch, as a View Transition: the new theme is revealed through a clip-path that grows from the
// button. To light: a sunburst of sharp rays, turning as it grows. To dark: a round blob whose edge ripples,
// while the old light page dims and blurs. Browsers without View Transitions, and visitors who prefer
// reduced motion, get an instant switch.
const RAYS = 16, STEPS = 24
function themeTransition(next, origin, swap) {
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce || !document.startViewTransition) { swap(); return }
  const r = origin ? origin.getBoundingClientRect() : null
  const x = r ? r.left + r.width / 2 : innerWidth - 40, y = r ? r.top + r.height / 2 : 40
  const R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  if (origin) { origin.classList.remove('tt-spin'); void origin.offsetWidth; origin.classList.add('tt-spin') }
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
  const frames = []
  for (let k = 0; k <= STEPS; k++) {
    const t = ease(k / STEPS), pts = []
    if (next === 'light') {
      // a starburst: alternate long and short points; the inner radius passes R, so the last frame covers the page
      const turn = t * Math.PI * 0.6
      for (let i = 0; i < RAYS * 2; i++) {
        const a = (i / (RAYS * 2)) * Math.PI * 2 + turn, rad = t * R * (i % 2 ? 1.25 : 2.1)
        pts.push((x + Math.cos(a) * rad).toFixed(1) + 'px ' + (y + Math.sin(a) * rad).toFixed(1) + 'px')
      }
    } else {
      // a blob: a circle with a rippling edge that calms down as it grows
      const n = 48, wob = 0.18 * (1 - t), turn = t * Math.PI
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2, rad = t * R * 1.15 * (1 + wob * Math.sin(a * 5 + turn * 3))
        pts.push((x + Math.cos(a + turn / 4) * rad).toFixed(1) + 'px ' + (y + Math.sin(a + turn / 4) * rad).toFixed(1) + 'px')
      }
    }
    frames.push({ clipPath: 'polygon(' + pts.join(',') + ')' })
  }
  const vt = document.startViewTransition(swap)
  vt.ready.then(() => {
    const root = document.documentElement, dur = next === 'light' ? 1100 : 1200
    root.animate(frames, { duration: dur, easing: 'linear', pseudoElement: '::view-transition-new(root)' })
    root.animate(next === 'light'
      ? [{ filter: 'none' }, { filter: 'brightness(1.6) saturate(1.3)' }]
      : [{ transform: 'none', filter: 'none' }, { transform: 'scale(.94)', filter: 'brightness(.45) blur(3px)' }],
    { duration: dur, easing: 'cubic-bezier(.7,0,.3,1)', pseudoElement: '::view-transition-old(root)' })
  }).catch(() => {})
}

export function SiteProvider({ children }) {
  const [theme, setTheme] = useState(() => (typeof document !== 'undefined' && document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'))

  useEffect(() => { applyTheme(theme) }, [theme])

  // Switching themes is animated (see themeTransition below): a sunburst of light, or a wobbling dark blob,
  // grows out of the button that was clicked. `e` is that click; without it the switch starts top right.
  const toggleTheme = useCallback((e) => {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'
    track('theme_toggle', { to: next })
    themeTransition(next, e && e.currentTarget, () => flushSync(() => { applyTheme(next); setTheme(next) }))
  }, [])

  // ---- API status. Render's free tier sleeps when idle, so the site pings it on load:
  // 'unknown' until the first answer, 'waking' if that takes over 1.5 s (a cold start),
  // then 'ready', or 'down' if it never answers. `woke` marks a waking → ready change.
  const [apiState, setApiState] = useState('unknown')
  const [wakeAt, setWakeAt] = useState(0)
  const [woke, setWoke] = useState(false)
  const apiRef = useRef(apiState)
  apiRef.current = apiState
  const markReady = useCallback(() => {
    if (apiRef.current === 'ready') return
    if (apiRef.current === 'waking') setWoke(true)
    setApiState('ready')
  }, [])
  const dismissWoke = useCallback(() => setWoke(false), [])

  useEffect(() => {
    let done = false
    const slowT = setTimeout(() => { if (!done) { setWakeAt(Date.now()); setApiState('waking') } }, 1500)
    const t0 = Date.now()
    const ping = () => api('/api/health', { timeout: 30000 }).then(() => { done = true; markReady() }).catch(() => {
      // keep trying for ~2 minutes; a cold start normally takes 30–60 s
      if (Date.now() - t0 < 120000) setTimeout(ping, 4000)
      else { done = true; setApiState((s) => (s === 'ready' ? s : 'down')) }
    })
    ping()
    return () => { done = true; clearTimeout(slowT) }
  }, [markReady])

  // ---- AI chat: one conversation shared by the floating widget and the home page.
  // While the API is waking, typed questions are queued (shown as such) and sent once it's up;
  // quick questions with a prepared answer reply at once.
  const [msgs, setMsgs] = useState([])
  const [busy, setBusy] = useState(false)
  const [slow, setSlow] = useState(false)
  const msgsRef = useRef(msgs)
  msgsRef.current = msgs

  // `qid` (queued questions): put the reply right under that question, not at the end
  // `sources`: the parts of the site the answer came from, shown as "From:" links under it
  const ask = useCallback(async (q, fallback, before, qid, fallbackSources) => {
    const reply = (text, sources) => setMsgs((m) => {
      const b = { who: 'b', text, sources: sources || [] }
      const i = qid ? m.findIndex((x) => x.id === qid) : -1
      return i < 0 ? m.concat([b]) : m.slice(0, i + 1).concat([b], m.slice(i + 1))
    })
    const history = before.slice(-6).map((m) => ({ role: m.who === 'u' ? 'user' : 'assistant', content: m.text }))
    setBusy(true)
    const slowT = setTimeout(() => setSlow(true), 6000)
    try {
      // generous timeout: a sleeping Render instance can take ~50 s to wake
      const res = await api('/api/chat', { method: 'POST', body: { message: q, history }, timeout: 65000 })
      markReady()
      if (res.reply) reply(res.reply, res.sources)
      else reply(fallback || CHAT_FAIL, fallback && fallbackSources)
    } catch (e) {
      if (e.status === 429) reply((e.data && e.data.reply) || 'You are asking quickly! Give me a few seconds and try again.')
      else reply(fallback || CHAT_FAIL, fallback && fallbackSources)
    } finally {
      clearTimeout(slowT)
      setBusy(false)
      setSlow(false)
    }
  }, [markReady])

  const send = useCallback((text, fallback, fallbackSources) => {
    const q = (text || '').trim()
    if (!q) return
    // which kind of question, never its text
    track('chat_question', { kind: fallback ? 'quick' : 'typed', page: location.pathname, api: apiRef.current })
    if (apiRef.current === 'waking') {
      setMsgs((m) => m.concat(fallback ? [{ who: 'u', text: q }, { who: 'b', text: fallback, sources: fallbackSources || [] }] : [{ who: 'u', text: q, queued: true, id: Date.now() + Math.random() }]))
      return
    }
    const before = msgsRef.current
    setMsgs((m) => m.concat([{ who: 'u', text: q }]))
    ask(q, fallback, before, undefined, fallbackSources)
  }, [ask])
  const clearChat = useCallback(() => setMsgs([]), [])

  // the API is up: send the queued questions, oldest first
  useEffect(() => {
    if (apiState !== 'ready' && apiState !== 'down') return
    if (busy) return
    const i = msgs.findIndex((m) => m.queued)
    if (i < 0) return
    const { id, text } = msgs[i]
    setMsgs((m) => m.map((x) => (x.id === id ? { who: 'u', text, id } : x)))
    ask(text, null, msgs.slice(0, i).filter((m) => !m.queued), id)
  }, [apiState, busy, msgs, ask])

  // ---- live data (fetched once per visit, on first use)
  const [stats, setStats] = useState(null)
  const [avail, setAvail] = useState(null)
  const asked = useRef({})
  const loadStats = useCallback(() => {
    if (asked.current.stats) return
    asked.current.stats = true
    const get = () => api('/api/stats', { timeout: 60000 }).then((r) => setStats(r.data || false))
    // one retry covers a cold start on the free tier
    get().catch(() => new Promise((res) => setTimeout(res, 8000)).then(get)).catch(() => setStats(false))
  }, [])
  const loadAvail = useCallback(() => {
    if (asked.current.avail) return
    asked.current.avail = true
    api('/api/availability', { timeout: 60000 }).then((r) => setAvail(r.statuses || null)).catch(() => setAvail(false))
  }, [])

  const value = useMemo(() => ({
    theme, toggleTheme,
    msgs, busy, slow, send, clearChat,
    apiState, wakeAt, woke, dismissWoke,
    stats, loadStats, avail, loadAvail
  }), [theme, toggleTheme, msgs, busy, slow, send, clearChat, apiState, wakeAt, woke, dismissWoke, stats, loadStats, avail, loadAvail])

  return <SiteCtx.Provider value={value}>{children}</SiteCtx.Provider>
}

export const useSite = () => useContext(SiteCtx)

export function useStats() {
  const s = useSite()
  useEffect(() => { s.loadStats() }, [s.loadStats])
  return s.stats
}

export function useAvailability() {
  const s = useSite()
  useEffect(() => { s.loadAvail() }, [s.loadAvail])
  return s.avail
}
