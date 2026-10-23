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
