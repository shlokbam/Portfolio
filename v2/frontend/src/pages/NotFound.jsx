import Layout from '../components/Layout'
import A from '../components/A'
import './Home.css'

export default function NotFound() {
  return (
    <Layout page="home" chat footerStyle="padding: 56px 0 36px; border-top: 1px solid var(--line)">
      <section id="top" className="dots" style={{ position: 'relative', paddingTop: '200px', paddingBottom: '140px' }}>
        <div className="wrap">
          <span className="mono" style={{ color: 'var(--muted)' }}>404 — Page not found</span>
          <h1 className="disp" style={{ margin: '24px 0 0', fontSize: 'clamp(88px, 18vw, 270px)', fontStretch: '100%' }}>
            <span className="mask"><span className="rise" style={{ '--d': '.1s' }}>Lost<span style={{ color: 'var(--accent)' }}>.</span></span></span>
          </h1>
          <p className="serif fade" style={{ '--d': '.4s', margin: '24px 0 0', fontSize: 'clamp(26px, 2.6vw, 38px)', color: 'var(--muted)' }}>That page doesn't exist — but plenty of others do.</p>
          <div className="fade" style={{ '--d': '.55s', display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '34px' }}>
            <A className="btn mono" href="/" style={{ background: 'var(--accent)', color: 'var(--onaccent)' }}>Back home</A>
            <A className="btn mono" href="/work" style={{ border: '1px solid var(--text)' }}>See my work</A>
          </div>
        </div>
      </section>
    </Layout>
  )
}
