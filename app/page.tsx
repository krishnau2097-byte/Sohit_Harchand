import { Hero } from '@/components/home/Hero'
import { ScrollStory } from '@/components/home/ScrollStory'
import { Skills } from '@/components/home/Skills'
import { Timeline } from '@/components/home/Timeline'
import { CaseStudy } from '@/components/home/CaseStudy'
import { Work } from '@/components/home/Work'
import { Proof } from '@/components/home/Proof'
import { ContactSection } from '@/components/home/ContactSection'

export default function Home() {
  return (
    <>
      <Hero />
      <ScrollStory />
      <Skills />
      <Timeline />
      <CaseStudy />
      <Work />
      <Proof />
      <ContactSection />
    </>
  )
}
