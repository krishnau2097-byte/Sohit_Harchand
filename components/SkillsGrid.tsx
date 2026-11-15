'use client'

import { useState } from 'react'
import { skillGroups, type SkillGroupId } from '@/content/skills'
import { SkillIcon } from './ui/Icons'

type Tab = 'all' | SkillGroupId

/**
 * "All" shows one compact card per résumé group; choosing a group expands it
 * into individual skill cards (the reference site's layout), animating in.
 */
export function SkillsGrid() {
  const [tab, setTab] = useState<Tab>('all')
  const group = skillGroups.find((g) => g.id === tab)

  const tabs: { id: Tab; label: string }[] = [{ id: 'all', label: 'All' }, ...skillGroups.map((g) => ({ id: g.id, label: g.label }))]

  return (
    <div>
      <div role="tablist" aria-label="Skill categories" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 sm:flex-wrap sm:justify-center">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            aria-controls="skills-panel"
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm transition-colors ${
              tab === t.id ? 'border-gold bg-gold text-on-gold' : 'border-line bg-surface text-ink-2 hover:border-gold hover:text-gold'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div id="skills-panel" role="tabpanel" className="mt-8">
        {group ? (
          <ul key={group.id} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {group.items.map((item, i) => (
              <li
                key={item}
                className="pop-in card card-hover spotlight flex flex-col items-center gap-2 px-3 py-5 text-center"
                style={{ '--d': `${i * 35}ms` } as React.CSSProperties}
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface-2 text-gold">
                  <SkillIcon name={group.id} size={20} />
                </span>
                <span className="text-sm font-medium text-ink">{item}</span>
                <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-ink-3">{group.label}</span>
              </li>
            ))}
          </ul>
        ) : (
          <ul key="all" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {skillGroups.map((g, i) => (
              <li key={g.id} className="pop-in" style={{ '--d': `${i * 50}ms` } as React.CSSProperties}>
                <button
                  type="button"
                  onClick={() => setTab(g.id)}
                  className="card card-hover spotlight group h-full w-full p-5 text-left"
                  aria-label={`${g.label}: show ${g.items.length} skills`}
                >
                  <span className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface-2 text-gold transition-transform duration-300 group-hover:-rotate-6">
                      <SkillIcon name={g.id} size={20} />
                    </span>
                    <span className="font-semibold text-ink">{g.label}</span>
                    <span className="ml-auto font-mono text-xs text-ink-3">{g.items.length}</span>
                  </span>
                  <span className="mt-4 flex flex-wrap gap-1.5">
                    {g.items.map((item) => (
                      <span key={item} className="chip">
                        {item}
                      </span>
                    ))}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
