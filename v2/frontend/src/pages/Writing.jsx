import Layout from '../components/Layout'
import { POSTS } from '../content/writing'
import A from '../components/A'
import AIBackdrop from '../components/AIBackdrop'
import { SeriesSection } from '../components/Series'
import { css } from '../lib/css'
import { useState } from 'react'
import './Writing.css'

export default function Writing() {
  const title = 'JOURNAL'.split('').map((ch, i) => ({ ch, style: '--i: ' + i }))
  const [topic, setTopic] = useState('all')
  const entries = POSTS.map((e, i) => ({ ...e, n: String(i + 1).padStart(2, '0') }))
  const TOPICS = [['all', 'All'], ['ai', 'AI & agents'], ['devops', 'DevOps'], ['web', 'Full-stack']]
  const shown = entries.filter((e) => topic === 'all' || e.group === topic)
  return (
    <Layout page="writing" curtain="Writing" chat greeting="Want the short version of an article? Ask me." footerStyle="padding: 56px 0 36px; border-top: 1px solid var(--line)">
      <section id="top" className="dots" style={{ position: "relative", paddingTop: "168px", paddingBottom: "56px", borderBottom: "1px solid var(--line)" }}>
        <AIBackdrop kind="tokens" />
        <div className="wrap">
          <div className="fade" style={{ "--d": ".3s", display: "flex", justifyContent: "flex-end", gap: "24px", flexWrap: "wrap" }}>
            <span className="mono" style={{ color: "var(--muted)" }}>Shlok Bam / Portfolio 2026</span>
          </div>
          <h1 className="disp" aria-label="Journal" style={{ margin: "24px 0 0", fontSize: "min(clamp(72px, 15vw, 226px), calc((100vw - 80px) / 5.46))", fontStretch: "100%" }}>
            <span className="mask" style={{ whiteSpace: "nowrap" }}>
              {title.map((l, l_i) => (
                <span key={l_i} className="ltr" aria-hidden="true" style={css(l.style)}>{l.ch}</span>
              ))}
              <span className="ltr" aria-hidden="true" style={{ "--i": "7", color: "var(--accent)" }}>.</span>
            </span>
          </h1>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "32px", flexWrap: "wrap", marginTop: "32px" }}>
            <p className="serif fade" style={{ "--d": ".6s", margin: "0", fontSize: "clamp(28px, 3vw, 44px)", maxWidth: "760px", lineHeight: "1.1" }}>Build logs from the things that went wrong.</p>
            <A className="btn mono fade" href="https://journal-murex-three.vercel.app/journal" style={{ "--d": ".7s", border: "1px solid var(--text)" }}>
              Open the journal{" "}
              <svg className="arr" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
            </A>
          </div>
          <div className="rule" style={{ marginTop: "44px" }} />
          <div className="mono fade" style={{ "--d": ".8s", display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", marginTop: "14px", color: "var(--muted)" }}>
            <span>{entries.length} entries</span>
            <span>Agents · RAG · MCP · DevOps</span>
            <span>2026</span>
          </div>
        </div>
      </section>
      <SeriesSection />
      <section style={{ padding: "72px 0 112px" }}>
        <div className="wrap">
          <span className="mono" style={{ display: "block", marginBottom: "20px", color: "var(--muted)" }}>On the journal · long-form build logs</span>
          <div role="group" aria-label="Filter entries" className="wfilters">
            {TOPICS.map(([id, label]) => (
              <button key={id} type="button" className={'wchip mono' + (topic === id ? ' on' : '')} aria-pressed={topic === id} onClick={() => setTopic(id)}>
                {label} <span style={{ opacity: '.6' }}>{id === 'all' ? entries.length : entries.filter((e) => e.group === id).length}</span>
              </button>
            ))}
          </div>
          <div style={{ borderTop: "1px solid var(--text)", marginTop: "28px" }}>
            {shown.map((e, e_i) => (
              <A key={e.href} className="entry" href={e.href}>
                <span className="ebg" aria-hidden="true" />
                {" "}
                <span className="disp enum" style={{ fontSize: "clamp(44px, 5vw, 76px)" }}>{e.n}</span>
                {" "}
                <div>
                  <div className="mono" style={{ display: "flex", gap: "18px", color: "var(--muted)" }}>
                    <span>{e.date}</span>
                    <span style={{ color: "var(--accent)" }}>{e.tag}</span>
                    <span>Journal</span>
                  </div>
                  <div className="etitle" style={{ marginTop: "10px", fontSize: "clamp(20px, 2.1vw, 30px)", fontWeight: "650", letterSpacing: "-.025em", lineHeight: "1.12" }}>{e.title}</div>
                  <p style={{ margin: "10px 0 0", color: "var(--muted)", fontSize: "16px", lineHeight: "1.55", maxWidth: "760px" }}>{e.blurb}</p>
                </div>
                {" "}
                <span className="ecircle hide-sm" style={{ justifySelf: "end", width: "60px", height: "60px", borderRadius: "50%", border: "1px solid var(--text)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </A>
            ))}
          </div>
        </div>
      </section>
      {" "}
      <A className="next" href="/contact" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="wrap" style={{ paddingTop: "26px", paddingBottom: "26px" }}>
          <div className="mono nmuted" style={{ color: "var(--muted)" }}>Next page</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "24px", marginTop: "8px" }}>
            <span className="disp nt" style={{ fontSize: "clamp(26px, 3vw, 46px)" }}>Contact</span>
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
