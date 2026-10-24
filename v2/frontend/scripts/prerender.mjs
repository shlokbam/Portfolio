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

const { render, ROUTES, headTags } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)
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
const priority = { '/': '1.0', '/work': '0.9', '/about': '0.8', '/work/dailydiff': '0.8', '/recognition': '0.8', '/journey': '0.7', '/contact': '0.7', '/community': '0.6', '/writing': '0.6', '/privacy': '0.2' }
fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map((r) => `  <url><loc>${SITE}${r === '/' ? '/' : r}</loc><lastmod>${today}</lastmod><priority>${priority[r] || '0.5'}</priority></url>`).join('\n')}
</urlset>
`)
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`)

fs.rmSync(ssrDir, { recursive: true, force: true })
console.log(`prerendered ${ROUTES.length} pages + 404 for ${SITE}`)
