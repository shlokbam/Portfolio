import { useState } from 'react'
import SkillPit from './SkillPit'
import BugSmash from './arcade/BugSmash'
import Memory from './arcade/Memory'
import TypeSprint from './arcade/TypeSprint'

// Contact page arcade: a few small games to play while you're here.
const GAMES = [
  ['pit', 'Stack pit', 'Grab & throw my stack', SkillPit],
  ['bugs', 'Bug smash', '30-second reflex test', BugSmash],
  ['memory', 'Memory', 'Match the logos', Memory],
  ['type', 'Typing sprint', 'Code one-liners, fast', TypeSprint]
]

export default function Arcade() {
  const [g, setG] = useState('pit')
  const cur = GAMES.find((x) => x[0] === g)
  const Game = cur[3]
  return (
    <section id="arcade" className="arcade pit-sec" aria-labelledby="arc-h" style={{ padding: '110px 0', borderBottom: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="pit-head">
          <div>
            <span className="mono" style={{ color: 'var(--muted)' }}>Before you go</span>
            <h2 id="arc-h" className="disp" style={{ margin: '18px 0 0', fontSize: 'clamp(40px, 6.4vw, 100px)' }}>
              The{' '}<span className="serif" style={{ textTransform: 'none', letterSpacing: '-.02em', fontWeight: '400', color: 'var(--accent)' }}>arcade</span>
            </h2>
          </div>
          <p style={{ margin: '0', color: 'var(--muted)', fontSize: '17px', lineHeight: '1.5', maxWidth: '34ch' }}>Four tiny games, all built for this page. Best scores are kept on your device.</p>
        </div>
        <div className="arc-tabs" role="tablist" aria-label="Games">
          {GAMES.map(([id, name, sub]) => (
            <button key={id} type="button" role="tab" id={'tab-' + id} aria-selected={g === id} aria-controls="arc-panel" className={'arc-tab' + (g === id ? ' on' : '')} onClick={() => setG(id)}>
              <b>{name}</b><span className="mono">{sub}</span>
            </button>
          ))}
        </div>
        <div id="arc-panel" role="tabpanel" aria-labelledby={'tab-' + g} className="arc-panel">
          <Game key={g} bare />
        </div>
      </div>
    </section>
  )
}
