'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { animate, stagger } from 'animejs'
import { skillCategories, skills, softSkills, type SkillCategory, type Skill } from '@/content/skills'
import { achievements, education, experience, type ExperienceType } from '@/content/experience'

import { profile, stats } from '@/content/profile'
import { isReducedMotion } from '@/lib/motion'
import { Check } from '../ui/Icons'

type Tab = { id: string; label: string }

/** Accessible tablist (arrow keys, Home/End) with a sliding gold capsule/underline. */
function Tabs({
  tabs,
  active,
  onChange,
  size = 'lg',
  label,
}: {
  tabs: Tab[]
  active: string
  onChange: (id: string) => void
  size?: 'lg' | 'sm'
  label: string
}) {
  const listRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const btn = listRef.current?.querySelector<HTMLElement>(`[data-tab="${active}"]`)
    if (!btn || !lineRef.current) return
    animate(lineRef.current, {
      x: btn.offsetLeft,
      width: btn.offsetWidth,
      duration: isReducedMotion() ? 0 : 500,
      ease: 'out(4)',
    })
  }, [active])

  const onKey = (e: React.KeyboardEvent) => {
    const i = tabs.findIndex((t) => t.id === active)
    let next = -1
    if (e.key === 'ArrowRight') next = (i + 1) % tabs.length
    if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = tabs.length - 1
    if (next < 0) return
    e.preventDefault()
    onChange(tabs[next].id)
    listRef.current?.querySelector<HTMLElement>(`[data-tab="${tabs[next].id}"]`)?.focus()
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      onKeyDown={onKey}
      className={`relative flex items-center gap-2 overflow-x-auto no-scrollbar ${
        size === 'lg'
          ? 'rounded-2xl border border-line-strong/80 bg-surface/40 p-2 backdrop-blur-md'
          : 'rounded-full border border-line-strong/60 bg-surface/30 p-1.5 backdrop-blur-sm'
      }`}
    >
      {tabs.map((t, index) => (
        <button
          key={t.id}
          role="tab"
          type="button"
          id={`tab-${t.id}`}
          data-tab={t.id}
          aria-selected={active === t.id}
          aria-controls={`panel-${t.id}`}
          tabIndex={active === t.id ? 0 : -1}
          onClick={() => onChange(t.id)}
          className={`relative z-10 shrink-0 flex items-center gap-2.5 whitespace-nowrap transition-all duration-300 ${
            size === 'lg'
              ? 'font-wide px-5 py-3 text-sm md:text-base rounded-xl text-ink-2 hover:text-ink aria-selected:text-gold font-medium'
              : 'rounded-full px-4 py-2 text-xs md:text-sm text-ink-3 hover:text-ink aria-selected:text-gold font-medium'
          }`}
        >
          <span className="font-mono text-[10px] text-ink-3">{String(index + 1).padStart(2, '0')}</span>
          <span>{t.label}</span>
        </button>
      ))}
      <span
        ref={lineRef}
        className={`pointer-events-none absolute left-0 z-0 transition-opacity duration-300 ${
          size === 'lg'
            ? 'top-2 bottom-2 rounded-xl bg-gold/15 border border-gold/40 shadow-[0_0_20px_var(--glow)]'
            : 'top-1.5 bottom-1.5 rounded-full bg-gold/15 border border-gold/30 shadow-[0_0_12px_var(--glow)]'
        }`}
        aria-hidden="true"
      />
    </div>
  )
}

/** Staggers a panel's items in whenever its key changes. */
function usePanelIn(key: string) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || isReducedMotion()) return
    animate(el.querySelectorAll('.p-item'), {
      opacity: [0, 1],
      y: [20, 0],
      duration: 600,
      delay: stagger(40),
      ease: 'out(4)',
    })
  }, [key])
  return ref
}

const mainTabs: Tab[] = [
  { id: 'skills', label: 'Skills & Capabilities' },
  { id: 'experience', label: 'Career Experience' },
  { id: 'education', label: 'Education & Milestones' },
]

export function AboutTabs() {
  const [tab, setTab] = useState('skills')

  // Listen to hash on mount or change (e.g. #experience or #skills)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const hash = window.location.hash.replace('#', '')
    if (hash === 'skills' || hash === 'experience' || hash === 'education') {
      const frame = requestAnimationFrame(() => setTab(hash))
      return () => cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-line">
        <div>
          <p className="eyebrow">Expertise & Background</p>
          <h2 className="font-wide mt-2 text-[clamp(2rem,3.8vw,3.2rem)] text-ink leading-tight">
            Engineered for impact. Built to scale.
          </h2>
        </div>
        <div className="shrink-0">
          <Tabs tabs={mainTabs} active={tab} onChange={setTab} label="About sections" />
        </div>
      </div>

      <div id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} className="pt-10">
        {tab === 'skills' ? <SkillsPanel /> : tab === 'experience' ? <ExperiencePanel /> : <EducationPanel />}
      </div>
    </div>
  )
}

const categoryCodes: Record<string, string> = {
  platform: 'PLT',
  m365: 'M365',
  ai: 'AI',
  data: 'DATA',
  dev: 'WEB',
  all: 'ALL',
  soft: 'OPS',
}

function getProficiencyPct(skill: Skill): number {
  if (skill.level === 'Core') {
    return skill.years >= 3 ? 98 : 94
  }
  if (skill.level === 'Strong') {
    return skill.years >= 3 ? 90 : skill.years === 2 ? 86 : 82
  }
  return 76
}

function SkillsPanel() {
  const cats = ['all', ...(Object.keys(skillCategories) as SkillCategory[]), 'soft'] as const
  const [cat, setCat] = useState<string>('platform')
  const ref = usePanelIn(cat)
  const projectsShipped = stats.find((stat) => stat.label === 'Projects shipped to production')
  const overviewStats = [
    { value: String(skills.length), label: 'Specialized Skills' },
    { value: String(Object.keys(skillCategories).length), label: 'Practice Areas' },
    { value: profile.yearsBadge.value, label: 'Years Building' },
    { value: `${projectsShipped?.value ?? 0}${projectsShipped?.suffix ?? ''}`, label: 'Production Projects' },
  ]

  const list =
    cat === 'soft'
      ? []
      : cat === 'all'
      ? [...skills].sort((a, b) => b.years - a.years)
      : skills.filter((s) => s.category === cat).sort((a, b) => b.years - a.years)

  const getCount = (c: string) => {
    if (c === 'all') return skills.length
    if (c === 'soft') return softSkills.length
    return skills.filter((s) => s.category === c).length
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 rounded-2xl border border-line-strong/60 bg-gradient-to-r from-surface-2/40 via-surface/30 to-bg/50 p-5 backdrop-blur-md sm:grid-cols-4">
        {overviewStats.map((stat) => (
          <div key={stat.label} className="flex flex-col">
            <span className="font-wide text-2xl text-gold md:text-3xl">{stat.value}</span>
            <span className="mt-1 font-mono text-xs tracking-wider text-ink-3 uppercase">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Category Pills Switcher */}
      <div className="flex flex-wrap items-center gap-2">
        {cats.map((c) => {
          const isSelected = cat === c
          const count = getCount(c)
          const label = c === 'all' ? 'All Skills' : c === 'soft' ? 'Ways of Working' : skillCategories[c as SkillCategory].label
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={`group flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 border ${
                isSelected
                  ? 'border-gold bg-gold/15 text-gold shadow-[0_0_16px_var(--glow)]'
                  : 'border-line-strong/60 bg-surface/40 text-ink-2 hover:border-gold/50 hover:text-ink'
              }`}
            >
              <span className="font-mono text-[9px] tracking-[0.12em] text-ink-3">{categoryCodes[c]}</span>
              <span>{label}</span>
              <span
                className={`font-mono text-[10px] px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-gold/30 text-gold' : 'bg-surface-2 text-ink-3 group-hover:text-ink'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Skills Grid */}
      <div ref={ref} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cat === 'soft' ? (
          softSkills.map((s, idx) => (
              <div
                key={s}
                className="p-item card group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_12px_30px_rgba(0,0,0,0.15)]"
              >
                <div className="flex items-start gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-line-strong bg-surface-2 font-mono text-[11px] tracking-wider text-ink-3">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-wide text-lg text-ink group-hover:text-gold transition-colors">{s}</h3>
                    <p className="mt-2 text-xs md:text-sm text-ink-2 leading-relaxed">
                      Applied across multi-team enterprise engagements, stakeholder workshops, and continuous production rollouts.
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1.5 font-mono text-[11px] text-gold/80">
                  <Check size={14} className="text-gold" />
                  <span>Verified Delivery Practice</span>
                </div>
              </div>
          ))
        ) : (
          list.map((s) => {
            const pct = getProficiencyPct(s)
            const isCore = s.level === 'Core'
            const isStrong = s.level === 'Strong'

            return (
              <div
                key={s.name}
                className="p-item card group relative flex flex-col justify-between overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_12px_32px_rgba(0,0,0,0.25)]"
              >
                {/* Background Ambient Glow */}
                <div
                  className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-10 blur-2xl transition-opacity duration-500 group-hover:opacity-30"
                  style={{ background: 'var(--gold)' }}
                  aria-hidden="true"
                />

                <div>
                  {/* Top: Monogram + Badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative grid h-13 w-13 shrink-0 place-items-center rounded-2xl border border-gold/40 bg-gradient-to-br from-gold/20 via-surface-2 to-surface font-wide text-xl font-bold text-gold shadow-sm transition-transform duration-300 group-hover:scale-105">
                        {s.symbol}
                        <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-gold" />
                      </div>
                      <div>
                        <h3 className="font-wide text-lg text-ink group-hover:text-gold transition-colors">{s.name}</h3>
                        <p className="font-mono text-xs text-ink-3">
                          {s.years} {s.years === 1 ? 'Year' : 'Years'} hands-on
                        </p>
                      </div>
                    </div>

                    <span
                      className={`chip text-[10px] tracking-wide font-medium py-1 px-2.5 ${
                        isCore
                          ? 'border-gold/50 bg-gold/15 text-gold shadow-[0_0_12px_var(--glow)]'
                          : isStrong
                          ? 'border-line-strong bg-surface-2 text-ink-2'
                          : 'border-line bg-surface text-ink-3'
                      }`}
                    >
                      {isCore ? 'Core' : isStrong ? 'Strong' : 'Growth'}
                    </span>
                  </div>

                  {/* Note / Context */}
                  <p className="mt-4 text-xs md:text-sm leading-relaxed text-ink-2">
                    {s.note}
                  </p>
                </div>

                {/* Bottom: Proficiency Meter */}
                <div className="mt-6 pt-4 border-t border-line/60">
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-ink-3 uppercase tracking-wider">Proficiency</span>
                    <span className="text-gold font-semibold">{pct}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-gold-3 via-gold to-gold-2 transition-all duration-1000 ease-out shadow-[0_0_8px_var(--gold)]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

function ExperiencePanel() {
  const types: ExperienceType[] = ['Full-time', 'Freelance', 'Internship', 'Community']
  const [type, setType] = useState<string>('Full-time')
  const ref = usePanelIn(type)

  return (
    <div className="space-y-8">
      <Tabs size="sm" label="Experience types" active={type} onChange={setType} tabs={types.map((t) => ({ id: t, label: t }))} />
      
      <div ref={ref} className="space-y-6">
        {experience
          .filter((e) => e.type === type)
          .map((e) => (
            <article
              key={e.role + e.start}
              className="p-item card group relative overflow-hidden p-6 md:p-8 transition-all duration-300 hover:border-gold/50 hover:shadow-xl"
            >
              <div className="grid gap-6 md:grid-cols-12">
                <div className="md:col-span-4">
                  <span className="inline-block font-mono text-xs tracking-wider text-gold/90 uppercase px-3 py-1 rounded-full bg-gold/10 border border-gold/20">
                    {e.start} — {e.end}
                  </span>
                  <h3 className="font-wide mt-3 text-2xl text-ink group-hover:text-gold transition-colors">{e.role}</h3>
                  <p className="font-serif mt-1 text-xl text-gold italic">{e.company}</p>
                  <p className="mt-2 text-sm text-ink-3">{e.location}</p>
                </div>

                <div className="md:col-span-8 space-y-6">
                  <p className="text-base leading-relaxed text-ink-2">{e.summary}</p>

                  <div>
                    <h4 className="eyebrow mb-3">Key Deliverables & Architecture</h4>
                    <ul className="space-y-2.5">
                      {e.achievements.map((a) => (
                        <li key={a} className="flex items-start gap-3 text-sm md:text-base text-ink-2">
                          <Check size={16} className="mt-1 shrink-0 text-gold" />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="eyebrow mb-3">Measurable Impact</h4>
                    <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {e.impact.map((m) => (
                        <div
                          key={m.label}
                          className="flex flex-col-reverse rounded-xl border border-line-strong/60 bg-surface/40 p-3.5"
                        >
                          <dt className="mt-1 text-[11px] text-ink-3">{m.label}</dt>
                          <dd className="font-wide text-xl md:text-2xl text-gold">{m.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <div>
                    <h4 className="eyebrow mb-3">Technologies Leveraged</h4>
                    <ul className="flex flex-wrap gap-2" aria-label="Technologies">
                      {e.tech.map((t) => (
                        <li key={t} className="chip border-line-strong bg-surface py-1 text-xs">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          ))}
      </div>
    </div>
  )
}

function EducationPanel() {
  const [sub, setSub] = useState('qualification')
  const ref = usePanelIn(sub)

  return (
    <div className="space-y-8">
      <Tabs
        size="sm"
        label="Education types"
        active={sub}
        onChange={setSub}
        tabs={[
          { id: 'qualification', label: 'Qualifications' },
          { id: 'achievement', label: 'Key Milestones' },
        ]}
      />

      <div ref={ref} className="grid gap-4 md:grid-cols-2">
        {sub === 'qualification'
          ? education.map((e) => (
              <article
                key={e.title}
                className="p-item card p-6 md:p-8 hover:border-gold/50 transition-all duration-300"
              >
                <span className="font-mono text-xs tracking-wider text-gold uppercase px-3 py-1 rounded-full bg-gold/10 border border-gold/20">
                  {e.years}
                </span>
                <h3 className="font-wide mt-3 text-2xl text-ink">{e.title}</h3>
                <p className="font-serif mt-1 text-lg text-gold italic">{e.school}</p>
                <p className="mt-2 text-sm text-ink-2 leading-relaxed">
                  {e.detail} · {e.location}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {e.tags.map((t) => (
                    <li key={t} className="chip border-line-strong bg-surface py-1 text-xs">
                      {t}
                    </li>
                  ))}
                </ul>
              </article>
            ))
          : achievements.map((a) => (
              <article
                key={a.title}
                className="p-item card p-6 md:p-8 hover:border-gold/50 transition-all duration-300"
              >
                <span className="font-mono text-xs text-gold uppercase">{a.year}</span>
                <h3 className="font-wide mt-2 text-xl text-ink">{a.title}</h3>
                <p className="mt-3 text-sm md:text-base leading-relaxed text-ink-2">{a.detail}</p>
              </article>
            ))}
      </div>
    </div>
  )
}
