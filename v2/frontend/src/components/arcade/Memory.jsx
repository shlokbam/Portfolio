import { useEffect, useRef, useState } from 'react'
import SkillIcon from '../SkillIcon'
import { getBest, setBest } from './best'

// Memory: find the six pairs of logos from my stack in as few moves as possible.
const NAMES = ['Python', 'React', 'Docker', 'FastAPI', 'LangChain', 'PostgreSQL']

function deal() {
  const d = NAMES.concat(NAMES).map((n, i) => ({ n, k: i }))
  for (let i = d.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0;[d[i], d[j]] = [d[j], d[i]] }
  return d
}

export default function Memory() {
  const [cards, setCards] = useState(() => NAMES.concat(NAMES).map((n, i) => ({ n, k: i })))
  const [open, setOpen] = useState([])
  const [done, setDone] = useState([])
  const [moves, setMoves] = useState(0)
  const [best, setB] = useState(0)
  const lock = useRef(false)
  const t = useRef(0)

  useEffect(() => { setCards(deal()); setB(getBest('memory')) }, [])
  useEffect(() => () => clearTimeout(t.current), [])
  const won = done.length === NAMES.length

  const flip = (i) => {
    if (lock.current || open.includes(i) || done.includes(cards[i].n)) return
    const o = open.concat(i)
    setOpen(o)
    if (o.length < 2) return
    const m = moves + 1
    setMoves(m)
    if (cards[o[0]].n === cards[o[1]].n) {
      const d = done.concat(cards[i].n)
      setDone(d); setOpen([])
      if (d.length === NAMES.length) {
        const b = getBest('memory')
        if (!b || m < b) { setBest('memory', m); setB(m) }
      }
    } else {
      lock.current = true
      t.current = setTimeout(() => { setOpen([]); lock.current = false }, 750)
    }
  }
  const reset = () => { clearTimeout(t.current); lock.current = false; setCards(deal()); setOpen([]); setDone([]); setMoves(0) }

  return (
    <div className="game">
      <div className="game-bar mono">
        <span>Moves <b>{moves}</b></span>
        <span>Pairs <b>{done.length}/{NAMES.length}</b></span>
        <span>Best <b>{best || '—'}</b></span>
        <button type="button" className="pit-btn mono" onClick={reset}>Shuffle</button>
      </div>
      <div className="mem-grid">
        {cards.map((c, i) => {
          const up = open.includes(i) || done.includes(c.n)
          return (
            <button key={c.k} type="button" className={'mem-card' + (up ? ' up' : '') + (done.includes(c.n) ? ' got' : '')} onClick={() => flip(i)} aria-label={up ? c.n : 'Hidden card'}>
              <span className="mem-in">
                <span className="mem-face back disp" aria-hidden="true">?</span>
                <span className="mem-face front" aria-hidden="true"><SkillIcon name={c.n} size={34} /><span className="mono">{c.n}</span></span>
              </span>
            </button>
          )
        })}
        {won && (
          <div className="game-over">
            <b className="disp">{moves} moves</b>
            <span className="mono">all pairs found{moves === best ? ' · new best!' : ''}</span>
            <button type="button" className="pit-btn mono solid" onClick={reset}>Play again</button>
          </div>
        )}
      </div>
    </div>
  )
}
