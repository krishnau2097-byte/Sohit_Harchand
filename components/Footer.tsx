import Link from 'next/link'
import { nav, profile } from '@/content/profile'
import { FadeIn } from './ui/FadeIn'
import { RevealText } from './ui/RevealText'
import { ArrowUpRight } from './ui/Icons'
import { LocalTime } from './ui/LocalTime'
import { RollText } from './ui/RollText'
import { FooterStoryName } from './FooterStoryName'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative overflow-x-clip border-t border-line bg-bg-2">
      <div className="blinds pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1440px] px-5 pt-20 pb-8 md:px-10">
        <FadeIn className="grid gap-12 md:grid-cols-12" items=".f-col">
          <div className="f-col md:col-span-5">
            <p className="eyebrow">Next step</p>
            <p className="font-serif mt-4 text-4xl leading-tight text-ink italic md:text-5xl">
              Have a process that deserves better software?
            </p>
            <Link href="/contact" className="btn btn-primary mt-8">
              Start a conversation <ArrowUpRight size={16} />
            </Link>
          </div>
          <nav aria-label="Footer" className="f-col md:col-span-2 md:col-start-7">
            <p className="eyebrow mb-4">Pages</p>
            <ul className="space-y-2">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-ink-2 transition-colors hover:text-gold">
                    <RollText>{n.label}</RollText>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="f-col md:col-span-2">
            <p className="eyebrow mb-4">Elsewhere</p>
            <ul className="space-y-2">
              {profile.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-ink-2 transition-colors hover:text-gold">
                    <RollText>{s.label}</RollText> <ArrowUpRight size={13} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="f-col md:col-span-2">
            <p className="eyebrow mb-4">Local time</p>
            <p className="text-ink-2">
              <LocalTime timeZone={profile.timeZone} />
            </p>
            <p className="mt-1 text-sm text-ink-3">{profile.location}</p>
          </div>
        </FadeIn>

        {/* Storytelling Name Reveal & Signature */}
        <FooterStoryName />

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 text-xs text-ink-3 md:flex-row md:items-center">
          <p>
            © {year} {profile.initials}. All rights reserved.
          </p>
          <p className="font-mono tracking-wider uppercase">Built with Next.js · Anime.js · Three.js</p>
        </div>
      </div>
    </footer>
  )
}
