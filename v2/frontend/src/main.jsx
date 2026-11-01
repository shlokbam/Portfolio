import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { pageFor, loadAllPages } from './routes'
import { trackLinks } from './lib/track'
import './styles/fonts.css'
import 'lenis/dist/lenis.css'
import './styles/global.css'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Production pages are prerendered (scripts/prerender.mjs) and hydrated; dev renders from scratch.
// The current page's chunk is loaded first, so hydration matches the prerendered HTML without suspending.
const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1500))
pageFor(location.pathname).load().finally(() => {
  if (root.hasChildNodes()) hydrateRoot(root, app)
  else createRoot(root).render(app)
  idle(() => loadAllPages().catch(() => {}))
})
trackLinks()
