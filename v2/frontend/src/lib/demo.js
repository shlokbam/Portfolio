// Live-demo state from /api/availability. Free-tier hosts (Render) sleep when idle: a slow answer means
// "sleeping" and opening the demo wakes it in about a minute; "down" means it errored, so we don't link to it.
// 'offline' is what the API said before it told sleeping and down apart.
export function demoState(statuses, url) {
  const s = statuses && url ? statuses[url] : ''
  return s === 'online' ? 'online' : s === 'sleeping' || s === 'offline' ? 'sleeping' : s === 'down' ? 'down' : ''
}

export const DEMO_NOTE = {
  online: 'Online now',
  sleeping: 'Demo sleeping · wakes in about a minute',
  down: 'Demo offline right now',
  '': 'Live demo'
}

// short label for buttons and badges
export const DEMO_LABEL = { online: 'Live', sleeping: 'Wake demo', down: 'Offline', '': 'Live' }
