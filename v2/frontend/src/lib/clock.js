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
