import type { Metadata } from 'next'
import Link from 'next/link'
import { ProjectsGrid } from '@/components/projects/ProjectsGrid'
import { RevealText } from '@/components/ui/RevealText'
import { ScrambleText } from '@/components/ui/ScrambleText'
import { FadeIn } from '@/components/ui/FadeIn'
import { ArrowUpRight } from '@/components/ui/Icons'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Selected enterprise migration platforms, React applications, AI learning systems, and Power Platform projects by Sohit Harchand.',
  alternates: { canonical: '/projects' },
}

export default function ProjectsPage() {
  return (
    <>
      <section className="relative overflow-clip pt-36 pb-16 md:pt-44">
        <div className="blinds pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
          <p className="eyebrow">
            <ScrambleText>Selected projects</ScrambleText>
          </p>
          <RevealText as="h1" trigger="loader" className="font-wide mt-6 max-w-[16ch] text-[clamp(2.8rem,7vw,6.5rem)] text-ink">
            Work that runs in production.
          </RevealText>
          <FadeIn as="p" delay={200} className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-2">
            Migration platforms, AI systems, intranets, Power Apps and workflow automation. Filter by category, open any card for the problem, role, stack and outcome.
          </FadeIn>
        </div>
      </section>

      <section className="pb-28" aria-label="Project list">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <ProjectsGrid />
        </div>
      </section>

      <section className="border-t border-line bg-bg-2 py-24">
        <FadeIn className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-8 px-5 md:flex-row md:items-end md:px-10">
          <h2 className="font-wide max-w-[18ch] text-[clamp(2rem,4.5vw,3.8rem)] text-ink">Have something similar in mind?</h2>
          <Link href="/contact" className="btn btn-primary">
            Start a project <ArrowUpRight size={16} />
          </Link>
        </FadeIn>
      </section>
    </>
  )
}
