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
anything specific, get_open_source for his contributions to other projects. Answer only from what the tools return, and include the links they give so the user can check.
Pay (salary, stipend, expected CTC) and details of client work at PharmaACE are not shared here: say so and
suggest emailing him (shlokbam19103@gmail.com) rather than guessing. If something isn't covered, say that
plainly; never fill gaps with assumptions.
""".strip()



def _norm(s: str) -> str:
    return re.sub(r'[^a-z0-9]+', ' ', (s or '').lower()).strip()


def _ts(iso: Optional[str]) -> float:
    from datetime import datetime
    return datetime.fromisoformat(iso.replace('Z', '+00:00')).timestamp() if iso else 0.0


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
          fetch_repos: Callable[[], Awaitable[Optional[list]]],
          fetch_open_source: Callable[[], Awaitable[Optional[dict]]]) -> MCPServer:
    """The server. `get_content` returns the portfolio content, `fetch_activity` recent GitHub commits,
    `fetch_repos` the public GitHub repositories and `fetch_open_source` pull requests to other people's
    repositories (the last three are None when GitHub can't be reached)."""
    mcp = MCPServer(
        name='shlok-bam-portfolio',
        title="Shlok Bam's portfolio",
        description='Ask your AI about Shlok Bam: projects, experience, skills, patents, awards and contact details, always current.',
        instructions=INSTRUCTIONS,
        website_url='https://shlokbam.in',
        version='1.3.0',
    )

    def tool(title: str, github: bool = False):
        """Register a read-only tool with a human title, and log each call (the tool name only, never what was asked).
        `github`: the tool also reads live data from GitHub's API, so it is marked open-world."""
        def register(fn):
            async def logged(*args, **kwargs):
                log.info('mcp tool: %s', fn.__name__)
                return await fn(*args, **kwargs)
            logged.__name__, logged.__doc__, logged.__annotations__ = fn.__name__, fn.__doc__, fn.__annotations__
            logged.__wrapped__ = fn
            hints = ToolAnnotations(title=title, read_only_hint=True, destructive_hint=False, idempotent_hint=True, open_world_hint=github)
            return mcp.tool(title=title, annotations=hints)(logged)
        return register

    @tool('Profile overview')
    async def get_profile() -> dict:
        """Overview of Shlok Bam: summary, current role, education, location and time zone, what he is open to
        (roles, relocation), story, headline numbers, what he is focused on this month, contact details (email,
        phone, contact form) and links (résumé, LinkedIn, GitHub, LeetCode, journal). Takes no input.
        Call it first for any general question, or for contact details. For his work use list_projects and
        get_project; for jobs and clubs, get_experience; for anything specific, search_portfolio.
        Data comes from the live site, refreshed about every 10 minutes. Pay is not included."""
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

    @tool('List projects', github=True)
    async def list_projects(
        tech: Annotated[str, Field(description='Only projects using this technology: case-insensitive, matched as part of each tech name and of the write-up, so "lang" finds LangGraph and LangChain. Examples: "LangGraph", "React", "AWS". Empty for all.')] = '',
        category: Annotated[Literal['all', 'ai', 'web', 'devops', 'cloud'], Field(description='Only one kind of project: "ai" (AI, ML and agents), "web" (full-stack and web apps), "devops" (CI/CD and infrastructure), "cloud" (serverless and cloud services), or "all". A project can be in more than one.')] = 'all',
        flagship_only: Annotated[bool, Field(description='Only the five flagship projects (his most important work). Combines with the other filters.')] = False,
        include_other_repos: Annotated[bool, Field(description="Also return otherRepos: his public GitHub repositories the portfolio doesn't feature (forks left out), with GitHub's description, language, stars and last update.")] = False,
    ) -> dict:
        """List Shlok's projects in order of importance (the first five are flagships). Each entry has name,
        slug, field, one-line summary, tech stack, live demo and code links, its page on the portfolio, and live
        GitHub details (stars, language, topics, last update) when the code is in a public repository.
        Filters combine (all must match); a filter that matches nothing returns count 0, not an error.
        GitHub details are cached up to 6 hours and are missing for private repositories or when GitHub can't
        be reached. Use get_project for one project's full write-up and metrics, and search_portfolio for
        topics that are not projects (a skill used at work, an award)."""
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

    @tool('Project details', github=True)
    async def get_project(
        name: Annotated[str, Field(description='A project name, slug or GitHub repository name, any case; part of a name also works. Examples: "DailyDiff", "PaisaWise", "lms", "enterprise-workforce-training-platform".')],
    ) -> dict:
        """Full details of one of Shlok's projects: what it does and how it is built, results and metrics,
        highlights, tech stack, rank, live GitHub details, and links (live demo, code, blog post, portfolio page,
        and the case study for DailyDiff). The name is matched case-insensitively, ignoring punctuation: first
        exactly against the project name, slug or GitHub repository name, then as part of a name ("workforce"
        finds the Enterprise Workforce Training Platform). If no featured project matches, his public GitHub
        repositories are tried and GitHub's details are returned with a note. If nothing matches, the result is
        {"error", "projects": [every project name]} so you can retry with a valid name.
        Use list_projects first when you don't know the name."""
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
        """Shlok's work experience (internships), leadership roles (student clubs) and education, each list
        newest first. Every entry has role, organisation, when, type, what he did (points), the organisation's
        website and links to certificates where they exist. Takes no input. Pay and confidential client details
        are not included. For patents, awards and certifications use get_achievements; for projects,
        list_projects."""
        d = await get_content()
        return {'experience': d['experience'], 'leadership': d['leadership'], 'education': d['education'], 'page': d['site'] + '/journey'}

    @tool('Patents, awards and certifications')
    async def get_achievements(
        kind: Annotated[Literal['all', 'patents', 'awards', 'certifications', 'community'], Field(description='Which part to return: "patents", "awards" (hackathons and programs), "certifications", "community" (mentoring and volunteering), or "all" for everything.')] = 'all',
    ) -> dict:
        """Shlok's recognition and proof of work: patents (three, as co-inventor: title, status, office,
        reference number, summary and a link to the document), awards and hackathon results (organiser, date,
        result, certificate links), certifications (issuer, date, certificate link) and community work
        (mentoring, volunteering, event anchoring). Returns every part, or only the one named in kind, plus a
        link to the page on the portfolio that shows them. For jobs and club roles use get_experience."""
        d = await get_content()
        parts = {'patents': d['patents'], 'awards': d['awards'], 'certifications': d['certifications'], 'community': d['community']}
        k = kind
        if k in parts:
            parts = {k: parts[k]}
        return {**parts, 'page': d['site'] + ('/community' if k == 'community' else '/recognition')}

    @tool('Skills')
    async def get_skills() -> dict:
        """Shlok's skills in eight groups (Generative AI, LLM evaluation & safety, machine learning, languages,
        web, databases, cloud & DevOps, core CS), strongest first within each group. Each skill has a level
        (core, strong, working or exploring) and usedIn: up to six of his projects that list it in their stack
        or mention it in their write-up (matched by name, so treat it as a pointer, not a complete list).
        Takes no input. For proof of a skill, open those projects with get_project."""
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
        topic: Annotated[str, Field(description='Only posts about this: case-insensitive, matched as part of the topic tag, title or summary. Examples: "Agents", "RAG", "DevOps", "MCP". Empty for all posts.')] = '',
    ) -> dict:
        """Shlok's writing, newest first: his technical blog posts (journal: title, date, topic tag, summary,
        link) and his LinkedIn series "Not What You Think" (short posts on common misconceptions about LLMs,
        each with part, arc, date, topic, title, summary and link, plus the series' arcs and their status).
        The topic filter is case-insensitive and matches part of a post's topic, title or summary in both
        ("agent" finds posts tagged Agents, "token" finds the series part on tokens); leave it empty for
        everything. No match returns count 0 and empty lists. For the projects the posts describe, use
        get_project."""
        d = await get_content()
        posts = d['writing']
        ser = d.get('series') or {}
        parts = ser.get('posts', [])
        if topic.strip():
            t = _norm(topic)
            posts = [w for w in posts if t in _norm(w['topic'] + ' ' + w['title'] + ' ' + w['summary'])]
            parts = [p for p in parts if t in _norm(p['topic'] + ' ' + p['title'] + ' ' + p['summary'])]
        out = {'count': len(posts) + len(parts), 'posts': posts, 'journal': d['profile']['links']['journal']}
        if ser:
            out['linkedinSeries'] = {k: ser[k] for k in ('name', 'tag', 'about', 'follow', 'page', 'arcs') if k in ser}
            out['linkedinSeries']['posts'] = parts
        return out

    @tool('Résumé')
    async def get_resume() -> dict:
        """Links to Shlok's résumé: the PDF download and a web version with the same content, plus his title,
        summary, current role and education. Takes no input. The résumé itself is in those documents; for the
        same facts as structured data use get_experience, get_skills and list_projects."""
        d = await get_content()
        pr = d['profile']
        return {'pdf': pr['links']['resumePdf'], 'web': pr['links']['resumePage'], 'name': pr['name'], 'title': pr['title'],
                'summary': pr['summary'], 'current': pr['current'], 'education': pr['education'],
                'note': 'The web version has the same content as the PDF.'}

    @tool('Recent GitHub activity', github=True)
    async def get_activity() -> dict:
        """What Shlok has been building lately, live from GitHub: commit counts for the last 7 and 30 days,
        how many repositories he touched this week, and his 12 most recent commits (repository, message, date,
        link). Only public repositories; scheduled and automated commits (DailyDiff's daily publish, merges)
        are left out. Cached up to 30 minutes. If GitHub can't be reached it returns {"error", "github"}
        instead. Takes no input. For what he is focused on this month, see get_profile (rightNow)."""
        a = await fetch_activity()
        if not a:
            return {'error': 'GitHub activity is unavailable right now.', 'github': 'https://github.com/shlokbam'}
        return {'commitsLast7Days': a['week'], 'reposLast7Days': a['weekRepos'], 'commitsLast30Days': a['month'],
                'recent': a['commits'], 'github': 'https://github.com/shlokbam'}

    @tool('Open-source contributions', github=True)
    async def get_open_source(
        status: Annotated[Literal['all', 'merged', 'open', 'closed'], Field(description='Only pull requests in this state: "merged", "open" (still in review), "closed" (closed without merging), or "all".')] = 'all',
    ) -> dict:
        """Shlok's open-source contributions: his pull requests to other people's GitHub repositories, live from
        GitHub (cached up to 3 hours). Returns totals (merged, in review, closed, projects) and each repository
        (name, stars, description, link) with its pull requests (title, state, number, dates, link), merged work
        first. List submissions (awesome lists, portfolio directories) are left out. If GitHub can't be reached,
        the copy saved at the site's last build is returned with "source": "snapshot". Takes an optional status
        filter; no match returns empty lists. For his own projects use list_projects; for his own recent commits,
        get_activity."""
        d = await get_content()
        saved = d.get('openSource') or {}
        skip = {x.lower() for x in saved.get('skip', [])}
        live = await fetch_open_source()
        if live:
            repos = {}
            for p in live['prs']:
                if p['repo'].lower() in skip:
                    continue
                info = live['repos'].get(p['repo'], {})
                r = repos.setdefault(p['repo'], {'name': p['repo'], 'url': info.get('url', ''), 'stars': info.get('stars'), 'description': info.get('description', ''), 'prs': []})
                r['prs'].append({k: p[k] for k in ('title', 'state', 'number', 'created', 'merged', 'closed', 'url')})
            repos, source, updated = list(repos.values()), 'live', live['updated']
        else:
            repos, source, updated = saved.get('repos', []), 'snapshot', saved.get('updated')
        rank = {'merged': 0, 'open': 1, 'closed': 2}
        for r in repos:
            r['prs'] = sorted(r['prs'], key=lambda p: (rank[p['state']], p['created'] and -_ts(p['created'])))
        every = [p for r in repos for p in r['prs']]
        count = lambda st: sum(p['state'] == st for p in every)
        totals = {'merged': count('merged'), 'inReview': count('open'), 'closed': count('closed'), 'projects': len(repos)}
        if status != 'all':
            repos = [{**r, 'prs': [p for p in r['prs'] if p['state'] == status]} for r in repos]
            repos = [r for r in repos if r['prs']]
        repos.sort(key=lambda r: (not any(p['state'] == 'merged' for p in r['prs']), -max(_ts(p['merged'] or p['created']) for p in r['prs'])))
        return {'totals': totals, 'repositories': repos, 'source': source, 'updated': updated,
                'page': d['site'] + '/work#open-source', 'allOnGitHub': 'https://github.com/pulls?q=is%3Apr+author%3Ashlokbam+-user%3Ashlokbam'}

    @tool('Search the portfolio')
    async def search_portfolio(
        query: Annotated[str, Field(description='One or more words, any case; punctuation is ignored. Each word is matched at the start of words in the text ("eval" finds evaluation), matches in a title count more, and the exact phrase scores extra. Examples: "RAG", "Terraform", "hackathon", "PharmaACE", "patent granted".')],
    ) -> dict:
        """Search everything in Shlok's portfolio (projects, experience, leadership, education, patents,
        awards, certifications, community work, blog posts, LinkedIn series posts and open-source pull requests) for a word or topic. Returns up to 8 matches,
        best first, each with its type, title, a snippet and a link; no match returns an empty results list.
        Use it for specific questions the other tools don't answer directly, such as where he used a
        technology or whether he has done something. For a known project use get_project; for the full list of
        projects, list_projects; for jobs, get_experience; for patents and awards, get_achievements."""
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
        for r in (d.get('openSource') or {}).get('repos', []):
            for p in r['prs']:
                docs.append(('open-source pull request', f"{p['title']} ({r['name']}, {p['state']})", f"{r['name']}: {r['description']}"[:220], p['url'], ' '.join([p['title'], r['name'], r['description'], 'open source contribution pull request', p['state']]), 1.5))
        for p in (d.get('series') or {}).get('posts', []):
            docs.append(('linkedin post', f"{p['title']} (Not What You Think, part {p['part']})", p['summary'], p['url'], ' '.join([p['title'], p['topic'], p['summary'], 'linkedin series']), 1))
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
