// Small helpers shared by the background scenes.

export function rng(seed = Date.now()) {
  // mulberry32: fast, seedable, good enough for visuals
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v)
export const lerp = (a, b, t) => a + (b - a) * t
export const ease = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 3)

// '#FF5A1F' -> 'rgba(255,90,31,a)'
export function rgba(hex, a) {
  const h = (hex || '#888888').trim().replace('#', '')
  const f = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const n = parseInt(f.slice(0, 6), 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}

export const MONO = "'JetBrains Mono', ui-monospace, monospace"

// The empty strip every page header has between the fixed top bar and the "(0x) — Page" label
// row. Readable overlays (charts, captions, token strips) live here; textures go behind titles.
export function band(e) {
  const y0 = e.mobile ? 84 : 88
  return { y0, y1: e.mobile ? 140 : Math.min(152, e.h * 0.25), x0: e.mobile ? 20 : e.w * 0.3, x1: e.mobile ? e.w - 20 : e.w * 0.96 }
}
