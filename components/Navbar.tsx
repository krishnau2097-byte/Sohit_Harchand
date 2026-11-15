'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { nav, profile } from '@/content/profile'
import { Signature } from './ui/Signature'
import { ThemeToggle } from './ThemeToggle'
import { Close, Linkedin, Mail, Menu } from './ui/Icons'

const isActive = (pathname: string, href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  // The menu remembers which page it was opened on, so any navigation closes it.
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn === pathname

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkedin = profile.socials.find((s) => s.label === 'LinkedIn')

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        open ? 'border-b border-line bg-bg shadow-[var(--shadow)]' : scrolled ? 'border-b border-line bg-bg/85 backdrop-blur-md' : 'border-b border-transparent'
      }`}
    >
      <nav aria-label="Main" className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Home" onClick={() => setOpenOn(null)} className="group -ml-1 flex items-center">
          <Signature id="nav" size={38} />
        </Link>

        <ul className="hidden items-center gap-1 rounded-full border border-line bg-surface/70 p-1 md:flex">
          {nav.map((n) => {
            const active = isActive(pathname, n.href)
            return (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={active ? 'page' : undefined}
                  className={`block rounded-full px-4 py-1.5 text-sm transition-colors ${active ? 'bg-gold text-on-gold' : 'text-ink-2 hover:text-gold'}`}
                >
                  {n.label}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-1">
          {linkedin ? (
            <a href={linkedin.href} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="icon-btn hidden sm:grid">
              <Linkedin />
            </a>
          ) : null}
          <a href={`mailto:${profile.email}`} aria-label="Email" className="icon-btn hidden sm:grid">
            <Mail />
          </a>
          <ThemeToggle />
          <button
            type="button"
            className="icon-btn md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpenOn(open ? null : pathname)}
          >
            {open ? <Close /> : <Menu />}
          </button>
        </div>
      </nav>

      <div id="mobile-menu" hidden={!open} className="border-t border-line md:hidden">
        <ul className="container-page grid gap-1 py-3">
          {nav.map((n, i) => {
            const active = isActive(pathname, n.href)
            return (
              <li key={n.href} className="pop-in" style={{ '--d': `${i * 40}ms` } as React.CSSProperties}>
                <Link
                  href={n.href}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => setOpenOn(null)}
                  className={`block rounded-xl px-4 py-3 text-base ${active ? 'bg-surface-2 text-gold' : 'text-ink-2'}`}
                >
                  {n.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </header>
  )
}
