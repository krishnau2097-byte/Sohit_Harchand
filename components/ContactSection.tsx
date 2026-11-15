import { profile } from '@/content/profile'
import { ContactForm } from './ContactForm'
import { SectionHeading } from './ui/SectionHeading'
import { LocalTime } from './ui/LocalTime'
import { Linkedin, Mail, Pin } from './ui/Icons'

/** "Let's Connect": heading, direct contact details and the form. */
export function ContactSection({ headingLevel = 'h2' }: { headingLevel?: 'h1' | 'h2' }) {
  const linkedin = profile.socials.find((s) => s.label === 'LinkedIn')
  const details = [
    { icon: <Mail size={18} />, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    ...(linkedin ? [{ icon: <Linkedin size={18} />, label: 'LinkedIn', value: linkedin.handle, href: linkedin.href }] : []),
    { icon: <Pin size={18} />, label: 'Based in', value: profile.location },
  ]

  return (
    <section id="contact" aria-labelledby="contact-title" className="section">
      <div className="container-page">
        <SectionHeading
          as={headingLevel}
          id="contact-title"
          eyebrow="Contact"
          title="Let's"
          accent="Connect"
          intro="Ready to discuss your next Dynamics 365, Power Platform or AI agent project? Let's talk!"
        />

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <ul data-reveal="" className="space-y-3">
            {details.map((d) => (
              <li key={d.label}>
                {d.href ? (
                  <a
                    href={d.href}
                    target={d.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="card card-hover spotlight group flex items-center gap-4 p-4"
                  >
                    <DetailBody {...d} />
                  </a>
                ) : (
                  <div className="card flex items-center gap-4 p-4">
                    <DetailBody {...d} />
                  </div>
                )}
              </li>
            ))}
            <li className="card flex items-center justify-between gap-4 p-4 text-sm">
              <span className="text-ink-3">My local time</span>
              <span className="text-ink">
                <LocalTime timeZone={profile.timeZone} />
              </span>
            </li>
          </ul>
          <div data-reveal="" style={{ '--d': '100ms' } as React.CSSProperties}>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}

function DetailBody({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface-2 text-gold">{icon}</span>
      <span className="min-w-0">
        <span className="block text-xs text-ink-3">{label}</span>
        <span className="block truncate text-sm font-medium text-ink group-hover:text-gold">{value}</span>
      </span>
    </>
  )
}
