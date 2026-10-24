// Home "Ask my AI": a live self-attention heatmap over whatever the visitor types.
// Each token gets a hashed character-trigram embedding; scores are scaled dot products with a
// causal mask, softmaxed per row. One query row at a time is highlighted.
import { rgba, MONO } from './util.js'

const D = 16
function embed(tok) {
  const v = new Array(D).fill(0), s = `#${tok.toLowerCase()}#`
  for (let i = 0; i < s.length - 2; i++) {
    let h = 2166136261
    for (let k = 0; k < 3; k++) h = Math.imul(h ^ s.charCodeAt(i + k), 16777619)
    v[(h >>> 0) % D] += (h & 1 ? 1 : -1)
  }
  const n = Math.hypot(...v) || 1
  return v.map((x) => x / n)
}

export default function create(env) {
  let toks = [], A = [], shownA = [], lastText = null, region = null

  function compute(text) {
    toks = (text || '').trim().split(/\s+/).filter(Boolean).slice(-8)
    if (!toks.length) toks = ['ask', 'me', 'anything', 'about', "shlok's", 'work']
    // a start-of-sequence token, as real models use, so even a one-word question has a pattern
    toks = ['<s>'].concat(toks)
    const E = toks.map(embed)
    A = toks.map((_, i) => {
      const s = toks.map((_, j) => (j > i ? -Infinity : (E[i].reduce((a, v, k) => a + v * E[j][k], 0) * 4) / Math.sqrt(D) + (j === i ? 0.6 : 0)))
      const m = Math.max(...s), ex = s.map((x) => (x === -Infinity ? 0 : Math.exp(x - m))), sum = ex.reduce((a, b) => a + b, 0)
      return ex.map((x) => x / sum)
    })
    if (shownA.length !== A.length) shownA = A.map((r) => r.map(() => 0))
  }

  function resize(e) {
    region = e.mobile ? { x1: e.w - 20, y0: 40, size: Math.min(150, e.w * 0.4) } : { x1: e.w * 0.74, y0: 44, size: 190 }
  }

  function frame(e, t) {
    const { ctx, colors } = e
    if (e.text !== lastText) { lastText = e.text; compute(e.text) }
    // cells never grow past 30px, so short questions give a small grid instead of one big block
    const n = toks.length, cell = Math.min(30, region.size / n), size = cell * n, x0 = region.x1 - size, y0 = region.y0
    const q = Math.floor(t / 900) % n
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      shownA[i][j] += (A[i][j] - shownA[i][j]) * 0.12
      const v = shownA[i][j]
      ctx.fillStyle = j > i ? rgba(colors.muted2, 0.05) : rgba(colors.accent, 0.06 + v * (i === q ? 0.9 : 0.5))
      ctx.fillRect(x0 + j * cell + 1, y0 + i * cell + 1, cell - 2, cell - 2)
    }
    ctx.strokeStyle = rgba(colors.accent, 0.8); ctx.lineWidth = 1
    ctx.strokeRect(x0, y0 + q * cell, size, cell)
    ctx.font = `10px ${MONO}`; ctx.textAlign = 'right'
    toks.forEach((tk, i) => {
      ctx.fillStyle = rgba(i === q ? colors.accent : colors.muted2, i === q ? 0.95 : 0.7)
      ctx.fillText(tk.length > 10 ? tk.slice(0, 9) + '…' : tk, x0 - 8, y0 + i * cell + cell / 2 + 3)
    })
    ctx.fillStyle = rgba(colors.muted2, 0.85)
    ctx.fillText('self-attention · causal mask · 1 head', region.x1, y0 - 12)
  }

  return { resize, frame, settle: 60 }
}
