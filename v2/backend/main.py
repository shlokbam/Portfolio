"""FastAPI backend for shlokbam.dev v2.

Endpoints
  GET  /api/health         liveness probe for Render
  GET  /api/stats          LeetCode / CodeChef / GitHub numbers (cached 2 h)
  GET  /api/availability   online / sleeping / down state of the live project demos (cached 10 min, 90 s if any sleep)
  GET  /api/shipping       recent commits to public GitHub repos, automated ones left out (cached 30 min)
  POST /api/chat           portfolio assistant (Groq; models set by GROQ_MODELS)
  GET  /api/chat/stats     number of questions answered since the last restart
  POST /api/contact        fallback contact relay to Web3Forms (the site normally posts there directly)

Static files (résumé, certificates, photos) are served by the frontend host, not by this API.
"""
import asyncio
import json
import logging
import os
import re
import time
from contextlib import asynccontextmanager
from collections import defaultdict, deque
from datetime import datetime, timezone
from pathlib import Path
from typing import Deque, Dict, List, Optional

import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse, Response
from pydantic import BaseModel, Field

from knowledge import SECTIONS, SYSTEM_PROMPT


def _load_dotenv() -> None:
    """Local dev: read KEY=VALUE pairs from backend/.env or the repo-root .env without overriding real env vars."""
    here = Path(__file__).resolve().parent
    for candidate in (here / '.env', here.parent.parent / '.env'):
        if not candidate.exists():
            continue
        for line in candidate.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, val = line.split('=', 1)
                os.environ.setdefault(key.strip(), val.strip().strip('"').strip("'"))


_load_dotenv()

log = logging.getLogger('portfolio')
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')

# Tried in order; each Groq model has its own free-tier token budget, so on a 429 we move to the next.
GROQ_MODELS = [m.strip() for m in os.getenv('GROQ_MODELS', 'openai/gpt-oss-20b,openai/gpt-oss-120b,qwen/qwen3.8-27b').split(',') if m.strip()]
HEADERS = {'User-Agent': 'Mozilla/5.0 (compatible; portfolio-stats/2.0)', 'Accept': 'application/json'}
HTML_HEADERS = {'User-Agent': 'Mozilla/5.0 (compatible; portfolio-stats/2.0)', 'Accept': 'text/html'}
STATS_TTL = 2 * 60 * 60
AVAILABILITY_TTL = 10 * 60
LIVE_PROJECTS = [
    'https://dailydiff.in/',
    'https://multi-agent-ai-research-system-six.vercel.app/',
    'https://mock-vue.vercel.app/',
    'https://generativeai-rag.streamlit.app/',
    'https://genetic-algorithm-multi-constraint.onrender.com/',
    'https://predictive-maintenance-hx97.onrender.com/',
    'https://ims-frontend-udaw.onrender.com/login',
]

_client: Optional[httpx.AsyncClient] = None


@asynccontextmanager
async def lifespan(_app: FastAPI):
    global _client
    _client = httpx.AsyncClient(headers=HEADERS, timeout=10, follow_redirects=True)
    yield
    await _client.aclose()


app = FastAPI(title='Shlok Bam portfolio API', version='2.0.0', docs_url=None, redoc_url=None, lifespan=lifespan)

_origins = [o.strip() for o in os.getenv('ALLOWED_ORIGINS', 'https://shlokbam.in,https://www.shlokbam.in,http://localhost:5173,http://127.0.0.1:5173').split(',') if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_origin_regex=os.getenv('ALLOWED_ORIGIN_REGEX', r'https://[a-z0-9-]+\.vercel\.app'),
    allow_methods=['GET', 'POST'],
    allow_headers=['Content-Type'],
    max_age=86400,
)

def client() -> httpx.AsyncClient:
    assert _client is not None
    return _client


# ---------------------------------------------------------------- rate limiting

_hits: Dict[str, Deque[float]] = defaultdict(deque)


def client_ip(request: Request) -> str:
    fwd = request.headers.get('x-forwarded-for')
    if fwd:
        return fwd.split(',')[0].strip()
    return request.client.host if request.client else 'unknown'


def rate_limited(bucket: str, request: Request, limit: int, window: int) -> bool:
    """Sliding-window limiter kept in memory (fine for a single Render instance)."""
    key = bucket + ':' + client_ip(request)
    now = time.time()
    q = _hits[key]
    while q and now - q[0] > window:
        q.popleft()
    if len(q) >= limit:
        return True
    q.append(now)
    return False


# ---------------------------------------------------------------- coding stats

LEETCODE_QUERY = """
query getUserStats($username: String!) {
  matchedUser(username: $username) {
    profile { ranking }
    submitStatsGlobal { acSubmissionNum { difficulty count } }
  }
  userContestRanking(username: $username) { rating globalRanking }
  userContestRankingHistory(username: $username) { attended rating }
}
"""


async def fetch_leetcode(username: str = 'shlokbam05') -> Optional[dict]:
    try:
        resp = await client().post(
            'https://leetcode.com/graphql',
            json={'query': LEETCODE_QUERY, 'variables': {'username': username}},
            headers={**HEADERS, 'Content-Type': 'application/json', 'Referer': 'https://leetcode.com'},
        )
        data = resp.json()['data']
        user = data['matchedUser']
        solved = {s['difficulty']: s['count'] for s in user['submitStatsGlobal']['acSubmissionNum']}
        contest = data.get('userContestRanking')
        history = [round(h['rating']) for h in (data.get('userContestRankingHistory') or []) if h.get('attended')]
        return {
            'total': solved.get('All', 0),
            'easy': solved.get('Easy', 0),
            'medium': solved.get('Medium', 0),
            'hard': solved.get('Hard', 0),
            'ranking': user['profile'].get('ranking', 'N/A'),
            'contestRating': round(contest['rating']) if contest and contest.get('rating') else 'N/A',
            'contestRanking': contest.get('globalRanking', 'N/A') if contest else 'N/A',
            'ratingHistory': history,
        }
    except Exception as exc:  # network errors, schema changes
        log.warning('leetcode fetch failed: %s', exc)
        return None


async def fetch_codechef(handle: str = 'shlokbam') -> Optional[dict]:
    try:
        resp = await client().get(f'https://www.codechef.com/users/{handle}', headers=HTML_HEADERS)
        if resp.status_code != 200:
            return None
        html = resp.text
        rating = re.search(r'rating-number">[\s\n]*(\d+)[\s\n]*<', html)
        stars_block = re.search(r'rating-star">([\s\S]*?)</div>', html)
        stars = len(re.findall(r'★|&#9733;', stars_block.group(1))) if stars_block else None
        rank = re.search(r'<strong>\s*(\d+)\s*</strong>[\s\S]*?Global Rank', html)
        highest = re.search(r'\(Highest Rating (\d+)\)', html)
        history: List[int] = []
        m = re.search(r'var all_rating\s*=\s*(.*?);', html)
        if m:
            try:
                history = [int(r.get('rating', 0)) for r in json.loads(m.group(1))]
            except Exception:
                pass
        return {
            'rating': rating.group(1) if rating else 'N/A',
            'stars': f'{stars}★' if stars else 'N/A',
            'globalRank': rank.group(1) if rank else 'N/A',
            'highestRating': highest.group(1) if highest else 'N/A',
            'ratingHistory': history,
        }
    except Exception as exc:
        log.warning('codechef fetch failed: %s', exc)
        return None


async def fetch_github(username: str = 'shlokbam') -> Optional[dict]:
    try:
        api_resp, cont_resp = await asyncio.gather(
            client().get(f'https://api.github.com/users/{username}'),
            client().get(f'https://github.com/users/{username}/contributions', headers=HTML_HEADERS),
        )
        user = api_resp.json() if api_resp.status_code == 200 else {}
        html = cont_resp.text if cont_resp.status_code == 200 else ''
        total = re.search(r'([0-9,]+)\s+contributions', html)
        # the calendar is laid out row by row (one row per weekday), so join each cell's date to
        # its tooltip by id and sort, rather than trusting document order
        dates = dict(re.findall(r'data-date="(\d{4}-\d\d-\d\d)"\s+id="([\w-]+)"', html))
        dates = {cid: d for d, cid in dates.items()}
        counts = {}
        for cid, n in re.findall(r'for="([\w-]+)"[^>]*>\s*(\d+|No) contributions? on', html):
            if cid in dates:
                counts[dates[cid]] = 0 if n == 'No' else int(n)
        days = sorted(counts.items())[-182:]  # last 26 weeks
        if not user and not total:
            return None
        return {
            'repos': user.get('public_repos', '--'),
            'followers': user.get('followers', '--'),
            'contributions': total.group(1) if total else '--',
            'contributionStart': days[0][0] if days else None,
            'contributionDays': [n for _, n in days],
        }
    except Exception as exc:
        log.warning('github fetch failed: %s', exc)
        return None


_stats_cache: dict = {'data': None, 'at': 0.0}
_stats_lock = asyncio.Lock()


@app.get('/api/stats')
async def api_stats():
    async with _stats_lock:
        now = time.time()
        if _stats_cache['data'] and now - _stats_cache['at'] < STATS_TTL:
            return {'success': True, 'data': _stats_cache['data'], 'cached': True}
        lc, cc, gh = await asyncio.gather(fetch_leetcode(), fetch_codechef(), fetch_github())
        prev = _stats_cache['data'] or {}
        # keep the last good value for any source that failed this time
        data = {
            'leetcode': lc or prev.get('leetcode'),
            'codechef': cc or prev.get('codechef'),
            'github': gh or prev.get('github'),
            'fetched_at': datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC'),
        }
        if lc or cc or gh:
            _stats_cache.update(data=data, at=now)
        return {'success': True, 'data': data, 'cached': False}


# ---------------------------------------------------------------- live demo availability

_avail_cache: dict = {'data': None, 'at': 0.0}


async def _check(url: str) -> str:
    """'online', 'sleeping' (slow to answer or a 502/503/504: a free-tier host spinning up; opening it wakes it)
    or 'down' (refused, DNS failure or another server error)."""
    try:
        resp = await client().head(url, timeout=6)
        if resp.status_code >= 400:
            resp = await client().get(url, timeout=6)
    except httpx.TimeoutException:
        return 'sleeping'
    except Exception:
        return 'down'
    if resp.status_code in (502, 503, 504):
        return 'sleeping'
    return 'online' if resp.status_code < 500 else 'down'


@app.get('/api/availability')
async def api_availability():
    now = time.time()
    # a sleeping demo is woken by this very check, so re-check those after 90 s instead of 10 min
    ttl = 90 if _avail_cache['data'] and 'sleeping' in _avail_cache['data'].values() else AVAILABILITY_TTL
    if _avail_cache['data'] and now - _avail_cache['at'] < ttl:
        return {'success': True, 'statuses': _avail_cache['data'], 'cached': True}
    results = await asyncio.gather(*(_check(u) for u in LIVE_PROJECTS))
    statuses = dict(zip(LIVE_PROJECTS, results))
    _avail_cache.update(data=statuses, at=now)
    return {'success': True, 'statuses': statuses, 'cached': False}


# ---------------------------------------------------------------- shipping (recent commits)

SHIPPING_TTL = 30 * 60
GITHUB_USER = os.getenv('GITHUB_USER', 'shlokbam')
# commits made by schedules and bots, not by hand: the daily DailyDiff brief, the profile-image refresh, merges
SHIP_SKIP = re.compile(os.getenv('SHIP_SKIP', r'^(daily: publish|chore: refresh profile|merge (branch|pull request)|initial commit$)'), re.I)
SHIP_SKIP_REPOS = {r.strip().lower() for r in os.getenv('SHIP_SKIP_REPOS', GITHUB_USER).split(',') if r.strip()}  # the profile README repo
_ship_cache: dict = {'data': None, 'at': 0.0}


async def fetch_shipping() -> Optional[dict]:
    """One search call for the last 30 days of commits authored by GITHUB_USER (public repos only)."""
    since = datetime.fromtimestamp(time.time() - 30 * 86400, timezone.utc).strftime('%Y-%m-%d')
    try:
        resp = await client().get(
            'https://api.github.com/search/commits',
            params={'q': f'author:{GITHUB_USER} author-date:>={since}', 'sort': 'author-date', 'order': 'desc', 'per_page': 100},
            headers={**HEADERS, 'Accept': 'application/vnd.github+json'},
        )
        if resp.status_code != 200:
            log.warning('github commit search: %s', resp.status_code)
            return None
        commits = []
        for item in resp.json().get('items', []):
            repo = item['repository']['name']
            msg = (item['commit']['message'] or '').split('\n', 1)[0].strip()
            if len(item.get('parents') or []) > 1 or repo.lower() in SHIP_SKIP_REPOS or not msg or SHIP_SKIP.search(msg):
                continue
            commits.append({'repo': repo, 'message': msg[:120], 'date': item['commit']['author']['date'], 'url': item['html_url']})
        commits.sort(key=lambda c: datetime.fromisoformat(c['date'].replace('Z', '+00:00')), reverse=True)
        week = time.time() - 7 * 86400
        recent = [c for c in commits if datetime.fromisoformat(c['date'].replace('Z', '+00:00')).timestamp() >= week]
        return {'week': len(recent), 'weekRepos': len({c['repo'] for c in recent}), 'month': len(commits), 'commits': commits[:12]}
    except Exception as exc:
        log.warning('github commit search failed: %s', exc)
        return None


@app.get('/api/shipping')
async def api_shipping():
    now = time.time()
    if _ship_cache['data'] and now - _ship_cache['at'] < SHIPPING_TTL:
        return {'success': True, 'data': _ship_cache['data'], 'cached': True}
    data = await fetch_shipping()
    if data:
        _ship_cache.update(data=data, at=now)
    elif _ship_cache['data']:
        data = _ship_cache['data']  # GitHub hiccup: keep showing the last good list
    return {'success': bool(data), 'data': data, 'cached': False}


# ---------------------------------------------------------------- chat

_chat_count = {'n': int(os.getenv('CHAT_COUNT_START', '247'))}


class ChatTurn(BaseModel):
    role: str
    content: str


class ChatIn(BaseModel):
    message: str = Field(..., max_length=500)
    history: List[ChatTurn] = Field(default_factory=list, max_length=12)


SOURCES_LINE = re.compile(r'\n?[ \t*_`]*sources?\s*:\s*([^\n]*)[`*_]*\s*$', re.I)


def split_sources(reply: str):
    """Take the closing `Sources: id, id` line off a reply (prompt rule 8) and turn known ids into
    {label, href} links; unknown ids and `none` are dropped, so a sloppy line never shows up as a broken link."""
    m = SOURCES_LINE.search(reply)
    if not m:
        return reply, []
    out, seen = [], set()
    for sid in re.split(r'[,\s]+', m.group(1).lower()):
        sid = sid.strip('`*_.[]()')
        if sid in SECTIONS and sid not in seen:
            seen.add(sid)
            label, href = SECTIONS[sid]
            out.append({'label': label, 'href': href})
    # a specific section (Work › PaisaWise) is more useful than a whole page (Work), so it goes first
    out.sort(key=lambda src: '›' not in src['label'] and '#' not in src['href'])
    return reply[:m.start()].rstrip(), out[:3]


@app.get('/api/chat/stats')
async def chat_stats():
    return {'success': True, 'count': _chat_count['n']}


@app.post('/api/chat')
async def api_chat(body: ChatIn, request: Request):
    message = body.message.strip()
    if not message:
        raise HTTPException(400, 'Message is empty')
    if rate_limited('chat', request, limit=12, window=60):
        return JSONResponse({'success': False, 'reply': "You're asking quickly! Give me a few seconds and try again."}, status_code=429)

    api_key = os.getenv('GROQ_API_KEY')
    if not api_key:
        return {'success': True, 'reply': "My AI brain isn't configured right now. Please email Shlok directly at shlokbam19103@gmail.com."}

    history = [
        {'role': t.role, 'content': t.content[:1500]}
        for t in body.history[-6:]
        if t.role in ('user', 'assistant') and t.content.strip()
    ]
    messages = [{'role': 'system', 'content': SYSTEM_PROMPT}, *history, {'role': 'user', 'content': message}]
    reply = None
    for model in GROQ_MODELS:
        payload = {'model': model, 'messages': messages, 'temperature': 0.4, 'max_tokens': 1200}
        if model.startswith('openai/gpt-oss'):
            payload.update(reasoning_effort='low', include_reasoning=False)
        elif model.startswith('qwen/'):
            payload.update(reasoning_format='hidden')
        try:
            resp = await client().post(
                'https://api.groq.com/openai/v1/chat/completions',
                json=payload,
                headers={'Authorization': f'Bearer {api_key}', 'Content-Type': 'application/json'},
                timeout=25,
            )
        except Exception as exc:
            log.warning('groq %s request failed: %s', model, exc)
            continue
        if resp.status_code in (429, 404, 503):
            log.warning('groq %s unavailable (%s), trying next model', model, resp.status_code)
            continue
        try:
            resp.raise_for_status()
            reply = resp.json()['choices'][0]['message']['content'] or ''
            reply = re.sub(r'<think>.*?</think>', '', reply, flags=re.S).strip()
            # the site's style has no em dashes; the prompt asks for none, this catches any that slip through
            reply = re.sub(r'\s*—\s*', ', ', reply).replace(', ,', ',')
            reply, sources = split_sources(reply)
        except Exception as exc:
            log.warning('groq %s bad response: %s', model, exc)
            continue
        if reply:
            break
    if not reply:
        return JSONResponse(
            {'success': False, 'reply': "Sorry, I couldn't reach my brain just now. Please try again in a moment, or email Shlok at shlokbam19103@gmail.com."},
            status_code=502,
        )
    _chat_count['n'] += 1
    return {'success': True, 'reply': reply, 'sources': sources, 'count': _chat_count['n']}


# ---------------------------------------------------------------- contact (fallback relay)

EMAIL_RE = re.compile(r'^[^\s@]+@[^\s@]+\.[^\s@]+$')


class ContactIn(BaseModel):
    name: str = Field(..., max_length=120)
    email: str = Field(..., max_length=200)
    message: str = Field(..., max_length=5000)
    company: str = Field('', max_length=160)
    topic: str = Field('General', max_length=60)
    website: str = Field('', max_length=200)  # honeypot: real people leave it empty


@app.post('/api/contact')
async def api_contact(body: ContactIn, request: Request):
    if body.website:
        return {'success': True, 'message': 'Thanks!'}
    name, email, message = body.name.strip(), body.email.strip(), body.message.strip()
    if not name or not message or not EMAIL_RE.match(email):
        return JSONResponse({'success': False, 'message': 'Please add your name, a valid email and a message.'}, status_code=400)
    if rate_limited('contact', request, limit=5, window=600):
        return JSONResponse({'success': False, 'message': 'Too many messages. Please try again in a few minutes.'}, status_code=429)

    access_key = os.getenv('WEB3FORMS_ACCESS_KEY')
    if not access_key:
        return JSONResponse({'success': False, 'message': 'The contact form is not configured. Please email shlokbam19103@gmail.com.'}, status_code=503)
    payload = {
        'access_key': access_key,
        'subject': f'Portfolio: {body.topic} · {name}',
        'from_name': 'Shlok Bam Portfolio',
        'name': name,
        'email': email,
        'replyto': email,
        'company': body.company.strip() or '-',
        'topic': body.topic,
        'message': message,
    }
    try:
        resp = await client().post('https://api.web3forms.com/submit', json=payload, timeout=10)
        ok = resp.status_code == 200 and resp.json().get('success')
    except Exception as exc:
        log.warning('web3forms relay failed: %s', exc)
        ok = False
    if not ok:
        return JSONResponse({'success': False, 'message': 'Something went wrong sending that. Please email shlokbam19103@gmail.com directly.'}, status_code=502)
    log.info('contact message relayed (topic=%s)', body.topic)
    return {'success': True, 'message': "Message received! I'll get back to you soon."}


@app.get('/api/health')
async def health():
    return {'ok': True}


# ---------------------------------------------------------------- old v1 address -> v2 site
# This service also answers on the address the v1 portfolio lived at. Anyone opening an old
# link is sent (301) to the same place on the new site, and the v1 service worker that cached
# the old pages in returning visitors' browsers is replaced by one that removes itself.

SITE_URL = os.getenv('SITE_URL', 'https://shlokbam.in').rstrip('/')
V2_PAGES = {'about', 'work', 'work/dailydiff', 'journey', 'recognition', 'community', 'writing', 'contact'}
V1_MOVED = {
    'download-resume': '/static/Resume/Shlok_Bam_Resume.pdf',
    'static/Resume/Shlok_Bam_VIT.pdf': '/static/Resume/Shlok_Bam_Resume.pdf',
}
KILL_SW = """// Retired v1 service worker: clear its caches, unregister, reload into the new site.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil((async () => {
  for (const key of await caches.keys()) await caches.delete(key);
  await self.registration.unregister();
  for (const client of await self.clients.matchAll({ type: 'window' })) client.navigate(client.url);
})()));
"""


@app.get('/service-worker.js')
async def retired_service_worker():
    return Response(KILL_SW, media_type='application/javascript', headers={'Cache-Control': 'no-cache, no-store'})


def _to_site(path: str) -> str:
    path = path.strip('/')
    if path in V1_MOVED:
        return SITE_URL + V1_MOVED[path]
    if path.startswith(('certifications/', 'hackathons/')):
        return SITE_URL + '/recognition'
    if path in V2_PAGES or path.startswith('static/'):
        return SITE_URL + '/' + path
    return SITE_URL + '/'


@app.api_route('/', methods=['GET', 'HEAD'])
async def root():
    return RedirectResponse(SITE_URL + '/', status_code=301)


@app.api_route('/{path:path}', methods=['GET', 'HEAD'])
async def old_links(path: str):
    if path.startswith('api/'):
        return JSONResponse({'detail': 'Not Found'}, status_code=404)
    return RedirectResponse(_to_site(path), status_code=301)
