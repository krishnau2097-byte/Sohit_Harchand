'use client'

/** Media queries shared by every createScope, so each component can branch per breakpoint. */
export const mediaQueries = {
  mobile: '(max-width: 767px)',
  desktop: '(min-width: 768px)',
  fine: '(hover: hover) and (pointer: fine)',
  reduced: '(prefers-reduced-motion: reduce)',
}

/** The inline head script adds `.reduce-motion` to <html> when the OS asks for it. */
export function isReducedMotion() {
  if (typeof document === 'undefined') return false
  return document.documentElement.classList.contains('reduce-motion')
}

export function isFinePointer() {
  if (typeof window === 'undefined') return false
  return window.matchMedia(mediaQueries.fine).matches
}

/* ------------------------------------------------------------------
   Loader hand-off. The hero waits for the loader's curtain before
   playing its entrance; on repeat visits the loader is skipped and
   the callback runs straight away.
------------------------------------------------------------------- */
declare global {
  interface Window {
    __loaderDone?: boolean
  }
}

export function markLoaderDone() {
  if (typeof window === 'undefined' || window.__loaderDone) return
  window.__loaderDone = true
  document.documentElement.classList.remove('is-loading')
  try {
    sessionStorage.setItem('loader-seen', '1')
  } catch {}
  window.dispatchEvent(new Event('loader:done'))
}

export function onLoaderDone(cb: () => void) {
  if (typeof window === 'undefined') return () => {}
  const html = document.documentElement
  if (window.__loaderDone || html.classList.contains('loader-skip') || html.classList.contains('reduce-motion')) {
    const id = requestAnimationFrame(cb)
    return () => cancelAnimationFrame(id)
  }
  const handler = () => cb()
  window.addEventListener('loader:done', handler, { once: true })
  return () => window.removeEventListener('loader:done', handler)
}

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/* ------------------------------------------------------------------
   Shared, smoothed scroll velocity (px per frame). One rAF loop runs
   only while something is subscribed.
------------------------------------------------------------------- */
const velocityListeners = new Set<(v: number) => void>()
let velocityRaf = 0

export function onScrollVelocity(cb: (v: number) => void) {
  velocityListeners.add(cb)
  if (velocityListeners.size === 1) {
    let lastY = window.scrollY
    let smooth = 0
    const loop = () => {
      velocityRaf = requestAnimationFrame(loop)
      const y = window.scrollY
      smooth = lerp(smooth, y - lastY, 0.18)
      lastY = y
      if (Math.abs(smooth) < 0.01) smooth = 0
      velocityListeners.forEach((l) => l(smooth))
    }
    velocityRaf = requestAnimationFrame(loop)
  }
  return () => {
    velocityListeners.delete(cb)
    if (!velocityListeners.size) cancelAnimationFrame(velocityRaf)
  }
}
