/**
 * Everything personal lives here. Components never hard-code copy.
 */

export const profile = {
  name: 'Sohit Harchand',
  initials: 'SH',
  brand: 'Based in Punjab, India · working with teams anywhere',
  role: 'Power Platform & React Developer',
  eyebrow: 'Power Platform · React · AI/ML',

  /** Giant hero word + alternates cycled with scrambleText. Keep them 8–10 letters so the fit stays even. */
  heroWords: ['DEVELOPER', 'AUTOMATOR', 'INNOVATOR', 'ENGINEER'],

  tagline: 'Apps that ship. Automation that lasts.',
  /** Big badge on the right of the hero. */
  yearsBadge: { value: '2+', label: 'Years · Microsoft & React stack' },
  pitch:
    'I build enterprise solutions: Power Apps, Power Automate flows, React frontends, and AI-powered tools that transform how teams work — from report migration platforms to intelligent learning systems.',

  /** Shown as the full-width manifesto revealed under the hero card. */
  manifesto:
    'Two years of turning complex business problems into elegant digital solutions. From migrating Tableau reports to Power BI at scale, to building AI-powered learning platforms — I learn fast, build carefully and keep shipping until the problem is really solved.',

  about: [
    'I started my career in 2024 as a Power Platform Intern at AOSC Technologies in Punjab, building canvas apps and automated workflows for enterprise clients.',
    'Since then I have grown into a Power Platform & React Developer, leading frontend development for migration platforms like Switchblade, building AI-enabled learning tools, and delivering SharePoint solutions and Power BI reports for businesses across India.',
    'Right now I am deepening my expertise in React, Python backend development, LLM integration, and Copilot Studio agents while pursuing my MCA with AI/ML specialization at LPU.',
  ],

  location: 'Pathankot, Punjab, India',
  /** IANA time zone for the live clock, e.g. 'Australia/Sydney' or 'Europe/London'. */
  timeZone: 'Asia/Kolkata',
  email: 'Thakursaabji9@gmail.com',
  phone: '',
  resumeUrl: '/resume.pdf',

  availability: {
    open: true,
    label: 'Open to new roles & projects',
    detail: 'Happy to talk about full-time roles and freelance builds.',
  },

  /** Set to real user transparent cutouts from /image folder */
  portrait: '/images/portrait-cutout.webp',
  aboutPortrait: '/images/portrait-full-cutout.webp',

  socials: [
    { label: 'LinkedIn', handle: '/in/sohit-harchand', href: 'https://www.linkedin.com/in/sohit-harchand' },
    { label: 'GitHub', handle: '@sohitharchand', href: 'https://github.com/sohitharchand' },
    { label: 'Email', handle: 'Thakursaabji9@gmail.com', href: 'mailto:Thakursaabji9@gmail.com' },
  ],

  /** Services pill bar across the top of the hero (marquee on mobile). */
  services: [
    'Power Apps',
    'Power Automate',
    'React.js',
    'Copilot Studio Agents',
    'Python',
    'Power BI',
    'SharePoint',
    'AI/ML',
  ],

  /** Tech chips shown above the H1. */
  techChips: ['Power Platform', 'React', 'Python', 'AI/ML'],
} as const

export const site = {
  url: 'https://sohitharchand.com',
  title: 'Sohit Harchand — Power Platform & React Developer',
  description:
    'Portfolio of Sohit Harchand, a Power Platform & React Developer with experience building migration platforms, AI-powered tools, and enterprise automation solutions.',
}

export const stats = [
  { value: 2, suffix: '+', label: 'Years building enterprise solutions' },
  { value: 8, suffix: '+', label: 'Projects shipped to production' },
  { value: 5, suffix: '+', label: 'Teams & clients supported' },
  { value: 50, suffix: '+', label: 'Automated workflows running' },
  { value: 1, suffix: 'k+', label: 'Users on solutions I built' },
  { value: 24, suffix: '+', label: 'Tools & technologies mastered' },
]

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Skills', href: '/about#skills' },
  { label: 'Experience', href: '/about#experience' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact', href: '/contact' },
] as const

/** Sections tracked by the scroll-spy underline on the home page. */
export const homeSections = [
  { id: 'home', label: 'Home' },
  { id: 'story', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
] as const
