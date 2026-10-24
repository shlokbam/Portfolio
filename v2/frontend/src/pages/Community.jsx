import { Fragment } from 'react'
import Layout from '../components/Layout'
import A from '../components/A'
import AIBackdrop from '../components/AIBackdrop'
import { css } from '../lib/css'
import { opt, thumb } from '../lib/links'
import { useEffect, useRef, useState } from 'react'
import { useLightbox } from '../lib/lightbox'
import './Community.css'

export default function Community() {
  const { lbOpen, lbSrc, openLb, closeLb } = useLightbox()
  // Gallery photos start loading only when the section is near, so they never compete with the first photo.
  const galleryRef = useRef(null)
  const [galleryOn, setGalleryOn] = useState(false)
  useEffect(() => {
    const el = galleryRef.current
    if (!el || !('IntersectionObserver' in window)) { setGalleryOn(true); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setGalleryOn(true); io.disconnect() } }, { rootMargin: '900px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const title = 'BEYOND CODE'.split('').map((ch, i) => ({ ch: ch === ' ' ? '\u00a0' : ch, style: '--i: ' + i }))
  // letters grouped by word, so a title only ever wraps between words
  const words = title.reduce((ws, l, i) => { if (l.ch === '\u00a0') ws.push([]); else ws[ws.length - 1].push({ ...l, i }); return ws }, [[]])
  const open = (src) => () => openLb(src)
  const stories = [
    { n: '01', cls: 'g-story', year: '2024 — Now', role: 'Mentorship · Abhivriddhi & ITSA', title: 'Mentoring first-year students', desc: 'As Management Head at Abhivriddhi I guided first-years in communication, presentation skills and professional confidence. As ITSA Chairperson I ran AI-tools and modern productivity sessions so students build real-world skills early.', tags: ['Mentorship', 'Leadership', 'Skill development'], img: opt('/static/community/1m.jpeg'), alt: 'Shlok mentoring first-year students', link: '', cta: '' },
    { n: '02', cls: 'g-story flip', year: '2024', role: "Event anchor · EDGE'24", title: "Hosting Abhivriddhi's flagship tech event", desc: "Anchored EDGE'24 — program hosting, audience interaction and stage coordination — so the event ran smoothly and stayed engaging for participants and speakers.", tags: ['Anchoring', 'Public speaking', 'Event leadership'], img: opt('/static/community/1e.jpeg'), alt: "Shlok anchoring EDGE'24 on stage", link: 'https://www.linkedin.com/posts/shlokbam_thank-you-for-giving-me-the-opportunity-activity-7163012944060923904-n_0S', cta: 'LinkedIn post' },
    { n: '03', cls: 'g-story', year: '2023', role: 'Volunteering · Katraj, Pune', title: 'Weekends at an old age home', desc: 'Volunteered every weekend for over a month, spending time with senior residents through conversations, games and social activities — company, more than anything.', tags: ['Volunteering', 'Empathy', 'Community impact'], img: opt('/static/community/1v.jpeg'), alt: 'Volunteering at an old age home', link: '/static/community/old_age_home.pdf', cta: 'Certificate' }
  ].map((s) => ({ ...s, open: open(s.img) }))
  const tilt = ['-2deg', '1.5deg', '-1deg', '2deg']
  const items = [
    { src: opt('/static/community/1m.jpeg'), cap: 'Mentoring · 2024' },
    { src: opt('/static/community/1e.jpeg'), cap: "EDGE'24 · anchor" },
    { src: opt('/static/certificates/images/winning_screenshots/1.jpeg'), cap: 'INDOvateAI · win' },
    { src: opt('/static/community/1v.jpeg'), cap: 'Volunteering · 2023' },
    { src: opt('/static/certificates/images/official_posts/image.png'), cap: 'Official post' },
    { src: opt('/static/certificates/images/official_posts/1724320631666.jpeg'), cap: 'Navdhara · Top 5' },
    { src: opt('/static/certificates/clubs/Operations.jpeg'), cap: 'Operations Head' },
    { src: opt('/static/certificates/clubs/Cheif.jpeg'), cap: 'Chief Administrative' },
    { src: opt('/static/certificates/clubs/Technical.jpeg'), cap: 'Technical Coordinator' },
    { src: opt('/static/certificates/clubs/csi.jpeg'), cap: 'CSI · Web Dev' },
    { src: opt('/static/Arcade/arcade_dashboard.png'), cap: 'Google Arcade' }
  ]
  // The list is doubled for the seamless marquee loop; the copy is hidden from assistive tech.
  const gallery = items.concat(items).map((g, i) => ({ ...g, small: thumb(g.src), open: open(g.src), copy: i >= items.length, style: '--r: ' + tilt[i % tilt.length] }))
  return (
    <Layout page="community" curtain="Community" chat greeting="Ask me about his mentoring or the events he has hosted." footerStyle="padding: 56px 0 36px; border-top: 1px solid var(--line)">
      {lbOpen && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={(e) => { if (e.target === e.currentTarget) closeLb() }} aria-label="Photo">
          <button type="button" className="pill mono" onClick={closeLb} autoFocus style={{ position: "absolute", top: "24px", right: "24px", height: "44px", padding: "0 18px", borderRadius: "999px", border: "1px solid var(--text)", background: "var(--bg)", color: "var(--text)", cursor: "pointer" }}>Close ✕</button>
          {" "}
          <img decoding="async" src={lbSrc} alt="Enlarged photo" style={{ maxWidth: "min(1100px, 100%)", maxHeight: "100%", borderRadius: "14px", boxShadow: "0 30px 80px rgba(0,0,0,.45)" }} />
        </div>
      )}
      <section id="top" className="dots" style={{ position: "relative", paddingTop: "168px", paddingBottom: "56px", borderBottom: "1px solid var(--line)" }}>
        <AIBackdrop kind="graph" />
        <div className="wrap">
          <div className="fade" style={{ "--d": ".3s", display: "flex", justifyContent: "flex-end", gap: "24px", flexWrap: "wrap" }}>
            <span className="mono" style={{ color: "var(--muted)" }}>Shlok Bam / Portfolio 2026</span>
          </div>
          <h1 className="disp" aria-label="Beyond code" style={{ margin: "24px 0 0", fontSize: "min(clamp(40px, 10.2vw, 152px), calc((100vw - 80px) / 4.55))", fontStretch: "100%" }}>
            <span className="mask">
              {words.map((wd, wi) => (
                <Fragment key={wi}>
                  {wi > 0 && ' '}
                  <span style={{ whiteSpace: "nowrap" }}>
                    {wd.map((l) => <span key={l.i} className="ltr" aria-hidden="true" style={css(l.style)}>{l.ch}</span>)}
                    {wi === words.length - 1 && <span className="ltr" aria-hidden="true" style={{ "--i": "11", color: "var(--accent)" }}>.</span>}
                  </span>
                </Fragment>
              ))}
            </span>
          </h1>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "32px", flexWrap: "wrap", marginTop: "32px" }}>
            <p className="serif fade" style={{ "--d": ".6s", margin: "0", fontSize: "clamp(28px, 3vw, 44px)", maxWidth: "760px", lineHeight: "1.1" }}>People, stages and Saturdays.</p>
            <p className="mono fade" style={{ "--d": ".7s", margin: "0", maxWidth: "280px", color: "var(--muted)", lineHeight: "1.8", textAlign: "right" }}>Mentoring, anchoring and volunteering in Pune</p>
          </div>
          <div className="rule" style={{ marginTop: "44px" }} />
          <div className="mono fade" style={{ "--d": ".8s", display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", marginTop: "14px", color: "var(--muted)" }}>
            <span>100+ first-years mentored</span>
            <span>EDGE'24 anchor</span>
            <span>Weekend volunteer</span>
          </div>
        </div>
      </section>
      <section style={{ padding: "112px 0 48px" }}>
        <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: "112px" }}>
          {stories.map((s, s_i) => (
            <article key={s_i} className={s.cls}>
              <button type="button" className="simg rv" onClick={s.open} aria-label={s.year + " — enlarge photo"} style={{ display: "block", padding: "0", border: "none", background: "var(--surface)", borderRadius: "26px", overflow: "hidden", aspectRatio: "5 / 4", cursor: "zoom-in", position: "relative" }}>
                <span className="pic gray" style={{ display: "block", width: "100%", height: "100%" }}>
                  <img loading={s_i === 0 ? "eager" : "lazy"} fetchpriority={s_i === 0 ? "high" : undefined} decoding="async" className="para" src={s.img} alt={s.alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </span>
                {" "}
                <span className="mono" style={{ position: "absolute", left: "16px", top: "16px", background: "var(--bg)", color: "var(--text)", padding: "8px 12px", borderRadius: "999px" }}>{s.year}</span>
              </button>
              <div className="rv">
                <div className="disp snum" style={{ fontSize: "100px", color: "transparent", WebkitTextStroke: "1.5px var(--muted)" }}>{s.n}</div>
                <div className="mono" style={{ color: "var(--accent)", marginTop: "22px" }}>{s.role}</div>
                <h2 style={{ margin: "12px 0 0", fontSize: "clamp(28px, 3vw, 44px)", lineHeight: "1.06", letterSpacing: "-.025em", fontWeight: "700" }}>{s.title}</h2>
                <p style={{ margin: "18px 0 0", color: "var(--muted)", fontSize: "18px", lineHeight: "1.65" }}>{s.desc}</p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "22px" }}>
                  {s.tags.map((tg, tg_i) => (
                    <span key={tg_i} className="mono" style={{ padding: "8px 12px", borderRadius: "999px", border: "1px solid var(--line)" }}>{tg}</span>
                  ))}
                </div>
                {s.link && (
                  <A className="pill mono" href={s.link} style={{ marginTop: "26px", height: "46px", padding: "0 20px", borderRadius: "999px", border: "1px solid var(--text)", display: "inline-flex", alignItems: "center" }}>{s.cta} ↗</A>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
      <section style={{ padding: "88px 0 112px", borderBottom: "1px solid var(--line)", overflow: "hidden" }}>
        <div className="wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "24px", flexWrap: "wrap" }}>
          <div>
            <span className="mono" style={{ color: "var(--muted)" }}>Gallery</span>
            {" "}
            <h2 className="disp rv" style={{ margin: "20px 0 0", fontSize: "clamp(48px, 6.4vw, 100px)" }}>Moments</h2>
          </div>
          <span className="mono" style={{ color: "var(--muted)" }}>Hover to pause · click to enlarge</span>
        </div>
        <div ref={galleryRef} className="marq-wrap" style={{ marginTop: "56px", padding: "18px 0" }}>
          <div className="marq" style={{ "--dur": "90s" }}>
            {gallery.map((g, g_i) => (
              <button key={g_i} type="button" className="polaroid" onClick={g.open} aria-label={g.cap} aria-hidden={g.copy || undefined} tabIndex={g.copy ? -1 : undefined} style={css(g.style)}>
                <span style={{ display: "block", aspectRatio: "1 / 1", overflow: "hidden", borderRadius: "3px", background: "var(--surface2)" }}>
                  <img decoding="async" src={galleryOn ? g.small : undefined} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </span>
                {" "}
                <span className="mono" style={{ display: "block", marginTop: "10px", fontSize: "10.5px" }}>{g.cap}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
      <A className="next" href="/writing">
        <div className="wrap" style={{ paddingTop: "72px", paddingBottom: "72px" }}>
          <div className="mono nmuted" style={{ color: "var(--muted)" }}>Next page</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "24px", marginTop: "18px" }}>
            <span className="disp nt" style={{ fontSize: "clamp(60px, 10vw, 160px)" }}>Writing</span>
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
