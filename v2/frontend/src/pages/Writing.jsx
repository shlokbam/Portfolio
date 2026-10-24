import Layout from '../components/Layout'
import A from '../components/A'
import AIBackdrop from '../components/AIBackdrop'
import { css } from '../lib/css'
import { useState } from 'react'
import './Writing.css'

export default function Writing() {
  const title = 'JOURNAL'.split('').map((ch, i) => ({ ch, style: '--i: ' + i }))
  const [topic, setTopic] = useState('all')
  const entries = [
    { date: 'Sep 2026', tag: 'RAG', group: 'ai', title: 'Building generative AI apps with LangChain: document loaders, text splitters, ChromaDB and LCEL', blurb: 'Hands-on RAG practice — loaders, splitters, ChromaDB vector stores and LCEL runnables.', href: 'https://journal-murex-three.vercel.app/journal/building-generative-ai-apps-langchain-document-loaders-chromadb-lcel' },
    { date: 'Sep 2026', tag: 'LLMOps', group: 'ai', title: 'My LangSmith learning log: tracing, debugging and optimising LLM chains and RAG pipelines', blurb: 'Tracking prompts, latency and token costs in LangSmith — and tuning a PDF RAG pipeline over 4 iterations.', href: 'https://journal-murex-three.vercel.app/journal/my-langsmith-learning-log-tracing-debugging-optimizing-llm-chains-rag' },
    { date: 'Aug 2026', tag: 'Agents', group: 'ai', title: 'Hands-on agentic AI with LangGraph: sequential, parallel and conditional state workflows', blurb: 'Stateful LangGraph workflows — from parallel essay graders to equation solvers and sentiment routers.', href: 'https://journal-murex-three.vercel.app/journal/hands-on-agentic-ai-langgraph-sequential-parallel-conditional-workflows' },
    { date: 'Aug 2026', tag: 'MCP', group: 'ai', title: 'Exploring the Model Context Protocol: AI tools, Streamlit clients and emailmd assistants', blurb: 'Custom FastMCP servers, emailmd API tools and an interactive Streamlit chatbot client.', href: 'https://journal-murex-three.vercel.app/journal/exploring-model-context-protocol-mcp-ai-tools-streamlit-emailmd' },
    { date: 'Aug 2026', tag: 'DevOps', group: 'devops', title: 'My 7-day DevOps lab: learning Terraform, Ansible and HashiCorp Vault by building real infrastructure', blurb: 'From clicking around the AWS console to Terraform modules, S3 state locking, Ansible playbooks and Vault secrets.', href: 'https://journal-murex-three.vercel.app/journal/my-7-day-devops-lab-terraform-ansible-hashicorp-vault' },
    { date: 'Jul 2026', tag: 'Architecture', group: 'web', title: 'Designing a real-time inventory system with FIFO stock reduction, PDF invoicing and Telegram webhooks', blurb: 'FIFO batch allocation, concurrency-safe PostgreSQL transactions, ReportLab invoices and instant Telegram alerts.', href: 'https://journal-murex-three.vercel.app/journal/designing-a-real-time-enterprise-inventory-system-with-fifo-stock-reduction-automated-pdf-invoicing-and-telegram-webhooks' },
    { date: 'Jun 2026', tag: 'Agents', group: 'ai', title: 'I built DailyDiff — an autonomous multi-agent tech research and editorial team', blurb: 'How the LangGraph editorial pipeline filters technical noise into sharp 5-point developer briefs.', href: 'https://journal-murex-three.vercel.app/journal/i-built-dailydiff-an-autonomous-multi-agent-tech-research-editorial-team' },
    { date: 'May 2026', tag: 'Agents', group: 'ai', title: 'Building an autonomous multi-agent research and fact-auditing system with LangChain, Mistral and RAG', blurb: 'An async pipeline that crawls the web, cleans pages, drafts reports, audits facts and indexes vectors in Pinecone.', href: 'https://journal-murex-three.vercel.app/journal/building-an-autonomous-multi-agent-ai-research-fact-auditing-system-with-langchain-mistral-and-rag' },
    { date: 'Apr 2026', tag: 'Full-stack', group: 'web', title: 'Building Eagle LMS: leading an industry-sponsored full-stack project from napkin to production', blurb: 'Leading a team of five on a dual-role web and React Native app with dynamic watermarking and phase-based unlocking.', href: 'https://journal-murex-three.vercel.app/journal/i-built-an-enterprise-lms-with-local-cloud-devops-from-scratch-here-s-everything-that-went-wrong' },
    { date: 'Apr 2026', tag: 'AI & React', group: 'ai', title: 'I built an AI-powered mock interview platform — everything that went wrong', blurb: 'The story of MockVue: AI feedback, live code execution and analytics, and every wrong turn on the way.', href: 'https://journal-murex-three.vercel.app/journal/i-built-an-ai-powered-mock-interview-platform-from-scratch-here-s-everything-that-went-wrong' },
    { date: 'Mar 2026', tag: 'AI & Flask', group: 'ai', title: 'I built an AI data analyst app from scratch — how I taught a Flask app to think', blurb: 'The build log behind AI Data Analyst: turning raw datasets into LLM-generated insights, charts and summaries.', href: 'https://journal-murex-three.vercel.app/journal/i-built-an-ai-data-analyst-app-from-scratch-here-s-how-i-taught-a-flask-app-to-think' },
    { date: 'Mar 2026', tag: 'DevOps', group: 'devops', title: 'I built a full DevOps CI/CD pipeline from scratch — everything that went wrong', blurb: 'Docker, Jenkins, Terraform and AWS EC2 — what it actually took to ship a Flask app end to end.', href: 'https://journal-murex-three.vercel.app/journal/i-built-a-full-devops-ci-cd-pipeline-from-scratch-here-s-everything-that-went-wrong' }
  ].map((e, i) => ({ ...e, n: String(i + 1).padStart(2, '0') }))
  const TOPICS = [['all', 'All'], ['ai', 'AI & agents'], ['devops', 'DevOps'], ['web', 'Full-stack']]
  const shown = entries.filter((e) => topic === 'all' || e.group === topic)
  return (
    <Layout page="writing" curtain="Writing" chat greeting="Want the short version of an article? Ask me." footerStyle="padding: 56px 0 36px; border-top: 1px solid var(--line)">
      <section id="top" className="dots" style={{ position: "relative", paddingTop: "168px", paddingBottom: "56px", borderBottom: "1px solid var(--line)" }}>
        <AIBackdrop kind="tokens" />
        <div className="wrap">
          <div className="fade" style={{ "--d": ".3s", display: "flex", justifyContent: "flex-end", gap: "24px", flexWrap: "wrap" }}>
            <span className="mono" style={{ color: "var(--muted)" }}>Shlok Bam / Portfolio 2026</span>
          </div>
          <h1 className="disp" aria-label="Journal" style={{ margin: "24px 0 0", fontSize: "min(clamp(72px, 15vw, 226px), calc((100vw - 80px) / 5.46))", fontStretch: "100%" }}>
            <span className="mask" style={{ whiteSpace: "nowrap" }}>
              {title.map((l, l_i) => (
                <span key={l_i} className="ltr" aria-hidden="true" style={css(l.style)}>{l.ch}</span>
              ))}
              <span className="ltr" aria-hidden="true" style={{ "--i": "7", color: "var(--accent)" }}>.</span>
            </span>
          </h1>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "32px", flexWrap: "wrap", marginTop: "32px" }}>
            <p className="serif fade" style={{ "--d": ".6s", margin: "0", fontSize: "clamp(28px, 3vw, 44px)", maxWidth: "760px", lineHeight: "1.1" }}>Build logs from the things that went wrong.</p>
            <A className="btn mono fade" href="https://journal-murex-three.vercel.app/journal" style={{ "--d": ".7s", border: "1px solid var(--text)" }}>
              Open the journal{" "}
              <svg className="arr" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
            </A>
          </div>
          <div className="rule" style={{ marginTop: "44px" }} />
          <div className="mono fade" style={{ "--d": ".8s", display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", marginTop: "14px", color: "var(--muted)" }}>
            <span>{entries.length} entries</span>
            <span>Agents · RAG · MCP · DevOps</span>
            <span>2026</span>
          </div>
        </div>
      </section>
      <section style={{ padding: "72px 0 112px" }}>
        <div className="wrap">
          <div role="group" aria-label="Filter entries" className="wfilters">
            {TOPICS.map(([id, label]) => (
              <button key={id} type="button" className={'wchip mono' + (topic === id ? ' on' : '')} aria-pressed={topic === id} onClick={() => setTopic(id)}>
                {label} <span style={{ opacity: '.6' }}>{id === 'all' ? entries.length : entries.filter((e) => e.group === id).length}</span>
              </button>
            ))}
          </div>
          <div style={{ borderTop: "1px solid var(--text)", marginTop: "28px" }}>
            {shown.map((e, e_i) => (
              <A key={e.href} className="entry" href={e.href}>
                <span className="ebg" aria-hidden="true" />
                {" "}
                <span className="disp enum" style={{ fontSize: "clamp(44px, 5vw, 76px)" }}>{e.n}</span>
                {" "}
                <div>
                  <div className="mono" style={{ display: "flex", gap: "18px", color: "var(--muted)" }}>
                    <span>{e.date}</span>
                    <span style={{ color: "var(--accent)" }}>{e.tag}</span>
                    <span>Journal</span>
                  </div>
                  <div className="etitle" style={{ marginTop: "10px", fontSize: "clamp(20px, 2.1vw, 30px)", fontWeight: "650", letterSpacing: "-.025em", lineHeight: "1.12" }}>{e.title}</div>
                  <p style={{ margin: "10px 0 0", color: "var(--muted)", fontSize: "16px", lineHeight: "1.55", maxWidth: "760px" }}>{e.blurb}</p>
                </div>
                {" "}
                <span className="ecircle hide-sm" style={{ justifySelf: "end", width: "60px", height: "60px", borderRadius: "50%", border: "1px solid var(--text)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </A>
            ))}
          </div>
        </div>
      </section>
      {" "}
      <A className="next" href="/contact" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="wrap" style={{ paddingTop: "26px", paddingBottom: "26px" }}>
          <div className="mono nmuted" style={{ color: "var(--muted)" }}>Next page</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "24px", marginTop: "8px" }}>
            <span className="disp nt" style={{ fontSize: "clamp(26px, 3vw, 46px)" }}>Contact</span>
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
