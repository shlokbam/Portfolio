// Before each build: fetch Shlok's pull requests to other people's repositories from GitHub and save them as
// src/content/opensource.snapshot.json, so the prerendered pages (and /portfolio.json) carry real data.
// The site and the API refresh it live (backend /api/opensource). If GitHub can't be reached, the last
// snapshot is kept and the build carries on. Optional: GITHUB_TOKEN raises GitHub's rate limit.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const USER = process.env.GITHUB_USER || 'shlokbam'
const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/content/opensource.snapshot.json')
const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'shlokbam-portfolio-build' }
if (process.env.GITHUB_TOKEN) headers.Authorization = 'Bearer ' + process.env.GITHUB_TOKEN

async function get(url) {
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(15000) })
  if (!res.ok) throw new Error(url + ' -> ' + res.status)
  return res.json()
}

async function main() {
  const q = encodeURIComponent(`author:${USER} type:pr -user:${USER}`)
  const found = await get(`https://api.github.com/search/issues?q=${q}&sort=created&order=desc&per_page=100`)
  const prs = found.items.map((it) => ({
    repo: it.repository_url.split('/repos/')[1],
    number: it.number,
    title: it.title,
    state: it.pull_request && it.pull_request.merged_at ? 'merged' : it.state === 'open' ? 'open' : 'closed',
    created: it.created_at,
    closed: it.closed_at,
    merged: (it.pull_request && it.pull_request.merged_at) || null,
    url: it.html_url
  }))
  // a lookup GitHub refuses (rate limit) keeps that repository's details from the last snapshot
  let before = {}
  try { before = JSON.parse(fs.readFileSync(OUT, 'utf8')).repos || {} } catch (e) {}
  const repos = {}
  let kept = 0
  for (const name of [...new Set(prs.map((p) => p.repo))]) {
    try {
      const r = await get('https://api.github.com/repos/' + name)
      repos[name] = { stars: r.stargazers_count, description: r.description || '', language: r.language || '', url: r.html_url }
    } catch (e) {
      kept++
      repos[name] = before[name] && before[name].stars != null ? before[name] : { stars: null, description: '', language: '', url: 'https://github.com/' + name }
    }
  }
  if (kept) console.warn(`open source: ${kept} repository lookups refused by GitHub, kept the last details`)
  fs.writeFileSync(OUT, JSON.stringify({ updated: new Date().toISOString(), prs, repos }, null, 2) + '\n')
  console.log(`open source: ${prs.length} pull requests across ${Object.keys(repos).length} repositories`)
}

main().catch((e) => {
  console.warn('open source: GitHub unavailable, keeping the last snapshot (' + e.message + ')')
  if (!fs.existsSync(OUT)) fs.writeFileSync(OUT, JSON.stringify({ updated: null, prs: [], repos: {} }, null, 2) + '\n')
})
