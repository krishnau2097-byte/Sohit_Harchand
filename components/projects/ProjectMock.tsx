import type { Project } from '@/content/projects'
import { projectImage } from '@/lib/projectMock'

/** Project screenshot (real image when provided, generated mock-up otherwise). */
export function ProjectMock({ project, className = '', priority = false }: { project: Project; className?: string; priority?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={projectImage(project)}
      alt={`${project.title} interface preview`}
      width={1600}
      height={1000}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      className={`block h-auto w-full select-none ${className}`}
    />
  )
}
