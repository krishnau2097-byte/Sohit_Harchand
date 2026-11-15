import Link from 'next/link'
import { profile } from '@/content/profile'
import { projects } from '@/content/projects'
import { experience } from '@/content/experience'
import { hasResume, resumeHref } from '@/lib/resume'
import { TypedWords } from '../ui/TypedWords'
import { CountUp } from '../ui/CountUp'
import { ArrowRight, Download, Linkedin, Mail } from '../ui/Icons'

/** The delivery loop shown in the hero card; each step lights up in turn (CSS only). */
const pipeline = [
  { step: 'Model', detail: 'Dataverse tables, security roles, D365 CE' },
  { step: 'Automate', detail: 'Power Automate, Azure Functions, Logic Apps' },
  { step: 'Add AI', detail: 'Copilot Studio agents, Azure OpenAI' },
  { step: 'Ship', detail: 'Azure DevOps CI/CD · Dev → UAT → Production' },
]

export function Hero() {
  const showResume = hasResume()
  const stats = [
    { value: 2, suffix: '+', label: 'Years on the Microsoft stack' },
    { value: projects.length, suffix: '', label: 'Selected projects' },
    { value: experience[0].apps.length, suffix: '', label: 'D365 CE apps delivered' },
  ]

  return (
    <section id="home" className="relative overflow-clip pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="hero-wash pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />

      <div className="container-page relative grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <p className="rise eyebrow">
            {profile.eyebrow}
          </p>

          {/* No fade on the h1: it is the LCP element, and Chrome skips paints at opacity 0. */}
          <h1 className="mt-4text-[clamp(2rem,1.3rem+2.8vw,3.25rem)] leading-[1.12] font-semibold text-ink">
            <span className="sr-only">I build {profile.heroWords.join(', ')} on the Microsoft stack.</span>
            <span aria-hidden="true">
              I build <TypedWords words={profile.heroWords} className="block whitespace-nowrap text-accent" />
              on the Microsoft stack.
            </span>
          </h1>

          <p style={{ '--d': '160ms' } as React.CSSProperties} className="rise mt-5 font-medium text-ink">
            {profile.role} <span className="text-ink-3">|</span> {profile.headline}
          </p>
          <p style={{ '--d': '220ms' } as React.CSSProperties} className="rise mt-3 max-w-xl leading-relaxed text-ink-2">
            {profile.summary}
          </p>

          <div style={{ '--d': '300ms' } as React.CSSProperties} className="rise mt-8 flex flex-wrap gap-3">
            <Link href="/projects" className="btn btn-primary">
              View projects <ArrowRight size={16} />
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              <Mail size={16} /> Get in touch
            </Link>
            {showResume ? (
              <a href={resumeHref} download className="btn btn-ghost">
                <Download size={16} /> Résumé
              </a>
            ) : null}
          </div>

          <div style={{ '--d': '360ms' } as React.CSSProperties} className="rise mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-ink-2">
            <span className="inline-flex items-center gap-2">
              <span className="status-dot h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
              {profile.availability}
            </span>
            <span className="hidden h-4 w-px bg-line-strong sm:block" aria-hidden="true" />
            <span className="flex gap-1">
              {profile.socials.map((s) => (
                <a key={s.label} href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" aria-label={s.label} className="icon-btn">
                  {s.label === 'LinkedIn' ? <Linkedin /> : <Mail />}
                </a>
              ))}
            </span>
          </div>
        </div>

        <div style={{ '--d': '200ms' } as React.CSSProperties} className="rise card p-5 shadow-[var(--shadow)] sm:p-6">
          <div className="flex items-center justify-between">
            <p className="eyebrow">How I deliver</p>
            <span className="font-mono text-[11px] text-ink-3">{experience[0].company} · {experience[0].start} – now</span>
          </div>
          <div className="mt-4 h-1 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
            <div className="pipe-bar h-full rounded-full bg-gradient-to-r from-gold to-ember" />
          </div>
          <ol className="mt-4 space-y-2">
            {pipeline.map((p, i) => (
              <li key={p.step} className="pipe-step flex items-start gap-3 rounded-xl border border-line px-3.5 py-3" style={{ '--d': `${i * 2.5}s` } as React.CSSProperties}>
                <span className="pipe-dot mt-1.5 h-2 w-2 shrink-0 rounded-full bg-line-strong" aria-hidden="true" />
                <span>
                  <span className="block text-sm font-medium text-ink">
                    <span className="font-mono text-xs text-ink-3">0{i + 1}</span> {p.step}
                  </span>
                  <span className="block text-sm text-ink-2">{p.detail}</span>
                </span>
              </li>
            ))}
          </ol>
          <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-5">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="mt-0.5 text-xs leading-snug text-ink-3">{s.label}</dt>
                <dd className="text-2xl font-semibold text-gold">
                  <CountUp value={s.value} suffix={s.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
