import { ImageResponse } from 'next/og'
import { profile } from '@/content/profile'

export const alt = `${profile.monogram} — ${profile.role}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/** Social preview card in the site's light cream-and-gold palette. */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'radial-gradient(60% 70% at 85% 15%, #ecd9b4 0%, #f7f4ee 65%)',
          color: '#1d1913',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 24, letterSpacing: 5, color: '#86601d', textTransform: 'uppercase' }}>{profile.eyebrow}</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 140, fontStyle: 'italic', fontFamily: 'serif', color: '#86601d', lineHeight: 1 }}>{profile.monogram}</div>
          <div style={{ fontSize: 54, fontWeight: 700, marginTop: 24 }}>{profile.role}</div>
          <div style={{ fontSize: 30, color: '#4c453b', marginTop: 12 }}>{profile.headline}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, color: '#6f665a' }}>
          <span>Dynamics 365 · Power Platform · Azure</span>
          <span>{profile.location}</span>
        </div>
      </div>
    ),
    { ...size },
  )
}
