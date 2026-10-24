import { useEffect, useMemo, useRef, useState } from 'react'
import AIBackdrop from './AIBackdrop'
import Md from './Md'
import { useSite } from '../lib/site'

// "Ask my AI" on the home page: the portfolio assistant inline, dressed as a model inspector.
// The question is tokenised live as you type, a self-attention heatmap of it runs behind the
// section, replies stream in token by token, and a small network "thinks" while waiting.
// Shares its conversation with the floating chat widget.

// Prepared answers are shown if the live assistant can't be reached.
const QA = [
  ["What's his CGPA?", '9.01 CGPA through the sixth semester — B.Tech in Information Technology at Vishwakarma Institute of Technology, Pune.'],
  ['Best projects?', 'His flagships are DailyDiff (agentic tech curation), ResearchOS (multi-agent research), the Enterprise Workforce Training Platform (industry-sponsored), PaisaWise (privacy-first finance) and PromptVault (prompt version control).'],
  ['Patents?', 'Three as co-inventor: a YOLO wildlife-protection system (granted, CIPC South Africa), a fruit & vegetable quality classifier (filed, CIPC South Africa) and a TKPH tyre-health system (published, IPO India).'],
  ['Leadership?', 'Founding Chairperson of ITSA. Before that: Operations Head at Abhivriddhi, Chief Administrative at The Catalyst and Web Development Coordinator at CSI.'],
  ['How do I reach him?', 'Email shlokbam19103@gmail.com or call +91 79746 70370 (Mon–Fri, 9am–6pm IST). He is based in Pune and open to relocation.']
]

const STAGES = ['Reading the portfolio', 'Thinking', 'Writing the answer']

// a tiny word-piece style tokenizer, only for the visual: words, long words split, punctuation
function tokenize(text) {
  const out = []
  for (const m of text.matchAll(/[A-Za-z0-9']+|[^\sA-Za-z0-9']/g)) {
    const w = m[0]
    if (w.length > 7 && /^[A-Za-z]+$/.test(w)) { out.push(w.slice(0, 5)); out.push('##' + w.slice(5)) } else out.push(w)
  }
  return out
}
const tokId = (t) => { let h = 2166136261; for (const c of t) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return (h >>> 0) % 50257 }

export default function AskAI() {
  const { msgs: chat, busy, slow, send, clearChat } = useSite()
  const [q, setQ] = useState('')
  const [stage, setStage] = useState(0)
  const [shown, setShown] = useState({}) // message index -> characters revealed (streaming effect)
  const log = useRef(null)
  const seen = useRef(chat.length) // messages present on mount are shown in full
  const lastAsked = (chat.filter((m) => m.who === 'u').pop() || {}).text || ''
  const tokens = useMemo(() => tokenize(q), [q])

  useEffect(() => {
    if (chat.length && log.current) log.current.scrollTop = log.current.scrollHeight
  }, [chat.length, busy, shown])

  // cycle the "thinking" stages while waiting
  useEffect(() => {
    if (!busy) { setStage(0); return }
    const id = setInterval(() => setStage((s) => Math.min(STAGES.length - 1, s + 1)), 1400)
    return () => clearInterval(id)
  }, [busy])

  // stream new bot replies in, a few characters per frame
  useEffect(() => {
    const i = chat.length - 1
    if (i < seen.current || i < 0) { seen.current = chat.length; return }
    seen.current = chat.length
    const m = chat[i]
    if (m.who !== 'b' || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let n = 0, raf = 0
    const step = () => {
      n = Math.min(m.text.length, n + Math.max(2, Math.ceil(m.text.length / 90)))
      setShown((s) => ({ ...s, [i]: n }))
      if (n < m.text.length) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => { cancelAnimationFrame(raf); setShown((s) => ({ ...s, [i]: m.text.length })) }
  }, [chat])

  const ask = (e) => {
    e.preventDefault()
    if (busy || !q.trim()) return
    send(q)
    setQ('')
  }
  const streaming = chat.some((m, i) => m.who === 'b' && shown[i] !== undefined && shown[i] < m.text.length)

  return (
    <section className="ai-host askai" style={{ padding: '104px 0', borderBottom: '1px solid var(--line)', background: 'var(--surface)' }}>
      <AIBackdrop kind="attention" text={q || lastAsked} style={{ height: '420px', bottom: 'auto' }} />
      <div className="wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <span className="mono" style={{ color: 'var(--muted)' }}>Quick answers · live model</span>
            <h2 className="disp rv" style={{ margin: '20px 0 0', fontSize: 'clamp(48px, 6.4vw, 100px)' }}>
              Ask my{' '}
              <span className="serif" style={{ textTransform: 'none', fontWeight: '400', color: 'var(--accent)' }}>AI</span>
            </h2>
          </div>
          <span className="mono" style={{ color: 'var(--muted)' }}>Trained on my résumé</span>
        </div>

        <div className={'rv ask-box' + (busy || streaming ? ' working' : '')}>
          <div className="ask-head">
            <span className="ask-av disp" aria-hidden="true">SB</span>
            <div style={{ flex: '1', minWidth: '0' }}>
              <div style={{ fontWeight: '700', fontSize: '17px' }}>Shlok's AI assistant</div>
              <div className="mono" style={{ color: 'var(--muted)', fontSize: '10px' }}>
                <span className={'ask-led' + (busy ? ' on' : '')} aria-hidden="true" />
                {busy ? STAGES[stage] : streaming ? 'Streaming reply' : 'Online · answers drawn from his portfolio'}
              </div>
            </div>
            <button type="button" className="ask-btn mono" onClick={clearChat}>Clear</button>
          </div>

          <div className="ask-log" ref={log} aria-live="polite">
            <div className="ask-msg bot">Hi! I'm Shlok's AI representative. Ask me about his projects, VIT Pune record, patents, leadership — or how to reach him.</div>
            {chat.map((m, i) => {
              const n = shown[i]
              const partial = m.who === 'b' && n !== undefined && n < m.text.length
              return (
                <div key={i} className={'ask-msg ' + (m.who === 'u' ? 'me' : 'bot')}>
                  {m.who === 'u' ? m.text : <Md text={partial ? m.text.slice(0, n) : m.text} />}
                  {partial && <span className="ask-caret" aria-hidden="true" />}
                </div>
              )
            })}
            {busy && (
              <div className="ask-think" aria-label={STAGES[stage]}>
                <svg viewBox="0 0 120 44" width="120" height="44" aria-hidden="true">
                  {[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => <circle key={r + '-' + c} cx={14 + c * 46} cy={6 + r * 11} r="3.2" style={{ '--d': (c * 0.22 + r * 0.06) + 's' }} />))}
                </svg>
                <span className="mono">{STAGES[stage]}{slow ? ' — waking the server, first reply takes a moment' : ''}</span>
              </div>
            )}
          </div>

          <div className="ask-chips">
            {QA.map(([question, answer]) => (
              <button key={question} type="button" className="ask-btn mono" onClick={() => { if (!busy) send(question, answer) }} disabled={busy}>{question}</button>
            ))}
          </div>

          <form onSubmit={ask} className="ask-form">
            <label htmlFor="chat-inline" className="sr-only">Ask a question</label>
            <input id="chat-inline" type="text" value={q} onChange={(e) => setQ(e.target.value)} maxLength={500} autoComplete="off" placeholder="Ask anything about Shlok…" />
            <button type="submit" aria-label="Send" disabled={busy || !q.trim()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
          </form>
          <div className="ask-toks" aria-hidden="true">
            <span className="mono ask-toklab">{tokens.length ? tokens.length + ' tokens' : 'tokeniser'}</span>
            <div className="ask-tokrow">
              {tokens.length
                ? tokens.slice(-40).map((t, i) => <span key={i + t} className="ask-tok" style={{ '--h': (tokId(t) % 5) }}><b>{t}</b><i>{tokId(t)}</i></span>)
                : <span className="ask-tokhint mono">your question, split into tokens as you type</span>}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
