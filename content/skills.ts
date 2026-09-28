/**
 * Skills shown as flip cards and as the physics playground.
 * Real skills based on work at AOSC Technologies and academic background.
 */

export type SkillCategory = 'platform' | 'm365' | 'ai' | 'data' | 'dev'
export type SkillLevel = 'Core' | 'Strong' | 'Growing'

export const skillCategories: Record<SkillCategory, { label: string; tone: string }> = {
  platform: { label: 'Power Platform', tone: 'var(--cat-platform)' },
  m365: { label: 'Microsoft 365 & SharePoint', tone: 'var(--cat-m365)' },
  ai: { label: 'AI & Copilot', tone: 'var(--cat-ai)' },
  data: { label: 'Data & Analytics', tone: 'var(--cat-data)' },
  dev: { label: 'Code & Integration', tone: 'var(--cat-dev)' },
}

export const levelRank: Record<SkillLevel, number> = { Core: 3, Strong: 2, Growing: 1 }

export type Skill = {
  symbol: string
  name: string
  years: number
  level: SkillLevel
  category: SkillCategory
  /** Shown on the back of the card. */
  note: string
}

export const skills: Skill[] = [
  { symbol: 'Pa', name: 'Power Apps', years: 2, level: 'Core', category: 'platform', note: 'Canvas and model-driven apps, offline forms, custom components.' },
  { symbol: 'Au', name: 'Power Automate', years: 2, level: 'Core', category: 'platform', note: 'Approvals, scheduled jobs, error handling and child flows.' },
  { symbol: 'Bi', name: 'Power BI', years: 2, level: 'Strong', category: 'platform', note: 'Star-schema models, DAX measures, Power Query and row-level security.' },
  { symbol: 'Px', name: 'Power Fx', years: 2, level: 'Strong', category: 'platform', note: 'Formulas, named formulas, delegation-aware queries.' },
  { symbol: 'Pp', name: 'Power Pages', years: 1, level: 'Growing', category: 'platform', note: 'Public portals with forms, lists and table permissions.' },
  { symbol: 'Sp', name: 'SharePoint', years: 2, level: 'Core', category: 'm365', note: 'Sites, lists, libraries, permissions and page design.' },
  { symbol: 'Tm', name: 'Teams Apps', years: 1, level: 'Strong', category: 'm365', note: 'Apps and adaptive-card approvals inside Teams.' },
  { symbol: 'Gr', name: 'Microsoft Graph', years: 1, level: 'Growing', category: 'm365', note: 'Users, groups and mail through HTTP actions.' },
  { symbol: 'En', name: 'Entra ID', years: 1, level: 'Growing', category: 'm365', note: 'App registrations, groups and conditional access basics.' },
  { symbol: 'Cs', name: 'Copilot Studio', years: 1, level: 'Strong', category: 'ai', note: 'Topics, knowledge sources, actions and evaluation.' },
  { symbol: 'Ai', name: 'OpenAI / LLMs', years: 1, level: 'Strong', category: 'ai', note: 'GPT integration, prompt engineering, RAG pipelines and LangChain.' },
  { symbol: 'Ab', name: 'AI Builder', years: 1, level: 'Growing', category: 'ai', note: 'Document processing and text classification models.' },
  { symbol: 'Ml', name: 'Machine Learning', years: 2, level: 'Strong', category: 'ai', note: 'TensorFlow, scikit-learn, deep learning and model training.' },
  { symbol: 'Sq', name: 'SQL', years: 2, level: 'Strong', category: 'data', note: 'Queries, views, data migration scripts and optimization.' },
  { symbol: 'Pq', name: 'Power Query', years: 2, level: 'Core', category: 'data', note: 'Cleaning and shaping data for reports and dataflows.' },
  { symbol: 'Pg', name: 'PostgreSQL', years: 1, level: 'Growing', category: 'data', note: 'Database design, queries and backend data storage.' },
  { symbol: 'Ex', name: 'Excel & Scripts', years: 2, level: 'Strong', category: 'data', note: 'Office Scripts and Excel automation with flows.' },
  { symbol: 'Re', name: 'React.js', years: 2, level: 'Core', category: 'dev', note: 'Component architecture, hooks, state management and React Router.' },
  { symbol: 'Nx', name: 'Next.js', years: 1, level: 'Strong', category: 'dev', note: 'App Router, SSR, static generation and API routes.' },
  { symbol: 'Ts', name: 'TypeScript', years: 2, level: 'Strong', category: 'dev', note: 'Type-safe React apps, API integrations and build tooling.' },
  { symbol: 'Py', name: 'Python', years: 2, level: 'Strong', category: 'dev', note: 'FastAPI, data processing, automation scripts and ML pipelines.' },
  { symbol: 'Ap', name: 'REST APIs', years: 2, level: 'Strong', category: 'dev', note: 'Custom connectors, OAuth and pagination.' },
  { symbol: 'Gt', name: 'Git & DevOps', years: 2, level: 'Strong', category: 'dev', note: 'Version control, branching strategies and CI/CD pipelines.' },
  { symbol: 'Tw', name: 'Tailwind CSS', years: 1, level: 'Strong', category: 'dev', note: 'Utility-first styling, responsive design and component systems.' },
]

/** Grouped lists for the About page Skills tab. */
export const softSkills = [
  'Requirements workshops',
  'Clear documentation',
  'Fast prototyping',
  'Working in agile teams',
  'User training',
  'Curiosity & self-learning',
  'Presenting to stakeholders',
  'Problem-solving mindset',
]
