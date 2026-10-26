import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { SiteProvider } from './lib/site'
import { pageMeta } from './seo'
import { startSmooth, scrollToTop, scrollToEl } from './lib/smooth'
import { startReveal } from './lib/reveal'
import Home from './pages/Home'
import About from './pages/About'
import Work from './pages/Work'
import CaseStudy from './pages/CaseStudy'
import Journey from './pages/Journey'
import Recognition from './pages/Recognition'
import Community from './pages/Community'
import Writing from './pages/Writing'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import NotFound from './pages/NotFound'

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
      if (el) { scrollToEl(el, { immediate: true }); return }
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/work" element={<Work />} />
        <Route path="/work/dailydiff" element={<CaseStudy />} />
        <Route path="/journey" element={<Journey />} />
        <Route path="/recognition" element={<Recognition />} />
        <Route path="/community" element={<Community />} />
        <Route path="/writing" element={<Writing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </SiteProvider>
  )
}
