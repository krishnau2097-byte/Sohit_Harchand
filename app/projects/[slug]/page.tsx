import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProject, projects } from '@/content/projects'
import { ArrowLeft, ArrowRight, Check } from '@/components/ui/Icons'

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

  return (
    <article>
      <header className="relative overflow-clip pt-28 pb-10 md:pt-36">
        <div className="hero-wash pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="container-page relative max-w-4xl">
          <Link href="/projects" className="group inline-flex items-center gap-2 text-sm text-ink-2 hover:text-gold">
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> All projects
          </Link>
          <p className="rise eyebrow mt-8">
            {p.categories.join(' · ')}
          </p>
          <h1 className="mt-3text-[clamp(2rem,1.4rem+2.6vw,3rem)] leading-[1.1] font-semibold text-ink">
            {p.title}
          </h1>
          <p style={{ '--d': '120ms' } as React.CSSProperties} className="rise mt-2 text-lg text-gold">
            {p.subtitle}
          </p>
          <p style={{ '--d': '180ms' } as React.CSSProperties} className="rise mt-5 max-w-2xl leading-relaxed text-ink-2">
            {p.summary}
          </p>
        </div>
      </header>

      <div className="container-page max-w-4xl space-y-6 pb-20">
        <section data-reveal="" aria-labelledby="stack-title" className="card p-5 md:p-7">
          <h2 id="stack-title" className="eyebrow">
            Stack
          </h2>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {p.stack.map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
          </ul>
        </section>

        <section data-reveal="" aria-labelledby="built-title" className="card p-5 md:p-7">
          <h2 id="built-title" className="eyebrow">
            What I built
          </h2>
          <ul className="mt-5 space-y-5">
            {p.highlights.map((h, n) => (
              <li key={n} data-reveal="" style={{ '--d': `${n * 70}ms` } as React.CSSProperties} className="flex gap-3">
                <Check size={18} className="mt-0.5 shrink-0 text-gold" />
                <div className="leading-relaxed text-ink-2">
                  {h.label ? <p className="mb-1 font-medium text-ink">{h.label}</p> : null}
                  <p>{h.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <Link href={`/projects/${next.slug}`} data-reveal="" className="card card-hover spotlight group flex items-center justify-between gap-4 p-5 md:p-7">
          <span>
            <span className="eyebrow">Next project</span>
            <span className="mt-2 block text-lg font-semibold text-ink group-hover:text-gold">{next.title}</span>
            <span className="block text-sm text-ink-3">{next.subtitle}</span>
          </span>
          <ArrowRight size={22} className="shrink-0 text-gold transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  )
}
