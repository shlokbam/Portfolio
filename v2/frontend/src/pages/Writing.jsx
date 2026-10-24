import Layout from '../components/Layout'
import A from '../components/A'
import AIBackdrop from '../components/AIBackdrop'
import { css } from '../lib/css'
import './Writing.css'

export default function Writing() {
  const title = 'JOURNAL'.split('').map((ch, i) => ({ ch, style: '--i: ' + i }))
  const entries = [
    { n: '01', date: 'Apr 2026', tag: 'AI & Flask', title: 'I built an AI data analyst app from scratch — how I taught a Flask app to think', blurb: 'The build log behind AI Data Analyst: turning raw datasets into LLM-generated insights, charts and summaries.', href: 'https://journal-murex-three.vercel.app/journal/i-built-an-ai-data-analyst-app-from-scratch-here-s-how-i-taught-a-flask-app-to-think' },
    { n: '02', date: 'Apr 2026', tag: 'AI & React', title: 'I built an AI-powered mock interview platform — everything that went wrong', blurb: 'The story of MockVue: AI feedback, live code execution and analytics, and every wrong turn on the way.', href: 'https://journal-murex-three.vercel.app/journal/i-built-an-ai-powered-mock-interview-platform-from-scratch-here-s-everything-that-went-wrong' },
    { n: '03', date: 'Mar 2026', tag: 'DevOps', title: 'I built a full DevOps CI/CD pipeline from scratch — everything that went wrong', blurb: 'Docker, Jenkins, Terraform and AWS EC2 — what it actually took to ship a Flask app end to end.', href: 'https://journal-murex-three.vercel.app/journal/i-built-a-full-devops-ci-cd-pipeline-from-scratch-here-s-everything-that-went-wrong' }
  ]
  return (
    <Layout page="writing" vtab="(06) — Writing · Menu" curtain="(06) Writing" chat greeting="Want the short version of an article? Ask me." footerStyle="padding: 56px 0 36px; border-top: 1px solid var(--line)">
      <section id="top" className="dots" style={{ position: "relative", paddingTop: "168px", paddingBottom: "56px", borderBottom: "1px solid var(--line)" }}>
        <AIBackdrop kind="tokens" />
        <div className="wrap">
          <div className="fade" style={{ "--d": ".3s", display: "flex", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }}>
            <span className="mono" style={{ color: "var(--muted)" }}>(06) — Writing</span>
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
            <span>Latest 3 entries</span>
            <span>AI · React · DevOps</span>
            <span>2026</span>
          </div>
        </div>
      </section>
      <section style={{ padding: "72px 0 112px" }}>
        <div className="wrap">
          <div style={{ borderTop: "1px solid var(--text)" }}>
            {entries.map((e, e_i) => (
              <A key={e_i} className="entry rv" href={e.href}>
                <span className="ebg" aria-hidden="true" />
                {" "}
                <span className="disp enum" style={{ fontSize: "clamp(72px, 8vw, 124px)" }}>{e.n}</span>
                {" "}
                <div>
                  <div className="mono" style={{ display: "flex", gap: "18px", color: "var(--muted)" }}>
                    <span>{e.date}</span>
                    <span style={{ color: "var(--accent)" }}>{e.tag}</span>
                    <span>Journal</span>
                  </div>
                  <div className="etitle" style={{ marginTop: "12px", fontSize: "clamp(24px, 2.8vw, 40px)", fontWeight: "650", letterSpacing: "-.025em", lineHeight: "1.12" }}>{e.title}</div>
                  <p style={{ margin: "14px 0 0", color: "var(--muted)", fontSize: "17px", lineHeight: "1.6", maxWidth: "760px" }}>{e.blurb}</p>
                </div>
                {" "}
                <span className="ecircle hide-sm" style={{ justifySelf: "end", width: "88px", height: "88px", borderRadius: "50%", border: "1px solid var(--text)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
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
        <div className="wrap" style={{ paddingTop: "72px", paddingBottom: "72px" }}>
          <div className="mono nmuted" style={{ color: "var(--muted)" }}>Next page — (07)</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "24px", marginTop: "18px" }}>
            <span className="disp nt" style={{ fontSize: "clamp(60px, 10vw, 160px)" }}>Contact</span>
            <span className="narr" style={{ width: "112px", height: "112px", borderRadius: "50%", border: "1px solid currentColor", display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </div>
        </div>
      </A>
    </Layout>
  )
}
