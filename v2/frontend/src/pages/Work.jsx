import Layout from '../components/Layout'
import A from '../components/A'
import { css } from '../lib/css'
import { useState } from 'react'
import { useAvailability } from '../lib/site'
import { PROJECTS } from '../data/projects'
import './Work.css'

export default function Work() {
  const [fv, setFilter] = useState('all')
  const avail = useAvailability()
  const title = 'WORK'.split('').map((ch, i) => ({ ch, style: '--i: ' + i }))
  const all = PROJECTS.map((p, i) => ({ ...p, n: String(i + 1).padStart(2, '0') }))
  const rows = all
    .filter((p) => fv === 'all' || p.cats.indexOf(fv) !== -1)
    .map((p) => ({ ...p, status: p.live && avail ? avail[p.live] || '' : '' }))
  const chip = (on) => on
    ? 'min-height: 44px; padding: 0 16px; border-radius: 999px; border: 1px solid var(--text); background: var(--text); color: var(--bg); cursor: pointer'
    : 'min-height: 44px; padding: 0 16px; border-radius: 999px; border: 1px solid var(--line); background: transparent; color: var(--text); cursor: pointer'
  const filters = [['all', 'All'], ['ai', 'AI / ML'], ['web', 'Web'], ['cloud', 'Cloud'], ['devops', 'DevOps']].map(([id, label]) => ({
    label, count: id === 'all' ? all.length : all.filter((p) => p.cats.indexOf(id) !== -1).length,
    pressed: fv === id ? 'true' : 'false', style: chip(fv === id), pick: () => setFilter(id)
  }))
  const count = rows.length
  return (
    <Layout page="work" vtab="(02) — Work · Menu" curtain="(02) Work" chat greeting="Ask me which project fits your team, or how any of them were built." footerStyle="padding: 56px 0 36px; border-top: 1px solid var(--line)">
      <section id="top" className="dots" style={{ position: "relative", paddingTop: "168px", paddingBottom: "56px", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="fade" style={{ "--d": ".3s", display: "flex", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }}>
            <span className="mono" style={{ color: "var(--muted)" }}>(02) — Work</span>
            <span className="mono" style={{ color: "var(--muted)" }}>Shlok Bam / Portfolio 2026</span>
          </div>
          <h1 className="disp" aria-label="Work" style={{ margin: "24px 0 0", fontSize: "clamp(100px, 21vw, 310px)", fontStretch: "100%" }}>
            <span className="mask">
              {title.map((l, l_i) => (
                <span key={l_i} className="ltr" aria-hidden="true" style={css(l.style)}>{l.ch}</span>
              ))}
              <span className="ltr" aria-hidden="true" style={{ "--i": "4", color: "var(--accent)" }}>.</span>
            </span>
          </h1>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "32px", flexWrap: "wrap", marginTop: "32px" }}>
            <p className="serif fade" style={{ "--d": ".6s", margin: "0", fontSize: "clamp(28px, 3vw, 44px)", maxWidth: "720px", lineHeight: "1.1" }}>Things I've built, broken and rebuilt.</p>
            <p className="mono fade" style={{ "--d": ".7s", margin: "0", maxWidth: "280px", color: "var(--muted)", lineHeight: "1.8", textAlign: "right" }}>Agents, retrieval systems, full-stack apps and cloud pipelines</p>
          </div>
          <div className="rule" style={{ marginTop: "44px" }} />
          <div className="mono fade" style={{ "--d": ".8s", display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", marginTop: "14px", color: "var(--muted)" }}>
            <span>21 projects</span>
            <span>7 deployed</span>
            <span>5 flagship</span>
            <span>2023 → now</span>
          </div>
        </div>
      </section>
      <section style={{ padding: "104px 0 88px", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap hs-wrap">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "24px", flexWrap: "wrap" }}>
            <div>
              <span className="mono" style={{ color: "var(--muted)" }}>(02.1) — Flagships</span>
              {" "}
              <h2 className="disp rv" style={{ margin: "20px 0 0", fontSize: "clamp(48px, 6.4vw, 100px)" }}>
                Five{" "}
                <span className="serif" style={{ textTransform: "none", fontWeight: "400", color: "var(--accent)" }}>I'd</span>
                {" "}ship again
              </h2>
            </div>
            <span className="mono" style={{ display: "inline-flex", gap: "10px", alignItems: "center", color: "var(--muted)" }}>
              Scroll sideways{" "}
              <svg width="28" height="12" viewBox="0 0 28 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M0 6h26M21 1l5 5-5 5" />
              </svg>
            </span>
          </div>
          <div className="hs" style={{ marginTop: "48px" }} role="region" aria-label="Flagship projects" tabIndex="0">
            <article className="hcard" style={{ width: "520px", minHeight: "620px", border: "1px solid var(--line)", borderRadius: "26px", background: "var(--surface)", padding: "28px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
              <div className="disp" aria-hidden="true" style={{ position: "absolute", right: "20px", top: "10px", fontSize: "160px", color: "transparent", WebkitTextStroke: "1px var(--line)" }}>01</div>
              <div className="mono" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#2fd47a" }} />
                Live · Agents
              </div>
              <div className="motif" style={{ flex: "1", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", minHeight: "220px" }}>
                <svg className="dash" width="100%" height="150" viewBox="0 0 320 160" fill="none" aria-hidden="true">
                  <path d="M30 80 H290" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" />
                  <circle className="blinkdot" style={{ "--d": "0s" }} cx="30" cy="80" r="14" fill="var(--accent)" />
                  <circle className="blinkdot" style={{ "--d": ".25s" }} cx="95" cy="80" r="14" fill="currentColor" />
                  <circle className="blinkdot" style={{ "--d": ".5s" }} cx="160" cy="80" r="22" fill="currentColor" />
                  <circle className="blinkdot" style={{ "--d": ".75s" }} cx="225" cy="80" r="14" fill="currentColor" />
                  <circle className="blinkdot" style={{ "--d": "1s" }} cx="290" cy="80" r="14" fill="var(--accent)" />
                </svg>
              </div>
              <h3 className="disp" style={{ margin: "0", fontSize: "58px" }}>DailyDiff</h3>
              <p style={{ margin: "14px 0 0", color: "var(--muted)", fontSize: "16px", lineHeight: "1.6" }}>
                Autonomous multi-agent tech curation. A LangGraph pipeline scours GitHub Trending, Hacker News and Dev.to, writes ELI5 summaries and emails briefings three times a week.
              </p>
              <div className="mono" style={{ marginTop: "16px", color: "var(--muted)", lineHeight: "1.8" }}>React · Vite · FastAPI · LangGraph · Mistral · Gemini · PostgreSQL</div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "20px" }}>
                <A className="pill mono" href="/work/dailydiff" style={{ height: "44px", padding: "0 18px", borderRadius: "999px", background: "var(--accent)", color: "var(--onaccent)", display: "inline-flex", alignItems: "center" }}>Case study →</A>
                <A className="pill mono" href="https://daily-diff-pi.vercel.app/" style={{ height: "44px", padding: "0 18px", borderRadius: "999px", border: "1px solid var(--text)", display: "inline-flex", alignItems: "center" }}>Live ↗</A>
                <A className="pill mono" href="https://github.com/shlokbam/DailyDiff" style={{ height: "44px", padding: "0 18px", borderRadius: "999px", border: "1px solid var(--line)", display: "inline-flex", alignItems: "center" }}>Code ↗</A>
              </div>
            </article>
            <article className="hcard" style={{ width: "520px", minHeight: "620px", border: "1px solid var(--line)", borderRadius: "26px", background: "var(--surface)", padding: "28px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
              <div className="disp" aria-hidden="true" style={{ position: "absolute", right: "20px", top: "10px", fontSize: "160px", color: "transparent", WebkitTextStroke: "1px var(--line)" }}>02</div>
              <div className="mono" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#2fd47a" }} />
                Live · Research
              </div>
              <div className="motif" style={{ flex: "1", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", minHeight: "220px" }}>
                <svg width="200" height="200" viewBox="0 0 220 220" fill="none" aria-hidden="true">
                  <g stroke="currentColor" strokeWidth="1">
                    <path d="M110 110 L40 50 M110 110 L180 44 M110 110 L190 150 M110 110 L52 172 M110 110 L110 20 M40 50 L110 20 L180 44 M52 172 L190 150" />
                  </g>
                  <circle className="spin" style={{ "--dur": "9s" }} cx="110" cy="110" r="34" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 7" />
                  <circle cx="110" cy="110" r="16" fill="var(--accent)" />
                  <circle cx="40" cy="50" r="8" fill="currentColor" />
                  <circle cx="180" cy="44" r="8" fill="currentColor" />
                  <circle cx="190" cy="150" r="8" fill="currentColor" />
                  <circle cx="52" cy="172" r="8" fill="currentColor" />
                  <circle cx="110" cy="20" r="8" fill="currentColor" />
                </svg>
              </div>
              <h3 className="disp" style={{ margin: "0", fontSize: "58px" }}>ResearchOS</h3>
              <p style={{ margin: "14px 0 0", color: "var(--muted)", fontSize: "16px", lineHeight: "1.6" }}>
                Scientific synthesis suite. Collaborating LangChain agents and Mistral scrape sources, generate structured reports, fact-check claims and index them in vector stores for RAG.
              </p>
              <div className="mono" style={{ marginTop: "16px", color: "var(--muted)", lineHeight: "1.8" }}>React · Python · LangChain · Mistral · Gemini · ChromaDB · Pinecone</div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "20px" }}>
                <A className="pill mono" href="https://multi-agent-ai-research-system-six.vercel.app/" style={{ height: "44px", padding: "0 18px", borderRadius: "999px", background: "var(--text)", color: "var(--bg)", display: "inline-flex", alignItems: "center" }}>Live ↗</A>
                <A className="pill mono" href="https://github.com/shlokbam/Multi_Agent_AI_Research_System" style={{ height: "44px", padding: "0 18px", borderRadius: "999px", border: "1px solid var(--line)", display: "inline-flex", alignItems: "center" }}>Code ↗</A>
              </div>
            </article>
            <article className="hcard" style={{ width: "520px", minHeight: "620px", border: "1px solid var(--line)", borderRadius: "26px", background: "var(--surface)", padding: "28px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
              <div className="disp" aria-hidden="true" style={{ position: "absolute", right: "20px", top: "10px", fontSize: "160px", color: "transparent", WebkitTextStroke: "1px var(--line)" }}>03</div>
              <div className="mono" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ padding: "4px 10px", borderRadius: "999px", background: "var(--text)", color: "var(--bg)" }}>Industry sponsored</span>
              </div>
              <div className="motif" style={{ flex: "1", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", minHeight: "220px" }}>
                <svg width="200" height="200" viewBox="0 0 220 220" fill="none" aria-hidden="true">
                  <circle className="spin" style={{ "--dur": "14s" }} cx="110" cy="110" r="96" stroke="currentColor" strokeWidth="10" strokeDasharray="120 482" strokeLinecap="round" />
                  <circle className="spin rev" style={{ "--dur": "9s" }} cx="110" cy="110" r="70" stroke="var(--accent)" strokeWidth="10" strokeDasharray="90 350" strokeLinecap="round" />
                  <circle className="spin" style={{ "--dur": "6s" }} cx="110" cy="110" r="44" stroke="currentColor" strokeWidth="10" strokeDasharray="50 226" strokeLinecap="round" />
                  <circle cx="110" cy="110" r="10" fill="var(--accent)" />
                </svg>
              </div>
              <h3 className="disp" style={{ margin: "0", fontSize: "58px" }}>Eagle LMS</h3>
              <p style={{ margin: "14px 0 0", color: "var(--muted)", fontSize: "16px", lineHeight: "1.6" }}>
                Enterprise learning platform with a FastAPI backend, trainer and trainee dashboards, an Expo mobile app, customised PDF watermarking and a containerised local DevOps pipeline.
              </p>
              <div className="mono" style={{ marginTop: "16px", color: "var(--muted)", lineHeight: "1.8" }}>FastAPI · React · React Native · Expo · Docker · Terraform · Jenkins</div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "20px" }}>
                <A className="pill mono" href="https://github.com/shlokbam/lms" style={{ height: "44px", padding: "0 18px", borderRadius: "999px", background: "var(--text)", color: "var(--bg)", display: "inline-flex", alignItems: "center" }}>Code ↗</A>
              </div>
            </article>
            <article className="hcard" style={{ width: "520px", minHeight: "620px", border: "1px solid var(--line)", borderRadius: "26px", background: "var(--surface)", padding: "28px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
              <div className="disp" aria-hidden="true" style={{ position: "absolute", right: "20px", top: "10px", fontSize: "160px", color: "transparent", WebkitTextStroke: "1px var(--line)" }}>04</div>
              <div className="mono" style={{ display: "flex", gap: "10px", alignItems: "center", color: "var(--muted)" }}>Privacy-first · Finance</div>
              <div className="motif" style={{ flex: "1", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", minHeight: "220px" }}>
                <svg width="250" height="170" viewBox="0 0 260 180" fill="none" aria-hidden="true">
                  <path d="M0 170 H260" stroke="currentColor" strokeWidth="1" />
                  <rect className="bar" style={{ "--d": "0s" }} x="8" y="40" width="22" height="130" rx="4" fill="currentColor" />
                  <rect className="bar" style={{ "--d": ".3s" }} x="44" y="70" width="22" height="100" rx="4" fill="currentColor" />
                  <rect className="bar" style={{ "--d": ".6s" }} x="80" y="20" width="22" height="150" rx="4" fill="var(--accent)" />
                  <rect className="bar" style={{ "--d": ".9s" }} x="116" y="90" width="22" height="80" rx="4" fill="currentColor" />
                  <rect className="bar" style={{ "--d": "1.2s" }} x="152" y="50" width="22" height="120" rx="4" fill="currentColor" />
                  <rect className="bar" style={{ "--d": "1.5s" }} x="188" y="30" width="22" height="140" rx="4" fill="var(--accent)" />
                  <rect className="bar" style={{ "--d": "1.8s" }} x="224" y="80" width="22" height="90" rx="4" fill="currentColor" />
                </svg>
              </div>
              <h3 className="disp" style={{ margin: "0", fontSize: "58px" }}>PaisaWise</h3>
              <p style={{ margin: "14px 0 0", color: "var(--muted)", fontSize: "16px", lineHeight: "1.6" }}>
                Automated personal finance that parses bank SMS alerts on-device, then applies rules, heuristics and an LLM classifier to separate spending from investments, transfers and family cashflow.
              </p>
              <div className="mono" style={{ marginTop: "16px", color: "var(--muted)", lineHeight: "1.8" }}>React · FastAPI · Python · LLM classifier · Tailwind</div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "20px" }}>
                <A className="pill mono" href="https://github.com/shlokbam/PaisaWise" style={{ height: "44px", padding: "0 18px", borderRadius: "999px", background: "var(--text)", color: "var(--bg)", display: "inline-flex", alignItems: "center" }}>Code ↗</A>
              </div>
            </article>
            <article className="hcard" style={{ width: "520px", minHeight: "620px", border: "1px solid var(--line)", borderRadius: "26px", background: "var(--surface)", padding: "28px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
              <div className="disp" aria-hidden="true" style={{ position: "absolute", right: "20px", top: "10px", fontSize: "160px", color: "transparent", WebkitTextStroke: "1px var(--line)" }}>05</div>
              <div className="mono" style={{ display: "flex", gap: "10px", alignItems: "center", color: "var(--muted)" }}>Dev tools · Prompts</div>
              <div className="motif" style={{ flex: "1", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", minHeight: "220px" }}>
                <svg width="270" height="164" viewBox="0 0 280 170" fill="none" aria-hidden="true">
                  <rect x="0" y="0" width="280" height="170" rx="14" stroke="currentColor" strokeWidth="1" />
                  <rect x="20" y="24" width="12" height="8" rx="2" fill="currentColor" />
                  <rect className="slide" style={{ "--d": "0s", "--sx": "18px" }} x="44" y="24" width="150" height="8" rx="4" fill="currentColor" />
                  <rect x="20" y="50" width="12" height="8" rx="2" fill="var(--accent)" />
                  <rect className="slide" style={{ "--d": ".4s", "--sx": "-14px" }} x="44" y="50" width="196" height="8" rx="4" fill="var(--accent)" />
                  <rect x="20" y="76" width="12" height="8" rx="2" fill="currentColor" />
                  <rect className="slide" style={{ "--d": ".8s", "--sx": "22px" }} x="44" y="76" width="120" height="8" rx="4" fill="currentColor" opacity=".5" />
                  <rect x="20" y="102" width="12" height="8" rx="2" fill="var(--accent)" />
                  <rect className="slide" style={{ "--d": "1.2s", "--sx": "-20px" }} x="44" y="102" width="170" height="8" rx="4" fill="var(--accent)" />
                </svg>
              </div>
              <h3 className="disp" style={{ margin: "0", fontSize: "58px" }}>PromptVault</h3>
              <p style={{ margin: "14px 0 0", color: "var(--muted)", fontSize: "16px", lineHeight: "1.6" }}>
                Centralised prompt management and version control for AI-agent teams — Monaco editor workspace, side-by-side version diffs, test suites, comments and audit trails.
              </p>
              <div className="mono" style={{ marginTop: "16px", color: "var(--muted)", lineHeight: "1.8" }}>React · FastAPI · SQLAlchemy · Monaco · Python</div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "20px" }}>
                <A className="pill mono" href="https://github.com/shlokbam/PromptVault" style={{ height: "44px", padding: "0 18px", borderRadius: "999px", background: "var(--text)", color: "var(--bg)", display: "inline-flex", alignItems: "center" }}>Code ↗</A>
              </div>
            </article>
          </div>
          <div style={{ height: "2px", background: "var(--line)", borderRadius: "2px", overflow: "hidden" }}>
            <div className="hs-prog" style={{ height: "2px", width: "100%", background: "var(--accent)" }} />
          </div>
        </div>
      </section>
      <section style={{ padding: "104px 0 112px" }}>
        <div className="wrap">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "24px", flexWrap: "wrap" }}>
            <div>
              <span className="mono" style={{ color: "var(--muted)" }}>(02.2) — Index</span>
              {" "}
              <h2 className="disp rv" style={{ margin: "20px 0 0", fontSize: "clamp(48px, 6.4vw, 100px)" }}>
                Everything{" "}
                <span className="mono" style={{ fontSize: "16px", letterSpacing: ".04em", color: "var(--muted)", verticalAlign: "top" }}>({count})</span>
              </h2>
            </div>
            <div role="group" aria-label="Filter projects" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {filters.map((f, f_i) => (
                <button key={f_i} type="button" className="chip mono" onClick={f.pick} aria-pressed={f.pressed} style={css(f.style)}>
                  {f.label}{" "}
                  <span style={{ opacity: ".6" }}>{f.count}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mono g-irow hide-sm" style={{ marginTop: "44px", padding: "0 12px 14px", color: "var(--muted)", borderBottom: "1px solid var(--text)" }}>
            <span>No.</span>
            <span>Project</span>
            <span className="hide-md">Field</span>
            <span>Stack</span>
            <span style={{ textAlign: "right" }}>Links</span>
          </div>
          <div>
            {rows.map((p, p_i) => (
              <div key={p_i} className="irow g-irow" style={{ padding: "20px 12px", borderBottom: "1px solid var(--line)" }}>
                <span className="mono" style={{ color: "var(--muted)" }}>{p.n}</span>
                <div>
                  <div className="ititle" style={{ fontWeight: "700", fontSize: "20px", letterSpacing: "-.01em" }}>{p.title}</div>
                  <div className="idesc-sm" style={{ color: "var(--muted)", fontSize: "14px", lineHeight: "1.5", marginTop: "6px" }}>{p.desc}</div>
                </div>
                <span className="mono hide-md" style={{ color: "var(--muted)" }}>{p.field}</span>
                <span className="mono hide-sm" style={{ color: "var(--muted)", fontSize: "11px", lineHeight: "1.7" }}>{p.tags}</span>
                <span style={{ display: "flex", gap: "14px", justifyContent: "flex-end" }}>
                  {p.live && (
                    <A className="mono ul" href={p.live} title={p.status === 'offline' ? 'Free-tier host may take a moment to wake up' : p.status === 'online' ? 'Online now' : undefined} style={{ color: "var(--accent)", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      {p.status && <span aria-hidden="true" style={{ width: "6px", height: "6px", borderRadius: "50%", background: p.status === 'online' ? "#2fd47a" : "var(--muted2)" }} />}
                      Live ↗
                    </A>
                  )}
                  <A className="mono ul" href={p.code}>Code ↗</A>
                </span>
                <div className="peek" aria-hidden="true" style={{ borderRadius: "18px", background: "var(--surface2)", border: "1px solid var(--line)", padding: "20px", boxShadow: "0 24px 50px rgba(0,0,0,.3)" }}>
                  <div className="mono" style={{ display: "flex", justifyContent: "space-between", color: "var(--muted)" }}>
                    <span>{p.n} / 21</span>
                    <span style={{ color: "var(--accent)" }}>{p.field}</span>
                  </div>
                  <div style={{ fontSize: "22px", fontWeight: "700", marginTop: "14px" }}>{p.title}</div>
                  <p style={{ margin: "10px 0 0", fontSize: "15px", lineHeight: "1.5", color: "var(--muted)" }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <A className="next" href="/work/dailydiff" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="wrap" style={{ paddingTop: "72px", paddingBottom: "72px" }}>
          <div className="mono nmuted" style={{ color: "var(--muted)" }}>Next page — (02.1) Case study</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "24px", marginTop: "18px" }}>
            <span className="disp nt" style={{ fontSize: "clamp(60px, 10vw, 160px)" }}>DailyDiff</span>
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
