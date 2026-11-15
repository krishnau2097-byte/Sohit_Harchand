'use client'

import { animate, onScroll, stagger, svg, utils } from 'animejs'
import { experience } from '@/content/experience'
import { useAnimeScope } from '@/hooks/useAnimeScope'
import { SectionHeading } from '../ui/SectionHeading'
import { Check } from '../ui/Icons'

/**
 * Experience timeline. The vertical SVG line draws itself as you scroll
 * (createDrawable + onScroll sync), a glowing head rides the drawn tip, and
 * each role card slides in from its side as it enters.
 */
export function Timeline() {
  const { root } = useAnimeScope<HTMLElement>(({ root, matches, reduced }) => {
    if (reduced) return
    const track = root.querySelector<HTMLElement>('.tl-track')!
    const [path] = svg.createDrawable(root.querySelector('.tl-path')!)
    utils.set(path, { draw: '0 0' })

    const head = root.querySelector<HTMLElement>('.tl-head')!
    utils.set(head, { opacity: 1 })
    const observer = onScroll({
      target: track,
      enter: '60% top',
      leave: '60% bottom',
      sync: true,
      onUpdate: (o) => {
        head.style.transform = `translate3d(0, ${o.progress * track.offsetHeight}px, 0)`
      },
    })
    animate(path, { draw: ['0 0', '0 1'], ease: 'linear', autoplay: observer })

    root.querySelectorAll<HTMLElement>('.tl-item').forEach((item, i) => {
      const card = item.querySelector<HTMLElement>('.tl-card')!
      const dot = item.querySelector<HTMLElement>('.tl-dot')!
      const fromX = matches.mobile ? 40 : i % 2 === 0 ? -80 : 80
      utils.set(card, { opacity: 0 })
      const o = () => onScroll({ target: item, enter: '80% top', repeat: false })
      animate(card, { opacity: [0, 1], x: [fromX, 0], rotateY: [i % 2 === 0 ? 8 : -8, 0], duration: 1200, ease: 'out(4)', autoplay: o() })
      animate(dot, { scale: [0, 1], backgroundColor: ['#00000000', getComputedStyle(document.documentElement).getPropertyValue('--gold').trim()], duration: 700, ease: 'out(3)', autoplay: o() })
      animate(card.querySelectorAll('.tl-stagger'), { opacity: [0, 1], y: [16, 0], duration: 800, delay: stagger(60, { start: 300 }), ease: 'out(3)', autoplay: o() })
    })
  })

  return (
    <section id="experience" ref={root} className="relative bg-bg-2 py-28 md:py-40" aria-labelledby="experience-title">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHeading
          id="experience-title"
          index="03"
          eyebrow="Experience"
          title="Two years, high-impact shipping."
          intro="Dynamics 365 & Power Platform developer at AOSC since 2024: D365 CE for multiple clients, Copilot Studio agents, Azure integrations and CI/CD from Dev to Production."
          align="center"
        />

        <ol className="tl-track relative mt-20 md:mt-28">
          <svg className="absolute top-0 left-[11px] h-full w-[2px] md:left-1/2 md:-translate-x-1/2" viewBox="0 0 2 1000" preserveAspectRatio="none" aria-hidden="true">
            <path d="M1 0V1000" className="stroke-line" strokeWidth="2" />
            <path d="M1 0V1000" className="tl-path stroke-gold" strokeWidth="2" />
          </svg>
          <span
            className="tl-head pointer-events-none absolute top-0 left-[12px] -mt-2 -ml-2 h-4 w-4 rounded-full bg-gold opacity-0 shadow-[0_0_24px_6px_var(--glow)] md:left-1/2 motion-off:hidden"
            aria-hidden="true"
          />

          {experience.map((e, i) => {
            const right = i % 2 === 1
            return (
              <li key={e.role + e.start} className="tl-item relative grid pb-16 pl-12 [perspective:1400px] last:pb-0 md:grid-cols-2 md:gap-20 md:pl-0">
                <span
                  className="tl-dot absolute top-8 left-[12px] z-10 -ml-[9px] h-[18px] w-[18px] rounded-full border-2 border-gold bg-bg md:left-1/2"
                  aria-hidden="true"
                />
                <div className={`hidden pt-7 md:block ${right ? 'text-right' : 'order-2'}`}>
                  <p className="font-wide text-6xl text-transparent [-webkit-text-stroke:1.5px_var(--gold)] opacity-70">{e.start}</p>
                  <p className="mt-2 font-mono text-xs tracking-wider text-ink-3 uppercase">
                    {e.start} — {e.end}
                  </p>
                </div>
                <article className={`tl-card card relative p-6 md:p-8 ${right ? '' : 'md:order-1'}`}>
                  <div className="tl-stagger flex flex-wrap items-center gap-2">
                    <span className="chip border-gold/40 text-gold">{e.type}</span>
                    <span className="font-mono text-xs text-ink-3 md:hidden">
                      {e.start} — {e.end}
                    </span>
                    <span className="font-mono text-xs text-ink-3">· {e.location}</span>
                  </div>
                  <h3 className="tl-stagger font-wide mt-4 text-2xl text-ink md:text-[1.7rem]">{e.role}</h3>
                  <p className="tl-stagger font-serif mt-1 text-lg text-gold italic">{e.company}</p>
                  <p className="tl-stagger mt-4 leading-relaxed text-ink-2">{e.summary}</p>
                  <ul className="mt-5 space-y-2.5">
                    {e.achievements.map((a) => (
                      <li key={a} className="tl-stagger flex gap-3 text-[15px] text-ink-2">
                        <Check size={16} className="mt-1 shrink-0 text-gold" />
                        {a}
                      </li>
                    ))}
                  </ul>
                  <dl className="tl-stagger mt-6 grid grid-cols-3 gap-3 border-y border-line py-4">
                    {e.impact.map((m) => (
                      <div key={m.label} className="flex flex-col-reverse">
                        <dt className="mt-1 text-[11px] leading-tight text-ink-3">{m.label}</dt>
                        <dd className="font-wide text-xl text-gold md:text-2xl">{m.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <ul className="tl-stagger mt-5 flex flex-wrap gap-1.5">
                    {e.tech.map((t) => (
                      <li key={t} className="chip py-1 text-[11px]">
                        {t}
                      </li>
                    ))}
                  </ul>
                </article>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
