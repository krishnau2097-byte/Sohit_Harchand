'use client'

import Lenis from 'lenis'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

let lenisInstance: Lenis | null = null

/** Read the live Lenis instance at event time (null on touch devices and with reduced motion). */
export const getLenis = () => lenisInstance

export function scrollToTarget(target: string | number | HTMLElement, offset = 0) {
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.4 })
    return
  }
  const reduce = document.documentElement.classList.contains('reduce-motion')
  const behavior: ScrollBehavior = reduce ? 'auto' : 'smooth'
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior })
    return
  }
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior })
}

/**
 * Lenis smooth scroll for mouse/trackpad users. Anime.js onScroll observers
 * read the window scroll position that Lenis drives, so both stay in sync.
 * Touch devices and reduced-motion users keep native scrolling.
 */
export function SmoothScroll() {
  const pathname = usePathname()

  useEffect(() => {
    const html = document.documentElement
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (html.classList.contains('reduce-motion') || coarse) return

    const lenis = new Lenis({ lerp: 0.095, wheelMultiplier: 1, smoothWheel: true })
    lenisInstance = lenis
    if (process.env.NODE_ENV !== 'production') (window as unknown as { __lenis?: Lenis }).__lenis = lenis
    if (html.classList.contains('is-loading')) lenis.stop()
    const onDone = () => lenis.start()
    window.addEventListener('loader:done', onDone)

    let raf = requestAnimationFrame(function loop(time) {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('loader:done', onDone)
      lenis.destroy()
      lenisInstance = null
    }
  }, [])

  useEffect(() => {
    if (window.location.hash) return
    lenisInstance?.scrollTo(0, { immediate: true, force: true })
  }, [pathname])

  return null
}
