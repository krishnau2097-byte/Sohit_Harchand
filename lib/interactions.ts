'use client'

import { animate, spring } from 'animejs'
import { isFinePointer, isReducedMotion } from './motion'

/**
 * Spotlight + 3D tilt for cards: sets --mx/--my for the .spotlight glow and
 * tilts the card toward the pointer, springing back on leave. Returns a
 * cleanup function. No-op on touch devices and with reduced motion.
 */
export function attachSpotlight(elements: Iterable<HTMLElement>, { tilt = 7, lift = 0 }: { tilt?: number; lift?: number } = {}) {
  if (!isFinePointer() || isReducedMotion()) return () => {}
  const release = spring({ stiffness: 130, damping: 11 })
  const offs: (() => void)[] = []
  for (const el of elements) {
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      el.style.setProperty('--mx', `${px * 100}%`)
      el.style.setProperty('--my', `${py * 100}%`)
      if (tilt) animate(el, { perspective: '1000px', rotateY: (px - 0.5) * tilt, rotateX: (0.5 - py) * tilt, ...(lift ? { y: -lift } : {}), duration: 450, ease: 'out(3)' })
    }
    const leave = () => {
      if (tilt) animate(el, { perspective: '1000px', rotateY: 0, rotateX: 0, ...(lift ? { y: 0 } : {}), ease: release })
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    offs.push(() => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    })
  }
  return () => offs.forEach((o) => o())
}
