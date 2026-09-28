'use client'

import Link from 'next/link'
import { animate, onScroll, stagger, utils } from 'animejs'
import { featuredProject as p } from '@/content/projects'
import { useAnimeScope } from '@/hooks/useAnimeScope'
import { ProjectMock } from '../projects/ProjectMock'
import { RevealText } from '../ui/RevealText'
import { ArrowUpRight } from '../ui/Icons'

/**
 * One flagship project as a mini case study (Problem → Role → Stack →
 * Features → Outcome). The screenshot scales and drifts with scroll; the
 * rows reveal in sequence.
 */
export function CaseStudy() {
  const { root } = useAnimeScope<HTMLElement>(({ root, reduced }) => {
    if (reduced) return
    const shot = root.querySelector<HTMLElement>('.cs-shot')!
    animate(shot, {
      scale: [1.07, 1],
      y: ['3%', '-2%'],
      ease: 'linear',
      autoplay: onScroll({ target: root, enter: 'bottom top', leave: 'top bottom', sync: true }),
    })
    const rows = root.querySelectorAll('.cs-row')
    utils.set(rows, { opacity: 0 })
    animate(rows, {
      opacity: [0, 1],
      x: [40, 0],
      duration: 900,
      ease: 'out(4)',
      delay: stagger(110),
      autoplay: onScroll({ target: root.querySelector('.cs-rows')!, enter: '85% top', repeat: false }),
    })
  })

  const rows = [
    { k: 'Problem', v: p.caseStudy.problem },
    { k: 'Role', v: p.caseStudy.role },
    { k: 'Stack', v: p.tech.join(' · ') },
    { k: 'Features', v: p.caseStudy.features.join(' · ') },
    { k: 'Outcome', v: p.caseStudy.outcome },
  ]

  return (
    <section ref={root} className="relative overflow-clip bg-bg py-28 md:py-36" aria-labelledby="case-title">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Featured case study · {p.sector}</p>
            <RevealText as="h2" id="case-title" className="font-wide mt-4 text-[clamp(2.2rem,5.6vw,5rem)] text-ink">
              {p.title}
            </RevealText>
          </div>
          <Link href={`/projects/${p.slug}`} className="btn btn-ghost">
            Read the case study <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            {/* Screenshot in a soft device frame; stats sit underneath, not on top of it. */}
            <div className="rounded-[1.75rem] border border-line bg-surface p-2.5 shadow-[var(--shadow)] md:p-3">
              <div className="overflow-hidden rounded-[1.2rem] border border-line">
                <div className="cs-shot will-change-transform">
                  <ProjectMock project={p} />
                </div>
              </div>
            </div>
            <dl className="mt-6 grid grid-cols-3 gap-4">
              {p.metrics.map((m) => (
                <div key={m.label} className="flex flex-col-reverse border-l border-line-strong pl-4">
                  <dt className="mt-1 text-xs text-ink-3">{m.label}</dt>
                  <dd className="font-wide text-2xl text-gold md:text-3xl">{m.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <ol className="cs-rows divide-y divide-line border-y border-line lg:col-span-5">
            {rows.map((r, i) => (
              <li key={r.k} className="cs-row grid grid-cols-[3rem_1fr] gap-4 py-5">
                <span className="font-mono text-xs text-ink-3" aria-hidden="true">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="eyebrow">{r.k}</h3>
                  <p className="mt-2 leading-relaxed text-ink-2">{r.v}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
