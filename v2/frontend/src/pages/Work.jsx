import Layout from '../components/Layout'
import A from '../components/A'
import AIBackdrop from '../components/AIBackdrop'
import { css } from '../lib/css'
import { useState } from 'react'
import { useAvailability } from '../lib/site'
import { PROJECTS, slug } from '../data/projects'
import { demoState, DEMO_NOTE, DEMO_LABEL } from '../lib/demo'
import './Work.css'

export default function Work() {
  const [fv, setFilter] = useState('all')
  const avail = useAvailability()
  const title = 'WORK'.split('').map((ch, i) => ({ ch, style: '--i: ' + i }))
  const all = PROJECTS.map((p, i) => ({ ...p, n: String(i + 1).padStart(2, '0') }))
  const rows = all
    .filter((p) => fv === 'all' || p.cats.indexOf(fv) !== -1)
    .map((p) => ({ ...p, stack: p.tags.split('·').map((t) => t.trim()).filter(Boolean), status: demoState(avail, p.live) }))
  const chip = (on) => on
    ? 'min-height: 44px; padding: 0 16px; border-radius: 999px; border: 1px solid var(--text); background: var(--text); color: var(--bg); cursor: pointer'
    : 'min-height: 44px; padding: 0 16px; border-radius: 999px; border: 1px solid var(--line); background: transparent; color: var(--text); cursor: pointer'
  const filters = [['all', 'All'], ['ai', 'AI / ML'], ['web', 'Web'], ['cloud', 'Cloud'], ['devops', 'DevOps']].map(([id, label]) => ({
    label, count: id === 'all' ? all.length : all.filter((p) => p.cats.indexOf(id) !== -1).length,
    pressed: fv === id ? 'true' : 'false', style: chip(fv === id), pick: () => setFilter(id)
  }))
  const count = rows.length
  return (
    <Layout page="work" curtain="Work" chat greeting="Ask me which project fits your team, or how any of them were built." footerStyle="padding: 56px 0 36px; border-top: 1px solid var(--line)">
      <section id="top" className="dots" style={{ position: "relative", paddingTop: "168px", paddingBottom: "56px", borderBottom: "1px solid var(--line)" }}>
        <AIBackdrop kind="gd" />
        <div className="wrap">
          <div className="fade" style={{ "--d": ".3s", display: "flex", justifyContent: "flex-end", gap: "24px", flexWrap: "wrap" }}>
            <span className="mono" style={{ color: "var(--muted)" }}>Shlok Bam / Portfolio 2026</span>
          </div>
          <h1 className="disp" aria-label="Work" style={{ margin: "24px 0 0", fontSize: "min(clamp(100px, 21vw, 310px), calc((100vw - 80px) / 3.65))", fontStretch: "100%" }}>
            <span className="mask" style={{ whiteSpace: "nowrap" }}>
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
              <span className="mono" style={{ color: "var(--muted)" }}>Flagships</span>
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
            <article className="hcard" style={{ width: "400px", minHeight: "500px", border: "1px solid var(--line)", borderRadius: "26px", background: "var(--surface)", padding: "24px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
              <div className="disp" aria-hidden="true" style={{ position: "absolute", right: "18px", top: "8px", fontSize: "112px", color: "transparent", WebkitTextStroke: "1px var(--line)" }}>01</div>
              <div className="mono" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#2fd47a" }} />
                Live · Agents
              </div>
              <div className="motif" style={{ flex: "1", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", minHeight: "150px" }}>
                <svg className="dash" width="100%" height="110" viewBox="0 0 320 160" fill="none" aria-hidden="true">
                  <path d="M30 80 H290" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" />
                  <circle className="blinkdot" style={{ "--d": "0s" }} cx="30" cy="80" r="14" fill="var(--accent)" />
                  <circle className="blinkdot" style={{ "--d": ".25s" }} cx="95" cy="80" r="14" fill="currentColor" />
                  <circle className="blinkdot" style={{ "--d": ".5s" }} cx="160" cy="80" r="22" fill="currentColor" />
                  <circle className="blinkdot" style={{ "--d": ".75s" }} cx="225" cy="80" r="14" fill="currentColor" />
                  <circle className="blinkdot" style={{ "--d": "1s" }} cx="290" cy="80" r="14" fill="var(--accent)" />
                </svg>
              </div>
              <h3 className="disp" style={{ margin: "0", fontSize: "42px" }}>DailyDiff</h3>
              <p style={{ margin: "12px 0 0", color: "var(--muted)", fontSize: "15px", lineHeight: "1.55" }}>
                A live LangGraph pipeline over 7 sources that emails a fact-checked brief three times a week: 185 briefs, 42 editions. LLM calls cut from up to 22 to 4, behind a fail-closed publish gate.
              </p>
              <div className="mono" style={{ marginTop: "16px", color: "var(--muted)", lineHeight: "1.8" }}>LangGraph · LangChain · FastAPI · Mistral · Gemini · Neon Postgres · React · GitHub Actions</div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "20px" }}>
                <A className="pill mono" href="/work/dailydiff" style={{ height: "44px", padding: "0 18px", borderRadius: "999px", background: "var(--accent)", color: "var(--onaccent)", display: "inline-flex", alignItems: "center" }}>Case study →</A>
                {demoState(avail, "https://dailydiff.in/") === 'down'
                  ? <span className="pill mono" title={DEMO_NOTE.down} style={{ height: "44px", padding: "0 18px", borderRadius: "999px", border: "1px dashed var(--line)", color: "var(--muted)", display: "inline-flex", alignItems: "center" }}>Offline</span>
                  : <A className="pill mono" href="https://dailydiff.in/" title={DEMO_NOTE[demoState(avail, "https://dailydiff.in/")]} style={{ height: "44px", padding: "0 18px", borderRadius: "999px", border: "1px solid var(--text)", display: "inline-flex", alignItems: "center" }}>{DEMO_LABEL[demoState(avail, "https://dailydiff.in/")]} ↗</A>}
                <A className="pill mono" href="https://github.com/shlokbam/DailyDiff" style={{ height: "44px", padding: "0 18px", borderRadius: "999px", border: "1px solid var(--line)", display: "inline-flex", alignItems: "center" }}>Code ↗</A>
              </div>
            </article>
            <article className="hcard" style={{ width: "400px", minHeight: "500px", border: "1px solid var(--line)", borderRadius: "26px", background: "var(--surface)", padding: "24px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
              <div className="disp" aria-hidden="true" style={{ position: "absolute", right: "18px", top: "8px", fontSize: "112px", color: "transparent", WebkitTextStroke: "1px var(--line)" }}>02</div>
              <div className="mono" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#2fd47a" }} />
                Live · Research
              </div>
              <div className="motif" style={{ flex: "1", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", minHeight: "150px" }}>
                <svg width="150" height="150" viewBox="0 0 220 220" fill="none" aria-hidden="true">
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
              <h3 className="disp" style={{ margin: "0", fontSize: "42px" }}>ResearchOS</h3>
              <p style={{ margin: "12px 0 0", color: "var(--muted)", fontSize: "15px", lineHeight: "1.55" }}>
                Scientific synthesis suite. Collaborating LangChain agents and Mistral scrape sources, generate structured reports, fact-check claims and index them in vector stores for RAG.
              </p>
              <div className="mono" style={{ marginTop: "16px", color: "var(--muted)", lineHeight: "1.8" }}>React · Python · LangChain · Mistral · Gemini · ChromaDB · Pinecone</div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "20px" }}>
                {demoState(avail, "https://multi-agent-ai-research-system-six.vercel.app/") === 'down'
                  ? <span className="pill mono" title={DEMO_NOTE.down} style={{ height: "44px", padding: "0 18px", borderRadius: "999px", border: "1px dashed var(--line)", color: "var(--muted)", display: "inline-flex", alignItems: "center" }}>Offline</span>
                  : <A className="pill mono" href="https://multi-agent-ai-research-system-six.vercel.app/" title={DEMO_NOTE[demoState(avail, "https://multi-agent-ai-research-system-six.vercel.app/")]} style={{ height: "44px", padding: "0 18px", borderRadius: "999px", background: "var(--text)", color: "var(--bg)", display: "inline-flex", alignItems: "center" }}>{DEMO_LABEL[demoState(avail, "https://multi-agent-ai-research-system-six.vercel.app/")]} ↗</A>}
                <A className="pill mono" href="https://github.com/shlokbam/Multi_Agent_AI_Research_System" style={{ height: "44px", padding: "0 18px", borderRadius: "999px", border: "1px solid var(--line)", display: "inline-flex", alignItems: "center" }}>Code ↗</A>
              </div>
            </article>
            <article className="hcard" style={{ width: "400px", minHeight: "500px", border: "1px solid var(--line)", borderRadius: "26px", background: "var(--surface)", padding: "24px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
              <div className="disp" aria-hidden="true" style={{ position: "absolute", right: "18px", top: "8px", fontSize: "112px", color: "transparent", WebkitTextStroke: "1px var(--line)" }}>03</div>
              <div className="mono" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ padding: "4px 10px", borderRadius: "999px", background: "var(--text)", color: "var(--bg)" }}>Industry sponsored</span>
              </div>
              <div className="motif" style={{ flex: "1", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", minHeight: "150px" }}>
                <svg width="150" height="150" viewBox="0 0 220 220" fill="none" aria-hidden="true">
                  <circle className="spin" style={{ "--dur": "14s" }} cx="110" cy="110" r="96" stroke="currentColor" strokeWidth="10" strokeDasharray="120 482" strokeLinecap="round" />
                  <circle className="spin rev" style={{ "--dur": "9s" }} cx="110" cy="110" r="70" stroke="var(--accent)" strokeWidth="10" strokeDasharray="90 350" strokeLinecap="round" />
                  <circle className="spin" style={{ "--dur": "6s" }} cx="110" cy="110" r="44" stroke="currentColor" strokeWidth="10" strokeDasharray="50 226" strokeLinecap="round" />
                  <circle cx="110" cy="110" r="10" fill="var(--accent)" />
                </svg>
              </div>
              <h3 className="disp" style={{ margin: "0", fontSize: "30px", lineHeight: ".92" }}>Enterprise Workforce Training Platform</h3>
              <p style={{ margin: "12px 0 0", color: "var(--muted)", fontSize: "15px", lineHeight: "1.55" }}>
                Cross-platform LMS with role-based dashboards for trainers and trainees, server-side PDF/video watermarking per trainee, JWT/bcrypt-secured routes, Terraform-provisioned S3 and a Jenkins CI/CD pipeline.
              </p>
              <div className="mono" style={{ marginTop: "16px", color: "var(--muted)", lineHeight: "1.8" }}>FastAPI · SQLAlchemy · MySQL · React · React Native · Docker · Terraform · AWS S3 · Jenkins</div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "20px" }}>
                <A className="pill mono" href="https://github.com/shlokbam/lms" style={{ height: "44px", padding: "0 18px", borderRadius: "999px", background: "var(--text)", color: "var(--bg)", display: "inline-flex", alignItems: "center" }}>Code ↗</A>
              </div>
            </article>
            <article className="hcard" style={{ width: "400px", minHeight: "500px", border: "1px solid var(--line)", borderRadius: "26px", background: "var(--surface)", padding: "24px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
              <div className="disp" aria-hidden="true" style={{ position: "absolute", right: "18px", top: "8px", fontSize: "112px", color: "transparent", WebkitTextStroke: "1px var(--line)" }}>04</div>
              <div className="mono" style={{ display: "flex", gap: "10px", alignItems: "center", color: "var(--muted)" }}>SMS · Finance</div>
              <div className="motif" style={{ flex: "1", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", minHeight: "150px" }}>
                <svg width="190" height="130" viewBox="0 0 260 180" fill="none" aria-hidden="true">
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
              <h3 className="disp" style={{ margin: "0", fontSize: "42px" }}>PaisaWise</h3>
              <p style={{ margin: "12px 0 0", color: "var(--muted)", fontSize: "15px", lineHeight: "1.55" }}>
                Automated personal finance from bank SMS alerts. The phone filters the alerts and sends them to a FastAPI server, where rules and heuristics classify each transaction; low-confidence ones go to an LLM (Groq or Mistral). It separates spending from investments, transfers and family cashflow.
              </p>
              <div className="mono" style={{ marginTop: "16px", color: "var(--muted)", lineHeight: "1.8" }}>React · FastAPI · Python · Groq · Mistral · Tailwind</div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "20px" }}>
                <A className="pill mono" href="https://github.com/shlokbam/PaisaWise" style={{ height: "44px", padding: "0 18px", borderRadius: "999px", background: "var(--text)", color: "var(--bg)", display: "inline-flex", alignItems: "center" }}>Code ↗</A>
              </div>
            </article>
            <article className="hcard" style={{ width: "400px", minHeight: "500px", border: "1px solid var(--line)", borderRadius: "26px", background: "var(--surface)", padding: "24px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
              <div className="disp" aria-hidden="true" style={{ position: "absolute", right: "18px", top: "8px", fontSize: "112px", color: "transparent", WebkitTextStroke: "1px var(--line)" }}>05</div>
              <div className="mono" style={{ display: "flex", gap: "10px", alignItems: "center", color: "var(--muted)" }}>Dev tools · Prompts</div>
              <div className="motif" style={{ flex: "1", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", minHeight: "150px" }}>
                <svg width="205" height="125" viewBox="0 0 280 170" fill="none" aria-hidden="true">
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
              <h3 className="disp" style={{ margin: "0", fontSize: "42px" }}>PromptVault</h3>
              <p style={{ margin: "12px 0 0", color: "var(--muted)", fontSize: "15px", lineHeight: "1.55" }}>
                Centralised prompt management and version control for AI-agent teams: Monaco editor workspace, side-by-side version diffs, test suites, comments and audit trails.
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
              <span className="mono" style={{ color: "var(--muted)" }}>Index</span>
              {" "}
              <h2 className="disp rv" style={{ margin: "20px 0 0", fontSize: "clamp(36px, 6.4vw, 100px)" }}>
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
              <div key={p.title} id={slug(p.title)} className="irow g-irow">
                <span className="mono inum">{p.n}</span>
                <div style={{ minWidth: "0" }}>
                  <div className="ititle">{p.title}{p.badge && <span className="ibadge mono">{p.badge}</span>}</div>
                  <div className="idesc-sm">{p.desc}</div>
                </div>
                <span className="mono hide-md" style={{ color: "var(--muted)" }}>{p.field}</span>
                <span className="istack hide-sm">
                  {p.stack.slice(0, 3).map((t) => <span key={t} className="ichip mono">{t}</span>)}
                  {p.stack.length > 3 && <span className="ichip mono more">+{p.stack.length - 3}</span>}
                </span>
                <span className="ilinks">
                  {p.live && (p.status === 'down'
                    ? (
                      <span className="ilink off mono" title={DEMO_NOTE.down + '; the code is still available'}>
                        <span className="idot" aria-hidden="true" />Offline
                      </span>
                    )
                    : (
                      <A className={'ilink live mono' + (p.status === 'sleeping' ? ' sleep' : '')} href={p.live} aria-label={'Open ' + p.title + ' live' + (p.status === 'sleeping' ? '. It is asleep and wakes in about a minute' : '')} title={p.status ? DEMO_NOTE[p.status] : undefined}>
                        <span className={'idot' + (p.status === 'online' ? ' on' : p.status === 'sleeping' ? ' zz' : '')} aria-hidden="true" />{p.status === 'sleeping' ? 'Wake' : 'Live'}
                      </A>
                    ))}
                  {p.code
                    ? (
                      <A className="ilink mono" href={p.code} aria-label={p.title + ' source code on GitHub'}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" /></svg>
                        Code
                      </A>
                    )
                    : (
                      <span className="ilink off mono" title="Repository is not public">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
                        Private
                      </span>
                    )}
                </span>
                <div className="peek" aria-hidden="true">
                  <div className="mono pk-top">
                    <span>{p.n} / 21 · {p.field}</span>
                    {p.badge && <span className="pk-badge">{p.badge}</span>}
                  </div>
                  <div className="pk-title">{p.title}</div>
                  <p className="pk-desc">{p.desc}</p>
                  {p.more && (
                    <ul className="pk-list">
                      {p.more.map((m) => <li key={m}>{m}</li>)}
                    </ul>
                  )}
                  <div className="pk-stack">{p.stack.map((t) => <span key={t} className="ichip mono">{t}</span>)}</div>
                  <div className="mono pk-foot">
                    {p.live && <span><span className={'idot' + (p.status === 'online' ? ' on' : p.status === 'sleeping' ? ' zz' : '')} /> {DEMO_NOTE[p.status]}</span>}
                    <span>{p.code ? 'Open source on GitHub' : 'Private repository'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <A className="next" href="/journey" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="wrap" style={{ paddingTop: "26px", paddingBottom: "26px" }}>
          <div className="mono nmuted" style={{ color: "var(--muted)" }}>Next page</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "24px", marginTop: "8px" }}>
            <span className="disp nt" style={{ fontSize: "clamp(26px, 3vw, 46px)" }}>Journey</span>
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
