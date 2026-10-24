# Deploying portfolio v2

You'll end up with:

| What | Where | Address |
|---|---|---|
| Website (React, prerendered) | **Vercel** | **https://shlokbam.in** (and `www.shlokbam.in` → redirects to it) |
| API: chat, live stats, contact fallback | **Render**: your *existing* v1 service, switched to v2 | `https://portfolio-edaa.onrender.com` |
| The old link | Same Render service | `portfolio-edaa.onrender.com` → **301 redirect to shlokbam.in** |

Anyone who opens the old link lands on the new site. Old v1 links like `/download-resume` go to
the matching v2 page or file. Returning visitors had v1 cached by its service worker; the API now
serves a replacement `service-worker.js` that clears that cache and reloads them into the new site.

Do the steps in this order: **1 → 2 → 3 → 4**. The site keeps working throughout. v1 stays live
until step 2.

---

## 1. Push the code to GitHub

Render and Vercel both deploy from the `main` branch of `github.com/shlokbam/Portfolio`.

```bash
cd ~/Documents/Code/Portfolio
git status                     # review what changed
git add v2 static/Resume       # v2 + the résumé swap
git commit -m "Portfolio v2: React + FastAPI"
git push origin main
```

> `.env` files are git-ignored, so your keys are not pushed. Keep it that way.

---

## 2. Switch the existing Render service to the v2 API

Render dashboard → open the service whose URL is **portfolio-edaa.onrender.com**.

**Settings → Build & Deploy**

| Field | Set to |
|---|---|
| Root Directory | `v2/backend` |
| Runtime | Python 3 |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| Health Check Path | `/api/health` |
| Branch | `main` |

**Environment**: add or update these:

| Key | Value |
|---|---|
| `PYTHON_VERSION` | `3.11.9` (v1 used 3.9; v2 needs 3.11) |
| `GROQ_API_KEY` | your Groq key (already there from v1) |
| `WEB3FORMS_ACCESS_KEY` | your Web3Forms key (already there from v1) |
| `SITE_URL` | `https://shlokbam.in` |
| `ALLOWED_ORIGINS` | `https://shlokbam.in,https://www.shlokbam.in` |

Optional: `GROQ_MODELS` (default `openai/gpt-oss-20b,openai/gpt-oss-120b,qwen/qwen3.8-27b`).
Remove any v1-only variables you no longer need, such as `PORT=10000`; Render sets `PORT` itself.

Then use **Manual Deploy → Deploy latest commit**. When the deploy finishes, check:

```bash
curl -s https://portfolio-edaa.onrender.com/api/health          # {"ok":true}
curl -sI https://portfolio-edaa.onrender.com/ | grep -i location  # location: https://shlokbam.in/
```

> **If this service was created from a Blueprint** (it has a "Blueprint" badge), Render may
> reapply the repo-root `render.yaml`, which is v1's. Either detach the service from the
> Blueprint (Blueprint → Settings), or create the service from `v2/backend/render.yaml` instead.

> Render's free tier sleeps after 15 minutes idle. The first request after that takes 30–60 s,
> including someone opening the old link. The site itself (on Vercel) is always instant. If you
> want the API warm, add a free uptime monitor (e.g. UptimeRobot) that hits `/api/health`
> every 10 minutes.

---

## 3. Create the Vercel project for the website

1. vercel.com → **Add New… → Project** → import `shlokbam/Portfolio`.
2. **Root Directory**: `v2/frontend` (click *Edit* next to it). Framework preset: **Vite**.
3. Build and output settings: leave the defaults (`npm run build`, output `dist`).
   `vercel.json` already sets clean URLs, caching and security headers.
4. **Environment Variables** (Production and Preview):

   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://portfolio-edaa.onrender.com` (no trailing slash) |
   | `VITE_WEB3FORMS_KEY` | your Web3Forms access key (the same value as on Render; it's a public key) |
   | `SITE_URL` | `https://shlokbam.in` |

5. **Deploy**. You'll get a `*.vercel.app` URL. Open it and check that the chat answers, the
   coding stats load and the contact form sends. The API already accepts `*.vercel.app` origins.

---

## 4. Connect shlokbam.in (GoDaddy → Vercel)

### 4a. In Vercel
Project → **Settings → Domains** → add `shlokbam.in`, then add `www.shlokbam.in`. When asked,
choose to **redirect `www.shlokbam.in` → `shlokbam.in`**. Vercel then shows the DNS records it
wants. Use exactly what it shows; normally these:

| Type | Name | Value |
|---|---|---|
| A | `@` | `76.76.21.21` (newer projects may show `216.198.79.1`; either works) |
| CNAME | `www` | `cname.vercel-dns.com` (or the project-specific value Vercel shows) |

### 4b. In GoDaddy
GoDaddy → **My Products → shlokbam.in → DNS** (Manage DNS):

1. **Delete** the parking records GoDaddy created:
   - any `A @` records (typically `15.197.148.33` and `3.33.130.190`, or "Parked");
   - any existing `CNAME www` pointing to `@` or to GoDaddy.
2. Under **Forwarding**, make sure no domain forwarding is set (forwarding overrides DNS).
3. **Add** the two records from 4a. TTL: 1 hour (or the default).
4. Leave the `NS`, `SOA`, `TXT` and `MX` records alone (you need them for email or verification).

DNS takes from a few minutes to a few hours. Vercel's Domains page turns green and issues the
HTTPS certificate automatically. Check:

```bash
dig +short shlokbam.in          # 76.76.21.21
dig +short www.shlokbam.in      # cname.vercel-dns.com. …
curl -sI https://www.shlokbam.in | grep -i location   # https://shlokbam.in/
```

When it's live, use **Redeploy** in Vercel once, so the sitemap and canonical links are rebuilt
with `SITE_URL=https://shlokbam.in`.

---

## 5. After launch

- **Google Analytics.** The tag `G-8BD4MSYPM6` (the same property as v1) is in `index.html`.
  It loads only on the live site, not on localhost. In GA → Admin → Data streams → your web stream:
  - update the stream URL to `https://shlokbam.in`;
  - in Enhanced measurement → Page views → advanced, keep **"Page changes based on browser
    history events"** on. That's what records page views when people click between pages.

  Check Reports → Realtime while you browse the site.
- **Google Search Console.** Add the domain property `shlokbam.in` (verify with the TXT record
  it gives you, added in GoDaddy DNS). Submit `https://shlokbam.in/sitemap.xml` and use
  *URL Inspection → Request indexing* on the home page. The 301s from the old address pass its
  ranking across.
- **Update your links.** Change the link inside your résumé PDF (it still points to
  `portfolio-edaa.onrender.com`), plus LinkedIn, the GitHub profile/README and X. The old link
  keeps redirecting, but direct links are faster.
- **Résumé file.** The site serves `/static/Resume/Shlok_Bam_Resume.pdf`. To update it later,
  replace the file in `v2/frontend/public/static/Resume/` with the same name, then push.

## Rolling back
Render: set Root Directory back to empty, the build command to `pip install -r requirements.txt`,
the start command to `gunicorn app:app --bind 0.0.0.0:$PORT` and `PYTHON_VERSION` to `3.9.0`,
then redeploy. v1 is untouched in the repo root. Vercel: remove the domain or use
*Instant Rollback* to an earlier deployment.
