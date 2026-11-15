'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUp } from './ui/Icons'

const R = 18
const C = 2 * Math.PI * R

/** Reading-progress hairline at the top, plus a back-to-top button whose ring fills as you scroll. */
export function BackToTop() {
  const ringRef = useRef<SVGCircleElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0
      ringRef.current?.style.setProperty('stroke-dashoffset', String(C * (1 - p)))
      barRef.current?.style.setProperty('--progress', String(p))
      setShown(window.scrollY > 600)
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
      <div ref={barRef} className="scroll-progress pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] bg-gradient-to-r from-gold via-ember to-gold-3" aria-hidden="true" />
      <button
        type="button"
        aria-label="Back to top"
        tabIndex={shown ? 0 : -1}
        onClick={() => window.scrollTo({ top: 0 })}
        className={`fixed right-4 bottom-4 z-40 grid h-11 w-11 place-items-center rounded-full bg-surface text-gold shadow-[var(--shadow)] transition-all duration-300 md:right-6 md:bottom-6 ${
          shown ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
        }`}
      >
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 44 44" aria-hidden="true">
          <circle cx="22" cy="22" r={R} fill="none" stroke="var(--line)" strokeWidth="1.5" />
          <circle ref={ringRef} cx="22" cy="22" r={R} fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeDasharray={C} strokeDashoffset={C} strokeLinecap="round" />
        </svg>
        <ArrowUp size={16} />
      </button>
    </>
  )
}
