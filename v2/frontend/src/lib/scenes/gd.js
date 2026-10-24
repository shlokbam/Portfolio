// Work: gradient descent with momentum on a real 2-D loss surface. Contours are traced with
// marching squares; the optimiser's path, step counter and a live loss curve are drawn on top.
import { rng, rgba, MONO, band } from './util.js'

const g = (x, y, s) => Math.exp(-(x * x + y * y) / s)
function f(x, y) {
  // minima sit right of the title and in the top strip, where the path stays visible
  return 0.06 * (x * x + y * y) - 1.0 * g(x - 2.85, y + 0.25, 0.7) - 0.8 * g(x + 0.6, y + 1.45, 0.45)
    - 0.55 * g(x + 2.4, y - 1.2, 0.5) + 0.16 * Math.sin(1.4 * x) * Math.cos(1.2 * y)
}
const X0 = -3.4, X1 = 3.4, Y0 = -2, Y1 = 2

export default function create(env) {
  const R = rng(42)
  let layer = null, sx = 1, sy = 1, ox = 0, oy = 0, fmin = 0, fmax = 1
  let p, v, path, losses, step, still, restartAt

  function restart() {
    p = { x: X0 + 0.4 + R() * (X1 - X0 - 0.8), y: Y0 + 0.3 + R() * (Y1 - Y0 - 0.6) }
    v = { x: 0, y: 0 }; path = [{ ...p }]; losses = [f(p.x, p.y)]; step = 0; still = 0; restartAt = 0
  }

  function resize(e) {
    sx = e.w / (X1 - X0); sy = e.h / (Y1 - Y0); ox = -X0 * sx; oy = -Y0 * sy
    // contour layer, drawn once per size/theme
    layer = document.createElement('canvas')
    layer.width = Math.round(e.w * e.dpr); layer.height = Math.round(e.h * e.dpr)
    const c = layer.getContext('2d'); c.setTransform(e.dpr, 0, 0, e.dpr, 0, 0)
    const cols = e.mobile ? 48 : 90, rows = e.mobile ? 28 : 40
    const grid = []
    fmin = Infinity; fmax = -Infinity
    for (let j = 0; j <= rows; j++) {
      grid.push([])
      for (let i = 0; i <= cols; i++) {
        const v = f(X0 + ((X1 - X0) * i) / cols, Y0 + ((Y1 - Y0) * j) / rows)
        grid[j].push(v); fmin = Math.min(fmin, v); fmax = Math.max(fmax, v)
      }
    }
    const cw = e.w / cols, ch = e.h / rows
    const levels = 14
    c.lineWidth = 1
    for (let L = 1; L < levels; L++) {
      const iso = fmin + ((fmax - fmin) * L) / levels
      c.strokeStyle = rgba(L < 4 ? e.colors.accent : e.colors.muted2, L < 4 ? 0.22 : 0.13)
      c.beginPath()
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        const a = grid[j][i], b = grid[j][i + 1], d = grid[j + 1][i], q = grid[j + 1][i + 1]
        const pts = []
        const edge = (va, vb, x0, y0, x1, y1) => {
          if ((va < iso) !== (vb < iso)) { const u = (iso - va) / (vb - va); pts.push([x0 + (x1 - x0) * u, y0 + (y1 - y0) * u]) }
        }
        const x = i * cw, y = j * ch
        edge(a, b, x, y, x + cw, y); edge(b, q, x + cw, y, x + cw, y + ch)
        edge(d, q, x, y + ch, x + cw, y + ch); edge(a, d, x, y, x, y + ch)
        if (pts.length >= 2) { c.moveTo(pts[0][0], pts[0][1]); c.lineTo(pts[1][0], pts[1][1]) }
        if (pts.length === 4) { c.moveTo(pts[2][0], pts[2][1]); c.lineTo(pts[3][0], pts[3][1]) }
      }
      c.stroke()
    }
    if (!p) restart()
  }

  const toPx = (q) => [ox + q.x * sx, oy + q.y * sy]

  function frame(e, t) {
    const { ctx, colors } = e
    ctx.drawImage(layer, 0, 0, e.w, e.h)
    // two optimiser steps per frame (momentum 0.9, lr 0.05, numeric gradient)
    for (let k = 0; k < 2 && !restartAt; k++) {
      const h = 1e-3
      const gx = (f(p.x + h, p.y) - f(p.x - h, p.y)) / (2 * h)
      const gy = (f(p.x, p.y + h) - f(p.x, p.y - h)) / (2 * h)
      v.x = 0.9 * v.x - 0.05 * gx; v.y = 0.9 * v.y - 0.05 * gy
      p.x += v.x; p.y += v.y; step++
      path.push({ ...p }); losses.push(f(p.x, p.y))
      if (path.length > 400) { path.shift(); losses.shift() }
      still = Math.hypot(v.x, v.y) < 0.0015 ? still + 1 : 0
      if (still > 50) restartAt = t + 1600
    }
    if (restartAt && t > restartAt) restart()

    ctx.lineWidth = 1.5
    ctx.strokeStyle = rgba(colors.accent, 0.7)
    ctx.beginPath()
    path.forEach((q, i) => { const [x, y] = toPx(q); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y) })
    ctx.stroke()
    const [bx, by] = toPx(p)
    ctx.fillStyle = rgba(colors.accent, 0.95)
    ctx.beginPath(); ctx.arc(bx, by, 4, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = rgba(colors.accent, 0.35)
    ctx.beginPath(); ctx.arc(bx, by, 10 + 3 * Math.sin(t / 300), 0, Math.PI * 2); ctx.stroke()

    // live loss curve, bottom-right
    const b = band(e)
    const W = e.mobile ? 110 : 170, H = b.y1 - b.y0 - 14, x0 = e.mobile ? b.x0 : e.w * 0.56, y0 = b.y0 + 4
    ctx.strokeStyle = rgba(colors.muted2, 0.4); ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y0 + H); ctx.lineTo(x0 + W, y0 + H); ctx.stroke()
    ctx.strokeStyle = rgba(colors.accent, 0.85)
    ctx.beginPath()
    losses.forEach((L, i) => {
      const x = x0 + (W * i) / Math.max(1, losses.length - 1), y = y0 + H - (H * (L - fmin)) / (fmax - fmin)
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
    })
    ctx.stroke()
    ctx.font = `10px ${MONO}`; ctx.textAlign = 'right'
    ctx.fillStyle = rgba(colors.muted2, 0.85)
    if (!e.mobile) ctx.fillText('gradient descent · momentum 0.9 · lr 0.05', b.x1, y0 + 14)
    ctx.fillText(`step ${String(step).padStart(4, '0')} · loss ${losses[losses.length - 1].toFixed(3)}`, b.x1, y0 + (e.mobile ? 2 : 30))
  }

  return { resize, frame, settle: 90 }
}
