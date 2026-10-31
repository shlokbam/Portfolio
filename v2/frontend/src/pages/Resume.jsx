import Layout from '../components/Layout'
import A from '../components/A'
import './Home.css'
import './Resume.css'

// The résumé as a plain web page: the same words as the PDF, in one column of real headings,
// lists and links, so search engines and applicant-tracking systems can read it. It prints as a
// clean page too. Keep in step with public/static/Resume/Shlok_Bam_Resume.pdf.
const PDF = '/static/Resume/Shlok_Bam_Resume.pdf'
const JOURNAL = 'https://journal-murex-three.vercel.app/journal/'

const EXPERIENCE = [
  {
    role: 'Intern', org: 'PharmaACE Innovations', when: 'June 2026 – Present',
    points: [
      'Engineered an NPI matching pilot (Python, Streamlit, Snowpark, rapidfuzz) for a Fortune 500 pharma client; auto-accepted 94% (163 of 174) of a real test batch and sent 11 records for review or rejection.',
      'Developed a News Monitor pilot (Python, FastAPI, React, Playwright) tracking 1,200+ pharma newsrooms on a 30-minute schedule with a no-LLM scan and a GPT-4o-mini source-validation judge.',
      'Currently building a Forecast Reporting Agent (Python, FastAPI, LLMs) that converts natural-language questions into SQL with execution-based validation, LLM self-correction and chart recommendations.'
    ]
  }
]

const LEADERSHIP = [
  {
    role: 'Chairperson', org: "Information Technology Students' Association (ITSA), VIT Pune", when: 'July 2025 – June 2026',
    points: ['Led a 50+ member student team as Chairperson; organised a department-wide AI workshop (500+ attendees), mock GD/PIs and an INR 1 lakh-budget event; built a QR attendance system used at an event with 750+ attendees.']
  }
]

const PROJECTS = [
  {
    name: 'Enterprise Workforce Training Platform',
    links: [['GitHub', 'https://github.com/shlokbam/lms'], ['Blog', JOURNAL + 'i-built-an-enterprise-lms-with-local-cloud-devops-from-scratch-here-s-everything-that-went-wrong']],
    points: [
      'Developed a cross-platform LMS with role-based dashboards for trainers and trainees (module creation, scheduling, assessments, progress tracking), delivered as a containerised React web app (Docker Compose).',
      'Provisioned cloud storage with Terraform, secured routes with JWT/bcrypt, added server-side PDF/video watermarking per trainee, and configured a Jenkins CI/CD pipeline.'
    ],
    tech: 'Python, FastAPI, SQLAlchemy, MySQL, ReactJS, React Native, Docker, Terraform, AWS S3, Jenkins'
  },
  {
    name: 'DailyDiff: Autonomous Multi-Agent Tech Curation Platform',
    links: [['Live', 'https://dailydiff.in/'], ['GitHub', 'https://github.com/shlokbam/DailyDiff'], ['Blog', JOURNAL + 'i-built-dailydiff-an-autonomous-multi-agent-tech-research-editorial-team'], ['Case study', '/work/dailydiff']],
    points: [
      'Built DailyDiff (dailydiff.in), a live LangGraph pipeline over 7 sources that emails a fact-checked brief 3x/week (185 briefs, 42 editions); cut LLM calls from up to 22 to 4, added a fail-closed publish gate.',
      'Per-agent evals, 3 runs (25 golden cases): Skeptic rejected 6-7/7 noise items (3/7 pre-fix), Verifier caught 14-15/16 bad items, Analyst matched 13-14/15 verdicts, Editor 5/5 briefs passed structure checks.'
    ],
    tech: 'Python, LangGraph, LangChain, FastAPI, Mistral AI, Gemini, PostgreSQL (Neon), React, Vite, GitHub Actions, Brevo API'
  }
]

const SKILLS = [
  ['Languages', 'Python, SQL, JavaScript'],
  ['GenAI Frameworks', 'LangChain, LangGraph, Hugging Face, MCP'],
  ['GenAI Techniques', 'RAG, Multi-Agent Systems, Tool/Function Calling, Prompt Engineering'],
  ['LLM Evaluation & Safety', 'LLM-as-Judge, Golden-Dataset Evaluation, DeepEval, GEval, Guardrails, LangSmith'],
  ['Machine Learning', 'Deep Learning, NLP, Transformers, Embeddings'],
  ['Web Development', 'FastAPI, Pydantic, REST APIs, React'],
  ['Databases', 'PostgreSQL, MySQL, Chroma (Vector DB)'],
  ['Cloud & DevOps', 'AWS, Docker, Terraform, Jenkins, GitHub Actions, Git'],
  ['Core CS', 'DSA, OOP, DBMS, OS']
]

function Role({ r }) {
  return (
    <div className="rs-item">
      <div className="rs-line">
        <h3><b>{r.role}</b> at {r.org}</h3>
        <span className="rs-when">{r.when}</span>
      </div>
      <ul>{r.points.map((p) => <li key={p}>{p}</li>)}</ul>
    </div>
  )
}

export default function Resume() {
  return (
    <Layout page="home" chat footerStyle="padding: 56px 0 36px; border-top: 1px solid var(--line)">
      <section id="top" className="dots rs-hero" style={{ position: 'relative', paddingTop: '190px', paddingBottom: '64px', borderBottom: '1px solid var(--line)' }}>
        <div className="wrap">
          <span className="mono" style={{ color: 'var(--muted)' }}>Web version · same as the PDF</span>
          <div className="mask" style={{ marginTop: '24px' }}>
            <span className="rise disp" style={{ '--d': '.1s', display: 'block', fontSize: 'clamp(48px, 13vw, 200px)', lineHeight: '.9' }}>Résumé<span style={{ color: 'var(--accent)' }}>.</span></span>
          </div>
          <div className="fade" style={{ '--d': '.4s', display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '32px' }}>
            <A className="btn mono" href={PDF} style={{ background: 'var(--accent)', color: 'var(--onaccent)' }}>Download PDF ↓</A>
            <button type="button" className="btn mono" onClick={() => window.print()} style={{ border: '1px solid var(--line)', background: 'transparent', color: 'var(--text)', cursor: 'pointer' }}>Print</button>
          </div>
        </div>
      </section>

      <section style={{ padding: '72px 0 110px' }}>
        <div className="wrap">
          <article className="rs-paper">
            <header className="rs-top">
              <h1>Shlok Bam</h1>
              <p className="rs-title">AI / Generative AI Engineer</p>
              <p className="rs-contact">
                <A href="mailto:shlokbam19103@gmail.com">shlokbam19103@gmail.com</A> | <A href="tel:+917974670370">+91-7974670370</A> | Pune, India | <A href="https://github.com/shlokbam">github.com/shlokbam</A> | <A href="https://www.linkedin.com/in/shlokbam/">linkedin.com/in/shlokbam</A> | <A href="/">shlokbam.in</A>
              </p>
            </header>

            <h2>Summary</h2>
            <p>AI/Generative AI engineer with hands-on experience shipping agentic and LLM-powered systems to production, from multi-agent pipelines to LLM-as-judge evaluation frameworks, alongside full-stack (React/FastAPI) and DevOps (Docker/Terraform) delivery. Currently interning at PharmaACE on healthcare data and agentic AI pipelines.</p>

            <h2>Experience</h2>
            {EXPERIENCE.map((r) => <Role key={r.org} r={r} />)}

            <h2>Leadership &amp; Activities</h2>
            {LEADERSHIP.map((r) => <Role key={r.org} r={r} />)}

            <h2>Projects</h2>
            {PROJECTS.map((p) => (
              <div key={p.name} className="rs-item">
                <div className="rs-line">
                  <h3><b>{p.name}</b></h3>
                  <span className="rs-when rs-links">{p.links.map(([label, href], i) => <span key={label}>{i ? ' | ' : '('}<A href={href}>{label}</A></span>)})</span>
                </div>
                <ul>
                  {p.points.map((x) => <li key={x}>{x}</li>)}
                  <li><i>Technologies:</i> {p.tech}</li>
                </ul>
              </div>
            ))}
            <p className="rs-more">19 more projects, with live demos and code, are on the <A href="/work">Work page</A>.</p>

            <h2>Skills</h2>
            <ul className="rs-skills">
              {SKILLS.map(([k, v]) => <li key={k}><b>{k}:</b> {v}</li>)}
            </ul>

            <h2>Education</h2>
            <div className="rs-item">
              <div className="rs-line">
                <h3><b>B.Tech, Information Technology</b> at Vishwakarma Institute of Technology, Pune, India</h3>
                <span className="rs-when">Sept 2023 – May 2027 (Expected)</span>
              </div>
              <ul><li>CGPA: 9.01/10</li></ul>
            </div>

            <h2>Academic &amp; Extracurricular Achievements</h2>
            <ul>
              <li>Winner, INDOvateAI Sprint 2025: Best Outstanding Project among 200+ teams.</li>
            </ul>
          </article>
        </div>
      </section>
    </Layout>
  )
}
