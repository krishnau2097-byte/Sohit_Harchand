'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * One small client island for page-wide effects:
 *  - scroll reveals: adds .is-in to [data-reveal] elements as they enter view
 *    (including ones rendered later, e.g. after a filter change);
 *  - card spotlight: sets --mx/--my on the .spotlight card under the pointer.
 */
export function Interactions() {
  const pathname = usePathname()

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.classList.add('is-in')
          io.unobserve(e.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    const watch = (root: ParentNode) => root.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => io.observe(el))
    watch(document)

    const mo = new MutationObserver((records) => {
      for (const r of records) r.addedNodes.forEach((n) => n instanceof Element && (n.matches('[data-reveal]') ? io.observe(n) : watch(n)))
    })
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [pathname])

  useEffect(() => {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const move = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.<HTMLElement>('.spotlight')
      if (!card) return
      const r = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${e.clientX - r.left}px`)
      card.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    document.addEventListener('pointermove', move, { passive: true })
    return () => document.removeEventListener('pointermove', move)
  }, [])

  return null
}
