'use client'

import { useEffect, useState } from 'react'

/** Live clock for the footer and contact card. Renders a placeholder on the server. */
export function LocalTime({ timeZone }: { timeZone?: string }) {
  const [now, setNow] = useState<string | null>(null)

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone })
    const tick = () => setNow(fmt.format(new Date()))
    const first = setTimeout(tick, 0)
    const id = setInterval(tick, 1000)
    return () => {
      clearTimeout(first)
      clearInterval(id)
    }
  }, [timeZone])

  return <span className="font-mono tabular-nums">{now ?? '--:--:--'}</span>
}
