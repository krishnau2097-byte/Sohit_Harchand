/**
 * Everything personal lives here. Components never hard-code copy.
 * Source of truth: Sohit_Resume_Updated.docx. Keep this file in step with the résumé.
 */

export const profile = {
  /** Used only in machine-readable metadata (JSON-LD), never shown on the page. */
  name: 'Sohit Harchand',
  /** The visible brand: the site shows the signature monogram instead of a name. */
  monogram: 'SH',
  role: 'Power Platform & Dynamics 365 Developer',
  headline: 'Copilot Studio & Azure OpenAI Agents',
  eyebrow: 'Dynamics 365 · Power Platform · AI Agents',

  /** Hero sentence: "I build <word> on the Microsoft stack." The word cycles; keep each under ~20 characters so it fits one line on phones. */
  heroWords: ['CRM solutions', 'Copilot agents', 'automated workflows', 'Fabric migrations'],

  summary:
    'Microsoft Dynamics 365 and Power Platform Developer with 2+ years of experience delivering enterprise CRM, workflow automation and AI agent solutions on the Microsoft stack.',

  about: [
    'I am a Microsoft Dynamics 365 and Power Platform Developer with 2+ years of experience delivering enterprise CRM, workflow automation and AI agent solutions on the Microsoft stack.',
    'I have built Copilot Studio and Azure OpenAI agents for document analysis, employee onboarding and assessment evaluation, plus AI-driven tooling that migrates Qlik and Tableau semantic models to Microsoft Fabric using TMDL.',
    'Day to day I work with PCF controls (TypeScript), Power Apps, Power Automate, Dataverse, Azure Functions and Azure DevOps CI/CD, taking solutions from Dev through UAT to Production.',
  ],

  location: 'Amritsar, Punjab, India',
  /** IANA time zone for the live clock. */
  timeZone: 'Asia/Kolkata',
  email: 'thakursaabji9@gmail.com',

  availability: 'Open to new roles and projects',

  socials: [
    { label: 'LinkedIn', handle: 'View my profile', href: 'https://www.linkedin.com/in/sohit-thakur-6ab058317' },
    { label: 'Email', handle: 'thakursaabji9@gmail.com', href: 'mailto:thakursaabji9@gmail.com' },
  ],
} as const

/** Footer "Services" column, in the reference site's style. */
export const services = [
  'Dynamics 365 CE Solutions',
  'Power Apps & Power Pages',
  'Power Automate & Azure Integration',
  'Copilot Studio & Azure OpenAI Agents',
  'Microsoft Fabric & Power BI',
]

/**
 * Production URL. Set NEXT_PUBLIC_SITE_URL once a custom domain exists;
 * on Vercel the project's production URL is used automatically.
 */
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
export const site = {
  url: process.env.NEXT_PUBLIC_SITE_URL || (vercelUrl ? `https://${vercelUrl}` : 'http://localhost:3000'),
  title: `${profile.monogram} — ${profile.role}`,
  description:
    'Power Platform and Dynamics 365 developer building enterprise CRM, workflow automation and Copilot Studio / Azure OpenAI agent solutions on the Microsoft stack.',
}

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact', href: '/contact' },
] as const
