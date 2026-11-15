'use client'

import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { createTimeline, scrambleText, stagger } from 'animejs'

/** Path of the last page the curtain played for (null until the first page load). */
let lastPath: string | null = null

const labelFor = (path: string) => {
  if (path === '/') return 'Home'
  const seg = path.split('/')[1] ?? ''
  return seg.charAt(0).toUpperCase() + seg.slice(1)
}

/**
 * Route transition. Templates remount on navigation, so each new page starts
 * under a dark curtain that names the page (scrambleText), then the curtain
 * wipes upward and the page fades in. Skipped on the first load (the intro
 * loader covers that) and with reduced motion.
 */
export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const curtainRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (lastPath === null) {
      lastPath = pathname
      return
    }
    // Same path again = React strict mode re-running this effect; the first run's timeline keeps playing.
    if (lastPath === pathname) return
    lastPath = pathname
    if (document.documentElement.classList.contains('reduce-motion')) return

    const curtain = curtainRef.current!
    const page = pageRef.current!
    curtain.style.display = 'flex'
    createTimeline({
      defaults: { ease: 'inOut(4)' },
      onComplete: () => {
        curtain.style.display = 'none'
      },
    })
      .add(curtain.querySelector('.curtain-label')!, { innerHTML: scrambleText({ text: labelFor(pathname), chars: 'A-Z', override: '', revealRate: 40 }) }, 0)
      .add(curtain.querySelectorAll('.curtain-line'), { scaleX: [0, 1], duration: 500, delay: stagger(80), ease: 'out(3)' }, 0)
      .add(curtain, { clipPath: ['inset(0% 0% 0% 0%)', 'inset(0% 0% 100% 0%)'], duration: 850 }, 420)
      // Opacity only: moving the page would shift every scroll trigger measured while it animates.
      .add(page, { opacity: [0, 1], duration: 900, ease: 'out(3)' }, 480)
  }, [pathname])

  return (
    <>
      <div
        ref={curtainRef}
        className="fixed inset-0 z-[45] flex-col items-center justify-center gap-6 bg-block text-block-ink"
        style={{ display: 'none' }}
        aria-hidden="true"
      >
        <span className="curtain-line h-px w-40 origin-left bg-current opacity-40" />
        <span className="curtain-label font-wide text-[clamp(3rem,10vw,9rem)] leading-none" />
        <span className="curtain-line h-px w-40 origin-right bg-current opacity-40" />
      </div>
      <div ref={pageRef}>{children}</div>
    </>
  )
}
