# Portfolio v2 — developer notes

The project overview lives in the [repo README](../README.md). This file is the working detail.
v1 (Flask) was removed from the working tree; it is still in git history.

```
v2/
  frontend/   React 18 + Vite + React Router  → Vercel
    public/static/   résumé, certificates, patents, photos (originals; WebP display copies in opt/)
    public/og/       one share card per page
    src/routes.jsx   the route list; each page is its own chunk
    src/pages/       one component + stylesheet per page (Home, About, Work, CaseStudy, Journey,
                     Recognition, Community, Writing, Contact, Resume, Privacy, NotFound)
    src/components/  Layout (header, menu, footer), AskAI + ChatWidget (assistant), Sources, NowRadar,
                     Shipping, A (smart link), Md (chat markdown), arcade/ games, …
    src/lib/         site state (theme, chat, live data), API client, links, scroll helpers, scenes/
    src/content/     everything the site says about Shlok, as data (see Content below)
    scripts/         prerender.mjs (static pages, sitemap, llms.txt), resize-images.sh
  backend/    FastAPI → Render
    main.py          /api/stats, /api/availability, /api/shipping, /api/chat, /api/chat/stats, /api/contact, /api/health, /mcp
    mcp_server.py    the MCP server: tools anyone's AI assistant can call to ask about Shlok
    content.py       reads the site's /portfolio.json (cached 10 min; portfolio.snapshot.json as fallback)
    knowledge.py     the chatbot's rules; its facts are built from the content
```

## Run locally

```bash
# API (reads GROQ_API_KEY / WEB3FORMS_ACCESS_KEY from the repo-root .env)
cd v2/backend
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn main:app --reload --port 8000

# site (proxies /api to :8000)
cd v2/frontend
npm install
npm run dev        # http://localhost:5173
```

## Deploy

**Backend → Render** (Web Service)
- Root directory: `v2/backend`
- Build: `pip install -r requirements.txt`
- Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Health check path: `/api/health`
- Env vars: `GROQ_API_KEY`, `WEB3FORMS_ACCESS_KEY`, `PYTHON_VERSION=3.11.9`,
  `ALLOWED_ORIGINS` = your site URL(s), comma-separated (any `*.vercel.app` URL is allowed by default)
- Optional: `GROQ_MODELS` (comma-separated fallback order; default `openai/gpt-oss-20b,openai/gpt-oss-120b,qwen/qwen3.8-27b`)

`render.yaml` in `v2/backend` describes the same service as a Blueprint.

**Frontend → Vercel**
- Root directory: `v2/frontend` (framework preset: Vite)
- Env vars: `VITE_API_URL` = the Render URL (e.g. `https://shlokbam-portfolio-api.onrender.com`),
  `VITE_WEB3FORMS_KEY` = the Web3Forms access key (public by design; same one v1 used),
  `SITE_URL` = the public address of the site (`https://shlokbam.in`) — used for canonical
  links, the sitemap and social previews. Default: `https://shlokbam.in`.
- `npm run build` builds the app, renders every page to static HTML (`scripts/prerender.mjs`) and
  writes `sitemap.xml`, `robots.txt` and a real `404.html`. `vercel.json` sets clean URLs and caching.
- `npm run preview` serves `dist/` the way Vercel does (clean URLs + 404 page).

## Notes
- The contact form posts straight to Web3Forms from the browser (its free tier blocks server-side
  calls). If `VITE_WEB3FORMS_KEY` is missing it falls back to `POST /api/contact`. One path per
  message, so no duplicate emails.
- Groq retired `llama-3.1-8b-instant`; the chat now tries the models in `GROQ_MODELS` in order and
  moves on when one is rate-limited (each has its own free-tier budget).
- Scroll-driven animations use CSS `animation-timeline` in Chromium; `src/lib/reveal.js` provides
  the same reveals and progress bars in Safari and Firefox.
- Render's free tier sleeps when idle, so the first stats/chat request after a while can take ~30 s.
  The site still renders immediately; live numbers and chat fill in once the API wakes.
- Pages show optimized WebP copies from `public/static/opt/` (made with `cwebp -q 80`, max 1600 px).
  The originals in `public/static/` are untouched and are what download links open. If you add or
  replace an image, regenerate its copy: `cwebp -q 80 -m 6 in.jpeg -o public/static/opt/<same path>.webp`.
  Community and Recognition photos also have 480 / 800 / 1280 px copies (`opt/w480`, `w800`, `w1280`) picked
  by `srcset` (`sized()` in `lib/links.js`); after changing one of them run `zsh scripts/resize-images.sh`.
- Each page is its own JavaScript chunk (`src/routes.jsx`): a visitor downloads only the page they open, the
  prerendered HTML preloads it, and the rest load when the browser is idle or a link is hovered. All CSS stays in
  one stylesheet so nothing renders unstyled. Test production builds with `npm run preview` (it serves
  `dist/about/index.html` for `/about` like Vercel); `vite preview` serves the home page HTML for every route.
- The site pings `/api/health` on load so a sleeping Render instance starts waking early; stats retry once.
  If the ping takes over 1.5 s (a cold start), both chats show a boot screen (`components/WakeBoot.jsx`: boot log,
  rotating facts, arcade link). Typed questions are queued and sent once the API answers; quick questions answer
  at once from `lib/qa.js`. When it wakes, a notification appears and the chat button gets a green dot.
  The state lives in `lib/site.jsx` (`apiState`: unknown → waking → ready, or down after ~2 min).
- Indovate's repository isn't public, so the Work page shows "Private repo" instead of a dead link.

## Content (one source for the site, the assistant and the MCP server)
Everything the site says about Shlok lives as plain data in `frontend/src/content/`: `profile.js`, `projects.js`,
`journey.js` (work, leadership, education), `recognition.js` (patents, awards, certifications), `community.js`,
`writing.js`, `skills.js` and `now.js`. The pages render from these files.

- The build writes all of it to **`/portfolio.json`** (`content/index.js` sets the shape and turns paths into full URLs).
- The backend reads that live file (`backend/content.py`, refreshed every 10 minutes) and builds the assistant's facts
  from it (`backend/knowledge.py`). So a content change needs only a frontend push: no backend redeploy.
- If the live file can't be fetched, the backend uses `backend/portfolio.snapshot.json`. A local `npm run build` refreshes
  it; commit it along with content changes. `CONTENT_URL=snapshot` makes a local backend use only that copy.
- To add a project: add an entry to `content/projects.js` (`details` and `blog` are optional). Its Work-page row,
  the assistant's answers and its source link all follow.
- The Résumé page (`pages/Resume.jsx`) is the exception: it copies the PDF word for word, so edit it with the PDF.

## MCP server (`https://shlokbam.in/mcp`)
Anyone can add the portfolio to their AI assistant and ask it about Shlok. The tools return facts from the live content
(same source as the site and the chat), and the visitor's own AI writes the answer, so it costs nothing per question.

- Tools (all read-only, no sign-in): `get_profile`, `list_projects` (filter by tech, category, flagships), `get_project`
  (by name, slug or repo name), `get_experience`, `get_achievements` (patents, awards, certifications, community),
  `get_skills` (with the projects that use each), `get_writing`, `get_resume`, `get_activity` (live GitHub commits),
  `search_portfolio`. Defined in `backend/mcp_server.py`; adding a project to `src/content/` needs no change here.
- Live GitHub details: one call to GitHub's repo list (cached 6 h, `github_repos()` in `main.py`) adds stars, language,
  topics and last update to every project with a repo, matched by the repo name in its `code` link (forks included,
  for team projects). `list_projects(include_other_repos=true)` also lists public repos the site doesn't feature, and
  `get_project` falls back to GitHub's details for those.
- Prompts (offered as buttons or slash commands in some apps): `evaluate_for_role` (paste a role or job description),
  `summary` (three lines for a recruiter), `interview_questions` (optionally for one project), `latest`.
- The server's instructions tell the AI that pay and client details aren't shared, and to suggest emailing instead of guessing.
- `components/McpNudge.jsx`: a card, bottom-left, pointing to `/ai`. Once per visit after 25 s or half-way down a page,
  not on `/ai`, `/contact`, `/resume`, and never over the open chat or the wake-up notice. Closing it hides it for 3 days
  (`HIDE_DAYS`), clicking it hides it for good, ignored it slides away after 15 s. GA events: `mcp_nudge_shown`, `_clicked`, `_closed`.
- `/ai` (`pages/Ai.jsx`) is the how-to-connect page: copyable address, steps per app, one-click installs for Cursor and
  VS Code, example questions, the tools and prompts. A browser opening `/mcp` is redirected there (302); keep its
  TOOLS and PROMPTS lists in step with `mcp_server.py`.
- Official MCP Registry entry: `backend/server.json` (name `io.github.shlokbam/portfolio`). To publish or update:
  `brew install mcp-publisher`, then in `v2/backend`: `mcp-publisher login github` and `mcp-publisher publish`
  (bump `version` for every update).
- Transport: Streamable HTTP, stateless, JSON responses (`main.py` mounts it). A browser opening `/mcp` gets a short JSON
  note instead. Vercel forwards `shlokbam.in/mcp` to the Render service (`vercel.json` rewrites), so the address
  stays the same if the backend moves.
- Each call is logged by tool name only (Render logs: `mcp tool: get_project`), never with what was asked.
- `.github/workflows/keep-awake.yml` pings the API every 10 minutes from 07:30 to 00:30 IST so calls don't hit a
  cold start. Render's 750 free hours a month are shared by all free services, so it doesn't run around the clock.
- Test locally: `CONTENT_URL=snapshot .venv/bin/uvicorn main:app --port 8000`, then
  `npx @modelcontextprotocol/inspector` and connect to `http://localhost:8000/mcp`.
- `mcp` 2.x needs Starlette < 0.42 alongside FastAPI 0.115; install with `pip install -r requirements.txt` (which
  resolves that), not `pip install mcp` on its own.

## SEO
- IndexNow: after a deploy is live, run `npm run indexnow` (in `v2/frontend`) to tell Bing, Yandex and the
  other IndexNow engines that the pages changed. It sends every URL in the live sitemap; the key file is
  `public/0ad7faedcb78f4799790d153ec798e39.txt` (public by design, it proves the site is ours).
- Every page is prerendered with its own `<title>`, description, canonical URL, Open Graph/Twitter
  tags and JSON-LD (Person, WebSite, ProfilePage/WebPage, breadcrumbs, the project list and the
  DailyDiff app). Titles and descriptions live in `src/seo.js`.
- Share images: one 1200×630 card per page in `public/og/` (`home.jpg`, `work.jpg`, …), picked in `headTags()`
  in `src/seo.js`; `public/og.png` is a copy of the home card. Icons: `icon.svg`, `icon-192/512.png`, `apple-touch-icon.png`.
- Fonts are self-hosted from `public/fonts` (latin subset, SIL Open Font License).
- The build also writes `llms.txt` (a plain-text summary for AI assistants, from `PAGES` in `src/seo.js` plus key facts
  in `scripts/prerender.mjs`; keep those facts in step with `src/content/`) and lists the portrait
  `public/static/images/shlok-bam.jpg` in the sitemap for image search. The original `images/about/profile.png` is kept.
- After deploying: add the site in Google Search Console, verify it (DNS or HTML tag), submit
  `/sitemap.xml`, and use "Request indexing" on the home page. Link the site from LinkedIn, GitHub
  (profile + repos) and X — those links are what make "Shlok Bam" searches rank it first.

## Live AI backdrops
Each page header has a small, real computation drawn on a canvas (`src/components/AIBackdrop.jsx`,
scenes in `src/lib/scenes/`):

| Page | Scene | What runs |
|---|---|---|
| Home | `nn` | feed-forward net, tanh forward pass; input follows the pointer |
| About | `embed` | skills clustering in an embedding space (k = 4), re-fit every 10 s |
| Work | `gd` | gradient descent with momentum on a 2-D loss surface + live loss curve |
| Case study | `agents` | DailyDiff pipeline: Skeptic / Verifier reject, Editor batches briefs |
| Journey | `train` | train/val loss curve with the years as epochs |
| Recognition | `cv` | 3×3 Sobel convolution scanning a pixel strip, then detections |
| Community | `graph` | message passing over a k-NN graph |
| Writing | `tokens` | next-token sampling with attention arcs |
| Home · Ask my AI | `attention` | self-attention heatmap over what the visitor types |

Scenes load lazily after the page is interactive, run at ~40 fps, pause when off-screen or in a
background tab, read colours from the theme tokens, and draw a single still frame when the visitor
prefers reduced motion. Readable overlays sit in the empty strip above each page label (`band()` in
`util.js`); textures go behind the titles.

## Right now (home page)
The "On my radar" section (`src/components/NowRadar.jsx`) shows what Shlok is focused on this month. Edit
`src/content/now.js` monthly: change `UPDATED` and the blocks (a block with empty `text` is hidden). The
assistant picks it up from the content.

## Home page extras
- **At a glance** (`src/components/Glance.jsx`): stat tiles, each with its own hover interaction.
- **Skill pit** (`src/components/SkillPit.jsx`): the stack as physical pills (matter-js, ~27 kB gzip,
  loaded only when the section scrolls into view). Pills are real buttons; the server renders them as
  a plain list. Edit `SKILLS` to change them — the "used in" projects are matched from `content/projects.js`.
- The "Built to run" section in `pages/Home.jsx` is commented out; remove the comment wrapper to restore it.

## Analytics, icon, old address
- Google Analytics (`G-8BD4MSYPM6`, same property as v1) is in `frontend/index.html`; it is skipped on localhost.
- Microsoft Clarity (project `z2u0dv5iv5`, heatmaps and replays) is next to it, also skipped on localhost.
- Events (`src/lib/track.js`, sent to both): `resume_download`, `resume_view_click`, `contact_submit` (topic),
  `contact_error`, `chat_open`, `chat_question` (quick or typed, never the text), `profile_click` (network),
  `project_link_click` (domain, URL, link text), `file_open` (certificates, patents, other `/static/` files), `email_click`, `phone_click`. Every event
  carries `page`. Links are counted by one document-wide click listener, so new links need no code.
  `contact_submit` and `resume_download` are marked as key events in GA4. Never send personal data.
- Owner opt-out: open the site once with `?notrack=1` in each of your browsers; `?notrack=0` undoes it.
- `src/pages/Privacy.jsx` (`/privacy`) describes what the site collects. Update it whenever analytics, the chat or the
  contact form change.
- Site icon: `public/icon.svg` (the orbit mark), with PNG/ICO copies and a maskable icon for Android.
- The API also answers on the old v1 address: non-API paths 301 to `SITE_URL`, and `/service-worker.js`
  replaces v1's caching service worker with one that removes itself.
