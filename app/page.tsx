import Link from 'next/link'
import { Hero } from '@/components/home/Hero'
import { SkillsGrid } from '@/components/SkillsGrid'
import { ExperienceList } from '@/components/ExperienceList'
import { ProjectCard } from '@/components/ProjectCard'
import { ContactSection } from '@/components/ContactSection'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ArrowRight } from '@/components/ui/Icons'
import { featuredProjects, projects } from '@/content/projects'

export default function Home() {
  return (
    <>
      <Hero />

      <section id="skills" aria-labelledby="skills-title" className="section border-t border-line bg-bg-2">
        <div className="container-page">
          <SectionHeading
            id="skills-title"
            eyebrow="What I work with"
            title="Skills &"
            accent="Expertise"
            intro="Dynamics 365 CE and Power Platform solutions extended with C#/.NET plugins, PCF controls, Azure integrations and Copilot Studio / Azure OpenAI agents. Pick a category to explore."
          />
          <div className="mt-10">
            <SkillsGrid />
          </div>
        </div>
      </section>

      <section id="experience" aria-labelledby="experience-title" className="section">
        <div className="container-page">
          <SectionHeading id="experience-title" eyebrow="Career" title="Professional" accent="Experience" />
          <div className="mx-auto mt-12 max-w-4xl">
            <ExperienceList showEducation={false} />
          </div>
        </div>
      </section>

      <section id="work" aria-labelledby="work-title" className="section border-y border-line bg-bg-2">
        <div className="container-page">
          <SectionHeading
            id="work-title"
            eyebrow="Selected work"
            title="Featured"
            accent="Projects"
            intro="CRM platforms, AI agents and migration tooling built on Dynamics 365, Power Platform and Azure."
          />
          <ul className="mt-12 grid gap-4 md:grid-cols-2">
            {featuredProjects.map((p, i) => (
              <li key={p.slug} data-reveal="" style={{ '--d': `${i * 70}ms` } as React.CSSProperties}>
                <ProjectCard project={p} />
              </li>
            ))}
          </ul>
          <div data-reveal="" className="mt-10 text-center">
            <Link href="/projects" className="btn btn-ghost">
              View all {projects.length} projects <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  )
}
