# Portfolio: Dynamics 365 & Power Platform developer

A light, fast, four-page portfolio (Home, About, Projects, Contact). The visible
brand is an animated **SH** signature; the site shows no name and no images.
Every fact comes from the résumé (`Sohit_Resume_Updated.docx`).

```
Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4
No animation or 3D libraries: motion is CSS plus a few small client components.
```

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (all pages pre-render as static)
npm run lint
```

## Edit the content (all of it lives in `/content`)

| File | What it holds |
| --- | --- |
| `content/profile.ts` | Role, headline, hero words, summary, about text, location, email, socials, footer services, nav |
| `content/skills.ts` | Core skills, grouped as on the résumé |
| `content/experience.ts` | Work history and education |
| `content/projects.ts` | The 8 selected projects (with case-study pages) and the additional projects |

Keep these in step with the résumé. Numbers on the site are counted from this
data (projects, D365 apps, skills), so they stay accurate when it changes.

### Résumé download

Drop the PDF at `public/resume.pdf`. The "Résumé" button in the hero appears
automatically on the next build; without the file there is no button (no 404).

### Contact form

Copy `.env.example` to `.env.local` and set **one** option:

- `CONTACT_WEBHOOK_URL`: any HTTPS webhook, e.g. a Power Automate
  "When an HTTP request is received" flow, or
- `RESEND_API_KEY` + `CONTACT_TO_EMAIL` (+ `CONTACT_FROM_EMAIL` on a verified domain).

With neither set, development logs messages to the server console and production
shows "The contact form is not configured yet", so nothing is silently dropped.

### Site URL

On Vercel the production URL is picked up automatically. For a custom domain,
set `NEXT_PUBLIC_SITE_URL=https://your-domain` (used for SEO, the sitemap and
Open Graph).

## Dynamic pieces

| Piece | Where | How |
| --- | --- | --- |
| SH signature draws itself, spark on hover | `components/ui/Signature.tsx` | SVG stroke animation (CSS) |
| Hero typing line | `components/ui/TypedWords.tsx` | small timer; pauses in hidden tabs |
| "How I deliver" pipeline lights up step by step | `components/home/Hero.tsx` | CSS keyframes only |
| Count-up stats | `components/ui/CountUp.tsx` | IntersectionObserver + rAF |
| Skill category tabs | `components/SkillsGrid.tsx` | React state, cards pop in |
| Project filter | `components/ProjectsGrid.tsx` | React state, cards pop in |
| Scroll reveals, card spotlight glow | `components/Interactions.tsx` | one observer + one pointer listener |
| Reading progress, back-to-top ring | `components/BackToTop.tsx` | rAF-throttled scroll listener |
| Light/dark toggle (light by default) | `components/ThemeToggle.tsx` | `data-theme` on `<html>` |

All motion respects `prefers-reduced-motion`. Content above the fold animates
with CSS on first paint (`.rise`), so it never waits for JavaScript.

## Palette

Tokens live in `app/globals.css`. Light is the default; dark is opt-in.

| Token | Light | Dark |
| --- | --- | --- |
| Background | `#f7f4ee` | `#13110e` |
| Surface | `#fffdf9` | `#1c1914` |
| Ink | `#1d1913` | `#f2ebdf` |
| Gold (primary) | `#86601d` | `#e2c285` |
| Ember (accent) | `#b9531f` | `#f08a55` |
