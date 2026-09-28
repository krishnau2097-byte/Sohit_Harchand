'use client'

import { useRef } from 'react'
import { animate } from 'animejs'
import { Moon, Sun } from './ui/Icons'

/** Dark ↔ light toggle. The head script applies the saved theme before paint. */
export function ThemeToggle() {
  const iconRef = useRef<HTMLSpanElement>(null)

  const toggle = () => {
    const html = document.documentElement
    const next = html.dataset.theme === 'light' ? 'dark' : 'light'
    html.dataset.theme = next
    try {
      localStorage.setItem('theme', next)
    } catch {}
    if (iconRef.current && !html.classList.contains('reduce-motion')) {
      animate(iconRef.current, { rotate: [0, 360], scale: [0.6, 1], duration: 700, ease: 'out(4)' })
    }
    window.dispatchEvent(new Event('themechange'))
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink-2 transition-colors hover:border-gold hover:text-gold"
      aria-label="Toggle light and dark theme"
    >
      <span ref={iconRef} className="grid place-items-center">
        <Sun className="light:hidden" />
        <Moon className="hidden light:block" />
      </span>
    </button>
  )
}
