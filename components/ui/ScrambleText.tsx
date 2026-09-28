'use client'

import { animate, onScroll, scrambleText } from 'animejs'
import { useAnimeScope } from '@/hooks/useAnimeScope'

type Props = {
  children: string
  className?: string
  /** Characters used while decoding. */
  chars?: string
  delay?: number
}

/** Eyebrow labels that decode themselves when scrolled into view (Anime.js scrambleText). */
export function ScrambleText({ children, className = '', chars = 'A-Z0-9·—/', delay = 0 }: Props) {
  const { root } = useAnimeScope<HTMLSpanElement>(
    ({ root, reduced }) => {
      if (reduced) return
      animate(root, {
        innerHTML: scrambleText({ text: children, chars, override: '', settleDuration: 260, revealRate: 45, cursor: '▍' }),
        delay,
        autoplay: onScroll({ target: root, enter: '95% top', repeat: false }),
      })
    },
    [children],
  )

  return (
    <span className={className}>
      <span className="visually-hidden">{children}</span>
      <span ref={root} aria-hidden="true">
        {children}
      </span>
    </span>
  )
}
