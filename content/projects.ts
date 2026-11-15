/**
 * Projects from the résumé's "Selected projects" and "Additional projects".
 * Wording follows the résumé; nothing here is invented.
 */

export type ProjectCategory = 'AI & Agents' | 'Dynamics 365' | 'Power Platform' | 'Data & Migration'

export type Project = {
  slug: string
  title: string
  subtitle: string
  categories: ProjectCategory[]
  stack: string[]
  summary: string
  /** Bullet points; an optional label groups a point (e.g. "Qlik", "Tableau"). */
  highlights: { label?: string; text: string }[]
  featured?: boolean
}

export const projectCategories: ProjectCategory[] = ['AI & Agents', 'Dynamics 365', 'Power Platform', 'Data & Migration']

export const projects: Project[] = [
  {
    slug: 'switchblade',
    title: 'SwitchBlade',
    subtitle: 'AI-driven migration of Qlik and Tableau models to Microsoft Fabric',
    categories: ['Data & Migration', 'AI & Agents'],
    stack: ['Microsoft Fabric', 'TMDL', 'Semantic Kernel', 'AI Agents', 'REST APIs', 'Azure OpenAI', 'Log Analytics (KQL)'],
    summary:
      'AI-driven tooling that converts Qlik and Tableau semantic models into Microsoft Fabric, automating the transformation of data models and business logic.',
    highlights: [
      {
        label: 'Qlik',
        text: 'A custom API endpoint extracts dimensions, measures and relationships from Qlik apps; REST APIs and AI agents generate TMDL for Fabric semantic models; custom functions map Qlik constructs to Fabric-compatible structures.',
      },
      {
        label: 'Tableau',
        text: 'A parser for TWBX workbooks (data sources, calculated fields, relationships); Semantic Kernel validation compares source metadata with the generated Fabric models and flags discrepancies for review.',
      },
      {
        label: 'Azure monitoring',
        text: 'Used KQL in Log Analytics across ten Container Apps and an Azure OpenAI (gpt-4.1) resource to analyse token usage, and found that Key Vault diagnostic logging was never enabled.',
      },
    ],
    featured: true,
  },
  {
    slug: 'onboarding-assistant',
    title: 'Multi-agent onboarding assistant',
    subtitle: 'Copilot Studio',
    categories: ['AI & Agents'],
    stack: ['Copilot Studio', 'Power Automate', 'Adaptive Cards', 'Entra ID SSO'],
    summary: 'A multi-agent solution in Copilot Studio with a dedicated Onboarding Agent, approval flows and Entra ID single sign-on.',
    highlights: [
      { text: 'Designed a multi-agent solution in Copilot Studio with a dedicated Onboarding Agent: agent instructions, topic trigger descriptions and a full test suite.' },
      { text: 'Built Power Automate flows with approval-wait logic and Adaptive Card interactions; debugged Top Count and card-binding issues; configured Entra ID single sign-on.' },
    ],
    featured: true,
  },
  {
    slug: 'ai-copilot-document-analysis',
    title: 'AI Copilot Agent',
    subtitle: 'Document and data analysis',
    categories: ['AI & Agents', 'Power Platform'],
    stack: ['Copilot Studio', 'Azure OpenAI', 'AI Builder', 'Power Automate', 'Dataverse', 'SharePoint'],
    summary: 'An enterprise Copilot agent that analyses uploaded documents, forms and structured business data through conversation.',
    highlights: [
      { text: 'Developed an enterprise Copilot agent (Copilot Studio + Azure OpenAI) that analyses uploaded documents, forms and structured business data through conversation.' },
      { text: 'Used AI Builder for document classification, metadata extraction, compliance validation and exception routing to human review.' },
      {
        text: 'Built agent-triggered Power Automate flows for the document pipeline (Dataverse records, SharePoint filing, automated compliance checks) and a knowledge base that guides users in completing forms accurately; Azure Functions and Logic Apps support payload processing and multi-step coordination.',
      },
    ],
  },
  {
    slug: 'ieltsprep',
    title: 'IELTSPREP',
    subtitle: 'AI-powered assessment and evaluation platform',
    categories: ['AI & Agents', 'Power Platform'],
    stack: ['Copilot Studio', 'Azure OpenAI', 'Power Automate', 'Dataverse', 'Power BI', 'Azure Functions', 'Logic Apps'],
    summary: 'An AI assessment system that automates answer validation, scoring and performance tracking.',
    highlights: [
      {
        text: 'Copilot Studio and Azure OpenAI evaluate student answers against predefined criteria, and Power Automate validates responses, calculates scores and stores results in Dataverse.',
      },
      { text: 'Azure Functions orchestrate the Azure OpenAI calls and write structured results back to Dataverse; Logic Apps coordinate the assessment pipeline.' },
      { text: 'Created Dataverse tables for student performance, assessment history and scoring, surfaced through embedded Power BI dashboards; released via Azure DevOps pipelines.' },
    ],
    featured: true,
  },
  {
    slug: 'd365-sales-customer-service',
    title: 'Dynamics 365 CE',
    subtitle: 'Customer Service and Sales automation platform',
    categories: ['Dynamics 365'],
    stack: ['D365 CE', 'Business Process Flows', 'Power Automate', 'Dataverse', 'Power BI', 'Azure DevOps'],
    summary: 'An enterprise D365 CE Sales and Customer Service solution covering lead capture, qualification, opportunity management and case lifecycle tracking.',
    highlights: [
      { text: 'Implemented an enterprise D365 CE Sales and Customer Service solution covering lead capture, qualification, opportunity management and case lifecycle tracking.' },
      {
        text: 'Configured Business Process Flows (Lead Qualification → Opportunity Development → Proposal → Approval → Close) and Power Automate approval workflows that dispatch manager approvals and update opportunity status automatically.',
      },
      {
        text: 'Developed C#/.NET plugins for business rules and field automation; embedded Power BI dashboards for live pipeline visibility and conversion-rate analytics; deployed through Azure DevOps CI/CD (Dev → UAT → Production).',
      },
    ],
    featured: true,
  },
  {
    slug: 'clinic-management',
    title: 'Clinic management & patient engagement',
    subtitle: 'D365 CE and Field Service',
    categories: ['Dynamics 365'],
    stack: ['D365 CE', 'Field Service', 'Power Pages', 'Power Automate', 'Dataverse', 'TypeScript'],
    summary: 'A healthcare CRM on D365 CE and Field Service with patient records, appointment work orders and secure Power Pages patient portals.',
    highlights: [
      {
        text: 'Designed a healthcare CRM on D365 CE and Field Service: patient records, clinical appointments as work orders, support-worker scheduling with mobile dispatch, resource scheduling and territory management.',
      },
      { text: 'Built secure Power Pages patient portals for appointment booking and form submissions linked to D365 records; Power Automate handles reminders, escalation routing and follow-up tasks.' },
      { text: 'Developed C#/.NET plugins and TypeScript web resources; implemented Dataverse role-based security for healthcare data compliance.' },
    ],
  },
  {
    slug: 'ndis-workforce-scheduling',
    title: 'NDIS workforce scheduling',
    subtitle: 'Care coordination platform',
    categories: ['Power Platform', 'AI & Agents'],
    stack: ['Power Apps (Canvas)', 'Copilot Studio', 'Dataverse', 'Power Automate', 'Azure Functions', 'SQL Server'],
    summary: 'A workforce-management app where care managers schedule support workers, track availability and assign patients in real time.',
    highlights: [
      {
        text: 'Built a workforce-management app on Power Apps and Dataverse: care managers schedule support workers, track availability and assign patients in real time; staff see assigned shifts in an interactive calendar.',
      },
      { text: 'Added a Copilot Studio assistant for participant queries and case requests; implemented CRUD for care records, shift notes and documentation with login-based access control.' },
      {
        text: 'Automated shift confirmations, notifications and escalations with Power Automate (wait conditions hold escalations until staff confirm); an Azure Function syncs shift data with external HR systems; deployed through Azure DevOps (Dev → UAT → Production).',
      },
    ],
  },
  {
    slug: 'tax-practice-management',
    title: 'Practice management system',
    subtitle: 'For a tax consultancy',
    categories: ['Power Platform', 'Data & Migration'],
    stack: ['SharePoint Lists', 'Power Automate', 'Power BI', 'DAX', 'Row-Level Security'],
    summary: 'A SharePoint-based practice management system with four connected lists, four flows and a five-page Power BI report.',
    highlights: [
      { text: 'Built a SharePoint-based practice management system: four interconnected lists and four Power Automate flows, including recurring-task generation with date-rollover logic.' },
      { text: 'Created a five-page Power BI report (Fabric) with DAX measures and Row-Level Security; wrote client-ready documentation for all four flows.' },
    ],
  },
]

/** Smaller projects listed without a case-study page. */
export const additionalProjects = [
  { title: 'RAG PDF Extractor', text: 'Retrieval-augmented pipeline that extracts and indexes PDF content for accurate, context-aware querying.' },
  { title: 'OutclassPTE', text: 'Power Pages portal for PTE preparation with practice modules, mock tests and learning resources.' },
  {
    title: 'SecureVote',
    text: 'Blockchain e-voting platform (commit-reveal smart contracts, React, Firebase, Playwright E2E tests), audited against MCA, SEBI, CERT-In and DPDP Act requirements.',
  },
]

export const featuredProjects = projects.filter((p) => p.featured)

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug)
}
