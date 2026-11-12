import { useEffect, useRef, useState } from 'react'
import { useIstTime } from '../lib/clock'
import { track } from '../lib/track'

// Header clock: the time in Pune, ticking each second. Hover (or focus) it and the digits spin like a slot
// machine before settling, and a panel drops down: an analog clock, the visitor's own time and how far
// they are from Pune, and whether it's a good moment to call (phone hours from content/profile.js).
const pad = (n) => String(n).padStart(2, '0')
const WEEKEND = ['Sat', 'Sun']

function status(t) {
  const callable = !WEEKEND.includes(t.day) && t.h >= 9 && t.h < 18
  if (callable) return ['on', 'Good time to call · Mon–Fri, 9–6 IST']
  if (t.h < 7) return ['off', 'Probably asleep · email works, he’ll reply in the morning']
  if (t.h >= 18) return ['mid', 'Evening in Pune · probably building something']
  return ['mid', 'Outside call hours · email works anytime']
}

// the visitor's time zone and how far it is from IST (UTC+5:30)
function visitor() {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
    const mins = 330 + new Date().getTimezoneOffset() // IST minus the visitor's offset
    const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
    const city = zone.split('/').pop().replace(/_/g, ' ').replace('Calcutta', 'Kolkata')
    if (mins === 0) return { time, city, gap: 'Same time as Pune' }
    const h = Math.floor(Math.abs(mins) / 60), m = Math.abs(mins) % 60
    return { time, city, gap: 'Pune is ' + h + ' h' + (m ? ' ' + m + ' m' : '') + (mins > 0 ? ' ahead of you' : ' behind you') }
  } catch (e) { return null }
}

export default function HeaderClock() {
  const t = useIstTime()
  const [hot, setHot] = useState(false)
  const [spin, setSpin] = useState(0) // bumps on each hover, restarting the slot-machine roll
  const told = useRef(false)
  const you = hot ? visitor() : null
  useEffect(() => { if (hot && !told.current) { told.current = true; track('clock_hover') } }, [hot])

  const open = () => { setHot(true); setSpin((n) => n + 1) }
  const close = () => setHot(false)
  const digits = t ? pad(t.h) + ':' + pad(t.m) + ':' + pad(t.s) : '--:--:--'
  const [tone, line] = t ? status(t) : ['mid', '']
  // hand angles: seconds, minutes and hours, each moving smoothly with the smaller unit
  const sec = t ? t.s * 6 : 0, min = t ? (t.m + t.s / 60) * 6 : 0, hr = t ? ((t.h % 12) + t.m / 60) * 30 : 0

  return (
    <span className={'hclock' + (hot ? ' hot' : '')} tabIndex={0} onMouseEnter={open} onMouseLeave={close} onFocus={open} onBlur={close}
      aria-label={t ? 'Time in Pune: ' + digits + ' IST' : 'Time in Pune'}>
      <span className="pulse hclock-dot" aria-hidden="true" />
      <span className="hclock-digits" aria-hidden="true" key={spin}>
        {digits.split('').map((ch, i) => (
          ch === ':' ? <span key={i} className="hclock-colon">:</span>
            : <span key={i} className="hclock-d" style={{ '--i': i }}><span suppressHydrationWarning>{ch}</span></span>
        ))}
      </span>
      <span className="mono hclock-zone" aria-hidden="true">IST</span>

      {hot && t && (
        <span className="hclock-panel" role="tooltip">
          <svg className="hclock-face" viewBox="-50 -50 100 100" aria-hidden="true">
            <circle r="46" className="hclock-rim" />
            {Array.from({ length: 12 }, (_, i) => <line key={i} y1="-41" y2={i % 3 ? '-37' : '-33'} transform={'rotate(' + i * 30 + ')'} className="hclock-tick" />)}
            <line y2="-22" transform={'rotate(' + hr + ')'} className="hclock-hh" />
            <line y2="-33" transform={'rotate(' + min + ')'} className="hclock-mh" />
            <line y1="8" y2="-38" transform={'rotate(' + sec + ')'} className="hclock-sh" />
            <circle r="2.6" className="hclock-pin" />
          </svg>
          <span className="hclock-info">
            <span className="mono hclock-k">Pune, India · UTC+5:30</span>
            <b className="hclock-big">{pad(t.h)}:{pad(t.m)} <small>{t.day}</small></b>
            {you && <span className="hclock-you">Your time ({you.city}): <b>{you.time}</b><br /><span>{you.gap}</span></span>}
            <span className={'mono hclock-status ' + tone}><i aria-hidden="true" />{line}</span>
          </span>
        </span>
      )}
    </span>
  )
}
