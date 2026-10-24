// Case study: DailyDiff's agent pipeline as a live message graph. Items stream in from the
// sources; the Skeptic and Verifier reject some (they drop away); the Editor batches the
// survivors into a brief that goes out to the inbox.
import { rng, rgba, MONO, band } from './util.js'

export default function create(env) {
  const R = rng(185)
  const names = ['Skeptic', 'Verifier', 'Analyst', 'Editor', 'Inbox']
  const sources = ['GitHub', 'HN', 'Dev.to', '+4']
  let src = [], stages = [], items = [], nextSpawn = 0, batch = 0, briefs = 185, flash = 0, region = null

  function resize(e) {
    const b = band(e)
    region = { x0: e.mobile ? b.x0 + 46 : e.w * 0.36, x1: e.mobile ? b.x1 - 10 : e.w * 0.8, y0: b.y0, y1: b.y1 }
    const { x0, x1, y0, y1 } = region
    const mid = y0 + (y1 - y0) * 0.38
    const cols = names.length + 1
    src = sources.map((n, i) => ({ n, x: x0, y: y0 + 4 + ((y1 - y0 - 8) * i) / (sources.length - 1) }))
    stages = names.map((n, i) => ({ n, x: x0 + ((x1 - x0) * (i + 1)) / (cols - 1), y: mid }))
  }

  function frame(e, t, dt) {
    const { ctx, colors } = e
    if (t > nextSpawn) {
      nextSpawn = t + 420
      const s = src[Math.floor(R() * src.length)]
      items.push({ x: s.x, y: s.y, from: s, to: 0, u: 0, dead: false, vy: 0, a: 1 })
    }
    ctx.lineWidth = 1
    ctx.strokeStyle = rgba(colors.muted2, 0.3)
    ctx.setLineDash([3, 5])
    ctx.beginPath()
    for (const s of src) { ctx.moveTo(s.x, s.y); ctx.lineTo(stages[0].x, stages[0].y) }
    for (let i = 0; i < stages.length - 1; i++) { ctx.moveTo(stages[i].x, stages[i].y); ctx.lineTo(stages[i + 1].x, stages[i + 1].y) }
    ctx.stroke()
    ctx.setLineDash([])

    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i]
      if (it.dead) {
        it.vy += 0.08; it.y += it.vy; it.a -= 0.025
        if (it.a <= 0) { items.splice(i, 1); continue }
        ctx.fillStyle = rgba(colors.muted, it.a * 0.6)
        ctx.fillRect(it.x - 2.5, it.y - 2.5, 5, 5)
        continue
      }
      const target = stages[it.to]
      it.u += dt / 900
      const a = it.from
      it.x = a.x + (target.x - a.x) * Math.min(1, it.u)
      it.y = a.y + (target.y - a.y) * Math.min(1, it.u)
      if (it.u >= 1) {
        const stage = names[it.to]
        if ((stage === 'Skeptic' && R() < 0.3) || (stage === 'Verifier' && R() < 0.12)) { it.dead = true; continue }
        if (stage === 'Editor') { batch++; if (batch >= 5) { batch = 0; items.push({ x: target.x, y: target.y, from: target, to: it.to + 1, u: 0, brief: true }) } items.splice(i, 1); continue }
        if (stage === 'Inbox') { briefs++; flash = t; items.splice(i, 1); continue }
        it.from = target; it.to++; it.u = 0
      }
      ctx.fillStyle = rgba(colors.accent, 0.85)
      if (it.brief) { ctx.fillRect(it.x - 5, it.y - 3.5, 10, 7) }
      else { ctx.beginPath(); ctx.arc(it.x, it.y, 2.6, 0, Math.PI * 2); ctx.fill() }
    }

    ctx.font = `10px ${MONO}`
    for (const s of src) {
      ctx.fillStyle = rgba(colors.muted2, 0.8); ctx.textAlign = 'right'
      ctx.fillText(s.n, s.x - 8, s.y + 3)
      ctx.beginPath(); ctx.arc(s.x, s.y, 3, 0, Math.PI * 2); ctx.fill()
    }
    stages.forEach((s, i) => {
      const glow = s.n === 'Inbox' && t - flash < 600
      ctx.fillStyle = rgba(colors.bg, 1)
      ctx.strokeStyle = rgba(glow ? colors.accent : colors.muted2, glow ? 0.9 : 0.55)
      ctx.beginPath(); ctx.arc(s.x, s.y, 9, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
      ctx.fillStyle = rgba(i < 4 ? colors.accent : colors.text, 0.8)
      ctx.beginPath(); ctx.arc(s.x, s.y, 3, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = rgba(colors.muted2, 0.85); ctx.textAlign = 'center'
      if (!e.mobile || i % 2 === 0 || i === stages.length - 1) ctx.fillText(s.n.toUpperCase(), s.x, s.y + 24)
    })
    if (!e.mobile) {
      ctx.textAlign = 'right'; ctx.fillStyle = rgba(colors.muted2, 0.85)
      const bx = e.w * 0.96
      ctx.fillText('live pipeline', bx, region.y0 + 14)
      ctx.fillText(`briefs ${briefs} · batch ${batch}/5`, bx, region.y0 + 30)
    }
  }

  return { resize, frame, settle: 160 }
}
