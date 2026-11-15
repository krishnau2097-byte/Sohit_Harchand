import Link from 'next/link'
import type { Project } from '@/content/projects'
import { ArrowUpRight } from './ui/Icons'

const MAX_CHIPS = 4

export function ProjectCard({ project: p, className = '', style }: { project: Project; className?: string; style?: React.CSSProperties }) {
  const extra = p.stack.length - MAX_CHIPS
  return (
    <Link href={`/projects/${p.slug}`} className={`card card-hover spotlight group flex h-full flex-col p-5 md:p-6 ${className}`} style={style}>
      <p className="eyebrow">{p.categories.join(' · ')}</p>
      <h3 className="mt-3 text-lg leading-snug font-semibold text-ink transition-colors group-hover:text-gold">{p.title}</h3>
      <p className="mt-1 text-sm text-ink-3">{p.subtitle}</p>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-2">{p.summary}</p>
      <ul className="mt-5 flex flex-wrap gap-1.5">
        {p.stack.slice(0, MAX_CHIPS).map((t) => (
          <li key={t} className="chip">
            {t}
          </li>
        ))}
        {extra > 0 ? <li className="chip text-ink-3">+{extra}</li> : null}
      </ul>
      <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium text-gold">
        Read more <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  )
}
