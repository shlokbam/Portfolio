// Search & social metadata for every route. Used by the prerender script (full <head> per page)
// and by the client to update tags on in-app navigation. No browser APIs here.
import { PROJECTS } from './data/projects.js'

export const DEFAULT_SITE_URL = 'https://shlokbam.in'

const PERSON_DESC = 'AI / Generative AI engineer from Pune, India shipping agentic and LLM-powered systems to production — multi-agent pipelines, LLM-as-judge evaluation, RAG and full-stack products. B.Tech IT at VIT Pune (9.01 CGPA), intern at PharmaACE Innovations, co-inventor on three patents.'

export const PAGES = {
  '/': {
    title: 'Shlok Bam — AI / Generative AI Engineer in Pune, India',
    description: 'Shlok Bam is an ' + PERSON_DESC.charAt(0).toLowerCase() + PERSON_DESC.slice(1),
    name: 'Home'
  },
  '/about': {
    title: 'About Shlok Bam — Story, Skills & Toolkit',
    description: 'Who Shlok Bam is: an IT student at VIT Pune and Founding Chair of ITSA who builds agentic AI, LLM evaluation and full-stack systems with Python, LangGraph, LangChain, FastAPI and React.',
    name: 'About'
  },
  '/work': {
    title: 'Projects by Shlok Bam — 21 AI & Full-Stack Builds',
    description: 'All 21 projects by Shlok Bam — DailyDiff, ResearchOS, an enterprise workforce training platform, PaisaWise, PromptVault and more — spanning AI agents, RAG, full-stack web, cloud and DevOps, with live demos and code.',
    name: 'Work'
  },
  '/work/dailydiff': {
    title: 'DailyDiff Case Study — Multi-Agent AI Newsroom by Shlok Bam',
    description: 'How DailyDiff works: a live LangGraph pipeline over 7 sources that emails a fact-checked tech brief three times a week — 185 briefs, 42 editions, LLM calls cut from 22 to 4, with per-agent evals.',
    name: 'DailyDiff case study',
    parent: '/work'
  },
  '/journey': {
    title: 'Experience & Education — Shlok Bam',
    description: 'Shlok Bam’s journey: intern at PharmaACE Innovations building healthcare-data and agentic AI pipelines for pharma clients, Founding Chairperson of ITSA, and a B.Tech in IT at VIT Pune.',
    name: 'Journey'
  },
  '/recognition': {
    title: 'Patents, Awards & Certifications — Shlok Bam',
    description: 'Three patents co-invented by Shlok Bam (granted and filed in South Africa, published in India), winning INDOvateAI Sprint 2025 among 200+ teams, Google Arcade Diamond League and nine certifications.',
    name: 'Recognition'
  },
  '/community': {
    title: 'Community & Leadership — Shlok Bam',
    description: 'Beyond code: Shlok Bam has mentored 100+ first-year students, anchored Abhivriddhi’s flagship EDGE’24 tech event and volunteered at an old age home in Pune.',
    name: 'Community'
  },
  '/writing': {
    title: 'Writing & Build Logs — Shlok Bam',
    description: '12 build logs by Shlok Bam — multi-agent systems with LangGraph, RAG with LangChain and ChromaDB, LangSmith tracing, the Model Context Protocol, DevOps with Terraform and Ansible, and full-stack builds.',
    name: 'Writing'
  },
  '/contact': {
    title: 'Contact Shlok Bam — Hire an AI / Generative AI Engineer',
    description: 'Get in touch with Shlok Bam about full-time roles, internships, collaboration or freelance work. Email shlokbam19103@gmail.com — based in Pune, open to relocation.',
    name: 'Contact'
  }
}

export const NOT_FOUND = { title: 'Page not found — Shlok Bam', description: 'This page does not exist. Explore Shlok Bam’s work, journey and contact details instead.', noindex: true }

export const ROUTES = Object.keys(PAGES)

export function pageMeta(pathname) {
  return PAGES[pathname] || NOT_FOUND
}

function jsonLd(pathname, site) {
  const meta = PAGES[pathname]
  const url = site + (pathname === '/' ? '/' : pathname)
  const person = {
    '@type': 'Person',
    '@id': site + '/#person',
    name: 'Shlok Bam',
    url: site + '/',
    image: site + '/static/images/about/profile.png',
    description: PERSON_DESC,
    jobTitle: 'AI / Generative AI Engineer',
    worksFor: { '@type': 'Organization', name: 'PharmaACE Innovations' },
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'Vishwakarma Institute of Technology, Pune', sameAs: 'https://www.vit.edu/' },
    address: { '@type': 'PostalAddress', addressLocality: 'Pune', addressRegion: 'Maharashtra', addressCountry: 'IN' },
    email: 'mailto:shlokbam19103@gmail.com',
    knowsAbout: ['Generative AI', 'Agentic AI', 'Multi-agent systems', 'LLM evaluation', 'LLM-as-judge', 'Retrieval-augmented generation (RAG)', 'LangGraph', 'LangChain', 'Model Context Protocol', 'Python', 'FastAPI', 'React', 'PostgreSQL', 'Docker', 'Terraform'],
    sameAs: [
      'https://github.com/shlokbam',
      'https://www.linkedin.com/in/shlokbam/',
      'https://x.com/shlok_bam',
      'https://leetcode.com/u/shlokbam05/',
      'https://www.codechef.com/users/shlokbam'
    ]
  }
  const website = { '@type': 'WebSite', '@id': site + '/#website', url: site + '/', name: 'Shlok Bam', inLanguage: 'en', publisher: { '@id': site + '/#person' } }
  const page = {
    '@type': pathname === '/' || pathname === '/about' ? 'ProfilePage' : 'WebPage',
    '@id': url + '#webpage',
    url,
    name: meta.title,
    description: meta.description,
    isPartOf: { '@id': site + '/#website' },
    about: { '@id': site + '/#person' },
    inLanguage: 'en'
  }
  if (pathname === '/' || pathname === '/about') page.mainEntity = { '@id': site + '/#person' }
  const graph = [person, website, page]
  if (pathname !== '/') {
    const crumbs = [{ name: 'Home', path: '/' }]
    if (meta.parent) crumbs.push({ name: PAGES[meta.parent].name, path: meta.parent })
    crumbs.push({ name: meta.name, path: pathname })
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: site + (c.path === '/' ? '/' : c.path) }))
    })
  }
  if (pathname === '/work') {
    graph.push({
      '@type': 'ItemList',
      name: 'Projects by Shlok Bam',
      itemListElement: PROJECTS.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'SoftwareSourceCode',
          name: p.title,
          description: p.desc,
          author: { '@id': site + '/#person' },
          ...(p.code ? { codeRepository: p.code } : {}),
          ...(p.live ? { url: p.live } : {})
        }
      }))
    })
  }
  if (pathname === '/work/dailydiff') {
    graph.push({
      '@type': 'SoftwareApplication',
      name: 'DailyDiff',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      url: 'https://dailydiff.in/',
      description: meta.description,
      author: { '@id': site + '/#person' },
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
    })
  }
  return { '@context': 'https://schema.org', '@graph': graph }
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Full set of <head> tags for one route (prerender only).
export function headTags(pathname, site) {
  const meta = pageMeta(pathname)
  const url = site + (pathname === '/' ? '/' : pathname)
  const img = site + '/og.png'
  const tags = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    meta.noindex ? '<meta name="robots" content="noindex, follow" />' : '<meta name="robots" content="index, follow, max-image-preview:large" />'
  ]
  if (!meta.noindex) {
    tags.push(
      `<link rel="canonical" href="${url}" />`,
      '<meta property="og:type" content="' + (pathname === '/' ? 'profile' : 'website') + '" />',
      '<meta property="og:site_name" content="Shlok Bam" />',
      '<meta property="og:locale" content="en_IN" />',
      `<meta property="og:url" content="${url}" />`,
      `<meta property="og:title" content="${esc(meta.title)}" />`,
      `<meta property="og:description" content="${esc(meta.description)}" />`,
      `<meta property="og:image" content="${img}" />`,
      '<meta property="og:image:width" content="1200" />',
      '<meta property="og:image:height" content="630" />',
      '<meta property="og:image:alt" content="Shlok Bam — AI / Generative AI Engineer" />',
      ...(pathname === '/' ? ['<meta property="profile:first_name" content="Shlok" />', '<meta property="profile:last_name" content="Bam" />'] : []),
      '<meta name="twitter:card" content="summary_large_image" />',
      '<meta name="twitter:site" content="@shlok_bam" />',
      '<meta name="twitter:creator" content="@shlok_bam" />',
      `<meta name="twitter:title" content="${esc(meta.title)}" />`,
      `<meta name="twitter:description" content="${esc(meta.description)}" />`,
      `<meta name="twitter:image" content="${img}" />`,
      `<script type="application/ld+json">${JSON.stringify(jsonLd(pathname, site)).replace(/</g, '\\u003c')}</script>`
    )
  }
  return tags.join('\n    ')
}
