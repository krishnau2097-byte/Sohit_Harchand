import type { Metadata, Viewport } from 'next'
import { Archivo, Inter, Instrument_Serif, JetBrains_Mono, Alex_Brush } from 'next/font/google'
import './globals.css'
import { profile, site } from '@/content/profile'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Loader } from '@/components/Loader'
import { Cursor } from '@/components/ui/Cursor'
import { BackToTop } from '@/components/BackToTop'
import { SmoothScroll } from '@/components/providers/SmoothScroll'

/* Archivo carries a width axis (62–125): one variable font gives the wide
   editorial display face and the condensed variant for phones. */
const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-archivo', display: 'swap' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const instrument = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-instrument', display: 'swap' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-jetbrains', display: 'swap' })
const alexBrush = Alex_Brush({ subsets: ['latin'], weight: '400', variable: '--font-signature', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s — ${profile.name}` },
  description: site.description,
  openGraph: { type: 'website', title: site.title, description: site.description, url: site.url, siteName: profile.name },
  twitter: { card: 'summary_large_image', title: site.title, description: site.description },
  alternates: { canonical: '/' },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f1e9' },
    { media: '(prefers-color-scheme: dark)', color: '#101311' },
  ],
}

/* Runs before first paint: theme, JS flag, reduced motion, loader skip. */
const boot = `(function(){var d=document.documentElement;try{d.classList.add('js');var t=localStorage.getItem('theme');d.dataset.theme=(t==='light'||t==='dark')?t:'light';if(matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('reduce-motion')}else if(sessionStorage.getItem('loader-seen')){d.classList.add('loader-skip')}else{d.classList.add('is-loading')}}catch(e){d.dataset.theme='light'}})();`

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  jobTitle: profile.role,
  description: profile.pitch,
  url: site.url,
  email: `mailto:${profile.email}`,
  address: { '@type': 'PostalAddress', addressLocality: profile.location },
  sameAs: profile.socials.filter((s) => s.href.startsWith('http')).map((s) => s.href),
  knowsAbout: ['Microsoft Power Platform', 'SharePoint', 'Dynamics 365', 'Copilot Studio', 'Azure'],
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${archivo.variable} ${inter.variable} ${instrument.variable} ${jetbrains.variable} ${alexBrush.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </head>
      <body className="min-h-screen">
        <a href="#main" className="sr-only z-[100] rounded-full bg-gold px-4 py-2 text-on-gold focus:not-sr-only focus:fixed focus:top-4 focus:left-4">
          Skip to content
        </a>
        <SmoothScroll />
        <Loader />
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <BackToTop />
        <Cursor />
      </body>
    </html>
  )
}
