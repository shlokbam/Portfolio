import { useEffect, useRef, useState } from 'react'
import { PROJECTS } from '../data/projects'

// "Skill pit" on the home page: the stack as physical pills that rain into a box and can be
// grabbed, thrown and stacked (matter-js, loaded only when the section scrolls into view).
// The server renders the same pills as a plain list, which is also the fallback without JS.
// Tapping (or pressing Enter on) a pill lists the projects that use it.

// [label, group, size, match keys (searched in project title/desc/tags)]
const SKILLS = [
  ['Python', 'web', 3, ['python', 'flask', 'fastapi', 'streamlit']],
  ['LangGraph', 'ai', 3, ['langgraph']],
  ['FastAPI', 'web', 3, ['fastapi']],
  ['React', 'web', 3, ['react']],
  ['RAG', 'ai', 3, ['rag', 'retrieval', 'vector', 'chromadb', 'pinecone']],
  ['LangChain', 'ai', 2, ['langchain']],
  ['LLM evals', 'ai', 2, ['eval', 'judge', 'fact-check']],
  ['MCP', 'ai', 2, ['mcp', 'model context']],
  ['Gemini', 'ai', 2, ['gemini']],
  ['Mistral', 'ai', 1, ['mistral']],
  ['OpenAI', 'ai', 1, ['openai']],
  ['ChromaDB', 'ai', 1, ['chromadb']],
  ['Pinecone', 'ai', 1, ['pinecone']],
  ['TensorFlow', 'ai', 1, ['tensorflow']],
  ['OpenCV', 'ai', 1, ['opencv']],
  ['scikit-learn', 'ai', 1, ['scikit']],
  ['Pandas', 'ai', 1, ['pandas']],
  ['Flask', 'web', 2, ['flask']],
  ['Next.js', 'web', 1, ['next.js']],
  ['Node.js', 'web', 1, ['node.js']],
  ['React Native', 'web', 1, ['react native']],
  ['Tailwind', 'web', 1, ['tailwind']],
  ['PostgreSQL', 'web', 2, ['postgres']],
  ['SQLite', 'web', 1, ['sqlite']],
  ['Firebase', 'web', 1, ['firebase']],
  ['Docker', 'ops', 2, ['docker']],
  ['Terraform', 'ops', 2, ['terraform']],
  ['Jenkins', 'ops', 1, ['jenkins']],
  ['AWS', 'ops', 2, ['aws', 'ec2', 'lambda', 's3', 'rds', 'ses']],
  ['Serverless', 'ops', 1, ['lambda', 'serverless']]
]

const usedIn = (keys) => PROJECTS.filter((p) => {
  const hay = (p.title + ' ' + p.desc + ' ' + p.tags).toLowerCase()
  return keys.some((k) => hay.includes(k))
}).map((p) => p.title)

const SKILL_DATA = SKILLS.map(([label, group, size, keys]) => ({ label, group, size, projects: usedIn(keys) }))

export default function SkillPit({ bare = false }) {
  const box = useRef(null)
  const pills = useRef([])
  const api = useRef(null) // { shake, reset } once the physics is running
  const dragged = useRef(false)
  const [live, setLive] = useState(false)
  const [sel, setSel] = useState(-1)

  useEffect(() => {
    const el = box.current
    if (!el) return
    let disposed = false, booted = false
    let stopAll = () => {}

    const boot = async () => {
      booted = true
      const mod = await import('matter-js')
      if (disposed) return
      const { Engine, Bodies, Body, Composite, Constraint, Sleeping } = mod.default || mod
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
      const engine = Engine.create({ enableSleeping: true })
      engine.gravity.y = 1.1
      let W = el.clientWidth, H = el.clientHeight
      const T = 400
      const walls = [
        Bodies.rectangle(W / 2, H + T / 2, W * 3, T, { isStatic: true }),
        Bodies.rectangle(-T / 2, H / 2, T, H * 4, { isStatic: true }),
        Bodies.rectangle(W + T / 2, H / 2, T, H * 4, { isStatic: true }),
        Bodies.rectangle(W / 2, -T / 2 - H, W * 3, T, { isStatic: true })
      ]
      Composite.add(engine.world, walls)
      setLive(true)
      await new Promise((r) => requestAnimationFrame(r)) // let the pills switch to absolute layout
      if (disposed) return

      const items = pills.current.map((node) => ({ node, w: node.offsetWidth, h: node.offsetHeight, body: null }))
      const spawn = (it, i) => {
        const x = it.w / 2 + Math.random() * Math.max(1, W - it.w)
        const y = reduced ? H - it.h : -it.h - (i % 6) * 40
        it.body = Bodies.rectangle(x, y, it.w, it.h, {
          chamfer: { radius: it.h / 2 - 1 }, restitution: 0.3, friction: 0.25, frictionAir: 0.012, density: 0.0016,
          angle: (Math.random() - 0.5) * 0.6
        })
        Composite.add(engine.world, it.body)
        it.node.classList.add('in')
      }
      const timers = []
      const dropAll = () => {
        items.forEach((it, i) => {
          if (it.body) Composite.remove(engine.world, it.body)
          it.body = null
          it.node.classList.remove('in')
          if (reduced) spawn(it, i)
          else timers.push(setTimeout(() => !disposed && spawn(it, i), i * 70))
        })
        if (reduced) for (let i = 0; i < 400; i++) Engine.update(engine, 1000 / 60)
      }
      dropAll()

      const draw = () => {
        for (const it of items) {
          if (!it.body) continue
          const { x, y } = it.body.position
          it.node.style.transform = `translate(${(x - it.w / 2).toFixed(1)}px, ${(y - it.h / 2).toFixed(1)}px) rotate(${it.body.angle.toFixed(3)}rad)`
        }
      }

      // drag with pointer events (page scroll still works when touching empty space)
      let grab = null
      const local = (e) => { const r = el.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top } }
      const onDown = (e) => {
        const i = items.findIndex((it) => it.node === e.currentTarget)
        const it = items[i]
        if (!it || !it.body) return
        const p = local(e)
        Sleeping.set(it.body, false)
        const c = Constraint.create({ pointA: p, bodyB: it.body, pointB: { x: p.x - it.body.position.x, y: p.y - it.body.position.y }, stiffness: 0.18, damping: 0.08, length: 0 })
        Composite.add(engine.world, c)
        grab = { c, x0: e.clientX, y0: e.clientY, node: it.node }
        dragged.current = false
        it.node.setPointerCapture(e.pointerId)
        it.node.classList.add('held')
      }
      const onMove = (e) => {
        if (!grab) return
        grab.c.pointA = local(e)
        if (Math.hypot(e.clientX - grab.x0, e.clientY - grab.y0) > 6) dragged.current = true
      }
      const onUp = () => {
        if (!grab) return
        Composite.remove(engine.world, grab.c)
        grab.node.classList.remove('held')
        grab = null
      }
      items.forEach((it) => {
        it.node.addEventListener('pointerdown', onDown)
        it.node.addEventListener('pointermove', onMove)
        it.node.addEventListener('pointerup', onUp)
        it.node.addEventListener('pointercancel', onUp)
      })

      api.current = {
        shake() {
          for (const it of items) if (it.body) { Sleeping.set(it.body, false); Body.setVelocity(it.body, { x: (Math.random() - 0.5) * 14, y: -8 - Math.random() * 12 }); Body.setAngularVelocity(it.body, (Math.random() - 0.5) * 0.4) }
        },
        reset() { dropAll() }
      }

      // keep the box walls in step with the layout
      const ro = new ResizeObserver(() => {
        const w = el.clientWidth, h = el.clientHeight
        if (w === W && h === H) return
        W = w; H = h
        Body.setPosition(walls[0], { x: W / 2, y: H + T / 2 })
        Body.setPosition(walls[2], { x: W + T / 2, y: H / 2 })
        for (const it of items) if (it.body && it.body.position.x > W - it.w / 2) { Sleeping.set(it.body, false); Body.setPosition(it.body, { x: W - it.w / 2, y: it.body.position.y }) }
      })
      ro.observe(el)

      // run only while on screen and the tab is visible
      let raf = 0, last = 0, visible = true
      const loop = (t) => {
        raf = 0
        const dt = last ? Math.min(32, t - last) : 16
        last = t
        Engine.update(engine, dt)
        draw()
        if (visible && !document.hidden) raf = requestAnimationFrame(loop)
      }
      const start = () => { if (!raf && visible && !document.hidden) { last = 0; raf = requestAnimationFrame(loop) } }
      const io2 = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) start() }, { rootMargin: '120px' })
      io2.observe(el)
      document.addEventListener('visibilitychange', start)
      draw()
      start()

      stopAll = () => {
        cancelAnimationFrame(raf); timers.forEach(clearTimeout)
        io2.disconnect(); ro.disconnect()
        document.removeEventListener('visibilitychange', start)
        items.forEach((it) => {
          it.node.removeEventListener('pointerdown', onDown)
          it.node.removeEventListener('pointermove', onMove)
          it.node.removeEventListener('pointerup', onUp)
          it.node.removeEventListener('pointercancel', onUp)
        })
        Engine.clear(engine)
        api.current = null
      }
    }

    // start when the box is about to scroll into view
    const io = new IntersectionObserver(([en]) => { if (en.isIntersecting && !booted) { io.disconnect(); boot() } }, { rootMargin: '0px 0px -15% 0px' })
    io.observe(el)
    return () => { disposed = true; io.disconnect(); stopAll() }
  }, [])

  const pick = (i) => {
    if (dragged.current) { dragged.current = false; return }
    setSel((s) => (s === i ? -1 : i))
  }
  const cur = sel >= 0 ? SKILL_DATA[sel] : null

  const tools = (
    <div className="pit-tools">
      <p style={{ margin: '0', color: 'var(--muted)', fontSize: '17px', lineHeight: '1.5', maxWidth: '34ch' }}>
        {SKILL_DATA.length} tools I ship with. Grab, throw and stack them — tap one to see where I used it.
      </p>
      <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
        <button type="button" className="pit-btn mono" onClick={() => api.current && api.current.shake()} disabled={!live}>Shake ⟲</button>
        <button type="button" className="pit-btn mono" onClick={() => { setSel(-1); api.current && api.current.reset() }} disabled={!live}>Drop again ↓</button>
      </div>
    </div>
  )
  const game = (
    <>
      <div ref={box} className={'pit' + (live ? ' live' : '')}>
          <ul className="pit-list" aria-label="Skills">
            {SKILL_DATA.map((s, i) => (
              <li key={s.label} style={{ display: 'contents' }}>
                <button
                  type="button"
                  ref={(n) => { pills.current[i] = n }}
                  className={'pill-k s' + s.size + ' g-' + s.group + (i === sel ? ' sel' : '')}
                  aria-pressed={i === sel}
                  onClick={() => pick(i)}
                >
                  <i aria-hidden="true" />{s.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="pit-legend mono" aria-hidden="true">
            <span><i className="g-ai" /> AI &amp; LLMs</span>
            <span><i className="g-web" /> Web &amp; data</span>
            <span><i className="g-ops" /> Cloud &amp; DevOps</span>
          </div>
        </div>

        <div className="pit-info" aria-live="polite">
          {cur ? (
            <>
              <span className="mono" style={{ color: 'var(--accent)' }}>{cur.label}</span>
              {cur.projects.length
                ? <span>Used in {cur.projects.length} project{cur.projects.length > 1 ? 's' : ''}: {cur.projects.slice(0, 6).join(' · ')}{cur.projects.length > 6 ? ' …' : ''}</span>
                : <span style={{ color: 'var(--muted)' }}>Part of my everyday toolkit — ask my AI where I use it.</span>}
            </>
          ) : (
            <span className="mono" style={{ color: 'var(--muted)' }}>Tip: throw one hard. Or press Shake.</span>
          )}
        </div>
    </>
  )
  if (bare) return <div className="pit-bare">{tools}{game}</div>
  return (
    <section className="pit-sec" aria-labelledby="pit-h" style={{ padding: '110px 0', borderBottom: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="pit-head">
          <div>
            <span className="mono" style={{ color: 'var(--muted)' }}>The stack, unboxed</span>
            <h2 id="pit-h" className="disp" style={{ margin: '18px 0 0', fontSize: 'clamp(40px, 6.4vw, 100px)' }}>
              Play with{' '}<span className="serif" style={{ textTransform: 'none', letterSpacing: '-.02em', fontWeight: '400', color: 'var(--accent)' }}>my</span>{' '}stack
            </h2>
          </div>
          {tools}
        </div>
        {game}
      </div>
    </section>
  )
}
