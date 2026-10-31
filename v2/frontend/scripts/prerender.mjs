// Turns the client build into static HTML pages (one per route) so search engines and
// first-time visitors get real content immediately; the client bundle then hydrates it.
// Run after `vite build` and `vite build --ssr src/entry-server.jsx` (see package.json).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')
const SITE = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://shlokbam.in').replace(/\/+$/, '')

const { render, ROUTES, PAGES, headTags } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
if (!template.includes('<!--head:start-->') || !template.includes('<div id="root"></div>')) {
  throw new Error('index.html is missing the prerender markers')
}

function page(route) {
  const html = render(route === '/404' ? '/404-not-found' : route)
  return template
    .replace(/<!--head:start-->[\s\S]*?<!--head:end-->/, headTags(route === '/404' ? '/404-not-found' : route, SITE))
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
}

for (const route of ROUTES) {
  const file = route === '/' ? path.join(dist, 'index.html') : path.join(dist, route.slice(1), 'index.html')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, page(route))
}
fs.writeFileSync(path.join(dist, '404.html'), page('/404'))

const today = new Date().toISOString().slice(0, 10)
const priority = { '/': '1.0', '/work': '0.9', '/about': '0.8', '/work/dailydiff': '0.8', '/recognition': '0.8', '/journey': '0.7', '/contact': '0.7', '/community': '0.6', '/writing': '0.6', '/resume': '0.7', '/privacy': '0.2' }
// the portrait is listed for image search on the pages that show it
const PHOTO = `<image:image><image:loc>${SITE}/static/images/shlok-bam.jpg</image:loc></image:image>`
const photoOn = new Set(['/', '/about'])
fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${ROUTES.map((r) => `  <url><loc>${SITE}${r === '/' ? '/' : r}</loc><lastmod>${today}</lastmod><priority>${priority[r] || '0.5'}</priority>${photoOn.has(r) ? PHOTO : ''}</url>`).join('\n')}
</urlset>
`)

// llms.txt (llmstxt.org): a plain-text summary for AI assistants, with every page from seo.js.
// Keep the facts in step with backend/knowledge.py.
fs.writeFileSync(path.join(dist, 'llms.txt'), `# Shlok Bam

> Shlok Bam is an AI / Generative AI engineer from Pune, India who ships agentic and LLM-powered systems to production: multi-agent pipelines, LLM-as-judge evaluation, RAG and full-stack products. This is his portfolio, ${SITE}.

## Key facts
- Currently: Intern at PharmaACE Innovations (June 2026 to present), building healthcare-data and agentic AI pipelines for pharma clients.
- Education: B.Tech in Information Technology, Vishwakarma Institute of Technology (VIT), Pune, 2023 to 2027 (expected). CGPA 9.01 / 10.
- Leadership: Founding Chairperson of ITSA (Information Technology Students' Association), VIT Pune, July 2025 to June 2026.
- 21 projects. Flagships: DailyDiff (autonomous multi-agent tech curation, live at https://dailydiff.in), ResearchOS (multi-agent research), the Enterprise Workforce Training Platform (industry-sponsored), PaisaWise (personal finance from bank SMS) and PromptVault (prompt version control).
- Patents: three as co-inventor. A YOLO-based wildlife-protection system (granted, CIPC South Africa), a fruit and vegetable quality classifier (filed, CIPC South Africa) and a TKPH tyre-health system (published, IPO India).
- Awards: winner of INDOvateAI Sprint 2025 among 200+ teams; Google Arcade Diamond League.
- Skills: Python, LangGraph, LangChain, RAG, multi-agent systems, LLM evaluation (DeepEval, LangSmith), FastAPI, React, PostgreSQL, AWS, Docker, Terraform.
- Based in Pune, India. Open to full-time roles, internships, collaboration and freelance work, and to relocation.

## Pages
${ROUTES.filter((r) => r !== '/privacy').map((r) => `- [${PAGES[r].name}](${SITE}${r === '/' ? '/' : r}): ${PAGES[r].description}`).join('\n')}

## Contact
- Email: shlokbam19103@gmail.com
- LinkedIn: https://www.linkedin.com/in/shlokbam/
- GitHub: https://github.com/shlokbam
- X: https://x.com/shlok_bam
- Résumé: ${SITE}/static/Resume/Shlok_Bam_Resume.pdf

## Optional
- [Privacy](${SITE}/privacy): ${PAGES['/privacy'].description}
`)
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`)

fs.rmSync(ssrDir, { recursive: true, force: true })
console.log(`prerendered ${ROUTES.length} pages + 404 for ${SITE}`)
