/** Career and education, as listed on the résumé. */

export type Experience = {
  role: string
  company: string
  start: string
  end: string
  /** Dynamics 365 apps delivered for clients. */
  apps: string[]
  achievements: string[]
  tech: string[]
}

export const experience: Experience[] = [
  {
    role: 'Microsoft Dynamics 365 & Power Platform Developer',
    company: 'AOSC',
    start: '2024',
    end: 'Present',
    apps: ['Sales', 'Customer Service', 'Field Service'],
    achievements: [
      'Delivered Dynamics 365 CE solutions (Sales, Customer Service, Field Service) for multiple clients: Business Process Flows, views, dashboards and role-based security.',
      'Built end-to-end Power Platform solutions (Power Apps, Power Automate, Power Pages, Power BI, Dataverse), including Copilot Studio agents using Azure OpenAI and AI Builder.',
      'Developed Dynamics 365 plugins (C#/.NET) and PCF controls (TypeScript) for business-rule enforcement, entity automation and custom form components.',
      'Built back-end automation and integrations with Azure Functions, Logic Apps, Service Bus, the Dataverse Web API and REST APIs: webhook handling, async processing and third-party enterprise systems.',
      'Deployed solutions through Azure DevOps CI/CD pipelines across Dev → UAT → Production; managed sprint work items on Azure DevOps Boards in Agile/Scrum teams.',
      'Created SQL Server data models and stored procedures for compliance reporting, analytics and data migrations.',
    ],
    tech: ['Dynamics 365 CE', 'Power Apps', 'Power Automate', 'Dataverse', 'Copilot Studio', 'Azure OpenAI', 'C#/.NET', 'TypeScript', 'Azure Functions', 'Azure DevOps'],
  },
]

export type Education = { title: string; school: string; location: string; years: string }

export const education: Education[] = [
  { title: 'Master of Computer Applications (MCA)', school: 'Lovely Professional University', location: 'Jalandhar', years: '2024 – Present' },
  { title: 'Bachelor of Computer Applications (BCA)', school: 'Guru Nanak Dev University', location: 'Amritsar', years: '2021 – 2024' },
]
