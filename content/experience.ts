/** Career and education, as listed on the résumé. */

export type ExperienceType = 'Full-time' | 'Freelance' | 'Internship' | 'Community'

export type Experience = {
  role: string
  company: string
  type: ExperienceType
  start: string
  end: string
  location: string
  summary: string
  /** Dynamics 365 CE apps delivered for clients. */
  apps: string[]
  achievements: string[]
  impact: { value: string; label: string }[]
  tech: string[]
}

export const experience: Experience[] = [
  {
    role: 'Microsoft Dynamics 365 & Power Platform Developer',
    company: 'AOSC',
    type: 'Full-time',
    start: '2024',
    end: 'Present',
    location: 'Multiple clients',
    summary:
      'Delivering Dynamics 365 CE and end-to-end Power Platform solutions for multiple clients, including Copilot Studio agents using Azure OpenAI and AI Builder, extended with plugins, PCF controls and Azure integrations.',
    apps: ['Sales', 'Customer Service', 'Field Service'],
    achievements: [
      'Delivered Dynamics 365 CE solutions (Sales, Customer Service, Field Service) for multiple clients: Business Process Flows, views, dashboards and role-based security.',
      'Built end-to-end Power Platform solutions (Power Apps, Power Automate, Power Pages, Power BI, Dataverse), including Copilot Studio agents using Azure OpenAI and AI Builder.',
      'Developed Dynamics 365 plugins (C#/.NET) and PCF controls (TypeScript) for business-rule enforcement, entity automation and custom form components.',
      'Built back-end automation and integrations with Azure Functions, Logic Apps, Service Bus, the Dataverse Web API and REST APIs: webhook handling, async processing and third-party enterprise systems.',
      'Deployed solutions through Azure DevOps CI/CD pipelines across Dev → UAT → Production; managed sprint work items on Azure DevOps Boards in Agile/Scrum teams.',
      'Created SQL Server data models and stored procedures for compliance reporting, analytics and data migrations.',
    ],
    impact: [
      { value: '3', label: 'D365 CE apps delivered' },
      { value: 'C# · TS', label: 'plugins & PCF controls' },
      { value: 'Dev→Prod', label: 'Azure DevOps CI/CD' },
    ],
    tech: ['Dynamics 365 CE', 'Power Apps', 'Power Automate', 'Dataverse', 'Copilot Studio', 'Azure OpenAI', 'C#/.NET', 'TypeScript', 'Azure Functions', 'Azure DevOps'],
  },
]

export type Education = { title: string; school: string; detail: string; years: string; location: string; tags: string[] }

export const education: Education[] = [
  {
    title: 'Master of Computer Applications (MCA)',
    school: 'Lovely Professional University',
    detail: 'Postgraduate degree, in progress',
    years: '2024 – Present',
    location: 'Jalandhar, Punjab',
    tags: [],
  },
  {
    title: 'Bachelor of Computer Applications (BCA)',
    school: 'Guru Nanak Dev University',
    detail: 'Undergraduate degree',
    years: '2021 – 2024',
    location: 'Amritsar, Punjab',
    tags: [],
  },
]

/** Milestones, dated only where the résumé gives the year. */
export const achievements = [
  { title: 'Started BCA at Guru Nanak Dev University', year: '2021', detail: 'Bachelor of Computer Applications, Amritsar.' },
  { title: 'Joined AOSC', year: '2024', detail: 'Microsoft Dynamics 365 & Power Platform Developer, delivering D365 CE, Power Platform and Copilot Studio solutions for multiple clients.' },
  { title: 'Completed BCA, started MCA', year: '2024', detail: 'Graduated from Guru Nanak Dev University and began the Master of Computer Applications at Lovely Professional University, Jalandhar.' },
]
