// The Writing page (pages/Writing.jsx): journal entries, newest first. `group` drives the topic filter
// (ai, devops, web). Part of the site's content: the build publishes it in /portfolio.json.
export const POSTS = [
  {
    date: 'Sep 2026',
    tag: 'RAG',
    group: 'ai',
    title: 'Building generative AI apps with LangChain: document loaders, text splitters, ChromaDB and LCEL',
    blurb: 'Hands-on RAG practice: loaders, splitters, ChromaDB vector stores and LCEL runnables.',
    href: 'https://journal-murex-three.vercel.app/journal/building-generative-ai-apps-langchain-document-loaders-chromadb-lcel'
  },
  {
    date: 'Sep 2026',
    tag: 'LLMOps',
    group: 'ai',
    title: 'My LangSmith learning log: tracing, debugging and optimising LLM chains and RAG pipelines',
    blurb: 'Tracking prompts, latency and token costs in LangSmith, and tuning a PDF RAG pipeline over 4 iterations.',
    href: 'https://journal-murex-three.vercel.app/journal/my-langsmith-learning-log-tracing-debugging-optimizing-llm-chains-rag'
  },
  {
    date: 'Aug 2026',
    tag: 'Agents',
    group: 'ai',
    title: 'Hands-on agentic AI with LangGraph: sequential, parallel and conditional state workflows',
    blurb: 'Stateful LangGraph workflows, from parallel essay graders to equation solvers and sentiment routers.',
    href: 'https://journal-murex-three.vercel.app/journal/hands-on-agentic-ai-langgraph-sequential-parallel-conditional-workflows'
  },
  {
    date: 'Aug 2026',
    tag: 'MCP',
    group: 'ai',
    title: 'Exploring the Model Context Protocol: AI tools, Streamlit clients and emailmd assistants',
    blurb: 'Custom FastMCP servers, emailmd API tools and an interactive Streamlit chatbot client.',
    href: 'https://journal-murex-three.vercel.app/journal/exploring-model-context-protocol-mcp-ai-tools-streamlit-emailmd'
  },
  {
    date: 'Aug 2026',
    tag: 'DevOps',
    group: 'devops',
    title: 'My 7-day DevOps lab: learning Terraform, Ansible and HashiCorp Vault by building real infrastructure',
    blurb: 'From clicking around the AWS console to Terraform modules, S3 state locking, Ansible playbooks and Vault secrets.',
    href: 'https://journal-murex-three.vercel.app/journal/my-7-day-devops-lab-terraform-ansible-hashicorp-vault'
  },
  {
    date: 'Jul 2026',
    tag: 'Architecture',
    group: 'web',
    title: 'Designing a real-time inventory system with FIFO stock reduction, PDF invoicing and Telegram webhooks',
    blurb: 'FIFO batch allocation, concurrency-safe PostgreSQL transactions, ReportLab invoices and instant Telegram alerts.',
    href: 'https://journal-murex-three.vercel.app/journal/designing-a-real-time-enterprise-inventory-system-with-fifo-stock-reduction-automated-pdf-invoicing-and-telegram-webhooks'
  },
  {
    date: 'Jun 2026',
    tag: 'Agents',
    group: 'ai',
    title: 'I built DailyDiff: an autonomous multi-agent tech research and editorial team',
    blurb: 'How the LangGraph editorial pipeline filters technical noise into sharp 5-point developer briefs.',
    href: 'https://journal-murex-three.vercel.app/journal/i-built-dailydiff-an-autonomous-multi-agent-tech-research-editorial-team'
  },
  {
    date: 'May 2026',
    tag: 'Agents',
    group: 'ai',
    title: 'Building an autonomous multi-agent research and fact-auditing system with LangChain, Mistral and RAG',
    blurb: 'An async pipeline that crawls the web, cleans pages, drafts reports, audits facts and indexes vectors in Pinecone.',
    href: 'https://journal-murex-three.vercel.app/journal/building-an-autonomous-multi-agent-ai-research-fact-auditing-system-with-langchain-mistral-and-rag'
  },
  {
    date: 'Apr 2026',
    tag: 'Full-stack',
    group: 'web',
    title: 'Building Eagle LMS: leading an industry-sponsored full-stack project from napkin to production',
    blurb: 'Leading a team of five on a dual-role web and React Native app with dynamic watermarking and phase-based unlocking.',
    href: 'https://journal-murex-three.vercel.app/journal/i-built-an-enterprise-lms-with-local-cloud-devops-from-scratch-here-s-everything-that-went-wrong'
  },
  {
    date: 'Apr 2026',
    tag: 'AI & React',
    group: 'ai',
    title: 'I built an AI-powered mock interview platform: everything that went wrong',
    blurb: 'The story of MockVue: AI feedback, live code execution and analytics, and every wrong turn on the way.',
    href: 'https://journal-murex-three.vercel.app/journal/i-built-an-ai-powered-mock-interview-platform-from-scratch-here-s-everything-that-went-wrong'
  },
  {
    date: 'Mar 2026',
    tag: 'AI & Flask',
    group: 'ai',
    title: 'I built an AI data analyst app from scratch: how I taught a Flask app to think',
    blurb: 'The build log behind AI Data Analyst: turning raw datasets into LLM-generated insights, charts and summaries.',
    href: 'https://journal-murex-three.vercel.app/journal/i-built-an-ai-data-analyst-app-from-scratch-here-s-how-i-taught-a-flask-app-to-think'
  },
  {
    date: 'Mar 2026',
    tag: 'DevOps',
    group: 'devops',
    title: 'I built a full DevOps CI/CD pipeline from scratch: everything that went wrong',
    blurb: 'Docker, Jenkins, Terraform and AWS EC2: what it actually took to ship a Flask app end to end.',
    href: 'https://journal-murex-three.vercel.app/journal/i-built-a-full-devops-ci-cd-pipeline-from-scratch-here-s-everything-that-went-wrong'
  }
]
