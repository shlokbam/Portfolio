import { useEffect, useRef, useState } from 'react'
import { getBest, setBest } from './best'

// Typing sprint: type a real one-liner from my stack as fast and cleanly as you can.
const SNIPPETS = [
  'graph.add_edge("skeptic", "verifier")',
  'app = FastAPI(title="DailyDiff")',
  'docker compose up --build -d',
  'chain = prompt | llm | StrOutputParser()',
  'retriever = db.as_retriever(search_type="mmr")',
  'terraform apply -auto-approve',
  'score = judge.evaluate(answer, rubric)',
  'git commit -m "ship it"'
]

export default function TypeSprint() {
  const [target, setTarget] = useState(SNIPPETS[0])
  const [typed, setTyped] = useState('')
  const [t0, setT0] = useState(0)
  const [result, setResult] = useState(null)
  const [best, setB] = useState(0)
  const [now, setNow] = useState(0)
  const input = useRef(null)

  useEffect(() => { setTarget(SNIPPETS[(Math.random() * SNIPPETS.length) | 0]); setB(getBest('wpm')) }, [])
  useEffect(() => {
    if (!t0 || result) return
    const id = setInterval(() => setNow(Date.now()), 100)
    return () => clearInterval(id)
  }, [t0, result])

  const onChange = (e) => {
    if (result) return
    const v = e.target.value.slice(0, target.length)
    if (!t0 && v) setT0(Date.now())
    setTyped(v)
    if (v.length === target.length) {
      const secs = (Date.now() - (t0 || Date.now())) / 1000 || 1
      let ok = 0
      for (let i = 0; i < v.length; i++) if (v[i] === target[i]) ok++
      const acc = Math.round((ok / target.length) * 100)
      const wpm = Math.round((ok / 5) / (secs / 60))
      setResult({ wpm, acc, secs: secs.toFixed(1) })
      if (wpm > getBest('wpm') && acc >= 90) { setBest('wpm', wpm); setB(wpm) }
    }
  }
  const next = () => {
    let n = target
    while (n === target) n = SNIPPETS[(Math.random() * SNIPPETS.length) | 0]
    setTarget(n); setTyped(''); setT0(0); setResult(null)
    setTimeout(() => input.current && input.current.focus(), 0)
  }
  const secs = t0 ? ((result ? 0 : now - t0) / 1000) : 0

  return (
    <div className="game">
      <div className="game-bar mono">
        <span>Time <b>{result ? result.secs : t0 ? Math.max(0, secs).toFixed(1) : '0.0'}s</b></span>
        <span>Best <b>{best ? best + ' wpm' : '—'}</b></span>
        <button type="button" className="pit-btn mono" onClick={next}>New line</button>
      </div>
      <div className="type-box" onClick={() => input.current && input.current.focus()}>
        <div className="type-target" aria-hidden="true">
          <span className="mono type-prompt">&gt;&gt;&gt;</span>
          {target.split('').map((ch, i) => {
            const c = i < typed.length ? (typed[i] === ch ? 'ok' : 'bad') : i === typed.length ? 'cur' : ''
            return <span key={i} className={'tc ' + c}>{ch === ' ' ? ' ' : ch}</span>
          })}
        </div>
        <label htmlFor="type-in" className="sr-only">Type this line: {target}</label>
        <input id="type-in" ref={input} className="type-in" value={typed} onChange={onChange} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} placeholder="Click here and start typing…" />
        {result && (
          <div className="type-res">
            <span><b className="disp">{result.wpm}</b><i className="mono">wpm</i></span>
            <span><b className="disp">{result.acc}%</b><i className="mono">accuracy</i></span>
            <button type="button" className="pit-btn mono solid" onClick={next}>Next line →</button>
          </div>
        )}
      </div>
    </div>
  )
}
