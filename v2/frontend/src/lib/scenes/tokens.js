// Writing: autoregressive text generation. Tokens appear one at a time; arcs show the new
// token's attention over the context (softmax of similarity + recency), and a small bar chart
// shows the candidate next tokens it sampled from.
import { rng, rgba, MONO, band } from './util.js'

const LINES = [
  ['shipped', 'the', 'agent', ',', 'then', 'it', 'broke', '.'],
  ['added', 'a', 'fail-closed', 'gate', 'before', 'publish', '.'],
  ['evals', 'caught', 'what', 'tests', 'missed', '.'],
  ['cut', 'LLM', 'calls', 'from', '22', 'to', '4', '.']
]
const DISTRACTORS = ['model', 'deploy', 'prompt', 'data', 'retry', 'cache', 'fix', 'log', 'judge', 'trace']

function hashVec(word) {
  const v = new Array(8).fill(0)
  for (let i = 0; i < word.length; i++) v[(word.charCodeAt(i) * (i + 3)) % 8] += 1
  const n = Math.hypot(...v) || 1
  return v.map((x) => x / n)
}

export default function create(env) {
  let R = rng(3), line = 0, shown = 0, nextAt = 0, holdUntil = 0, region = null, cands = []

  function resize(e) {
    const b = band(e)
    region = { x0: e.mobile ? b.x0 : e.w * 0.3, x1: e.mobile ? b.x1 : e.w * 0.66, y: b.y1 - 8, top: b.y0, cap: b.x1 }
  }

  function pickCandidates(word) {
    const others = DISTRACTORS.filter((d) => d !== word).sort(() => R() - 0.5).slice(0, 3)
    const logits = [2.2 + R(), ...others.map(() => R() * 1.6)]
    const ex = logits.map(Math.exp), s = ex.reduce((a, b) => a + b, 0)
    cands = [word, ...others].map((w, i) => ({ w, p: ex[i] / s }))
  }

  function frame(e, t) {
    const { ctx, colors } = e
    const words = LINES[line]
    if (!nextAt) { nextAt = t + 400; pickCandidates(words[0]) }
    if (holdUntil && t > holdUntil) { holdUntil = 0; line = (line + 1) % LINES.length; shown = 0; nextAt = t + 300; pickCandidates(LINES[line][0]) }
    else if (!holdUntil && t > nextAt) {
      shown++
      if (shown >= words.length) { holdUntil = t + 2600 } else { pickCandidates(words[shown]) }
      nextAt = t + 760
    }

    ctx.font = `13px ${MONO}`
    ctx.textAlign = 'left'
    // lay out tokens left to right
    const xs = []
    let x = region.x0
    for (let i = 0; i < words.length; i++) { xs.push(x); x += ctx.measureText(words[i]).width + 14 }
    const scale = Math.min(1, (region.x1 - region.x0) / (x - region.x0))
    const X = (i) => region.x0 + (xs[i] - region.x0) * scale
    const wid = (i) => ctx.measureText(words[i]).width * scale

    // attention from the newest token to the earlier ones
    const q = shown - 1
    if (q > 0) {
      const qv = hashVec(words[q])
      const logits = words.slice(0, q).map((w, j) => qv.reduce((s, v, k) => s + v * hashVec(w)[k], 0) * 2.5 + (j - q) * 0.15)
      const ex = logits.map(Math.exp), sum = ex.reduce((a, b) => a + b, 0)
      ex.forEach((v, j) => {
        const wgt = v / sum
        const xa = X(j) + wid(j) / 2, xb = X(q) + wid(q) / 2, top = Math.max(region.top, region.y - 22 - Math.abs(xb - xa) * 0.2)
        ctx.strokeStyle = rgba(colors.accent, 0.12 + wgt * 0.8); ctx.lineWidth = 0.8 + wgt * 2.4
        ctx.beginPath(); ctx.moveTo(xa, region.y - 16); ctx.quadraticCurveTo((xa + xb) / 2, top, xb, region.y - 16); ctx.stroke()
      })
    }
    for (let i = 0; i < words.length; i++) {
      if (i < shown) ctx.fillStyle = rgba(i === q ? colors.accent : colors.text, i === q ? 0.95 : 0.55)
      else ctx.fillStyle = rgba(colors.muted2, 0.18)
      ctx.save(); ctx.translate(X(i), region.y); ctx.scale(scale, 1); ctx.fillText(i < shown ? words[i] : '▢', 0, 0); ctx.restore()
    }
    // next-token distribution
    if (!e.mobile && !holdUntil && shown < words.length) {
      ctx.font = `10px ${MONO}`
      const bx = region.x1 + 16, by = region.top + 2
      cands.forEach((c, i) => {
        ctx.fillStyle = rgba(i === 0 ? colors.accent : colors.muted2, i === 0 ? 0.75 : 0.4)
        ctx.fillRect(bx, by + i * 13, 60 * c.p + 2, 8)
        ctx.fillStyle = rgba(colors.muted2, 0.8)
        ctx.fillText(`${c.w} ${(c.p * 100).toFixed(0)}%`, bx + 66, by + i * 13 + 8)
      })
    }
    ctx.font = `10px ${MONO}`; ctx.textAlign = 'right'; ctx.fillStyle = rgba(colors.muted2, 0.85)
    if (!e.mobile) { ctx.fillText('next-token sampling', region.cap, region.top + 14); ctx.fillText('attention over context', region.cap, region.top + 30) }
  }

  return { resize, frame, settle: 160 }
}
