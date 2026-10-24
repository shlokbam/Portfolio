import Layout from '../components/Layout'
import A from '../components/A'
import AIBackdrop from '../components/AIBackdrop'
import { css } from '../lib/css'
import { RESUME, opt } from '../lib/links'
import './About.css'

export default function About() {
  const title = 'ABOUT'.split('').map((ch, i) => ({ ch, style: '--i: ' + i }))
  const ring = (names, r, offset) => names.map((name, i) => {
    const a = offset + (360 / names.length) * i
    return { name, slot: 'position: absolute; left: 50%; top: 50%; transform: rotate(' + a + 'deg) translateX(' + r + 'px) rotate(' + (-a) + 'deg) translate(-50%, -50%)' }
  })
  const ring1 = ring(['Python', 'LangGraph', 'LangChain', 'RAG', 'Multi-agent', 'LLM-as-judge'], 160, 0)
  const ring2 = ring(['FastAPI', 'React', 'MCP', 'LangSmith', 'DeepEval', 'Hugging Face', 'Transformers', 'PostgreSQL', 'Docker', 'SQL', 'Embeddings', 'GH Actions'], 280, 15)
  const ring3 = ring(['Terraform', 'Jenkins', 'AWS', 'MySQL', 'Chroma', 'Pydantic', 'Guardrails', 'NLP', 'JavaScript', 'Java', 'DSA'], 390, 8)
  const lv = (n) => {
    if (n >= 5) return 'padding: 8px 13px; border-radius: 999px; background: var(--accent); color: var(--onaccent); font-weight: 600; font-size: 14px'
    if (n === 4) return 'padding: 8px 13px; border-radius: 999px; background: var(--text); color: var(--bg); font-weight: 600; font-size: 14px'
    if (n === 3) return 'padding: 7px 12px; border-radius: 999px; border: 1px solid var(--text); font-size: 14px'
    return 'padding: 7px 12px; border-radius: 999px; border: 1px dashed var(--muted); color: var(--muted); font-size: 14px'
  }
  const cat = (n, name, items) => ({ n, name, items: items.map(([k, v]) => ({ name: k, style: lv(v) })) })
  const cats = [
    cat('01', 'Generative AI', [['LangGraph', 5], ['LangChain', 5], ['RAG', 5], ['Multi-agent systems', 5], ['MCP', 4], ['Tool calling', 4], ['Prompt engineering', 4], ['Hugging Face', 4], ['Gemini', 4], ['Mistral AI', 4]]),
    cat('02', 'LLM evaluation & safety', [['LLM-as-judge', 5], ['Golden datasets', 4], ['DeepEval', 4], ['GEval', 4], ['Guardrails', 4], ['LangSmith', 4]]),
    cat('03', 'Machine learning', [['NLP', 4], ['Transformers', 4], ['Embeddings', 4], ['Deep learning', 3], ['Computer vision', 3]]),
    cat('04', 'Languages', [['Python', 5], ['SQL', 4], ['JavaScript', 3], ['Java', 3], ['C++', 3]]),
    cat('05', 'Web', [['FastAPI', 5], ['Pydantic', 4], ['REST APIs', 4], ['React', 4], ['Flask', 4]]),
    cat('06', 'Databases', [['PostgreSQL', 4], ['MySQL', 4], ['Chroma', 4], ['Firebase', 3]]),
    cat('07', 'Cloud & DevOps', [['Docker', 4], ['GitHub Actions', 4], ['Git', 4], ['Terraform', 3], ['Jenkins', 3], ['AWS', 3]]),
    cat('08', 'Core CS', [['DSA', 4], ['OOP', 4], ['DBMS', 4], ['OS', 3]])
  ]
  return (
    <Layout page="about" curtain="About" chat footerStyle="padding: 56px 0 36px; border-top: 1px solid var(--line)">
      <section id="top" className="dots" style={{ position: "relative", paddingTop: "168px", paddingBottom: "56px", borderBottom: "1px solid var(--line)" }}>
        <AIBackdrop kind="embed" />
        <div className="wrap">
          <div className="fade" style={{ "--d": ".3s", display: "flex", justifyContent: "flex-end", gap: "24px", flexWrap: "wrap" }}>
            <span className="mono" style={{ color: "var(--muted)" }}>Shlok Bam / Portfolio 2026</span>
          </div>
          <h1 className="disp" aria-label="About" style={{ margin: "24px 0 0", fontSize: "min(clamp(88px, 18vw, 270px), calc((100vw - 80px) / 4.11))", fontStretch: "100%" }}>
            <span className="mask" style={{ whiteSpace: "nowrap" }}>
              {title.map((l, l_i) => (
                <span key={l_i} className="ltr" aria-hidden="true" style={css(l.style)}>{l.ch}</span>
              ))}
              <span className="ltr" aria-hidden="true" style={{ "--i": "5", color: "var(--accent)" }}>.</span>
            </span>
          </h1>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "32px", flexWrap: "wrap", marginTop: "32px" }}>
            <p className="serif fade" style={{ "--d": ".6s", margin: "0", fontSize: "clamp(28px, 3vw, 44px)", maxWidth: "720px", lineHeight: "1.1" }}>Curious by default, builder by habit.</p>
            <p className="mono fade" style={{ "--d": ".7s", margin: "0", maxWidth: "280px", color: "var(--muted)", lineHeight: "1.8", textAlign: "right" }}>IT student · Founding Chair, ITSA · Intern, PharmaACE Innovations</p>
          </div>
          <div className="rule" style={{ marginTop: "44px" }} />
        </div>
      </section>
      <section style={{ padding: "112px 0", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap g-story">
          <div className="sticky">
            <div className="rv" style={{ position: "relative" }}>
              <div className="pic gray" style={{ borderRadius: "26px", aspectRatio: "4 / 5", background: "var(--surface)" }}>
                <img decoding="async" src={opt('/static/images/about/profile.png')} alt="Portrait of Shlok Bam" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              {" "}
              <span className="sig" aria-hidden="true" style={{ position: "absolute", right: "18px", bottom: "18px", fontSize: "64px", lineHeight: "1", color: "var(--accent)" }}>Shlok</span>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "20px" }}>
              <A className="btn mono" href={RESUME} style={{ background: "var(--accent)", color: "var(--onaccent)" }}>
                Download résumé{" "}
                <svg className="arr" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                  <path d="M12 4v13M6 11l6 6 6-6" />
                </svg>
              </A>
              <A className="btn mono" href="https://www.linkedin.com/in/shlokbam/" style={{ border: "1px solid var(--line)" }}>LinkedIn ↗</A>
            </div>
          </div>
          <div>
            <p className="rv" style={{ margin: "0", fontSize: "clamp(28px, 3.2vw, 46px)", lineHeight: "1.12", letterSpacing: "-.025em", fontWeight: "500" }}>
              I learn quickly, enjoy working with people, and like making systems{" "}
              <span className="serif" style={{ color: "var(--accent)" }}>easier, faster</span>
              {" "}and more efficient.
            </p>
            <div style={{ marginTop: "64px", borderTop: "1px solid var(--text)" }}>
              <div className="chapter rv" style={{ display: "grid", gridTemplateColumns: "110px minmax(0, 1fr)", gap: "24px", padding: "34px 0", borderBottom: "1px solid var(--line)" }}>
                <span className="cnum disp" style={{ fontSize: "56px", color: "var(--muted)" }}>01</span>
                <div>
                  <h2 style={{ margin: "0", fontSize: "28px", letterSpacing: "-.02em", fontWeight: "700" }}>Learn</h2>
                  <p style={{ margin: "12px 0 0", color: "var(--muted)", fontSize: "18px", lineHeight: "1.65" }}>
                    Information Technology at Vishwakarma Institute of Technology, Pune — 9.01 / 10 CGPA, graduating May 2027. Programming, data-driven applications and cloud are where I spend most of my curiosity.
                  </p>
                </div>
              </div>
              <div className="chapter rv" style={{ display: "grid", gridTemplateColumns: "110px minmax(0, 1fr)", gap: "24px", padding: "34px 0", borderBottom: "1px solid var(--line)" }}>
                <span className="cnum disp" style={{ fontSize: "56px", color: "var(--muted)" }}>02</span>
                <div>
                  <h2 style={{ margin: "0", fontSize: "28px", letterSpacing: "-.02em", fontWeight: "700" }}>Lead</h2>
                  <p style={{ margin: "12px 0 0", color: "var(--muted)", fontSize: "18px", lineHeight: "1.65" }}>
                    As Founding Chairperson of the Information Technology Students' Association I led a 50+ member team — a 500+ attendee AI workshop, mock GD/PIs, a ₹1 lakh-budget event, and a QR attendance system used by 750+ attendees.
                  </p>
                </div>
              </div>
              <div className="chapter rv" style={{ display: "grid", gridTemplateColumns: "110px minmax(0, 1fr)", gap: "24px", padding: "34px 0", borderBottom: "1px solid var(--line)" }}>
                <span className="cnum disp" style={{ fontSize: "56px", color: "var(--muted)" }}>03</span>
                <div>
                  <h2 style={{ margin: "0", fontSize: "28px", letterSpacing: "-.02em", fontWeight: "700" }}>Build</h2>
                  <p style={{ margin: "12px 0 0", color: "var(--muted)", fontSize: "18px", lineHeight: "1.65" }}>
                    At PharmaACE Innovations I build healthcare-data and agentic AI pipelines for pharma clients — provider matching, newsroom monitoring and a natural-language-to-SQL reporting agent. Outside work: 21 projects across agents, evals, full-stack apps and cloud — and three patents as co-inventor.
                  </p>
                </div>
              </div>
            </div>
            <div className="g-tiles" style={{ marginTop: "48px" }}>
              <div className="tile rv" style={{ border: "1px solid var(--line)", borderRadius: "20px", padding: "22px", background: "var(--surface)", minHeight: "160px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <span className="mono tmuted" style={{ color: "var(--muted)" }}>Now</span>
                <span style={{ fontSize: "21px", fontWeight: "700" }}>
                  Intern,
                  <br />
                  PharmaACE
                </span>
              </div>
              <div className="tile rv" style={{ border: "1px solid var(--line)", borderRadius: "20px", padding: "22px", background: "var(--surface)", minHeight: "160px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <span className="mono tmuted" style={{ color: "var(--muted)" }}>Studying</span>
                <span style={{ fontSize: "21px", fontWeight: "700" }}>
                  B.Tech IT,
                  <br />
                  VIT Pune
                </span>
              </div>
              <div className="tile rv" style={{ border: "1px solid var(--line)", borderRadius: "20px", padding: "22px", background: "var(--surface)", minHeight: "160px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <span className="mono tmuted" style={{ color: "var(--muted)" }}>Based</span>
                <span style={{ fontSize: "21px", fontWeight: "700" }}>
                  Pune —
                  <br />
                  open to relocate
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section style={{ padding: "112px 0", borderBottom: "1px solid var(--line)", background: "var(--surface)", overflow: "hidden" }}>
        <div className="wrap">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "24px", flexWrap: "wrap" }}>
            <div>
              <span className="mono" style={{ color: "var(--muted)" }}>Toolkit</span>
              {" "}
              <h2 className="disp rv" style={{ margin: "20px 0 0", fontSize: "clamp(52px, 7vw, 112px)" }}>In orbit</h2>
            </div>
            <div className="mono" style={{ display: "flex", gap: "20px", flexWrap: "wrap", color: "var(--muted)" }}>
              <span style={{ display: "inline-flex", gap: "8px", alignItems: "center" }}>
                <span style={{ width: "10px", height: "10px", background: "var(--accent)", borderRadius: "50%" }} />
                Core
              </span>
              <span style={{ display: "inline-flex", gap: "8px", alignItems: "center" }}>
                <span style={{ width: "10px", height: "10px", background: "var(--text)", borderRadius: "50%" }} />
                Strong
              </span>
              <span style={{ display: "inline-flex", gap: "8px", alignItems: "center" }}>
                <span style={{ width: "10px", height: "10px", border: "1px solid var(--text)", borderRadius: "50%" }} />
                Working
              </span>
              <span style={{ display: "inline-flex", gap: "8px", alignItems: "center" }}>
                <span style={{ width: "10px", height: "10px", border: "1px dashed var(--muted)", borderRadius: "50%" }} />
                Exploring
              </span>
            </div>
          </div>
          <div className="orbit-box orbit-in" style={{ marginTop: "32px", display: "flex", justifyContent: "center" }}>
            <div className="orbit" aria-label="Skills arranged in orbit by proficiency — hover to pause" style={{ position: "relative", width: "900px", height: "900px" }}>
              <div aria-hidden="true" style={{ position: "absolute", left: "290px", top: "290px", width: "320px", height: "320px", borderRadius: "50%", border: "1px dashed var(--line)" }} />
              <div aria-hidden="true" style={{ position: "absolute", left: "170px", top: "170px", width: "560px", height: "560px", borderRadius: "50%", border: "1px dashed var(--line)" }} />
              <div aria-hidden="true" style={{ position: "absolute", left: "60px", top: "60px", width: "780px", height: "780px", borderRadius: "50%", border: "1px dashed var(--line)" }} />
              <div style={{ position: "absolute", left: "370px", top: "370px", width: "160px", height: "160px", borderRadius: "50%", background: "var(--accent)", color: "var(--onaccent)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span className="sig" style={{ fontSize: "64px", lineHeight: ".8" }}>Sb</span>
                <span className="mono" style={{ fontSize: "10px", marginTop: "8px" }}>Hover to pause</span>
              </div>
              <div className="spin" style={{ "--dur": "110s", position: "absolute", inset: "0" }}>
                {ring1.map((s, s_i) => (
                  <div key={s_i} style={css(s.slot)}>
                    <span className="spin rev" style={{ "--dur": "110s", display: "inline-block" }}>
                      <span style={{ display: "inline-block", padding: "10px 16px", borderRadius: "999px", background: "var(--accent)", color: "var(--onaccent)", fontWeight: "700", fontSize: "15px", whiteSpace: "nowrap" }}>{s.name}</span>
                    </span>
                  </div>
                ))}
              </div>
              <div className="spin rev" style={{ "--dur": "170s", position: "absolute", inset: "0" }}>
                {ring2.map((s, s_i) => (
                  <div key={s_i} style={css(s.slot)}>
                    <span className="spin" style={{ "--dur": "170s", display: "inline-block" }}>
                      <span style={{ display: "inline-block", padding: "9px 15px", borderRadius: "999px", background: "var(--text)", color: "var(--bg)", fontWeight: "600", fontSize: "14px", whiteSpace: "nowrap" }}>{s.name}</span>
                    </span>
                  </div>
                ))}
              </div>
              <div className="spin" style={{ "--dur": "240s", position: "absolute", inset: "0" }}>
                {ring3.map((s, s_i) => (
                  <div key={s_i} style={css(s.slot)}>
                    <span className="spin rev" style={{ "--dur": "240s", display: "inline-block" }}>
                      <span style={{ display: "inline-block", padding: "8px 14px", borderRadius: "999px", border: "1px solid var(--text)", background: "var(--surface)", fontWeight: "500", fontSize: "14px", whiteSpace: "nowrap" }}>{s.name}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="g-cats" style={{ marginTop: "64px" }}>
            {cats.map((c, c_i) => (
              <div key={c_i} className="rv" style={{ borderTop: "1px solid var(--text)", paddingTop: "18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontWeight: "700", fontSize: "18px" }}>{c.name}</span>
                  <span className="mono" style={{ color: "var(--muted)" }}>{c.n}</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "16px" }}>
                  {c.items.map((k, k_i) => (
                    <span key={k_i} style={css(k.style)}>{k.name}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {" "}
      <A className="next" href="/work">
        <div className="wrap" style={{ paddingTop: "72px", paddingBottom: "72px" }}>
          <div className="mono nmuted" style={{ color: "var(--muted)" }}>Next page</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "24px", marginTop: "18px" }}>
            <span className="disp nt" style={{ fontSize: "clamp(60px, 10vw, 160px)" }}>Work</span>
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
