import Link from 'next/link'
import type { Project } from '@/content/projects'
import { ProjectMock } from './ProjectMock'
import { ArrowUpRight } from '../ui/Icons'

/** Card used on /projects and as the reduced-motion fallback for the ribbon. */
export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className="project-card spotlight group card relative flex h-full flex-col overflow-hidden p-2.5 transition-colors duration-500 hover:border-line-strong">
      <div className="shine relative overflow-hidden rounded-[1.1rem] border border-line">
        <ProjectMock project={project} className="transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]" />
        <span className="absolute top-3 right-3 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-gold text-on-gold opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100" aria-hidden="true">
          <ArrowUpRight size={18} />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4 md:p-5">
        <p className="font-mono text-[11px] tracking-wider text-ink-3 uppercase">
          <span className="text-gold">{String(index + 1).padStart(2, '0')}</span> · {project.start}
          {project.end !== project.start ? ` – ${project.end}` : ''} · {project.sector}
        </p>
        <h3 className="font-wide mt-3 text-xl text-ink md:text-2xl">
          <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0">
            {project.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-ink-2">{project.summary}</p>
        <div className="mt-auto pt-5">
          <ul className="flex flex-wrap gap-1.5">
            {project.tech.slice(0, 4).map((t) => (
              <li key={t} className="chip py-1 text-[11px]">
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-5 flex items-center gap-2 text-sm text-gold">
            <span className="h-px w-6 bg-gold transition-all duration-500 group-hover:w-12" aria-hidden="true" />
            Case study
          </p>
        </div>
      </div>
    </article>
  )
}
