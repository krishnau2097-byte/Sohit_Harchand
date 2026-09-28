'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { animate, createTimeline, onScroll, stagger, utils, type ScrollObserver } from 'animejs'
import { homeSections, nav, profile } from '@/content/profile'
import { isReducedMotion } from '@/lib/motion'
import { getLenis, scrollToTarget } from './providers/SmoothScroll'
import { ThemeToggle } from './ThemeToggle'
import { Magnetic } from './ui/Magnetic'
import { ArrowUpRight, Close } from './ui/Icons'
import { RollText } from './ui/RollText'
import { Signature } from './ui/Signature'

type Item = { label: string; href: string; key: string }

/**
 * Fixed, blurred luxury navbar with floating glass pill navigation.
 * On the home page, links represent sections (About, Skills, Experience, Projects, Contact)
 * with real-time scroll-spy. On other pages, navigation items seamlessly route.
 */
export function Navbar() {
  const pathname = usePathname()
  const isHome = pathname === '/'

  const items: Item[] = isHome
    ? [
        { label: 'About', href: '/#story', key: 'story' },
        { label: 'Skills', href: '/#skills', key: 'skills' },
        { label: 'Experience', href: '/#experience', key: 'experience' },
        { label: 'Projects', href: '/#work', key: 'work' },
        { label: 'Contact', href: '/#contact', key: 'contact' },
      ]
    : nav.map((n) => ({ label: n.label, href: n.href, key: n.href }))

  const headerRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const underlineRef = useRef<HTMLSpanElement>(null)
  const menuBtnRef = useRef<HTMLButtonElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuOpenRef = useRef(false)

  const moveUnderline = useCallback((key: string | null) => {
    const list = listRef.current
    const line = underlineRef.current
    if (!list || !line) return
    const link = key ? list.querySelector<HTMLElement>(`[data-key="${CSS.escape(key)}"]`) : null
    list.querySelectorAll('[data-key]').forEach((a) => a.toggleAttribute('data-active', a === link))
    const duration = isReducedMotion() ? 0 : 500
    if (!link) {
      animate(line, { opacity: 0, duration: 300 })
      return
    }
    animate(line, {
      x: link.offsetLeft,
      width: link.offsetWidth,
      opacity: 1,
      duration,
      ease: 'out(4)',
    })
  }, [])

  /* Scroll-spy (home) or route match (other pages). */
  useEffect(() => {
    if (!isHome) {
      const match = nav.filter((n) => n.href !== '/').find((n) => pathname.startsWith(n.href))
      moveUnderline(match ? match.href : pathname === '/' ? '/' : null)
      return
    }

    moveUnderline(null)
    let current: string | null = null
    const observers: ScrollObserver[] = []

    const trackSections = [
      { id: 'story', key: 'story' },
      { id: 'skills', key: 'skills' },
      { id: 'experience', key: 'experience' },
      { id: 'work', key: 'work' },
      { id: 'contact', key: 'contact' },
    ]

    trackSections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (!el) return
      observers.push(
        onScroll({
          target: el,
          enter: 'center top',
          leave: 'center bottom',
          onEnter: () => {
            current = s.key
            moveUnderline(s.key)
          },
          onLeave: () => {
            if (current !== s.key) return
            current = null
            moveUnderline(null)
          },
        }),
      )
    })

    const onResize = () => {
      const active = listRef.current?.querySelector<HTMLElement>('[data-active]')
      moveUnderline(active?.dataset.key ?? null)
    }
    window.addEventListener('resize', onResize)
    return () => {
      observers.forEach((o) => o.revert())
      window.removeEventListener('resize', onResize)
    }
  }, [isHome, pathname, moveUnderline])

  /* Solid background after scrolling; hide on scroll down, reveal on scroll up. */
  useEffect(() => {
    const header = headerRef.current!
    let last = window.scrollY
    let hidden = false
    const onScrollEv = () => {
      const y = window.scrollY
      header.toggleAttribute('data-scrolled', y > 20)
      const down = y > last + 4
      const up = y < last - 4
      if (!menuOpenRef.current && down && y > 240 && !hidden) {
        hidden = true
        animate(header, { y: '-110%', duration: 500, ease: 'inOut(3)' })
      } else if ((up || y < 240) && hidden) {
        hidden = false
        animate(header, { y: '0%', duration: 600, ease: 'out(4)' })
      }
      if (down || up) last = y
    }
    onScrollEv()
    window.addEventListener('scroll', onScrollEv, { passive: true })
    return () => window.removeEventListener('scroll', onScrollEv)
  }, [])

  const onNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: Item) => {
    if (isHome) {
      if (item.key === 'story' || item.key === 'skills' || item.key === 'experience' || item.key === 'work' || item.key === 'contact') {
        const targetEl = document.getElementById(item.key)
        if (targetEl) {
          e.preventDefault()
          scrollToTarget(`#${item.key}`)
          history.replaceState(null, '', `#${item.key}`)
        }
      }
    } else {
      if (item.href.includes('#skills') && pathname === '/about') {
        const targetEl = document.getElementById('skills')
        if (targetEl) {
          e.preventDefault()
          scrollToTarget('#skills')
          history.replaceState(null, '', '#skills')
        }
      }
    }
  }

  const setMenu = useCallback((open: boolean) => {
    menuOpenRef.current = open
    setMenuOpen(open)
  }, [])
  const closeMenu = useCallback(() => setMenu(false), [setMenu])

  return (
    <>
      <header
        ref={headerRef}
        className="group/nav fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter,box-shadow] duration-500 data-[scrolled]:border-b data-[scrolled]:border-line-strong/60 data-[scrolled]:bg-bg/80 data-[scrolled]:backdrop-blur-xl data-[scrolled]:shadow-[0_8px_30px_rgba(0,0,0,0.12)] after:absolute after:inset-x-0 after:bottom-0 after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-gold/30 after:to-transparent"
      >
        <nav aria-label="Primary" className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-4 px-5 md:px-10">
          {/* Left: Brand Identity + Live Availability */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              onClick={(e) => {
                if (isHome) {
                  e.preventDefault()
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
              }}
              className="group flex items-center gap-3"
              aria-label={`${profile.name}, home`}
            >
              <span className="relative grid h-10 w-10 place-items-center shrink-0">
                <svg
                  viewBox="0 0 40 40"
                  className="absolute inset-0 h-full w-full text-gold transition-transform duration-700 group-hover:rotate-90 drop-shadow-[0_0_8px_var(--glow)]"
                  aria-hidden="true"
                >
                  <path d="M20 1.5 38.5 20 20 38.5 1.5 20Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
                </svg>
                <span className="font-wide text-[11px] text-gold font-bold">{profile.initials}</span>
              </span>
              <div className="hidden sm:flex flex-col leading-tight">
                <div className="flex items-center gap-2">
                  <span className="font-wide text-[13px] tracking-wide text-ink group-hover:text-gold transition-colors">
                    {profile.name.toUpperCase()}
                  </span>
                  <Signature width={84} height={22} showFlourish={false} className="opacity-85 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="font-mono text-[10px] tracking-[0.2em] text-ink-3 uppercase">{profile.role}</span>
              </div>
            </Link>

            {/* Live Availability Pulse Badge */}
            <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-line-strong/60">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="font-mono text-[11px] tracking-wider text-ink-3 uppercase">Available for work</span>
            </div>
          </div>

          {/* Center: Frosted Capsule Pill Navigation */}
          <div className="hidden lg:flex items-center rounded-full border border-line-strong/60 bg-surface/50 p-1.5 backdrop-blur-md shadow-sm">
            <ul ref={listRef} className="relative flex items-center">
              {items.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    data-key={item.key}
                    onClick={(e) => onNavClick(e, item)}
                    className="relative z-10 block rounded-full px-4 py-1.5 text-[13px] font-medium text-ink-2 transition-all duration-300 hover:text-ink data-[active]:text-gold data-[active]:bg-gold/15"
                  >
                    <RollText>{item.label}</RollText>
                  </Link>
                </li>
              ))}
              <span
                ref={underlineRef}
                className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-gold/15 border border-gold/30 opacity-0 shadow-[0_0_12px_var(--glow)]"
                aria-hidden="true"
              />
            </ul>
          </div>

          {/* Right: Actions, Theme, Let's talk & Mobile Menu */}
          <div className="flex items-center gap-2 md:gap-3">
            <ThemeToggle />

            <div className="hidden md:block">
              <Magnetic>
                <Link
                  href="/contact"
                  className="btn btn-primary h-10 px-5 text-[13px] font-medium"
                >
                  Let&apos;s talk <ArrowUpRight size={15} />
                </Link>
              </Magnetic>
            </div>

            <button
              ref={menuBtnRef}
              type="button"
              onClick={() => setMenu(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              className="group relative flex h-10 items-center gap-2 rounded-full border border-line pr-4 pl-3 text-[13px] text-ink transition-colors hover:border-gold"
            >
              <span className="relative block h-3 w-5" aria-hidden="true">
                <span
                  className={`absolute left-0 h-px w-5 bg-current transition-all duration-500 ${
                    menuOpen ? 'top-1.5 rotate-45' : 'top-0.5'
                  }`}
                />
                <span
                  className={`absolute left-0 h-px bg-current transition-all duration-500 ${
                    menuOpen ? 'top-1.5 w-5 -rotate-45' : 'top-2.5 w-3 group-hover:w-5'
                  }`}
                />
              </span>
              {menuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </nav>
      </header>

      <MenuSheet open={menuOpen} onClose={closeMenu} originRef={menuBtnRef} isHome={isHome} />
    </>
  )
}

function MenuSheet({
  open,
  onClose,
  originRef,
  isHome,
}: {
  open: boolean
  onClose: () => void
  originRef: React.RefObject<HTMLButtonElement | null>
  isHome: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const wasOpen = useRef(false)
  const pathname = usePathname()

  useEffect(() => {
    const el = ref.current!
    if (open === wasOpen.current) return
    wasOpen.current = open
    const btn = originRef.current?.getBoundingClientRect()
    const cx = btn ? btn.left + btn.width / 2 : window.innerWidth - 40
    const cy = btn ? btn.top + btn.height / 2 : 36
    const reduced = isReducedMotion()
    const lenis = getLenis()

    if (open) {
      lenis?.stop()
      document.documentElement.style.overflow = 'hidden'
      el.style.display = 'block'
      el.style.visibility = 'visible'
      const links = el.querySelectorAll('.menu-link-inner')
      utils.set(links, { y: '110%' })
      createTimeline({ defaults: { ease: 'inOut(4)' } })
        .add(el, { clipPath: [`circle(0px at ${cx}px ${cy}px)`, `circle(150% at ${cx}px ${cy}px)`], duration: reduced ? 0 : 900 })
        .add(links, { y: ['110%', '0%'], duration: reduced ? 0 : 900, ease: 'out(4)', delay: stagger(70) }, reduced ? 0 : 280)
        .add(el.querySelectorAll('.menu-fade'), { opacity: [0, 1], y: [20, 0], duration: reduced ? 0 : 700, delay: stagger(60), ease: 'out(3)' }, reduced ? 0 : 520)
      el.querySelector<HTMLElement>('a')?.focus({ preventScroll: true })
      return
    }
    lenis?.start()
    document.documentElement.style.overflow = ''
    animate(el, {
      clipPath: [`circle(150% at ${cx}px ${cy}px)`, `circle(0px at ${cx}px ${cy}px)`],
      duration: reduced ? 0 : 700,
      ease: 'inOut(4)',
      onComplete: () => {
        el.style.visibility = 'hidden'
        el.style.display = 'none'
      },
    })
    originRef.current?.focus({ preventScroll: true })
  }, [open, originRef])

  /* Escape closes the sheet. */
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  /* Close the sheet when the route changes. */
  const lastPath = useRef(pathname)
  useEffect(() => {
    if (lastPath.current !== pathname && open) onClose()
    lastPath.current = pathname
  }, [pathname, open, onClose])

  return (
    <div
      ref={ref}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!open}
      className="blinds fixed inset-0 z-40 overflow-x-hidden overflow-y-auto bg-bg-2"
      style={{ display: 'none', visibility: 'hidden', clipPath: 'circle(0px at 100% 0%)' }}
    >
      <div className="relative mx-auto grid min-h-full max-w-[1440px] gap-12 px-5 pt-28 pb-12 md:grid-cols-12 md:px-10">
        <nav aria-label="Pages" className="md:col-span-8">
          <p className="eyebrow menu-fade mb-6">Pages & Navigation</p>
          <ul className="space-y-1">
            {nav.map((n, i) => {
              const active = n.href === '/' ? pathname === '/' : pathname.startsWith(n.href)
              return (
                <li key={n.href} className="overflow-hidden">
                  <Link
                    href={n.href}
                    onClick={onClose}
                    className={`menu-link-inner group flex items-baseline gap-4 py-1 ${active ? 'text-gold' : 'text-ink'}`}
                  >
                    <span className="font-mono text-xs text-ink-3">0{i + 1}</span>
                    <span className="font-wide text-[clamp(2.8rem,9vw,7.5rem)] transition-[font-variation-settings,color] duration-500 [--wdth:125] group-hover:text-gold group-hover:[--wdth:70]">
                      {n.label}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <aside className="flex flex-col justify-end gap-10 md:col-span-4">
          {isHome ? (
            <div className="menu-fade">
              <p className="eyebrow mb-4">On this page</p>
              <ul className="flex flex-wrap gap-2">
                {homeSections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      onClick={(e) => {
                        e.preventDefault()
                        onClose()
                        setTimeout(() => scrollToTarget(`#${s.id}`), 450)
                      }}
                      className="chip hover:border-gold hover:text-gold"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="menu-fade">
            <p className="eyebrow mb-4">Say hello</p>
            <a
              href={`mailto:${profile.email}`}
              className="font-wide text-lg [overflow-wrap:anywhere] text-ink hover:text-gold lg:text-xl xl:text-2xl"
            >
              {profile.email}
            </a>
          </div>
          <div className="menu-fade flex flex-wrap gap-3">
            {profile.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="chip hover:border-gold hover:text-gold"
              >
                {s.label} <ArrowUpRight size={13} />
              </a>
            ))}
          </div>
          <p className="menu-fade flex items-center gap-3 text-sm text-ink-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            {profile.availability.label}
          </p>
          <button type="button" onClick={onClose} className="menu-fade chip w-fit md:hidden">
            <Close size={14} /> Close menu
          </button>
        </aside>
      </div>
    </div>
  )
}
