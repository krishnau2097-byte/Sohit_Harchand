import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono, Alex_Brush } from 'next/font/google'
import './globals.css'
import { profile, site } from '@/content/profile'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { BackToTop } from '@/components/BackToTop'
import { Interactions } from '@/components/Interactions'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-jetbrains', display: 'swap' })
/* Only the monogram uses this face, so it does not block first paint. */
const alexBrush = Alex_Brush({ subsets: ['latin'], weight: '400', variable: '--font-signature', display: 'swap', preload: false })

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s — ${profile.monogram}` },
  description: site.description,
  openGraph: { type: 'website', title: site.title, description: site.description, url: site.url, siteName: profile.monogram },
  twitter: { card: 'summary_large_image', title: site.title, description: site.description },
  alternates: { canonical: '/' },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f4ee' },
    { media: '(prefers-color-scheme: dark)', color: '#13110e' },
  ],
}

/* Runs before first paint: saved theme (light by default) and the JS flag that arms scroll reveals. */
const boot = `(function(){var d=document.documentElement;d.classList.add('js');try{var t=localStorage.getItem('theme');d.dataset.theme=t==='dark'?'dark':'light'}catch(e){d.dataset.theme='light'}})();`

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  jobTitle: profile.role,
  description: profile.summary,
  url: site.url,
  email: `mailto:${profile.email}`,
  address: { '@type': 'PostalAddress', addressLocality: profile.location },
  sameAs: profile.socials.filter((s) => s.href.startsWith('http')).map((s) => s.href),
  knowsAbout: ['Microsoft Dynamics 365', 'Microsoft Power Platform', 'Copilot Studio', 'Azure OpenAI', 'Microsoft Fabric'],
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning className={`${inter.variable} ${jetbrains.variable} ${alexBrush.variable} antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </head>
      <body className="min-h-screen">
        <a href="#main" className="sr-only z-[100] rounded-lg bg-gold px-4 py-2 text-on-gold focus:not-sr-only focus:fixed focus:top-4 focus:left-4">
          Skip to content
        </a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <BackToTop />
        <Interactions />
      </body>
    </html>
  )
}
