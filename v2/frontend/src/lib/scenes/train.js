// Journey: a training run whose "epochs" are the years. Train and validation loss are drawn
// as they're computed (exponential decay + noise), with checkpoints at each chapter.
import { rng, rgba, MONO, band } from './util.js'

const CHECKPOINTS = [[0, 'school'], [0.52, 'VIT Pune'], [0.7, 'ITSA chair'], [0.92, 'PharmaACE']]
const YEARS = [[0, '2010'], [0.5, '2023'], [0.66, '2024'], [0.8, '2025'], [0.96, '2026']]

// x position (0..1) -> calendar year, interpolated between the axis labels
function yearAt(u) {
  const pts = YEARS.map(([x, y]) => [x, +y]).concat([[1, 2026]])
  for (let i = 1; i < pts.length; i++) {
    if (u <= pts[i][0]) { const [xa, ya] = pts[i - 1], [xb, yb] = pts[i]; return Math.round(ya + ((yb - ya) * (u - xa)) / (xb - xa)) }
  }
  return 2026
}

export default function create(env) {
  let R = rng(2026), train = [], val = [], start = 0, region = null
  const N = 220

  function sample() {
    train = []; val = []
    let a = 0, b = 0
    for (let i = 0; i <= N; i++) {
      const x = i / N
      a = 0.75 * a + 0.25 * (R() - 0.5); b = 0.8 * b + 0.2 * (R() - 0.5)
      train.push(0.12 + 0.82 * Math.exp(-x / 0.24) + a * 0.06)
      val.push(0.17 + 0.8 * Math.exp(-x / 0.27) + b * 0.07 + Math.max(0, x - 0.85) * 0.12)
    }
  }

  function resize(e) {
    const b = band(e)
    region = e.mobile
      ? { x0: b.x0 + 4, x1: b.x1, y0: b.y0 + 4, y1: b.y1 - 12, cap: b.x1 }
      : { x0: e.w * 0.3, x1: e.w * 0.74, y0: b.y0 + 4, y1: b.y1 - 12, cap: b.x1 }
    if (!train.length) sample()
  }

  function frame(e, t) {
    const { ctx, colors } = e
    if (!start) start = t
    const dur = 13000, hold = 2600
    let p = (t - start) / dur
    if (p > 1 + hold / dur) { R = rng(Math.floor(t)); sample(); start = t; p = 0 }
    p = Math.min(1, p)
    const { x0, x1, y0, y1 } = region
    const X = (u) => x0 + (x1 - x0) * u, Y = (v) => y1 - (y1 - y0) * Math.min(1, v)

    ctx.lineWidth = 1
    ctx.strokeStyle = rgba(colors.muted2, 0.35)
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke()
    ctx.font = `10px ${MONO}`
    ctx.fillStyle = rgba(colors.muted2, 0.8)
    ctx.textAlign = 'center'
    for (const [u, label] of YEARS) if (!e.mobile || u === 0 || u > 0.9) ctx.fillText(label, X(u), y1 + 12)

    const n = Math.floor(p * N)
    const line = (arr, color, alpha, dash) => {
      ctx.setLineDash(dash); ctx.strokeStyle = rgba(color, alpha); ctx.lineWidth = 1.5
      ctx.beginPath()
      for (let i = 0; i <= n; i++) { const x = X(i / N), y = Y(arr[i]); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y) }
      ctx.stroke(); ctx.setLineDash([])
    }
    line(val, colors.muted, 0.5, [4, 4])
    line(train, colors.accent, 0.85, [])

    for (const [u, label] of CHECKPOINTS) {
      if (u > p) continue
      const i = Math.round(u * N), x = X(u), y = Y(train[i])
      ctx.fillStyle = rgba(colors.bg, 1); ctx.strokeStyle = rgba(colors.accent, 0.8)
      ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
      ctx.fillStyle = rgba(colors.muted2, 0.85); ctx.textAlign = 'left'
      if (!e.mobile) ctx.fillText(label, x + 6, y - 6)
    }
    const hx = X(n / N), hy = Y(train[n])
    ctx.fillStyle = rgba(colors.accent, 0.95)
    ctx.beginPath(); ctx.arc(hx, hy, 3, 0, Math.PI * 2); ctx.fill()
    ctx.textAlign = 'right'; ctx.fillStyle = rgba(colors.muted2, 0.85)
    if (e.mobile) ctx.fillText(`epoch ${yearAt(p)} · loss ${train[n].toFixed(3)}`, region.cap, y0 + 2)
    else {
      ctx.fillText('training run · train ── val ╌╌', region.cap, y0 + 14)
      ctx.fillText(`epoch ${yearAt(p)} · loss ${train[n].toFixed(3)}`, region.cap, y0 + 30)
    }
  }

  return { resize, frame, settle: 400 }
}
