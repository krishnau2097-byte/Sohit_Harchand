import type { Metadata } from 'next'
import { ContactSection } from '@/components/ContactSection'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch about Dynamics 365, Power Platform, Copilot Studio or Azure OpenAI work.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <div className="pt-16">
      <ContactSection headingLevel="h1" />
    </div>
  )
}
