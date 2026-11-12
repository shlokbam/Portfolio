// Open source: Shlok's pull requests to other people's repositories, found automatically on GitHub.
// The build saves a snapshot (scripts/opensource.mjs -> opensource.snapshot.json); the site and the MCP
// server refresh it live from the API (backend /api/opensource). Nothing here needs updating for new PRs.
// Edit only to curate: `skip` leaves a repository out (list submissions aren't code), `notes` adds one line
// to a pull request (keyed by its URL), `pin` puts repositories first.
// Part of the site's content: the build publishes it in /portfolio.json.
import SNAPSHOT from './opensource.snapshot.json'

export const OSS = {
  skip: ['emmabostian/developer-portfolios', 'punkpeye/awesome-remote-mcp-servers'],
  notes: {},
  pin: []
}

export { SNAPSHOT as OSS_SNAPSHOT }

const RANK = { merged: 0, open: 1, closed: 2 }
const t = (iso) => (iso ? new Date(iso).getTime() : 0)

// {prs, repos} from GitHub -> what the site shows: totals, and repositories (merged work first) with their PRs
export function ossView(data) {
  const skip = new Set(OSS.skip.map((s) => s.toLowerCase()))
  const prs = ((data && data.prs) || []).filter((p) => !skip.has(p.repo.toLowerCase()))
  const byRepo = new Map()
  for (const p of prs) {
    if (!byRepo.has(p.repo)) byRepo.set(p.repo, [])
    byRepo.get(p.repo).push({ ...p, note: OSS.notes[p.url] || '' })
  }
  const repos = [...byRepo].map(([name, list]) => {
    list.sort((a, b) => RANK[a.state] - RANK[b.state] || t(b.created) - t(a.created))
    const info = (data.repos && data.repos[name]) || {}
    return {
      name, owner: name.split('/')[0], short: name.split('/')[1], url: info.url || 'https://github.com/' + name,
      stars: info.stars, description: info.description || '', prs: list,
      merged: list.filter((p) => p.state === 'merged').length, latest: Math.max(...list.map((p) => t(p.merged || p.created)))
    }
  })
  const pinned = (r) => { const i = OSS.pin.indexOf(r.name); return i === -1 ? Infinity : i }
  repos.sort((a, b) => pinned(a) - pinned(b) || (b.merged > 0) - (a.merged > 0) || b.latest - a.latest)
  const count = (s) => prs.filter((p) => p.state === s).length
  const lastMerged = prs.filter((p) => p.merged).sort((a, b) => t(b.merged) - t(a.merged))[0] || null
  return { repos, total: prs.length, merged: count('merged'), open: count('open'), closed: count('closed'), lastMerged, updated: data && data.updated }
}

// stars: 15724 -> '15.7k'
export const stars = (n) => (n == null ? '' : n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'k' : String(n))

// '2026-11-10T…' -> '10 Nov 2026' (fixed format, so prerendered pages don't change from day to day)
export function ossDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.getUTCDate() + ' ' + ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getUTCMonth()] + ' ' + d.getUTCFullYear()
}
