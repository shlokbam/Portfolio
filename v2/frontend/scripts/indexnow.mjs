// Tells Bing, Yandex and the other IndexNow search engines that the site's pages changed, so they
// re-crawl within hours instead of weeks. Run it after a deploy is live:  npm run indexnow
// It sends every URL in the live sitemap. The key is public by design: search engines check that
// https://shlokbam.in/<key>.txt (public/<key>.txt) contains it, which proves the site is ours.
const SITE = (process.env.SITE_URL || 'https://shlokbam.in').replace(/\/+$/, '')
const KEY = '0ad7faedcb78f4799790d153ec798e39'

const keyFile = await fetch(SITE + '/' + KEY + '.txt')
if (!keyFile.ok || (await keyFile.text()).trim() !== KEY) {
  console.error('The key file is not live yet at ' + SITE + '/' + KEY + '.txt. Deploy first, then run this again.')
  process.exit(1)
}

const sitemap = await (await fetch(SITE + '/sitemap.xml')).text()
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => u.startsWith(SITE))
if (!urlList.length) {
  console.error('No URLs found in ' + SITE + '/sitemap.xml')
  process.exit(1)
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: SITE + '/' + KEY + '.txt', urlList })
})
// 200 = received, 202 = received and the key is still being checked; anything else is a problem
const ok = res.status === 200 || res.status === 202
console.log((ok ? 'Sent ' : 'IndexNow refused (' + res.status + ') ') + urlList.length + ' URLs' + (ok ? ' (' + res.status + ')' : ': ' + (await res.text()).slice(0, 300)))
process.exit(ok ? 0 : 1)
