// Every page is its own chunk, so a visitor downloads only the page they open. A page's module is
// loaded before it renders: all of them before prerendering (entry-server preload), the current one
// before hydration (main.jsx), the rest once the browser is idle. Links (components/A.jsx) also load
// their page on hover or touch, and wait for it on click, so a navigation never shows a blank page.
function page(file, loader) {
  let Comp = null
  let pending = null
  const load = () => pending || (pending = loader().then((m) => { Comp = m.default }))
  function Page(props) {
    if (!Comp) throw load() // suspend until the chunk arrives
    return <Comp {...props} />
  }
  Page.load = load
  Page.ready = () => !!Comp
  Page.file = file
  return Page
}

export const ROUTE_PAGES = [
  ['/', page('Home', () => import('./pages/Home'))],
  ['/about', page('About', () => import('./pages/About'))],
  ['/work', page('Work', () => import('./pages/Work'))],
  ['/work/dailydiff', page('CaseStudy', () => import('./pages/CaseStudy'))],
  ['/journey', page('Journey', () => import('./pages/Journey'))],
  ['/recognition', page('Recognition', () => import('./pages/Recognition'))],
  ['/community', page('Community', () => import('./pages/Community'))],
  ['/writing', page('Writing', () => import('./pages/Writing'))],
  ['/contact', page('Contact', () => import('./pages/Contact'))],
  ['/resume', page('Resume', () => import('./pages/Resume'))],
  ['/privacy', page('Privacy', () => import('./pages/Privacy'))]
]
export const NotFound = page('NotFound', () => import('./pages/NotFound'))

const ALL = ROUTE_PAGES.map(([, P]) => P).concat(NotFound)

export function pageFor(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/'
  const hit = ROUTE_PAGES.find(([p]) => p === path)
  return hit ? hit[1] : NotFound
}

export const loadAllPages = () => Promise.all(ALL.map((P) => P.load()))
