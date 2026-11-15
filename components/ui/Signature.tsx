'use client'

import { useEffect, useRef } from 'react'
import { animate, svg, type Animatable } from 'animejs'
import { isReducedMotion } from '@/lib/motion'

type SignatureProps = {
  className?: string
  animated?: boolean
  width?: number | string
  height?: number | string
  color?: string
  showFlourish?: boolean
}

/**
 * Handcrafted "SH" signature with an animated calligraphy flourish.
 */
export function Signature({
  className = '',
  animated = false,
  width = 240,
  height = 70,
  color = 'var(--gold)',
  showFlourish = true,
}: SignatureProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!animated || isReducedMotion() || !svgRef.current) return
    const paths = svgRef.current.querySelectorAll<SVGPathElement>('.sig-stroke')
    if (!paths.length) return

    paths.forEach((p) => {
      const len = p.getTotalLength?.() || 300
      p.style.strokeDasharray = `${len}`
      p.style.strokeDashoffset = `${len}`
    })

    animate(paths, {
      strokeDashoffset: [300, 0],
      duration: 1800,
      ease: 'inOut(3)',
      delay: (el, i) => (i ?? 0) * 150,
    })
  }, [animated])

  return (
    <div className={`relative inline-flex items-center select-none ${className}`}>
      <svg
        ref={svgRef}
        viewBox="0 0 150 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width, height }}
        className="overflow-visible"
        aria-label="SH signature"
      >
        <defs>
          <linearGradient id="sigGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--gold-3, #d4a753)" />
            <stop offset="50%" stopColor="var(--gold, #b88628)" />
            <stop offset="100%" stopColor="var(--gold-2, #8f6215)" />
          </linearGradient>
          <filter id="sigGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <g filter="url(#sigGlow)">
          {/* Handwritten text rendered with the high-resolution Alex Brush glyph baseline */}
          <text
            x="12"
            y="52"
            fill="url(#sigGold)"
            className="font-signature select-none"
            style={{
              fontSize: '52px',
              fontStyle: 'italic',
              letterSpacing: '0.04em',
              filter: 'drop-shadow(0 2px 8px rgba(217,164,65,0.3))',
            }}
          >
            SH
          </text>

          {/* Elegant cursive terminal flourish that sweeps under the name */}
          {showFlourish ? (
            <path
              className="sig-stroke"
              d="M10 66 C 40 70, 84 70, 116 58 C 130 53, 136 47, 127 45 C 117 43, 108 56, 124 62"
              stroke="url(#sigGold)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}

          {/* Micro accent diamond sparkle at the end of the flourish */}
          <path
            d="M 136 52 L 140 55 L 136 58 L 132 55 Z"
            fill="var(--gold-3, #d4a753)"
            className="animate-pulse"
          />
        </g>
      </svg>
    </div>
  )
}

/**
 * Compact Navbar Signature Logo badge
 */
export function SignatureLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 group ${className}`}>
      {/* Geometric monogram icon */}
      <span className="relative grid h-10 w-10 place-items-center shrink-0">
        <svg
          viewBox="0 0 40 40"
          className="absolute inset-0 h-full w-full text-gold transition-transform duration-700 group-hover:rotate-90 drop-shadow-[0_0_10px_rgba(217,164,65,0.45)]"
          aria-hidden="true"
        >
          <path d="M20 1.5 38.5 20 20 38.5 1.5 20Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        <span className="font-wide text-[11px] text-gold font-bold">SH</span>
      </span>

      {/* Signature Logo text */}
      <div className="flex flex-col justify-center">
        <Signature width={150} height={36} showFlourish={true} />
        <span className="font-mono text-[9px] tracking-[0.22em] text-ink-3 uppercase -mt-1 pl-1">
          D365 · Power Platform Developer
        </span>
      </div>
    </div>
  )
}
