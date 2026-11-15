'use client'

import { useEffect, useRef } from 'react'
import { createScope, createTimeline, stagger, svg, utils } from 'animejs'
import { markLoaderDone } from '@/lib/motion'
import { profile } from '@/content/profile'

/**
 * First-visit loader (≤1.2 s): a monogram drawn as an SVG stroke, a 0→100
 * counter, then a curtain wipe. Skipped on repeat visits in the same session
 * and with reduced motion (the head script hides it before first paint).
 */
export function Loader() {
  const root = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = root.current!
    const html = document.documentElement
    if (html.classList.contains('loader-skip') || html.classList.contains('reduce-motion')) {
      markLoaderDone()
      return
    }

    const scope = createScope({ root: el }).add(() => {
      const mobile = window.matchMedia('(max-width: 767px)').matches
      const T = mobile ? 800 : 1200
      const count = { v: 0 }
      const counter = counterRef.current!

      const paths = svg.createDrawable('.loader-path')
      utils.set(paths, { draw: '0 0' })
      utils.set('.loader-mark', { opacity: 1 })

      createTimeline({
        defaults: { ease: 'inOut(3)' },
        onComplete: () => {
          el.style.display = 'none'
        },
      })
        .add(paths, { draw: ['0 0', '0 1'], duration: T * 0.55, delay: stagger(70) }, 0)
        .add('.loader-initials', { opacity: [0, 1], y: [12, 0], duration: T * 0.3, ease: 'out(3)' }, T * 0.3)
        .add(
          count,
          {
            v: 100,
            duration: T * 0.62,
            ease: 'inOut(2)',
            onUpdate: () => {
              counter.textContent = String(Math.round(count.v)).padStart(3, '0')
            },
          },
          0,
        )
        .add('.loader-meta', { opacity: [0, 1], duration: T * 0.25 }, 0)
        .add('.loader-inner', { opacity: 0, y: -30, duration: T * 0.2, ease: 'in(2)' }, T * 0.64)
        .call(markLoaderDone, T * 0.72)
        .add(el, { clipPath: ['inset(0% 0% 0% 0%)', 'inset(0% 0% 100% 0%)'], duration: T * 0.38, ease: 'inOut(4)' }, T * 0.66)
    })

    return () => scope.revert()
  }, [])

  return (
    <div
      ref={root}
      className="site-loader fixed inset-0 z-[80] flex items-center justify-center bg-bg"
      aria-hidden="true"
    >
      <div className="loader-inner relative flex flex-col items-center">
        <svg width="132" height="132" viewBox="0 0 132 132" fill="none" className="loader-mark text-gold opacity-0">
          <path className="loader-path" d="M66 4 128 66 66 128 4 66Z" stroke="currentColor" strokeWidth="1.2" />
          <path className="loader-path" d="M66 18 114 66 66 114 18 66Z" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <path className="loader-path" d="M40 92c10-6 18-26 26-26s10 18 26 26" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        <span className="loader-initials font-wide absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[62%] text-3xl text-gold opacity-0">
          {profile.initials}
        </span>
      </div>
      <div className="loader-meta absolute inset-x-6 bottom-6 flex items-end justify-between opacity-0 md:inset-x-10 md:bottom-10">
        <p className="eyebrow">{profile.initials} · Portfolio {new Date().getFullYear()}</p>
        <span ref={counterRef} className="font-wide text-5xl text-gold tabular-nums md:text-7xl">
          000
        </span>
      </div>
    </div>
  )
}
