// The assistant's avatar: the site's orbit mark, with its rings slowly turning (still for reduced motion).
export default function BotMark({ size = 46 }) {
  return (
    <span className="botmark" aria-hidden="true" style={{ width: size + 'px', height: size + 'px' }}>
      <svg viewBox="0 0 64 64" width={size * 0.74} height={size * 0.74}>
        <g className="bm-spin" fill="none" stroke="currentColor" strokeWidth="3">
          <ellipse cx="32" cy="32" rx="25" ry="9.5" />
          <ellipse cx="32" cy="32" rx="25" ry="9.5" transform="rotate(60 32 32)" />
          <ellipse cx="32" cy="32" rx="25" ry="9.5" transform="rotate(120 32 32)" />
          <circle cx="57" cy="32" r="4" fill="currentColor" stroke="none" />
          <circle cx="19.5" cy="10.4" r="4" fill="currentColor" stroke="none" />
          <circle cx="19.5" cy="53.6" r="4" fill="currentColor" stroke="none" />
        </g>
        <circle className="bm-core" cx="32" cy="32" r="5.5" fill="currentColor" />
      </svg>
    </span>
  )
}
