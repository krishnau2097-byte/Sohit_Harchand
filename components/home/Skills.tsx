'use client'

import { useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
import { animate } from 'animejs'
import { skills } from '@/content/skills'
import { isReducedMotion } from '@/lib/motion'
import { SectionHeading } from '../ui/SectionHeading'
import { FadeIn } from '../ui/FadeIn'
import { SkillCards } from './skills/SkillCards'
import { SkillPlayground } from './skills/SkillPlayground'

type View = 'cards' | 'orbit'

const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

const coreFocusAreas = [
  {
    title: 'Enterprise Migration',
    stack: 'Switchblade 1.0 & 2.0',
    desc: 'Automating Tableau-to-Power BI conversions at scale with visual mapping, batch pipelines, and audit logs.',
    highlight: '500+ Reports Migrated',
  },
  {
    title: 'AI & Copilot Systems',
    stack: 'Copilot Studio · LLMs · RAG',
    desc: 'Adaptive learning platforms, autonomous Copilot agents, and OpenAI integration for enterprise operations.',
    highlight: 'MCA AI/ML Specialization',
  },
  {
    title: 'Power Platform Core',
    stack: 'Canvas · Model-Driven · Automate',
    desc: 'Multi-stage approval workflows, custom Dataverse data models, and enterprise digitization.',
    highlight: '50+ Flows in Production',
  },
  {
    title: 'Modern Web Engineering',
    stack: 'React.js · Next.js · TypeScript',
    desc: 'High-performance interactive frontends, clean state architecture, REST APIs, and bespoke UI design.',
    highlight: 'Production Frontends',
  },
  {
    title: 'SharePoint Architecture',
    stack: 'Modern Online · Document Hubs',
    desc: 'Hub-and-spoke modern intranets, structured libraries with metadata, and department governance.',
    highlight: 'Enterprise Intranets',
  },
  {
    title: 'Data & Analytics',
    stack: 'Power BI · DAX · SQL Modelling',
    desc: 'Interactive executive KPI dashboards, star schemas, row-level security, and scheduled dataflows.',
    highlight: 'Real-time Analytics',
  },
]

/**
 * A sortable skills index paired with an optional physics-led orbit view.
 */
export function Skills() {
  const [view, setView] = useState<View>('cards')
  const reduced = useSyncExternalStore(subscribeReduced, () => window.matchMedia('(prefers-reduced-motion: reduce)').matches, () => false)
  const toggleRef = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLSpanElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  /* Sliding pill on the view switch; the new view fades up. */
  useLayoutEffect(() => {
    const place = (duration: number) => {
      const btn = toggleRef.current?.querySelector<HTMLElement>(`[data-view="${view}"]`)
      if (btn && pillRef.current) animate(pillRef.current, { x: btn.offsetLeft, width: btn.offsetWidth, opacity: 1, duration, ease: 'out(4)' })
    }
    place(isReducedMotion() ? 0 : 650)
    document.fonts?.ready.then(() => place(0))
    if (panelRef.current && !isReducedMotion() && view === 'orbit') {
      animate(panelRef.current, { opacity: [0, 1], y: [24, 0], duration: 700, ease: 'out(4)' })
    }
  }, [view, reduced])

  return (
    <section id="skills" className="relative overflow-clip bg-bg py-28 md:py-40" aria-labelledby="skills-title">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent)] opacity-70" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            id="skills-title"
            index="02"
            eyebrow="Skills & expertise"
            title="A toolkit built for delivery."
            intro={`${skills.length} capabilities across business apps, data and modern web. Select a card for practical detail.`}
          />
          {!reduced ? (
            <div ref={toggleRef} className="relative flex rounded-full border border-line-strong bg-surface p-1.5 shadow-[var(--shadow)]" role="group" aria-label="Skills view">
              <span ref={pillRef} className="pointer-events-none absolute inset-y-1.5 left-0 w-0 rounded-full bg-gold opacity-0" aria-hidden="true" />
              {(
                [
                  { id: 'cards', label: 'Cards' },
                  { id: 'orbit', label: 'Orbit view' },
                ] as const
              ).map((v) => (
                <button
                  key={v.id}
                  type="button"
                  data-view={v.id}
                  aria-pressed={view === v.id}
                  onClick={() => setView(v.id)}
                  className="relative z-10 flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-ink-2 transition-colors duration-500 aria-pressed:text-on-gold"
                >
                  {v.id === 'orbit' ? (
                    <span className="inline-flex size-3 items-center justify-center rounded-full border border-current" aria-hidden="true">
                      <span className="size-1 rounded-full bg-current" />
                    </span>
                  ) : (
                    <span className="grid grid-cols-2 gap-[2px]" aria-hidden="true">
                      {[0, 1, 2, 3].map((n) => (
                        <span key={n} className="h-[5px] w-[5px] rounded-[1px] bg-current" />
                      ))}
                    </span>
                  )}
                  {v.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div ref={panelRef} className="mt-12">
          {view === 'orbit' && !reduced ? <SkillPlayground /> : <SkillCards />}
        </div>

        {/* Specialized Focus Areas replacing empty certifications */}
        <div className="mt-20">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Core capabilities</p>
              <h3 className="mt-1 font-wide text-2xl text-ink md:text-3xl">Where I create leverage</h3>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-ink-3">Six connected disciplines, grounded in practical delivery.</p>
          </div>
          <FadeIn as="ul" items=".focus-item" step={70} className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coreFocusAreas.map((f, index) => (
              <li
                key={f.title}
                className="focus-item card spotlight group relative flex flex-col justify-between p-6 transition-all duration-300 hover:border-gold/50 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] tracking-[0.2em] text-ink-3" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                    <span className="rounded-full border border-gold/25 bg-gold/10 px-2.5 py-0.5 font-mono text-[11px] tracking-wide text-gold uppercase">
                      {f.highlight}
                    </span>
                  </div>
                  <h4 className="font-wide text-lg text-ink mt-4 group-hover:text-gold transition-colors duration-300">
                    {f.title}
                  </h4>
                  <p className="mt-1 font-mono text-xs text-ink-3">
                    {f.stack}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-2">
                    {f.desc}
                  </p>
                </div>
              </li>
            ))}
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
