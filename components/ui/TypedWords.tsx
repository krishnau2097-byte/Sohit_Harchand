'use client'

import { useEffect, useState } from 'react'

/**
 * Types each word, holds it, deletes it, moves to the next. The first word is
 * server-rendered in full, so the line is never empty. Pauses in hidden tabs
 * and stays on the first word with reduced motion.
 */
export function TypedWords({ words, className = '' }: { words: readonly string[]; className?: string }) {
  const [text, setText] = useState(words[0])

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let i = 0
    let shown = words[0]
    let deleting = true
    let timer: ReturnType<typeof setTimeout>

    const step = () => {
      if (document.hidden) {
        timer = setTimeout(step, 500)
        return
      }
      const target = words[i]
      if (deleting) {
        shown = shown.slice(0, -1)
        if (!shown) {
          deleting = false
          i = (i + 1) % words.length
        }
      } else {
        shown = words[i].slice(0, shown.length + 1)
        if (shown === words[i]) deleting = true
      }
      setText(shown)
      const hold = !deleting ? 55 : shown === target ? 2200 : 30
      timer = setTimeout(step, hold)
    }
    timer = setTimeout(step, 2400)
    return () => clearTimeout(timer)
  }, [words])

  return (
    <span className={className}>
      {text}
      <span className="caret" aria-hidden="true" />
    </span>
  )
}
