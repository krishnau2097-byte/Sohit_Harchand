'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { animate, createLayout, createScope, onScroll, stagger, utils, type AutoLayout } from 'animejs'
import { projectCategories, projects, type ProjectCategory } from '@/content/projects'
import { isReducedMotion } from '@/lib/motion'
import { attachSpotlight } from '@/lib/interactions'
import { ProjectCard } from './ProjectCard'

type Filter = 'All' | ProjectCategory

/**
 * Filterable project grid. Every card stays in the DOM; filtering toggles
 * display and Anime.js createLayout animates the FLIP: remaining cards glide
 * to their new cells, leaving ones shrink out, entering ones scale in.
 */
export function ProjectsGrid() {
  const [filter, setFilter] = useState<Filter>('All')
  const gridRef = useRef<HTMLUListElement>(null)
  const chipsRef = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLSpanElement>(null)
  const layoutRef = useRef<AutoLayout | null>(null)
  const pending = useRef(false)

  useEffect(() => {
    const grid = gridRef.current!
    // One scope owns the layout, the entrance animation and its scroll
    // observer, so a remount (React strict mode, route change) reverts all of it.
    const scope = createScope({ root: grid }).add(() => {
      layoutRef.current = createLayout(grid, {
        children: '.pg-item',
        duration: 750,
        ease: 'out(4)',
        delay: stagger(35),
        enterFrom: { opacity: 0, scale: 0.85, y: 30 },
        leaveTo: { opacity: 0, scale: 0.85 },
      })
      if (isReducedMotion()) return
      // Entrance runs on the card inside each cell; createLayout owns the cell itself.
      const cards = grid.querySelectorAll('.project-card')
      utils.set(grid, { opacity: 1 })
      animate(cards, {
        opacity: [0, 1],
        y: [60, 0],
        duration: 1000,
        ease: 'out(4)',
        delay: stagger(80),
        autoplay: onScroll({ target: grid, enter: '95% top', repeat: false }),
      })
      return attachSpotlight(grid.querySelectorAll<HTMLElement>('.project-card'), { tilt: 6 })
    })
    return () => {
      scope.revert()
      layoutRef.current = null
    }
  }, [])

  /* Slide the gold pill behind the active chip. */
  useLayoutEffect(() => {
    const place = (duration: number) => {
      const chip = chipsRef.current?.querySelector<HTMLElement>(`[data-filter="${filter}"]`)
      if (!chip || !pillRef.current) return
      animate(pillRef.current, { x: chip.offsetLeft, y: chip.offsetTop, width: chip.offsetWidth, height: chip.offsetHeight, opacity: 1, duration, ease: 'out(4)' })
    }
    place(isReducedMotion() ? 0 : 600)
    document.fonts?.ready.then(() => place(0))
    const onResize = () => place(0)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [filter])

  /* After React applies the new visibility, play the recorded layout change. */
  useLayoutEffect(() => {
    if (!pending.current) return
    pending.current = false
    if (isReducedMotion()) return
    layoutRef.current?.animate()
  }, [filter])

  const choose = (f: Filter) => {
    if (f === filter) return
    layoutRef.current?.record()
    pending.current = true
    setFilter(f)
  }

  const count = (f: Filter) => (f === 'All' ? projects.length : projects.filter((p) => p.categories.includes(f)).length)
  const filters: Filter[] = ['All', ...projectCategories]

  return (
    <div>
      <div ref={chipsRef} className="relative flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
        <span ref={pillRef} className="pointer-events-none absolute top-0 left-0 rounded-full bg-gold opacity-0" aria-hidden="true" />
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            data-filter={f}
            onClick={() => choose(f)}
            aria-pressed={filter === f}
            className="relative inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-ink-2 transition-colors duration-500 hover:text-ink aria-pressed:border-transparent aria-pressed:text-on-gold"
          >
            {f}
            <span className="font-mono text-[10px] opacity-70">{count(f)}</span>
          </button>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {count(filter)} projects
      </p>

      <ul ref={gridRef} data-reveal="" className="mt-10 grid gap-5 [perspective:1600px] md:grid-cols-2 xl:grid-cols-3">
        {projects.map((p, i) => {
          const show = filter === 'All' || p.categories.includes(filter)
          return (
            <li key={p.slug} className="pg-item" style={{ display: show ? undefined : 'none' }}>
              <ProjectCard project={p} index={i} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
