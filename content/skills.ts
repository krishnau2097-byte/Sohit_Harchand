/**
 * Skills shown as flip cards, the physics playground and the About tabs.
 * Names come from the résumé's Core Skills. `years` and `level` are estimates
 * from where each skill appears on the résumé (2 = used in the AOSC role since
 * 2024, 1 = used in specific projects); adjust them to your own judgement.
 */

export type SkillCategory = 'platform' | 'm365' | 'ai' | 'data' | 'dev'
export type SkillLevel = 'Core' | 'Strong' | 'Growing'

export const skillCategories: Record<SkillCategory, { label: string; tone: string }> = {
  platform: { label: 'Power Platform', tone: 'var(--cat-platform)' },
  m365: { label: 'Dynamics 365', tone: 'var(--cat-m365)' },
  ai: { label: 'AI & Agents', tone: 'var(--cat-ai)' },
  data: { label: 'Data & Analytics', tone: 'var(--cat-data)' },
  dev: { label: 'Azure, Code & DevOps', tone: 'var(--cat-dev)' },
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
  { symbol: 'Pa', name: 'Power Apps', years: 2, level: 'Core', category: 'platform', note: 'Canvas apps on Dataverse, e.g. NDIS shift scheduling with an interactive calendar.' },
  { symbol: 'Au', name: 'Power Automate', years: 2, level: 'Core', category: 'platform', note: 'Approval-wait logic, Adaptive Cards, escalations and recurring-task flows.' },
  { symbol: 'Pp', name: 'Power Pages', years: 2, level: 'Strong', category: 'platform', note: 'Secure patient portals for booking and form submissions linked to D365.' },
  { symbol: 'Dv', name: 'Dataverse', years: 2, level: 'Core', category: 'platform', note: 'Tables, role-based security and the Dataverse Web API.' },
  { symbol: 'Bi', name: 'Power BI', years: 2, level: 'Strong', category: 'platform', note: 'Embedded dashboards, DAX measures and Row-Level Security.' },
  { symbol: 'Al', name: 'Solution Mgmt & ALM', years: 2, level: 'Strong', category: 'platform', note: 'Solutions moved Dev → UAT → Production through pipelines.' },
  { symbol: 'Ce', name: 'Dynamics 365 CE', years: 2, level: 'Core', category: 'm365', note: 'Sales, Customer Service and Field Service for multiple clients.' },
  { symbol: 'Bp', name: 'Business Process Flows', years: 2, level: 'Core', category: 'm365', note: 'Lead Qualification → Opportunity → Proposal → Approval → Close.' },
  { symbol: 'Pc', name: 'PCF Controls', years: 2, level: 'Strong', category: 'm365', note: 'Custom form components written in TypeScript.' },
  { symbol: 'Js', name: 'JS Web Resources', years: 2, level: 'Strong', category: 'm365', note: 'Form logic and TypeScript web resources in D365.' },
  { symbol: 'Fs', name: 'Field Service', years: 2, level: 'Strong', category: 'm365', note: 'Work orders, resource scheduling, mobile dispatch and territories.' },
  { symbol: 'Cs', name: 'Copilot Studio', years: 2, level: 'Core', category: 'ai', note: 'Multi-agent solutions: instructions, topic triggers and test suites.' },
  { symbol: 'Ai', name: 'Azure OpenAI', years: 2, level: 'Strong', category: 'ai', note: 'Agents for document analysis, onboarding and answer evaluation.' },
  { symbol: 'Ab', name: 'AI Builder', years: 2, level: 'Strong', category: 'ai', note: 'Document classification, metadata extraction and compliance checks.' },
  { symbol: 'Rg', name: 'RAG', years: 1, level: 'Growing', category: 'ai', note: 'Retrieval-augmented PDF extraction and context-aware querying.' },
  { symbol: 'Sk', name: 'Semantic Kernel', years: 1, level: 'Growing', category: 'ai', note: 'Validation that compares source metadata with generated Fabric models.' },
  { symbol: 'Tm', name: 'TMDL Generation', years: 1, level: 'Growing', category: 'ai', note: 'AI agents generating TMDL for Fabric semantic models.' },
  { symbol: 'Fb', name: 'Microsoft Fabric', years: 1, level: 'Growing', category: 'data', note: 'Target platform for migrated Qlik and Tableau semantic models.' },
  { symbol: 'Sq', name: 'SQL Server', years: 2, level: 'Strong', category: 'data', note: 'Data models and stored procedures for compliance reporting.' },
  { symbol: 'Dx', name: 'DAX', years: 2, level: 'Strong', category: 'data', note: 'Measures for a five-page Power BI report with RLS.' },
  { symbol: 'Kq', name: 'KQL', years: 1, level: 'Growing', category: 'data', note: 'Log Analytics across ten Container Apps and an Azure OpenAI resource.' },
  { symbol: 'Dm', name: 'Data Migration', years: 2, level: 'Strong', category: 'data', note: 'Data modelling and migrations with SQL Server and Azure SQL.' },
  { symbol: 'Cn', name: 'C# / .NET', years: 2, level: 'Strong', category: 'dev', note: 'Dynamics 365 plugins for business rules and field automation.' },
  { symbol: 'Ts', name: 'TypeScript', years: 2, level: 'Strong', category: 'dev', note: 'PCF controls and web resources.' },
  { symbol: 'Fn', name: 'Azure Functions', years: 2, level: 'Strong', category: 'dev', note: 'Orchestrating Azure OpenAI calls and syncing data with HR systems.' },
  { symbol: 'La', name: 'Logic Apps', years: 2, level: 'Strong', category: 'dev', note: 'Coordinating multi-step pipelines and payload processing.' },
  { symbol: 'Ap', name: 'REST & Web API', years: 2, level: 'Strong', category: 'dev', note: 'Dataverse Web API, OData, custom connectors and webhooks.' },
  { symbol: 'Do', name: 'Azure DevOps', years: 2, level: 'Core', category: 'dev', note: 'CI/CD pipelines and sprint boards in Agile/Scrum teams.' },
  { symbol: 'Gt', name: 'Git & GitHub', years: 2, level: 'Strong', category: 'dev', note: 'Version control and GitHub Actions.' },
]

/** Ways of working named on the résumé. */
export const softSkills = [
  'Agile / Scrum delivery',
  'Sprint planning on Azure DevOps Boards',
  'Client-ready documentation',
  'Agent test suites',
  'Multi-client delivery',
  'Debugging & root-cause analysis',
]
