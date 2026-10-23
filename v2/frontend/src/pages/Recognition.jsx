import Layout from '../components/Layout'
import A from '../components/A'
import { css } from '../lib/css'
import { file } from '../lib/links'
import './Recognition.css'

export default function Recognition() {
  const title = 'RECOGNITION'.split('').map((ch, i) => ({ ch, style: '--i: ' + i }))
  const patents = [
    { office: 'CIPC · Republic of South Africa', date: 'Granted 25 / 02 / 2026', status: 'Granted', short: 'Granted', ring: 'Patent granted · CIPC ZA · 2026 · ', title: 'A Comprehensive Wildlife Protection System Using YOLO', desc: 'A multi-layered conservation and anti-poaching system that uses YOLO-based computer vision to detect human intruders, recognise animal species and dispatch automated real-time alerts.', appno: 'App. No. 2025/04189', cta: 'Register sheet', img: '/static/Patent/Grant_acknowledgement.png', href: file('/static/Patent/Grant acknowledgement.pdf'), alt: 'Official patent register sheet' },
    { office: 'CIPC · Republic of South Africa', date: 'Lodged 21 / 05 / 2026', status: 'Filed', short: 'Filed', ring: 'Patent filed · CIPC ZA · 2026 · ', title: 'An Intelligent Fruit and Vegetable Identification and Quality Classification System', desc: 'Automated agricultural quality control using digital image processing and machine learning to identify produce, evaluate freshness, detect surface defects and grade quality in real time.', appno: 'App. No. 2026/05473', cta: 'Lodging receipt', img: '/static/Patent/Receipt_05473.png', href: file('/static/Patent/Receipt 05473.pdf'), alt: 'Patent lodging receipt' },
    { office: 'IPO · Government of India', date: 'Published U/S 11A · 03 / 10 / 2025', status: 'Published', short: 'Published', ring: 'Patent published · IPO India · 2025 · ', title: 'Next-Generation TKPH Tire Health Management System', desc: 'A predictive tyre-health framework for heavy machinery that combines AI-based TKPH analytics, blockchain-secured maintenance records and digital-twin lifecycle monitoring.', appno: 'Indian Patent Office', cta: 'Application', img: '/static/Patent/Patent.png', href: '/static/Patent/Patent.png', alt: 'Published patent application' }
  ].map((p, i) => ({ ...p, pid: 'cring' + i, stick: 'top: ' + (100 + i * 32) + 'px; margin-bottom: 64px; z-index: ' + (i + 1) }))
  const certs = [
    { org: 'McKinsey.org', n: '01', mark: 'Mc', title: 'Forward Program', desc: 'Problem-solving, communication, adaptability and digital readiness through hands-on modules.', date: 'Dec 2025', cta: 'Certificate', href: '/static/certificates/certifications/Certificate.pdf' },
    { org: 'Google Cloud', n: '02', mark: 'GCP', title: 'Google Cloud Data Analytics', desc: 'Five courses — BigQuery, data transformation, visualisation and storytelling — plus a capstone.', date: 'Jun 2025', cta: 'Credly', href: 'https://www.credly.com/badges/e6109deb-b3e0-414c-847c-a2a7ad21c4a6/public_url' },
    { org: 'Amazon Web Services', n: '03', mark: 'AWS', title: 'AWS Cloud Practitioner Essentials', desc: 'Cloud fundamentals, security, pricing and architecture — EC2, S3, IAM and the Well-Architected Framework.', date: 'Jul 2025', cta: 'Certificate', href: '/static/certificates/certifications/aws.pdf' }
  ]
  const cert = (name) => file('/static/certificates/certifications/CertificateOfCompletion_' + name + '.pdf')
  const more = [
    { title: 'Career Essentials in Data Analysis', desc: 'Data analysis fundamentals, visualisation and the analytical tools used in modern business.', href: cert('Career Essentials in Data Analysis by Microsoft and LinkedIn') },
    { title: 'Build Your Generative AI Productivity Skills', desc: 'Generative AI tools and techniques to automate tasks and boost productivity.', href: cert('Build Your Generative AI Productivity Skills with Microsoft and LinkedIn (2)') },
    { title: 'Career Essentials in GitHub', desc: 'Version control, collaboration workflows and GitHub best practices.', href: cert('Career Essentials in GitHub Professional Certificate (2)') },
    { title: 'Career Essentials in Project Management', desc: 'Project management methodologies, tools and delivery practices.', href: cert('Career Essentials in Project Management by Microsoft and LinkedIn (3)') },
    { title: 'OpenCV for Python Developers', desc: 'Image processing, object detection and real-time video analysis with OpenCV.', href: cert('OpenCV for Python Developers') },
    { title: 'Master In-Demand Professional Soft Skills', desc: 'Communication, leadership, problem-solving and workplace productivity.', href: cert('Master InDemand Professional Soft Skills (5)') }
  ].map((m, i) => ({ ...m, n: String(i + 4).padStart(2, '0') }))
  return (
    <Layout page="recognition" vtab="(04) — Recognition · Menu" curtain="(04) Recognition" chat greeting="Ask me what each patent does, or which one was granted." footerStyle="padding: 56px 0 36px; border-top: 1px solid var(--line)">
      <section id="top" className="dots" style={{ position: "relative", paddingTop: "168px", paddingBottom: "56px", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="fade" style={{ "--d": ".3s", display: "flex", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }}>
            <span className="mono" style={{ color: "var(--muted)" }}>(04) — Recognition</span>
            <span className="mono" style={{ color: "var(--muted)" }}>Shlok Bam / Portfolio 2026</span>
          </div>
          <h1 className="disp" aria-label="Recognition" style={{ margin: "24px 0 0", fontSize: "clamp(40px, 10.2vw, 152px)", fontStretch: "100%" }}>
            <span className="mask">
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
      <section style={{ padding: "104px 0 48px" }}>
        <div className="wrap">
          <span className="mono" style={{ color: "var(--muted)" }}>(04.1) — Patents</span>
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
                  <div style={{ borderRadius: "18px", background: "var(--surface2)", minHeight: "420px", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
                    <img src={p.img} alt={p.alt} style={{ maxWidth: "100%", maxHeight: "400px", objectFit: "contain", borderRadius: "8px", display: "block" }} />
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
      <section style={{ padding: "88px 0 112px", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <span className="mono" style={{ color: "var(--muted)" }}>(04.2) — Awards &amp; programs</span>
          {" "}
          <h2 className="disp rv" style={{ margin: "20px 0 0", fontSize: "clamp(48px, 6.4vw, 100px)" }}>On stage</h2>
          <div className="g-3" style={{ marginTop: "48px" }}>
            <article className="award rv" style={{ border: "1px solid var(--line)", borderRadius: "24px", overflow: "hidden", background: "var(--surface)", display: "flex", flexDirection: "column" }}>
              <div className="pic swap" style={{ position: "relative", aspectRatio: "4 / 3", background: "var(--surface2)" }}>
                <img className="a" src="/static/certificates/images/winning_screenshots/1.jpeg" alt="Team pumpdotfun receiving the award" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                {" "}
                <img className="b" src="/static/certificates/images/official_posts/image.png" alt="Official college post about the award" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                {" "}
                <span className="mono" style={{ position: "absolute", left: "14px", bottom: "14px", background: "var(--bg)", padding: "7px 12px", borderRadius: "999px", fontSize: "10px" }}>Hover · official post</span>
              </div>
              <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px", flex: "1" }}>
                <div className="mono" style={{ display: "flex", justifyContent: "space-between", color: "var(--muted)", fontSize: "11px" }}>
                  <span>INDOvateAI Sprint</span>
                  <span>Mar 2025</span>
                </div>
                <h3 style={{ margin: "0", fontSize: "23px", letterSpacing: "-.015em" }}>Outstanding Performance Award</h3>
                <p style={{ margin: "0", color: "var(--muted)", fontSize: "15px", lineHeight: "1.6" }}>
                  Team pumpdotfun built IndoTrade — an AI stock assistant combining real-time data with intelligent insight, using Next.js, Flask and MySQL.
                </p>
                <div className="mono" style={{ marginTop: "auto", paddingTop: "14px", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--accent)" }}>Winner</span>
                  <A className="ul" href={file('/static/certificates/hackathons/8.pdf')}>Certificate ↗</A>
                </div>
              </div>
            </article>
            <article className="award rv" style={{ border: "1px solid var(--line)", borderRadius: "24px", overflow: "hidden", background: "var(--surface)", display: "flex", flexDirection: "column" }}>
              <div className="pic" style={{ position: "relative", aspectRatio: "4 / 3", background: "var(--surface2)" }}>
                <img src="/static/Arcade/arcade_dashboard.png" alt="Google Arcade progress dashboard" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
              </div>
              <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px", flex: "1" }}>
                <div className="mono" style={{ display: "flex", justifyContent: "space-between", color: "var(--muted)", fontSize: "11px" }}>
                  <span>Google Cloud</span>
                  <span>2025</span>
                </div>
                <h3 style={{ margin: "0", fontSize: "23px", letterSpacing: "-.015em" }}>Arcade Program — Diamond League</h3>
                <p style={{ margin: "0", color: "var(--muted)", fontSize: "15px", lineHeight: "1.6" }}>
                  Selected into Google's hands-on cloud skills program; reached Diamond League with 90+ badges. Swag eligible, Trooper tier.
                </p>
                <div className="mono" style={{ marginTop: "auto", paddingTop: "14px", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                  <A className="ul" href="https://arcadecalc.netlify.app/dashboard">Dashboard ↗</A>
                  <A className="ul" href="https://www.skills.google/public_profiles/311559d8-dbf8-4586-a58f-42e5a33291f9">Skills profile ↗</A>
                </div>
              </div>
            </article>
            <article className="award rv" style={{ border: "1px solid var(--line)", borderRadius: "24px", overflow: "hidden", background: "var(--surface)", display: "flex", flexDirection: "column" }}>
              <div className="pic" style={{ position: "relative", aspectRatio: "4 / 3", background: "var(--surface2)" }}>
                <img src="/static/certificates/images/official_posts/1724320631666.jpeg" alt="Official Navdhara competition post" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px", flex: "1" }}>
                <div className="mono" style={{ display: "flex", justifyContent: "space-between", color: "var(--muted)", fontSize: "11px" }}>
                  <span>Navdhara · State level</span>
                  <span>Sep 2024</span>
                </div>
                <h3 style={{ margin: "0", fontSize: "23px", letterSpacing: "-.015em" }}>Poster Competition — Top 5</h3>
                <p style={{ margin: "0", color: "var(--muted)", fontSize: "15px", lineHeight: "1.6" }}>
                  Team Infinity Innovators presented an AI wildlife-poaching detection system using computer vision and automated alerts.
                </p>
                <div className="mono" style={{ marginTop: "auto", paddingTop: "14px", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--accent)" }}>Finalist</span>
                  <A className="ul" href={file('/static/certificates/hackathons/1.pdf')}>Certificate ↗</A>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
      <section style={{ padding: "112px 0", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <span className="mono" style={{ color: "var(--muted)" }}>(04.3) — Certifications</span>
          {" "}
          <h2 className="disp rv" style={{ margin: "20px 0 0", fontSize: "clamp(48px, 6.4vw, 100px)" }}>Certified</h2>
          <div className="g-3" style={{ marginTop: "48px" }}>
            {certs.map((c, c_i) => (
              <A key={c_i} className="ticket rv" href={c.href} style={{ display: "flex", flexDirection: "column", borderRadius: "22px", background: "var(--text)", color: "var(--bg)", minHeight: "360px", overflow: "hidden" }}>
                <div style={{ padding: "26px", flex: "1", display: "flex", flexDirection: "column" }}>
                  <div className="mono" style={{ display: "flex", justifyContent: "space-between", opacity: ".7" }}>
                    <span>{c.org}</span>
                    <span>No. {c.n}</span>
                  </div>
                  <div className="disp" style={{ fontSize: "64px", marginTop: "22px", color: "var(--accent)" }}>{c.mark}</div>
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
        <div className="wrap" style={{ paddingTop: "72px", paddingBottom: "72px" }}>
          <div className="mono nmuted" style={{ color: "var(--muted)" }}>Next page — (05)</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "24px", marginTop: "18px" }}>
            <span className="disp nt" style={{ fontSize: "clamp(52px, 10vw, 160px)" }}>Community</span>
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
