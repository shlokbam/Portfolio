// The LinkedIn series, shown on the Writing page (components/Series.jsx) and as the latest part on Home.
// To add a post: put one entry at the top of SERIES_POSTS (newest first). `arc` is the arc's number in ARCS;
// `url` is the post's link ("…" → Copy link to post). When an arc is finished or starts, update its `status`.
// Part of the site's content: the build publishes it in /portfolio.json.
export const SERIES = {
  name: 'Not What You Think',
  tag: '#NotWhatYouThink',
  about: 'Short posts on what people get wrong about LLMs, what is actually going on, and what it broke in my own builds.',
  follow: 'https://www.linkedin.com/in/shlokbam/recent-activity/all/'
}

export const ARCS = [
  { n: 1, name: 'Inside the model', status: 'Complete' },
  { n: 2, name: 'Can you trust the output?', status: 'Starts after Diwali' }
]

export const SERIES_POSTS = [
  {
    part: 4,
    arc: 1,
    date: '2026-11-05',
    topic: 'Model drift',
    title: 'My prompt didn’t change. The model did.',
    summary: 'A model my pipeline called disappeared from the API overnight. Pin model versions like you pin libraries, and test before you switch.',
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:7523957298596286464/'
  },
  {
    part: 3,
    arc: 1,
    date: '2026-11-03',
    topic: 'Context windows',
    title: 'The context window is a ceiling, not a target',
    summary: 'A model with a 131,072-token window rejected my 10,411-token prompt: the rate limit hit first. Trimming, not a bigger model, fixed it.',
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:7523232613835104256/'
  },
  {
    part: 2,
    arc: 1,
    date: '2026-10-29',
    topic: 'Temperature',
    title: 'Temperature 0 makes answers less random, not fixed',
    summary: 'Hosted APIs batch requests, so even temperature 0 can drift. Why my DailyDiff evals run three times and report ranges.',
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:7521486557904580608/'
  },
  {
    part: 1,
    arc: 1,
    date: '2026-10-27',
    topic: 'Tokens',
    title: 'AI reads tokens, not words',
    summary: 'GPT-4o sees “strawberry” as three tokens, and one sentence costs 8 tokens in English but 27 in Hindi.',
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:7520696039679471616/'
  }
]

// '2026-11-05' -> '5 Nov 2026' (fixed format, so prerendered pages don't change from day to day)
export function seriesDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return d + ' ' + ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1] + ' ' + y
}
