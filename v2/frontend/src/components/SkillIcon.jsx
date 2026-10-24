import {
  siPython, siLanggraph, siLangchain, siFastapi, siReact, siModelcontextprotocol, siHuggingface,
  siPostgresql, siDocker, siGithubactions, siTerraform, siJenkins, siMysql, siPydantic, siJavascript,
  siOpenjdk, siCplusplus, siFlask, siFirebase, siGit, siGooglegemini, siMistralai
} from 'simple-icons'

// Monochrome brand marks (simple-icons, CC0) for the About page toolkit; anything without a
// mark gets a short text badge instead.
const ICONS = {
  Python: siPython, LangGraph: siLanggraph, LangChain: siLangchain, FastAPI: siFastapi, React: siReact,
  MCP: siModelcontextprotocol, 'Hugging Face': siHuggingface, PostgreSQL: siPostgresql, Docker: siDocker,
  'GH Actions': siGithubactions, 'GitHub Actions': siGithubactions, Terraform: siTerraform, Jenkins: siJenkins,
  MySQL: siMysql, Pydantic: siPydantic, JavaScript: siJavascript, Java: siOpenjdk, 'C++': siCplusplus,
  Flask: siFlask, Firebase: siFirebase, Git: siGit, Gemini: siGooglegemini, 'Mistral AI': siMistralai
}

const BADGES = {
  RAG: 'RAG', 'Multi-agent': 'MAS', 'Multi-agent systems': 'MAS', 'LLM-as-judge': 'J', LangSmith: 'LS', DeepEval: 'DE',
  Transformers: 'TF', SQL: 'SQL', Embeddings: 'EMB', AWS: 'AWS', Chroma: 'CH', Guardrails: 'GR', NLP: 'NLP', DSA: 'DSA'
}

export function hasIcon(name) { return !!ICONS[name] }

export default function SkillIcon({ name, size = 24 }) {
  const ic = ICONS[name]
  if (ic) {
    return (
      <svg className="sk-ic" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={ic.hex === '000000' ? undefined : { '--brand': '#' + ic.hex }}>
        <path d={ic.path} />
      </svg>
    )
  }
  const t = BADGES[name] || name.slice(0, 2).toUpperCase()
  return <span className="sk-badge mono" aria-hidden="true" style={{ fontSize: Math.round(size * (t.length > 2 ? 0.42 : 0.55)) + 'px' }}>{t}</span>
}
