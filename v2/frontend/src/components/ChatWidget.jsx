import { useEffect, useRef, useState } from 'react'
import { useSite } from '../lib/site'
import Md from './Md'

const CHIPS = ["What's his CGPA?", 'Best projects', 'How to contact']

export default function ChatWidget({ greeting }) {
  const { msgs, busy, slow, send } = useSite()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const listRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    const last = msgs[msgs.length - 1]
    // show a new answer from its first line; otherwise stick to the bottom
    if (last && last.who === 'b' && !busy) {
      const node = el.querySelector('[data-msg="' + (msgs.length - 1) + '"]')
      if (node) { el.scrollTop = node.offsetTop - 12; return }
    }
    el.scrollTop = el.scrollHeight
  }, [msgs, busy, open])
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus()
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const submit = (e) => {
    e.preventDefault()
    if (busy || !q.trim()) return
    send(q)
    setQ('')
  }

  return (
    <div className="chatdock" style={{ position: 'fixed', right: '24px', bottom: '24px', zIndex: '65', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '14px' }}>
      {open && (
        <div className="chatpanel" role="dialog" aria-label="Ask Shlok's AI" style={{ width: 'min(380px, calc(100vw - 48px))', borderRadius: '24px', border: '1px solid var(--line)', background: 'var(--bg)', boxShadow: '0 30px 80px rgba(0,0,0,.4)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--line)', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span className="sig" style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--accent)', color: 'var(--onaccent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>Sb</span>
            <div style={{ flex: '1' }}>
              <div style={{ fontWeight: '700' }}>Shlok's AI</div>
              <div className="mono" style={{ color: 'var(--muted)', fontSize: '10px' }}>Answers from his résumé</div>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid var(--line)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19" /></svg>
            </button>
          </div>
          <div ref={listRef} aria-live="polite" style={{ position: 'relative', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: 'min(420px, calc(100vh - 260px))', overflowY: 'auto' }}>
            <div style={{ background: 'var(--surface)', borderRadius: '18px 18px 18px 4px', padding: '14px 16px', fontSize: '15px', lineHeight: '1.5' }}>{greeting}</div>
            {msgs.map((m, i) => m.who === 'u'
              ? <div key={i} data-msg={i} style={{ alignSelf: 'flex-end', maxWidth: '85%', background: 'var(--accent)', color: 'var(--onaccent)', borderRadius: '18px 18px 4px 18px', padding: '12px 14px', fontSize: '15px', lineHeight: '1.5' }}>{m.text}</div>
              : <div key={i} data-msg={i} style={{ alignSelf: 'flex-start', maxWidth: '92%', background: 'var(--surface)', borderRadius: '18px 18px 18px 4px', padding: '14px 16px', fontSize: '15px', lineHeight: '1.5' }}><Md text={m.text} /></div>)}
            {busy && <div className="mono" style={{ color: 'var(--muted)', fontSize: '11px' }}><span className="typing">{slow ? 'Waking up the assistant — first reply takes a moment' : 'Thinking'}</span></div>}
            {!msgs.length && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {CHIPS.map((c) => (
                  <button key={c} type="button" className="pill mono" onClick={() => send(c)} disabled={busy} style={{ minHeight: '40px', padding: '0 12px', borderRadius: '999px', border: '1px solid var(--line)', background: 'transparent', color: 'var(--text)', fontSize: '10.5px', cursor: 'pointer' }}>{c}</button>
                ))}
              </div>
            )}
          </div>
          <form onSubmit={submit} style={{ padding: '14px', borderTop: '1px solid var(--line)', display: 'flex', gap: '10px' }}>
            <label htmlFor="chat-input" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Ask a question</label>
            <input id="chat-input" ref={inputRef} type="text" value={q} onChange={(e) => setQ(e.target.value)} maxLength={500} autoComplete="off" placeholder="Ask anything about Shlok…" style={{ flex: '1', minWidth: '0', height: '46px', padding: '0 16px', borderRadius: '999px', border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--text)', font: 'inherit', fontSize: '15px' }} />
            <button type="submit" aria-label="Send" disabled={busy || !q.trim()} style={{ width: '46px', height: '46px', borderRadius: '50%', border: 'none', background: 'var(--accent)', color: 'var(--onaccent)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', opacity: busy || !q.trim() ? '.6' : '1' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
          </form>
        </div>
      )}
      <button type="button" className="pill mono" onClick={() => setOpen((o) => !o)} aria-label="Ask my AI about Shlok" aria-expanded={open} style={{ height: '52px', padding: '0 20px 0 8px', borderRadius: '999px', border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--text)', display: 'inline-flex', alignItems: 'center', gap: '12px', cursor: 'pointer', boxShadow: '0 12px 30px rgba(0,0,0,.25)' }}>
        <span style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--onaccent)" strokeWidth="1.8" aria-hidden="true"><path d="M4 5h16v11H9l-5 4Z" /></svg>
        </span>
        Ask my AI
      </button>
    </div>
  )
}
