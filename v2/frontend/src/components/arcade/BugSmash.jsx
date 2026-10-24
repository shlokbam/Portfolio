import { useEffect, useRef, useState } from 'react'
import { getBest, setBest } from './best'

// Bug Smash: bugs pop out of the code for a moment — squash them. Don't squash the features.
const CELLS = 12
const LINES = ['def ship(agent):', '  plan = agent.plan()', '  for step in plan:', '    run(step)', 'graph.compile()', 'await judge(out)', 'if not passed:', '  retry(prompt)', 'db.commit()', 'return brief', 'deploy --prod', 'assert evals.ok']
const ROUND = 30

export default function BugSmash() {
  const [state, setState] = useState('idle') // idle | play | over
  const [left, setLeft] = useState(ROUND)
  const [score, setScore] = useState(0)
  const [best, setB] = useState(0)
  const [board, setBoard] = useState({}) // cell -> { kind: 'bug' | 'feat', id }
  const [fx, setFx] = useState({}) // cell -> 'hit' | 'oops'
  const timers = useRef([])
  const scoreRef = useRef(0)

  useEffect(() => { setB(getBest('bugs')) }, [])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.current.push(t); return t }

  const spawn = () => {
    setBoard((b) => {
      const free = [...Array(CELLS).keys()].filter((i) => !b[i])
      if (!free.length) return b
      const cell = free[(Math.random() * free.length) | 0]
      const kind = Math.random() < 0.22 ? 'feat' : 'bug'
      const id = Math.random()
      later(() => setBoard((bb) => (bb[cell] && bb[cell].id === id ? { ...bb, [cell]: undefined } : bb)), 650 + Math.random() * 550)
      return { ...b, [cell]: { kind, id } }
    })
  }

  const start = () => {
    timers.current.forEach(clearTimeout); timers.current = []
    scoreRef.current = 0
    setScore(0); setLeft(ROUND); setBoard({}); setFx({}); setState('play')
    const t0 = Date.now()
    const tick = () => {
      const remain = Math.max(0, ROUND - Math.floor((Date.now() - t0) / 1000))
      setLeft(remain)
      if (remain <= 0) {
        setState('over'); setBoard({})
        if (scoreRef.current > getBest('bugs')) { setBest('bugs', scoreRef.current); setB(scoreRef.current) }
        return
      }
      later(tick, 250)
    }
    tick()
    const loop = () => {
      if (Date.now() - t0 >= ROUND * 1000) return
      spawn()
      // speeds up as the round goes on
      later(loop, Math.max(260, 640 - (Date.now() - t0) / 80))
    }
    later(loop, 400)
  }

  const hit = (i) => {
    const c = board[i]
    if (state !== 'play' || !c) return
    const d = c.kind === 'bug' ? 1 : -2
    scoreRef.current = Math.max(0, scoreRef.current + d)
    setScore(scoreRef.current)
    setBoard((b) => ({ ...b, [i]: undefined }))
    setFx((f) => ({ ...f, [i]: c.kind === 'bug' ? 'hit' : 'oops' }))
    later(() => setFx((f) => ({ ...f, [i]: undefined })), 380)
  }

  return (
    <div className="game">
      <div className="game-bar mono">
        <span>Score <b>{score}</b></span>
        <span>Time <b>{left}s</b></span>
        <span>Best <b>{best}</b></span>
        <button type="button" className="pit-btn mono" onClick={start}>{state === 'play' ? 'Restart' : 'Start'}</button>
      </div>
      <div className={'bug-grid' + (state === 'play' ? ' live' : '')}>
        {LINES.map((ln, i) => (
          <button key={i} type="button" className={'bug-cell' + (fx[i] ? ' ' + fx[i] : '')} onClick={() => hit(i)} aria-label={board[i] ? (board[i].kind === 'bug' ? 'Bug — squash it' : 'Feature — leave it') : 'Line ' + (i + 1)}>
            <span className="mono bug-ln">{String(i + 1).padStart(2, '0')}</span>
            <code>{ln}</code>
            {board[i] && board[i].kind === 'bug' && (
              <svg key={board[i].id} className="bug" viewBox="0 0 32 32" width="38" height="38" aria-hidden="true">
                <ellipse cx="16" cy="18" rx="8" ry="10" fill="var(--accent)" />
                <circle cx="16" cy="8" r="4.5" fill="var(--accent)" />
                <path d="M16 9v19M8 14 3 11M8 19H2M8 24l-5 3M24 14l5-3M24 19h6M24 24l5 3M13 5l-3-3M19 5l3-3" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                <circle cx="13" cy="17" r="1.6" fill="var(--bg)" /><circle cx="19" cy="21" r="1.6" fill="var(--bg)" />
              </svg>
            )}
            {board[i] && board[i].kind === 'feat' && <span key={board[i].id} className="feat mono">✓ feature</span>}
          </button>
        ))}
        {state !== 'play' && (
          <div className="game-over">
            {state === 'over'
              ? <><b className="disp">{score}</b><span className="mono">bugs squashed{score >= best && score > 0 ? ' · new best!' : ''}</span></>
              : <><b className="disp">Bug smash</b><span className="mono">squash 🐞 · spare ✓ features · {ROUND}s</span></>}
            <button type="button" className="pit-btn mono solid" onClick={start}>{state === 'over' ? 'Play again' : 'Start'}</button>
          </div>
        )}
      </div>
    </div>
  )
}
