import Link from 'next/link'
import { RevealText } from '@/components/ui/RevealText'
import { ScrambleText } from '@/components/ui/ScrambleText'
import { ArrowLeft } from '@/components/ui/Icons'

export default function NotFound() {
  return (
    <section className="relative flex min-h-svh items-center overflow-clip">
      <div className="blinds pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-[1440px] px-5 md:px-10">
        <p className="eyebrow">
          <ScrambleText>Error 404 · page not found</ScrambleText>
        </p>
        <RevealText as="h1" trigger="mount" className="font-wide mt-6 text-[clamp(6rem,24vw,22rem)] leading-[0.8] text-gold">
          404
        </RevealText>
        <p className="font-serif mt-6 max-w-xl text-2xl text-ink italic">This page moved, or never existed. The rest of the site is right where you left it.</p>
        <Link href="/" className="btn btn-primary mt-10">
          <ArrowLeft size={16} /> Back home
        </Link>
      </div>
    </section>
  )
}
