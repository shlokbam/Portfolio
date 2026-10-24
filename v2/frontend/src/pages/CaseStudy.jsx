import Layout from '../components/Layout'
import A from '../components/A'
import AIBackdrop from '../components/AIBackdrop'
import { css } from '../lib/css'
import './CaseStudy.css'

export default function CaseStudy() {
  const title = 'DAILYDIFF'.split('').map((ch, i) => ({ ch, style: '--i: ' + i }))
  const lines = [
    ['[cron]', 'trigger fired — Mon / Wed / Fri schedule'],
    ['[scout]', 'fetching github trending repositories'],
    ['[scout]', 'querying hacker news api'],
    ['[scout]', 'reading dev.to latest posts'],
    ['[graph]', 'langgraph: merge, dedupe, validate state'],
    ['[curate]', 'mistral → eli5 summary + use cases'],
    ['[dispatch]', 'brevo → html briefing sent to subscribers']
  ]
  const stats = [
    { value: '185', label: 'Briefs sent' },
    { value: '42', label: 'Editions' },
    { value: '7', label: 'Sources scanned' },
    { value: '22→4', label: 'LLM calls per run' }
  ]
  const evals = [
    { agent: 'Skeptic', job: 'Rejects noise before it reaches the brief', score: '6–7 / 7 (was 3 / 7)' },
    { agent: 'Verifier', job: 'Catches bad or unsupported items', score: '14–15 / 16' },
    { agent: 'Analyst', job: 'Agrees with the golden verdicts', score: '13–14 / 15' },
    { agent: 'Editor', job: 'Briefs pass every structure check; a fail-closed gate blocks publishing otherwise', score: '5 / 5' }
  ]
  const log = lines.map(([tag, msg], i) => ({ tag, msg, style: '--i: ' + i + '; --w: ' + (tag.length + msg.length + 2) + 'ch' }))
  return (
    <Layout page="casestudy" back vtab="(02.1) — Case study · Menu" curtain="(02.1) Case study" chat greeting="Curious how the DailyDiff agents hand off work? Ask me." footerStyle="padding: 56px 0 36px; border-top: 1px solid var(--line)">
      <section id="top" className="dots" style={{ position: "relative", paddingTop: "168px", paddingBottom: "56px", borderBottom: "1px solid var(--line)" }}>
        <AIBackdrop kind="agents" />
        <div className="wrap">
          <div className="fade" style={{ "--d": ".3s", display: "flex", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }}>
            <span className="mono" style={{ color: "var(--muted)" }}>(02.1) — Case study · 01 of 5 flagships</span>
            <span className="mono" style={{ display: "inline-flex", gap: "10px", alignItems: "center" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#2fd47a" }} />
              Live at dailydiff.in
            </span>
          </div>
          <h1 className="disp" aria-label="DailyDiff" style={{ margin: "24px 0 0", fontSize: "min(clamp(56px, 12.4vw, 184px), calc((100vw - 80px) / 5.55))", fontStretch: "100%" }}>
            <span className="mask" style={{ whiteSpace: "nowrap" }}>
              {title.map((l, l_i) => (
                <span key={l_i} className="ltr" aria-hidden="true" style={css(l.style)}>{l.ch}</span>
              ))}
            </span>
          </h1>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "32px", flexWrap: "wrap", marginTop: "32px" }}>
            <p className="serif fade" style={{ "--d": ".6s", margin: "0", fontSize: "clamp(28px, 3vw, 44px)", maxWidth: "760px", lineHeight: "1.1" }}>A newsroom run entirely by agents.</p>
            <div className="fade" style={{ "--d": ".7s", display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <A className="pill mono" href="https://dailydiff.in/" style={{ height: "48px", padding: "0 22px", borderRadius: "999px", background: "var(--accent)", color: "var(--onaccent)", display: "inline-flex", alignItems: "center" }}>Open live ↗</A>
              <A className="pill mono" href="https://github.com/shlokbam/DailyDiff" style={{ height: "48px", padding: "0 22px", borderRadius: "999px", border: "1px solid var(--text)", display: "inline-flex", alignItems: "center" }}>Source ↗</A>
            </div>
          </div>
          <div className="rule" style={{ marginTop: "44px" }} />
          <div className="g-meta fade" style={{ "--d": ".8s" }}>
            <div style={{ padding: "20px 20px 0 0" }}>
              <div className="mono" style={{ color: "var(--muted)" }}>Type</div>
              <div style={{ marginTop: "10px", fontSize: "18px", fontWeight: "600" }}>Autonomous multi-agent platform</div>
            </div>
            <div style={{ padding: "20px 20px 0", borderLeft: "1px solid var(--line)" }}>
              <div className="mono" style={{ color: "var(--muted)" }}>Cadence</div>
              <div style={{ marginTop: "10px", fontSize: "18px", fontWeight: "600" }}>Mon · Wed · Fri</div>
            </div>
            <div style={{ padding: "20px 20px 0", borderLeft: "1px solid var(--line)" }}>
              <div className="mono" style={{ color: "var(--muted)" }}>Sources</div>
              <div style={{ marginTop: "10px", fontSize: "18px", fontWeight: "600" }}>7 · GitHub, HN, Dev.to…</div>
            </div>
            <div style={{ padding: "20px 0 0 20px", borderLeft: "1px solid var(--line)" }}>
              <div className="mono" style={{ color: "var(--muted)" }}>Stack</div>
              <div style={{ marginTop: "10px", fontSize: "18px", fontWeight: "600" }}>LangGraph · FastAPI · Neon</div>
            </div>
          </div>
        </div>
      </section>
      <section style={{ padding: "112px 0", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap g-split">
          <div>
            <span className="mono" style={{ color: "var(--muted)" }}>01 — The problem</span>
            {" "}
            <h2 className="rv" style={{ margin: "22px 0 0", fontSize: "clamp(34px, 3.8vw, 56px)", lineHeight: "1.05", letterSpacing: "-.03em", fontWeight: "600" }}>
              New developer tools land every day. Keeping up means hours of scrolling and{" "}
              <span className="serif" style={{ color: "var(--accent)" }}>jargon</span>
              .
            </h2>
          </div>
          <div className="rv" style={{ paddingTop: "44px" }}>
            <p style={{ margin: "0", fontSize: "19px", lineHeight: "1.7", color: "var(--muted)" }}>
              DailyDiff does the scrolling for you. On a schedule, a team of agents discovers what's trending across seven sources — GitHub, Hacker News, Dev.to and more — decides what is worth your attention, fact-checks it, rewrites it so a beginner could follow it, and sends a styled HTML briefing straight to your inbox.
            </p>
            <p style={{ margin: "22px 0 0", fontSize: "19px", lineHeight: "1.7", color: "var(--muted)" }}>
              Each brief explains the tool in plain words (ELI5), lists real use cases, and links to the source.
            </p>
          </div>
        </div>
      </section>
      <section style={{ padding: "112px 0", borderBottom: "1px solid var(--line)", background: "var(--surface)" }}>
        <div className="wrap">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "24px", flexWrap: "wrap" }}>
            <div>
              <span className="mono" style={{ color: "var(--muted)" }}>02 — The pipeline</span>
              {" "}
              <h2 className="disp rv" style={{ margin: "20px 0 0", fontSize: "clamp(48px, 6.4vw, 100px)" }}>
                How it{" "}
                <span className="serif" style={{ textTransform: "none", fontWeight: "400", color: "var(--accent)" }}>thinks</span>
              </h2>
            </div>
            <span className="mono" style={{ color: "var(--muted)" }}>Dashes show data flowing</span>
          </div>
          <div className="dots" style={{ marginTop: "48px", overflowX: "auto", border: "1px solid var(--line)", borderRadius: "24px", background: "var(--bg)" }}>
            <div style={{ position: "relative", width: "1216px", height: "440px", margin: "0 auto" }}>
              <svg className="flow" width="36" height="8" viewBox="0 0 36 8" preserveAspectRatio="none" style={{ position: "absolute", left: "200px", top: "220px", width: "36px", height: "8px", overflow: "visible", fill: "none", stroke: "var(--muted)", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", strokeDasharray: "6 6" }}>
                <path d="M 0 4 L 36 4" />
              </svg>
              <svg className="flow" width="8" height="272" viewBox="0 0 8 272" preserveAspectRatio="none" style={{ position: "absolute", left: "232px", top: "88px", width: "8px", height: "272px", overflow: "visible", fill: "none", stroke: "var(--muted)", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", strokeDasharray: "6 6" }}>
                <path d="M 4 0 L 4 272" />
              </svg>
              <svg className="flow" width="35" height="8" viewBox="0 0 35 8" preserveAspectRatio="none" style={{ position: "absolute", left: "236px", top: "84px", width: "35px", height: "8px", overflow: "visible", fill: "none", stroke: "var(--muted)", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", strokeDasharray: "6 6" }}>
                <defs>
                  <marker id="dc-arrow-head-filled-1" orient="auto" markerWidth="5" markerHeight="5" refX="2" refY="2" overflow="visible">
                    <path d="M0 0 L4 2 L0 4 Z" fill="#A19D92" stroke="none" style={{ stroke: "none", fill: "var(--muted)" }} />
                  </marker>
                </defs>
                <path d="M 0 4 L 31 4" markerEnd="url(#dc-arrow-head-filled-1)" />
              </svg>
              <svg className="flow" width="35" height="8" viewBox="0 0 35 8" preserveAspectRatio="none" style={{ position: "absolute", left: "236px", top: "220px", width: "35px", height: "8px", overflow: "visible", fill: "none", stroke: "var(--muted)", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", strokeDasharray: "6 6" }}>
                <defs>
                  <marker id="dc-arrow-head-filled-2" orient="auto" markerWidth="5" markerHeight="5" refX="2" refY="2" overflow="visible">
                    <path d="M0 0 L4 2 L0 4 Z" fill="#A19D92" stroke="none" style={{ stroke: "none", fill: "var(--muted)" }} />
                  </marker>
                </defs>
                <path d="M 0 4 L 31 4" markerEnd="url(#dc-arrow-head-filled-2)" />
              </svg>
              <svg className="flow" width="35" height="8" viewBox="0 0 35 8" preserveAspectRatio="none" style={{ position: "absolute", left: "236px", top: "356px", width: "35px", height: "8px", overflow: "visible", fill: "none", stroke: "var(--muted)", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", strokeDasharray: "6 6" }}>
                <defs>
                  <marker id="dc-arrow-head-filled-3" orient="auto" markerWidth="5" markerHeight="5" refX="2" refY="2" overflow="visible">
                    <path d="M0 0 L4 2 L0 4 Z" fill="#A19D92" stroke="none" style={{ stroke: "none", fill: "var(--muted)" }} />
                  </marker>
                </defs>
                <path d="M 0 4 L 31 4" markerEnd="url(#dc-arrow-head-filled-3)" />
              </svg>
              <svg className="flow" width="36" height="8" viewBox="0 0 36 8" preserveAspectRatio="none" style={{ position: "absolute", left: "448px", top: "84px", width: "36px", height: "8px", overflow: "visible", fill: "none", stroke: "var(--muted)", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", strokeDasharray: "6 6" }}>
                <path d="M 0 4 L 36 4" />
              </svg>
              <svg className="flow" width="36" height="8" viewBox="0 0 36 8" preserveAspectRatio="none" style={{ position: "absolute", left: "448px", top: "220px", width: "36px", height: "8px", overflow: "visible", fill: "none", stroke: "var(--muted)", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", strokeDasharray: "6 6" }}>
                <path d="M 0 4 L 36 4" />
              </svg>
              <svg className="flow" width="36" height="8" viewBox="0 0 36 8" preserveAspectRatio="none" style={{ position: "absolute", left: "448px", top: "356px", width: "36px", height: "8px", overflow: "visible", fill: "none", stroke: "var(--muted)", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", strokeDasharray: "6 6" }}>
                <path d="M 0 4 L 36 4" />
              </svg>
              <svg className="flow" width="8" height="272" viewBox="0 0 8 272" preserveAspectRatio="none" style={{ position: "absolute", left: "480px", top: "88px", width: "8px", height: "272px", overflow: "visible", fill: "none", stroke: "var(--muted)", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", strokeDasharray: "6 6" }}>
                <path d="M 4 0 L 4 272" />
              </svg>
              <svg className="flow" width="35" height="8" viewBox="0 0 35 8" preserveAspectRatio="none" style={{ position: "absolute", left: "484px", top: "220px", width: "35px", height: "8px", overflow: "visible", fill: "none", stroke: "var(--muted)", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", strokeDasharray: "6 6" }}>
                <defs>
                  <marker id="dc-arrow-head-filled-4" orient="auto" markerWidth="5" markerHeight="5" refX="2" refY="2" overflow="visible">
                    <path d="M0 0 L4 2 L0 4 Z" fill="#A19D92" stroke="none" style={{ stroke: "none", fill: "var(--muted)" }} />
                  </marker>
                </defs>
                <path d="M 0 4 L 31 4" markerEnd="url(#dc-arrow-head-filled-4)" />
              </svg>
              <svg className="flow" width="71" height="8" viewBox="0 0 71 8" preserveAspectRatio="none" style={{ position: "absolute", left: "696px", top: "220px", width: "71px", height: "8px", overflow: "visible", fill: "none", stroke: "var(--accent)", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", strokeDasharray: "6 6" }}>
                <defs>
                  <marker id="dc-arrow-head-filled-5" orient="auto" markerWidth="5" markerHeight="5" refX="2" refY="2" overflow="visible">
                    <path d="M0 0 L4 2 L0 4 Z" fill="#FF5A1F" stroke="none" style={{ stroke: "none", fill: "var(--accent)" }} />
                  </marker>
                </defs>
                <path d="M 0 4 L 67 4" markerEnd="url(#dc-arrow-head-filled-5)" />
              </svg>
              <svg className="flow" width="71" height="8" viewBox="0 0 71 8" preserveAspectRatio="none" style={{ position: "absolute", left: "944px", top: "220px", width: "71px", height: "8px", overflow: "visible", fill: "none", stroke: "var(--accent)", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", strokeDasharray: "6 6" }}>
                <defs>
                  <marker id="dc-arrow-head-filled-6" orient="auto" markerWidth="5" markerHeight="5" refX="2" refY="2" overflow="visible">
                    <path d="M0 0 L4 2 L0 4 Z" fill="#FF5A1F" stroke="none" style={{ stroke: "none", fill: "var(--accent)" }} />
                  </marker>
                </defs>
                <path d="M 0 4 L 67 4" markerEnd="url(#dc-arrow-head-filled-6)" />
              </svg>
              <div className="node" style={{ position: "absolute", left: "24px", top: "176px", width: "176px", height: "96px", boxSizing: "border-box", padding: "10px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "14px", fontSize: "15px", lineHeight: "20px" }}>
                <span>
                  <b>Cron trigger</b>
                  <br />
                  Mon · Wed · Fri
                </span>
              </div>
              <div className="node" style={{ position: "absolute", left: "272px", top: "40px", width: "176px", height: "96px", boxSizing: "border-box", padding: "10px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "14px", fontSize: "15px", lineHeight: "20px" }}>
                <span>
                  <b>Scout</b>
                  <br />
                  GitHub Trending
                </span>
              </div>
              <div className="node" style={{ position: "absolute", left: "272px", top: "176px", width: "176px", height: "96px", boxSizing: "border-box", padding: "10px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "14px", fontSize: "15px", lineHeight: "20px" }}>
                <span>
                  <b>Scout</b>
                  <br />
                  Hacker News API
                </span>
              </div>
              <div className="node" style={{ position: "absolute", left: "272px", top: "312px", width: "176px", height: "96px", boxSizing: "border-box", padding: "10px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "14px", fontSize: "15px", lineHeight: "20px" }}>
                <span>
                  <b>Scout</b>
                  <br />
                  Dev.to
                </span>
              </div>
              <div className="node" style={{ position: "absolute", left: "520px", top: "176px", width: "176px", height: "96px", boxSizing: "border-box", padding: "10px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", background: "var(--accent)", color: "var(--onaccent)", border: "1px solid var(--accent)", borderRadius: "14px", fontSize: "15px", lineHeight: "20px" }}>
                <span>
                  <b>LangGraph</b>
                  <br />
                  state-graph coordinator
                </span>
              </div>
              <div className="node" style={{ position: "absolute", left: "768px", top: "176px", width: "176px", height: "96px", boxSizing: "border-box", padding: "10px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "14px", fontSize: "15px", lineHeight: "20px" }}>
                <span>
                  <b>Curator</b>
                  <br />
                  Mistral / Gemini · ELI5
                </span>
              </div>
              <div className="node" style={{ position: "absolute", left: "1016px", top: "176px", width: "176px", height: "96px", boxSizing: "border-box", padding: "10px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", background: "var(--text)", color: "var(--bg)", border: "1px solid var(--text)", borderRadius: "14px", fontSize: "15px", lineHeight: "20px" }}>
                <span>
                  <b>Dispatch</b>
                  <br />
                  Brevo / Resend email
                </span>
              </div>
            </div>
          </div>
          <div className="rv" style={{ marginTop: "28px", borderRadius: "20px", background: "#0B0B0A", color: "#F2EFE7", border: "1px solid var(--line)", overflow: "hidden" }}>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", padding: "14px 18px", borderBottom: "1px solid #272622" }}>
              <span style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#FF5A1F" }} />
              <span style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#57544C" }} />
              <span style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#57544C" }} />
              <span className="mono" style={{ marginLeft: "12px", color: "#A19D92", fontSize: "11px" }}>dailydiff — run sequence (illustrative)</span>
            </div>
            <div style={{ padding: "20px 24px 24px", fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", lineHeight: "2" }}>
              {log.map((lg, lg_i) => (
                <span key={lg_i} className="tl" style={css(lg.style)}>
                  <span style={{ color: "#FF5A1F" }}>{lg.tag}</span>
                  {" "}{lg.msg}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section style={{ padding: "112px 0", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <span className="mono" style={{ color: "var(--muted)" }}>03 — The team</span>
          {" "}
          <h2 className="disp rv" style={{ margin: "20px 0 0", fontSize: "clamp(48px, 6.4vw, 100px)" }}>Four agents</h2>
          <div className="g-agents" style={{ marginTop: "48px" }}>
            <article className="agent rv" style={{ border: "1px solid var(--line)", borderRadius: "22px", padding: "24px", background: "var(--surface)", minHeight: "300px", display: "flex", flexDirection: "column" }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              <span className="mono" style={{ color: "var(--muted)", marginTop: "24px" }}>01 · Scheduler</span>
              <h3 style={{ margin: "10px 0 0", fontSize: "24px", letterSpacing: "-.02em" }}>Cron trigger</h3>
              <p style={{ margin: "12px 0 0", color: "var(--muted)", fontSize: "15px", lineHeight: "1.6" }}>
                Runs the whole pipeline three times a week — Monday, Wednesday and Friday — to collect, process and broadcast.
              </p>
            </article>
            <article className="agent rv" style={{ border: "1px solid var(--line)", borderRadius: "22px", padding: "24px", background: "var(--surface)", minHeight: "300px", display: "flex", flexDirection: "column" }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
              <span className="mono" style={{ color: "var(--muted)", marginTop: "24px" }}>02 · Discovery</span>
              <h3 style={{ margin: "10px 0 0", fontSize: "24px", letterSpacing: "-.02em" }}>Scout agent</h3>
              <p style={{ margin: "12px 0 0", color: "var(--muted)", fontSize: "15px", lineHeight: "1.6" }}>Scours Dev.to, GitHub Trending and the Hacker News API for trending technical utilities.</p>
            </article>
            <article className="agent rv" style={{ border: "1px solid var(--line)", borderRadius: "22px", padding: "24px", background: "var(--surface)", minHeight: "300px", display: "flex", flexDirection: "column" }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <circle cx="5" cy="12" r="2.5" />
                <circle cx="19" cy="5" r="2.5" />
                <circle cx="19" cy="19" r="2.5" />
                <path d="M7.5 11 16.5 6M7.5 13l9 5" />
              </svg>
              <span className="mono" style={{ color: "var(--muted)", marginTop: "24px" }}>03 · Orchestration</span>
              <h3 style={{ margin: "10px 0 0", fontSize: "24px", letterSpacing: "-.02em" }}>LangGraph coordinator</h3>
              <p style={{ margin: "12px 0 0", color: "var(--muted)", fontSize: "15px", lineHeight: "1.6" }}>
                A state graph that coordinates agent loops, state changes, validation checkpoints and the routing of processed summaries.
              </p>
            </article>
            <article className="agent rv" style={{ border: "1px solid var(--line)", borderRadius: "22px", padding: "24px", background: "var(--surface)", minHeight: "300px", display: "flex", flexDirection: "column" }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <path d="M3 6h18v12H3zM3 7l9 6 9-6" />
              </svg>
              <span className="mono" style={{ color: "var(--muted)", marginTop: "24px" }}>04 · Curation &amp; delivery</span>
              <h3 style={{ margin: "10px 0 0", fontSize: "24px", letterSpacing: "-.02em" }}>Curator + dispatch</h3>
              <p style={{ margin: "12px 0 0", color: "var(--muted)", fontSize: "15px", lineHeight: "1.6" }}>
                Mistral / Gemini write ELI5 explanations and use cases as structured markdown; Brevo delivers the HTML briefing to subscribers.
              </p>
            </article>
          </div>
        </div>
      </section>
      {" "}
      <section style={{ padding: "112px 0", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "24px", flexWrap: "wrap" }}>
            <div>
              <span className="mono" style={{ color: "var(--muted)" }}>04 — Results</span>
              <h2 className="disp rv" style={{ margin: "20px 0 0", fontSize: "clamp(48px, 6.4vw, 100px)" }}>
                In{" "}
                <span className="serif" style={{ textTransform: "none", fontWeight: "400", color: "var(--accent)" }}>production</span>
              </h2>
            </div>
            <span className="mono" style={{ color: "var(--muted)" }}>Per-agent evals · 3 runs · 25 golden cases</span>
          </div>
          <div className="cs-stats rv" style={{ marginTop: "48px", borderTop: "1px solid var(--text)" }}>
            {stats.map((x) => (
              <div key={x.label} style={{ padding: "28px 20px 28px 0" }}>
                <div className="disp" style={{ fontSize: "clamp(48px, 5vw, 76px)" }}>{x.value}</div>
                <div className="mono" style={{ color: "var(--muted)", marginTop: "12px", lineHeight: "1.6" }}>{x.label}</div>
              </div>
            ))}
          </div>
          <div className="rv" style={{ marginTop: "40px", border: "1px solid var(--line)", borderRadius: "22px", background: "var(--surface)", overflow: "hidden" }}>
            {evals.map((e, i) => (
              <div key={e.agent} className="cs-eval" style={{ padding: "20px 24px", borderTop: i ? "1px solid var(--line)" : "none" }}>
                <span style={{ fontSize: "20px", fontWeight: "700" }}>{e.agent}</span>
                <span style={{ color: "var(--muted)", fontSize: "16px", lineHeight: "1.5" }}>{e.job}</span>
                <span className="mono" style={{ color: "var(--accent)", textAlign: "right" }}>{e.score}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <A className="next" href="/journey">
        <div className="wrap" style={{ paddingTop: "72px", paddingBottom: "72px" }}>
          <div className="mono nmuted" style={{ color: "var(--muted)" }}>Next page — (03)</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "24px", marginTop: "18px" }}>
            <span className="disp nt" style={{ fontSize: "clamp(60px, 10vw, 160px)" }}>Journey</span>
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
