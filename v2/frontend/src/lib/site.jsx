import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { api } from './api'

const SiteCtx = createContext(null)

// Colour tokens live in styles/global.css (keyed by html[data-theme]) so prerendered HTML
// is identical for both themes; only the page background colour is needed here.
const BG = { dark: '#0B0B0A', light: '#F2EFE7' }

const CHAT_FAIL = "Sorry, I couldn't reach my brain just now. Please try again in a moment, or email Shlok at shlokbam19103@gmail.com."

export function SiteProvider({ children }) {
  const [theme, setTheme] = useState(() => (typeof document !== 'undefined' && document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'))

  useEffect(() => {
    const d = document.documentElement
    d.dataset.theme = theme
    d.style.background = BG[theme]
    d.style.colorScheme = theme
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', BG[theme])
    try { localStorage.setItem('sb-theme', theme) } catch (e) { /* storage blocked */ }
  }, [theme])

  const toggleTheme = useCallback(() => setTheme((x) => (x === 'dark' ? 'light' : 'dark')), [])

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
