import type { Metadata } from 'next'
import Link from 'next/link'
import { profile, stats } from '@/content/profile'
import { skills, skillCategories } from '@/content/skills'
import { AboutTabs } from '@/components/about/AboutTabs'
import { Monogram } from '@/components/home/Monogram'
import { Counters } from '@/components/ui/Counters'
import { Marquee } from '@/components/ui/Marquee'
import { FadeIn } from '@/components/ui/FadeIn'
import { RevealText } from '@/components/ui/RevealText'
import { ScrambleText } from '@/components/ui/ScrambleText'
import { ArrowUpRight, Download } from '@/components/ui/Icons'

export const metadata: Metadata = {
  title: 'About',
  description: profile.pitch,
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-clip pt-36 pb-20 md:pt-44">
        <div className="blinds pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-[1440px] gap-12 px-5 md:px-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow">
              <ScrambleText>About me</ScrambleText>
            </p>
            <RevealText as="h1" trigger="loader" className="font-wide mt-6 text-[clamp(2.8rem,7vw,6.5rem)] text-ink">
              The long version.
            </RevealText>
            <FadeIn items=".a-p" className="mt-10 max-w-2xl space-y-5 text-lg leading-relaxed text-ink-2">
              {profile.about.map((p) => (
                <p key={p.slice(0, 24)} className="a-p">
                  {p}
                </p>
              ))}
            </FadeIn>
            <FadeIn items=".a-btn" delay={300} className="mt-10 flex flex-wrap items-center gap-3">
              <span className="a-btn chip border-emerald-400/40 text-ink">
                <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" /> {profile.availability.label}
              </span>
              {profile.resumeUrl ? (
                <a href={profile.resumeUrl} download className="a-btn btn btn-primary">
                  Download résumé <Download size={16} />
                </a>
              ) : (
                <Link href="/projects" className="a-btn btn btn-primary">
                  See my projects <ArrowUpRight size={16} />
                </Link>
              )}
              <Link href="/contact" className="a-btn btn btn-ghost">
                Get in touch <ArrowUpRight size={16} />
              </Link>
            </FadeIn>
          </div>
          <FadeIn className="relative lg:col-span-4 lg:col-start-9" y={40}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line-strong bg-gradient-to-b from-surface-2 via-surface to-bg shadow-2xl flex items-end justify-center pt-8">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(217,164,65,0.14),transparent_65%)] pointer-events-none" />
              <Monogram idPrefix="about" className="relative mx-auto mb-[8%] h-[82%]" />
              <p className="font-wide absolute top-6 left-6 text-6xl text-gold/20 select-none pointer-events-none">{profile.initials}</p>
              <p className="absolute right-5 bottom-5 chip border-line-strong bg-bg/80 backdrop-blur">{profile.location}</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Skills marquee — scrolling skill tags inspired by the reference site */}
      <section className="overflow-clip border-y border-line bg-bg-2 py-7" aria-label="Skills overview">
        <Marquee speed={50}>
          {skills.map((s) => (
            <span key={s.name} className="flex items-center gap-3 pr-6">
              <span className="chip border-line-strong bg-surface/80 backdrop-blur-sm transition-colors hover:border-gold hover:text-gold">
                <span className="h-2 w-2 rounded-full" style={{ background: skillCategories[s.category].tone }} aria-hidden="true" />
                <span className="font-wide text-sm text-gold">{s.symbol}</span>
                {s.name}
              </span>
            </span>
          ))}
        </Marquee>
        <Marquee speed={60} reverse className="mt-4">
          {[...skills].reverse().map((s) => (
            <span key={s.name} className="flex items-center gap-6 pr-6">
              <span className="font-serif text-lg whitespace-nowrap text-ink-3 italic transition-colors hover:text-gold">
                {s.name}
              </span>
              <span className="text-xs text-gold" aria-hidden="true">✦</span>
            </span>
          ))}
        </Marquee>
      </section>

      <section className="border-y border-line bg-bg-2 py-16 md:py-20" aria-label="Career numbers">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <Counters stats={stats} />
        </div>
      </section>

      {/* Editorial feature: monogram and philosophy */}
      <section className="py-20 md:py-28" aria-label="Perspective and philosophy">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <div className="card relative overflow-hidden p-8 md:p-14 lg:p-16">
            <div className="grid items-center gap-10 lg:grid-cols-12">
              <div className="relative aspect-[3/4] max-h-[520px] overflow-hidden rounded-[1.5rem] border border-line-strong shadow-xl lg:col-span-5 bg-gradient-to-b from-surface-2 via-surface to-bg flex items-end justify-center p-4">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,164,65,0.12),transparent_70%)] pointer-events-none" />
                <Monogram idPrefix="about-feature" className="relative mx-auto mb-[14%] h-[80%] transition-transform duration-700 hover:scale-105" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
                <p className="absolute bottom-4 left-4 right-4 font-mono text-[11px] tracking-wider text-white/90 uppercase backdrop-blur-md bg-black/60 px-3.5 py-2 rounded-full border border-white/20 text-center">
                  ✦ Dev → UAT → Production
                </p>
              </div>
              <div className="lg:col-span-7 lg:pl-6">
                <p className="eyebrow">Philosophy & Craft</p>
                <h2 className="font-wide mt-4 text-[clamp(2rem,4vw,3.4rem)] text-ink leading-tight">
                  Precision in every layer. Purpose in every build.
                </h2>
                <div className="mt-6 space-y-4 text-base md:text-lg leading-relaxed text-ink-2">
                  <p>
                    Business rules belong in the platform, not in people&apos;s heads: Business Process Flows, role-based security, C#/.NET plugins and PCF controls keep Dynamics 365 and Dataverse doing the right thing every time.
                  </p>
                  <p>
                    Copilot Studio and Azure OpenAI agents get clear instructions, trigger descriptions and a full test suite, and every solution ships through Azure DevOps pipelines from Dev to UAT to Production.
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <span className="chip border-line-strong bg-surface">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Solution Management & ALM
                  </span>
                  <span className="chip border-line-strong bg-surface">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Role-based security
                  </span>
                  <span className="chip border-line-strong bg-surface">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Azure DevOps CI/CD
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="py-24 md:py-32" aria-labelledby="about-tabs-title">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <h2 id="about-tabs-title" className="sr-only">
            Skills, experience and education
          </h2>
          <AboutTabs />
        </div>
      </section>
    </>
  )
}
