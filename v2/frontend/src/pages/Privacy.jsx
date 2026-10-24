import Layout from '../components/Layout'
import A from '../components/A'
import './Home.css'

// Plain-language privacy note: what the site collects, who processes it, and how to opt out.
// Keep in step with index.html (analytics), lib/contact.js, backend /api/chat and the localStorage keys.
const UPDATED = '24 October 2026'

const SECTIONS = [
  ['Analytics', <>The live site uses <b>Google Analytics</b> to count visits: which pages are viewed, roughly where visitors are (city level), and their device and browser. It sets first-party cookies (<code>_ga</code>) and IP addresses are anonymised. It doesn't run on local copies of the site. You can block it with any tracker blocker or Google's <A className="ul" href="https://tools.google.com/dlpage/gaoptout">opt-out add-on</A>.</>],
  ['Heatmaps', <>The site also uses <b>Microsoft Clarity</b> to see how pages are used: where people click and scroll, and anonymised replays of visits. Clarity masks sensitive text such as what you type into forms, and sets its own first-party cookies. You can block it the same way as analytics, and Microsoft's <A className="ul" href="https://privacy.microsoft.com/privacystatement">privacy statement</A> covers how it handles the data.</>],
  ['Ask my AI', <>When you ask the assistant something, your question and the last few messages of that conversation are sent to my server and to <b>Groq</b>, the AI provider that writes the reply. I don't store the questions; the server only keeps a running count of how many it has answered. Groq handles them under its own privacy policy, so please don't type anything private.</>],
  ['Contact form', <>Your name, email, company, topic and message go to <b>Web3Forms</b>, which emails them to me. I use them only to reply to you, and I'll delete them if you ask.</>],
  ['Stored in your browser', <>Your light/dark theme choice and your arcade best scores are saved in your browser's local storage. They never leave your device; clearing site data removes them.</>],
  ['Hosting', <>The site is served by <b>Vercel</b> and its API by <b>Render</b>. Like any web host, they may keep standard server logs (such as IP address and browser) for security and reliability. The live coding stats are public numbers fetched from LeetCode, CodeChef and GitHub; no visitor data is sent to them. Fonts are self-hosted.</>],
  ['No selling, no ads', <>There are no ads, no accounts and no tracking beyond what's above. I don't sell or share anyone's information.</>],
  ['Questions or deletion', <>Email <A className="ul" href="mailto:shlokbam19103@gmail.com">shlokbam19103@gmail.com</A> and I'll answer, or delete anything you've sent me.</>]
]

export default function Privacy() {
  return (
    <Layout page="home" chat footerStyle="padding: 56px 0 36px; border-top: 1px solid var(--line)">
      <section id="top" className="dots" style={{ position: 'relative', paddingTop: '190px', paddingBottom: '72px', borderBottom: '1px solid var(--line)' }}>
        <div className="wrap">
          <span className="mono" style={{ color: 'var(--muted)' }}>Last updated · {UPDATED}</span>
          <h1 className="disp" style={{ margin: '24px 0 0', fontSize: 'clamp(48px, 13vw, 200px)' }}>
            <span className="mask"><span className="rise" style={{ '--d': '.1s' }}>Privacy<span style={{ color: 'var(--accent)' }}>.</span></span></span>
          </h1>
          <p className="serif fade" style={{ '--d': '.4s', margin: '24px 0 0', fontSize: 'clamp(26px, 2.6vw, 38px)', color: 'var(--muted)', maxWidth: '760px', lineHeight: '1.15' }}>What this site collects, in plain words. Short version: very little.</p>
        </div>
      </section>
      <section style={{ padding: '72px 0 110px' }}>
        <div className="wrap">
          <div style={{ maxWidth: '820px', display: 'grid', gap: '0' }}>
            {SECTIONS.map(([title, body], i) => (
              <div key={title} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '10px', padding: '30px 0', borderTop: i ? '1px solid var(--line)' : 'none' }}>
                <h2 className="mono" style={{ margin: '0', color: 'var(--accent)' }}>{String(i + 1).padStart(2, '0')} · {title}</h2>
                <p style={{ margin: '0', fontSize: '18px', lineHeight: '1.65', color: 'var(--muted)' }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}
