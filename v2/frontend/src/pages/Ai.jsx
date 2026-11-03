import { useRef, useState } from 'react'
import Layout from '../components/Layout'
import A from '../components/A'
import { track } from '../lib/track'
import './Home.css'
import './Ai.css'

// /ai: how to connect the portfolio's MCP server (backend/mcp_server.py) to your own AI assistant.
// The server itself lives at /mcp (vercel.json forwards it to the API); a browser opening /mcp is sent here.
// Keep TOOLS and PROMPTS in step with mcp_server.py.
const MCP_URL = 'https://shlokbam.in/mcp'
const NAME = 'shlok-bam'
const CURSOR = 'cursor://anysphere.cursor-deeplink/mcp/install?name=' + NAME + '&config=eyJ1cmwiOiJodHRwczovL3NobG9rYmFtLmluL21jcCJ9' // config = base64 of {"url": MCP_URL}
const VSCODE = 'vscode:mcp/install?' + encodeURIComponent(JSON.stringify({ name: NAME, type: 'http', url: MCP_URL }))

// [id, app, steps, copyable snippet, one-click install link]
const CLIENTS = [
  ['claude', 'Claude', ['Open Settings → Connectors.', 'Click “Add custom connector”.', 'Name it “Shlok Bam”, paste the address above, and add it.', 'In a new chat, turn it on from the tools menu and ask away.'], '', ''],
  ['chatgpt', 'ChatGPT', ['Open Settings → Apps & Connectors → Advanced, and turn on Developer mode.', 'Click “Create”, name it “Shlok Bam” and paste the address above (no authentication).', 'In a new chat, pick it from the tools menu.'], '', ''],
  ['claude-code', 'Claude Code', ['Run this in your terminal, then ask Claude Code about Shlok.'], 'claude mcp add --transport http ' + NAME + ' ' + MCP_URL, ''],
  ['cursor', 'Cursor', ['Install it in one click, or add this to ~/.cursor/mcp.json.'], JSON.stringify({ mcpServers: { [NAME]: { url: MCP_URL } } }, null, 2), CURSOR],
  ['vscode', 'VS Code', ['Install it in one click, or add this to .vscode/mcp.json (Copilot agent mode).'], JSON.stringify({ servers: { [NAME]: { type: 'http', url: MCP_URL } } }, null, 2), VSCODE],
  ['other', 'Anything else', ['Any app that supports remote MCP servers over Streamable HTTP: add the address above. No sign-in, no API key.'], JSON.stringify({ [NAME]: { type: 'http', url: MCP_URL } }, null, 2), '']
]

const ASK = [
  'What are Shlok Bam’s best projects? Give me links.',
  'Is Shlok a good fit for an AI engineer intern role working on RAG and agents?',
  'What has he built with LangGraph, and how does it work?',
  'What has Shlok shipped on GitHub this week?',
  'Show me his patents, with the documents.',
  'Write interview questions about DailyDiff.'
]

const TOOLS = [
  ['get_profile', 'Who he is, current role, what he is open to, contact and links'],
  ['list_projects', 'Every project, filterable by tech or category, with live GitHub details'],
  ['get_project', 'Everything about one project: how it works, results, stack, links'],
  ['get_experience', 'Internships, leadership roles and education'],
  ['get_achievements', 'Patents, awards, certifications and community work, with proof'],
  ['get_skills', 'Skills by group and level, and the projects that use each'],
  ['get_writing', 'His technical blog posts'],
  ['get_resume', 'Résumé links (PDF and web)'],
  ['get_activity', 'What he has committed on GitHub lately (live)'],
  ['search_portfolio', 'Search all of the above for a word or topic']
]

const PROMPTS = [
  ['Evaluate Shlok for a role', 'paste a role or job description; get a verdict, evidence, gaps and questions to ask'],
  ['Shlok in three lines', 'a quick summary for a recruiter'],
  ['Interview questions on his projects', 'questions that test whether he really built it'],
  ['What’s Shlok up to lately?', 'this month’s focus and this week’s commits']
]

function Copy({ text, label = 'Copy', what }) {
  const [done, setDone] = useState(false)
  const t = useRef(0)
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setDone(true) } catch (e) { setDone(false) }
    track('mcp_copy', { what })
    clearTimeout(t.current)
    t.current = setTimeout(() => setDone(false), 1600)
  }
  return <button type="button" className="mono ai-copy" onClick={copy}>{done ? 'Copied ✓' : label}</button>
}

export default function Ai() {
  const [tab, setTab] = useState('claude')
  const client = CLIENTS.find((c) => c[0] === tab)
  const [id, app, steps, snippet, install] = client
  return (
    <Layout page="home" chat footerStyle="padding: 56px 0 36px; border-top: 1px solid var(--line)">
      <section id="top" className="dots" style={{ position: 'relative', paddingTop: '190px', paddingBottom: '72px', borderBottom: '1px solid var(--line)' }}>
        <div className="wrap">
          <span className="mono" style={{ color: 'var(--muted)' }}>MCP server · works in Claude, ChatGPT, Cursor, VS Code</span>
          <h1 className="disp" style={{ margin: '24px 0 0', fontSize: 'clamp(44px, 10vw, 150px)', lineHeight: '.92' }}>
            <span className="mask"><span className="rise" style={{ '--d': '.1s', display: 'block' }}>Don’t read it.</span></span>
            <span className="mask"><span className="rise" style={{ '--d': '.2s', display: 'block' }}>Ask it<span style={{ color: 'var(--accent)' }}>.</span></span></span>
          </h1>
          <p className="serif fade" style={{ '--d': '.4s', margin: '28px 0 0', fontSize: 'clamp(24px, 2.4vw, 34px)', color: 'var(--muted)', maxWidth: '820px', lineHeight: '1.2' }}>
            Add my portfolio to your own AI assistant and ask it anything about me: projects, experience, skills, patents. It answers from this site, so it’s always current.
          </p>
          <div className="fade ai-url" style={{ '--d': '.55s' }}>
            <code>{MCP_URL}</code>
            <Copy text={MCP_URL} label="Copy address" what="url" />
          </div>
        </div>
      </section>

      <section style={{ padding: '72px 0', borderBottom: '1px solid var(--line)' }}>
        <div className="wrap">
          <span className="mono" style={{ color: 'var(--muted)' }}>01 · Connect it</span>
          <div className="ai-tabs" role="tablist" aria-label="AI app">
            {CLIENTS.map(([cid, name]) => (
              <button key={cid} type="button" role="tab" aria-selected={tab === cid} className={'mono ai-tab' + (tab === cid ? ' on' : '')} onClick={() => setTab(cid)}>{name}</button>
            ))}
          </div>
          <div className="ai-panel" role="tabpanel" aria-label={app}>
            <ol>{steps.map((s) => <li key={s}>{s}</li>)}</ol>
            {install && <A className="btn mono" href={install} onClick={() => track('mcp_install', { client: id })} style={{ background: 'var(--accent)', color: 'var(--onaccent)', alignSelf: 'flex-start' }}>Install in {app} →</A>}
            {snippet && (
              <div className="ai-code">
                <pre><code>{snippet}</code></pre>
                <Copy text={snippet} what={id} />
              </div>
            )}
          </div>
        </div>
      </section>

      <section style={{ padding: '72px 0', borderBottom: '1px solid var(--line)' }}>
        <div className="wrap">
          <span className="mono" style={{ color: 'var(--muted)' }}>02 · Then ask</span>
          <ul className="ai-ask">{ASK.map((q) => <li key={q} className="serif">“{q}”</li>)}</ul>
        </div>
      </section>

      <section style={{ padding: '72px 0 110px' }}>
        <div className="wrap ai-two">
          <div>
            <span className="mono" style={{ color: 'var(--muted)' }}>03 · What it can look up</span>
            <dl className="ai-list">{TOOLS.map(([n, d]) => <div key={n}><dt className="mono">{n}</dt><dd>{d}</dd></div>)}</dl>
          </div>
          <div>
            <span className="mono" style={{ color: 'var(--muted)' }}>Ready-made prompts</span>
            <dl className="ai-list">{PROMPTS.map(([n, d]) => <div key={n}><dt>{n}</dt><dd>{d}</dd></div>)}</dl>
            <span className="mono" style={{ display: 'block', marginTop: '44px', color: 'var(--muted)' }}>Good to know</span>
            <ul className="ai-notes">
              <li>Read-only, free, no sign-in. Your AI app does the answering; the server only hands it facts from this site, with links.</li>
              <li>It logs which tool was used, never what you asked.</li>
              <li>Pay and client details aren’t shared: for those, <A className="ul" href="mailto:shlokbam19103@gmail.com">email me</A>.</li>
              <li>The same data as JSON: <A className="ul" href="https://shlokbam.in/portfolio.json">portfolio.json</A>. Prefer to ask here? Use the assistant on the <A className="ul" href="/#ask">home page</A>.</li>
            </ul>
          </div>
        </div>
      </section>
    </Layout>
  )
}
