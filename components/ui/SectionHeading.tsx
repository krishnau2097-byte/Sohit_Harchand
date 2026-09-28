import { RevealText } from './RevealText'
import { ScrambleText } from './ScrambleText'
import { FadeIn } from './FadeIn'

type Props = {
  index: string
  eyebrow: string
  title: string
  intro?: string
  align?: 'left' | 'center'
  className?: string
  id?: string
}

/** Numbered eyebrow (scrambles in) + kinetic title (splitText) + intro line. */
export function SectionHeading({ index, eyebrow, title, intro, align = 'left', className = '', id }: Props) {
  const center = align === 'center'
  return (
    <header className={`${center ? 'mx-auto text-center' : ''} max-w-4xl ${className}`}>
      <p className={`eyebrow flex items-center gap-3 ${center ? 'justify-center' : ''}`}>
        <span className="text-ink-3">{index}</span>
        <span className="h-px w-10 bg-line-strong" aria-hidden="true" />
        <ScrambleText>{eyebrow}</ScrambleText>
      </p>
      <RevealText as="h2" id={id} className="font-wide mt-5 text-[clamp(2.1rem,5.2vw,4.6rem)] text-ink">
        {title}
      </RevealText>
      {intro ? (
        <FadeIn as="p" className={`mt-6 max-w-2xl text-base leading-relaxed text-ink-2 md:text-lg ${center ? 'mx-auto' : ''}`}>
          {intro}
        </FadeIn>
      ) : null}
    </header>
  )
}
