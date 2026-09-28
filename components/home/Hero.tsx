'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import {
  animate,
  createAnimatable,
  createScope,
  createTimeline,
  createTimer,
  onScroll,
  scrambleText,
  splitText,
  stagger,
  utils,
  type Scope,
} from 'animejs'
import { profile } from '@/content/profile'
import { isReducedMotion, mediaQueries, onLoaderDone } from '@/lib/motion'
import { scrollToTarget } from '../providers/SmoothScroll'
import { Magnetic } from '../ui/Magnetic'
import { Marquee } from '../ui/Marquee'
import { ArrowDown, Download } from '../ui/Icons'
import { Portrait } from './Portrait'

const HeroObject3D = dynamic(() => import('./HeroObject3D'), { ssr: false })

/** Where the head starts inside the portrait artwork (0 = top). Perfectly calibrated for the cutout photo. */
const HEAD_TOP = 0.04

/**
 * Hero from the reference pin: blind-shadow backdrop → giant gold word →
 * cutout portrait → copy. The word cycles with scrambleText, layers move at
 * different depths with the mouse, and on scroll the whole dark card shrinks
 * and lifts away to reveal the gold manifesto block beneath it.
 */
export function Hero() {
  const wrapRef = useRef<HTMLElement>(null)
  const [show3D, setShow3D] = useState(false)

  useEffect(() => {
    const wrap = wrapRef.current!
    const words = profile.heroWords

    const scope: Scope = createScope({ root: wrap, mediaQueries }).add((self) => {
      const { mobile, fine } = (self as Scope).matches
      const reduced = isReducedMotion()
      const card = wrap.querySelector<HTMLElement>('.hero-card')!
      // Every art layer exists twice: on the page and inside the lens.
      const allWords = Array.from(wrap.querySelectorAll<HTMLElement>('.giant-word'))
      const boxes = Array.from(wrap.querySelectorAll<HTMLElement>('.giant-box'))
      const portraits = Array.from(wrap.querySelectorAll<HTMLElement>('.hero-portrait-wrap'))
      const word = allWords[0]
      const box = boxes[0]
      const slot = wrap.querySelector<HTMLElement>('.giant-slot')!
      const lens = wrap.querySelector<HTMLElement>('.hero-lens')!

      /* 1 · Layout: fit the widest word to the width, park it in its slot
         between the top row and the copy, and size the portrait so the head
         overlaps the letters (the text-behind-subject trick). */
      const fit = () => {
        const probe = document.createElement('span')
        probe.className = word.className
        probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font-size:100px;left:-9999px;top:0'
        document.body.appendChild(probe)
        let max = 0
        words.forEach((w) => {
          probe.textContent = w
          max = Math.max(max, probe.getBoundingClientRect().width)
        })
        probe.remove()
        const cardH = card.clientHeight
        const byWidth = (box.clientWidth * (mobile ? 0.96 : 0.94)) / max
        const size = Math.min(byWidth * 100, cardH * (mobile ? 0.16 : 0.24))
        allWords.forEach((w) => (w.style.fontSize = `${size}px`))
        const wordH = word.offsetHeight
        slot.style.height = `${wordH}px`
        const top = slot.getBoundingClientRect().top - card.getBoundingClientRect().top
        boxes.forEach((b) => (b.style.top = `${top}px`))
        const headAt = top + wordH * (mobile ? 0.55 : 0.3)
        const h = Math.min(cardH * 0.9, (cardH - headAt) / (1 - HEAD_TOP))
        portraits.forEach((p) => (p.style.height = `${Math.max(cardH * 0.45, h)}px`))
      }
      // Measure without transforms from the scroll timeline getting in the way.
      const safeFit = () => {
        const prev = card.style.transform
        card.style.transform = 'none'
        fit()
        card.style.transform = prev
      }
      safeFit()
      document.fonts?.ready.then(safeFit)
      window.addEventListener('resize', safeFit)
      const cleanups: (() => void)[] = [
        () => window.removeEventListener('resize', safeFit),
      ]

      if (reduced) return () => cleanups.forEach((c) => c())

      /* 2 · Entrance, played when the loader's curtain lifts. */
      const name = splitText('.hero-name', { chars: { wrap: 'clip' } })
      utils.set(name.chars, { y: '110%' })
      utils.set('.hero-intro', { opacity: 1 })
      utils.set('.hero-fade', { opacity: 0, y: 28 })
      utils.set('.hero-portrait', { opacity: 0, y: 90, scale: 1.05 })
      utils.set('.hero-blinds', { opacity: 0 })
      utils.set('.hero-pill', { opacity: 0, y: -16 })
      utils.set(allWords, { opacity: 0 })

      let index = 0
      const cycle = createTimer({
        duration: 3400,
        loop: true,
        autoplay: false,
        onLoop: () => {
          if (wrap.getBoundingClientRect().bottom < window.innerHeight * 0.5 || document.hidden) return
          index = (index + 1) % words.length
          animate(allWords, { innerHTML: scrambleText({ text: words[index], chars: 'A-Z', settleDuration: 380, revealRate: 28, from: 'center' }) })
        },
      })

      const intro = createTimeline({ autoplay: false, defaults: { ease: 'out(4)' }, onComplete: () => cycle.play() })
        .add('.hero-blinds', { opacity: 1, duration: 1800, ease: 'out(2)' }, 0)
        .add(allWords, { innerHTML: scrambleText({ text: words[0], chars: 'A-Z', override: '', settleDuration: 420, revealRate: 22, from: 'center' }) }, 0)
        .add(allWords, { scale: [1.12, 1], opacity: [0, 1], duration: 1400 }, 0)
        .add('.hero-portrait', { opacity: 1, y: 0, scale: 1, duration: 1500 }, 180)
        .add(name.chars, { y: ['110%', '0%'], duration: 1000, delay: stagger(28) }, 380)
        .add('.hero-pill', { opacity: 1, y: 0, duration: 900 }, 300)
        .add('.hero-fade', { opacity: 1, y: 0, duration: 1000, delay: stagger(70) }, 520)
      cleanups.push(
        onLoaderDone(() => {
          intro.play()
          if (!mobile) {
            const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 600))
            idle(() => setShow3D(true))
          }
        }),
      )

      animate('.cue-arrow', { y: [0, 8], duration: 900, loop: true, alternate: true, ease: 'inOut(2)' })

      /* 3 · Mouse parallax: each layer moves at its own depth. */
      if (fine && !mobile) {
        const layers: [string, number][] = [
          ['.hero-blinds', 14],
          ['.giant-box', 26],
          ['.hero-portrait-wrap', 44],
          ['.hero-object', -70],
        ]
        const movers = layers.map(([sel, depth]) => ({ a: createAnimatable(sel, { x: 1400, y: 1400, ease: 'out(3)' }), depth }))
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5
          const ny = e.clientY / window.innerHeight - 0.5
          movers.forEach(({ a, depth }) => {
            a.x(-nx * depth)
            a.y(-ny * depth * 0.6)
          })
        }
        card.addEventListener('pointermove', onMove)
        cleanups.push(() => card.removeEventListener('pointermove', onMove))
      }

      /* 4 · Lens: a circle under the cursor shows the hero in the other
         theme (and a hidden note). It shrinks away over text and buttons so
         the copy stays readable; pressing the mouse opens it wider. On touch
         screens it drifts on its own. */
      {
        let tx = card.clientWidth * 0.62
        let ty = card.clientHeight * 0.4
        let cx = tx
        let cy = ty
        let r = 0
        let tr = 0
        let base = 150
        let inside = false
        let t0 = performance.now()
        let raf = 0
        const auto = !fine
        const toLocal = (e: PointerEvent) => {
          const rect = card.getBoundingClientRect()
          const k = rect.width / card.offsetWidth || 1
          return [(e.clientX - rect.left) / k, (e.clientY - rect.top) / k] as const
        }
        const onMove = (e: PointerEvent) => {
          if (e.pointerType !== 'mouse') return
          ;[tx, ty] = toLocal(e)
          inside = true
          const overCopy = (e.target as HTMLElement).closest('.hero-content a, .hero-content button, .hero-content h1, .hero-content p, .hero-content li')
          const speed = Math.hypot(e.movementX, e.movementY)
          tr = overCopy ? 0 : base + Math.min(60, speed * 1.5)
        }
        const onLeave = () => {
          inside = false
          tr = 0
        }
        const onDown = () => {
          base = 250
          tr = inside ? base : 0
        }
        const onUp = () => {
          base = 150
          tr = inside ? base : 0
        }
        const tick = (now: number) => {
          raf = requestAnimationFrame(tick)
          if (window.scrollY > window.innerHeight * 1.2) return
          if (auto) {
            const t = (now - t0) / 1000
            tx = card.clientWidth * (0.5 + 0.3 * Math.sin(t * 0.45))
            ty = card.clientHeight * (0.36 + 0.12 * Math.sin(t * 0.8 + 1))
            tr = 105
          } else if (inside && tr > base) {
            tr = Math.max(base, tr * 0.97) // speed boost settles back to the base size
          }
          cx += (tx - cx) * 0.16
          cy += (ty - cy) * 0.16
          r += (tr - r) * 0.12
          lens.style.setProperty('--lx', `${cx}px`)
          lens.style.setProperty('--ly', `${cy}px`)
          lens.style.setProperty('--lr', `${Math.max(0, r)}px`)
        }
        // Start once the intro has finished, so the lens never shows an empty circle.
        intro.then(() => {
          t0 = performance.now()
          raf = requestAnimationFrame(tick)
        })
        card.addEventListener('pointermove', onMove)
        card.addEventListener('pointerleave', onLeave)
        card.addEventListener('pointerdown', onDown)
        window.addEventListener('pointerup', onUp)
        cleanups.push(() => {
          cancelAnimationFrame(raf)
          card.removeEventListener('pointermove', onMove)
          card.removeEventListener('pointerleave', onLeave)
          card.removeEventListener('pointerdown', onDown)
          window.removeEventListener('pointerup', onUp)
        })
      }

      /* 5 · Colour-block reveal synced to scroll. */
      createTimeline({
        defaults: { ease: 'linear' },
        autoplay: onScroll({ target: wrap, enter: 'top top', leave: 'bottom bottom', sync: true }),
      })
        .add(card, { scale: [1, mobile ? 0.94 : 0.9], borderRadius: ['0px', mobile ? '24px' : '40px'], duration: 400, ease: 'inOut(2)' }, 0)
        .add('.hero-content', { opacity: [1, 0], y: [0, -40], duration: 260 }, 120)
        .add('.giant-inner', { scale: [1, 1.12], duration: 400 }, 0)
        .add(card, { y: ['0vh', '-112vh'], duration: 460, ease: 'in(2)' }, 380)
        .add('.manifesto-word', { opacity: [0.14, 1], duration: 40, delay: stagger(9) }, 300)
        .add('.manifesto-meta', { opacity: [0, 1], y: [30, 0], duration: 120 }, 700)

      return () => cleanups.forEach((c) => c())
    })

    return () => scope.revert()
  }, [])

  const manifesto = profile.manifesto.split(' ')

  return (
    <section id="home" ref={wrapRef} aria-label="Introduction" className="hero-wrap pin-wrap relative h-[210vh]">
      <div className="pin-stage sticky top-0 h-svh overflow-clip motion-off:flex motion-off:flex-col">
        {/* Accent block revealed beneath the hero card */}
        <div className="manifesto absolute inset-0 flex items-center bg-block text-block-ink motion-off:relative motion-off:order-2 motion-off:py-28">
          <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10">
            <p className="font-mono text-xs tracking-[0.25em] uppercase opacity-70">Positioning</p>
            <p className="font-wide mt-6 max-w-[22ch] text-[clamp(1.9rem,4.6vw,4.4rem)] leading-[1.02] md:max-w-[26ch]">
              {manifesto.map((w, i) => (
                <span key={i} className="manifesto-word">
                  {w}{' '}
                </span>
              ))}
            </p>
            <div className="manifesto-meta mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-xs tracking-[0.2em] uppercase opacity-80">
              <span>{profile.name}</span>
              <span className="h-px w-12 bg-current" aria-hidden="true" />
              <span>{profile.role}</span>
              <span className="h-px w-12 bg-current" aria-hidden="true" />
              <span>{profile.location}</span>
            </div>
          </div>
        </div>

        {/* The dark hero card */}
        <div className="hero-card absolute inset-0 origin-[50%_35%] overflow-clip bg-bg will-change-transform motion-off:relative motion-off:order-1 motion-off:h-svh">
          <HeroArt />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-bg via-bg/70 to-transparent lg:h-[34%]" aria-hidden="true" />

          {/* Warm gold / yellow cursor spotlight tracking mouse over the hero card */}
          <div className="hero-lens pointer-events-none absolute inset-0 motion-off:hidden" aria-hidden="true">
            <div
              className="absolute inset-0 transition-opacity duration-300"
              style={{
                background:
                  'radial-gradient(circle var(--lr, 0px) at var(--lx, 50%) var(--ly, 50%), color-mix(in oklab, var(--cursor-gold, var(--gold)) 32%, transparent) 0%, color-mix(in oklab, var(--gold-3) 14%, transparent) 42%, transparent 75%)',
              }}
            />
          </div>

          <div className="hero-object absolute top-[43%] right-[6%] hidden h-[16vw] max-h-[250px] w-[16vw] max-w-[250px] xl:block" aria-hidden="true">
            {show3D ? <HeroObject3D /> : null}
          </div>

          {/* Layer 4: copy */}
          <div className="hero-content hero-intro relative z-10 mx-auto flex h-full max-w-[1440px] flex-col px-5 pt-[84px] pb-5 md:px-10 md:pb-7">
            <div className="hero-pill mx-auto w-full max-w-3xl rounded-full border border-line-strong bg-bg/40 py-2.5 backdrop-blur-md">
              <Marquee speed={36} reactive={false}>
                {profile.services.map((s) => (
                  <span key={s} className="flex items-center gap-5 pr-5 font-mono text-[11px] tracking-[0.22em] whitespace-nowrap text-ink-2 uppercase">
                    {s}
                    <span className="text-gold" aria-hidden="true">
                      ✦
                    </span>
                  </span>
                ))}
              </Marquee>
            </div>

            <div className="mt-4 flex items-start justify-between gap-6 md:mt-5">
              <ul className="hero-fade flex flex-wrap gap-2" aria-label="Core platforms">
                {profile.techChips.map((c) => (
                  <li key={c} className="chip border-line-strong bg-bg/50 py-1 backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
                    {c}
                  </li>
                ))}
              </ul>
              <div className="hero-fade hidden shrink-0 text-right md:block">
                <p className="font-serif text-xl leading-tight text-ink italic lg:text-2xl">{profile.tagline}</p>
                <p className="mt-2 inline-flex items-center gap-2 text-xs text-ink-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  {profile.availability.label}
                </p>
              </div>
            </div>

            {/* Reserved band for the giant word */}
            <div className="giant-slot mt-4 h-[14svh] shrink-0 md:mt-7" aria-hidden="true" />

            <div className="mt-auto flex items-end justify-between gap-6 pt-4">
              <div className="max-w-[420px] xl:max-w-[460px]">
                <h1 className="font-wide text-[clamp(1.6rem,2.7vw,2.7rem)] leading-[0.95] text-gold">
                  <span className="hero-name block">{profile.name.toUpperCase()}</span>
                  <span className="visually-hidden">, {profile.role}</span>
                </h1>
                <p className="hero-fade font-serif mt-2 text-lg text-ink italic md:text-xl">{profile.brand}</p>
                <p className="hero-fade mt-3 hidden text-[14px] leading-relaxed text-ink-2 md:block [@media(max-height:760px)]:hidden">{profile.pitch}</p>
                <div className="hero-fade mt-5 flex flex-wrap items-center gap-3">
                  <Magnetic>
                    <a
                      href="#work"
                      onClick={(e) => {
                        e.preventDefault()
                        scrollToTarget('#work')
                      }}
                      className="btn btn-primary"
                    >
                      View selected work <ArrowDown size={16} />
                    </a>
                  </Magnetic>
                  <Magnetic>
                    <a href={profile.resumeUrl} download className="btn btn-ghost bg-bg/40 backdrop-blur-sm">
                      Résumé <Download size={16} />
                    </a>
                  </Magnetic>
                </div>
                <ul className="hero-fade mt-5 hidden gap-5 text-xs text-ink-3 xl:flex">
                  {profile.socials.map((s) => (
                    <li key={s.label}>
                      <a href={s.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1.5 transition-colors hover:text-gold">
                        <span className="font-mono tracking-wider uppercase">{s.label}</span>
                        <span className="text-ink-2 group-hover:text-gold">{s.handle}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="hero-fade hidden text-right lg:block">
                <p className="font-wide text-gold-gradient text-[clamp(3.6rem,6.5vw,6.5rem)] leading-none">{profile.yearsBadge.value}</p>
                <p className="eyebrow mt-2">{profile.yearsBadge.label}</p>
                <p className="font-wide mt-4 ml-auto max-w-[12ch] text-lg leading-[0.95] text-ink uppercase xl:text-xl">{profile.role}</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => scrollToTarget('#story')}
            className="hero-fade absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-ink-3 uppercase transition-colors hover:text-gold md:flex"
          >
            Scroll to discover
            <span className="grid h-9 w-6 place-items-start justify-center rounded-full border border-line-strong pt-1.5">
              <ArrowDown size={12} className="cue-arrow text-gold" />
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}

/**
 * Blind-shadow backdrop, giant word and portrait in front of the gold manifesto.
 */
function HeroArt() {
  return (
    <div className="absolute inset-0">
      <div className="hero-blinds blinds absolute inset-0" aria-hidden="true" />

      {/* Giant word (top set by JS to match .giant-slot) */}
      <div className="giant-box absolute inset-x-0 top-[26%] flex justify-center px-2" aria-hidden="true">
        <div className="giant-inner">
          <span className="giant-word block bg-gradient-to-b from-gold-3 via-gold to-gold-2 bg-clip-text font-display text-[16vw] leading-[0.8] font-extrabold whitespace-nowrap text-transparent [font-variation-settings:'wdth'_78] md:[font-variation-settings:'wdth'_112]">
            {profile.heroWords[0]}
          </span>
        </div>
      </div>

      {/* Portrait (height set by JS so the head overlaps the word) */}
      <div className="hero-portrait-wrap absolute bottom-0 left-1/2 h-[70svh] -translate-x-1/2">
        <div className="hero-portrait h-full origin-bottom">
          <Portrait variant="default" idPrefix="page" />
        </div>
      </div>
    </div>
  )
}
