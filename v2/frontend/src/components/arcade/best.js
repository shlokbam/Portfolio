// Per-visitor best scores (a convenience only; storage can be missing in private windows).
export function getBest(key) {
  try { return Number(localStorage.getItem('sb-best-' + key)) || 0 } catch (e) { return 0 }
}
export function setBest(key, v) {
  try { localStorage.setItem('sb-best-' + key, String(v)) } catch (e) { /* storage blocked */ }
}
