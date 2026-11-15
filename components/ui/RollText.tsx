import type { CSSProperties } from 'react'

/**
 * Letter-roll hover: on hover of the parent link/button every character
 * slides up while a gold copy rolls in underneath, staggered left to right.
 * Screen readers get the plain text once.
 */
export function RollText({ children, className = '' }: { children: string; className?: string }) {
  return (
    <span className={`roll ${className}`}>
      <span className="sr-only">{children}</span>
      <span aria-hidden="true" className="inline-flex">
        {Array.from(children).map((c, i) => (
          <span key={i} className="roll-char" data-char={c} style={{ '--i': i } as CSSProperties}>
            {c}
          </span>
        ))}
      </span>
    </span>
  )
}
