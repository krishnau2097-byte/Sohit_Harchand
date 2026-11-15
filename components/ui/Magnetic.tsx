'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { animate, spring } from 'animejs'
import { isFinePointer, isReducedMotion } from '@/lib/motion'

/** Pulls its child toward the pointer and springs back on leave. Off on touch and reduced motion. */
export function Magnetic({ children, strength = 0.35, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!isFinePointer() || isReducedMotion()) return
    const wrap = ref.current!
    const target = wrap.firstElementChild as HTMLElement | null
    if (!target) return
    const release = spring({ stiffness: 170, damping: 9 })

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect()
      const x = (e.clientX - (r.left + r.width / 2)) * strength
      const y = (e.clientY - (r.top + r.height / 2)) * strength
      animate(target, { x, y, duration: 450, ease: 'out(3)' })
    }
    const onLeave = () => animate(target, { x: 0, y: 0, ease: release })

    wrap.addEventListener('pointermove', onMove)
    wrap.addEventListener('pointerleave', onLeave)
    return () => {
      wrap.removeEventListener('pointermove', onMove)
      wrap.removeEventListener('pointerleave', onLeave)
    }
  }, [strength])

  return (
    <span ref={ref} className={`inline-flex ${className}`}>
      {children}
    </span>
  )
}
