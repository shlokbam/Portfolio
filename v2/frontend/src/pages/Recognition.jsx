import Layout from '../components/Layout'
import A from '../components/A'
import AIBackdrop from '../components/AIBackdrop'
import { css } from '../lib/css'
import { file, opt, sized } from '../lib/links'
import { useHolo, useStamp } from '../lib/holo'
import { PATENTS, AWARDS, CERTIFICATIONS, MORE_CERTIFICATIONS } from '../content/recognition'
import './Recognition.css'

export default function Recognition() {
  useHolo()
  useStamp()
  const title = 'RECOGNITION'.split('').map((ch, i) => ({ ch, style: '--i: ' + i }))
  const patents = PATENTS.map((p, i) => ({ ...p, img: opt(p.image), href: file(p.document), pid: 'cring' + i, stick: 'top: ' + (100 + i * 32) + 'px; margin-bottom: 64px; z-index: ' + (i + 1) }))
  const certs = CERTIFICATIONS.map((c, i) => ({ ...c, n: String(i + 1).padStart(2, '0') }))
  const more = MORE_CERTIFICATIONS.map((m, i) => ({ ...m, href: file(m.href), n: String(i + 4).padStart(2, '0') }))
  return (
    <Layout page="recognition" curtain="Recognition" chat greeting="Ask me what each patent does, or which one was granted." footerStyle="padding: 56px 0 36px; border-top: 1px solid var(--line)">
      <section id="top" className="dots" style={{ position: "relative", paddingTop: "168px", paddingBottom: "56px", borderBottom: "1px solid var(--line)" }}>
        <AIBackdrop kind="cv" />
        <div className="wrap">
          <div className="fade" style={{ "--d": ".3s", display: "flex", justifyContent: "flex-end", gap: "24px", flexWrap: "wrap" }}>
            <span className="mono" style={{ color: "var(--muted)" }}>Shlok Bam / Portfolio 2026</span>
          </div>
          <h1 className="disp" aria-label="Recognition" style={{ margin: "24px 0 0", fontSize: "min(clamp(40px, 10.2vw, 152px), calc((100vw - 80px) / 7.5))", fontStretch: "100%" }}>
            <span className="mask" style={{ whiteSpace: "nowrap" }}>
              {title.map((l, l_i) => (
                <span key={l_i} className="ltr" aria-hidden="true" style={css(l.style)}>{l.ch}</span>
              ))}
            </span>
          </h1>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "32px", flexWrap: "wrap", marginTop: "32px" }}>
            <p className="serif fade" style={{ "--d": ".6s", margin: "0", fontSize: "clamp(28px, 3vw, 44px)", maxWidth: "760px", lineHeight: "1.1" }}>Proof, on paper.</p>
            <p className="mono fade" style={{ "--d": ".7s", margin: "0", maxWidth: "300px", color: "var(--muted)", lineHeight: "1.8", textAlign: "right" }}>Patents across two countries, competition wins and certifications</p>
          </div>
          <div className="rule" style={{ marginTop: "44px" }} />
          <div className="mono fade" style={{ "--d": ".8s", display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", marginTop: "14px", color: "var(--muted)" }}>
            <span>3 patents</span>
            <span>India + South Africa</span>
            <span>3 awards</span>
            <span>9 certifications</span>
          </div>
        </div>
      </section>
      <section id="patents" style={{ padding: "104px 0 48px" }}>
        <div className="wrap">
          <span className="mono" style={{ color: "var(--muted)" }}>Patents</span>
          {" "}
          <h2 className="disp rv" style={{ margin: "20px 0 0", fontSize: "clamp(48px, 6.4vw, 100px)" }}>
            Co-
            <span className="serif" style={{ textTransform: "none", fontWeight: "400", color: "var(--accent)" }}>invented</span>
          </h2>
          <p className="rv" style={{ margin: "18px 0 0", maxWidth: "560px", color: "var(--muted)", fontSize: "18px", lineHeight: "1.6" }}>Three ideas taken all the way to the patent office.</p>
          <div style={{ marginTop: "56px" }}>
            {patents.map((p, p_i) => (
              <article key={p_i} className="stack-card" style={css(p.stick)}>
                <div className="shrink g-patent" style={{ border: "1px solid var(--line)", borderRadius: "28px", background: "var(--surface)", padding: "26px", boxShadow: "0 -16px 50px rgba(0,0,0,.22)" }}>
                  <div data-stamp style={{ position: "relative", borderRadius: "18px", background: "var(--surface2)", minHeight: "420px", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
                    <span className={'stamp st-' + p.short.toLowerCase()} aria-hidden="true"><b>{p.short}</b><i>{p.office.split(' · ')[0]} · {p.date.match(/\d{4}/)[0]}</i></span>
                    <img loading={p_i === 0 ? "eager" : "lazy"} fetchpriority={p_i === 0 ? "high" : undefined} decoding="async" {...sized(p.img)} sizes="(max-width: 900px) 70vw, 440px" alt={p.alt} style={{ maxWidth: "100%", maxHeight: "400px", objectFit: "contain", borderRadius: "8px", display: "block" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", padding: "6px 4px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                      <div className="mono" style={{ color: "var(--muted)", lineHeight: "1.8" }}>
                        {p.office}
                        <br />
                        {p.date}
                      </div>
                      <div aria-label={p.status} style={{ position: "relative", width: "112px", height: "112px", flex: "none" }}>
                        <svg className="spin" viewBox="0 0 120 120" style={{ "--dur": "28s", position: "absolute", inset: "0", width: "112px", height: "112px" }} aria-hidden="true">
                          <defs>
                            <path id={p.pid} d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
                          </defs>
                          <text style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "2.6px", fill: "var(--accent)", textTransform: "uppercase" }}>
                            <textPath href={`#${p.pid}`}>{p.ring}</textPath>
                          </text>
                        </svg>
                        {" "}
                        <span className="disp" style={{ position: "absolute", inset: "24px", borderRadius: "50%", background: "var(--accent)", color: "var(--onaccent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontStretch: "100%", letterSpacing: "0" }}>{p.short}</span>
                      </div>
                    </div>
                    <h3 style={{ margin: "24px 0 0", fontSize: "clamp(26px, 2.6vw, 38px)", lineHeight: "1.1", letterSpacing: "-.025em", fontWeight: "700" }}>{p.title}</h3>
                    <p style={{ margin: "16px 0 0", color: "var(--muted)", fontSize: "17px", lineHeight: "1.65" }}>{p.desc}</p>
                    <div style={{ marginTop: "auto", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", borderTop: "1px solid var(--line)", flexWrap: "wrap" }}>
                      <span className="mono">{p.appno}</span>
                      <A className="pill mono" href={p.href} style={{ height: "44px", padding: "0 18px", borderRadius: "999px", border: "1px solid var(--text)", display: "inline-flex", alignItems: "center" }}>{p.cta} ↗</A>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section id="stage" style={{ padding: "88px 0 112px", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <span className="mono" style={{ color: "var(--muted)" }}>Awards &amp; programs</span>
          {" "}
          <h2 className="disp rv" style={{ margin: "20px 0 0", fontSize: "clamp(48px, 6.4vw, 100px)" }}>On stage</h2>
          <div className="g-3" style={{ marginTop: "48px" }}>
            {AWARDS.map((a) => (
              <article key={a.title} className="award rv" data-holo style={{ border: "1px solid var(--line)", borderRadius: "24px", overflow: "hidden", background: "var(--surface)", display: "flex", flexDirection: "column" }}>
                <div className={a.images.length > 1 ? "pic swap" : "pic"} style={{ position: "relative", aspectRatio: "4 / 3", background: "var(--surface2)" }}>
                  {a.images.map(([src, alt], i) => (
                    <img key={src} loading="lazy" decoding="async" className={a.images.length > 1 ? (i ? "b" : "a") : undefined} {...sized(opt(src))} sizes="(max-width: 900px) 92vw, 360px" alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: a.imageTop ? "top" : undefined, display: "block" }} />
                  ))}
                  {a.images.length > 1 && <span className="mono" style={{ position: "absolute", left: "14px", bottom: "14px", background: "var(--bg)", padding: "7px 12px", borderRadius: "999px", fontSize: "10px" }}>Hover · official post</span>}
                </div>
                <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px", flex: "1" }}>
                  <div className="mono" style={{ display: "flex", justifyContent: "space-between", color: "var(--muted)", fontSize: "11px" }}>
                    <span>{a.org}</span>
                    <span>{a.date}</span>
                  </div>
                  <h3 style={{ margin: "0", fontSize: "23px", letterSpacing: "-.015em" }}>{a.title}</h3>
                  <p style={{ margin: "0", color: "var(--muted)", fontSize: "15px", lineHeight: "1.6" }}>{a.desc}</p>
                  <div className="mono" style={{ marginTop: "auto", paddingTop: "14px", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                    {a.result && <span style={{ color: "var(--accent)" }}>{a.result}</span>}
                    {a.links.map(([label, href]) => <A key={label} className="ul" href={href.startsWith('/static/') ? file(href) : href}>{label} ↗</A>)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section id="certified" style={{ padding: "112px 0", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <span className="mono" style={{ color: "var(--muted)" }}>Certifications</span>
          {" "}
          <h2 className="disp rv" style={{ margin: "20px 0 0", fontSize: "clamp(48px, 6.4vw, 100px)" }}>Certified</h2>
          <div className="g-3" style={{ marginTop: "48px" }}>
            {certs.map((c, c_i) => (
              <A key={c_i} className="ticket rv" data-holo href={c.href} style={{ display: "flex", flexDirection: "column", borderRadius: "22px", background: "var(--text)", color: "var(--bg)", minHeight: "360px", overflow: "hidden" }}>
                <div style={{ padding: "26px", flex: "1", display: "flex", flexDirection: "column" }}>
                  <div className="mono" style={{ display: "flex", justifyContent: "space-between", opacity: ".7" }}>
                    <span>{c.org}</span>
                    <span>No. {c.n}</span>
                  </div>
                  <div className="disp" style={{ fontSize: "64px", marginTop: "22px", color: "var(--accent-ink)" }}>{c.mark}</div>
                  <h3 style={{ margin: "16px 0 0", fontSize: "23px", lineHeight: "1.15", letterSpacing: "-.015em" }}>{c.title}</h3>
                  <p style={{ margin: "10px 0 0", fontSize: "14px", lineHeight: "1.55", opacity: ".72" }}>{c.desc}</p>
                </div>
                <div style={{ height: "0", borderTop: "2px dashed color-mix(in srgb, var(--bg) 40%, transparent)", margin: "0 22px" }} />
                <div className="mono" style={{ height: "88px", padding: "0 26px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>{c.date}</span>
                  <span style={{ padding: "9px 14px", borderRadius: "999px", background: "var(--accent)", color: "var(--onaccent)" }}>{c.cta} ↗</span>
                </div>
                  <span className="notch" style={{ left: "-13px" }} />
                <span className="notch" style={{ right: "-13px" }} />
              </A>
            ))}
          </div>
          <div className="rv" style={{ marginTop: "56px", borderTop: "1px solid var(--text)" }}>
            <div className="mono" style={{ display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", padding: "18px 0", color: "var(--muted)" }}>
              <span>More certificates · Microsoft &amp; LinkedIn Learning</span>
              <span>Mar 2024</span>
            </div>
            {more.map((m) => (
              <A key={m.n} className="crow" href={m.href} style={{ display: "grid", gridTemplateColumns: "56px minmax(0, 1fr) auto", gap: "20px", alignItems: "baseline", padding: "20px 0", borderTop: "1px solid var(--line)" }}>
                <span className="mono" style={{ color: "var(--muted)" }}>{m.n}</span>
                <span>
                  <span className="cname" style={{ display: "block", fontSize: "20px", fontWeight: "700", letterSpacing: "-.01em" }}>{m.title}</span>
                  <span className="hide-sm" style={{ display: "block", marginTop: "6px", color: "var(--muted)", fontSize: "15px", lineHeight: "1.5" }}>{m.desc}</span>
                </span>
                <span className="mono" style={{ color: "var(--accent)" }}>PDF ↗</span>
              </A>
            ))}
          </div>
        </div>
      </section>
      <A className="next" href="/community">
        <div className="wrap" style={{ paddingTop: "26px", paddingBottom: "26px" }}>
          <div className="mono nmuted" style={{ color: "var(--muted)" }}>Next page</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "24px", marginTop: "8px" }}>
            <span className="disp nt" style={{ fontSize: "clamp(26px, 3vw, 46px)" }}>Community</span>
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
