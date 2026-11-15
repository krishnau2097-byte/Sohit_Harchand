/** Core skills, grouped exactly as on the résumé. */

export const skillGroups = [
  {
    id: 'platform',
    label: 'Power Platform',
    items: ['Power Apps', 'Power Automate', 'Power Pages', 'Dataverse', 'Power BI', 'Copilot Studio', 'AI Builder', 'Power Fx', 'Solution Management & ALM'],
  },
  {
    id: 'd365',
    label: 'Dynamics 365',
    items: ['D365 CE', 'Business Process Flows', 'Security Roles', 'PCF Controls', 'JavaScript Web Resources'],
  },
  {
    id: 'ai',
    label: 'AI & Agents',
    items: ['Azure OpenAI', 'Copilot Studio Agents', 'RAG', 'Prompt Engineering', 'LLM-based Workflows', 'TMDL Generation'],
  },
  {
    id: 'azure',
    label: 'Azure & Integration',
    items: ['Azure Functions', 'Logic Apps', 'API Management', 'Log Analytics', 'Dataverse Web API', 'OData', 'REST APIs', 'Custom Connectors', 'Webhooks'],
  },
  {
    id: 'data',
    label: 'Data & Analytics',
    items: ['Microsoft Fabric', 'SQL Server', 'Azure SQL', 'Data Modeling', 'Data Migration'],
  },
  {
    id: 'devops',
    label: 'DevOps & Tools',
    items: ['Azure DevOps', 'Git / GitHub', 'GitHub Actions', 'Docker', 'Postman', 'Agile / Scrum'],
  },
] as const

export type SkillGroupId = (typeof skillGroups)[number]['id']

export const skillCount = skillGroups.reduce((n, g) => n + g.items.length, 0)
