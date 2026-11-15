'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { animate, createTimeline, stagger, utils } from 'animejs'
import type { Project } from '@/content/projects'
import { isReducedMotion } from '@/lib/motion'
import { getLenis } from '../providers/SmoothScroll'
import { ProjectMock } from './ProjectMock'
import { ArrowLeft, ArrowRight, ArrowUpRight, Close } from '../ui/Icons'

type Props = {
  project: Project
  /** Rect the panel grows out of (a card, list item or the ribbon stage). */
  origin: DOMRect | null
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
}

/**
 * Project detail modal with a FLIP entrance: the panel starts at the rect of
 * whatever was clicked and expands into place, then its content staggers in.
 */
export function ProjectModal({ project, origin, onClose, onPrev, onNext }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const closing = useRef(false)
  const opener = useRef<HTMLElement | null>(null)

  const close = () => {
    if (closing.current) return
    closing.current = true
    const panel = panelRef.current!
    const reduced = isReducedMotion()
    animate(overlayRef.current!, { opacity: 0, duration: reduced ? 0 : 450, ease: 'out(2)' })
    animate(panel, {
      opacity: 0,
      y: 40,
      scale: 0.96,
      duration: reduced ? 0 : 450,
      ease: 'in(3)',
      onComplete: onClose,
    })
  }
  const closeRef = useRef(close)
  useEffect(() => {
    closeRef.current = close
  })

  /* Open: FLIP from the origin rect. */
  useEffect(() => {
    opener.current = document.activeElement as HTMLElement | null
    const panel = panelRef.current!
    const reduced = isReducedMotion()
    getLenis()?.stop()
    document.documentElement.style.overflow = 'hidden'

    const final = panel.getBoundingClientRect()
    const o = origin ?? new DOMRect(final.left + final.width / 2 - 60, final.top + final.height / 2 - 40, 120, 80)
    const sx = o.width / final.width
    const sy = o.height / final.height
    const dx = o.left + o.width / 2 - (final.left + final.width / 2)
    const dy = o.top + o.height / 2 - (final.top + final.height / 2)
    const items = panel.querySelectorAll('.pm-item')
    utils.set(items, { opacity: 0, y: 24 })

    createTimeline({ defaults: { ease: 'inOut(4)' } })
      .add(overlayRef.current!, { opacity: [0, 1], duration: reduced ? 0 : 500 }, 0)
      .add(panel, { x: [dx, 0], y: [dy, 0], scaleX: [sx, 1], scaleY: [sy, 1], borderRadius: ['12px', '28px'], opacity: [0.4, 1], duration: reduced ? 0 : 800 }, 0)
      .add(items, { opacity: 1, y: 0, duration: reduced ? 0 : 700, delay: stagger(55), ease: 'out(4)' }, reduced ? 0 : 450)

    panel.querySelector<HTMLElement>('.pm-close')?.focus({ preventScroll: true })

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current()
      if (e.key === 'ArrowRight') onNext?.()
      if (e.key === 'ArrowLeft') onPrev?.()
      if (e.key === 'Tab') {
        const f = Array.from(panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      getLenis()?.start()
      document.documentElement.style.overflow = ''
      opener.current?.focus?.({ preventScroll: true })
    }
    // Only on mount; project switches animate separately below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* Switching project inside the modal: quick crossfade of the content. */
  const firstProject = useRef(project.slug)
  useEffect(() => {
    if (firstProject.current === project.slug) return
    const items = panelRef.current!.querySelectorAll('.pm-item')
    animate(items, { opacity: [0, 1], x: [20, 0], duration: isReducedMotion() ? 0 : 600, delay: stagger(40), ease: 'out(4)' })
  }, [project.slug])

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 md:p-8" role="dialog" aria-modal="true" aria-labelledby="pm-title">
      <div ref={overlayRef} className="absolute inset-0 bg-bg/80 backdrop-blur-md" onClick={() => closeRef.current()} aria-hidden="true" />
      <div ref={panelRef} className="relative max-h-full w-full max-w-5xl overflow-y-auto rounded-[28px] border border-line-strong bg-surface shadow-[var(--shadow)]" data-lenis-prevent>
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-line bg-surface/90 px-5 py-3 backdrop-blur md:px-7">
          <p className="font-mono text-xs tracking-wider text-ink-3 uppercase">
            {project.sector}
          </p>
          <div className="flex items-center gap-2">
            {onPrev ? (
              <button type="button" onClick={onPrev} className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink-2 hover:border-gold hover:text-gold" aria-label="Previous project">
                <ArrowLeft size={16} />
              </button>
            ) : null}
            {onNext ? (
              <button type="button" onClick={onNext} className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink-2 hover:border-gold hover:text-gold" aria-label="Next project">
                <ArrowRight size={16} />
              </button>
            ) : null}
            <button type="button" onClick={() => closeRef.current()} className="pm-close grid h-9 w-9 place-items-center rounded-full bg-gold text-on-gold" aria-label="Close project">
              <Close size={16} />
            </button>
          </div>
        </div>
        <div className="grid gap-8 p-5 md:grid-cols-12 md:p-7">
          <div className="pm-item overflow-hidden rounded-2xl border border-line md:col-span-7">
            <ProjectMock project={project} priority />
          </div>
          <div className="md:col-span-5">
            <p className="pm-item eyebrow">{project.categories.join(' · ')}</p>
            <h2 id="pm-title" className="pm-item font-wide mt-3 text-3xl text-ink md:text-4xl">
              {project.title}
            </h2>
            <p className="pm-item font-serif mt-2 text-lg text-gold italic">{project.client}</p>
            <p className="pm-item mt-4 leading-relaxed text-ink-2">{project.summary}</p>
            <dl className="pm-item mt-6 grid grid-cols-3 gap-3 border-y border-line py-4">
              {project.metrics.map((m) => (
                <div key={m.label} className="flex flex-col-reverse">
                  <dt className="mt-1 text-[11px] leading-tight text-ink-3">{m.label}</dt>
                  <dd className="font-wide text-xl text-gold">{m.value}</dd>
                </div>
              ))}
            </dl>
            <ul className="pm-item mt-5 flex flex-wrap gap-1.5">
              {project.tech.map((t) => (
                <li key={t} className="chip py-1 text-[11px]">
                  {t}
                </li>
              ))}
            </ul>
            <div className="pm-item mt-7 flex flex-wrap gap-3">
              <Link href={`/projects/${project.slug}`} className="btn btn-primary" onClick={() => onClose()}>
                Full case study <ArrowUpRight size={16} />
              </Link>
              {project.links?.demo ? (
                <a href={project.links.demo} target="_blank" rel="noreferrer" className="btn btn-ghost">
                  Live demo
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
