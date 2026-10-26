import Layout from '../components/Layout'
import A from '../components/A'
import AIBackdrop from '../components/AIBackdrop'
import ProfilePeek from '../components/ProfilePeek'
import Glance from '../components/Glance'
import Hello from '../components/Hello'
import AskAI from '../components/AskAI'
import { css } from '../lib/css'
import { useStats } from '../lib/site'
import { RESUME, opt } from '../lib/links'
import './Home.css'

export default function Home() {
  const stats = useStats()
  const lc = (stats && stats.leetcode) || {}
  const cc = (stats && stats.codechef) || {}
  const gh = (stats && stats.github) || {}
  const show = (v) => (v === undefined || v === null || v === 'N/A' || v === '' ? '--' : v)
  const profiles = [
    { kind: 'leetcode', data: lc, name: 'LeetCode', url: 'https://leetcode.com/u/shlokbam05/', a: 'Solved', b: 'Rating', va: show(lc.total), vb: show(lc.contestRating) },
    { kind: 'codechef', data: cc, name: 'CodeChef', url: 'https://www.codechef.com/users/shlokbam', a: 'Rating', b: 'Stars', va: show(cc.rating), vb: show(cc.stars) },
    { kind: 'github', data: gh, name: 'GitHub', url: 'https://github.com/shlokbam', a: 'Contribs', b: 'Repos', va: show(gh.contributions), vb: show(gh.repos) }
  ]
  const tp = ['Agentic AI', 'RAG pipelines', 'FastAPI', 'React', 'LangGraph', 'MCP', 'Docker']
  const tape = tp.concat(tp)
  const sentence = "I'm an IT student at VIT Pune who turns messy, real-world problems into systems that think, and ships them end to end: agents, retrieval, APIs, interfaces and the pipelines that deploy them."
  const hl = ['systems', 'that', 'think']
  const words = sentence.split(' ').map((t) => ({ t, style: hl.indexOf(t) !== -1 ? 'color: var(--accent)' : '' }))
  return (
    <Layout page="home" chat footerStyle="padding: 56px 0 36px; border-top: 1px solid var(--line)">
      <section id="top" className="dots" style={{ position: "relative", overflow: "hidden", paddingTop: "148px", paddingBottom: "56px", borderBottom: "1px solid var(--line)" }}>
        <div aria-hidden="true" data-glow style={{ position: "absolute", inset: "0", pointerEvents: "none", background: "radial-gradient(560px circle at var(--cx, 72%) var(--cy, 30%), color-mix(in srgb, var(--accent) 8%, transparent), transparent 70%)" }} />
        <AIBackdrop kind="nn" />
        <div className="wrap" style={{ position: "relative" }}>
          <div className="fade" style={{ "--d": ".2s", display: "flex", justifyContent: "flex-end", gap: "24px", flexWrap: "wrap" }}>
            <span className="mono" style={{ color: "var(--muted)" }}>Pune, IN · 2026</span>
          </div>
          <Hello style={{ "--d": ".25s", margin: "56px 0 14px", fontSize: "clamp(26px, 2.6vw, 38px)", color: "var(--muted)" }} />
          <h1 className="disp" style={{ margin: "0", fontSize: "clamp(64px, 13vw, 196px)", fontStretch: "100%" }}>
            <span className="mask">
              <span className="rise shiny" style={{ "--d": ".15s" }}>
                Shlok Bam
                <span style={{ WebkitTextFillColor: "var(--accent)", color: "var(--accent)" }}>.</span>
              </span>
            </span>
          </h1>
          <div className="g-hero" style={{ marginTop: "40px" }}>
            <div>
              <p className="fade" style={{ "--d": ".55s", margin: "0", maxWidth: "780px", fontSize: "clamp(22px, 2.2vw, 31px)", lineHeight: "1.3", letterSpacing: "-.01em" }}>
                AI / Generative AI engineer. I ship{" "}
                <span style={{ color: "var(--accent)" }}>agentic and LLM-powered systems</span>
                {" "}to production, from multi-agent pipelines to LLM-as-judge evals, currently as an intern at PharmaACE Innovations.
              </p>
              <div className="fade" style={{ "--d": ".7s", display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "34px" }}>
                <A className="btn mono" href={RESUME} style={{ background: "var(--accent)", color: "var(--onaccent)", fontWeight: "500" }}>
                  View résumé{" "}
                  <svg className="arr" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                    <path d="M12 4v13M6 11l6 6 6-6" />
                  </svg>
                </A>
                <A className="btn mono" href="/work" style={{ border: "1px solid var(--text)" }}>
                  See my work{" "}
                  <svg className="arr" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </A>
                <A className="btn mono" href="/contact" style={{ border: "1px solid var(--line)" }}>Contact</A>
              </div>
            </div>
            <aside className="fade cprofiles" aria-label="Coding profiles" style={{ "--d": ".8s", border: "1px solid var(--line)", background: "color-mix(in srgb, var(--surface) 90%, transparent)", borderRadius: "18px", padding: "18px 20px" }}>
              <div className="mono" style={{ display: "flex", justifyContent: "space-between", color: "var(--muted)" }}>
                <span>Coding profiles</span>
                <span>{stats === null ? 'Loading' : stats ? 'Live' : 'Offline'}</span>
              </div>
              {profiles.map((pf, pf_i) => (
                <A key={pf_i} href={pf.url} className="prow" style={{ display: "grid", gridTemplateColumns: "96px repeat(2, minmax(0, 1fr))", gap: "10px", alignItems: "baseline", padding: "13px 0", borderTop: "1px solid var(--line)", marginTop: "10px" }}>
                  <span style={{ fontWeight: "700" }}>{pf.name}</span>
                  <span>
                    <span className="disp" style={{ fontSize: "22px", letterSpacing: "-.02em" }}>{pf.va}</span>
                    <span className="mono" style={{ display: "block", fontSize: "10px", color: "var(--muted)", marginTop: "4px" }}>{pf.a}</span>
                  </span>
                  <span>
                    <span className="disp" style={{ fontSize: "22px", letterSpacing: "-.02em" }}>{pf.vb}</span>
                    <span className="mono" style={{ display: "block", fontSize: "10px", color: "var(--muted)", marginTop: "4px" }}>{pf.b}</span>
                  </span>
                  <ProfilePeek kind={pf.kind} data={pf.data} />
                </A>
              ))}
            </aside>
          </div>
          <div className="g-facts fade" style={{ "--d": ".9s", marginTop: "56px", borderTop: "1px solid var(--line)" }}>
            <div style={{ padding: "20px 20px 0 0" }}>
              <div className="mono" style={{ color: "var(--muted)" }}>Currently</div>
              <div style={{ marginTop: "8px", fontSize: "17px", fontWeight: "600" }}>Intern, PharmaACE Innovations</div>
            </div>
            <div style={{ padding: "20px 20px 0", borderLeft: "1px solid var(--line)" }}>
              <div className="mono" style={{ color: "var(--muted)" }}>Education</div>
              <div style={{ marginTop: "8px", fontSize: "17px", fontWeight: "600" }}>B.Tech IT, VIT Pune · 9.01 CGPA</div>
            </div>
            <div style={{ padding: "20px 20px 0", borderLeft: "1px solid var(--line)" }}>
              <div className="mono" style={{ color: "var(--muted)" }}>Focus</div>
              <div style={{ marginTop: "8px", fontSize: "17px", fontWeight: "600" }}>Agentic AI · LLM evals · RAG</div>
            </div>
            <div style={{ padding: "20px 0 0 20px", borderLeft: "1px solid var(--line)" }}>
              <div className="mono" style={{ color: "var(--muted)" }}>Based</div>
              <div style={{ marginTop: "8px", fontSize: "17px", fontWeight: "600" }}>Pune · open to relocate</div>
            </div>
          </div>
        </div>
      </section>
      <div className="marq-wrap" aria-label="Core skills" style={{ overflow: "hidden", borderBottom: "1px solid var(--line)", background: "var(--accent)", color: "var(--onaccent)", padding: "18px 0" }}>
        <div className="marq" style={{ "--dur": "55s" }}>
          {tape.map((x, x_i) => (
            <span key={x_i} className="disp" style={{ fontSize: "38px", display: "inline-flex", alignItems: "center", gap: "28px", paddingRight: "28px", whiteSpace: "nowrap" }}>
              {x}
              <span aria-hidden="true" style={{ width: "10px", height: "10px", borderRadius: "50%", background: "currentColor" }} />
            </span>
          ))}
        </div>
      </div>
      <section style={{ padding: "120px 0", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap g-state">
          <div className="rv" style={{ position: "relative", width: "200px", height: "200px" }}>
            <svg viewBox="0 0 200 200" style={{ position: "absolute", inset: "0", width: "200px", height: "200px" }} aria-hidden="true">
              <defs>
                <path id="sticker" d="M100,100 m-88,0 a88,88 0 1,1 176,0 a88,88 0 1,1 -176,0" />
              </defs>
              <text style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", letterSpacing: "3px", fill: "var(--muted)", textTransform: "uppercase" }}>
                <textPath href="#sticker">IT student · VIT Pune · Founding chair ITSA ·{" "}</textPath>
              </text>
            </svg>
            <div style={{ position: "absolute", left: "32px", top: "32px", width: "136px", height: "136px", borderRadius: "50%", overflow: "hidden", background: "var(--surface)" }}>
              <img loading="lazy" decoding="async" src={opt('/static/images/shlok-bam.jpg')} width="611" height="919" alt="Shlok Bam, AI / Generative AI engineer from Pune, India" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>
          <div>
            <span className="mono" style={{ color: "var(--muted)" }}>In short</span>
            {" "}
            <p style={{ margin: "24px 0 0", fontSize: "clamp(30px, 3.8vw, 56px)", lineHeight: "1.08", letterSpacing: "-.03em", fontWeight: "500" }}>
              {words.map((w, w_i) => (
                <span key={w_i} className="lit" style={css(w.style)}>{w.t}{" "}</span>
              ))}
            </p>
            {" "}
            <A className="btn mono" href="/about" style={{ marginTop: "40px", border: "1px solid var(--text)" }}>
              More about me{" "}
              <svg className="arr" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </A>
          </div>
        </div>
      </section>
      <Glance />
      <AskAI />
      {/* "Built to run" section: hidden for now — remove this comment wrapper to bring it back.
      <section style={{ padding: "120px 0", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "24px", flexWrap: "wrap" }}>
            <div>
              <span className="mono" style={{ color: "var(--muted)" }}>Selected work</span>
              {" "}
              <h2 className="disp rv" style={{ margin: "20px 0 0", fontSize: "clamp(52px, 7vw, 112px)" }}>
                Built{" "}
                <span className="serif" style={{ textTransform: "none", letterSpacing: "-.02em", fontWeight: "400", color: "var(--accent)" }}>to</span>
                {" "}run
              </h2>
            </div>
            <A className="btn mono" href="/work" style={{ border: "1px solid var(--text)" }}>
              All 21 projects{" "}
              <svg className="arr" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </A>
          </div>
          <div className="g-teaser" style={{ marginTop: "56px" }}>
            <A className="card rv" href="/work/dailydiff" style={{ border: "1px solid var(--line)", borderRadius: "24px", background: "var(--surface)", padding: "28px", display: "flex", flexDirection: "column", minHeight: "520px", overflow: "hidden" }}>
              <div className="mono" style={{ display: "flex", justifyContent: "space-between", color: "var(--muted)" }}>
                <span>01 / Flagship</span>
                <span style={{ display: "inline-flex", gap: "8px", alignItems: "center", color: "var(--text)" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#2fd47a" }} />
                  Live
                </span>
              </div>
              <div className="motif" style={{ flex: "1", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)" }}>
                <svg className="dash" width="100%" height="140" viewBox="0 0 320 160" fill="none" aria-hidden="true">
                  <path d="M30 80 H290" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" />
                  <circle className="blinkdot" style={{ "--d": "0s" }} cx="30" cy="80" r="14" fill="var(--accent)" />
                  <circle className="blinkdot" style={{ "--d": ".25s" }} cx="95" cy="80" r="14" fill="currentColor" />
                  <circle className="blinkdot" style={{ "--d": ".5s" }} cx="160" cy="80" r="22" fill="currentColor" />
                  <circle className="blinkdot" style={{ "--d": ".75s" }} cx="225" cy="80" r="14" fill="currentColor" />
                  <circle className="blinkdot" style={{ "--d": "1s" }} cx="290" cy="80" r="14" fill="var(--accent)" />
                </svg>
              </div>
              <div className="disp" style={{ fontSize: "clamp(38px, 3.1vw, 52px)" }}>DailyDiff</div>
              <p style={{ margin: "14px 0 0", color: "var(--muted)", fontSize: "16px", lineHeight: "1.55" }}>
                A live LangGraph pipeline over 7 sources that emails a fact-checked tech brief three times a week: 185 briefs across 42 editions so far.
              </p>
              <div className="mono" style={{ marginTop: "22px", display: "flex", justifyContent: "space-between", color: "var(--muted)" }}>
                <span>LangGraph · FastAPI · React</span>
                <span style={{ color: "var(--accent)" }}>Case study →</span>
              </div>
            </A>
            <A className="card rv" href="/work" style={{ border: "1px solid var(--line)", borderRadius: "24px", background: "var(--surface)", padding: "28px", display: "flex", flexDirection: "column", minHeight: "520px", overflow: "hidden" }}>
              <div className="mono" style={{ display: "flex", justifyContent: "space-between", color: "var(--muted)" }}>
                <span>02 / Flagship</span>
                <span style={{ display: "inline-flex", gap: "8px", alignItems: "center", color: "var(--text)" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#2fd47a" }} />
                  Live
                </span>
              </div>
              <div className="motif" style={{ flex: "1", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)" }}>
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
              <div className="disp" style={{ fontSize: "clamp(38px, 3.1vw, 52px)" }}>ResearchOS</div>
              <p style={{ margin: "14px 0 0", color: "var(--muted)", fontSize: "16px", lineHeight: "1.55" }}>
                Collaborating LangChain agents research, draft, fact-check and index structured reports for RAG.
              </p>
              <div className="mono" style={{ marginTop: "22px", display: "flex", justifyContent: "space-between", color: "var(--muted)" }}>
                <span>LangChain · Mistral · Pinecone</span>
                <span style={{ color: "var(--accent)" }}>Explore →</span>
              </div>
            </A>
            <A className="card rv" href="/work" style={{ border: "1px solid var(--line)", borderRadius: "24px", background: "var(--surface)", padding: "28px", display: "flex", flexDirection: "column", minHeight: "520px", overflow: "hidden" }}>
              <div className="mono" style={{ display: "flex", justifyContent: "space-between", color: "var(--muted)" }}>
                <span>03 / Flagship</span>
                <span style={{ padding: "4px 10px", borderRadius: "999px", background: "var(--text)", color: "var(--bg)" }}>Sponsored</span>
              </div>
              <div className="motif" style={{ flex: "1", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)" }}>
                <svg width="200" height="200" viewBox="0 0 220 220" fill="none" aria-hidden="true">
                  <circle className="spin" style={{ "--dur": "14s" }} cx="110" cy="110" r="96" stroke="currentColor" strokeWidth="10" strokeDasharray="120 482" strokeLinecap="round" />
                  <circle className="spin rev" style={{ "--dur": "9s" }} cx="110" cy="110" r="70" stroke="var(--accent)" strokeWidth="10" strokeDasharray="90 350" strokeLinecap="round" />
                  <circle className="spin" style={{ "--dur": "6s" }} cx="110" cy="110" r="44" stroke="currentColor" strokeWidth="10" strokeDasharray="50 226" strokeLinecap="round" />
                  <circle cx="110" cy="110" r="10" fill="var(--accent)" />
                </svg>
              </div>
              <div className="disp" style={{ fontSize: "clamp(30px, 2.3vw, 38px)", lineHeight: ".9" }}>Enterprise Workforce Training Platform</div>
              <p style={{ margin: "14px 0 0", color: "var(--muted)", fontSize: "16px", lineHeight: "1.55" }}>
                Industry-sponsored LMS: role-based trainer and trainee dashboards, per-trainee watermarking, a React Native app and Jenkins CI/CD.
              </p>
              <div className="mono" style={{ marginTop: "22px", display: "flex", justifyContent: "space-between", color: "var(--muted)" }}>
                <span>FastAPI · React · Terraform</span>
                <span style={{ color: "var(--accent)" }}>Explore →</span>
              </div>
            </A>
          </div>
        </div>
      </section>
      */}
    </Layout>
  )
}
