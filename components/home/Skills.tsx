'use client'

import { useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
import { animate } from 'animejs'
import { skills } from '@/content/skills'
import { isReducedMotion } from '@/lib/motion'
import { SectionHeading } from '../ui/SectionHeading'
import { FadeIn } from '../ui/FadeIn'
import { SkillCards } from './skills/SkillCards'
import { SkillPlayground } from './skills/SkillPlayground'

type View = 'cards' | 'play'

const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

const coreFocusAreas = [
  {
    title: 'Fabric Migration Tooling',
    stack: 'SwitchBlade · TMDL · Semantic Kernel',
    desc: 'AI-driven tooling that converts Qlik and Tableau semantic models into Microsoft Fabric, with validation that flags discrepancies for review.',
    highlight: 'Qlik + Tableau → Fabric',
    icon: '⚡',
  },
  {
    title: 'AI Agents',
    stack: 'Copilot Studio · Azure OpenAI · RAG',
    desc: 'Agents for document analysis, employee onboarding and assessment evaluation, with agent instructions, topic triggers and test suites.',
    highlight: 'Multi-agent solutions',
    icon: '🤖',
  },
  {
    title: 'Dynamics 365 CE',
    stack: 'Sales · Customer Service · Field Service',
    desc: 'Business Process Flows, views, dashboards and role-based security, extended with C#/.NET plugins and TypeScript PCF controls.',
    highlight: '3 D365 apps',
    icon: '🚀',
  },
  {
    title: 'Power Platform',
    stack: 'Power Apps · Power Automate · Power Pages',
    desc: 'End-to-end solutions on Dataverse: canvas apps, approval flows with wait logic, secure portals and Power BI dashboards.',
    highlight: 'Dataverse first',
    icon: '💻',
  },
  {
    title: 'Azure Integration',
    stack: 'Functions · Logic Apps · Service Bus',
    desc: 'Webhook handling, async processing and third-party enterprise systems through the Dataverse Web API and REST APIs.',
    highlight: 'Async + webhooks',
    icon: '🏢',
  },
  {
    title: 'Delivery & Data',
    stack: 'Azure DevOps · SQL Server · KQL',
    desc: 'CI/CD pipelines from Dev to UAT to Production, SQL Server models and stored procedures, and Log Analytics monitoring.',
    highlight: 'Dev → UAT → Prod',
    icon: '📊',
  },
]

/**
 * Skills: flip cards (sortable, shuffleable) or a physics playground where
 * the same skills become bubbles you can throw around.
 */
export function Skills() {
  const [view, setView] = useState<View>('cards')
  const reduced = useSyncExternalStore(subscribeReduced, () => window.matchMedia('(prefers-reduced-motion: reduce)').matches, () => false)
  const toggleRef = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLSpanElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const ballRef = useRef<HTMLSpanElement>(null)

  /* Sliding pill on the view switch; the new view fades up. */
  useLayoutEffect(() => {
    const place = (duration: number) => {
      const btn = toggleRef.current?.querySelector<HTMLElement>(`[data-view="${view}"]`)
      if (btn && pillRef.current) animate(pillRef.current, { x: btn.offsetLeft, width: btn.offsetWidth, opacity: 1, duration, ease: 'out(4)' })
    }
    place(isReducedMotion() ? 0 : 650)
    document.fonts?.ready.then(() => place(0))
    if (panelRef.current && !isReducedMotion() && view === 'play') {
      animate(panelRef.current, { opacity: [0, 1], y: [24, 0], duration: 700, ease: 'out(4)' })
    }
  }, [view, reduced])

  /* A little bouncing ball teases play mode. */
  useLayoutEffect(() => {
    if (!ballRef.current || isReducedMotion()) return
    const a = animate(ballRef.current, { y: [0, -7, 0], scaleX: [1.2, 0.9, 1.2], scaleY: [0.8, 1.1, 0.8], duration: 900, loop: true, ease: 'inOut(2)' })
    return () => {
      a.revert()
    }
  }, [reduced])

  return (
    <section id="skills" className="relative overflow-clip bg-bg py-28 md:py-40" aria-labelledby="skills-title">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent)] opacity-70" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            id="skills-title"
            index="02"
            eyebrow="Skills & expertise"
            title="My stack, ready to play."
            intro={`${skills.length} tools from my résumé. Flip a card for details, shuffle the deck, or switch to play mode and throw them around.`}
          />
          {!reduced ? (
            <div ref={toggleRef} className="relative flex rounded-full border border-line-strong bg-surface p-1.5 shadow-[var(--shadow)]" role="group" aria-label="Skills view">
              <span ref={pillRef} className="pointer-events-none absolute inset-y-1.5 left-0 w-0 rounded-full bg-gold opacity-0" aria-hidden="true" />
              {(
                [
                  { id: 'cards', label: 'Cards' },
                  { id: 'play', label: 'Play mode' },
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
                  {v.id === 'play' ? (
                    <span ref={ballRef} className="inline-block h-2.5 w-2.5 rounded-full bg-ember" aria-hidden="true" />
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
          {view === 'play' && !reduced ? <SkillPlayground /> : <SkillCards />}
        </div>

        {/* Specialized Focus Areas replacing empty certifications */}
        <div className="mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Enterprise Specializations</p>
              <h3 className="font-wide text-2xl text-ink md:text-3xl mt-1">Core Focus Areas</h3>
            </div>
            <p className="font-mono text-xs text-ink-3">Six areas from my day-to-day work at AOSC and selected projects</p>
          </div>
          <FadeIn as="ul" items=".focus-item" step={70} className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coreFocusAreas.map((f) => (
              <li
                key={f.title}
                className="focus-item card spotlight group relative flex flex-col justify-between p-6 transition-all duration-300 hover:border-gold/50 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl select-none" aria-hidden="true">{f.icon}</span>
                    <span className="font-mono text-[10px] tracking-wider text-gold uppercase px-2.5 py-0.5 rounded-full bg-gold/10 border border-gold/25">
                      {f.highlight}
                    </span>
                  </div>
                  <h4 className="font-wide text-lg text-ink mt-4 group-hover:text-gold transition-colors duration-300">
                    {f.title}
                  </h4>
                  <p className="font-mono text-xs text-gold/90 mt-1">
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
