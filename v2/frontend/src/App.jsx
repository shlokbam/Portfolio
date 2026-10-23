import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { SiteProvider } from './lib/site'
import Home from './pages/Home'
import About from './pages/About'
import Work from './pages/Work'
import CaseStudy from './pages/CaseStudy'
import Journey from './pages/Journey'
import Recognition from './pages/Recognition'
import Community from './pages/Community'
import Writing from './pages/Writing'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

const TITLES = {
  '/': 'Shlok Bam — AI & Full-Stack Engineer',
  '/about': 'About — Shlok Bam',
  '/work': 'Work — Shlok Bam',
  '/work/dailydiff': 'DailyDiff case study — Shlok Bam',
  '/journey': 'Journey — Shlok Bam',
  '/recognition': 'Recognition — Shlok Bam',
  '/community': 'Community — Shlok Bam',
  '/writing': 'Writing — Shlok Bam',
  '/contact': 'Contact — Shlok Bam'
}

function RouteEffects() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    document.title = TITLES[pathname] || 'Shlok Bam'
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) { el.scrollIntoView(); return }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <SiteProvider>
      <RouteEffects />
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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </SiteProvider>
  )
}
