# Portfolio v2 — React + FastAPI

The corporate redesign of the portfolio. v1 (Flask, repo root) is untouched.

```
v2/
  frontend/   React 18 + Vite + React Router  → Vercel
    public/static/   every v1 asset (résumé, certificates, patents, photos), copied 1:1
    src/pages/       one component + stylesheet per page (Home, About, Work, CaseStudy, Journey,
                     Recognition, Community, Writing, Contact, NotFound)
    src/components/  Layout (header, menu, footer), ChatWidget, A (smart link), Md (chat markdown)
    src/lib/         site state (theme, chat, live data), API client, scroll-reveal fallback
    src/data/        project list
  backend/    FastAPI → Render
    main.py          /api/stats, /api/availability, /api/chat, /api/chat/stats, /api/contact, /api/health
    knowledge.py     everything the chatbot knows (keep in sync with page content)
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
  `VITE_WEB3FORMS_KEY` = the Web3Forms access key (public by design; same one v1 used)
- `vercel.json` rewrites routes like `/work/dailydiff` to the SPA.

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
