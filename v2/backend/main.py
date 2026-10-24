"""FastAPI backend for shlokbam.dev v2.

Endpoints
  GET  /api/health         liveness probe for Render
  GET  /api/stats          LeetCode / CodeChef / GitHub numbers (cached 2 h)
  GET  /api/availability   online/offline state of the live project demos (cached 10 min)
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
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from knowledge import SYSTEM_PROMPT


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
            'repos': user.get('public_repos', '—'),
            'followers': user.get('followers', '—'),
            'contributions': total.group(1) if total else '—',
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


async def _check(url: str) -> bool:
    try:
        resp = await client().head(url, timeout=6)
        if resp.status_code >= 400:
            resp = await client().get(url, timeout=6)
        return resp.status_code < 500
    except Exception:
        return False


@app.get('/api/availability')
async def api_availability():
    now = time.time()
    if _avail_cache['data'] and now - _avail_cache['at'] < AVAILABILITY_TTL:
        return {'success': True, 'statuses': _avail_cache['data'], 'cached': True}
    results = await asyncio.gather(*(_check(u) for u in LIVE_PROJECTS))
    statuses = {u: ('online' if ok else 'offline') for u, ok in zip(LIVE_PROJECTS, results)}
    _avail_cache.update(data=statuses, at=now)
    return {'success': True, 'statuses': statuses, 'cached': False}


# ---------------------------------------------------------------- chat

_chat_count = {'n': int(os.getenv('CHAT_COUNT_START', '247'))}


class ChatTurn(BaseModel):
    role: str
    content: str


class ChatIn(BaseModel):
    message: str = Field(..., max_length=500)
    history: List[ChatTurn] = Field(default_factory=list, max_length=12)


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
        return {'success': True, 'reply': "My AI brain isn't configured right now — please email Shlok directly at shlokbam19103@gmail.com."}

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
        except Exception as exc:
            log.warning('groq %s bad response: %s', model, exc)
            continue
        if reply:
            break
    if not reply:
        return JSONResponse(
            {'success': False, 'reply': "Sorry — I couldn't reach my brain just now. Please try again in a moment, or email Shlok at shlokbam19103@gmail.com."},
            status_code=502,
        )
    _chat_count['n'] += 1
    return {'success': True, 'reply': reply, 'count': _chat_count['n']}


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
        return JSONResponse({'success': False, 'message': 'Too many messages — please try again in a few minutes.'}, status_code=429)

    access_key = os.getenv('WEB3FORMS_ACCESS_KEY')
    if not access_key:
        return JSONResponse({'success': False, 'message': 'The contact form is not configured. Please email shlokbam19103@gmail.com.'}, status_code=503)
    payload = {
        'access_key': access_key,
        'subject': f'Portfolio: {body.topic} — {name}',
        'from_name': 'Shlok Bam Portfolio',
        'name': name,
        'email': email,
        'replyto': email,
        'company': body.company.strip() or '—',
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


@app.get('/')
async def root():
    return {'service': 'shlokbam portfolio api', 'ok': True}
