import Layout from '../components/Layout'
import A from '../components/A'
import { css } from '../lib/css'
import { useLightbox } from '../lib/lightbox'
import './Journey.css'

export default function Journey() {
  const { lbOpen, lbSrc, openLb, closeLb } = useLightbox()
  const title = 'JOURNEY'.split('').map((ch, i) => ({ ch, style: '--i: ' + i }))
  const thumbs = (srcs) => srcs.map((src) => ({
    src, open: () => openLb(src),
    style: '--x0: 0px; --r0: -3deg; --x1: 20px; --r1: 0deg'
  }))
  const item = (when, kind, role, org, points, srcs) => ({ when, kind, role, org, points, thumbs: thumbs(srcs || []), hasThumbs: !!(srcs && srcs.length) })
  const chapters = [
    { id: 'ch-work', n: '01', word: 'Work', label: 'Industry', items: [
      item('2026 — Now', 'Internship', 'Intern', 'PharmaACE Innovations', ['Engineering agentic AI systems and multi-stage orchestration pipelines to automate workflows.', 'Designing and implementing retrieval-augmented generation (RAG) pipelines and backend integrations.', 'Building data-processing pipelines and prompt-engineering components for scalable AI applications.']),
      item('2024', 'Offer', 'Data Annotation Intern', 'Qualitas Global', ['Selected for the role in second year, first semester.', 'Could not proceed because of the academic schedule.']),
      item('2023', 'Internship', 'UI/UX Intern', 'Herbs Magic', ['Designed and implemented user interfaces for web applications.', 'Conducted user research and created wireframes.', 'Collaborated with the development team through implementation.'])
    ] },
    { id: 'ch-lead', n: '02', word: 'Lead', label: 'Leadership', items: [
      item('2025 — 26', 'Founding chair', 'Chairperson', "Information Technology Students' Association (ITSA)", ['Leading and managing committee activities and events.', 'Organising workshops, technical sessions and AI-tools sessions.', 'Mentoring junior members and coordinating with faculty.']),
      item('2024 — 25', 'Operations', 'Operations Head', 'Abhivriddhi', ['Ran operations for the club and anchored its flagship technical event, EDGE’24.'], ['/static/certificates/clubs/Operations.jpeg']),
      item('2024 — 25', 'Administration', 'Chief Administrative', 'The Catalyst', ['Led administration and logistics for the club.'], ['/static/certificates/clubs/Cheif.jpeg']),
      item('2024 — 25', 'Web', 'Web Development Coordinator', 'Computer Society of India', ['Coordinated web development for the chapter.'], ['/static/certificates/clubs/csi.jpeg']),
      item('2023 — 24', 'Technical', 'Technical Coordinator', 'Abhivriddhi', ['Technical and content roles for club events.'], ['/static/certificates/clubs/Technical.jpeg'])
    ] },
    { id: 'ch-learn', n: '03', word: 'Learn', label: 'Education', items: [
      item('2023 — Now', 'Undergraduate', 'B.Tech, Information Technology', 'Vishwakarma Institute of Technology, Pune', ['9.01 CGPA through the sixth semester.', 'Active member of multiple technical and soft-skills clubs.', 'Taking part in coding competitions and hackathons.']),
      item('2010 — 22', 'School', 'Primary & Secondary Education', 'Grades 1–12', ['Completed primary and secondary education.', 'Developed the interest in technology and programming that led here.'])
    ] }
  ]
  return (
    <Layout page="journey" vtab="(03) — Journey · Menu" curtain="(03) Journey" chat greeting="Ask me about his PharmaACE internship or the clubs he has led." footerStyle="padding: 56px 0 36px; border-top: 1px solid var(--line)">
      {lbOpen && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={(e) => { if (e.target === e.currentTarget) closeLb() }} aria-label="Certificate">
          <button type="button" className="pill mono" onClick={closeLb} autoFocus style={{ position: "absolute", top: "24px", right: "24px", height: "44px", padding: "0 18px", borderRadius: "999px", border: "1px solid var(--text)", background: "var(--bg)", color: "var(--text)", cursor: "pointer" }}>Close ✕</button>
          {" "}
          <img src={lbSrc} alt="Certificate" style={{ maxWidth: "min(1000px, 100%)", maxHeight: "100%", borderRadius: "14px", boxShadow: "0 30px 80px rgba(0,0,0,.45)" }} />
        </div>
      )}
      <section id="top" className="dots" style={{ position: "relative", paddingTop: "168px", paddingBottom: "56px", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="fade" style={{ "--d": ".3s", display: "flex", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }}>
            <span className="mono" style={{ color: "var(--muted)" }}>(03) — Journey</span>
            <span className="mono" style={{ color: "var(--muted)" }}>Shlok Bam / Portfolio 2026</span>
          </div>
          <h1 className="disp" aria-label="Journey" style={{ margin: "24px 0 0", fontSize: "clamp(72px, 15vw, 226px)", fontStretch: "100%" }}>
            <span className="mask">
              {title.map((l, l_i) => (
                <span key={l_i} className="ltr" aria-hidden="true" style={css(l.style)}>{l.ch}</span>
              ))}
              <span className="ltr" aria-hidden="true" style={{ "--i": "7", color: "var(--accent)" }}>.</span>
            </span>
          </h1>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "32px", flexWrap: "wrap", marginTop: "32px" }}>
            <p className="serif fade" style={{ "--d": ".6s", margin: "0", fontSize: "clamp(28px, 3vw, 44px)", maxWidth: "760px", lineHeight: "1.1" }}>From first wireframes to agent pipelines.</p>
            <p className="mono fade" style={{ "--d": ".7s", margin: "0", maxWidth: "280px", color: "var(--muted)", lineHeight: "1.8", textAlign: "right" }}>Industry, leadership and education</p>
          </div>
          <div className="rule" style={{ marginTop: "44px" }} />
          <div className="mono fade" style={{ "--d": ".8s", display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", marginTop: "14px", color: "var(--muted)" }}>
            <A className="ul" href="#ch-work">01 Work</A>
            <A className="ul" href="#ch-lead">02 Leadership</A>
            <A className="ul" href="#ch-learn">03 Education</A>
            <span>2010 → now</span>
          </div>
        </div>
      </section>
      {chapters.map((ch, ch_i) => (
        <section key={ch_i} id={ch.id} style={{ borderBottom: "1px solid var(--line)" }}>
          <div className="wrap" style={{ paddingTop: "80px", paddingBottom: "88px" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "24px", flexWrap: "wrap", paddingBottom: "28px", borderBottom: "1px solid var(--line)" }}>
              <span className="disp outline" style={{ fontSize: "clamp(72px, 9vw, 140px)" }}>{ch.word}</span>
              <span className="mono" style={{ color: "var(--accent)" }}>Chapter {ch.n} · {ch.label}</span>
            </div>
            <div style={{ position: "relative", marginTop: "24px" }}>
              <div className="rail railabs hide-sm" aria-hidden="true" style={{ position: "absolute", left: "220px", top: "0", bottom: "0", width: "56px" }}>
                <div className="railfill" />
              </div>
              {ch.items.map((it, it_i) => (
                <div key={it_i} className="g-tl item" style={{ padding: "24px 0" }}>
                  <div className="yr">
                    <div className="disp" style={{ fontSize: "36px", letterSpacing: "-.03em" }}>{it.when}</div>
                    <div className="mono" style={{ color: "var(--accent)", marginTop: "10px" }}>{it.kind}</div>
                  </div>
                  <div className="hide-sm">
                    <div className="dot" />
                  </div>
                  <div className="icard rv" style={{ border: "1px solid var(--line)", borderRadius: "22px", padding: "28px", background: "var(--surface)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "24px", flexWrap: "wrap", alignItems: "flex-start" }}>
                      <div style={{ flex: "1 1 360px", minWidth: "0" }}>
                        <h3 style={{ margin: "0", fontSize: "clamp(22px, 2.2vw, 30px)", letterSpacing: "-.02em", fontWeight: "700" }}>{it.role}</h3>
                        <div style={{ marginTop: "6px", fontSize: "17px", color: "var(--muted)" }}>{it.org}</div>
                        <ul style={{ margin: "20px 0 0", padding: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                          {it.points.map((pt, pt_i) => (
                            <li key={pt_i} style={{ display: "flex", gap: "14px", fontSize: "16px", lineHeight: "1.55" }}>
                              <span style={{ color: "var(--accent)", flex: "none" }}>→</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {it.hasThumbs && (
                        <div className="fan" aria-label="Certificate">
                          {it.thumbs.map((th, th_i) => (
                            <button key={th_i} type="button" className="th" onClick={th.open} aria-label="Open certificate" style={css(th.style)}>
                              <img src={th.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
      <A className="next" href="/recognition">
        <div className="wrap" style={{ paddingTop: "72px", paddingBottom: "72px" }}>
          <div className="mono nmuted" style={{ color: "var(--muted)" }}>Next page — (04)</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "24px", marginTop: "18px" }}>
            <span className="disp nt" style={{ fontSize: "clamp(48px, 9vw, 144px)" }}>Recognition</span>
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
