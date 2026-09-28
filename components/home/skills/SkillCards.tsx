'use client'

import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { animate, createLayout, onScroll, spring, stagger, utils, type AutoLayout, type Target } from 'animejs'
import { levelRank, skillCategories, skills, type SkillCategory } from '@/content/skills'
import { useAnimeScope } from '@/hooks/useAnimeScope'
import { attachSpotlight } from '@/lib/interactions'
import { isReducedMotion } from '@/lib/motion'

type Sort = 'category' | 'experience' | 'az' | 'shuffle'

const sorts: { id: Sort; label: string }[] = [
  { id: 'category', label: 'By category' },
  { id: 'experience', label: 'By experience' },
  { id: 'az', label: 'A–Z' },
  { id: 'shuffle', label: 'Shuffle' },
]

const baseOrder = skills.map((_, i) => i)
const catOrder = Object.keys(skillCategories) as SkillCategory[]

function sorted(mode: Sort, current: number[]) {
  const list = [...baseOrder]
  if (mode === 'category') return list.sort((a, b) => catOrder.indexOf(skills[a].category) - catOrder.indexOf(skills[b].category))
  if (mode === 'experience')
    return list.sort((a, b) => skills[b].years - skills[a].years || levelRank[skills[b].level] - levelRank[skills[a].level])
  if (mode === 'az') return list.sort((a, b) => skills[a].name.localeCompare(skills[b].name))
  // Shuffle: Fisher–Yates, and never return the same order twice in a row.
  let next = list
  do {
    next = [...list]
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[next[i], next[j]] = [next[j], next[i]]
    }
  } while (next.join() === current.join())
  return next
}

/**
 * Skill flip cards. Click a card to flip it (spring) and send a ripple across
 * the grid from that cell; hover tilts it with a spotlight and a shine sweep;
 * the sort bar reshuffles the grid with an Anime.js createLayout FLIP.
 */
export function SkillCards() {
  const [order, setOrder] = useState(() => sorted('category', baseOrder))
  const [sort, setSort] = useState<Sort>('category')
  const [focus, setFocus] = useState<SkillCategory | null>(null)
  const [flipped, setFlipped] = useState<Set<string>>(new Set())
  const layoutRef = useRef<AutoLayout | null>(null)
  const pending = useRef(false)
  const sortBarRef = useRef<HTMLDivElement>(null)
  const sortPillRef = useRef<HTMLSpanElement>(null)

  const { root } = useAnimeScope<HTMLDivElement>(({ root, matches, reduced }) => {
    const grid = root.querySelector<HTMLElement>('.skill-grid')!
    layoutRef.current = createLayout(grid, { children: '.skill-tile', duration: 850, ease: 'out(4)', delay: stagger(18) })
    if (reduced) return

    const tilts = Array.from(grid.querySelectorAll<HTMLElement>('.skill-tilt'))
    const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length
    utils.set(grid, { opacity: 1 })
    // Cards are dealt in from the centre of the grid, spinning onto the table.
    animate(tilts, {
      opacity: [0, 1],
      scale: [0.5, 1],
      rotateY: [-100, 0],
      rotateZ: () => [utils.random(-12, 12), 0],
      y: [60, 0],
      duration: 1200,
      ease: 'out(4)',
      delay: stagger(40, { grid: [cols, Math.ceil(tilts.length / cols)], from: 'center' }),
      autoplay: onScroll({ target: grid, enter: '85% top', repeat: false }),
    })
    if (!matches.fine || matches.mobile) return
    return attachSpotlight(tilts, { tilt: 16, lift: 6 })
  })

  /* Play the FLIP after React has re-ordered the cards. */
  useLayoutEffect(() => {
    if (!pending.current) return
    pending.current = false
    if (!isReducedMotion()) layoutRef.current?.animate()
  }, [order])

  /* Sliding pill behind the active sort chip. */
  useLayoutEffect(() => {
    const place = (duration: number) => {
      const chip = sortBarRef.current?.querySelector<HTMLElement>(`[data-sort="${sort}"]`)
      if (!chip || !sortPillRef.current) return
      animate(sortPillRef.current, { x: chip.offsetLeft, width: chip.offsetWidth, opacity: 1, duration, ease: 'out(4)' })
    }
    place(isReducedMotion() ? 0 : 600)
    // Re-measure once the web font has loaded and on resize.
    document.fonts?.ready.then(() => place(0))
    const onResize = () => place(0)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [sort])

  const reorder = (mode: Sort) => {
    layoutRef.current?.record()
    pending.current = true
    setSort(mode)
    setOrder((cur) => sorted(mode, cur))
  }

  const highlight = (cat: SkillCategory | null) => {
    // Dim the faces, not the flipping button: opacity on the button would flatten its 3D.
    const faces = root.current?.querySelectorAll<HTMLElement>('.face')
    if (!faces) return
    animate(faces, {
      opacity: (el?: Target) => (!cat || (el as HTMLElement).dataset.cat === cat ? 1 : 0.2),
      filter: (el?: Target) => (!cat || (el as HTMLElement).dataset.cat === cat ? 'grayscale(0)' : 'grayscale(1)'),
      duration: isReducedMotion() ? 0 : 450,
      ease: 'out(3)',
    })
  }

  const flip = (name: string, button: HTMLElement) => {
    const on = !flipped.has(name)
    setFlipped((prev) => {
      const next = new Set(prev)
      if (on) next.add(name)
      else next.delete(name)
      return next
    })
    const reduced = isReducedMotion()
    animate(button, { perspective: '900px', rotateY: on ? 180 : 0, ...(reduced ? { duration: 0 } : { ease: spring({ stiffness: 110, damping: 13 }) }) })
    if (reduced) return
    if (on) animate(button.querySelectorAll('.meter-seg'), { scaleX: [0, 1], duration: 600, delay: stagger(90, { start: 250 }), ease: 'out(4)' })

    // Ripple across the grid from the clicked cell.
    const grid = root.current!.querySelector<HTMLElement>('.skill-grid')!
    const tiles = Array.from(grid.querySelectorAll<HTMLElement>('.skill-tile'))
    const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length
    const from = tiles.findIndex((t) => t.contains(button))
    animate(
      tiles.map((t) => t.querySelector('.skill-tilt')!),
      {
        scale: [1, 0.9, 1],
        duration: 700,
        ease: 'inOut(2)',
        delay: stagger(45, { grid: [cols, Math.ceil(tiles.length / cols)], from }),
      },
    )
  }

  return (
    <div ref={root}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Highlight a category">
          {catOrder.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => {
                const next = focus === k ? null : k
                setFocus(next)
                highlight(next)
              }}
              onMouseEnter={() => highlight(k)}
              onMouseLeave={() => highlight(focus)}
              aria-pressed={focus === k}
              className="chip transition-colors hover:text-ink aria-pressed:border-gold aria-pressed:text-gold"
            >
              <span className="h-2 w-2 rounded-full" style={{ background: skillCategories[k].tone }} aria-hidden="true" />
              {skillCategories[k].label}
            </button>
          ))}
        </div>
        <div ref={sortBarRef} className="relative flex max-w-full overflow-x-auto rounded-full border border-line p-1 [scrollbar-width:none]" role="group" aria-label="Sort skills">
          <span ref={sortPillRef} className="pointer-events-none absolute inset-y-1 left-0 w-0 rounded-full bg-ink opacity-0" aria-hidden="true" />
          {sorts.map((s) => (
            <button
              key={s.id}
              type="button"
              data-sort={s.id}
              onClick={() => reorder(s.id)}
              aria-pressed={sort === s.id}
              className="relative z-10 shrink-0 rounded-full px-3.5 py-1.5 text-xs whitespace-nowrap text-ink-2 transition-colors duration-500 hover:text-ink aria-pressed:text-bg"
            >
              {s.id === 'shuffle' ? '⤮ ' : ''}
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <ul data-reveal="" className="skill-grid mt-8 grid grid-cols-3 gap-2.5 [perspective:1200px] sm:grid-cols-4 md:gap-3 lg:grid-cols-6 xl:grid-cols-8">
        {order.map((idx, pos) => {
          const s = skills[idx]
          const tone = skillCategories[s.category].tone
          const isFlipped = flipped.has(s.name)
          return (
            <li key={s.name} className="skill-tile [transform-style:preserve-3d]">
              <div className="skill-tilt spotlight h-full rounded-2xl" style={{ '--tone': tone } as CSSProperties}>
                <button
                  type="button"
                  data-cat={s.category}
                  aria-pressed={isFlipped}
                  aria-label={`${s.name}: ${s.level}, ${s.years} ${s.years === 1 ? 'year' : 'years'}. ${isFlipped ? 'Hide' : 'Show'} details`}
                  onClick={(e) => flip(s.name, e.currentTarget)}
                  className="skill-flip relative block aspect-square w-full rounded-2xl text-left [transform-style:preserve-3d]"
                >
                  {/* Front */}
                  <span
                    data-cat={s.category}
                    className="face shine absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl border border-line p-3 [backface-visibility:hidden] md:p-4"
                    style={{ background: 'linear-gradient(150deg, color-mix(in oklab, var(--tone) 20%, var(--surface)) 0%, var(--surface) 62%)' }}
                  >
                    <span className="absolute inset-x-0 top-0 h-[3px] bg-[var(--tone)]" aria-hidden="true" />
                    <span className="flex items-start justify-between font-mono text-[10px] text-ink-3">
                      <span>{String(pos + 1).padStart(2, '0')}</span>
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--tone)]" />
                        {s.level}
                      </span>
                    </span>
                    <span className="relative self-start">
                      <span className="font-wide absolute top-[3px] left-[3px] text-[clamp(1.7rem,3.2vw,2.7rem)] text-transparent [-webkit-text-stroke:1px_var(--tone)] opacity-50" aria-hidden="true">
                        {s.symbol}
                      </span>
                      <span className="font-wide relative text-[clamp(1.7rem,3.2vw,2.7rem)] text-[var(--tone)]">{s.symbol}</span>
                    </span>
                    <span>
                      <span className="block truncate text-[11px] leading-tight text-ink md:text-xs">{s.name}</span>
                      <span className="mt-1.5 flex gap-1" aria-hidden="true">
                        {[1, 2, 3].map((n) => (
                          <span key={n} className={`h-1 flex-1 rounded-full ${n <= s.years ? 'bg-[var(--tone)]' : 'bg-line-strong'}`} />
                        ))}
                      </span>
                    </span>
                  </span>
                  {/* Back */}
                  <span
                    data-cat={s.category}
                    className="face absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl p-3 text-on-gold [backface-visibility:hidden] [transform:rotateY(180deg)] md:p-4"
                    style={{ background: 'linear-gradient(160deg, var(--tone), color-mix(in oklab, var(--tone) 70%, #000))' }}
                  >
                    <span className="flex items-center justify-between font-mono text-[10px] opacity-80">
                      <span>{s.symbol}</span>
                      <span>
                        {s.years} {s.years === 1 ? 'yr' : 'yrs'}
                      </span>
                    </span>
                    <span className="line-clamp-3 text-[10px] leading-snug opacity-95 md:text-[11px]">{s.note}</span>
                    <span>
                      <span className="block truncate text-[11px] font-semibold md:text-xs">{s.level}</span>
                      <span className="mt-1.5 flex gap-1" aria-hidden="true">
                        {[1, 2, 3].map((n) => (
                          <span
                            key={n}
                            className={`meter-seg h-1.5 flex-1 origin-left rounded-full ${n <= levelRank[s.level] ? 'bg-current' : 'bg-current opacity-25'}`}
                          />
                        ))}
                      </span>
                    </span>
                  </span>
                </button>
              </div>
            </li>
          )
        })}
      </ul>
      <p className="mt-4 font-mono text-[11px] tracking-wider text-ink-3 uppercase">Tip: click any card to flip it · bars show years (1–3)</p>
    </div>
  )
}
