'use client'

import { useEffect, useRef, useState } from 'react'
import { profile } from '@/content/profile'
import { isReducedMotion } from '@/lib/motion'
import { Signature } from './ui/Signature'

/**
 * Storytelling footer reveal:
 * As the user scrolls into the bottom of the page, the signature and giant word
 * become visible from bottom to upward, illuminate in full view, and smoothly
 * dissolve/disappear as scrolling continues off.
 */
export function FooterStoryName() {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [signatureAnimated, setSignatureAnimated] = useState(false)
  const triggeredRef = useRef(false)

  useEffect(() => {
    const container = containerRef.current
    const content = contentRef.current
    if (!container || !content) return

    if (isReducedMotion()) {
      content.style.opacity = '1'
      content.style.transform = 'none'
      content.style.filter = 'none'
      setSignatureAnimated(true)
      return
    }

    let rafId: number
    const onScrollUpdate = () => {
      const rect = container.getBoundingClientRect()
      const winH = window.innerHeight

      // If entirely below screen
      if (rect.top >= winH) {
        content.style.opacity = '0'
        content.style.transform = 'translate3d(0, 80px, 0) scale(0.92)'
        content.style.filter = 'blur(8px)'
        return
      }

      // If entirely above screen
      if (rect.bottom <= 0) {
        content.style.opacity = '0'
        content.style.transform = 'translate3d(0, -60px, 0) scale(0.95)'
        content.style.filter = 'blur(6px)'
        return
      }

      // Entry phase: rect.top enters from winH to (winH * 0.5)
      const enterDist = winH * 0.55
      const enterProgress = Math.min(1, Math.max(0, (winH - rect.top) / enterDist))

      // Exit phase: rect.bottom leaves towards top from (winH * 0.25) to 0
      const exitDist = winH * 0.25
      const exitProgress = rect.bottom < exitDist ? Math.min(1, Math.max(0, (exitDist - rect.bottom) / exitDist)) : 0

      let opacity = 1
      let translateY = 0
      let scale = 1
      let blur = 0

      if (enterProgress < 1) {
        // Smooth cubic ease out
        const ease = 1 - Math.pow(1 - enterProgress, 3)
        opacity = ease
        translateY = 80 * (1 - ease)
        scale = 0.92 + 0.08 * ease
        blur = 8 * (1 - ease)

        if (enterProgress > 0.3 && !triggeredRef.current) {
          triggeredRef.current = true
          setSignatureAnimated(true)
        }
      } else if (exitProgress > 0) {
        // Smooth quadratic ease in for exit
        const ease = Math.pow(exitProgress, 2)
        opacity = Math.max(0, 1 - ease * 1.2)
        translateY = -60 * ease
        scale = 1 - 0.05 * ease
        blur = 6 * ease
      } else {
        // Fully visible in view
        opacity = 1
        translateY = 0
        scale = 1
        blur = 0
        if (!triggeredRef.current) {
          triggeredRef.current = true
          setSignatureAnimated(true)
        }
      }

      content.style.opacity = `${opacity}`
      content.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`
      content.style.filter = blur > 0.1 ? `blur(${blur}px)` : 'none'
    }

    const handler = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(onScrollUpdate)
    }

    // Initial check
    handler()

    // Listen on window scroll
    window.addEventListener('scroll', handler, { passive: true })
    window.addEventListener('resize', handler, { passive: true })

    // IntersectionObserver as backup trigger
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(() => handler())
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.5, 0.7, 1] }
    )
    observer.observe(container)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', handler)
      window.removeEventListener('resize', handler)
      observer.disconnect()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative min-h-[340px] sm:min-h-[420px] md:min-h-[480px] flex flex-col items-center justify-center py-14 select-none"
      aria-label="Creator Signature and Identity"
    >
      {/* Ambient background glow spotlight */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30"
        aria-hidden="true"
      >
        <div className="h-[280px] w-[80vw] max-w-[900px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(217,164,65,0.22),transparent_70%)] blur-3xl" />
      </div>

      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center justify-center text-center will-change-transform"
        style={{ opacity: 0, transform: 'translate3d(0, 80px, 0) scale(0.92)' }}
      >
        {/* Storytelling badge & Handwritten Signature */}
        <div className="flex flex-col items-center gap-3 mb-4 md:mb-6">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-gold/50" />
            <span className="font-mono text-xs tracking-[0.28em] text-gold uppercase">
              Crafted &amp; Engineered By
            </span>
            <span className="h-px w-8 bg-gold/50" />
          </div>

          {/* Suneha-style Handwritten Signature with Calligraphy Flourish */}
          <div className="mt-1 transform transition-transform duration-500 hover:scale-105">
            <Signature
              width="clamp(220px, 28vw, 360px)"
              height="clamp(60px, 8vw, 90px)"
              animated={signatureAnimated}
              showFlourish={true}
            />
          </div>
        </div>

        {/* Giant Monolithic Name in Storytelling Reveal */}
        <p className="font-wide text-center text-[clamp(1.8rem,7.2vw,8.2rem)] leading-[0.9] whitespace-nowrap bg-gradient-to-b from-gold-3 via-gold to-gold-2 bg-clip-text text-transparent drop-shadow-[0_10px_35px_rgba(217,164,65,0.25)]">
          {profile.footerWord}
        </p>

        {/* Subtitle tag */}
        <p className="mt-4 font-mono text-xs tracking-[0.3em] text-ink-3 uppercase">
          {profile.footerTagline}
        </p>

        {/* Location & availability tag */}
        <p className="mt-2 font-mono text-[11px] tracking-wider text-gold/70">
          Based in {profile.location} · Delivering Worldwide
        </p>
      </div>
    </div>
  )
}
