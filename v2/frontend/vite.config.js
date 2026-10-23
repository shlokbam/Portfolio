import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

// Local dev convenience: if VITE_WEB3FORMS_KEY isn't set, reuse WEB3FORMS_ACCESS_KEY from the
// repo-root .env (the same public form key v1 used). On Vercel, set VITE_WEB3FORMS_KEY instead.
function rootWeb3formsKey() {
  try {
    const raw = fs.readFileSync(path.resolve(__dirname, '../../.env'), 'utf8')
    const m = raw.match(/^WEB3FORMS_ACCESS_KEY=(.*)$/m)
    return m ? m[1].trim().replace(/^["']|["']$/g, '') : ''
  } catch (e) {
    return ''
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const key = env.VITE_WEB3FORMS_KEY || rootWeb3formsKey()
  return {
    plugins: [react()],
    define: { 'import.meta.env.VITE_WEB3FORMS_KEY': JSON.stringify(key) },
    // In dev, /api is proxied to the FastAPI server (uvicorn on :8000).
    server: { proxy: { '/api': 'http://localhost:8000' } }
  }
})
