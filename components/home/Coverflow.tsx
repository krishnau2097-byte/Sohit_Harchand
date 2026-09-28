'use client'

import { useEffect, useRef } from 'react'
import { createDraggable, spring, utils } from 'animejs'
import type { Project } from '@/content/projects'
import { ProjectMock } from '../projects/ProjectMock'
import { ArrowLeft, ArrowRight } from '../ui/Icons'

type Props = {
  projects: Project[]
  onActive: (i: number) => void
  onOpen: (i: number, rect: DOMRect) => void
}

/**
 * Phone / no-WebGL fallback for the 3D ribbon: a CSS 3D coverflow. The track
 * is an Anime.js draggable that snaps to each card with a spring; every frame
 * each card's rotateY, depth and scale follow its distance from centre.
 */
export function Coverflow({ projects, onActive, onOpen }: Props) {
  const viewRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<ReturnType<typeof createDraggable> | null>(null)
  const stepRef = useRef(0)
  const cbs = useRef({ onActive, onOpen })
  useEffect(() => {
    cbs.current = { onActive, onOpen }
  })

  useEffect(() => {
    const view = viewRef.current!
    const track = trackRef.current!
    const cards = Array.from(track.querySelectorAll<HTMLElement>('.cf-card'))
    let moved = false

    const measure = () => {
      const card = cards[0]
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0
      stepRef.current = card.offsetWidth + gap
      const pad = (view.clientWidth - card.offsetWidth) / 2
      track.style.paddingInline = `${pad}px`
    }
    measure()

    const draggable = createDraggable(track, {
      // The track is wider than its viewport, so pass explicit x bounds:
      // [top, right, bottom, left] → x may travel from (view − track) to 0.
      container: () => [0, 0, 0, Math.min(0, view.clientWidth - track.scrollWidth)],
      y: false,
      snap: () => stepRef.current,
      releaseEase: spring({ stiffness: 90, damping: 14 }),
      cursor: false,
      onGrab: () => (moved = false),
      onDrag: () => (moved = true),
      onResize: measure,
    })
    dragRef.current = draggable

    let raf = 0
    let active = -1
    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(view)
    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!visible) return
      const x = Number(utils.get(track, 'x', false)) || 0
      const step = stepRef.current || 1
      const center = -x / step
      cards.forEach((c, i) => {
        const d = i - center
        const ad = Math.min(Math.abs(d), 2)
        c.style.transform = `translateZ(${-ad * 120}px) rotateY(${Math.max(-1, Math.min(1, d)) * -38}deg) scale(${1 - ad * 0.08})`
        c.style.opacity = String(1 - ad * 0.3)
        c.style.zIndex = String(100 - Math.round(ad * 10))
      })
      const idx = Math.max(0, Math.min(cards.length - 1, Math.round(center)))
      if (idx !== active) {
        active = idx
        cbs.current.onActive(idx)
      }
    }
    raf = requestAnimationFrame(tick)

    const onClick = (e: MouseEvent) => {
      if (moved) return
      const card = (e.target as HTMLElement).closest<HTMLElement>('.cf-card')
      if (!card) return
      cbs.current.onOpen(Number(card.dataset.index), card.getBoundingClientRect())
    }
    track.addEventListener('click', onClick)

    // Keyboard: bring a focused card to the centre.
    const onFocus = (e: FocusEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>('.cf-card')
      if (!card) return
      draggable.animate.translateX(-Number(card.dataset.index) * stepRef.current, 600, 'out(4)')
    }
    track.addEventListener('focusin', onFocus)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      track.removeEventListener('click', onClick)
      track.removeEventListener('focusin', onFocus)
      draggable.revert()
      dragRef.current = null
    }
  }, [])

  const go = (dir: number) => {
    const d = dragRef.current
    if (!d) return
    const step = stepRef.current
    const cur = Math.round(-d.x / step)
    const next = Math.max(0, Math.min(projects.length - 1, cur + dir))
    d.animate.translateX(-next * step, 700, 'out(4)')
  }

  return (
    <div className="relative">
      <div ref={viewRef} className="relative overflow-clip py-6 [perspective:1100px]">
        <div ref={trackRef} className="flex w-max gap-4 [transform-style:preserve-3d]">
          {projects.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              data-index={i}
              className="cf-card w-[76vw] max-w-[420px] shrink-0 overflow-hidden rounded-2xl border border-line-strong bg-surface text-left shadow-[var(--shadow)] [transform-style:preserve-3d]"
              aria-label={`Open ${p.title}`}
            >
              <ProjectMock project={p} />
              <span className="block p-4">
                <span className="block font-mono text-[10px] tracking-wider text-ink-3 uppercase">{p.categories[0]}</span>
                <span className="font-wide mt-1 block text-lg text-ink">{p.title}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-center gap-3">
        <button type="button" onClick={() => go(-1)} className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink-2" aria-label="Previous project">
          <ArrowLeft size={18} />
        </button>
        <button type="button" onClick={() => go(1)} className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink-2" aria-label="Next project">
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}
