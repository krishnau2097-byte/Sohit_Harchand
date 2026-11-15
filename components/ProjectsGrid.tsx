'use client'

import { useState } from 'react'
import { projectCategories, projects, type ProjectCategory } from '@/content/projects'
import { ProjectCard } from './ProjectCard'

/** Filterable project grid for the Projects page. */
export function ProjectsGrid() {
  const [filter, setFilter] = useState<'All' | ProjectCategory>('All')
  const shown = filter === 'All' ? projects : projects.filter((p) => p.categories.includes(filter))
  const count = (c: ProjectCategory) => projects.filter((p) => p.categories.includes(c)).length

  return (
    <div>
      <div role="group" aria-label="Filter projects" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 sm:flex-wrap">
        {(['All', ...projectCategories] as const).map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={filter === c}
            onClick={() => setFilter(c)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition-colors ${
              filter === c ? 'border-gold bg-gold text-on-gold' : 'border-line bg-surface text-ink-2 hover:border-gold hover:text-gold'
            }`}
          >
            {c}
            <span className="font-mono text-[11px] opacity-70">{c === 'All' ? projects.length : count(c)}</span>
          </button>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {shown.length} projects
      </p>

      <ul key={filter} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p, i) => (
          <li key={p.slug} className="pop-in" style={{ '--d': `${i * 50}ms` } as React.CSSProperties}>
            <ProjectCard project={p} />
          </li>
        ))}
      </ul>
    </div>
  )
}
