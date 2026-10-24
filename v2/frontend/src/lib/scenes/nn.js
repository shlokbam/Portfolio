// Home: a small feed-forward network running a real forward pass (tanh) every frame.
// The input vector follows the visitor's pointer (or drifts on its own); a pulse wave
// travels layer by layer along the strongest weighted connections.
import { rng, rgba, MONO } from './util.js'

export default function create(env) {
  const R = rng(1903)
  const sizes = env.mobile ? [3, 5, 5, 2] : [4, 7, 8, 6, 3]
  const W = sizes.slice(1).map((n, l) => Array.from({ length: n }, () => Array.from({ length: sizes[l] }, () => R() * 2 - 1)))
  let pos = []
  let acts = sizes.map((n) => new Array(n).fill(0))
  const input = new Array(sizes[0]).fill(0)
  const pulses = []
  let wave = 0, nextWave = 0, region = null

  function resize(e) {
    region = e.mobile
      ? { x0: e.w * 0.08, x1: e.w * 0.92, y0: 190, y1: Math.min(400, e.h * 0.3) }
      : { x0: e.w * 0.34, x1: e.w * 0.97, y0: e.h * 0.14, y1: e.h * 0.62 }
    pos = sizes.map((n, l) => {
      const x = region.x0 + ((region.x1 - region.x0) * l) / (sizes.length - 1)
      return Array.from({ length: n }, (_, i) => ({ x, y: region.y0 + ((region.y1 - region.y0) * (i + 0.5)) / n }))
    })
  }

  function forward() {
    acts[0] = input.slice()
    for (let l = 0; l < W.length; l++) {
      acts[l + 1] = W[l].map((row) => Math.tanh(1.4 * row.reduce((s, w, k) => s + w * acts[l][k], 0)))
    }
  }

  function frame(e, t) {
    const { ctx, colors } = e
    // input features: pointer position if it's over the hero, otherwise a slow autonomous drift
    let ux, uy
    if (e.pointer) { ux = (e.pointer.x / e.w) * 2 - 1; uy = (e.pointer.y / e.h) * 2 - 1 }
    else { ux = Math.sin(t / 2300); uy = Math.cos(t / 3100) }
    const feats = [ux, uy, ux * uy, Math.sin(t / 900)]
    for (let i = 0; i < input.length; i++) input[i] += (feats[i] - input[i]) * 0.08
    forward()

    // edges, weighted by |w * a|
    ctx.lineWidth = 1
    for (let l = 0; l < W.length; l++) {
      for (let j = 0; j < W[l].length; j++) {
        for (let k = 0; k < W[l][j].length; k++) {
          const s = Math.min(1, Math.abs(W[l][j][k] * acts[l][k]))
          ctx.strokeStyle = rgba(colors.muted2, 0.05 + s * 0.22)
          ctx.beginPath(); ctx.moveTo(pos[l][k].x, pos[l][k].y); ctx.lineTo(pos[l + 1][j].x, pos[l + 1][j].y); ctx.stroke()
        }
      }
    }

    // pulse wave: one layer of connections fires every 650 ms
    if (t > nextWave) {
      nextWave = t + 650
      const l = wave
      wave = (wave + 1) % W.length
      for (let j = 0; j < W[l].length; j++) for (let k = 0; k < W[l][j].length; k++) {
        if (Math.abs(W[l][j][k] * acts[l][k]) > 0.38 && pulses.length < 60) pulses.push({ l, j, k, t0: t })
      }
    }
    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i], u = (t - p.t0) / 650
      if (u >= 1) { pulses.splice(i, 1); continue }
      const a = pos[p.l][p.k], b = pos[p.l + 1][p.j]
      ctx.fillStyle = rgba(colors.accent, 0.75 * Math.sin(Math.PI * u))
      ctx.beginPath(); ctx.arc(a.x + (b.x - a.x) * u, a.y + (b.y - a.y) * u, 2, 0, Math.PI * 2); ctx.fill()
    }

    // neurons: brightness = |activation|
    for (let l = 0; l < sizes.length; l++) for (let i = 0; i < sizes[l]; i++) {
      const a = Math.abs(acts[l][i]), p = pos[l][i]
      ctx.fillStyle = rgba(colors.bg, 1)
      ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = rgba(colors.accent, 0.12 + a * 0.6)
      ctx.strokeStyle = rgba(colors.muted2, 0.5)
      ctx.beginPath(); ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
    }

    ctx.font = `10px ${MONO}`
    ctx.fillStyle = rgba(colors.muted2, 0.7)
    ctx.textAlign = 'right'
    const out = acts[acts.length - 1].map((v) => v.toFixed(2)).join('  ')
    ctx.fillText(`forward pass · tanh · ${sizes.join('→')}   ŷ = [ ${out} ]`, region.x1, region.y0 - 14)
  }

  return { resize, frame, settle: 40 }
}
