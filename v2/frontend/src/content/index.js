// Everything in src/content/ as one JSON document. The build writes it to /portfolio.json
// (scripts/prerender.mjs); the backend reads that file for the AI assistant and the MCP server, so a
// content change goes live everywhere with one push. Paths become full URLs so an AI can open them.
// Change the shape only together with backend/content.py, and bump `version` when you do.
import { PROFILE } from './profile.js'
import { PROJECTS, slug } from './projects.js'
import { JOURNEY } from './journey.js'
import { PATENTS, AWARDS, CERTIFICATIONS, MORE_CERTIFICATIONS } from './recognition.js'
import { STORIES } from './community.js'
import { POSTS } from './writing.js'
import { SKILLS } from './skills.js'
import { NOW, UPDATED } from './now.js'

const LEVEL = { 5: 'core', 4: 'strong', 3: 'working', 2: 'exploring' }

export function portfolio(site) {
  const url = (p) => (!p ? '' : p.startsWith('/') ? site + encodeURI(p) : p)
  const chapter = (id) => JOURNEY.find((c) => c.id === id).items.map((it) => ({
    role: it.role,
    organisation: it.org,
    when: it.when,
    type: it.kind,
    points: it.points,
    organisationUrl: it.href || '',
    certificates: (it.certificates || []).map(url)
  }))
  const links = Object.fromEntries(Object.entries(PROFILE.links).map(([k, v]) => [k, url(v)]))
  return {
    version: 1,
    updated: new Date().toISOString().slice(0, 10),
    site,
    profile: { ...PROFILE, links, contact: { ...PROFILE.contact, form: url(PROFILE.contact.form) } },
    now: { updated: UPDATED, items: NOW.filter((b) => b.text).map((b) => ({ topic: b.key, text: b.text })) },
    projects: PROJECTS.map((p, i) => ({
      slug: slug(p.title),
      title: p.title,
      rank: i + 1,
      flagship: i < 5, // the first five are the flagships
      badge: p.badge,
      field: p.field,
      categories: p.cats,
      summary: p.desc,
      details: p.details || '',
      highlights: p.more,
      tech: p.tags.split(' · '),
      links: {
        page: site + (slug(p.title) === 'dailydiff' ? '/work/dailydiff' : '/work#' + slug(p.title)),
        live: p.live,
        code: p.code,
        blog: p.blog || ''
      }
    })),
    experience: chapter('ch-work'),
    leadership: chapter('ch-lead'),
    education: chapter('ch-learn'),
    patents: PATENTS.map((p) => ({ title: p.title, status: p.status, office: p.office, date: p.date, reference: p.appno, summary: p.desc, document: url(p.document) })),
    awards: AWARDS.map((a) => ({ title: a.title, organiser: a.org, date: a.date, result: a.result, summary: a.desc, links: a.links.map(([label, href]) => ({ label, url: url(href) })) })),
    certifications: CERTIFICATIONS.map((c) => ({ title: c.title, issuer: c.org, date: c.date, summary: c.desc, url: url(c.href) }))
      .concat(MORE_CERTIFICATIONS.map((c) => ({ title: c.title, issuer: 'Microsoft & LinkedIn Learning', date: 'Mar 2024', summary: c.desc, url: url(c.href) }))),
    community: STORIES.map((s) => ({ title: s.title, role: s.role, when: s.year, summary: s.desc, tags: s.tags, link: url(s.link) })),
    writing: POSTS.map((p) => ({ title: p.title, date: p.date, topic: p.tag, summary: p.blurb, url: p.href })),
    skills: SKILLS.map((g) => ({ group: g.name, skills: g.skills.map(([name, lv]) => ({ name, level: LEVEL[lv] || 'working' })) }))
  }
}
