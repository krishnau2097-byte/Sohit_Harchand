'use client'

import { animate, onScroll, stagger, utils } from 'animejs'
import { useAnimeScope } from '@/hooks/useAnimeScope'

type Stat = { value: number; suffix: string; label: string }

/** Stat counters: each number counts up from 0 when the row enters the viewport. */
export function Counters({ stats, className = '' }: { stats: Stat[]; className?: string }) {
  const { root } = useAnimeScope<HTMLDListElement>(({ root, reduced }) => {
    if (reduced) return
    const cells = Array.from(root.querySelectorAll<HTMLElement>('.stat'))
    const nums = cells.map((c) => c.querySelector<HTMLElement>('.stat-num')!)
    utils.set(root, { opacity: 1 })
    const values = nums.map(() => ({ v: 0 }))
    nums.forEach((n) => (n.textContent = '0'))

    const observer = onScroll({ target: root, enter: '88% top', repeat: false })
    animate(cells, {
      opacity: [0, 1],
      y: [30, 0],
      duration: 900,
      ease: 'out(4)',
      delay: stagger(90),
      autoplay: observer,
    })
    values.forEach((obj, i) => {
      animate(obj, {
        v: stats[i].value,
        duration: 2000,
        delay: 150 + i * 90,
        ease: 'out(4)',
        autoplay: onScroll({ target: root, enter: '88% top', repeat: false }),
        onUpdate: () => {
          nums[i].textContent = Math.round(obj.v).toLocaleString('en')
        },
      })
    })
    animate(root.querySelectorAll('.stat-line'), {
      scaleX: [0, 1],
      duration: 1200,
      ease: 'inOut(3)',
      delay: stagger(90, { start: 200 }),
      autoplay: onScroll({ target: root, enter: '88% top', repeat: false }),
    })
  })

  return (
    <dl ref={root} data-reveal="" className={`grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 xl:grid-cols-6 ${className}`}>
      {stats.map((s) => (
        <div key={s.label} className="stat flex flex-col">
          <span className="stat-line block h-px origin-left bg-gradient-to-r from-gold to-transparent" aria-hidden="true" />
          <dt className="order-2 mt-2 text-sm leading-snug text-ink-2">{s.label}</dt>
          <dd className="font-wide mt-3 text-[clamp(2.4rem,4.4vw,3.6rem)] text-gold">
            <span className="stat-num tabular-nums">{s.value.toLocaleString('en')}</span>
            <span className="text-gold-2">{s.suffix}</span>
          </dd>
        </div>
      ))}
    </dl>
  )
}
