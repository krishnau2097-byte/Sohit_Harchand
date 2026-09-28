import type { MetadataRoute } from 'next'
import { site } from '@/content/profile'
import { projects } from '@/content/projects'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const pages = ['', '/about', '/projects', '/contact'].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1 : 0.8,
  }))
  const work = projects.map((p) => ({
    url: `${site.url}/projects/${p.slug}`,
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }))
  return [...pages, ...work]
}
