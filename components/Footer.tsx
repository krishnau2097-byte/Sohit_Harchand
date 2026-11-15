import Link from 'next/link'
import { nav, profile, services } from '@/content/profile'
import { Signature } from './ui/Signature'
import { LocalTime } from './ui/LocalTime'
import { Linkedin, Mail } from './ui/Icons'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-line bg-bg-2">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr_0.9fr]">
        <div>
          <Link href="/" aria-label="Home" className="group inline-flex">
            <Signature id="footer" size={44} />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-2">
            {profile.role} · {profile.headline}. Delivering CRM, automation and AI agent solutions on the Microsoft stack.
          </p>
          <div className="mt-4 flex gap-1">
            {profile.socials.map((s) => (
              <a key={s.label} href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" aria-label={s.label} className="icon-btn">
                {s.label === 'LinkedIn' ? <Linkedin /> : <Mail />}
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Footer">
          <p className="eyebrow mb-4">Navigation</p>
          <ul className="space-y-2 text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-ink-2 transition-colors hover:text-gold">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="eyebrow mb-4">Services</p>
          <ul className="space-y-2 text-sm text-ink-2">
            {services.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Local time</p>
          <p className="text-sm text-ink-2">
            <LocalTime timeZone={profile.timeZone} />
          </p>
          <p className="mt-1 text-sm text-ink-3">{profile.location}</p>
        </div>
      </div>

      <div className="container-page flex flex-col gap-2 border-t border-line py-6 text-xs text-ink-3 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {profile.monogram}. All rights reserved.
        </p>
        <p>Built with Next.js &amp; Tailwind CSS</p>
      </div>
    </footer>
  )
}
