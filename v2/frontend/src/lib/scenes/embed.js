// About: skills as points in an embedding space. A small force simulation pulls each skill
// toward its cluster centroid (k = 4) while points repel each other; every few seconds the
// projection is re-fit and the clusters migrate to new positions.
import { rng, rgba, MONO, band } from './util.js'

const CLUSTERS = [
  ['GenAI', ['LangGraph', 'LangChain', 'RAG', 'MCP', 'Agents', 'Tools', 'Prompts', 'HF']],
  ['Evals', ['LLM-judge', 'DeepEval', 'GEval', 'Guardrails', 'LangSmith', 'Golden set']],
  ['Web', ['FastAPI', 'React', 'Pydantic', 'REST', 'Postgres', 'MySQL']],
  ['Cloud', ['Docker', 'Terraform', 'AWS', 'Jenkins', 'Actions', 'Git']]
]

export default function create(env) {
  const R = rng(404)
  const pts = []
  CLUSTERS.forEach(([, items], c) => items.forEach((label, i) => {
    if (env.mobile && i > 2) return
    pts.push({ label, c, x: 0, y: 0, vx: 0, vy: 0 })
  }))
  let centers = [], region = null, nextFit = 0, fits = 0, rot = 0

  function layout(e) {
    region = e.mobile
      ? { x0: 24, x1: e.w - 24, y0: band(e).y0 + 6, y1: band(e).y1 + 6 }
      : { x0: e.w * 0.52, x1: e.w * 0.97, y0: e.h * 0.36, y1: e.h * 0.74 }
    // a new "projection": the 2×2 cluster layout rotates one step, with a little jitter
    const base = [[0.22, 0.26], [0.74, 0.24], [0.76, 0.74], [0.24, 0.76]]
    const slots = base.map((_, i) => base[(i + rot) % 4])
    rot++
    centers = slots.map(([fx, fy]) => ({
      x: region.x0 + (region.x1 - region.x0) * (fx + (R() - 0.5) * 0.12),
      y: region.y0 + (region.y1 - region.y0) * (fy + (R() - 0.5) * 0.12)
    }))
  }

  function resize(e) {
    layout(e)
    for (const p of pts) if (!p.x) { p.x = region.x0 + R() * (region.x1 - region.x0); p.y = region.y0 + R() * (region.y1 - region.y0) }
  }

  function frame(e, t) {
    const { ctx, colors } = e
    if (t > nextFit) { if (fits++) layout(e); nextFit = t + 10000 }
    // forces: spring to centroid + pairwise repulsion
    for (const p of pts) {
      const c = centers[p.c]
      p.vx += (c.x - p.x) * 0.005; p.vy += (c.y - p.y) * 0.005
      for (const q of pts) {
        if (q === p) continue
        const dx = p.x - q.x, dy = p.y - q.y, d2 = dx * dx + dy * dy + 30
        if (d2 < 9000) { const f = 18 / d2; p.vx += dx * f; p.vy += dy * f }
      }
      p.vx *= 0.86; p.vy *= 0.86
      p.x = Math.min(region.x1 - 60, Math.max(region.x0, p.x + p.vx))
      p.y = Math.min(region.y1, Math.max(region.y0, p.y + p.vy))
    }
    // assignment lines and points
    ctx.lineWidth = 1
    for (const p of pts) {
      const c = centers[p.c]
      const d = Math.hypot(c.x - p.x, c.y - p.y)
      ctx.strokeStyle = rgba(colors.muted2, Math.max(0.03, 0.2 - d / 900))
      ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(p.x, p.y); ctx.stroke()
    }
    ctx.font = `10px ${MONO}`
    ctx.textAlign = 'left'
    for (const p of pts) {
      ctx.fillStyle = rgba(p.c === 0 ? colors.accent : colors.muted, p.c === 0 ? 0.8 : 0.6)
      ctx.beginPath(); ctx.arc(p.x, p.y, 2.6, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = rgba(colors.muted2, 0.75)
      ctx.fillText(p.label, p.x + 6, p.y + 3)
    }
    centers.forEach((c, i) => {
      ctx.strokeStyle = rgba(colors.accent, 0.5)
      ctx.beginPath(); ctx.moveTo(c.x - 5, c.y); ctx.lineTo(c.x + 5, c.y); ctx.moveTo(c.x, c.y - 5); ctx.lineTo(c.x, c.y + 5); ctx.stroke()
      ctx.fillStyle = rgba(colors.accent, 0.75)
      ctx.fillText(CLUSTERS[i][0].toUpperCase(), c.x + 8, c.y - 8)
    })
    ctx.fillStyle = rgba(colors.muted2, 0.7)
    ctx.textAlign = 'right'
    if (!e.mobile) { const b = band(e); ctx.fillText('embedding space · k-means k=4', b.x1, b.y0 + 14); ctx.fillText(`${pts.length} skills · re-fit every 10 s`, b.x1, b.y0 + 30) }
  }

  return { resize, frame, settle: 260 }
}
