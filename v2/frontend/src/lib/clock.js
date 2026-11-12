import { useEffect, useState } from 'react'

function istClock() {
  try { return new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }) }
  catch (e) { return '--:--' }
}

// Current time in Pune (IST), refreshed every 20 s.
export function useIstClock() {
  const [clock, setClock] = useState(istClock)
  useEffect(() => {
    const id = setInterval(() => setClock(istClock()), 20000)
    return () => clearInterval(id)
  }, [])
  return clock
}

function istDateTime() {
  try {
    const d = new Date()
    const date = d.toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata', weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
    const time = d.toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    return date.replace(',', '') + ' · ' + time
  } catch (e) { return '--- -- --- ---- · --:--:--' }
}

// Full date and time in Pune (IST), ticking on each second. Keep it in a small leaf
// component so only that text re-renders.
export function useIstDateTime() {
  const [now, setNow] = useState(istDateTime)
  useEffect(() => {
    let id
    const tick = () => { setNow(istDateTime()); id = setTimeout(tick, 1000 - (Date.now() % 1000) + 5) }
    tick()
    return () => clearTimeout(id)
  }, [])
  return now
}

function istParts() {
  try {
    const d = new Date()
    const [h, m, s] = d.toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).split(':').map(Number)
    const day = d.toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata', weekday: 'short' })
    return { h: h % 24, m, s, day }
  } catch (e) { return null }
}

// Time in Pune (IST) as numbers, ticking on each second: { h, m, s, day } (null before the first tick on
// the server, so prerendered HTML and the first client render match).
export function useIstTime() {
  const [t, setT] = useState(null)
  useEffect(() => {
    let id
    const tick = () => { setT(istParts()); id = setTimeout(tick, 1000 - (Date.now() % 1000) + 5) }
    tick()
    return () => clearTimeout(id)
  }, [])
  return t
}
