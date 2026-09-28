import type { Metadata } from 'next'
import { ContactSection } from '@/components/home/ContactSection'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch about Power Platform, SharePoint, Dynamics 365 or Copilot work.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <div className="pt-16">
      <ContactSection headingLevel="h1" eyebrow="Contact" />
    </div>
  )
}
