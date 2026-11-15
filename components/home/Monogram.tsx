'use client'

import { useEffect, useRef } from 'react'
import { onLoaderDone } from '@/lib/motion'

type Props = {
  className?: string
  /** Keeps SVG ids unique when the monogram is on the page twice. */
  idPrefix?: string
}

/**
 * Calligraphic SH monogram that stands where the portrait used to. Same 400×520
 * canvas as the old bust, so the hero's sizing (letters overlapping the giant
 * word) and every hero animation still apply to it. Once the loader lifts, the
 * frame and letters trace in as pen strokes, the gold fill settles, and an
 * ember orbits the frame.
 */
export function Monogram({ className = '', idPrefix = 'mono' }: Props) {
  const ref = useRef<SVGSVGElement>(null)
  const id = (n: string) => `${idPrefix}-${n}`

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Draw once the loader has lifted and the monogram is on screen, so the strokes are seen, not missed.
    let io: IntersectionObserver | undefined
    const stop = onLoaderDone(() => {
      io = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return
        el.classList.add('is-drawn')
        io?.disconnect()
      }, { threshold: 0.25 })
      io.observe(el)
    })
    return () => {
      stop()
      io?.disconnect()
    }
  }, [])

  return (
    <svg ref={ref} viewBox="0 0 400 520" className={`monogram w-auto overflow-visible select-none ${className}`} role="img" aria-label="SH monogram">
      <defs>
        <linearGradient id={id('gold')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--gold-3)" />
          <stop offset="50%" stopColor="var(--gold)" />
          <stop offset="100%" stopColor="var(--gold-2)" />
        </linearGradient>
        <radialGradient id={id('glow')} cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="var(--gold-3)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--gold-3)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="200" cy="250" r="210" fill={`url(#${id('glow')})`} />

      {/* Double diamond frame, echoing the navbar and loader mark */}
      <g fill="none" stroke={`url(#${id('gold')})`} strokeLinejoin="round">
        <path className="mono-stroke" pathLength={1} d="M200 40 395 250 200 460 5 250Z" strokeWidth="1.6" />
        <path className="mono-stroke mono-delay-1" pathLength={1} d="M200 78 358 250 200 422 42 250Z" strokeWidth="0.9" opacity="0.55" />
      </g>

      {/* Ember orbiting the outer frame */}
      <g className="mono-orbit">
        <circle cx="200" cy="40" r="5" fill="var(--ember)" />
        <circle cx="200" cy="40" r="12" fill="var(--ember)" opacity="0.18" />
      </g>

      {/* The letters */}
      <text
        x="196"
        y="312"
        textAnchor="middle"
        className="mono-letters"
        fill={`url(#${id('gold')})`}
        stroke={`url(#${id('gold')})`}
        strokeWidth="1.4"
        style={{ fontFamily: 'var(--font-signature), cursive', fontSize: 212 }}
      >
        SH
      </text>

      {/* Flourish under the letters, ending in a spark */}
      <path
        className="mono-stroke mono-delay-2"
        pathLength={1}
        d="M70 372 C 140 392, 250 394, 318 356 C 340 343, 344 326, 326 326 C 306 326, 300 352, 332 360"
        fill="none"
        stroke={`url(#${id('gold')})`}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path className="mono-spark" d="M346 300 l5 11 11 5 -11 5 -5 11 -5 -11 -11 -5 11 -5Z" fill="var(--gold-3)" />
    </svg>
  )
}
