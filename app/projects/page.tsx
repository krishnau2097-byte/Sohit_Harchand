import type { Metadata } from 'next'
import Link from 'next/link'
import { ProjectsGrid } from '@/components/ProjectsGrid'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ArrowRight } from '@/components/ui/Icons'
import { additionalProjects } from '@/content/projects'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Dynamics 365 CE, Power Platform, Copilot Studio and Azure OpenAI projects, plus AI-driven Qlik and Tableau to Microsoft Fabric migration tooling.',
  alternates: { canonical: '/projects' },
}

export default function ProjectsPage() {
  return (
    <>
      <section className="relative overflow-clip pt-28 pb-6 md:pt-36">
        <div className="hero-wash pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="container-page relative">
          <SectionHeading
            as="h1"
            align="left"
            eyebrow="Projects"
            title="Selected"
            accent="work"
            intro="Dynamics 365 CE platforms, Copilot Studio and Azure OpenAI agents, Power Platform apps and Fabric migration tooling. Filter by category and open any card for the details."
          />
        </div>
      </section>

      <section aria-label="Project list" className="pt-8 pb-20">
        <div className="container-page">
          <ProjectsGrid />
        </div>
      </section>

      <section aria-labelledby="more-title" className="border-t border-line bg-bg-2 py-16 md:py-20">
        <div className="container-page">
          <h2 id="more-title" data-reveal="" className="text-xl font-semibold text-ink">
            Additional projects
          </h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {additionalProjects.map((p, i) => (
              <li key={p.title} data-reveal="" style={{ '--d': `${i * 70}ms` } as React.CSSProperties} className="card card-hover spotlight p-5">
                <h3 className="font-semibold text-ink">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{p.text}</p>
              </li>
            ))}
          </ul>

          <div data-reveal="" className="mt-14 flex flex-col items-start justify-between gap-5 rounded-2xl border border-line bg-surface p-6 md:flex-row md:items-center md:p-8">
            <p className="text-lg font-semibold text-ink">Have something similar in mind?</p>
            <Link href="/contact" className="btn btn-primary">
              Let&apos;s talk <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
