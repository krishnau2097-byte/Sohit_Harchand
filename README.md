# Portfolio — paper & brass, scroll-driven, 3D, playable

A dark editorial portfolio built from the reference analysis: the Pinterest pin's
text-behind-portrait hero and gold palette, Suneha Saini's four-route content
model, the GitHub-topic interaction patterns, and **Anime.js v4.5** as the single
animation engine, plus one **Three.js** scene for the 3D project ribbon.

```
Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4
Anime.js 4.5 · Three.js 0.186 · Lenis smooth scroll
```

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (all routes pre-render as static)
npm run lint
```

## Make it yours (all content lives in `/content`)

| File | What to change |
| --- | --- |
| `content/profile.ts` | Name, initials, role, hero words, tagline, pitch, manifesto, about text, location, time zone, email, socials, services pill bar, tech chips, stats, availability |
| `content/story.ts` | The three pinned scroll-story chapters |
| `content/skills.ts` | The "periodic table" tiles (symbol, name, years, category) |
| `content/experience.ts` | Roles, achievements, impact numbers, education, achievements |
| `content/certifications.ts` | Certification badges |
| `content/projects.ts` | Projects for the 3D ribbon, grid and case-study pages |
| `content/services.ts` | Service cards, recommendations, technology marquee |

**Everything in those files is placeholder copy written from the plan. Replace it
with your own facts before publishing**, especially the numbers and the
recommendations (use real LinkedIn recommendations, with permission).

### Assets to add in `/public`

- `portrait-cutout.webp`: a background-removed, chest-up portrait (under 150 KB).
  Then set `portrait: '/portrait-cutout.webp'` in `content/profile.ts`. Until then a
  lit silhouette stands in. If your head sits higher or lower in the photo than
  in the silhouette, tune `HEAD_TOP` in `components/home/Hero.tsx`. With a real
  photo the page shows a warm duotone and the hero lens reveals the true colours.
- `resume.pdf`: the résumé buttons link to it (currently missing, so they 404).
- `projects/<slug>.webp` (1600×1000): real screenshots. Add `image: '/projects/<slug>.webp'`
  to a project. Without one, `lib/projectMock.ts` draws a mock interface for it.

### Contact form

Copy `.env.example` to `.env.local` and set **one** option:

- `CONTACT_WEBHOOK_URL`: any HTTPS webhook, e.g. a Power Automate
  "When an HTTP request is received" flow (a nice showcase of your own stack), or
- `RESEND_API_KEY` + `CONTACT_TO_EMAIL` (+ `CONTACT_FROM_EMAIL` on a verified domain).

With neither set, development logs messages to the server console and production
answers 503, so nothing is silently dropped.

Also set `site.url` in `content/profile.ts` to your domain (used for SEO,
the sitemap and Open Graph).

## Palette

Light is the default; visitors can switch to dark with the toggle (remembered).

| Token | Light (default) | Dark |
| --- | --- | --- |
| Background | `#f4eee4` paper | `#0a0908` obsidian |
| Surface | `#fffcf6` | `#171411` |
| Ink | `#17130e` | `#f3ece0` cream |
| Gold (primary) | `#8a6420` brass | `#e2c285` |
| Ember (accent) | `#c8401a` | `#ff6a3d` |
| Teal (data skills) | `#2f6f68` | `#7cc7b6` |
| Colour block | black with cream text | gold with black text |

Tokens live in `app/globals.css` (`:root, [data-theme="light"]` and
`[data-theme="dark"]`). Any element can carry `data-theme` to switch its own
tokens, which is how the hero lens shows the opposite theme.

## Effect → code map

| Effect | Where | Built with |
| --- | --- | --- |
| First-visit loader (monogram draw, 0→100 counter, curtain) | `components/Loader.tsx` | `svg.createDrawable`, `createTimeline` |
| Hero: giant word behind the portrait, services pill marquee | `components/home/Hero.tsx` | CSS layers, measured with JS so the head overlaps the letters |
| Rotating hero word | same | `scrambleText` + `createTimer` |
| Name letters rise | same | `splitText` + `stagger` |
| Mouse parallax (4 depths) | same | `createAnimatable` |
| Hero lens: the other theme (and a hidden note) under the cursor; drifts on its own on phones | same | a second art layer with `data-theme` flipped, clipped by `clip-path: circle()` |
| Floating 3D card stack (Spline stand-in) | `components/home/HeroObject3D.tsx` | Three.js + `animejs/adapters/three` |
| Dark card shrinks and lifts to reveal the gold manifesto | same | `createTimeline` + `onScroll({ sync: true })` |
| Pinned story: images wipe, text swaps, art animates | `components/home/ScrollStory.tsx` | 320vh sticky stage, one scroll-synced timeline |
| Skill cards: dealt in from the centre, tilt + spotlight + shine, click to flip (spring) with a ripple across the grid, sort / shuffle with FLIP | `components/home/skills/SkillCards.tsx` | `stagger({ grid, from })`, `spring`, `createLayout` |
| Skills play mode: bubbles you grab, throw, sweep and shake, with zero-gravity | `components/home/skills/SkillPlayground.tsx` | small custom physics solver + Anime.js for the UI |
| Timeline line draws with scroll | `components/home/Timeline.tsx` | `svg.createDrawable` + `onScroll` sync |
| 3D project ribbon: scroll, drag with inertia, hover, click to open | `components/home/Ribbon3D.tsx` | Three.js, `createDraggable` on a plain object + `spring`, adapter |
| Coverflow fallback (phones / no WebGL) | `components/home/Coverflow.tsx` | `createDraggable` with snap |
| Project modal (FLIP from the clicked element) | `components/projects/ProjectModal.tsx` | `createTimeline` |
| Filter reshuffle on /projects | `components/projects/ProjectsGrid.tsx` | `createLayout` |
| Counters, marquees, services, recommendations carousel | `components/home/Proof.tsx`, `components/ui/*` | `animate`, `waapi.animate`, `createDraggable` |
| Variable-font headline reacting to the cursor | `components/home/ContactSection.tsx` | `splitText` + animated `--wdth`/`--wght` |
| Scroll-spy navbar underline, hide-on-scroll | `components/Navbar.tsx` | `onScroll` enter/leave callbacks |
| Full-screen menu (circle reveal) | same | `clipPath` timeline |
| Colour-inverting cursor (grows over headings and links), label bubble, magnetic buttons | `components/ui/Cursor.tsx`, `Magnetic.tsx` | `mix-blend-mode: difference`, `createAnimatable`, `spring` |
| Page transition curtain naming the next page | `app/template.tsx` | `scrambleText`, `clipPath` timeline |
| Letter-roll link hovers | `components/ui/RollText.tsx` | CSS, staggered per letter |
| Marquees speed up and lean with scroll | `components/ui/Marquee.tsx`, `lib/motion.ts` | `waapi.animate` + scroll velocity |
| Spotlight + tilt on project and service cards (spotlight on certifications); reading-progress bar | `lib/interactions.ts`, `components/BackToTop.tsx` | `animate` with `perspective` |
| Smooth scroll | `components/providers/SmoothScroll.tsx` | Lenis (mouse/trackpad only) |

Every component builds its animations inside `createScope({ root })` (see
`hooks/useAnimeScope.ts`) and reverts them on unmount, with `mediaQueries` to
swap motion between phone and desktop.

## Fallbacks and performance

- **Reduced motion**: the head script adds `.reduce-motion`; the loader,
  pinning, parallax, cursor effects and loops are skipped and content renders in
  its final state. The ribbon becomes a plain grid.
- **Phones**: native scroll, a stacked story instead of the pin, and a coverflow
  instead of WebGL.
- **Three.js** loads only when the ribbon is about a screen away, the hero object
  loads when the browser is idle, pixel ratio is capped at 2, and render loops
  pause off-screen or in hidden tabs.
- Animations stay on transform, opacity and clip-path.

## Deploy

Push to GitHub and import the repo on Vercel (zero config), then add the
contact-form environment variables in the Vercel project settings.
