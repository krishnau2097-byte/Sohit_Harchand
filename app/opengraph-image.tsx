import { ImageResponse } from 'next/og'
import { profile } from '@/content/profile'

export const alt = `${profile.initials} — ${profile.role}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/** Social preview card in the site's gold-on-black palette. */
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
          background: 'radial-gradient(70% 80% at 75% 25%, #3a2e1c 0%, #0a0908 70%)',
          color: '#f3ece0',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 22, letterSpacing: 6, color: '#e2c285', textTransform: 'uppercase' }}>{profile.eyebrow}</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 150, fontWeight: 800, letterSpacing: -4, color: '#e2c285', lineHeight: 1 }}>{profile.heroWords[0]}</div>
          <div style={{ fontSize: 56, fontWeight: 700, marginTop: 16 }}>{profile.role}</div>
          <div style={{ fontSize: 30, color: '#bdb4a5', marginTop: 12 }}>{profile.tagline}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, color: '#8f8778' }}>
          <span>{profile.headline}</span>
          <span>{profile.location}</span>
        </div>
      </div>
    ),
    { ...size },
  )
}
