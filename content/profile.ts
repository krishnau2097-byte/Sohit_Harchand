/**
 * Everything personal lives here. Components never hard-code copy.
 * Source of truth: Sohit_Resume_Updated.docx. Keep this file in step with the résumé.
 */
import { projects } from './projects'
import { skills } from './skills'
import { experience } from './experience'

export const profile = {
  /** Used only in machine-readable metadata (JSON-LD); the site shows the SH monogram instead. */
  name: 'Sohit Harchand',
  initials: 'SH',
  brand: 'Based in Amritsar, India · working with teams anywhere',
  role: 'Power Platform & Dynamics 365 Developer',
  /** The big gold line in the hero (where the name used to be). */
  title: 'D365 & Power Platform Developer',
  headline: 'Copilot Studio & Azure OpenAI Agents',
  focus: 'Dynamics 365 · Power Platform · AI agents',
  eyebrow: 'Dynamics 365 · Power Platform · AI Agents',

  /** Giant hero word + alternates cycled with scrambleText. Keep them 8–10 letters so the fit stays even. */
  heroWords: ['DEVELOPER', 'DYNAMICS', 'AUTOMATOR', 'AI AGENTS'],

  tagline: 'CRM, automation and AI agents that ship.',
  /** Big badge on the right of the hero. */
  yearsBadge: { value: '2+', label: 'Years · Microsoft stack' },
  pitch:
    'Microsoft Dynamics 365 and Power Platform Developer with 2+ years of experience delivering enterprise CRM, workflow automation and AI agent solutions on the Microsoft stack.',

  /** Full-width manifesto revealed under the hero card. First sentence = statement, the rest = detail. */
  manifesto:
    'I build Dynamics 365, Power Platform and AI agent solutions that run real business processes. Copilot Studio and Azure OpenAI agents for document analysis, employee onboarding and assessment evaluation, AI-driven tooling that migrates Qlik and Tableau models to Microsoft Fabric, and D365 CE delivered for multiple clients, shipped through Azure DevOps from Dev to UAT to Production.',

  about: [
    'I am a Microsoft Dynamics 365 and Power Platform Developer with 2+ years of experience delivering enterprise CRM, workflow automation and AI agent solutions on the Microsoft stack.',
    'At AOSC I deliver Dynamics 365 CE (Sales, Customer Service, Field Service) for multiple clients, build end-to-end Power Platform solutions, and extend them with C#/.NET plugins, TypeScript PCF controls and Azure integrations.',
    'I have built Copilot Studio and Azure OpenAI agents for document analysis, employee onboarding and assessment evaluation, plus AI-driven tooling that migrates Qlik and Tableau semantic models to Microsoft Fabric using TMDL. Alongside work I am studying for my MCA at Lovely Professional University.',
  ],

  location: 'Amritsar, Punjab, India',
  /** IANA time zone for the live clock. */
  timeZone: 'Asia/Kolkata',
  email: 'thakursaabji9@gmail.com',
  phone: '',
  /** Set to '/resume.pdf' after adding public/resume.pdf; empty hides the download buttons. */
  resumeUrl: '',

  availability: {
    open: true,
    label: 'Open to new roles & projects',
    detail: 'Happy to talk about full-time roles and project work.',
  },

  /** The giant gold word at the very bottom of the footer (where the name used to be). */
  footerWord: 'POWER PLATFORM',
  footerTagline: 'Dynamics 365 · Power Platform · Copilot Studio & Azure OpenAI',

  socials: [
    { label: 'LinkedIn', handle: 'View profile', href: 'https://www.linkedin.com/in/sohit-thakur-6ab058317' },
    { label: 'Email', handle: 'thakursaabji9@gmail.com', href: 'mailto:thakursaabji9@gmail.com' },
  ],

  /** Services pill bar across the top of the hero (marquee on mobile). */
  services: ['Dynamics 365 CE', 'Power Apps', 'Power Automate', 'Copilot Studio Agents', 'Azure OpenAI', 'Dataverse', 'Azure Functions', 'Microsoft Fabric'],

  /** Tech chips shown above the H1. */
  techChips: ['Dynamics 365', 'Power Platform', 'Copilot Studio', 'Azure'],
} as const

/**
 * Production URL. Set NEXT_PUBLIC_SITE_URL once a custom domain exists;
 * on Vercel the project's production URL is used automatically.
 */
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
export const site = {
  url: process.env.NEXT_PUBLIC_SITE_URL || (vercelUrl ? `https://${vercelUrl}` : 'http://localhost:3000'),
  title: `${profile.initials} — ${profile.role}`,
  description:
    'Power Platform and Dynamics 365 developer building enterprise CRM, workflow automation and Copilot Studio / Azure OpenAI agent solutions on the Microsoft stack.',
}

/** Every number is counted from the résumé content, so it stays true when that content changes. */
export const stats = [
  { value: 2, suffix: '+', label: 'Years on the Microsoft stack' },
  { value: projects.length, suffix: '', label: 'Projects on my résumé' },
  { value: experience[0].apps.length, suffix: '', label: 'Dynamics 365 CE apps delivered' },
  { value: 10, suffix: '', label: 'Azure Container Apps analysed with KQL' },
  { value: 3, suffix: '', label: 'Stages per release: Dev, UAT, Prod' },
  { value: skills.length, suffix: '', label: 'Tools & technologies in my stack' },
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
