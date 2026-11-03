"""The portfolio as an MCP server: anyone can connect it to their AI assistant (Claude, ChatGPT, Cursor…)
at https://shlokbam.in/mcp and ask about Shlok. The tools only return facts; the visitor's own AI writes
the answer. Every tool reads the live site content (content.py), so it is always as current as the site.

All tools are read-only and need no sign-in. main.py mounts this at /mcp (stateless Streamable HTTP).
"""
import logging
import re
from typing import Annotated, Awaitable, Callable, Optional

from pydantic import Field
from mcp.server.mcpserver import MCPServer
from mcp.types import ToolAnnotations

log = logging.getLogger('portfolio')

INSTRUCTIONS = """
Facts about Shlok Bam, an AI / Generative AI engineer from Pune, India, straight from his portfolio
(https://shlokbam.in), always current. Use these tools whenever the user asks about Shlok: his projects,
experience, skills, patents, awards, certifications, writing, availability or how to contact him.
Start with get_profile for an overview, list_projects or get_project for his work, and search for anything
specific. Answer only from what the tools return, and include the links they give so the user can check.
""".strip()

READ_ONLY = ToolAnnotations(read_only_hint=True, destructive_hint=False, idempotent_hint=True, open_world_hint=False)


def _norm(s: str) -> str:
    return re.sub(r'[^a-z0-9]+', ' ', (s or '').lower()).strip()


def _project_card(p: dict) -> dict:
    """The short form used in lists."""
    return {'name': p['title'], 'slug': p['slug'], 'flagship': p['flagship'], 'field': p['field'], 'summary': p['summary'],
            'tech': p['tech'], 'live': p['links']['live'], 'code': p['links']['code'], 'page': p['links']['page']}


def build(get_content: Callable[[], Awaitable[dict]], fetch_activity: Callable[[], Awaitable[Optional[dict]]]) -> MCPServer:
    """The server. `get_content` returns the portfolio content; `fetch_activity` recent GitHub commits (or None)."""
    mcp = MCPServer(
        name='shlok-bam-portfolio',
        title="Shlok Bam's portfolio",
        description='Ask your AI about Shlok Bam: projects, experience, skills, patents, awards and contact details, always current.',
        instructions=INSTRUCTIONS,
        website_url='https://shlokbam.in',
        version='1.0.0',
    )

    def tool(fn):
        """Register a read-only tool and log each call (the tool name only, never what was asked)."""
        async def logged(*args, **kwargs):
            log.info('mcp tool: %s', fn.__name__)
            return await fn(*args, **kwargs)
        logged.__name__, logged.__doc__, logged.__annotations__ = fn.__name__, fn.__doc__, fn.__annotations__
        logged.__wrapped__ = fn
        return mcp.tool(annotations=READ_ONLY)(logged)

    @tool
    async def get_profile() -> dict:
        """Overview of Shlok Bam: who he is, current role, education, location, what he is open to, contact
        details, links (résumé, LinkedIn, GitHub…), what he is focused on this month, and headline numbers.
        Call this first for any general question about him."""
        d = await get_content()
        pr = d['profile']
        return {
            'name': pr['name'], 'title': pr['title'], 'summary': pr['summary'], 'inHisWords': pr['tagline'],
            'current': pr['current'], 'education': pr['education'], 'focus': pr['focus'],
            'location': pr['location'], 'timezone': pr['timezone'], 'openToRelocation': pr['relocation'], 'openTo': pr['openTo'],
            'personality': pr['personality'], 'story': [{'chapter': k, 'text': v} for k, v in pr['story']],
            'atAGlance': {'projects': len(d['projects']), 'patents': len(d['patents']), **pr['stats']},
            'rightNow': d['now'], 'contact': pr['contact'], 'links': pr['links'],
            'flagshipProjects': [p['title'] for p in d['projects'] if p['flagship']],
            'contentUpdated': d['updated'],
        }

    @tool
    async def list_projects(
        tech: Annotated[str, Field(description='Only projects using this technology, e.g. "LangGraph", "React", "AWS". Leave empty for all.')] = '',
        category: Annotated[str, Field(description='Only this kind of project: "ai", "web", "devops" or "cloud". Leave empty for all.')] = '',
        flagship_only: Annotated[bool, Field(description='Only the five flagship projects.')] = False,
    ) -> dict:
        """List Shlok's projects (all 21, in order of importance), each with a one-line summary, tech stack and
        links. Filter by technology or category. Use get_project for the full details of one project."""
        d = await get_content()
        items = d['projects']
        if flagship_only:
            items = [p for p in items if p['flagship']]
        if category.strip():
            items = [p for p in items if category.strip().lower() in p['categories']]
        if tech.strip():
            t = _norm(tech)
            items = [p for p in items if any(t in _norm(x) for x in p['tech']) or t in _norm(p['details'] + ' ' + p['summary'])]
        return {'count': len(items), 'total': len(d['projects']), 'projects': [_project_card(p) for p in items]}

    @tool
    async def get_project(
        name: Annotated[str, Field(description='The project name or slug, e.g. "DailyDiff", "PaisaWise", "enterprise-workforce-training-platform".')],
    ) -> dict:
        """Everything about one of Shlok's projects: what it does, how it is built, results and metrics, tech
        stack, and links to the live demo, code, write-up and its page on the portfolio. Accepts the project
        name, its slug or its GitHub repository name."""
        d = await get_content()
        q = _norm(name)
        repo = lambda p: _norm(p['links']['code'].rstrip('/').rsplit('/', 1)[-1]) if p['links']['code'] else ''
        exact = [p for p in d['projects'] if q in (_norm(p['title']), _norm(p['slug']), repo(p))]
        loose = [p for p in d['projects'] if q and (q in _norm(p['title']) or _norm(p['title']) in q)]
        found = (exact or loose or [None])[0]
        if not found:
            return {'error': f'No project called "{name}".', 'projects': [p['title'] for p in d['projects']]}
        p = found
        out = {**_project_card(p), 'rank': p['rank'], 'badge': p['badge'], 'categories': p['categories'],
               'details': p['details'] or p['summary'], 'highlights': p['highlights'], 'links': p['links']}
        if p['slug'] == 'dailydiff':
            out['caseStudy'] = p['links']['page']
        return out

    @tool
    async def get_experience() -> dict:
        """Shlok's work experience (internships), leadership roles (student clubs) and education, newest first,
        with what he did in each and links to the organisations and certificates."""
        d = await get_content()
        return {'experience': d['experience'], 'leadership': d['leadership'], 'education': d['education'], 'page': d['site'] + '/journey'}

    @tool
    async def get_achievements(
        kind: Annotated[str, Field(description='"patents", "awards", "certifications" or "community". Leave empty for all.')] = '',
    ) -> dict:
        """Shlok's patents (three, as co-inventor), awards and hackathon wins, certifications, and community work
        (mentoring, volunteering), with links to the actual certificates and documents."""
        d = await get_content()
        parts = {'patents': d['patents'], 'awards': d['awards'], 'certifications': d['certifications'], 'community': d['community']}
        k = kind.strip().lower()
        if k in parts:
            parts = {k: parts[k]}
        return {**parts, 'page': d['site'] + ('/community' if k == 'community' else '/recognition')}

    @tool
    async def get_skills() -> dict:
        """Shlok's skills by group (Generative AI, LLM evaluation, ML, languages, web, databases, cloud & DevOps,
        core CS), each rated core, strong, working or exploring, plus which projects use each skill."""
        d = await get_content()
        groups = []
        for g in d['skills']:
            skills = []
            for s in g['skills']:
                n = _norm(s['name'])
                used = [p['title'] for p in d['projects'] if any(n == _norm(t) or n in _norm(t) for t in p['tech']) or (len(n) > 3 and n in _norm(p['details']))]
                skills.append({**s, 'usedIn': used[:6]})
            groups.append({'group': g['group'], 'skills': skills})
        return {'skills': groups, 'page': d['site'] + '/about#toolkit'}

    @tool
    async def get_writing(
        topic: Annotated[str, Field(description='Only posts on this topic, e.g. "Agents", "RAG", "DevOps". Leave empty for all.')] = '',
    ) -> dict:
        """Shlok's technical blog posts (his journal), newest first, with links."""
        d = await get_content()
        posts = d['writing']
        if topic.strip():
            t = _norm(topic)
            posts = [w for w in posts if t in _norm(w['topic'] + ' ' + w['title'] + ' ' + w['summary'])]
        return {'count': len(posts), 'posts': posts, 'journal': d['profile']['links']['journal']}

    @tool
    async def get_resume() -> dict:
        """Links to Shlok's résumé (PDF download and web version) with a short summary of what it covers."""
        d = await get_content()
        pr = d['profile']
        return {'pdf': pr['links']['resumePdf'], 'web': pr['links']['resumePage'], 'name': pr['name'], 'title': pr['title'],
                'summary': pr['summary'], 'current': pr['current'], 'education': pr['education'],
                'note': 'The web version has the same content as the PDF.'}

    @tool
    async def get_activity() -> dict:
        """What Shlok has been building lately: his recent commits to public GitHub repositories (live)."""
        a = await fetch_activity()
        if not a:
            return {'error': 'GitHub activity is unavailable right now.', 'github': 'https://github.com/shlokbam'}
        return {'commitsLast7Days': a['week'], 'reposLast7Days': a['weekRepos'], 'commitsLast30Days': a['month'],
                'recent': a['commits'], 'github': 'https://github.com/shlokbam'}

    @tool
    async def search(
        query: Annotated[str, Field(description='What to look for, e.g. "RAG", "Terraform", "hackathon", "PharmaACE", "patent granted".')],
    ) -> dict:
        """Search everything about Shlok (projects, experience, leadership, patents, awards, certifications,
        community, writing) for a word or topic. Returns the best matches with links."""
        d = await get_content()
        words = [w for w in _norm(query).split() if len(w) > 1]
        if not words:
            return {'results': []}
        docs = []
        for p in d['projects']:
            docs.append(('project', p['title'], p['summary'], p['links']['page'], ' '.join([p['title'], p['summary'], p['details'], ' '.join(p['tech']), ' '.join(p['highlights'])]), 2 if p['flagship'] else 1))
        for kind in ('experience', 'leadership', 'education'):
            for it in d[kind]:
                docs.append((kind, f"{it['role']}, {it['organisation']}", ' '.join(it['points'])[:220], d['site'] + '/journey', ' '.join([it['role'], it['organisation'], it['when'], ' '.join(it['points'])]), 1.5))
        for p in d['patents']:
            docs.append(('patent', p['title'], f"{p['status']}, {p['office']}. {p['summary']}"[:220], p['document'], ' '.join(p.values()), 1.5))
        for a in d['awards']:
            docs.append(('award', a['title'], a['summary'], d['site'] + '/recognition#stage', ' '.join([a['title'], a['organiser'], a['summary']]), 1.5))
        for c in d['certifications']:
            docs.append(('certification', c['title'], f"{c['issuer']}, {c['date']}", c['url'], ' '.join([c['title'], c['issuer'], c['summary']]), 1))
        for c in d['community']:
            docs.append(('community', c['title'], c['summary'][:220], d['site'] + '/community', ' '.join([c['title'], c['role'], c['summary'], ' '.join(c['tags'])]), 1))
        for w in d['writing']:
            docs.append(('post', w['title'], w['summary'], w['url'], ' '.join([w['title'], w['topic'], w['summary']]), 1))
        scored = []
        for kind, title, snippet, url, text, weight in docs:
            body, head = ' ' + _norm(text) + ' ', ' ' + _norm(title) + ' '
            hits = sum(body.count(' ' + w) for w in words)
            if not hits:
                continue
            score = (hits + 3 * sum((' ' + w) in head for w in words) + (5 if _norm(query) in _norm(text) else 0)) * weight
            scored.append((score, {'type': kind, 'title': title, 'snippet': snippet, 'url': url}))
        scored.sort(key=lambda x: -x[0])
        return {'query': query, 'results': [r for _, r in scored[:8]]}

    return mcp
