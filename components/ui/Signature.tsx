/**
 * The site's only "name": a hand-lettered SH monogram. The letters trace in as
 * a pen stroke, the gold fill settles, then a flourish and a spark finish it.
 * Pure SVG + CSS (see .sig-* in globals.css), so it costs no JavaScript.
 * `id` keeps the gradient unique when several signatures share a page.
 */
export function Signature({ id, size = 44, className = '' }: { id: string; size?: number; className?: string }) {
  const grad = `sig-grad-${id}`
  return (
    <svg viewBox="0 0 96 60" style={{ height: size, width: (size * 96) / 60 }} className={`overflow-visible ${className}`} role="img" aria-label="SH signature">
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--gold-3)" />
          <stop offset="55%" stopColor="var(--gold)" />
          <stop offset="100%" stopColor="var(--ember)" />
        </linearGradient>
      </defs>
      <text
        x="6"
        y="42"
        className="sig-text"
        fill={`url(#${grad})`}
        stroke={`url(#${grad})`}
        strokeWidth="0.9"
        style={{ fontFamily: 'var(--font-signature), cursive', fontSize: 46 }}
      >
        SH
      </text>
      <path className="sig-flourish" d="M8 50 C 30 55, 62 55, 84 44 C 90 41, 92 37, 86 37" fill="none" stroke={`url(#${grad})`} strokeWidth="1.6" strokeLinecap="round" />
      <path className="sig-spark" d="M88 12 l1.6 3.4 3.4 1.6 -3.4 1.6 -1.6 3.4 -1.6 -3.4 -3.4 -1.6 3.4 -1.6Z" fill="var(--gold-3)" />
    </svg>
  )
}
