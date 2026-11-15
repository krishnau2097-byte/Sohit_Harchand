'use client'

import { animate, onScroll } from 'animejs'
import type { Project } from '@/content/projects'
import { useAnimeScope } from '@/hooks/useAnimeScope'
import { ProjectMock } from './ProjectMock'

/** Full-width screenshot that unmasks and settles as it scrolls into view. */
export function ProjectHeroShot({ project }: { project: Project }) {
  const { root } = useAnimeScope<HTMLDivElement>(({ root, reduced }) => {
    if (reduced) return
    const frame = root.querySelector<HTMLElement>('.shot-frame')!
    const img = root.querySelector<HTMLElement>('.shot-img')!
    const sync = () => onScroll({ target: root, enter: 'bottom top', leave: 'center center', sync: true })
    animate(frame, { clipPath: ['inset(4% 4% 0% 4% round 32px)', 'inset(0% 0% 0% 0% round 32px)'], ease: 'linear', autoplay: sync() })
    animate(img, { scale: [1.06, 1], ease: 'linear', autoplay: sync() })
  })

  return (
    <div ref={root} className="mx-auto max-w-[1440px] px-5 md:px-10">
      <div className="shot-frame rounded-[2rem] border border-line bg-surface p-2.5 shadow-[var(--shadow)] md:p-4">
        <div className="overflow-hidden rounded-[1.4rem] border border-line">
          <div className="shot-img">
            <ProjectMock project={project} priority />
          </div>
        </div>
      </div>
    </div>
  )
}
