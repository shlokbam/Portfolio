import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { api } from './api'

const SiteCtx = createContext(null)

const DARK = { bg: '#0B0B0A', surface: '#131311', surface2: '#1B1B18', line: '#272622', text: '#F2EFE7', muted: '#A19D92', muted2: '#6E6A61', dot: '#242320', accent: '#FF5A1F', onaccent: '#0B0B0A', accentInk: '#C2410C' }
const LIGHT = { bg: '#F2EFE7', surface: '#E9E5DA', surface2: '#DFDACD', line: '#D2CCBD', text: '#11110F', muted: '#5B584F', muted2: '#A8A397', dot: '#D6D0C2', accent: '#B93A0B', onaccent: '#FFFFFF', accentInk: '#FF5A1F' }

const CHAT_FAIL = "Sorry — I couldn't reach my brain just now. Please try again in a moment, or email Shlok at shlokbam19103@gmail.com."

export function SiteProvider({ children }) {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme === 'light' ? 'light' : 'dark')
  const t = theme === 'dark' ? DARK : LIGHT

  useEffect(() => {
    const d = document.documentElement
    d.dataset.theme = theme
    d.style.background = t.bg
    d.style.colorScheme = theme
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', t.bg)
    try { localStorage.setItem('sb-theme', theme) } catch (e) { /* storage blocked */ }
  }, [theme, t.bg])

  const toggleTheme = useCallback(() => setTheme((x) => (x === 'dark' ? 'light' : 'dark')), [])

  // ---- AI chat: one conversation shared by the floating widget and the Contact page
  const [msgs, setMsgs] = useState([])
  const [busy, setBusy] = useState(false)
  const [slow, setSlow] = useState(false)
  const msgsRef = useRef(msgs)
  msgsRef.current = msgs

  const send = useCallback(async (text, fallback) => {
    const q = (text || '').trim()
    if (!q) return
    const history = msgsRef.current.slice(-6).map((m) => ({ role: m.who === 'u' ? 'user' : 'assistant', content: m.text }))
    setMsgs((m) => m.concat([{ who: 'u', text: q }]))
    setBusy(true)
    const slowT = setTimeout(() => setSlow(true), 6000)
    try {
      // generous timeout: a sleeping Render instance can take ~50 s to wake
      const res = await api('/api/chat', { method: 'POST', body: { message: q, history }, timeout: 65000 })
      setMsgs((m) => m.concat([{ who: 'b', text: res.reply || fallback || CHAT_FAIL }]))
    } catch (e) {
      const msg = e.status === 429 ? (e.data && e.data.reply) || 'You are asking quickly! Give me a few seconds and try again.' : fallback || CHAT_FAIL
      setMsgs((m) => m.concat([{ who: 'b', text: msg }]))
    } finally {
      clearTimeout(slowT)
      setBusy(false)
      setSlow(false)
    }
  }, [])
  const clearChat = useCallback(() => setMsgs([]), [])

  // Wake the API as soon as the site loads, so it is ready by the time someone asks the chatbot.
  useEffect(() => { api('/api/health', { timeout: 60000 }).catch(() => {}) }, [])

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
    theme, t, isDark: theme === 'dark', isLight: theme !== 'dark', toggleTheme,
    msgs, busy, slow, send, clearChat,
    stats, loadStats, avail, loadAvail
  }), [theme, t, toggleTheme, msgs, busy, slow, send, clearChat, stats, loadStats, avail, loadAvail])

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
