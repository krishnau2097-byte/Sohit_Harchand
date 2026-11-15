'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { animate, scrambleText } from 'animejs'
import { projects } from '@/content/projects'
import { isReducedMotion } from '@/lib/motion'
import { ProjectModal } from '../projects/ProjectModal'
import { ProjectCard } from '../projects/ProjectCard'
import { SectionHeading } from '../ui/SectionHeading'
import { ArrowUpRight } from '../ui/Icons'
import { Coverflow } from './Coverflow'
import type { RibbonApi } from './Ribbon3D'

const Ribbon3D = dynamic(() => import('./Ribbon3D'), { ssr: false })

type Mode = '3d' | 'coverflow' | 'grid'

let webglCache: boolean | null = null
function hasWebGL() {
  if (webglCache !== null) return webglCache
  try {
    const c = document.createElement('canvas')
    webglCache = !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    webglCache = false
  }
  return webglCache
}

function subscribe(cb: () => void) {
  const mqs = ['(max-width: 767px)', '(prefers-reduced-motion: reduce)'].map((q) => window.matchMedia(q))
  mqs.forEach((m) => m.addEventListener('change', cb))
  return () => mqs.forEach((m) => m.removeEventListener('change', cb))
}
function getMode(): Mode {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'grid'
  if (window.matchMedia('(max-width: 767px)').matches || !hasWebGL()) return 'coverflow'
  return '3d'
}

/**
 * Selected work: the 3D ribbon on desktop (lazy-loaded when the section
 * nears the viewport), a CSS coverflow on phones / without WebGL, and a plain
 * grid with reduced motion. A keyboard-reachable list mirrors the ribbon.
 */
export function Work() {
  const mode = useSyncExternalStore<Mode | null>(subscribe, getMode, () => null)
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<RibbonApi | null>(null)
  const titleRef = useRef<HTMLSpanElement>(null)
  const [near, setNear] = useState(false)
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState<{ index: number; origin: DOMRect | null } | null>(null)

  /* Load Three.js only when the ribbon is ~one screen away. */
  useEffect(() => {
    if (mode !== '3d' || near) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '900px 0px' })
    io.observe(stageRef.current!)
    return () => io.disconnect()
  }, [mode, near])

  /* Active project title decodes on change. */
  const lastActive = useRef(active)
  useEffect(() => {
    if (lastActive.current === active || !titleRef.current) return
    lastActive.current = active
    if (isReducedMotion()) {
      titleRef.current.textContent = projects[active].title
      return
    }
    animate(titleRef.current, { innerHTML: scrambleText({ text: projects[active].title, chars: 'a-z', settleDuration: 220, revealRate: 70 }) })
  }, [active])

  const onActive = useCallback((i: number) => setActive(i), [])
  const openAt = useCallback((i: number, origin: DOMRect | null) => setOpen({ index: i, origin }), [])
  const onOpen3D = useCallback((i: number) => openAt(i, stageRef.current?.getBoundingClientRect() ?? null), [openAt])

  const current = projects[active]

  return (
    <section id="work" ref={sectionRef} className="relative overflow-clip bg-bg py-28 md:py-36" aria-labelledby="work-title">
      <div className="pointer-events-none absolute inset-x-0 top-1/3 h-[60%] bg-[radial-gradient(50%_50%_at_50%_50%,var(--glow),transparent)] opacity-60" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            id="work-title"
            index="04"
            eyebrow="Selected work"
            title="Built for the people who use it."
            intro="Dynamics 365 CE platforms, Copilot Studio and Azure OpenAI agents, Power Platform apps and Fabric migration tooling. Drag the ribbon, scroll past it, or pick from the list."
          />
          <div className="min-w-[260px] text-right" aria-hidden="true">
            <p className="font-wide text-5xl text-gold tabular-nums md:text-6xl">
              {String(active + 1).padStart(2, '0')}
              <span className="text-2xl text-ink-3"> / {String(projects.length).padStart(2, '0')}</span>
            </p>
            <p className="mt-2 text-sm text-ink-2">
              {/* Text is owned by the scramble animation after first render. */}
              <span ref={titleRef}>{projects[0].title}</span>
            </p>
            <p className="font-mono text-[11px] tracking-wider text-ink-3 uppercase">{current.categories.join(' · ')}</p>
          </div>
        </div>
      </div>

      <div ref={stageRef} className="relative mt-10">
        {mode === '3d' ? (
          <div className="relative h-[78vh] max-h-[820px] min-h-[520px]">
            {near ? <Ribbon3D projects={projects} onActive={onActive} onOpen={onOpen3D} apiRef={apiRef} scrollTarget={sectionRef} /> : null}
            <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[11px] tracking-[0.25em] text-ink-3 uppercase">
              Drag to spin · Click a screen to open
            </p>
          </div>
        ) : mode === 'coverflow' ? (
          <div className="px-0">
            <Coverflow projects={projects} onActive={onActive} onOpen={openAt} />
          </div>
        ) : mode === 'grid' ? (
          <div className="mx-auto grid max-w-[1440px] gap-5 px-5 md:grid-cols-2 md:px-10 xl:grid-cols-3">
            {projects.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i} />
            ))}
          </div>
        ) : (
          <div className="h-[60vh]" />
        )}
      </div>

      <div className="relative mx-auto mt-10 max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <ol className="flex flex-wrap gap-2" aria-label="Project index">
            {projects.map((p, i) => (
              <li key={p.slug}>
                <button
                  type="button"
                  onMouseEnter={() => apiRef.current?.focus(i)}
                  onFocus={() => apiRef.current?.focus(i)}
                  onClick={(e) => openAt(i, e.currentTarget.getBoundingClientRect())}
                  data-active={i === active ? '' : undefined}
                  className="chip transition-colors hover:border-gold hover:text-ink data-[active]:border-gold data-[active]:text-gold"
                >
                  <span className="font-mono text-[10px] text-ink-3">{String(i + 1).padStart(2, '0')}</span>
                  {p.title}
                </button>
              </li>
            ))}
          </ol>
          <Link href="/projects" className="btn btn-ghost">
            All projects <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      {open ? (
        <ProjectModal
          key="modal"
          project={projects[open.index]}
          origin={open.origin}
          onClose={() => setOpen(null)}
          onPrev={() => setOpen((o) => (o ? { ...o, index: (o.index - 1 + projects.length) % projects.length } : o))}
          onNext={() => setOpen((o) => (o ? { ...o, index: (o.index + 1) % projects.length } : o))}
        />
      ) : null}
    </section>
  )
}
