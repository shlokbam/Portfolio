import { Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { SiteProvider } from './lib/site'
import { pageMeta } from './seo'
import { startSmooth, scrollToTop, scrollToEl, flash } from './lib/smooth'
import { startReveal } from './lib/reveal'
import { ROUTE_PAGES, NotFound } from './routes'

function setMeta(selector, attr, value) {
  const el = document.head.querySelector(selector)
  if (el) el.setAttribute(attr, value)
}

// Keep <head> in step with in-app navigation (the prerendered HTML already has it for first load).
function RouteEffects() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const meta = pageMeta(pathname)
    document.title = meta.title
    setMeta('meta[name="description"]', 'content', meta.description)
    setMeta('meta[property="og:title"]', 'content', meta.title)
    setMeta('meta[property="og:description"]', 'content', meta.description)
    setMeta('meta[name="twitter:title"]', 'content', meta.title)
    setMeta('meta[name="twitter:description"]', 'content', meta.description)
    const canon = document.head.querySelector('link[rel="canonical"]')
    if (canon) {
      const url = new URL(canon.href).origin + (pathname === '/' ? '/' : pathname)
      canon.href = url
      setMeta('meta[property="og:url"]', 'content', url)
    }
  }, [pathname])
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      // reset first: Lenis measures the target from its own scroll position, which can still be
      // the previous page's (the browser clamps it when the new page is shorter)
      if (el) { scrollToTop({ immediate: true }); scrollToEl(el, { immediate: true }); flash(el); return }
    }
    scrollToTop({ immediate: true })
  }, [pathname, hash])
  return null
}

function ClientEffects() {
  // after hydration: smooth scrolling and the scroll-reveal fallback for Safari/Firefox
  useEffect(() => { startSmooth(); startReveal() }, [])
  return null
}

export default function App() {
  return (
    <SiteProvider>
      <RouteEffects />
      <ClientEffects />
      <Suspense fallback={null}>
        <Routes>
          {ROUTE_PAGES.map(([path, Page]) => <Route key={path} path={path} element={<Page />} />)}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </SiteProvider>
  )
}
