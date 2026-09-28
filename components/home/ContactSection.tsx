'use client'

import { animate, onScroll, splitText, stagger, utils, type Target } from 'animejs'
import { profile } from '@/content/profile'
import { useAnimeScope } from '@/hooks/useAnimeScope'
import { ContactForm } from '../ContactForm'
import { Magnetic } from '../ui/Magnetic'
import { LocalTime } from '../ui/LocalTime'
import { ArrowUpRight, Mail, Pin } from '../ui/Icons'

/**
 * Contact block. The headline is split into characters that rise in on
 * scroll, then respond to the pointer: nearby letters stretch the variable
 * font's width axis and gain weight, like type breathing under the cursor.
 */
export function ContactSection({ headingLevel = 'h2', eyebrow = '06 — Contact' }: { headingLevel?: 'h1' | 'h2'; eyebrow?: string }) {
  const Heading = headingLevel
  const { root } = useAnimeScope<HTMLElement>(({ root, matches, reduced }) => {
    if (reduced) return
    const title = root.querySelector<HTMLElement>('.kinetic')!
    const split = splitText(title, { chars: { wrap: 'clip' } })
    const chars = split.chars as HTMLElement[]
    utils.set(title, { opacity: 1 })
    utils.set(chars, { y: '110%', '--wdth': 125, '--wght': 800 })
    animate(chars, {
      y: ['110%', '0%'],
      duration: 1100,
      ease: 'out(4)',
      delay: stagger(26),
      autoplay: onScroll({ target: title, enter: '90% top', repeat: false }),
    })

    if (!matches.fine || matches.mobile) return
    let raf = 0
    let px = 0
    let py = 0
    const update = () => {
      raf = 0
      animate(chars, {
        '--wdth': (el?: Target) => {
          const r = (el as HTMLElement).getBoundingClientRect()
          const d = Math.hypot(px - (r.left + r.width / 2), py - (r.top + r.height / 2))
          return 125 - Math.max(0, 1 - d / 260) * 60
        },
        '--wght': (el?: Target) => {
          const r = (el as HTMLElement).getBoundingClientRect()
          const d = Math.hypot(px - (r.left + r.width / 2), py - (r.top + r.height / 2))
          return 800 - Math.max(0, 1 - d / 260) * 500
        },
        duration: 500,
        ease: 'out(3)',
      })
    }
    const onMove = (e: PointerEvent) => {
      px = e.clientX
      py = e.clientY
      if (!raf) raf = requestAnimationFrame(update)
    }
    const onLeave = () => animate(chars, { '--wdth': 125, '--wght': 800, duration: 900, ease: 'out(4)' })
    title.addEventListener('pointermove', onMove)
    title.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      title.removeEventListener('pointermove', onMove)
      title.removeEventListener('pointerleave', onLeave)
    }
  })

  return (
    <section id="contact" ref={root} className="relative overflow-clip bg-bg py-28 md:py-40" aria-labelledby="contact-title">
      <div className="blinds pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <p className="eyebrow">{eyebrow}</p>
        <Heading
          id="contact-title"
          data-reveal=""
          className="kinetic reveal-text font-wide mt-6 max-w-[14ch] text-[clamp(3rem,9.5vw,9rem)] leading-[0.86] text-ink [&_span]:[font-variation-settings:'wdth'_var(--wdth,125),'wght'_var(--wght,800)]"
        >
          Let&apos;s build something.
        </Heading>

        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-4">
            <p className="max-w-sm text-lg leading-relaxed text-ink-2">
              Tell me about the process, the platform you already own and the deadline. I’ll come back with an honest view of what it takes.
            </p>
            <div className="card p-6">
              <p className="flex items-center gap-3 text-sm text-ink">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                {profile.availability.label}
              </p>
              <p className="mt-2 text-sm text-ink-3">{profile.availability.detail}</p>
            </div>
            <Magnetic strength={0.2}>
              <a href={`mailto:${profile.email}`} className="group inline-flex items-center gap-3 font-wide text-2xl text-gold md:text-3xl">
                <Mail size={26} />
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
                  {profile.email}
                </span>
              </a>
            </Magnetic>
            <ul className="space-y-3 text-sm text-ink-2">
              <li className="flex items-center gap-3">
                <Pin size={16} className="text-gold" /> {profile.location} · <LocalTime timeZone={profile.timeZone} />
              </li>
              {profile.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-gold">
                    <span className="w-20 font-mono text-[11px] tracking-wider text-ink-3 uppercase">{s.label}</span>
                    {s.handle} <ArrowUpRight size={13} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}
