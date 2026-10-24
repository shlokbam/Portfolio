import { Fragment } from 'react'
import Layout from '../components/Layout'
import A from '../components/A'
import { css } from '../lib/css'
import { useEffect, useRef, useState } from 'react'
import { useIstClock } from '../lib/clock'
import { sendMessage } from '../lib/contact'
import { RESUME, EMAIL } from '../lib/links'
import Arcade from '../components/Arcade'
import './Contact.css'

export default function Contact() {
  const clock = useIstClock()
  const [tp, setTopic] = useState('full')
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '', website: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('') // '' | 'yes' | 'no'
  const copyT = useRef(0)
  useEffect(() => () => clearTimeout(copyT.current), [])

  const title = "LET'S TALK".split('').map((ch, i) => ({ ch: ch === ' ' ? '\u00a0' : ch, style: '--i: ' + i }))
  // letters grouped by word, so a title only ever wraps between words
  const words = title.reduce((ws, l, i) => { if (l.ch === '\u00a0') ws.push([]); else ws[ws.length - 1].push({ ...l, i }); return ws }, [[]])
  const TOPICS = [['full', 'Full-time role'], ['intern', 'Internship'], ['collab', 'Collaboration'], ['free', 'Freelance'], ['hi', 'Just saying hi']]
  const topics = TOPICS.map(([id, label]) => ({
    label, pressed: tp === id ? 'true' : 'false',
    style: tp === id
      ? 'min-height: 44px; padding: 0 16px; border-radius: 999px; border: 1px solid var(--accent); background: var(--accent); color: var(--onaccent); cursor: pointer'
      : 'min-height: 44px; padding: 0 16px; border-radius: 999px; border: 1px solid var(--line); background: transparent; color: var(--text); cursor: pointer',
    pick: () => setTopic(id)
  }))
  const field = (k) => ({ value: form[k], onChange: (e) => setForm((f) => ({ ...f, [k]: e.target.value })) })
  const sent = status === 'sent'
  const notSent = !sent
  const submit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return
    const { name, email, message } = form
    if (!name.trim() || !email.trim() || !message.trim()) { setStatus('error'); setError('Please add your name, email and a message.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setStatus('error'); setError('That email address doesn\'t look right.'); return }
    setStatus('sending'); setError('')
    try {
      await sendMessage({ ...form, topic: (TOPICS.find((t) => t[0] === tp) || TOPICS[0])[1] })
      setStatus('sent')
      setForm({ name: '', email: '', company: '', message: '', website: '' })
    } catch (err) {
      setStatus('error')
      setError((err.data && err.data.message) || 'Something went wrong sending that. Please email me directly at ' + EMAIL + '.')
    }
  }
  const reset = () => { setStatus('idle'); setError('') }
  const copyLabel = copied === 'yes' ? 'Copied ✓' : copied === 'no' ? 'Press ⌘/Ctrl + C' : 'Copy address'
  const copyStyle = 'margin-top: 16px; min-height: 44px; padding: 0 18px; border-radius: 999px; cursor: pointer; transition: background-color .3s, color .3s; ' + (copied === 'yes' ? 'border: 1px solid var(--accent); background: var(--accent); color: var(--onaccent)' : 'border: 1px solid var(--line); background: transparent; color: var(--text)')
  const copyMail = async () => {
    const flash = (v) => {
      setCopied(v)
      clearTimeout(copyT.current)
      copyT.current = setTimeout(() => setCopied(''), 1800)
    }
    try {
      await navigator.clipboard.writeText(EMAIL)
      flash('yes')
    } catch (e) {
      // Clipboard API unavailable (insecure origin, permissions): fall back to a selection copy.
      const ta = document.createElement('textarea')
      ta.value = EMAIL
      ta.setAttribute('readonly', '')
      ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none'
      document.body.appendChild(ta)
      ta.select()
      let done = false
      try { done = document.execCommand('copy') } catch (err) { done = false }
      ta.remove()
      flash(done ? 'yes' : 'no')
    }
  }
  return (
    <Layout page="contact" curtain="Contact" chat footerStyle="padding: 56px 0 36px; border-top: 1px solid var(--line)">
      <section id="top" className="dots" style={{ position: "relative", paddingTop: "168px", paddingBottom: "56px", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="fade" style={{ "--d": ".3s", display: "flex", justifyContent: "flex-end", gap: "24px", flexWrap: "wrap" }}>
            <span className="mono" style={{ display: "inline-flex", gap: "10px", alignItems: "center" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#2fd47a" }} />
              Available for opportunity
            </span>
          </div>
          <h1 className="disp" aria-label="Let's talk" style={{ margin: "24px 0 0", fontSize: "min(clamp(48px, 12vw, 176px), calc((100vw - 80px) / 3.21))", fontStretch: "100%" }}>
            <span className="mask">
              {words.map((wd, wi) => (
                <Fragment key={wi}>
                  {wi > 0 && ' '}
                  <span style={{ whiteSpace: "nowrap" }}>
                    {wd.map((l) => <span key={l.i} className="ltr" aria-hidden="true" style={css(l.style)}>{l.ch}</span>)}
                    {wi === words.length - 1 && <span className="ltr" aria-hidden="true" style={{ "--i": "10", color: "var(--accent)" }}>.</span>}
                  </span>
                </Fragment>
              ))}
            </span>
          </h1>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "32px", flexWrap: "wrap", marginTop: "32px" }}>
            <p className="serif fade" style={{ "--d": ".6s", margin: "0", fontSize: "clamp(28px, 3vw, 44px)", maxWidth: "760px", lineHeight: "1.1" }}>Have a role or a problem worth solving? Tell me about it.</p>
            <A className="btn mono fade" href={RESUME} style={{ "--d": ".7s", background: "var(--accent)", color: "var(--onaccent)" }}>
              Download résumé{" "}
              <svg className="arr" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <path d="M12 4v13M6 11l6 6 6-6" />
              </svg>
            </A>
          </div>
          <div className="rule" style={{ marginTop: "44px" }} />
        </div>
      </section>
      <section style={{ padding: "96px 0 112px", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap g-contact">
          <div style={{ containerType: "inline-size", minWidth: "0" }}>
            <span className="mono" style={{ color: "var(--muted)" }}>Write to me</span>
            {" "}
            <A className="bigmail" href="mailto:shlokbam19103@gmail.com" style={{ display: "block", marginTop: "16px" }}>
              <span className="bm" style={{ display: "inline-block", fontSize: "min(46px, 7.6cqi)", fontWeight: "700", letterSpacing: "-.03em", whiteSpace: "nowrap" }}>shlokbam19103@gmail.com</span>
            </A>
            {" "}
            <button type="button" className="mono" onClick={copyMail} style={css(copyStyle)}>{copyLabel}</button>
            {" "}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "28px", marginTop: "52px" }}>
              <div>
                <div className="mono" style={{ color: "var(--muted)" }}>Call</div>
                <A className="ul" href="tel:+917974670370" style={{ display: "inline-block", marginTop: "10px", fontSize: "20px", fontWeight: "600" }}>+91 79746 70370</A>
                <div style={{ color: "var(--muted)", fontSize: "14px", marginTop: "6px" }}>Mon–Fri, 9am–6pm IST</div>
              </div>
              <div>
                <div className="mono" style={{ color: "var(--muted)" }}>Local time</div>
                <div className="disp" style={{ fontSize: "42px", marginTop: "10px" }} suppressHydrationWarning>{clock}</div>
                <div style={{ color: "var(--muted)", fontSize: "14px", marginTop: "6px" }}>Pune, Maharashtra · open to relocate</div>
              </div>
            </div>
            <div style={{ marginTop: "52px", borderTop: "1px solid var(--text)" }}>
              <A className="srow" href="https://www.linkedin.com/in/shlokbam/">
                <span style={{ fontSize: "24px", fontWeight: "700", letterSpacing: "-.02em" }}>LinkedIn</span>
                <span style={{ display: "flex", gap: "18px", alignItems: "center" }}>
                  <span className="mono hide-sm">in/shlokbam</span>
                  <svg className="sarr" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </A>
              {" "}
              <A className="srow" href="https://github.com/shlokbam">
                <span style={{ fontSize: "24px", fontWeight: "700", letterSpacing: "-.02em" }}>GitHub</span>
                <span style={{ display: "flex", gap: "18px", alignItems: "center" }}>
                  <span className="mono hide-sm">@shlokbam</span>
                  <svg className="sarr" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </A>
              {" "}
              <A className="srow" href="https://x.com/shlok_bam">
                <span style={{ fontSize: "24px", fontWeight: "700", letterSpacing: "-.02em" }}>X / Twitter</span>
                <span style={{ display: "flex", gap: "18px", alignItems: "center" }}>
                  <span className="mono hide-sm">@shlok_bam</span>
                  <svg className="sarr" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </A>
              {" "}
              <A className="srow" href={RESUME}>
                <span style={{ fontSize: "24px", fontWeight: "700", letterSpacing: "-.02em" }}>Résumé</span>
                <span style={{ display: "flex", gap: "18px", alignItems: "center" }}>
                  <span className="mono hide-sm">Shlok_Bam_Resume.pdf</span>
                  <svg className="sarr" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </A>
            </div>
          </div>
          <form aria-label="Contact form" onSubmit={submit} noValidate style={{ position: "relative",  border: "1px solid var(--line)", borderRadius: "28px", padding: "38px", background: "var(--surface)" }}>
            {notSent && (
              <>
                <div className="mono" style={{ color: "var(--muted)" }}>I'm reaching out about</div>
                <div role="group" aria-label="Topic" style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "14px" }}>
                  {topics.map((tp, tp_i) => (
                    <button key={tp_i} type="button" className="chip mono" onClick={tp.pick} aria-pressed={tp.pressed} style={css(tp.style)}>{tp.label}</button>
                  ))}
                </div>
                <div className="g-form" style={{ marginTop: "32px" }}>
                  <div className="fl">
                    <input id="cf-name" name="name" type="text" placeholder=" " autoComplete="name" required maxLength={120} {...field('name')} />
                    <label htmlFor="cf-name">Your name</label>
                    <span className="bar" />
                  </div>
                  <div className="fl">
                    <input id="cf-email" name="email" type="email" placeholder=" " autoComplete="email" required maxLength={200} {...field('email')} />
                    <label htmlFor="cf-email">Email</label>
                    <span className="bar" />
                  </div>
                </div>
                <div className="fl" style={{ marginTop: "26px" }}>
                  <input id="cf-company" name="company" type="text" placeholder=" " autoComplete="organization" maxLength={160} {...field('company')} />
                  <label htmlFor="cf-company">Company or team (optional)</label>
                  <span className="bar" />
                </div>
                <div className="fl" style={{ marginTop: "26px" }}>
                  <textarea id="cf-msg" name="message" rows="4" placeholder=" " required maxLength={5000} {...field('message')} style={{ resize: "vertical" }} />
                  <label htmlFor="cf-msg">Message</label>
                  <span className="bar" />
                </div>
                <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}>
                  <label htmlFor="cf-website">Website</label>
                  <input id="cf-website" name="website" type="text" tabIndex={-1} autoComplete="off" {...field('website')} />
                </div>
                <button type="submit" className="sendbtn mono" disabled={status === 'sending'} style={{ marginTop: "36px", width: "100%", height: "60px", border: "none", borderRadius: "999px", background: "var(--accent)", color: "var(--onaccent)", fontWeight: "500", fontSize: "13px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "14px", cursor: "pointer" }}>
                  {status === 'sending' ? 'Sending…' : 'Send message'}{" "}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
                {status === 'error' && <p role="alert" style={{ margin: "16px 0 0", color: "var(--accent)", fontSize: "15px", lineHeight: "1.5" }}>{error}</p>}
              </>
            )}
            {sent && (
              <div className="sent" role="status" style={{ minHeight: "440px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start" }}>
                <span style={{ width: "80px", height: "80px", borderRadius: "50%", background: "var(--accent)", color: "var(--onaccent)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                    <path d="M5 12.5 10 17 19 7" />
                  </svg>
                </span>
                <h3 className="disp" style={{ margin: "28px 0 0", fontSize: "56px" }}>
                  Sent
                  <span style={{ color: "var(--accent)" }}>.</span>
                </h3>
                <p style={{ margin: "14px 0 0", color: "var(--muted)", fontSize: "18px", lineHeight: "1.6", maxWidth: "380px" }}>Thanks — your message is on its way. I'll get back to you soon.</p>
                <button type="button" className="pill mono" onClick={reset} style={{ marginTop: "26px", height: "46px", padding: "0 20px", borderRadius: "999px", border: "1px solid var(--text)", background: "transparent", color: "var(--text)", cursor: "pointer" }}>Send another</button>
              </div>
            )}
          </form>
        </div>
      </section>
      <Arcade />
      <A className="next" href="/">
        <div className="wrap" style={{ paddingTop: "26px", paddingBottom: "26px" }}>
          <div className="mono nmuted" style={{ color: "var(--muted)" }}>Back to the start</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "24px", marginTop: "8px" }}>
            <span className="disp nt" style={{ fontSize: "clamp(26px, 3vw, 46px)" }}>Home</span>
            <span className="narr" style={{ width: "52px", height: "52px", borderRadius: "50%", border: "1px solid currentColor", display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </div>
        </div>
      </A>
    </Layout>
  )
}
