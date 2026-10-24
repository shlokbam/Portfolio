import Layout from '../components/Layout'
import A from '../components/A'
import { css } from '../lib/css'
import { useStats } from '../lib/site'
import { RESUME, opt, thumb } from '../lib/links'
import './Home.css'

export default function Home() {
  const stats = useStats()
  const meteors = [[18, 1.5, 11], [46, 6, 13], [70, 3.5, 12], [88, 9, 14]]
    .map(([l, d, s]) => 'left: ' + l + '%; top: -10px; animation-delay: ' + d + 's; animation-duration: ' + s + 's')
  const lc = (stats && stats.leetcode) || {}
  const cc = (stats && stats.codechef) || {}
  const gh = (stats && stats.github) || {}
  const show = (v) => (v === undefined || v === null || v === 'N/A' || v === '' ? '—' : v)
  const profiles = [
    { name: 'LeetCode', url: 'https://leetcode.com/u/shlokbam05/', a: 'Solved', b: 'Rating', va: show(lc.total), vb: show(lc.contestRating) },
    { name: 'CodeChef', url: 'https://www.codechef.com/users/shlokbam', a: 'Rating', b: 'Stars', va: show(cc.rating), vb: show(cc.stars) },
    { name: 'GitHub', url: 'https://github.com/shlokbam', a: 'Contribs', b: 'Repos', va: show(gh.contributions), vb: show(gh.repos) }
  ]
  const tp = ['Agentic AI', 'RAG pipelines', 'FastAPI', 'React', 'LangGraph', 'MCP', 'Docker']
  const tape = tp.concat(tp)
  const sentence = "I'm an IT student at VIT Pune who turns messy, real-world problems into systems that think — and ships them end to end: agents, retrieval, APIs, interfaces and the pipelines that deploy them."
  const hl = ['systems', 'that', 'think']
  const words = sentence.split(' ').map((t) => ({ t, style: hl.indexOf(t) !== -1 ? 'color: var(--accent)' : '' }))
  const explore = [
    { n: '01', name: 'About', file: '/about', desc: 'Story, portrait and toolkit', img: opt('/static/images/about/profile.png') },
    { n: '02', name: 'Work', file: '/work', desc: '21 projects · 5 flagships · 1 case study', img: '' },
    { n: '03', name: 'Journey', file: '/journey', desc: 'Internships, leadership and education', img: opt('/static/certificates/clubs/Operations.jpeg') },
    { n: '04', name: 'Recognition', file: '/recognition', desc: '3 patents, awards and certifications', img: opt('/static/Patent/Grant_acknowledgement.png') },
    { n: '05', name: 'Community', file: '/community', desc: 'Mentoring, anchoring, volunteering', img: opt('/static/community/1e.jpeg') },
    { n: '06', name: 'Writing', file: '/writing', desc: 'Build logs from the journal', img: '' },
    { n: '07', name: 'Contact', file: '/contact', desc: 'Email, form and AI assistant', img: '' }
  ].map((x) => ({ ...x, noImg: !x.img }))
  return (
    <Layout page="home" vtab="(00) — Index · Menu" chat footerStyle="padding: 56px 0 36px">
      <section id="top" className="dots" style={{ position: "relative", overflow: "hidden", paddingTop: "148px", paddingBottom: "56px", borderBottom: "1px solid var(--line)" }}>
        <div aria-hidden="true" data-glow style={{ position: "absolute", inset: "0", pointerEvents: "none", background: "radial-gradient(560px circle at var(--cx, 72%) var(--cy, 30%), color-mix(in srgb, var(--accent) 8%, transparent), transparent 70%)" }} />
        <div aria-hidden="true" style={{ position: "absolute", inset: "0", pointerEvents: "none" }}>
          {meteors.map((m, m_i) => (
            <span key={m_i} className="meteor" style={css(m)} />
          ))}
        </div>
        <div className="wrap" style={{ position: "relative" }}>
          <div className="fade" style={{ "--d": ".2s", display: "flex", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }}>
            <span className="mono" style={{ color: "var(--muted)" }}>(00) — Index</span>
            <span className="mono" style={{ color: "var(--muted)" }}>Pune, IN — 2026</span>
          </div>
          <p className="serif fade" style={{ "--d": ".25s", margin: "56px 0 14px", fontSize: "clamp(26px, 2.6vw, 38px)", color: "var(--muted)" }}>hello, I'm</p>
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
                AI &amp; full-stack engineer. I build{" "}
                <span style={{ color: "var(--accent)" }}>agentic AI systems</span>
                , RAG pipelines and the products around them — currently as an intern at PharmaACE Innovations.
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
            <aside className="fade" aria-label="Coding profiles" style={{ "--d": ".8s", border: "1px solid var(--line)", background: "color-mix(in srgb, var(--surface) 90%, transparent)", borderRadius: "18px", padding: "18px 20px" }}>
              <div className="mono" style={{ display: "flex", justifyContent: "space-between", color: "var(--muted)" }}>
                <span>Coding profiles</span>
                <span>{stats === null ? 'Loading' : stats ? 'Live' : 'Offline'}</span>
              </div>
              {profiles.map((pf, pf_i) => (
                <A key={pf_i} href={pf.url} style={{ display: "grid", gridTemplateColumns: "96px repeat(2, minmax(0, 1fr))", gap: "10px", alignItems: "baseline", padding: "13px 0", borderTop: "1px solid var(--line)", marginTop: "10px" }}>
                  <span style={{ fontWeight: "700" }}>{pf.name}</span>
                  <span>
                    <span className="disp" style={{ fontSize: "22px", letterSpacing: "-.02em" }}>{pf.va}</span>
                    <span className="mono" style={{ display: "block", fontSize: "10px", color: "var(--muted)", marginTop: "4px" }}>{pf.a}</span>
                  </span>
                  <span>
                    <span className="disp" style={{ fontSize: "22px", letterSpacing: "-.02em" }}>{pf.vb}</span>
                    <span className="mono" style={{ display: "block", fontSize: "10px", color: "var(--muted)", marginTop: "4px" }}>{pf.b}</span>
                  </span>
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
              <div style={{ marginTop: "8px", fontSize: "17px", fontWeight: "600" }}>Agentic AI · RAG · Full-stack</div>
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
              <img loading="lazy" decoding="async" src={opt('/static/images/about/profile.png')} alt="Shlok Bam" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>
          <div>
            <span className="mono" style={{ color: "var(--muted)" }}>(01) — In short</span>
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
      <section aria-label="At a glance" style={{ borderBottom: "1px solid var(--line)" }}>
        <div className="wrap g-num">
          <div style={{ padding: "44px 24px 44px 0" }}>
            <div className="disp" style={{ fontSize: "clamp(56px, 6vw, 92px)" }}>
              <span className="count" style={{ "--to": "21" }} />
            </div>
            <div className="mono" style={{ color: "var(--muted)", marginTop: "12px" }}>Projects shipped</div>
          </div>
          <div style={{ padding: "44px 24px", borderLeft: "1px solid var(--line)" }}>
            <div className="disp" style={{ fontSize: "clamp(56px, 6vw, 92px)" }}>
              <span className="count" style={{ "--to": "3" }} />
            </div>
            <div className="mono" style={{ color: "var(--muted)", marginTop: "12px" }}>Patents · IN &amp; ZA</div>
          </div>
          <div style={{ padding: "44px 24px", borderLeft: "1px solid var(--line)" }}>
            <div className="disp" style={{ fontSize: "clamp(56px, 6vw, 92px)" }}>9.01</div>
            <div className="mono" style={{ color: "var(--muted)", marginTop: "12px" }}>CGPA · VIT Pune</div>
          </div>
          <div style={{ padding: "44px 24px", borderLeft: "1px solid var(--line)" }}>
            <div className="disp" style={{ fontSize: "clamp(56px, 6vw, 92px)" }}>
              <span className="count" style={{ "--to": "90" }} />
              <span style={{ color: "var(--accent)" }}>+</span>
            </div>
            <div className="mono" style={{ color: "var(--muted)", marginTop: "12px" }}>Google Arcade badges</div>
          </div>
          <div style={{ padding: "44px 0 44px 24px", borderLeft: "1px solid var(--line)" }}>
            <div className="disp" style={{ fontSize: "clamp(56px, 6vw, 92px)" }}>
              <span className="count" style={{ "--to": "100" }} />
              <span style={{ color: "var(--accent)" }}>+</span>
            </div>
            <div className="mono" style={{ color: "var(--muted)", marginTop: "12px" }}>Students mentored</div>
          </div>
        </div>
      </section>
      <section style={{ padding: "120px 0", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "24px", flexWrap: "wrap" }}>
            <div>
              <span className="mono" style={{ color: "var(--muted)" }}>(02) — Selected work</span>
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
                Autonomous multi-agent tech curation — LangGraph scouts GitHub, Hacker News and Dev.to, writes ELI5 briefs and emails them out.
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
              <div className="disp" style={{ fontSize: "clamp(38px, 3.1vw, 52px)" }}>Eagle LMS</div>
              <p style={{ margin: "14px 0 0", color: "var(--muted)", fontSize: "16px", lineHeight: "1.55" }}>
                Industry-sponsored learning platform — FastAPI, dual dashboards, an Expo mobile app and a containerised pipeline.
              </p>
              <div className="mono" style={{ marginTop: "22px", display: "flex", justifyContent: "space-between", color: "var(--muted)" }}>
                <span>FastAPI · React Native · Jenkins</span>
                <span style={{ color: "var(--accent)" }}>Explore →</span>
              </div>
            </A>
          </div>
        </div>
      </section>
      <section style={{ padding: "120px 0 100px" }}>
        <div className="wrap">
          <span className="mono" style={{ color: "var(--muted)" }}>(03) — Explore the site</span>
          {" "}
          <div style={{ marginTop: "36px", borderTop: "1px solid var(--text)" }}>
            {explore.map((x, x_i) => (
              <A key={x_i} className="xrow" href={x.file} style={{ display: "grid", gridTemplateColumns: "64px minmax(0, 1fr) minmax(0, 1fr) 120px", alignItems: "center", gap: "24px", padding: "22px 0", borderBottom: "1px solid var(--line)" }}>
                <span className="mono" style={{ color: "var(--muted)" }}>{x.n}</span>
                <span className="disp xname" style={{ fontSize: "clamp(32px, 4vw, 64px)" }}>{x.name}</span>
                <span className="hide-sm" style={{ color: "var(--muted)", fontSize: "17px" }}>{x.desc}</span>
                <span className="xthumb hide-sm" style={{ width: "120px", height: "80px", borderRadius: "12px", overflow: "hidden", background: "var(--accent)", color: "var(--onaccent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {x.img && (
                    <img loading="lazy" decoding="async" src={thumb(x.img)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  )}
                  {x.noImg && (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M7 17 17 7M8 7h9v9" />
                    </svg>
                  )}
                </span>
              </A>
            ))}
          </div>
        </div>
      </section>
      <A href="/contact" className="talk" style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap" style={{ paddingTop: "72px", paddingBottom: "72px" }}>
          <p className="serif" style={{ margin: "0", fontSize: "clamp(26px, 2.8vw, 42px)" }}>Have a role or a problem worth solving?</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "24px", marginTop: "18px" }}>
            <span className="disp" style={{ fontSize: "clamp(64px, 11vw, 176px)" }}>Let's talk</span>
            <span className="tarr" style={{ width: "120px", height: "120px", borderRadius: "50%", border: "1px solid currentColor", display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </div>
        </div>
      </A>
    </Layout>
  )
}
