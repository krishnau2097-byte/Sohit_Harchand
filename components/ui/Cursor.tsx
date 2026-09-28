'use client'

import { useEffect, useRef } from 'react'
import { animate, createAnimatable } from 'animejs'
import { isFinePointer, isReducedMotion } from '@/lib/motion'

type Mode = 'idle' | 'link' | 'text' | 'input'

/** Cursor geometry (px) */
const DOT_SIZE = 6
const RING_SIZE = 30
const SCALE: Record<Mode, number> = { idle: 1, link: 0.9, text: 0.65, input: 0.4 }
const RING_SCALE: Record<Mode, number> = { idle: 1, link: 1.2, text: 1.35, input: 0.5 }

/**
 * Custom cursor:
 *  - a luminous gold/yellow dot matching the brand theme (--cursor-gold)
 *  - a smooth trailing gold ring with soft glow that expands over links and text
 */
export function Cursor() {
  const blobRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isFinePointer() || isReducedMotion()) return
    const blob = blobRef.current!
    const ring = ringRef.current!
    const html = document.documentElement
    html.classList.add('has-cursor')

    const blobA = createAnimatable(blob, { x: 110, y: 110, ease: 'out(2)' })
    const ringA = createAnimatable(ring, { x: 480, y: 480, ease: 'out(4)' })
    let visible = false
    let mode: Mode | '' = ''

    const setMode = (next: Mode) => {
      if (next === mode) return
      mode = next
      animate(blob.firstElementChild!, {
        scale: SCALE[next],
        duration: next === 'text' ? 500 : 350,
        ease: 'out(3)',
      })
      animate(ring, {
        opacity: next === 'input' ? 0 : 1,
        scale: RING_SCALE[next],
        duration: 380,
        ease: 'out(3)',
      })
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      if (!visible) {
        visible = true
        animate([blob, ring], { opacity: 1, duration: 300 })
        setMode('idle')
      }
      blobA.x(e.clientX)
      blobA.y(e.clientY)
      ringA.x(e.clientX)
      ringA.y(e.clientY)
    }

    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null
      if (!t || !t.closest) return
      if (t.closest('input, textarea, select')) return setMode('input')
      if (t.closest('a, button, [role="tab"], label, summary, [role="button"], .cursor-pointer')) return setMode('link')
      if (t.closest('h1, h2, h3, .font-wide, blockquote, [data-cursor-text]')) return setMode('text')
      setMode('idle')
    }

    const onDown = () => {
      animate(blob.firstElementChild!, { scale: SCALE[mode || 'idle'] * 0.75, duration: 180, ease: 'out(3)' })
      animate(ring, { scale: RING_SCALE[mode || 'idle'] * 0.85, duration: 180, ease: 'out(3)' })
    }
    const onUp = () => {
      animate(blob.firstElementChild!, { scale: SCALE[mode || 'idle'], duration: 280, ease: 'out(3)' })
      animate(ring, { scale: RING_SCALE[mode || 'idle'], duration: 320, ease: 'out(3)' })
    }

    const onLeaveWindow = () => {
      visible = false
      animate([blob, ring], { opacity: 0, duration: 250 })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    html.addEventListener('mouseleave', onLeaveWindow)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      html.removeEventListener('mouseleave', onLeaveWindow)
      blobA.revert()
      ringA.revert()
      html.classList.remove('has-cursor')
    }
  }, [])

  return (
    <>
      {/* Central gold/yellow cursor dot */}
      <div
        ref={blobRef}
        className="cursor-blob pointer-events-none fixed top-0 left-0 z-[100] opacity-0 will-change-transform"
        style={{ width: DOT_SIZE, height: DOT_SIZE, marginLeft: -DOT_SIZE / 2, marginTop: -DOT_SIZE / 2 }}
        aria-hidden="true"
      >
        <div className="h-full w-full rounded-full bg-[var(--cursor-gold)] shadow-[0_0_12px_var(--cursor-glow)]" />
      </div>

      {/* Trailing gold/yellow ring */}
      <div
        ref={ringRef}
        className="cursor-ring pointer-events-none fixed top-0 left-0 z-[99] opacity-0 rounded-full border will-change-transform"
        style={{
          width: RING_SIZE,
          height: RING_SIZE,
          marginLeft: -RING_SIZE / 2,
          marginTop: -RING_SIZE / 2,
          borderColor: 'var(--cursor-gold-ring)',
          backgroundColor: 'var(--cursor-gold-bg)',
          boxShadow: '0 0 16px var(--cursor-glow)',
        }}
        aria-hidden="true"
      />
    </>
  )
}
