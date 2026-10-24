// Community: message passing on a graph. Each node links to its nearest neighbours; an
// activation starts at one node (or the node nearest the pointer) and spreads outward,
// decaying as it travels — the way a workshop or a mentoring session ripples through people.
import { rng, rgba, MONO, band } from './util.js'

export default function create(env) {
  const R = rng(100)
  const N = env.mobile ? 20 : 34, K = 3
  let nodes = [], edges = [], packets = [], nextSeed = 0, region = null, hops = 0

  function resize(e) {
    region = e.mobile
      ? { x0: e.w * 0.06, x1: e.w * 0.94, y0: e.h * 0.08, y1: e.h * 0.42 }
      : { x0: e.w * 0.45, x1: e.w * 0.97, y0: e.h * 0.3, y1: e.h * 0.8 }
    const R2 = rng(7)
    nodes = Array.from({ length: N }, (_, i) => ({
      bx: region.x0 + R2() * (region.x1 - region.x0), by: region.y0 + R2() * (region.y1 - region.y0),
      x: 0, y: 0, a: 0, fired: true, ph: R2() * 6.28, id: i
    }))
    const set = new Set()
    edges = []
    nodes.forEach((n, i) => {
      nodes.map((m, j) => [j, (m.bx - n.bx) ** 2 + (m.by - n.by) ** 2]).filter(([j]) => j !== i)
        .sort((a, b) => a[1] - b[1]).slice(0, K).forEach(([j]) => {
          const key = i < j ? i + '-' + j : j + '-' + i
          if (!set.has(key)) { set.add(key); edges.push([i, j]) }
        })
    })
  }

  const nbrs = (i) => edges.filter(([a, b]) => a === i || b === i).map(([a, b]) => (a === i ? b : a))

  function seed(i) { nodes[i].a = 1; nodes[i].fired = false; nodes[i].at = 0; hops = 0 }

  function frame(e, t, dt) {
    const { ctx, colors } = e
    for (const n of nodes) { n.x = n.bx + Math.sin(t / 2400 + n.ph) * 6; n.y = n.by + Math.cos(t / 2800 + n.ph) * 5 }
    if (t > nextSeed) {
      nextSeed = t + 3600
      let i = Math.floor(R() * N)
      if (e.pointer) { let best = Infinity; nodes.forEach((n, k) => { const d = (n.x - e.pointer.x) ** 2 + (n.y - e.pointer.y) ** 2; if (d < best) { best = d; i = k } }) }
      seed(i)
    }
    // a node that becomes active forwards a decayed message to its neighbours
    for (const n of nodes) {
      if (!n.fired && n.a > 0.25) {
        n.fired = true; hops++
        for (const j of nbrs(n.id)) if (nodes[j].a < n.a * 0.7) packets.push({ from: n.id, to: j, u: 0, val: n.a * 0.8 })
      }
      n.a *= Math.pow(0.986, dt / 16)
    }
    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i]
      p.u += dt / 520
      if (p.u >= 1) {
        const m = nodes[p.to]
        if (p.val > m.a) { m.a = p.val; m.fired = false }
        packets.splice(i, 1)
      }
    }

    ctx.lineWidth = 1
    for (const [a, b] of edges) {
      const s = Math.max(nodes[a].a, nodes[b].a)
      ctx.strokeStyle = rgba(s > 0.3 ? colors.accent : colors.muted2, 0.1 + s * 0.35)
      ctx.beginPath(); ctx.moveTo(nodes[a].x, nodes[a].y); ctx.lineTo(nodes[b].x, nodes[b].y); ctx.stroke()
    }
    for (const p of packets) {
      const a = nodes[p.from], b = nodes[p.to]
      ctx.fillStyle = rgba(colors.accent, 0.9)
      ctx.beginPath(); ctx.arc(a.x + (b.x - a.x) * p.u, a.y + (b.y - a.y) * p.u, 2.2, 0, Math.PI * 2); ctx.fill()
    }
    for (const n of nodes) {
      ctx.fillStyle = rgba(colors.bg, 1)
      ctx.beginPath(); ctx.arc(n.x, n.y, 3 + n.a * 4, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = rgba(n.a > 0.1 ? colors.accent : colors.muted2, 0.25 + n.a * 0.7)
      ctx.beginPath(); ctx.arc(n.x, n.y, 2.5 + n.a * 3.5, 0, Math.PI * 2); ctx.fill()
    }
    ctx.font = `10px ${MONO}`; ctx.textAlign = 'right'; ctx.fillStyle = rgba(colors.muted2, 0.85)
    if (!e.mobile) { const b = band(e); ctx.fillText('message passing', b.x1, b.y0 + 14); ctx.fillText(`${N} nodes · k=${K} · ${hops} hops`, b.x1, b.y0 + 30) }
  }

  return { resize, frame, settle: 80 }
}
