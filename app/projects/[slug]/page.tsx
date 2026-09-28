import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProject, projects } from '@/content/projects'
import { ProjectHeroShot } from '@/components/projects/ProjectHeroShot'
import { RevealText } from '@/components/ui/RevealText'
import { FadeIn } from '@/components/ui/FadeIn'
import { ArrowLeft, ArrowUpRight, Check } from '@/components/ui/Icons'

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps<'/projects/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const p = getProject(slug)
  if (!p) return {}
  return {
    title: p.title,
    description: p.summary,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { title: p.title, description: p.summary },
  }
}

export default async function ProjectPage({ params }: PageProps<'/projects/[slug]'>) {
  const { slug } = await params
  const p = getProject(slug)
  if (!p) notFound()
  const i = projects.indexOf(p)
  const next = projects[(i + 1) % projects.length]

  const sections = [
    { k: 'The problem', body: <p>{p.caseStudy.problem}</p> },
    { k: 'My role', body: <p>{p.caseStudy.role}</p> },
    {
      k: 'Stack',
      body: (
        <ul className="flex flex-wrap gap-2">
          {p.tech.map((t) => (
            <li key={t} className="chip">
              {t}
            </li>
          ))}
        </ul>
      ),
    },
    {
      k: 'What we built',
      body: (
        <ul className="space-y-3">
          {p.caseStudy.features.map((f) => (
            <li key={f} className="flex gap-3">
              <Check size={18} className="mt-1 shrink-0 text-gold" /> {f}
            </li>
          ))}
        </ul>
      ),
    },
    { k: 'Outcome', body: <p className="font-serif text-2xl leading-snug text-ink italic md:text-3xl">{p.caseStudy.outcome}</p> },
  ]

  return (
    <article>
      <header className="relative overflow-clip pt-32 pb-12 md:pt-40">
        <div className="blinds pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
          <Link href="/projects" className="group inline-flex items-center gap-2 text-sm text-ink-2 hover:text-gold">
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> All projects
          </Link>
          <p className="eyebrow mt-10">{p.categories.join(' · ')}</p>
          <RevealText as="h1" trigger="loader" className="font-wide mt-5 max-w-[18ch] text-[clamp(2.6rem,6.5vw,6rem)] text-ink">
            {p.title}
          </RevealText>
          <FadeIn items=".meta" delay={300} className="mt-10 grid grid-cols-2 gap-6 border-t border-line pt-6 md:grid-cols-4">
            {[
              ['Client', p.client],
              ['Sector', p.sector],
              ['Timeline', p.start === p.end ? p.start : `${p.start} – ${p.end}`],
              ['Platform', p.categories[0]],
            ].map(([k, v]) => (
              <div key={k} className="meta">
                <p className="font-mono text-[11px] tracking-wider text-ink-3 uppercase">{k}</p>
                <p className="mt-1 text-ink">{v}</p>
              </div>
            ))}
          </FadeIn>
        </div>
      </header>

      <ProjectHeroShot project={p} />

      <section className="py-20 md:py-28" aria-label="Case study">
        <div className="mx-auto grid max-w-[1440px] gap-16 px-5 md:px-10 lg:grid-cols-12">
          <FadeIn className="lg:col-span-4" y={20}>
            <p className="font-serif text-2xl leading-snug text-ink italic">{p.summary}</p>
            <dl className="mt-10 grid grid-cols-3 gap-4 border-y border-line py-6 lg:grid-cols-1">
              {p.metrics.map((m) => (
                <div key={m.label} className="flex flex-col-reverse">
                  <dt className="mt-1 text-sm text-ink-3">{m.label}</dt>
                  <dd className="font-wide text-[clamp(1.6rem,3vw,2.6rem)] text-gold">{m.value}</dd>
                </div>
              ))}
            </dl>
            {p.links?.demo || p.links?.code ? (
              <div className="mt-8 flex flex-wrap gap-3">
                {p.links.demo ? (
                  <a href={p.links.demo} className="btn btn-primary" target="_blank" rel="noreferrer">
                    Live demo <ArrowUpRight size={16} />
                  </a>
                ) : null}
                {p.links.code ? (
                  <a href={p.links.code} className="btn btn-ghost" target="_blank" rel="noreferrer">
                    Code
                  </a>
                ) : null}
              </div>
            ) : null}
          </FadeIn>
          <div className="space-y-4 lg:col-span-7 lg:col-start-6">
            {sections.map((s, n) => (
              <FadeIn key={s.k} className="card grid gap-4 p-6 md:grid-cols-[10rem_1fr] md:p-8" y={40}>
                <h2 className="eyebrow flex gap-3">
                  <span className="text-ink-3">0{n + 1}</span> {s.k}
                </h2>
                <div className="leading-relaxed text-ink-2">{s.body}</div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <Link href={`/projects/${next.slug}`} className="group relative block overflow-hidden border-t border-line bg-bg-2 py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <p className="eyebrow">Next project</p>
          <p className="font-wide mt-5 flex items-center gap-6 text-[clamp(2.2rem,6vw,5.5rem)] text-ink transition-colors duration-500 group-hover:text-gold">
            {next.title}
            <ArrowUpRight size={56} className="shrink-0 transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-2" />
          </p>
        </div>
      </Link>
    </article>
  )
}
