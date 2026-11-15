'use client'

import { type ReactNode } from 'react'
import { waapi } from 'animejs'
import { useAnimeScope } from '@/hooks/useAnimeScope'
import { clamp, onScrollVelocity } from '@/lib/motion'

type Props = {
  children: ReactNode
  /** Seconds for one full loop. */
  speed?: number
  reverse?: boolean
  className?: string
  pauseOnHover?: boolean
  /** Speed up and lean with scroll velocity. */
  reactive?: boolean
}

/**
 * Infinite marquee on a hardware-accelerated WAAPI loop (Anime.js waapi.animate).
 * Content is rendered twice; the track slides by exactly half its width.
 * When reactive, scrolling speeds it up and skews it in the scroll direction.
 */
export function Marquee({ children, speed = 40, reverse = false, className = '', pauseOnHover = true, reactive = true }: Props) {
  const { root } = useAnimeScope<HTMLDivElement>(({ root, reduced }) => {
    if (reduced) return
    const track = root.querySelector<HTMLElement>('.marquee-track')!
    const anim = waapi.animate(track, {
      transform: reverse ? ['translateX(-50%)', 'translateX(0%)'] : ['translateX(0%)', 'translateX(-50%)'],
      duration: speed * 1000,
      ease: 'linear',
      loop: true,
    })
    let hover = 1
    let boost = 1
    const apply = () => (anim.speed = hover * boost)
    const slow = () => {
      if (!pauseOnHover) return
      hover = 0.25
      apply()
    }
    const resume = () => {
      hover = 1
      apply()
    }
    root.addEventListener('pointerenter', slow)
    root.addEventListener('pointerleave', resume)
    const offVelocity = reactive
      ? onScrollVelocity((v) => {
          boost = 1 + Math.min(Math.abs(v) * 0.22, 6)
          apply()
          root.style.transform = v ? `skewX(${clamp(-v * 0.3, -12, 12)}deg)` : ''
        })
      : () => {}
    return () => {
      offVelocity()
      root.removeEventListener('pointerenter', slow)
      root.removeEventListener('pointerleave', resume)
    }
  })

  return (
    <div ref={root} className={`marquee overflow-hidden ${className}`}>
      <div className="marquee-track">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
