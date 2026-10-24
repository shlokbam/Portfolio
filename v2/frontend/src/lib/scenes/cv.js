// Recognition: a 3×3 Sobel kernel slides over a small pixel image (a nod to the YOLO
// patent). The edge-magnitude feature map is revealed behind the window; when the scan
// finishes, detection boxes appear around each object with a confidence score.
import { rng, rgba, clamp, MONO, band } from './util.js'

export default function create(env) {
  let R = rng(4189)
  const cols = env.mobile ? 34 : 72, rows = 6
  let img = [], mag = [], blobs = [], cursor = 0, doneAt = 0, region = null, cell = 8

  function makeImage() {
    blobs = []
    const n = 2 + Math.floor(R() * 2)
    for (let i = 0; i < n; i++) {
      blobs.push({ cx: 5 + ((i + 0.5) / n) * (cols - 10) + (R() - 0.5) * 4, cy: 2.5 + (R() - 0.5), rx: 2.5 + R() * 3.5, ry: 1.4 + R() * 0.8, conf: 0.86 + R() * 0.13 })
    }
    img = []
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      let v = 0.06 * R()
      for (const b of blobs) { const d = ((x - b.cx) / b.rx) ** 2 + ((y - b.cy) / b.ry) ** 2; if (d < 1) v = Math.max(v, 0.55 + 0.45 * (1 - d)) }
      img.push(v)
    }
    const at = (x, y) => img[clamp(y, 0, rows - 1) * cols + clamp(x, 0, cols - 1)]
    mag = img.map((_, i) => {
      const x = i % cols, y = (i / cols) | 0
      const gx = -at(x - 1, y - 1) - 2 * at(x - 1, y) - at(x - 1, y + 1) + at(x + 1, y - 1) + 2 * at(x + 1, y) + at(x + 1, y + 1)
      const gy = -at(x - 1, y - 1) - 2 * at(x, y - 1) - at(x + 1, y - 1) + at(x - 1, y + 1) + 2 * at(x, y + 1) + at(x + 1, y + 1)
      return Math.min(1, Math.hypot(gx, gy) / 2.2)
    })
    cursor = 0; doneAt = 0
  }

  function resize(e) {
    const b = band(e)
    cell = (b.y1 - b.y0 - 6) / rows
    const W = Math.min(cols * cell, e.mobile ? b.x1 - b.x0 : e.w * 0.5)
    cell = W / cols
    region = { x0: e.mobile ? b.x0 : e.w * 0.3, y0: b.y0 + 2, cap: b.x1 }
    if (!img.length) makeImage()
  }

  function frame(e, t, dt) {
    const { ctx, colors } = e
    const total = cols * rows
    if (cursor < total) cursor = Math.min(total, cursor + (total / 6500) * dt)
    else if (!doneAt) doneAt = t
    else if (t - doneAt > 3200) { R = rng(Math.floor(t)); makeImage() }

    const { x0, y0 } = region
    const scanned = Math.floor(cursor)
    for (let i = 0; i < total; i++) {
      const x = x0 + (i % cols) * cell + cell / 2, y = y0 + ((i / cols) | 0) * cell + cell / 2
      if (i < scanned) {
        const m = mag[i]
        ctx.fillStyle = rgba(m > 0.18 ? colors.accent : colors.muted2, m > 0.18 ? 0.25 + m * 0.65 : 0.12)
        ctx.fillRect(x - cell * 0.32, y - cell * 0.32, cell * 0.64, cell * 0.64)
      } else {
        ctx.fillStyle = rgba(colors.muted, 0.08 + img[i] * 0.42)
        ctx.beginPath(); ctx.arc(x, y, cell * 0.22, 0, Math.PI * 2); ctx.fill()
      }
    }
    if (scanned < total) {
      const cx = scanned % cols, cy = (scanned / cols) | 0
      ctx.strokeStyle = rgba(colors.accent, 0.9); ctx.lineWidth = 1.2
      ctx.strokeRect(x0 + (cx - 1) * cell, y0 + (cy - 1) * cell, cell * 3, cell * 3)
    }
    ctx.font = `10px ${MONO}`
    if (doneAt) {
      const a = Math.min(1, (t - doneAt) / 500)
      blobs.forEach((b, k) => {
        const bx = x0 + (b.cx - b.rx - 0.5) * cell, by = y0 + (b.cy - b.ry - 0.5) * cell
        const bw = (b.rx * 2 + 1) * cell, bh = (b.ry * 2 + 1) * cell
        ctx.strokeStyle = rgba(colors.accent, 0.9 * a); ctx.lineWidth = 1.5
        ctx.strokeRect(bx, by, bw, bh)
        ctx.fillStyle = rgba(colors.accent, 0.9 * a)
        ctx.fillRect(bx, by, 74, 12)
        ctx.fillStyle = rgba(colors.bg, a); ctx.textAlign = 'left'
        ctx.font = `9px ${MONO}`
        ctx.fillText(`obj ${k + 1} · ${b.conf.toFixed(2)}`, bx + 3, by + 9)
        ctx.font = `10px ${MONO}`
      })
    }
    ctx.textAlign = 'right'; ctx.fillStyle = rgba(colors.muted2, 0.85)
    const pct = Math.min(100, Math.round((cursor / total) * 100))
    if (e.mobile) ctx.fillText(`sobel 3×3 · ${pct}%`, region.cap, y0 + rows * cell + 14)
    else {
      ctx.fillText('conv 3×3 · sobel · stride 1', region.cap, y0 + 12)
      ctx.fillText(doneAt ? `${blobs.length} objects detected` : `scanning ${pct}%`, region.cap, y0 + 28)
    }
  }

  return { resize, frame, settle: 700 }
}
