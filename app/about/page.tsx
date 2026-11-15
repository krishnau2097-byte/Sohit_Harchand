import type { Metadata } from 'next'
import Link from 'next/link'
import { profile } from '@/content/profile'
import { education, experience } from '@/content/experience'
import { projects } from '@/content/projects'
import { skillCount } from '@/content/skills'
import { SkillsGrid } from '@/components/SkillsGrid'
import { ExperienceList } from '@/components/ExperienceList'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { CountUp } from '@/components/ui/CountUp'
import { ArrowRight } from '@/components/ui/Icons'

export const metadata: Metadata = {
  title: 'About',
  description: 'Dynamics 365 and Power Platform developer: experience, core skills and education.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  const job = experience[0]
  const facts = [
    { k: 'Current role', v: `${job.role}, ${job.company}` },
    { k: 'Based in', v: profile.location },
    { k: 'Studying', v: `${education[0].title}, ${education[0].school}` },
    { k: 'Status', v: profile.availability },
  ]
  const stats = [
    { value: 2, suffix: '+', label: 'Years of experience' },
    { value: projects.length, suffix: '', label: 'Selected projects' },
    { value: job.apps.length, suffix: '', label: 'D365 CE apps delivered' },
    { value: skillCount, suffix: '', label: 'Tools in my stack' },
  ]

  return (
    <>
      <section className="relative overflow-clip pt-28 pb-16 md:pt-36">
        <div className="hero-wash pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="container-page relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div>
            <SectionHeading as="h1" align="left" eyebrow="About me" title="CRM, automation and AI agents," accent="built to last." />
            <div className="mt-6 space-y-4 leading-relaxed text-ink-2">
              {profile.about.map((p, i) => (
                <p key={i} className="rise" style={{ '--d': `${100 + i * 80}ms` } as React.CSSProperties}>
                  {p}
                </p>
              ))}
            </div>
            <div className="rise mt-8 flex flex-wrap gap-3">
              <Link href="/projects" className="btn btn-primary">
                See my projects <ArrowRight size={16} />
              </Link>
              <Link href="/contact" className="btn btn-ghost">
                Get in touch
              </Link>
            </div>
          </div>

          <aside style={{ '--d': '150ms' } as React.CSSProperties} className="rise card self-start p-5 md:p-6">
            <p className="eyebrow">Quick facts</p>
            <dl className="mt-4 divide-y divide-line">
              {facts.map((f) => (
                <div key={f.k} className="py-3">
                  <dt className="text-xs text-ink-3">{f.k}</dt>
                  <dd className="mt-0.5 text-sm text-ink">{f.v}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>

        <dl className="container-page relative mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} data-reveal="" style={{ '--d': `${i * 70}ms` } as React.CSSProperties} className="card flex flex-col-reverse p-5">
              <dt className="mt-1 text-sm text-ink-3">{s.label}</dt>
              <dd className="text-3xl font-semibold text-gold">
                <CountUp value={s.value} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="skills" aria-labelledby="skills-title" className="section border-y border-line bg-bg-2">
        <div className="container-page">
          <SectionHeading id="skills-title" eyebrow="Core skills" title="Skills &" accent="Expertise" intro="Grouped as on my résumé. Pick a category to see each skill." />
          <div className="mt-10">
            <SkillsGrid />
          </div>
        </div>
      </section>

      <section id="experience" aria-labelledby="experience-title" className="section">
        <div className="container-page">
          <SectionHeading id="experience-title" eyebrow="Career" title="Experience &" accent="Education" />
          <div className="mx-auto mt-12 max-w-4xl">
            <ExperienceList />
          </div>
        </div>
      </section>
    </>
  )
}
