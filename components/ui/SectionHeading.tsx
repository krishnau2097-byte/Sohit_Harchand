type Props = {
  eyebrow: string
  /** Rendered before the accent word. */
  title: string
  /** The highlighted word(s) at the end of the title, e.g. "Expertise". */
  accent?: string
  intro?: string
  align?: 'left' | 'center'
  as?: 'h1' | 'h2'
  id?: string
}

/** Eyebrow + title with one gradient accent word + intro, in the reference site's centred style. */
export function SectionHeading({ eyebrow, title, accent, intro, align = 'center', as: Tag = 'h2', id }: Props) {
  const center = align === 'center'
  // A page title (h1) is above the fold: animate it with CSS on first paint, not on scroll.
  const reveal = Tag === 'h1' ? { className: 'rise' } : { 'data-reveal': '', className: '' }
  return (
    <header data-reveal={reveal['data-reveal']} className={`${reveal.className} max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      <p className="eyebrow">{eyebrow}</p>
      <Tag id={id} className={`mt-3 font-semibold text-ink ${Tag === 'h1' ? 'text-[clamp(2rem,1.4rem+2.6vw,3rem)] leading-[1.1]' : 'text-[clamp(1.6rem,1.2rem+1.6vw,2.25rem)] leading-tight'}`}>
        {title} {accent ? <span className="text-accent">{accent}</span> : null}
      </Tag>
      {intro ? <p className="mt-4 leading-relaxed text-ink-2">{intro}</p> : null}
    </header>
  )
}
