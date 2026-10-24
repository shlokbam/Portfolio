import { useEffect, useRef } from 'react'

// Live AI visual drawn on a canvas behind a page header. Each scene is a real (tiny)
// computation — a forward pass, gradient descent, a convolution — drawn in the theme colours.
// Scenes load lazily after hydration, pause off-screen / in background tabs, and render a
// single still frame for people who prefer reduced motion.
const SCENES = {
  nn: () => import('../lib/scenes/nn.js'),
  embed: () => import('../lib/scenes/embed.js'),
  gd: () => import('../lib/scenes/gd.js'),
  agents: () => import('../lib/scenes/agents.js'),
  train: () => import('../lib/scenes/train.js'),
  cv: () => import('../lib/scenes/cv.js'),
  graph: () => import('../lib/scenes/graph.js'),
  tokens: () => import('../lib/scenes/tokens.js'),
  attention: () => import('../lib/scenes/attention.js')
}

const TOKENS = ['bg', 'surface', 'line', 'text', 'muted', 'muted2', 'accent']

function readColors(el) {
  const cs = getComputedStyle(el)
  const c = {}
  for (const k of TOKENS) c[k] = cs.getPropertyValue('--' + k).trim() || '#888888'
  return c
}

export default function AIBackdrop({ kind, text = '', className = '', style }) {
  const canvasRef = useRef(null)
  const textRef = useRef(text)
  textRef.current = text

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !SCENES[kind]) return
    let disposed = false
    let scene = null
    let raf = 0
    let visible = false
    let last = 0
    const ctx = canvas.getContext('2d')
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = matchMedia('(max-width: 700px), (pointer: coarse)').matches
    const env = { ctx, w: 0, h: 0, dpr: 1, mobile, reduced, colors: readColors(canvas), pointer: null, text: textRef.current }

    const size = () => {
      const r = canvas.getBoundingClientRect()
      env.dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2)
      env.w = Math.max(1, r.width)
      env.h = Math.max(1, r.height)
      canvas.width = Math.round(env.w * env.dpr)
      canvas.height = Math.round(env.h * env.dpr)
      ctx.setTransform(env.dpr, 0, 0, env.dpr, 0, 0)
      if (scene) { scene.resize(env); drawOnce() }
    }

    const drawOnce = () => { if (scene) { ctx.clearRect(0, 0, env.w, env.h); scene.frame(env, last || 16, 16) } }

    const loop = (t) => {
      raf = 0
      if (!visible || disposed) return
      if (!last) last = t - 25
      const dt = Math.min(64, t - last)
      // ~40 fps is plenty for slow, calm motion and halves the work
      if (dt >= 24) {
        last = t
        env.text = textRef.current
        ctx.clearRect(0, 0, env.w, env.h)
        scene.frame(env, t, dt)
      }
      raf = requestAnimationFrame(loop)
    }
    const start = () => { if (!raf && scene && !reduced && visible && !document.hidden) raf = requestAnimationFrame(loop) }
    const stop = () => { if (raf) cancelAnimationFrame(raf); raf = 0 }

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop() }, { rootMargin: '100px' })
    const ro = new ResizeObserver(size)
    const onVis = () => (document.hidden ? stop() : start())
    const onPointer = (e) => {
      const r = canvas.getBoundingClientRect()
      const x = e.clientX - r.left, y = e.clientY - r.top
      env.pointer = x >= 0 && y >= 0 && x <= r.width && y <= r.height ? { x, y } : null
    }
    const mo = new MutationObserver(() => {
      env.colors = readColors(canvas)
      if (scene) { scene.resize(env); if (reduced || !raf) drawOnce() }
    })

    const boot = () => SCENES[kind]().then((mod) => {
      if (disposed) return
      size()
      scene = mod.default(env)
      scene.resize(env)
      if (reduced) {
        // a still, representative frame: advance the simulation silently, then draw once
        for (let i = 0; i < (scene.settle || 120); i++) scene.frame(env, i * 25, 25, true)
        drawOnce()
      }
      io.observe(canvas)
      ro.observe(canvas)
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
      document.addEventListener('visibilitychange', onVis)
      window.addEventListener('pointermove', onPointer, { passive: true })
      start()
    })
    const ric = 'requestIdleCallback' in window
    const idleId = ric ? window.requestIdleCallback(boot, { timeout: 1500 }) : setTimeout(boot, 200)

    return () => {
      disposed = true
      stop()
      if (ric) window.cancelIdleCallback(idleId)
      else clearTimeout(idleId)
      io.disconnect(); ro.disconnect(); mo.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [kind])

  return <canvas ref={canvasRef} className={'ai-bg ' + className} aria-hidden="true" style={style} />
}
