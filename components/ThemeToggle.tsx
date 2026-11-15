'use client'

import { Moon, Sun } from './ui/Icons'

/** Light ↔ dark toggle. The head script applies the saved theme before paint. */
export function ThemeToggle() {
  const toggle = () => {
    const html = document.documentElement
    const next = html.dataset.theme === 'dark' ? 'light' : 'dark'
    html.dataset.theme = next
    try {
      localStorage.setItem('theme', next)
    } catch {}
  }

  return (
    <button type="button" onClick={toggle} className="icon-btn group" aria-label="Toggle light and dark theme">
      <span className="grid place-items-center transition-transform duration-500 group-active:rotate-180">
        <Moon className="dark:hidden" />
        <Sun className="hidden dark:block" />
      </span>
    </button>
  )
}
