"""The portfolio's content: profile, projects, experience, patents and the rest, as one dict.

The site is the source of truth. Its build publishes everything in frontend/src/content/ as
/portfolio.json, and this module reads that live file (refreshed every 10 minutes), so a content
change reaches the AI assistant and the MCP server without redeploying the backend.
If the live file can't be fetched, the last good copy is kept; at start-up that is
portfolio.snapshot.json, which a local `npm run build` refreshes (commit it with content changes).

Env: CONTENT_URL (default SITE_URL + /portfolio.json); set it to "snapshot" to use only the local copy.
"""
import json
import logging
import os
import time
from pathlib import Path

import httpx

log = logging.getLogger('portfolio')

SNAPSHOT = Path(__file__).resolve().parent / 'portfolio.snapshot.json'
TTL = 10 * 60
VERSION = 1  # the shape this code reads; matches `version` in frontend/src/content/index.js


def _valid(data) -> bool:
    return isinstance(data, dict) and data.get('version') == VERSION and isinstance(data.get('projects'), list) and data['projects']


def content_url() -> str:
    # read when used, not at import: main.py loads .env after its imports
    site = os.getenv('SITE_URL', 'https://shlokbam.in').rstrip('/')
    return os.getenv('CONTENT_URL', site + '/portfolio.json')


_data: dict = json.loads(SNAPSHOT.read_text()) if SNAPSHOT.exists() else {}
_checked = 0.0  # when the live file was last tried (success or not)


async def get(client: httpx.AsyncClient) -> dict:
    """The current content: the live /portfolio.json, or the last good copy if it can't be fetched."""
    global _data, _checked
    url = content_url()
    if url != 'snapshot' and time.time() - _checked > TTL:
        _checked = time.time()
        try:
            resp = await client.get(url, timeout=8)
            resp.raise_for_status()
            data = resp.json()
            if _valid(data):
                _data = data
            else:
                log.warning('content: %s has an unexpected shape, keeping the last copy', url)
        except Exception as exc:
            log.warning('content: could not fetch %s (%s), keeping the last copy', url, exc)
    return _data
