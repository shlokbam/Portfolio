const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export async function api(path, { method = 'GET', body, timeout = 20000 } = {}) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), timeout)
  try {
    const res = await fetch(BASE + path, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl.signal
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      const err = new Error(data.message || data.detail || 'Request failed')
      err.status = res.status
      err.data = data
      throw err
    }
    return data
  } finally {
    clearTimeout(t)
  }
}
