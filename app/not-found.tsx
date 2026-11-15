import Link from 'next/link'
import { ArrowLeft } from '@/components/ui/Icons'

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] items-center overflow-clip pt-16">
      <div className="hero-wash pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="container-page relative">
        <p className="eyebrow">Error 404 · page not found</p>
        <h1 className="mt-4 text-[clamp(4rem,12vw,8rem)] leading-none font-semibold">
          <span className="text-accent">404</span>
        </h1>
        <p className="mt-4 max-w-md text-ink-2">This page moved, or never existed. The rest of the site is right where you left it.</p>
        <Link href="/" className="btn btn-primary mt-8">
          <ArrowLeft size={16} /> Back home
        </Link>
      </div>
    </section>
  )
}
