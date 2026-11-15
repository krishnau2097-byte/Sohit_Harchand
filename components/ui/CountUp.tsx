'use client'

import { useEffect, useRef } from 'react'

/** Counts from 0 to `value` once the number scrolls into view. Server-renders the final value. */
export function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    el.textContent = `0${suffix}`
    let raf = 0
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const duration = 1200
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        el.textContent = `${Math.round(value * (1 - Math.pow(1 - t, 3)))}${suffix}`
        if (t < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    })
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value, suffix])

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  )
}
