import Layout from '../components/Layout'
import A from '../components/A'
import AIBackdrop from '../components/AIBackdrop'
import { css } from '../lib/css'
import { RESUME, opt } from '../lib/links'
import { useIstClock } from '../lib/clock'
import SkillIcon, { hasIcon } from '../components/SkillIcon'
import { useEffect, useRef, useState } from 'react'
import './About.css'

// Toolkit levels (5 core · 4 strong · 3 working · 2 exploring), shared by the orbit and the cards.
const ALIAS = { 'Multi-agent': 'Multi-agent systems', 'GH Actions': 'GitHub Actions' }

// One of the three "Now / Studying / Based" tiles: flips over in 3D on hover (or tap / Enter)
function FlipTile({ label, front, children }) {
  const [flip, setFlip] = useState(false)
  return (
    <div className={'ftile rv' + (flip ? ' flipped' : '')} tabIndex={0} role="button" aria-pressed={flip} aria-label={label + ', show details'}
      onClick={() => setFlip((f) => !f)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlip((f) => !f) } }}
      onMouseLeave={() => setFlip(false)}>
      <div className="finner">
        <div className="fface front">
          <span className="mono tmuted" style={{ color: 'var(--muted)' }}>{label}</span>
          <span style={{ fontSize: '21px', fontWeight: '700' }}>{front}</span>
          <span className="fhint mono" aria-hidden="true">↻</span>
        </div>
        <div className="fface back">{children}</div>
      </div>
    </div>
  )
}

// A skill in the orbit: its logo inside a ring whose style shows the level
const LEVEL_NAME = { 5: 'Core', 4: 'Strong', 3: 'Working', 2: 'Exploring' }

function Bubble({ name, size, lv }) {
  return (
    <span className={'bub lv' + lv}>
      <span className="bub-t mono" aria-hidden="true">{LEVEL_NAME[lv]}</span>
      <span className="bub-c" style={{ width: size + 'px', height: size + 'px' }}><SkillIcon name={name} size={Math.round(size * 0.42)} /></span>
      <span className="bub-l">{name}</span>
    </span>
  )
}

export default function About() {
  const clock = useIstClock()
  // the orbit stops once the pointer is within ~4 cm (150px) of any skill
  const orbitRef = useRef(null)
  const coreRef = useRef(null)
  const nearRaf = useRef(0)
  const nearCheck = (e) => {
    const x = e.clientX, y = e.clientY
    if (nearRaf.current) return
    nearRaf.current = requestAnimationFrame(() => {
      nearRaf.current = 0
      const el = orbitRef.current
      if (!el) return
      let near = false
      for (const b of el.querySelectorAll('.bub-c')) {
        const r = b.getBoundingClientRect()
        if (Math.hypot(r.left + r.width / 2 - x, r.top + r.height / 2 - y) < 150) { near = true; break }
      }
      el.classList.toggle('near', near)
      // the eye in the middle looks towards the pointer
      const c = coreRef.current
      if (c) {
        const r = c.getBoundingClientRect(), dx = x - (r.left + r.width / 2), dy = y - (r.top + r.height / 2)
        const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 260) * 15
        c.style.setProperty('--px', (dx / d * k).toFixed(1) + 'px')
        c.style.setProperty('--py', (dy / d * k).toFixed(1) + 'px')
      }
    })
  }
  useEffect(() => () => cancelAnimationFrame(nearRaf.current), [])
  // share of the degree (Sept 2023 – May 2027) done; computed after hydration so the HTML stays stable
  const [degree, setDegree] = useState(80)
  useEffect(() => {
    const a = Date.UTC(2023, 8, 1), b = Date.UTC(2027, 4, 31)
    setDegree(Math.max(0, Math.min(100, Math.round(((Date.now() - a) / (b - a)) * 100))))
  }, [])
  const title = 'ABOUT'.split('').map((ch, i) => ({ ch, style: '--i: ' + i }))
  const ring = (names, r, offset) => names.map((name, i) => {
    const a = offset + (360 / names.length) * i
    return { name, slot: 'position: absolute; left: 50%; top: 50%; transform: rotate(' + a + 'deg) translateX(' + r + 'px) rotate(' + (-a) + 'deg) translate(-50%, -50%)' }
  })
  const ring1 = ring(['Python', 'LangGraph', 'LangChain', 'RAG', 'Multi-agent', 'LLM-as-judge'], 160, 0)
  const ring2 = ring(['FastAPI', 'React', 'MCP', 'LangSmith', 'DeepEval', 'Hugging Face', 'Transformers', 'PostgreSQL', 'Docker', 'SQL', 'Embeddings', 'GH Actions'], 280, 15)
  const ring3 = ring(['Terraform', 'Jenkins', 'AWS', 'MySQL', 'Chroma', 'Pydantic', 'Guardrails', 'NLP', 'JavaScript', 'Java', 'DSA'], 390, 8)
  const cat = (n, name, items) => ({ n, name, avg: items.reduce((a, [, v]) => a + v, 0) / items.length, items: items.map(([k, v]) => ({ name: k, lv: Math.max(2, Math.min(5, v)) })) })
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
  const levels = Object.fromEntries(cats.flatMap((c) => c.items.map((k) => [k.name, k.lv])))
  const lvOf = (name) => levels[ALIAS[name] || name] || 3
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
                <img decoding="async" src={opt('/static/images/shlok-bam.jpg')} width="611" height="919" alt="Shlok Bam, AI / Generative AI engineer from Pune, India" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
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
                    Information Technology at Vishwakarma Institute of Technology, Pune: 9.01 / 10 CGPA, graduating May 2027. Programming, data-driven applications and cloud are where I spend most of my curiosity.
                  </p>
                </div>
              </div>
              <div className="chapter rv" style={{ display: "grid", gridTemplateColumns: "110px minmax(0, 1fr)", gap: "24px", padding: "34px 0", borderBottom: "1px solid var(--line)" }}>
                <span className="cnum disp" style={{ fontSize: "56px", color: "var(--muted)" }}>02</span>
                <div>
                  <h2 style={{ margin: "0", fontSize: "28px", letterSpacing: "-.02em", fontWeight: "700" }}>Lead</h2>
                  <p style={{ margin: "12px 0 0", color: "var(--muted)", fontSize: "18px", lineHeight: "1.65" }}>
                    As Founding Chairperson of the Information Technology Students' Association I led a 50+ member team: a 500+ attendee AI workshop, mock GD/PIs, a ₹1 lakh-budget event, and a QR attendance system used by 750+ attendees.
                  </p>
                </div>
              </div>
              <div className="chapter rv" style={{ display: "grid", gridTemplateColumns: "110px minmax(0, 1fr)", gap: "24px", padding: "34px 0", borderBottom: "1px solid var(--line)" }}>
                <span className="cnum disp" style={{ fontSize: "56px", color: "var(--muted)" }}>03</span>
                <div>
                  <h2 style={{ margin: "0", fontSize: "28px", letterSpacing: "-.02em", fontWeight: "700" }}>Build</h2>
                  <p style={{ margin: "12px 0 0", color: "var(--muted)", fontSize: "18px", lineHeight: "1.65" }}>
                    At PharmaACE Innovations I build healthcare-data and agentic AI pipelines for pharma clients: provider matching, newsroom monitoring and a natural-language-to-SQL reporting agent. Outside work: 21 projects across agents, evals, full-stack apps and cloud, and three patents as co-inventor.
                  </p>
                </div>
              </div>
            </div>
            <div className="g-tiles" style={{ marginTop: "48px" }}>
              <FlipTile label="Now" front={<>Intern,<br />PharmaACE</>}>
                <div className="fb-top mono"><span className="live-dot" /> Live · since Jun 2026</div>
                <div className="fb-title">Agentic AI for pharma</div>
                <div className="fb-lines">
                  <span><b>94%</b> NPI matching</span>
                  <span><b>1,200+</b> news sources</span>
                </div>
              </FlipTile>
              <FlipTile label="Studying" front={<>B.Tech IT,<br />VIT Pune</>}>
                <div className="fb-top mono">Sept 2023 → May 2027</div>
                <div className="fb-title"><span className="disp" style={{ fontSize: "44px" }}>9.01</span> CGPA</div>
                <div className="fb-bar" aria-hidden="true"><span style={{ width: degree + "%" }} /></div>
                <div className="fb-lines"><span suppressHydrationWarning>{degree}% of the degree done</span></div>
              </FlipTile>
              <FlipTile label="Based" front={<>Pune,<br />open to relocate</>}>
                <div className="radar" aria-hidden="true"><i /><i /><i /><b /></div>
                <div className="fb-top mono">18.52° N · 73.86° E</div>
                <div className="fb-title">Pune, India</div>
                <div className="fb-lines"><span suppressHydrationWarning>{clock} IST · UTC+5:30</span><span>Open to relocate ✈</span></div>
              </FlipTile>
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
                <span className="lg lv5" />
                Core
              </span>
              <span style={{ display: "inline-flex", gap: "8px", alignItems: "center" }}>
                <span className="lg lv4" />
                Strong
              </span>
              <span style={{ display: "inline-flex", gap: "8px", alignItems: "center" }}>
                <span className="lg lv3" />
                Working
              </span>
              <span style={{ display: "inline-flex", gap: "8px", alignItems: "center" }}>
                <span className="lg lv2" />
                Exploring
              </span>
            </div>
          </div>
          <div className="orbit-box orbit-in" style={{ marginTop: "32px", display: "flex", justifyContent: "center" }}>
            <div className="orbit" ref={orbitRef} onPointerMove={nearCheck} onPointerLeave={() => { if (orbitRef.current) orbitRef.current.classList.remove('near'); if (coreRef.current) { coreRef.current.style.setProperty('--px', '0px'); coreRef.current.style.setProperty('--py', '0px') } }} aria-label="Skills arranged in orbit by proficiency. Move close to pause" style={{ position: "relative", width: "900px", height: "900px" }}>
              <div aria-hidden="true" style={{ position: "absolute", left: "290px", top: "290px", width: "320px", height: "320px", borderRadius: "50%", border: "1px dashed var(--line)" }} />
              <div aria-hidden="true" style={{ position: "absolute", left: "170px", top: "170px", width: "560px", height: "560px", borderRadius: "50%", border: "1px dashed var(--line)" }} />
              <div aria-hidden="true" style={{ position: "absolute", left: "60px", top: "60px", width: "780px", height: "780px", borderRadius: "50%", border: "1px dashed var(--line)" }} />
              <div className="ocore" ref={coreRef}>
                <span className="ocore-ring" aria-hidden="true" />
                <span className="ocore-eye" aria-hidden="true"><span className="ocore-iris"><span className="ocore-pupil" /></span></span>
                <span className="mono ocore-lab"><span className="l1">Come closer to pause</span><span className="l2">Paused · hi there</span></span>
              </div>
              <div className="spin" style={{ "--dur": "48s", position: "absolute", inset: "0" }}>
                {ring1.map((s, s_i) => (
                  <div key={s_i} style={css(s.slot)}>
                    <span className="spin rev" style={{ "--dur": "48s", display: "inline-block" }}>
                      <Bubble name={s.name} size={66} lv={lvOf(s.name)} />
                    </span>
                  </div>
                ))}
              </div>
              <div className="spin rev" style={{ "--dur": "70s", position: "absolute", inset: "0" }}>
                {ring2.map((s, s_i) => (
                  <div key={s_i} style={css(s.slot)}>
                    <span className="spin" style={{ "--dur": "70s", display: "inline-block" }}>
                      <Bubble name={s.name} size={58} lv={lvOf(s.name)} />
                    </span>
                  </div>
                ))}
              </div>
              <div className="spin" style={{ "--dur": "95s", position: "absolute", inset: "0" }}>
                {ring3.map((s, s_i) => (
                  <div key={s_i} style={css(s.slot)}>
                    <span className="spin rev" style={{ "--dur": "95s", display: "inline-block" }}>
                      <Bubble name={s.name} size={52} lv={lvOf(s.name)} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="g-cats" style={{ marginTop: "64px" }}>
            {cats.map((c, c_i) => (
              <div key={c_i} className="cat rv">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px" }}>
                  <span style={{ fontWeight: "700", fontSize: "18px" }}>{c.name}</span>
                  <span className="mono" style={{ color: "var(--muted)" }}>{c.n}</span>
                </div>
                <div className="depth" title={'Average depth ' + c.avg.toFixed(1) + ' / 5'} aria-hidden="true">
                  {[1, 2, 3, 4, 5].map((d) => <i key={d} className={c.avg >= d - 0.25 ? 'on' : ''} />)}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "16px" }}>
                  {c.items.map((k, k_i) => (
                    <span key={k_i} className={'chip-k lv' + k.lv} style={{ "--i": k_i }}>
                      {hasIcon(k.name) && <SkillIcon name={k.name} size={14} />}
                      {k.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {" "}
      <A className="next" href="/work">
        <div className="wrap" style={{ paddingTop: "26px", paddingBottom: "26px" }}>
          <div className="mono nmuted" style={{ color: "var(--muted)" }}>Next page</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "24px", marginTop: "8px" }}>
            <span className="disp nt" style={{ fontSize: "clamp(26px, 3vw, 46px)" }}>Work</span>
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
