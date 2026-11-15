'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, createDraggable, spring, onScroll, stagger, svg, utils } from 'animejs'
import { stats } from '@/content/profile'
import { marqueeWords, services, testimonials } from '@/content/services'
import { useAnimeScope } from '@/hooks/useAnimeScope'
import { isReducedMotion } from '@/lib/motion'
import { attachSpotlight } from '@/lib/interactions'
import { Counters } from '../ui/Counters'
import { Marquee } from '../ui/Marquee'
import { SectionHeading } from '../ui/SectionHeading'
import { ArrowLeft, ArrowRight, ServiceIcon } from '../ui/Icons'

/** Stats counters → technology marquee → services cards → recommendations carousel. */
export function Proof() {
  return (
    <section className="relative overflow-clip bg-bg-2 py-28 md:py-36" aria-labelledby="proof-title">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHeading
          id="proof-title"
          index="05"
          eyebrow="By the numbers"
          title="Proof, not adjectives."
          intro="Two years of Dynamics 365, Power Platform and Azure work, counted straight from my résumé."
        />
        <Counters stats={stats} className="mt-14" />
      </div>

      <div className="mt-24 border-y border-line py-7">
        <Marquee speed={45}>
          {marqueeWords.map((w) => (
            <span key={w} className="flex items-center gap-10 pr-10">
              <span className="font-wide text-[clamp(1.6rem,3.2vw,3rem)] whitespace-nowrap text-outline transition-colors hover:text-gold">{w}</span>
              <span className="text-2xl text-gold" aria-hidden="true">
                ✦
              </span>
            </span>
          ))}
        </Marquee>
        <Marquee speed={55} reverse className="mt-4">
          {[...marqueeWords].reverse().map((w) => (
            <span key={w} className="flex items-center gap-10 pr-10">
              <span className="font-serif text-[clamp(1.4rem,2.6vw,2.4rem)] whitespace-nowrap text-ink-3 italic">{w}</span>
              <span className="text-lg text-ember" aria-hidden="true">
                ●
              </span>
            </span>
          ))}
        </Marquee>
      </div>

      <Services />
      <Testimonials />
    </section>
  )
}

function Services() {
  const { root } = useAnimeScope<HTMLDivElement>(({ root, reduced, matches }) => {
    if (reduced) return
    const cards = root.querySelectorAll<HTMLElement>('.svc-card')
    utils.set(root, { opacity: 1 })
    animate(cards, {
      opacity: [0, 1],
      y: [60, 0],
      rotate: (_?: unknown, i = 0) => [i % 2 ? 2 : -2, 0],
      duration: 1100,
      ease: 'out(4)',
      delay: stagger(90),
      autoplay: onScroll({ target: root, enter: '85% top', repeat: false }),
    })
    if (!matches.fine) return
    const offTilt = attachSpotlight(cards, { tilt: 9 })
    const offs = Array.from(cards).map((card) => {
      const paths = svg.createDrawable(card.querySelectorAll('.svc-icon path, .svc-icon rect, .svc-icon circle'), 0, 1)
      const enter = () => animate(paths, { draw: ['0 0', '0 1'], duration: 900, delay: stagger(60), ease: 'inOut(3)' })
      card.addEventListener('pointerenter', enter)
      return () => card.removeEventListener('pointerenter', enter)
    })
    return () => {
      offTilt()
      offs.forEach((o) => o())
    }
  })

  return (
    <div className="mx-auto mt-24 max-w-[1440px] px-5 md:px-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h3 className="font-wide text-3xl text-ink md:text-4xl">What I can do for you</h3>
        <p className="max-w-md text-ink-2">Five ways I usually help. Most engagements combine two or three.</p>
      </div>
      <div ref={root} data-reveal="" className="mt-10 grid gap-4 [perspective:1400px] sm:grid-cols-2 lg:grid-cols-5">
        {services.map((s, i) => (
          <article
            key={s.title}
            className="svc-card spotlight group card relative flex flex-col overflow-hidden p-6 transition-[border-color,translate] duration-500 hover:-translate-y-1.5 hover:border-gold/60"
          >
            <span className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gold/10 blur-2xl transition-transform duration-700 group-hover:scale-150" aria-hidden="true" />
            <div className="flex items-center justify-between">
              <span className="svc-icon grid h-12 w-12 place-items-center rounded-2xl border border-line-strong text-gold">
                <ServiceIcon name={s.icon} size={24} />
              </span>
              <span className="font-mono text-xs text-ink-3">0{i + 1}</span>
            </div>
            <h4 className="font-wide mt-8 text-xl text-ink">{s.title}</h4>
            <p className="mt-3 text-sm leading-relaxed text-ink-2">{s.body}</p>
            <ul className="mt-auto space-y-1.5 pt-6">
              {s.points.map((p) => (
                <li key={p} className="flex items-center gap-2 text-xs text-ink-3">
                  <span className="h-px w-3 bg-gold" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  )
}

function Testimonials() {
  const viewRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  const dragRef = useRef<ReturnType<typeof createDraggable> | null>(null)
  const stepRef = useRef(0)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const view = viewRef.current!
    const track = trackRef.current!
    const measure = () => {
      const card = track.querySelector<HTMLElement>('li')!
      stepRef.current = card.offsetWidth + (parseFloat(getComputedStyle(track).columnGap) || 0)
    }
    measure()
    if (isReducedMotion()) return
    const d = createDraggable(track, {
      container: () => [0, 0, 0, Math.min(0, view.clientWidth - track.scrollWidth)],
      y: false,
      snap: () => stepRef.current,
      releaseEase: spring({ stiffness: 80, damping: 13 }),
      cursor: false,
      onResize: measure,
      onSettle: (self) => setIndex(Math.round(-self.x / stepRef.current)),
    })
    dragRef.current = d
    return () => {
      d.revert()
      dragRef.current = null
    }
  }, [])

  const go = (dir: number) => {
    const track = trackRef.current!
    const view = viewRef.current!
    const max = Math.max(0, Math.ceil((track.scrollWidth - view.clientWidth) / stepRef.current))
    const next = Math.max(0, Math.min(max, index + dir))
    setIndex(next)
    const x = -Math.min(next * stepRef.current, track.scrollWidth - view.clientWidth)
    if (dragRef.current) dragRef.current.animate.translateX(x, 800, 'out(4)')
    else track.style.transform = `translateX(${x}px)`
  }

  return (
    <div className="mx-auto mt-24 max-w-[1440px] px-5 md:px-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h3 className="font-wide text-3xl text-ink md:text-4xl">Highlights</h3>
        <div className="flex gap-2">
          <button type="button" onClick={() => go(-1)} className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink-2 transition-colors hover:border-gold hover:text-gold" aria-label="Previous highlight">
            <ArrowLeft size={18} />
          </button>
          <button type="button" onClick={() => go(1)} className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink-2 transition-colors hover:border-gold hover:text-gold" aria-label="Next highlight">
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
      <div ref={viewRef} className="mt-10 overflow-clip">
        <ul ref={trackRef} className="flex w-max gap-4">
          {testimonials.map((t, i) => (
            <li key={i} className="card flex w-[82vw] max-w-[480px] flex-col p-7 md:p-9">
              <span className="font-serif -mb-6 block text-7xl leading-none text-gold" aria-hidden="true">
                “
              </span>
              <blockquote className="font-serif mt-6 flex-1 text-xl leading-snug text-ink italic md:text-2xl">{t.quote}</blockquote>
              <footer className="mt-8 flex items-center gap-4 border-t border-line pt-5">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-gold/15 font-wide text-sm text-gold" aria-hidden="true">
                  {t.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </span>
                <span>
                  <span className="block text-sm text-ink">{t.name}</span>
                  <span className="block text-xs text-ink-3">{t.title}</span>
                </span>
              </footer>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-4 font-mono text-[11px] tracking-wider text-ink-3 uppercase">
        {String(index + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')} · drag or use the arrows
      </p>
    </div>
  )
}
