'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { animate, stagger } from 'animejs'
import { levelRank, skillCategories, skills, type Skill } from '@/content/skills'
import { clamp } from '@/lib/motion'

type Body = {
  el: HTMLDivElement
  skill: Skill
  x: number
  y: number
  vx: number
  vy: number
  r: number
  m: number
  angle: number
  entered: boolean
}

type Api = { shake: () => void; reset: () => void; setGravity: (on: boolean) => void }

const G = 2300 // px/s²
const WALL_BOUNCE = 0.55
const BODY_BOUNCE = 0.6
const MAX_V = 4200

/**
 * Physics playground: every skill becomes a glossy bubble sized by
 * experience. Grab and throw them, sweep the cursor through the pile to push
 * them around, shake the box or switch gravity off. A tiny custom solver
 * (gravity, wall and circle collisions, spring grab) runs on
 * requestAnimationFrame and pauses whenever the box is off screen.
 */
export function SkillPlayground() {
  const boxRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<Api | null>(null)
  const detailRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLParagraphElement>(null)
  const [gravity, setGravity] = useState(true)
  const [selected, setSelected] = useState<Skill | null>(null)

  useEffect(() => {
    const box = boxRef.current!
    const els = Array.from(box.querySelectorAll<HTMLDivElement>('.bubble'))
    let W = box.clientWidth
    let H = box.clientHeight
    let gravityOn = true

    const radiusFor = (s: Skill) => {
      const k = clamp(W / 1150, 0.58, 1)
      return (30 + s.years * 9 + levelRank[s.level] * 3) * k
    }

    const bodies: Body[] = els.map((el, i) => {
      const skill = skills[i]
      const r = radiusFor(skill)
      return { el, skill, r, m: r * r, x: 0, y: 0, vx: 0, vy: 0, angle: 0, entered: false }
    })

    const size = (b: Body) => {
      b.el.style.width = b.el.style.height = `${b.r * 2}px`
      b.el.style.setProperty('--r', `${b.r}px`)
    }

    const drop = () => {
      bodies.forEach((b, i) => {
        b.x = b.r + Math.random() * Math.max(1, W - b.r * 2)
        b.y = -b.r - i * 46 - Math.random() * 60
        b.vx = (Math.random() - 0.5) * 300
        b.vy = 0
        b.entered = false
        size(b)
      })
    }
    drop()

    /* Pointer state */
    let px = -9999
    let py = -9999
    let pointerIn = false
    let grabbed: Body | null = null
    let downAt = 0
    let downX = 0
    let downY = 0
    let interacted = false

    const local = (e: PointerEvent) => {
      const r = box.getBoundingClientRect()
      return [e.clientX - r.left, e.clientY - r.top] as const
    }
    const hit = (x: number, y: number) => {
      for (let i = bodies.length - 1; i >= 0; i--) {
        const b = bodies[i]
        if ((x - b.x) ** 2 + (y - b.y) ** 2 <= b.r * b.r) return b
      }
      return null
    }
    const firstTouch = () => {
      if (interacted || !hintRef.current) return
      interacted = true
      animate(hintRef.current, { opacity: 0, y: -10, duration: 500, ease: 'out(3)' })
    }

    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('button, .card')) return
      const [x, y] = local(e)
      const b = hit(x, y)
      if (!b) return
      e.preventDefault()
      grabbed = b
      downAt = performance.now()
      downX = x
      downY = y
      box.setPointerCapture(e.pointerId)
      b.el.dataset.grabbed = ''
      animate(b.el, { scale: 1.12, duration: 300, ease: 'out(3)' })
      firstTouch()
    }
    const onMove = (e: PointerEvent) => {
      const [x, y] = local(e)
      px = x
      py = y
      pointerIn = e.pointerType === 'mouse'
    }
    const onUp = (e: PointerEvent) => {
      if (!grabbed) return
      const [x, y] = local(e)
      const b = grabbed
      delete b.el.dataset.grabbed
      animate(b.el, { scale: 1, duration: 500, ease: 'outElastic(1, .5)' })
      if (performance.now() - downAt < 250 && Math.hypot(x - downX, y - downY) < 6) setSelected(b.skill)
      grabbed = null
    }
    const onLeave = () => {
      pointerIn = false
    }
    box.addEventListener('pointerdown', onDown)
    box.addEventListener('pointermove', onMove)
    box.addEventListener('pointerup', onUp)
    box.addEventListener('pointercancel', onUp)
    box.addEventListener('pointerleave', onLeave)

    /* Physics */
    const step = (dt: number) => {
      const g = gravityOn ? G : 0
      const air = Math.exp(-(gravityOn ? 0.35 : 0.8) * dt)
      for (const b of bodies) {
        if (b === grabbed) {
          b.vx = (px - b.x) * 16
          b.vy = (py - b.y) * 16
        } else {
          b.vy += g * dt
          if (!gravityOn) {
            b.vx += (Math.random() - 0.5) * 60 * dt
            b.vy += (Math.random() - 0.5) * 60 * dt
          }
          if (pointerIn && !grabbed) {
            const dx = b.x - px
            const dy = b.y - py
            const d = Math.hypot(dx, dy) || 1
            const reach = b.r + 80
            if (d < reach) {
              const f = (1 - d / reach) * 5200 * dt
              b.vx += (dx / d) * f
              b.vy += (dy / d) * f
            }
          }
          b.vx *= air
          b.vy *= air
        }
        b.vx = clamp(b.vx, -MAX_V, MAX_V)
        b.vy = clamp(b.vy, -MAX_V, MAX_V)
        b.x += b.vx * dt
        b.y += b.vy * dt
        b.angle += (b.vx * dt) / b.r

        if (b.y - b.r >= 0) b.entered = true
        if (b.x - b.r < 0) {
          b.x = b.r
          b.vx = Math.abs(b.vx) * WALL_BOUNCE
        } else if (b.x + b.r > W) {
          b.x = W - b.r
          b.vx = -Math.abs(b.vx) * WALL_BOUNCE
        }
        if (b.y + b.r > H) {
          b.y = H - b.r
          b.vy = -Math.abs(b.vy) * WALL_BOUNCE
          b.vx *= Math.exp(-3 * dt)
        } else if (b.entered && b.y - b.r < 0) {
          b.y = b.r
          b.vy = Math.abs(b.vy) * WALL_BOUNCE
        }
      }
      // Circle–circle: push apart, then exchange momentum along the normal.
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 0; i < bodies.length; i++) {
          const a = bodies[i]
          for (let j = i + 1; j < bodies.length; j++) {
            const b = bodies[j]
            const dx = b.x - a.x
            const dy = b.y - a.y
            const min = a.r + b.r
            const d2 = dx * dx + dy * dy
            if (d2 >= min * min || d2 === 0) continue
            const d = Math.sqrt(d2)
            const nx = dx / d
            const ny = dy / d
            const overlap = min - d
            const ia = a === grabbed ? 0 : 1 / a.m
            const ib = b === grabbed ? 0 : 1 / b.m
            const sum = ia + ib || 1
            a.x -= nx * overlap * (ia / sum)
            a.y -= ny * overlap * (ia / sum)
            b.x += nx * overlap * (ib / sum)
            b.y += ny * overlap * (ib / sum)
            if (pass > 0) continue
            const vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny
            if (vn >= 0) continue
            const jImp = (-(1 + BODY_BOUNCE) * vn) / sum
            a.vx -= jImp * ia * nx
            a.vy -= jImp * ia * ny
            b.vx += jImp * ib * nx
            b.vy += jImp * ib * ny
          }
        }
      }
    }

    const render = () => {
      for (const b of bodies) {
        b.el.style.translate = `${b.x - b.r}px ${b.y - b.r}px`
        b.el.style.rotate = `${b.angle}rad`
      }
    }

    let visible = false
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.05 })
    io.observe(box)

    const ro = new ResizeObserver(() => {
      W = box.clientWidth
      H = box.clientHeight
      bodies.forEach((b) => {
        b.r = radiusFor(b.skill)
        b.m = b.r * b.r
        size(b)
      })
    })
    ro.observe(box)

    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      const dt = Math.min(1 / 30, (now - last) / 1000)
      last = now
      if (!visible || document.hidden) return
      step(dt / 2)
      step(dt / 2)
      render()
    }
    raf = requestAnimationFrame(loop)

    apiRef.current = {
      shake: () => {
        bodies.forEach((b) => {
          b.vx += (Math.random() - 0.5) * 2400
          b.vy -= 600 + Math.random() * 1600
        })
        animate(box, { rotate: [0, -1.2, 1, -0.6, 0], duration: 500, ease: 'out(2)' })
        firstTouch()
      },
      reset: () => {
        drop()
        setSelected(null)
      },
      setGravity: (on) => {
        gravityOn = on
        if (!on) bodies.forEach((b) => (b.vy -= 300 + Math.random() * 500))
      },
    }

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      box.removeEventListener('pointerdown', onDown)
      box.removeEventListener('pointermove', onMove)
      box.removeEventListener('pointerup', onUp)
      box.removeEventListener('pointercancel', onUp)
      box.removeEventListener('pointerleave', onLeave)
      apiRef.current = null
    }
  }, [])

  /* Detail card pops in when a bubble is clicked. */
  useEffect(() => {
    if (!selected || !detailRef.current) return
    animate(detailRef.current, { opacity: [0, 1], y: [16, 0], scale: [0.96, 1], duration: 500, ease: 'out(4)' })
    animate(detailRef.current.querySelectorAll('.meter-seg'), { scaleX: [0, 1], duration: 600, delay: stagger(90, { start: 150 }), ease: 'out(4)' })
  }, [selected])

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-2">Grab a bubble and throw it. Bigger bubble = more experience.</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => apiRef.current?.shake()} className="chip hover:border-gold hover:text-gold">
            ✦ Shake
          </button>
          <button
            type="button"
            aria-pressed={!gravity}
            onClick={() => {
              const next = !gravity
              setGravity(next)
              apiRef.current?.setGravity(next)
            }}
            className="chip hover:border-gold hover:text-gold aria-pressed:border-gold aria-pressed:text-gold"
          >
            {gravity ? '◎ Zero gravity' : '↓ Gravity on'}
          </button>
          <button type="button" onClick={() => apiRef.current?.reset()} className="chip hover:border-gold hover:text-gold">
            ↺ Drop again
          </button>
        </div>
      </div>

      <div
        ref={boxRef}
        className="relative mt-6 h-[480px] touch-pan-y overflow-clip rounded-[2rem] border border-line bg-surface md:h-[560px]"
        style={{ backgroundImage: 'radial-gradient(circle at 50% 120%, var(--glow), transparent 60%)' }}
      >
        <p className="sr-only">Interactive skills playground. The Cards view lists the same skills.</p>
        <p className="font-wide text-outline pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[clamp(2.5rem,9vw,8rem)] leading-none select-none" aria-hidden="true">
          PLAY
        </p>
        <p ref={hintRef} className="pointer-events-none absolute top-5 left-1/2 -translate-x-1/2 chip bg-surface/80 font-mono text-[11px] tracking-wider uppercase backdrop-blur" aria-hidden="true">
          drag · throw · sweep
        </p>

        {skills.map((s) => (
          <div
            key={s.name}
            className="bubble absolute top-0 left-0 grid touch-none place-items-center rounded-full text-center text-on-gold select-none data-[grabbed]:z-10"
            style={
              {
                '--tone': skillCategories[s.category].tone,
                width: 80,
                height: 80,
                translate: '-200px -200px',
                background:
                  'radial-gradient(circle at 32% 28%, color-mix(in oklab, var(--tone) 55%, #fff) 0%, var(--tone) 42%, color-mix(in oklab, var(--tone) 72%, #000) 100%)',
                boxShadow: 'inset -6px -10px 18px rgba(0,0,0,.22), 0 14px 24px -12px rgba(0,0,0,.45)',
              } as CSSProperties
            }
            aria-hidden="true"
          >
            <span className="flex flex-col items-center leading-none">
              <span className="font-wide" style={{ fontSize: 'calc(var(--r, 40px) * 0.62)' }}>
                {s.symbol}
              </span>
              <span className="mt-1 max-w-[90%] truncate text-[9px] font-medium opacity-85 md:text-[10px]">{s.name}</span>
            </span>
          </div>
        ))}

        {selected ? (
          <div ref={detailRef} className="card absolute bottom-4 left-4 z-20 w-[min(320px,calc(100%-2rem))] p-5 shadow-[var(--shadow)]" role="status">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-wide text-3xl" style={{ color: skillCategories[selected.category].tone }}>
                  {selected.symbol}
                </p>
                <p className="mt-1 text-ink">{selected.name}</p>
                <p className="font-mono text-[10px] tracking-wider text-ink-3 uppercase">{skillCategories[selected.category].label}</p>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="chip px-2.5" aria-label="Close details">
                ✕
              </button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-2">{selected.note}</p>
            <div className="mt-4 flex items-center gap-3 text-xs text-ink-2">
              <span className="w-16">{selected.level}</span>
              <span className="flex flex-1 gap-1" aria-hidden="true">
                {[1, 2, 3].map((n) => (
                  <span
                    key={n}
                    className="meter-seg h-1.5 flex-1 origin-left rounded-full"
                    style={{ background: n <= levelRank[selected.level] ? skillCategories[selected.category].tone : 'var(--line-strong)' }}
                  />
                ))}
              </span>
              <span>
                {selected.years} {selected.years === 1 ? 'yr' : 'yrs'}
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
