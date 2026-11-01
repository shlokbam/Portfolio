// Analytics events: what visitors do, not only which pages they open. Each event goes to Google Analytics
// (gtag, set up in index.html) and is tagged in Microsoft Clarity, so replays can be filtered by it.
// Both are absent on localhost and for visitors who opted out with ?notrack=1, and then this does nothing.
// Never put personal data in an event (no names, emails or chat text): Google's terms forbid it.
// Keep the list in step with v2/README.md (Analytics) and pages/Privacy.jsx.
export function track(name, params = {}) {
  if (typeof window === 'undefined') return
  if (import.meta.env.DEV) console.debug('[track]', name, params)
  try { window.gtag && window.gtag('event', name, params) } catch (e) {}
  try { window.clarity && window.clarity('event', name) } catch (e) {}
}

// Profiles worth counting by name: a click on one of these is a visitor checking Shlok out further
const PROFILES = [
  ['linkedin.com', 'linkedin'], ['x.com', 'x'], ['twitter.com', 'x'],
  ['instagram.com', 'instagram'], ['leetcode.com', 'leetcode'], ['codechef.com', 'codechef'],
  ['huggingface.co', 'huggingface'], ['kaggle.com', 'kaggle'], ['g.dev', 'google_dev'], ['credly.com', 'credly'],
  ['peerlist.io', 'peerlist'], ['wellfound.com', 'wellfound']
]

// One listener for every link on the site, so new links are counted without extra code.
// Repo links (github.com/shlokbam/<repo>) count as project links, the bare profile as a profile click.
export function trackLinks() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href]')
    if (!a) return
    const href = a.getAttribute('href')
    const text = (a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80)
    const where = location.pathname
    if (href.startsWith('mailto:')) return track('email_click', { page: where })
    if (href.startsWith('tel:')) return track('phone_click', { page: where })
    let url
    try { url = new URL(href, location.href) } catch (err) { return }
    if (url.origin === location.origin) {
      if (/\/static\/Resume\/.+\.pdf$/i.test(url.pathname)) return track('resume_download', { page: where })
      // certificates, patents, letters and other documents
      if (url.pathname.startsWith('/static/')) {
        const parts = decodeURIComponent(url.pathname).split('/')
        return track('file_open', { page: where, folder: parts[2], file: parts.pop().slice(0, 100) })
      }
      if (url.pathname === '/resume' && where !== '/resume') track('resume_view_click', { page: where })
      return
    }
    const host = url.hostname.replace(/^www\./, '')
    const path = host + url.pathname.replace(/\/$/, '')
    const network = path === 'github.com/shlokbam' ? 'github'
      : (PROFILES.find(([d]) => host === d || host.endsWith('.' + d)) || [])[1]
    if (network) return track('profile_click', { network, page: where })
    track('project_link_click', { link_domain: host, link_url: url.href.slice(0, 100), link_text: text, page: where })
  }, true)
}
