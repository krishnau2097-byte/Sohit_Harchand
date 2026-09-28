'use client'

import Link from 'next/link'
import { animate, createTimeline, onScroll, stagger, svg, utils } from 'animejs'
import { story } from '@/content/story'
import { useAnimeScope } from '@/hooks/useAnimeScope'
import { scrollToTarget } from '../providers/SmoothScroll'
import { ArrowUpRight } from '../ui/Icons'
import { StoryArt } from './StoryArt'

const wipe = ['inset(0% 0% 0% 0%)', 'inset(0% 0% 100% 0%)']

/**
 * Pinned scroll story (the "image and text change on scroll" effect).
 * A 270vh section holds a sticky 100vh stage; one Anime.js timeline is
 * scrubbed by onScroll({ sync: true }) so chapter images wipe away with a
 * clip-path while text lines slide out and the next chapter's lines slide in.
 * Phones get stacked cards instead of a pin.
 */
export function ScrollStory() {
  const { root } = useAnimeScope<HTMLElement>(({ root, matches, reduced }) => {
    if (reduced) return

    if (matches.mobile) {
      root.querySelectorAll<HTMLElement>('.story-card').forEach((card) => {
        const observer = () => onScroll({ target: card, enter: '85% top', repeat: false })
        utils.set(card.querySelectorAll('.line'), { opacity: 0, y: 30 })
        animate(card.querySelector('.story-card-art')!, { clipPath: ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'], duration: 1100, ease: 'inOut(4)', autoplay: observer() })
        animate(card.querySelectorAll('.line'), { opacity: 1, y: 0, duration: 900, delay: stagger(80, { start: 250 }), ease: 'out(4)', autoplay: observer() })
      })
      return
    }

    const stage = root.querySelector<HTMLElement>('.story-pin')!
    const nums = Array.from(root.querySelectorAll<HTMLElement>('.story-num'))
    let active = -1
    const setActive = (p: number) => {
      const i = p < 0.37 ? 0 : p < 0.7 ? 1 : 2
      if (i === active) return
      active = i
      nums.forEach((n, k) => n.toggleAttribute('data-active', k === i))
    }

    // Starting states for chapters 2 and 3 and the animated art parts.
    utils.set(stage.querySelectorAll('.story-txt-1 .line, .story-txt-2 .line'), { opacity: 0, y: 50 })
    utils.set(stage.querySelectorAll('.build-win'), { opacity: 0, x: 60 })
    utils.set(stage.querySelectorAll('.deliver-bar'), { scaleY: 0 })
    utils.set(stage.querySelectorAll('.deliver-card, .deliver-area'), { opacity: 0 })
    utils.set(stage.querySelectorAll('.deliver-dot'), { scale: 0 })

    const line = svg.createDrawable(stage.querySelectorAll('.deliver-line'))
    utils.set(line, { draw: '0 0' })

    createTimeline({
      defaults: { ease: 'inOut(2)' },
      autoplay: onScroll({
        target: root.querySelector<HTMLElement>('.story-desktop')!,
        enter: 'top top',
        leave: 'bottom bottom',
        sync: true,
        onUpdate: (o) => setActive(o.progress),
      }),
    })
      .add('.story-progress-fill', { scaleY: [0, 1], duration: 3000, ease: 'linear' }, 0)
      .add('.story-desktop .who-orbit', { rotate: [0, 100], duration: 1500, ease: 'linear' }, 0)
      // Chapter 1 → 2
      .add('.story-img-0', { clipPath: wipe, duration: 600 }, 800)
      .add('.story-img-1 .story-art', { scale: [1.18, 1], duration: 800 }, 800)
      .add('.story-txt-0 .line', { y: [0, -50], opacity: [1, 0], duration: 350, delay: stagger(40) }, 800)
      .add('.story-txt-1 .line', { y: [50, 0], opacity: [0, 1], duration: 400, delay: stagger(50) }, 1050)
      .add('.story-desktop .build-win', { x: [60, 0], opacity: [0, 1], duration: 420, delay: stagger(90) }, 1000)
      .add('.story-desktop .build-spark', { rotate: [0, 180], scale: [0.4, 1], duration: 800 }, 1000)
      // Chapter 2 → 3
      .add('.story-img-1', { clipPath: wipe, duration: 600 }, 1800)
      .add('.story-img-2 .story-art', { scale: [1.18, 1], duration: 800 }, 1800)
      .add('.story-txt-1 .line', { y: [0, -50], opacity: [1, 0], duration: 350, delay: stagger(40) }, 1800)
      .add('.story-txt-2 .line', { y: [50, 0], opacity: [0, 1], duration: 400, delay: stagger(50) }, 2050)
      .add('.story-desktop .deliver-bar', { scaleY: [0, 1], duration: 420, delay: stagger(45) }, 2000)
      .add(line, { draw: ['0 0', '0 1'], duration: 600 }, 2100)
      .add('.story-desktop .deliver-area', { opacity: [0, 1], duration: 400 }, 2350)
      .add('.story-desktop .deliver-dot', { scale: [0, 1], duration: 200, ease: 'out(3)' }, 2650)
      .add('.story-desktop .deliver-card', { y: [-20, 0], opacity: [0, 1], duration: 320, delay: stagger(90) }, 2250)

    setActive(0)
  })

  const goTo = (i: number) => {
    const el = root.current?.querySelector<HTMLElement>('.story-desktop')
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const dist = el.offsetHeight - window.innerHeight
    scrollToTarget(top + dist * [0.08, 0.52, 0.95][i])
  }

  return (
    <section id="story" ref={root} aria-labelledby="story-title" className="relative bg-bg">
      <h2 id="story-title" className="sr-only">
        My story
      </h2>

      {/* Desktop: pinned stage */}
      <div className="story-desktop pin-wrap relative hidden h-[270vh] md:block">
        <div className="story-pin pin-stage sticky top-0 h-svh overflow-hidden">
          <div className="mx-auto grid h-full max-w-[1440px] grid-cols-12 items-center gap-8 px-10">
            <div className="col-span-12 flex items-center justify-between self-end pt-24 motion-off:hidden">
              <p className="eyebrow">01 — The story</p>
              <p className="font-mono text-xs text-ink-3">Scroll to move through</p>
            </div>

            <div className="relative col-span-6 aspect-[4/5] h-[64vh] max-w-full self-start justify-self-center overflow-hidden rounded-[2rem] border border-line bg-surface shadow-[var(--shadow)] motion-off:aspect-auto motion-off:h-auto motion-off:space-y-6 motion-off:overflow-visible motion-off:border-0 motion-off:bg-transparent">
              {story.map((c, i) => (
                <figure
                  key={c.id}
                  className={`story-img story-img-${i} absolute inset-0 overflow-hidden motion-off:relative motion-off:aspect-[4/5] motion-off:rounded-[2rem]`}
                  style={{ zIndex: 10 - i }}
                >
                  <div className="story-art h-full w-full">
                    <StoryArt kind={c.art} idPrefix={`d${i}`} />
                  </div>
                  <figcaption className="absolute bottom-5 left-5 chip border-line-strong bg-bg/70 font-mono text-[11px] tracking-wider text-ink backdrop-blur">
                    0{i + 1} · {c.caption}
                  </figcaption>
                </figure>
              ))}
            </div>

            <div className="relative col-span-5 col-start-7 h-[64vh] self-start pr-10 motion-off:h-auto motion-off:space-y-16 xl:pr-16">
              {story.map((c, i) => (
                <div key={c.id} className={`story-txt story-txt-${i} absolute inset-0 flex flex-col justify-center motion-off:relative`}>
                  <p className="line eyebrow">
                    0{i + 1} — {c.kicker}
                  </p>
                  <h3 className="line font-wide mt-5 text-[clamp(2rem,3.3vw,3.2rem)] text-ink">{c.title}</h3>
                  <div className="mt-6 space-y-2">
                    {c.lines.map((l) => (
                      <p key={l} className="line text-lg leading-relaxed text-ink-2">
                        {l}
                      </p>
                    ))}
                  </div>
                  {i === story.length - 1 ? (
                    <p className="line mt-8">
                      <Link href="/about" className="btn btn-ghost">
                        The full story <ArrowUpRight size={16} />
                      </Link>
                    </p>
                  ) : null}
                </div>
              ))}
            </div>

            <nav aria-label="Story chapters" className="absolute top-1/2 right-6 flex -translate-y-1/2 items-stretch gap-4 motion-off:hidden">
              <div className="relative w-px bg-line">
                <span className="story-progress-fill absolute inset-0 origin-top bg-gold" />
              </div>
              <ol className="flex flex-col justify-between gap-6 py-1">
                {story.map((c, i) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      className="story-num font-mono text-xs text-ink-3 transition-colors hover:text-ink data-[active]:text-gold"
                      aria-label={`Chapter ${i + 1}: ${c.kicker}`}
                    >
                      0{i + 1}
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* Phones: stacked chapter cards */}
      <div className="space-y-16 px-5 py-24 md:hidden">
        <p className="eyebrow">01 — The story</p>
        {story.map((c, i) => (
          <article key={c.id} className="story-card">
            <div className="story-card-art relative aspect-[4/5] overflow-hidden rounded-3xl border border-line">
              <StoryArt kind={c.art} idPrefix={`m${i}`} />
              <span className="absolute bottom-4 left-4 chip bg-bg/70 font-mono text-[10px]">
                0{i + 1} · {c.caption}
              </span>
            </div>
            <p className="line eyebrow mt-6">
              0{i + 1} — {c.kicker}
            </p>
            <h3 className="line font-wide mt-3 text-3xl text-ink">{c.title}</h3>
            {c.lines.map((l) => (
              <p key={l} className="line mt-2 leading-relaxed text-ink-2">
                {l}
              </p>
            ))}
          </article>
        ))}
        <Link href="/about" className="btn btn-ghost">
          The full story <ArrowUpRight size={16} />
        </Link>
      </div>
    </section>
  )
}
