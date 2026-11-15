import { storyMilestones as years, type StoryChapter } from '@/content/story'
import { profile } from '@/content/profile'

/**
 * Illustrations for the three scroll-story chapters. Inner parts carry
 * classes (who-orbit, build-win, deliver-bar, deliver-line…) that the scroll
 * timeline animates while the chapter is on screen.
 */
export function StoryArt({ kind, idPrefix }: { kind: StoryChapter['art']; idPrefix: string }) {
  if (kind === 'who') return <Who id={idPrefix} />
  if (kind === 'build') return <Build />
  return <Deliver id={idPrefix} />
}

function Who({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-who-bg`} cx="0.5" cy="0.45" r="0.7">
          <stop offset="0" style={{ stopColor: 'var(--surface-2)' }} />
          <stop offset="1" style={{ stopColor: 'var(--bg)' }} />
        </radialGradient>
      </defs>
      <rect width="400" height="500" fill={`url(#${id}-who-bg)`} />
      <g className="who-orbit" style={{ transformOrigin: '200px 230px' }}>
        {[70, 115, 160].map((rad, i) => (
          <circle key={rad} cx="200" cy="230" r={rad} fill="none" className="stroke-line-strong" strokeWidth="1" strokeDasharray={i === 1 ? '2 6' : undefined} />
        ))}
        {years.map((y, i) => {
          const a = (i / years.length) * Math.PI * 2 - Math.PI / 2
          const x = 200 + Math.cos(a) * 160
          const yy = 230 + Math.sin(a) * 160
          return (
            <g key={y}>
              <circle cx={x} cy={yy} r={i === years.length - 1 ? 7 : 4} className={i === years.length - 1 ? 'fill-ember' : 'fill-gold'} />
              <text x={x} y={yy - 12} textAnchor="middle" className="fill-ink-3 font-mono" fontSize="11">
                {y}
              </text>
            </g>
          )
        })}
        <circle cx="315" cy="148" r="10" className="fill-gold" />
      </g>
      <text x="200" y="248" textAnchor="middle" className="fill-gold font-display" fontSize="92" fontWeight="800" style={{ fontVariationSettings: "'wdth' 110" }}>
        {profile.yearsBadge.value}
      </text>
      <text x="200" y="278" textAnchor="middle" className="fill-ink-2 font-mono" fontSize="11" letterSpacing="3">
        YEARS BUILDING
      </text>
      <g className="who-tags">
        {['Power Apps', 'Dynamics 365', 'Dataverse', 'Copilot Studio'].map((t, i) => (
          <g key={t} transform={`translate(${36 + (i % 2) * 170} ${410 + Math.floor(i / 2) * 36})`}>
            <rect width="158" height="26" rx="13" fill="none" className="stroke-line-strong" />
            <text x="79" y="17" textAnchor="middle" className="fill-ink-2" fontSize="11">
              {t}
            </text>
          </g>
        ))}
      </g>
    </svg>
  )
}

function Win({ x, y, w, h, title, className, children }: { x: number; y: number; w: number; h: number; title: string; className: string; children: React.ReactNode }) {
  return (
    <g className={className}>
      <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={h} rx="14" className="fill-surface stroke-line-strong" />
      <rect width={w} height="26" rx="14" className="fill-surface-2" />
      <rect y="14" width={w} height="12" className="fill-surface-2" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={14 + i * 11} cy="13" r="3.2" className={i === 0 ? 'fill-ember' : 'fill-line-strong'} />
      ))}
      <text x={w - 12} y="17" textAnchor="end" className="fill-ink-3 font-mono" fontSize="8.5">
        {title}
      </text>
      <g transform="translate(0 26)">{children}</g>
      </g>
    </g>
  )
}

function Build() {
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <rect width="400" height="500" className="fill-bg-2" />
      <g opacity="0.5">
        {Array.from({ length: 11 }).map((_, i) => (
          <path key={i} d={`M${i * 40} 0V500`} className="stroke-line" />
        ))}
      </g>
      <Win x={30} y={40} w={250} h={190} title="DYNAMICS 365" className="build-win build-win-1">
        <rect x="14" y="14" width="222" height="70" rx="8" className="fill-gold" opacity="0.85" />
        <text x="26" y="62" className="fill-on-gold font-display" fontSize="18" fontWeight="800">
          Sales Hub
        </text>
        {[0, 1, 2].map((i) => (
          <rect key={i} x={14 + i * 76} y="96" width="68" height="50" rx="6" className="fill-surface-2" />
        ))}
      </Win>
      <Win x={120} y={170} w={250} h={200} title="POWER APPS" className="build-win build-win-2">
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x="16" y={16 + i * 44} width="70" height="6" rx="3" className="fill-ink-3" />
            <rect x="16" y={28 + i * 44} width="218" height="22" rx="6" className="fill-surface-2 stroke-line" />
          </g>
        ))}
        <rect x="140" y="148" width="94" height="24" rx="12" className="fill-gold" />
        <text x="187" y="164" textAnchor="middle" className="fill-on-gold" fontSize="10" fontWeight="700">
          Submit
        </text>
      </Win>
      <Win x={50} y={300} w={230} h={170} title="COPILOT" className="build-win build-win-3">
        <rect x="80" y="14" width="136" height="30" rx="12" className="fill-ember" />
        <rect x="92" y="26" width="100" height="6" rx="3" fill="#120f0b" opacity="0.6" />
        <rect x="14" y="54" width="170" height="54" rx="12" className="fill-surface-2" />
        <rect x="26" y="68" width="140" height="6" rx="3" className="fill-ink-2" />
        <rect x="26" y="82" width="110" height="6" rx="3" className="fill-ink-3" />
        <rect x="14" y="116" width="92" height="20" rx="10" fill="none" className="stroke-gold" />
        <text x="60" y="130" textAnchor="middle" className="fill-gold" fontSize="8.5">
          Policy §4.2
        </text>
      </Win>
      <g className="build-spark" style={{ transformOrigin: '330px 90px' }}>
        <path d="M330 60c3 20 12 29 30 30-18 3-27 12-30 30-3-18-12-27-30-30 18-1 27-10 30-30Z" className="fill-gold" />
      </g>
    </svg>
  )
}

function Deliver({ id }: { id: string }) {
  const bars = [90, 120, 105, 150, 170, 210, 240]
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-deliver-area`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--gold)', stopOpacity: 0.35 }} />
          <stop offset="1" style={{ stopColor: 'var(--gold)', stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      <rect width="400" height="500" className="fill-surface" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M30 ${150 + i * 60}H370`} className="stroke-line" />
      ))}
      {bars.map((h, i) => (
        <rect
          key={i}
          className={`deliver-bar ${i === bars.length - 1 ? 'fill-gold' : 'fill-surface-2'}`}
          x={44 + i * 46}
          y={390 - h}
          width="28"
          height={h}
          rx="6"
          style={{ transformOrigin: `${58 + i * 46}px 390px`, transformBox: 'view-box' }}
        />
      ))}
      <path d="M40 330C90 320 110 280 150 270S220 220 260 190 330 130 360 110V390H40Z" fill={`url(#${id}-deliver-area)`} className="deliver-area" />
      <path d="M40 330C90 320 110 280 150 270S220 220 260 190 330 130 360 110" fill="none" className="deliver-line stroke-gold" strokeWidth="3" strokeLinecap="round" />
      <circle cx="360" cy="110" r="7" className="deliver-dot fill-ember" />
      <g className="deliver-card">
        <rect x="30" y="36" width="160" height="78" rx="14" className="fill-bg stroke-line-strong" />
        <text x="46" y="80" className="fill-gold font-display" fontSize="30" fontWeight="800">
          −55%
        </text>
        <text x="46" y="100" className="fill-ink-3" fontSize="10.5">
          manual processing
        </text>
      </g>
      <g className="deliver-card">
        <rect x="206" y="36" width="164" height="78" rx="14" className="fill-bg stroke-line-strong" />
        <text x="222" y="80" className="fill-ink font-display" fontSize="30" fontWeight="800">
          4.8/5
        </text>
        <text x="222" y="100" className="fill-ink-3" fontSize="10.5">
          average user rating
        </text>
      </g>
      <text x="30" y="440" className="fill-ink-3 font-mono" fontSize="10" letterSpacing="2">
        DEV → UAT → PRODUCTION
      </text>
    </svg>
  )
}
