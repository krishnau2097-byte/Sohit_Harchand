'use client'

import { createElement } from 'react'
import { animate, onScroll, splitText, stagger, utils } from 'animejs'
import { useAnimeScope } from '@/hooks/useAnimeScope'
import { onLoaderDone } from '@/lib/motion'

type Tag = 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'

type Props = {
  as?: Tag
  children: string
  className?: string
  /** chars on desktop fall back to words on phones, per the plan. */
  split?: 'chars' | 'words' | 'lines'
  delay?: number
  step?: number
  /** scroll: when it enters the viewport; loader: after the intro loader; mount: immediately. */
  trigger?: 'scroll' | 'loader' | 'mount'
  id?: string
}

/**
 * Accessible kinetic headline: Anime.js splitText (keeps a screen-reader copy)
 * + a staggered rise from a clipped line.
 */
export function RevealText({ as = 'h2', children, className = '', split = 'chars', delay = 0, step, trigger = 'scroll', id }: Props) {
  const { root } = useAnimeScope<HTMLElement>(({ root, matches, reduced }) => {
    if (reduced) return
    const mode = matches.mobile && split === 'chars' ? 'words' : split
    const splitter = splitText(root, mode === 'lines' ? { lines: { wrap: 'clip' } } : { [mode]: { wrap: 'clip' } })
    const targets = mode === 'chars' ? splitter.chars : mode === 'words' ? splitter.words : splitter.lines
    utils.set(targets, { y: '110%' })
    utils.set(root, { opacity: 1 })

    const params = {
      y: ['110%', '0%'],
      duration: 1100,
      ease: 'out(4)',
      delay: stagger(step ?? (mode === 'chars' ? 24 : mode === 'words' ? 70 : 120), { start: delay }),
    }

    if (trigger === 'scroll') {
      animate(targets, { ...params, autoplay: onScroll({ target: root, enter: '92% top', repeat: false }) })
    } else if (trigger === 'mount') {
      animate(targets, params)
    } else {
      const anim = animate(targets, { ...params, autoplay: false })
      return onLoaderDone(() => anim.play())
    }
  })

  return createElement(as, { ref: root, id, 'data-reveal': '', className: `reveal-text ${className}` }, children)
}
