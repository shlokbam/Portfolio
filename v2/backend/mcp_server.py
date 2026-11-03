"""The portfolio as an MCP server: anyone can connect it to their AI assistant (Claude, ChatGPT, Cursor…)
at https://shlokbam.in/mcp and ask about Shlok. The tools only return facts; the visitor's own AI writes
the answer. Every tool reads the live site content (content.py), so it is always as current as the site.

All tools are read-only and need no sign-in. main.py mounts this at /mcp (stateless Streamable HTTP).
"""
import logging
import re
from typing import Annotated, Awaitable, Callable, Literal, Optional

from pydantic import Field
from mcp.server.mcpserver import MCPServer
from mcp.types import ToolAnnotations

log = logging.getLogger('portfolio')

INSTRUCTIONS = """
Facts about Shlok Bam, an AI / Generative AI engineer from Pune, India, straight from his portfolio
(https://shlokbam.in), always current. Use these tools whenever the user asks about Shlok: his projects,
experience, skills, patents, awards, certifications, writing, availability or how to contact him.
Start with get_profile for an overview, list_projects or get_project for his work, and search_portfolio for
anything specific. Answer only from what the tools return, and include the links they give so the user can check.
Pay (salary, stipend, expected CTC) and details of client work at PharmaACE are not shared here: say so and
suggest emailing him (shlokbam19103@gmail.com) rather than guessing. If something isn't covered, say that
plainly; never fill gaps with assumptions.
""".strip()



def _norm(s: str) -> str:
    return re.sub(r'[^a-z0-9]+', ' ', (s or '').lower()).strip()


def _repo_name(p: dict) -> str:
    """github.com/shlokbam/<repo>[/tree/...] -> <repo> ('' when the code isn't on GitHub)."""
    parts = p['links']['code'].split('github.com/', 1)
    return parts[1].split('/')[1].lower() if len(parts) == 2 and parts[1].count('/') >= 1 else ''


def _github(p: dict, repos: Optional[list]) -> Optional[dict]:
    """Live details of the project's repository, from the GitHub API."""
    r = next((r for r in repos or [] if r['name'].lower() == _repo_name(p)), None)
    return r and {'stars': r['stars'], 'language': r['language'], 'topics': r['topics'], 'lastUpdated': r['updated'], 'created': r['created']}


def _project_card(p: dict, repos: Optional[list] = None) -> dict:
    """The short form used in lists."""
    card = {'name': p['title'], 'slug': p['slug'], 'flagship': p['flagship'], 'field': p['field'], 'summary': p['summary'],
            'tech': p['tech'], 'live': p['links']['live'], 'code': p['links']['code'], 'page': p['links']['page']}
    gh = _github(p, repos)
    if gh:
        card['github'] = gh
    return card


def build(get_content: Callable[[], Awaitable[dict]], fetch_activity: Callable[[], Awaitable[Optional[dict]]],
          fetch_repos: Callable[[], Awaitable[Optional[list]]]) -> MCPServer:
    """The server. `get_content` returns the portfolio content, `fetch_activity` recent GitHub commits and
    `fetch_repos` the public GitHub repositories (both None when GitHub can't be reached)."""
    mcp = MCPServer(
        name='shlok-bam-portfolio',
        title="Shlok Bam's portfolio",
        description='Ask your AI about Shlok Bam: projects, experience, skills, patents, awards and contact details, always current.',
        instructions=INSTRUCTIONS,
        website_url='https://shlokbam.in',
        version='1.1.0',
    )

    def tool(title: str):
        """Register a read-only tool with a human title, and log each call (the tool name only, never what was asked)."""
        def register(fn):
            async def logged(*args, **kwargs):
                log.info('mcp tool: %s', fn.__name__)
                return await fn(*args, **kwargs)
            logged.__name__, logged.__doc__, logged.__annotations__ = fn.__name__, fn.__doc__, fn.__annotations__
            logged.__wrapped__ = fn
            hints = ToolAnnotations(title=title, read_only_hint=True, destructive_hint=False, idempotent_hint=True, open_world_hint=False)
            return mcp.tool(title=title, annotations=hints)(logged)
        return register

    @tool('Profile overview')
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

    @tool('List projects')
    async def list_projects(
        tech: Annotated[str, Field(description='Only projects using this technology, e.g. "LangGraph", "React", "AWS". Leave empty for all.')] = '',
        category: Annotated[Literal['all', 'ai', 'web', 'devops', 'cloud'], Field(description='Only this kind of project, or "all".')] = 'all',
        flagship_only: Annotated[bool, Field(description='Only the five flagship projects.')] = False,
        include_other_repos: Annotated[bool, Field(description="Also list his public GitHub repositories that the portfolio doesn't feature.")] = False,
    ) -> dict:
        """List Shlok's projects (all of them, in order of importance), each with a one-line summary, tech stack,
        links and live GitHub details (stars, language, last update). Filter by technology or category. Use
        get_project for the full details of one project."""
        d = await get_content()
        repos = await fetch_repos()
        items = d['projects']
        if flagship_only:
            items = [p for p in items if p['flagship']]
        if category != 'all':
            items = [p for p in items if category in p['categories']]
        if tech.strip():
            t = _norm(tech)
            items = [p for p in items if any(t in _norm(x) for x in p['tech']) or t in _norm(p['details'] + ' ' + p['summary'])]
        out = {'count': len(items), 'total': len(d['projects']), 'projects': [_project_card(p, repos) for p in items]}
        if include_other_repos:
            featured = {_repo_name(p) for p in d['projects']}
            out['otherRepos'] = [r for r in repos or [] if r['name'].lower() not in featured and not r['fork']]
        return out

    @tool('Project details')
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
        repos = await fetch_repos()
        if not found:
            repo = next((r for r in repos or [] if _norm(r['name']) == q and not r['fork']), None)
            if repo:
                return {**repo, 'note': "A public GitHub repository of Shlok's that the portfolio doesn't feature; only GitHub's details are known."}
            return {'error': f'No project called "{name}".', 'projects': [p['title'] for p in d['projects']]}
        p = found
        out = {**_project_card(p, repos), 'rank': p['rank'], 'badge': p['badge'], 'categories': p['categories'],
               'details': p['details'] or p['summary'], 'highlights': p['highlights'], 'links': p['links']}
        if p['slug'] == 'dailydiff':
            out['caseStudy'] = p['links']['page']
        return out

    @tool('Experience, leadership and education')
    async def get_experience() -> dict:
        """Shlok's work experience (internships), leadership roles (student clubs) and education, newest first,
        with what he did in each and links to the organisations and certificates."""
        d = await get_content()
        return {'experience': d['experience'], 'leadership': d['leadership'], 'education': d['education'], 'page': d['site'] + '/journey'}

    @tool('Patents, awards and certifications')
    async def get_achievements(
        kind: Annotated[Literal['all', 'patents', 'awards', 'certifications', 'community'], Field(description='Which part to return, or "all".')] = 'all',
    ) -> dict:
        """Shlok's recognition and proof of work: patents (three, as co-inventor: title, status, office, reference
        number, summary, document link), awards and hackathon results (organiser, date, result, certificate links),
        certifications (issuer, date, certificate link) and community work (mentoring, volunteering, event anchoring).
        Use kind to get one part only."""
        d = await get_content()
        parts = {'patents': d['patents'], 'awards': d['awards'], 'certifications': d['certifications'], 'community': d['community']}
        k = kind
        if k in parts:
            parts = {k: parts[k]}
        return {**parts, 'page': d['site'] + ('/community' if k == 'community' else '/recognition')}

    @tool('Skills')
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

    @tool('Blog posts')
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

    @tool('Résumé')
    async def get_resume() -> dict:
        """Links to Shlok's résumé (PDF download and web version) with a short summary of what it covers."""
        d = await get_content()
        pr = d['profile']
        return {'pdf': pr['links']['resumePdf'], 'web': pr['links']['resumePage'], 'name': pr['name'], 'title': pr['title'],
                'summary': pr['summary'], 'current': pr['current'], 'education': pr['education'],
                'note': 'The web version has the same content as the PDF.'}

    @tool('Recent GitHub activity')
    async def get_activity() -> dict:
        """What Shlok has been building lately: his recent commits to public GitHub repositories (live)."""
        a = await fetch_activity()
        if not a:
            return {'error': 'GitHub activity is unavailable right now.', 'github': 'https://github.com/shlokbam'}
        return {'commitsLast7Days': a['week'], 'reposLast7Days': a['weekRepos'], 'commitsLast30Days': a['month'],
                'recent': a['commits'], 'github': 'https://github.com/shlokbam'}

    @tool('Search the portfolio')
    async def search_portfolio(
        query: Annotated[str, Field(description='What to look for, e.g. "RAG", "Terraform", "hackathon", "PharmaACE", "patent granted".')],
    ) -> dict:
        """Search everything in Shlok's portfolio (projects, experience, leadership, patents, awards, certifications,
        community, writing) for a word or topic. Returns up to 8 matches, best first, each with its type, title,
        a snippet and a link. Use it for specific questions the other tools don't answer directly."""
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

    # ---- prompts: ready-made questions an AI app can offer as buttons or slash commands

    @mcp.prompt(title='Evaluate Shlok for a role')
    def evaluate_for_role(
        role: Annotated[str, Field(description='The role, or paste the whole job description.')],
    ) -> str:
        """Assess how well Shlok Bam fits a role, with evidence from his portfolio."""
        return (f'Using the Shlok Bam portfolio tools, evaluate Shlok Bam for this role:\n\n{role}\n\n'
                'Call get_profile, then list_projects, get_skills and get_experience (and get_project for the most relevant '
                'projects). Reply with: a two-line verdict; the strongest evidence for each key requirement, each with a link; '
                'gaps or things the portfolio does not show, stated plainly; and three questions worth asking him. '
                'Use only what the tools return.')

    @mcp.prompt(title='Shlok in three lines')
    def summary() -> str:
        """A three-line summary of Shlok Bam for a recruiter or hiring manager."""
        return ('Using the Shlok Bam portfolio tools (start with get_profile), summarise Shlok Bam in exactly three lines '
                'for a recruiter: who he is and what he does now, his strongest proof of work, and what he is looking for. '
                'Then give his portfolio and résumé links.')

    @mcp.prompt(title='Interview questions on his projects')
    def interview_questions(
        project: Annotated[str, Field(description='A project to focus on, e.g. "DailyDiff". Leave empty for his flagships.')] = '',
    ) -> str:
        """Technical interview questions based on what Shlok actually built."""
        target = f'his project "{project}" (use get_project)' if project.strip() else 'his flagship projects (use list_projects with flagship_only, then get_project for each)'
        return (f'Using the Shlok Bam portfolio tools, read about {target}. Write 8 technical interview questions that test '
                'whether he really built and understands it: design choices, trade-offs, failure cases, evaluation and scaling. '
                'For each, say what a strong answer would cover. Base every question on details the tools return.')

    @mcp.prompt(title="What's Shlok up to lately?")
    def latest() -> str:
        """What Shlok is focused on this month and what he has shipped recently."""
        return ('Using the Shlok Bam portfolio tools, call get_profile (its rightNow section) and get_activity. Summarise what '
                'Shlok is focused on this month and what he has shipped in the last week, grouped by repository, with links.')

    return mcp
