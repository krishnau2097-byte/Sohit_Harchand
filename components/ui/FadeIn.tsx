'use client'

import { createElement, type ReactNode } from 'react'
import { animate, onScroll, stagger, utils } from 'animejs'
import { useAnimeScope } from '@/hooks/useAnimeScope'

type Props = {
  as?: 'div' | 'p' | 'section' | 'ul' | 'ol' | 'footer' | 'span' | 'article'
  children: ReactNode
  className?: string
  /** Animate these descendants in sequence instead of the element itself. */
  items?: string
  y?: number
  delay?: number
  step?: number
  enter?: string
  id?: string
}

/** Scroll-triggered fade + rise, optionally staggered over child elements. */
export function FadeIn({ as = 'div', children, className = '', items, y = 36, delay = 0, step = 80, enter = '90% top', id }: Props) {
  const { root } = useAnimeScope<HTMLElement>(({ root, reduced }) => {
    if (reduced) return
    const targets = items ? Array.from(root.querySelectorAll<HTMLElement>(items)) : [root]
    if (items) {
      utils.set(root, { opacity: 1 })
      utils.set(targets, { opacity: 0 })
    }
    animate(targets, {
      opacity: [0, 1],
      y: [y, 0],
      duration: 1000,
      ease: 'out(4)',
      delay: stagger(step, { start: delay }),
      autoplay: onScroll({ target: root, enter, repeat: false }),
    })
  })

  return createElement(as, { ref: root, id, 'data-reveal': '', className }, children)
}
