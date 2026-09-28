'use client'

import { useEffect, useRef } from 'react'
import { animate } from 'animejs'
import { scrollToTarget } from './providers/SmoothScroll'
import { ArrowUp } from './ui/Icons'

const R = 22
const C = 2 * Math.PI * R

/** Back-to-top button with a ring that fills as you read the page, plus a top progress bar. */
export function BackToTop() {
  const btnRef = useRef<HTMLButtonElement>(null)
  const ringRef = useRef<SVGCircleElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const btn = btnRef.current!
    const ring = ringRef.current!
    let shown = false
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? window.scrollY / max : 0
      ring.style.strokeDashoffset = String(C * (1 - p))
      barRef.current?.style.setProperty('--progress', String(p))
      const show = window.scrollY > 700
      if (show !== shown) {
        shown = show
        btn.tabIndex = show ? 0 : -1
        animate(btn, { opacity: show ? 1 : 0, scale: show ? 1 : 0.6, y: show ? 0 : 20, duration: 500, ease: 'out(4)' })
        btn.style.pointerEvents = show ? 'auto' : 'none'
      }
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <>
      {/* Reading-progress hairline across the top of the page */}
      <div ref={barRef} className="scroll-progress pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] bg-gradient-to-r from-gold via-ember to-gold-3" aria-hidden="true" />
    <button
      ref={btnRef}
      type="button"
      tabIndex={-1}
      aria-label="Back to top"
      onClick={() => scrollToTarget(0)}
      className="group fixed right-5 bottom-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-surface/80 text-gold opacity-0 shadow-[var(--shadow)] backdrop-blur-md md:right-8 md:bottom-8"
      style={{ pointerEvents: 'none' }}
    >
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 56 56" aria-hidden="true">
        <circle cx="28" cy="28" r={R} fill="none" stroke="var(--line)" strokeWidth="1.5" />
        <circle ref={ringRef} cx="28" cy="28" r={R} fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeDasharray={C} strokeDashoffset={C} strokeLinecap="round" />
      </svg>
      <ArrowUp size={18} className="transition-transform duration-500 group-hover:-translate-y-1" />
    </button>
    </>
  )
}
