/** Services cards and recommendations. */

export const services = [
  {
    title: 'Power Platform Apps',
    body: 'Canvas and model-driven apps, Power Pages portals and flows on a clean Dataverse model.',
    points: ['Discovery & prototyping', 'Dataverse design', 'Offline & mobile'],
    icon: 'apps',
  },
  {
    title: 'React & Web Development',
    body: 'Modern React and Next.js applications with premium UI/UX, responsive design and smooth animations.',
    points: ['Component architecture', 'Performance optimisation', 'API integration'],
    icon: 'integration',
  },
  {
    title: 'SharePoint Intranets',
    body: 'Modern SharePoint sites and document management that staff can navigate and search.',
    points: ['Site design', 'Lists & libraries', 'Migration'],
    icon: 'intranet',
  },
  {
    title: 'AI & LLM Integration',
    body: 'AI-powered solutions using OpenAI, LangChain, Copilot Studio, and custom ML models for intelligent automation.',
    points: ['RAG pipelines', 'Prompt engineering', 'Copilot Studio agents'],
    icon: 'agent',
  },
  {
    title: 'Data & Analytics',
    body: 'Power BI dashboards, data pipelines, and migration tools that turn raw data into actionable insights.',
    points: ['Power BI reports', 'Data modelling', 'Migration platforms'],
    icon: 'crm',
  },
] as const

export type ServiceIcon = (typeof services)[number]['icon']

export const testimonials = [
  {
    quote:
      'Sohit delivered the Switchblade frontend ahead of schedule. His React code is clean, well-structured, and the migration wizard he built made a complex process intuitive.',
    name: 'Team Lead',
    title: 'AOSC Technologies',
  },
  {
    quote:
      'Great attention to detail in the SharePoint intranet project. The document management structure he set up has been adopted by the whole organisation.',
    name: 'Project Manager',
    title: 'AOSC Technologies Client',
  },
  {
    quote:
      'The AI-powered learning platform Sohit built exceeded our expectations. Learner engagement metrics doubled within the first month.',
    name: 'Product Owner',
    title: 'AOSC Technologies',
  },
]

/** Words for the technology marquee. */
export const marqueeWords = [
  'React.js',
  'Power Platform',
  'Python',
  'Next.js',
  'SharePoint',
  'Copilot Studio',
  'Power BI',
  'TypeScript',
  'OpenAI',
  'LangChain',
  'Tailwind CSS',
  'FastAPI',
]
