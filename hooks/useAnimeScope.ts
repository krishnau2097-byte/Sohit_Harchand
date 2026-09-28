'use client'

import { useEffect, useRef, type DependencyList } from 'react'
import { createScope, type Scope } from 'animejs'
import { isReducedMotion, mediaQueries } from '@/lib/motion'

type Setup<T> = (ctx: { scope: Scope; root: T; matches: Record<string, boolean>; reduced: boolean }) => void | (() => void)

/**
 * The React rule from the plan: every component builds its animations inside
 * createScope({ root }) and reverts them on unmount. Scope re-runs the setup
 * when a media query flips (mobile ↔ desktop) and reverts everything it made,
 * including splitText, onScroll observers and draggables.
 */
export function useAnimeScope<T extends HTMLElement = HTMLElement>(setup: Setup<T>, deps: DependencyList = []) {
  const root = useRef<T>(null)
  const scopeRef = useRef<Scope | null>(null)
  const setupRef = useRef(setup)

  useEffect(() => {
    setupRef.current = setup
  })

  useEffect(() => {
    const el = root.current
    if (!el) return
    const scope = createScope({ root: el, mediaQueries }).add((self) => {
      const s = self as Scope
      return setupRef.current({ scope: s, root: el, matches: s.matches, reduced: isReducedMotion() })
    })
    scopeRef.current = scope
    return () => {
      scope.revert()
      scopeRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { root, scope: scopeRef }
}
