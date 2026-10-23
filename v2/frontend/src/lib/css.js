// The mockup builds some inline styles as strings ("--i: 3; color: var(--accent)").
// css() turns such a string into a React style object, memoised by string.
const cache = new Map()

function camel(prop) {
  if (prop.startsWith('--')) return prop
  if (prop.startsWith('-webkit-')) prop = 'Webkit-' + prop.slice(8)
  return prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

export function css(str) {
  if (!str) return undefined
  if (typeof str === 'object') return str
  let obj = cache.get(str)
  if (obj) return obj
  obj = {}
  let depth = 0, buf = ''
  const decls = []
  for (const ch of str) {
    if (ch === '(') depth++
    else if (ch === ')') depth--
    if (ch === ';' && depth === 0) { decls.push(buf); buf = '' } else buf += ch
  }
  decls.push(buf)
  for (const d of decls) {
    const i = d.indexOf(':')
    if (i < 0) continue
    obj[camel(d.slice(0, i).trim())] = d.slice(i + 1).trim()
  }
  cache.set(str, obj)
  return obj
}
