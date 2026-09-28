import Image from 'next/image'
import { profile } from '@/content/profile'

/* Head, ears, neck and jacketed shoulders as one outline (viewBox 400×520). */
const BUST =
  'M12 520L20 424C26 382 42 356 76 340C108 326 146 314 168 298C170 284 170 266 168 250C156 240 146 226 140 210C132 208 126 196 126 182C124 168 128 156 136 158C134 126 140 96 156 76C172 52 190 44 206 44C236 44 258 58 268 84C276 104 274 132 268 158C276 156 280 168 278 182C276 196 270 208 262 210C256 226 246 240 234 250C232 266 232 284 234 298C256 314 294 326 326 340C360 356 376 382 382 424L390 520Z'
const HAIR =
  'M134 164C128 120 140 82 168 60C190 44 226 40 252 54C276 68 284 104 272 164C268 142 262 126 252 116C240 128 214 134 188 128C170 124 156 116 148 108C140 124 136 142 134 164Z'
const SHIRT = 'M168 298L200 372L234 298C222 290 212 286 200 286C188 286 178 290 168 298Z'
const LAPEL_L = 'M168 300C150 316 138 330 128 344L176 424L200 372Z'
const LAPEL_R = 'M234 300C252 316 264 330 274 344L226 424L200 372Z'
const COLLAR_L = 'M168 296L184 332L200 314Z'
const COLLAR_R = 'M234 296L218 332L200 314Z'

type Props = {
  src?: string
  alt?: string
  className?: string
  priority?: boolean
  /** 'default' is the page version; 'lens' is what the hero lens reveals. */
  variant?: 'default' | 'lens'
  /** Keeps SVG ids unique when the portrait is on the page twice. */
  idPrefix?: string
}

/**
 * Editorial portrait that sits in front of the giant word. Renders the user's
 * real portrait in crisp, vibrant color with an arched editorial frame, or falls
 * back to an SVG bust if no photo is configured.
 */
export function Portrait({ variant = 'default', idPrefix = 'p', src, alt, className }: Props) {
  const lens = variant === 'lens'
  const imageSrc = src || profile.portrait

  if (imageSrc) {
    return (
      <div className={`relative h-full w-auto select-none pointer-events-none flex items-end justify-center ${className ?? ''}`}>
        <Image
          src={imageSrc}
          alt={alt ?? `Portrait of ${profile.name}`}
          width={910}
          height={1395}
          priority={true}
          sizes="(max-width: 768px) 85vw, 45vw"
          className="h-full w-auto max-h-full max-w-full object-contain object-bottom select-none filter drop-shadow-[0_20px_45px_rgba(0,0,0,0.7)] drop-shadow-[0_4px_18px_var(--glow)]"
          draggable={false}
        />
        {/* Subtle bottom fade to blend seamlessly into card */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-bg via-bg/40 to-transparent" aria-hidden="true" />
      </div>
    )
  }

  const id = (name: string) => `${idPrefix}-${name}`
  const url = (name: string) => `url(#${id(name)})`
  const shade = 'rgba(0,0,0,0.16)'
  const line = lens ? 'var(--gold)' : 'rgba(0,0,0,0.18)'

  return (
    <svg
      viewBox="0 0 400 520"
      className="h-full w-auto"
      role={lens ? undefined : 'img'}
      aria-label={lens ? undefined : 'Portrait placeholder'}
      aria-hidden={lens || undefined}
    >
      <defs>
        <linearGradient id={id('fill')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: 'color-mix(in oklab, var(--gold) 26%, var(--surface-2))' }} />
          <stop offset="0.55" style={{ stopColor: 'color-mix(in oklab, var(--gold) 14%, var(--surface-2))' }} />
          <stop offset="1" style={{ stopColor: 'var(--bg)' }} />
        </linearGradient>
        <linearGradient id={id('rim')} x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0.5" style={{ stopColor: lens ? 'var(--ember)' : 'var(--gold)', stopOpacity: 0 }} />
          <stop offset="1" style={{ stopColor: lens ? 'var(--ember-2)' : 'var(--gold-3)', stopOpacity: 1 }} />
        </linearGradient>
        <radialGradient id={id('key')} cx="0.7" cy="0.3" r="0.5">
          <stop offset="0" style={{ stopColor: lens ? 'var(--ember)' : 'var(--gold-3)', stopOpacity: 0.35 }} />
          <stop offset="1" style={{ stopColor: 'var(--gold)', stopOpacity: 0 }} />
        </radialGradient>
        <linearGradient id={id('fade')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.72" style={{ stopColor: 'var(--bg)', stopOpacity: 0 }} />
          <stop offset="1" style={{ stopColor: 'var(--bg)', stopOpacity: 0.9 }} />
        </linearGradient>
        <pattern id={id('blinds')} width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(28)">
          <rect width="40" height="18" style={{ fill: 'var(--gold-3)' }} opacity="0.05" />
        </pattern>
        <pattern id={id('grid')} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" style={{ stroke: 'var(--gold)' }} strokeWidth="0.6" opacity="0.35" />
        </pattern>
        <clipPath id={id('clip')}>
          <path d={BUST} />
        </clipPath>
        <filter id={id('glow')} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      <path d={BUST} fill={url('fill')} />
      <g clipPath={url('clip')}>
        {/* Hair, jaw shadow, clothing: quiet tonal shapes, no hard outlines */}
        <path d={HAIR} fill={lens ? 'none' : 'rgba(0,0,0,0.14)'} style={lens ? { stroke: 'var(--gold)' } : undefined} strokeWidth="1" />
        <path d="M150 218C170 248 230 248 250 218" fill="none" stroke={line} strokeWidth="1" opacity="0.35" />
        <path d="M168 250C184 268 216 268 234 250L234 280C216 292 186 292 168 280Z" fill={shade} />
        <path d={SHIRT} style={{ fill: lens ? 'transparent' : 'var(--surface)' }} opacity={lens ? 1 : 0.7} />
        <path d={LAPEL_L} fill={lens ? 'none' : shade} stroke={line} strokeWidth="1" />
        <path d={LAPEL_R} fill={lens ? 'none' : shade} stroke={line} strokeWidth="1" />
        <path d={COLLAR_L} style={{ fill: lens ? 'transparent' : 'var(--surface)' }} stroke={line} strokeWidth="1" />
        <path d={COLLAR_R} style={{ fill: lens ? 'transparent' : 'var(--surface)' }} stroke={line} strokeWidth="1" />
        <path d="M200 372V520" stroke={line} strokeWidth="1" />
        <circle cx="206" cy="452" r="3.5" fill={lens ? 'none' : shade} stroke={lens ? 'var(--gold)' : 'none'} />
        <path d="M78 342C92 384 98 444 100 520M324 342C310 384 304 444 302 520" fill="none" stroke={line} strokeWidth="1" opacity="0.6" />

        <rect width="400" height="520" fill={url('key')} />
        <rect width="400" height="520" fill={url(lens ? 'grid' : 'blinds')} />
        {lens ? (
          <g style={{ stroke: 'var(--gold)' }} fill="none" strokeWidth="1" opacity="0.6">
            <circle cx="202" cy="150" r="62" strokeDasharray="3 5" />
            <path d="M202 60v460M110 162h184" strokeDasharray="2 6" />
          </g>
        ) : null}
        <rect width="400" height="520" fill={url('fade')} />
      </g>
      <path d={BUST} fill="none" stroke={url('rim')} strokeWidth="6" filter={url('glow')} />
      <path d={BUST} fill="none" stroke={url('rim')} strokeWidth="1.4" />
    </svg>
  )
}
