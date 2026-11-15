/**
 * Projects feed the 3D ribbon, the projects grid and the case-study pages.
 * Every project, stack and detail comes from the résumé; metrics are facts
 * stated there (counts, tools), never invented results.
 */

export type ProjectCategory = 'Dynamics 365' | 'Power Platform' | 'Copilot & AI' | 'Azure' | 'Data & Migration' | 'Web'

export type MockKind = 'portal' | 'intranet' | 'chat' | 'crm' | 'mobile' | 'flow' | 'governance' | 'dashboard'

export type Project = {
  slug: string
  title: string
  /** Who or what it was built for (shown as "Built for"). */
  client: string
  sector: string
  summary: string
  categories: ProjectCategory[]
  tech: string[]
  accent: string
  kind: MockKind
  image?: string
  featured?: boolean
  metrics: { value: string; label: string }[]
  caseStudy: {
    problem: string
    role: string
    features: string[]
    outcome: string
  }
  links?: { demo?: string; code?: string }
}

export const projectCategories: ProjectCategory[] = ['Dynamics 365', 'Power Platform', 'Copilot & AI', 'Azure', 'Data & Migration', 'Web']

export const projects: Project[] = [
  {
    slug: 'switchblade',
    title: 'SwitchBlade — Qlik & Tableau to Microsoft Fabric',
    client: 'Analytics teams moving to Fabric',
    sector: 'AI-driven Migration',
    summary:
      'AI-driven tooling that converts Qlik and Tableau semantic models into Microsoft Fabric, automating the transformation of data models and business logic.',
    categories: ['Data & Migration', 'Copilot & AI', 'Azure'],
    tech: ['Microsoft Fabric', 'TMDL', 'Semantic Kernel', 'AI Agents', 'REST APIs', 'Azure OpenAI', 'Log Analytics (KQL)'],
    accent: '#e2c285',
    kind: 'dashboard',
    featured: true,
    metrics: [
      { value: '2', label: 'sources: Qlik & Tableau' },
      { value: 'TMDL', label: 'generated for Fabric' },
      { value: '10', label: 'Container Apps analysed' },
    ],
    caseStudy: {
      problem:
        'Moving Qlik and Tableau semantic models to Microsoft Fabric means rebuilding data models and business logic by hand, and checking the result against the source.',
      role: 'Built the AI-driven conversion tooling: Qlik extraction, the TWBX parser, TMDL generation, Semantic Kernel validation, and Azure monitoring with KQL.',
      features: [
        'Qlik: custom API endpoint extracts dimensions, measures and relationships; AI agents generate TMDL',
        'Custom functions map Qlik constructs to Fabric-compatible structures',
        'Tableau: TWBX parser for data sources, calculated fields and relationships',
        'Semantic Kernel validation compares source metadata with generated models and flags discrepancies',
        'KQL in Log Analytics across ten Container Apps and an Azure OpenAI (gpt-4.1) resource to analyse token usage',
      ],
      outcome:
        'Data model and business-logic conversion is automated, discrepancies are flagged for review, and monitoring showed that Key Vault diagnostic logging had never been enabled.',
    },
  },
  {
    slug: 'onboarding-assistant',
    title: 'Multi-agent Onboarding Assistant',
    client: 'Employee onboarding',
    sector: 'Copilot Studio',
    summary: 'A multi-agent solution in Copilot Studio with a dedicated Onboarding Agent, approval flows with Adaptive Cards, and Entra ID single sign-on.',
    categories: ['Copilot & AI', 'Power Platform'],
    tech: ['Copilot Studio', 'Power Automate', 'Adaptive Cards', 'Entra ID SSO'],
    accent: '#d8a657',
    kind: 'chat',
    metrics: [
      { value: 'Multi', label: 'agent design' },
      { value: 'SSO', label: 'Entra ID sign-in' },
      { value: 'Full', label: 'test suite' },
    ],
    caseStudy: {
      problem: 'New employees need one place to get onboarding answers and approvals, with agents that trigger reliably on the right topics.',
      role: 'Designed the multi-agent solution and its Onboarding Agent, built the approval flows and configured single sign-on.',
      features: [
        'Dedicated Onboarding Agent with agent instructions and topic trigger descriptions',
        'Full test suite for the agent',
        'Power Automate flows with approval-wait logic and Adaptive Card interactions',
        'Entra ID single sign-on',
      ],
      outcome: 'Top Count and card-binding issues were debugged so approvals and Adaptive Cards behave correctly inside the conversation.',
    },
  },
  {
    slug: 'ai-copilot-document-analysis',
    title: 'AI Copilot Agent — Document & Data Analysis',
    client: 'Enterprise operations',
    sector: 'Copilot Studio · Azure OpenAI',
    summary: 'An enterprise Copilot agent that analyses uploaded documents, forms and structured business data through conversation.',
    categories: ['Copilot & AI', 'Power Platform', 'Azure'],
    tech: ['Copilot Studio', 'Azure OpenAI', 'AI Builder', 'Power Automate', 'Dataverse', 'SharePoint'],
    accent: '#ff7a45',
    kind: 'chat',
    metrics: [
      { value: 'AI Builder', label: 'classification' },
      { value: 'Human', label: 'review routing' },
      { value: '2', label: 'Azure services: Functions, Logic Apps' },
    ],
    caseStudy: {
      problem: 'Documents and forms arrive in many shapes; teams need them classified, checked for compliance and filed, with exceptions sent to a person.',
      role: 'Developed the Copilot agent, the AI Builder document processing and the agent-triggered document pipeline.',
      features: [
        'Conversational analysis of uploaded documents, forms and structured data',
        'AI Builder classification, metadata extraction and compliance validation',
        'Exception routing to human review',
        'Agent-triggered flows that create Dataverse records and file to SharePoint',
        'Knowledge base that guides users in completing forms accurately',
      ],
      outcome: 'Azure Functions and Logic Apps handle payload processing and multi-step coordination behind the agent.',
    },
  },
  {
    slug: 'ieltsprep',
    title: 'IELTSPREP — AI Assessment Platform',
    client: 'IELTS students and tutors',
    sector: 'AI Assessment',
    summary: 'An AI assessment system that automates answer validation, scoring and performance tracking.',
    categories: ['Copilot & AI', 'Power Platform', 'Azure'],
    tech: ['Copilot Studio', 'Azure OpenAI', 'Power Automate', 'Dataverse', 'Power BI', 'Azure Functions', 'Logic Apps'],
    accent: '#e8c77f',
    kind: 'dashboard',
    metrics: [
      { value: 'Auto', label: 'answer scoring' },
      { value: 'Power BI', label: 'embedded dashboards' },
      { value: 'CI/CD', label: 'Azure DevOps release' },
    ],
    caseStudy: {
      problem: 'Checking and scoring student answers by hand is slow, and performance history is hard to track.',
      role: 'Built the assessment pipeline, the Dataverse model and the reporting.',
      features: [
        'Copilot Studio and Azure OpenAI evaluate answers against predefined criteria',
        'Power Automate validates responses, calculates scores and stores results in Dataverse',
        'Azure Functions orchestrate the Azure OpenAI calls; Logic Apps coordinate the pipeline',
        'Dataverse tables for performance, assessment history and scoring',
      ],
      outcome: 'Results surface in embedded Power BI dashboards, and the platform is released through Azure DevOps pipelines.',
    },
  },
  {
    slug: 'd365-sales-customer-service',
    title: 'Dynamics 365 CE — Sales & Customer Service',
    client: 'Enterprise sales and service teams',
    sector: 'CRM Automation',
    summary: 'An enterprise D365 CE Sales and Customer Service solution covering lead capture, qualification, opportunity management and case lifecycle tracking.',
    categories: ['Dynamics 365', 'Power Platform'],
    tech: ['D365 CE', 'Business Process Flows', 'Power Automate', 'Dataverse', 'Power BI', 'C#/.NET', 'Azure DevOps'],
    accent: '#c9a45f',
    kind: 'crm',
    metrics: [
      { value: '5', label: 'BPF stages to close' },
      { value: 'C#/.NET', label: 'plugins' },
      { value: '3', label: 'stages: Dev, UAT, Prod' },
    ],
    caseStudy: {
      problem: 'Sales and service work needs one guided process from first lead to closed deal and resolved case, with approvals that do not stall.',
      role: 'Implemented the solution: process flows, approval workflows, plugins, dashboards and deployment.',
      features: [
        'Business Process Flow: Lead Qualification → Opportunity Development → Proposal → Approval → Close',
        'Power Automate approvals that dispatch to managers and update opportunity status automatically',
        'C#/.NET plugins for business rules and field automation',
        'Embedded Power BI for live pipeline visibility and conversion-rate analytics',
      ],
      outcome: 'Deployed through Azure DevOps CI/CD from Dev to UAT to Production.',
    },
  },
  {
    slug: 'clinic-management',
    title: 'Clinic Management & Patient Engagement',
    client: 'Healthcare clinic',
    sector: 'Healthcare CRM',
    summary: 'A healthcare CRM on D365 CE and Field Service with patient records, appointment work orders and secure Power Pages patient portals.',
    categories: ['Dynamics 365', 'Power Platform'],
    tech: ['D365 CE', 'Field Service', 'Power Pages', 'Power Automate', 'Dataverse', 'TypeScript', 'C#/.NET'],
    accent: '#f0d9a8',
    kind: 'portal',
    metrics: [
      { value: 'Field Service', label: 'scheduling & dispatch' },
      { value: 'Power Pages', label: 'patient portal' },
      { value: 'RBAC', label: 'healthcare data security' },
    ],
    caseStudy: {
      problem: 'A clinic needs patients, appointments and support workers in one system, plus a secure way for patients to book and submit forms.',
      role: 'Designed the CRM and portal, and wrote the plugins and web resources.',
      features: [
        'Patient records, with clinical appointments as Field Service work orders',
        'Support-worker scheduling with mobile dispatch, resource scheduling and territories',
        'Secure Power Pages portal for booking and form submissions linked to D365 records',
        'Power Automate reminders, escalation routing and follow-up tasks',
      ],
      outcome: 'C#/.NET plugins, TypeScript web resources and Dataverse role-based security support healthcare data compliance.',
    },
  },
  {
    slug: 'ndis-workforce-scheduling',
    title: 'NDIS Workforce Scheduling & Care Coordination',
    client: 'NDIS care provider',
    sector: 'Workforce Management',
    summary: 'A workforce-management app where care managers schedule support workers, track availability and assign patients in real time.',
    categories: ['Power Platform', 'Copilot & AI', 'Azure'],
    tech: ['Power Apps (Canvas)', 'Copilot Studio', 'Dataverse', 'Power Automate', 'Azure Functions', 'SQL Server'],
    accent: '#d8a657',
    kind: 'mobile',
    metrics: [
      { value: 'Real-time', label: 'shift assignment' },
      { value: 'HR', label: 'system sync' },
      { value: '3', label: 'stages: Dev, UAT, Prod' },
    ],
    caseStudy: {
      problem: 'Care managers need to match support workers to participants quickly, and shifts must be confirmed before anything escalates.',
      role: 'Built the app, the assistant, the flows and the HR integration.',
      features: [
        'Scheduling, availability tracking and real-time patient assignment',
        'Interactive shift calendar for staff',
        'Copilot Studio assistant for participant queries and case requests',
        'CRUD for care records, shift notes and documentation with login-based access',
        'Wait conditions hold escalations until staff confirm',
      ],
      outcome: 'An Azure Function syncs shift data with external HR systems, and releases go through Azure DevOps from Dev to UAT to Production.',
    },
  },
  {
    slug: 'tax-practice-management',
    title: 'Practice Management for a Tax Consultancy',
    client: 'Tax consultancy',
    sector: 'Practice Management',
    summary: 'A SharePoint-based practice management system with four connected lists, four flows and a five-page Power BI report.',
    categories: ['Power Platform', 'Data & Migration'],
    tech: ['SharePoint Lists', 'Power Automate', 'Power BI', 'DAX', 'Row-Level Security'],
    accent: '#b8893a',
    kind: 'flow',
    metrics: [
      { value: '4', label: 'connected lists' },
      { value: '4', label: 'Power Automate flows' },
      { value: '5', label: 'Power BI report pages' },
    ],
    caseStudy: {
      problem: 'A tax practice tracks recurring client work that has to roll forward to the next period automatically.',
      role: 'Built the lists, flows and report, and wrote the client documentation.',
      features: [
        'Four interconnected SharePoint lists',
        'Recurring-task generation with date-rollover logic',
        'Five-page Power BI report (Fabric) with DAX measures',
        'Row-Level Security',
      ],
      outcome: 'Client-ready documentation covers all four flows.',
    },
  },
  {
    slug: 'rag-pdf-extractor',
    title: 'RAG PDF Extractor',
    client: 'Document search',
    sector: 'Retrieval-augmented AI',
    summary: 'A retrieval-augmented pipeline that extracts and indexes PDF content for accurate, context-aware querying.',
    categories: ['Copilot & AI'],
    tech: ['RAG', 'PDF extraction', 'Indexing', 'LLM'],
    accent: '#ff9a5a',
    kind: 'chat',
    metrics: [
      { value: 'RAG', label: 'pipeline' },
      { value: 'PDF', label: 'extract & index' },
      { value: 'Context', label: 'aware answers' },
    ],
    caseStudy: {
      problem: 'Answers buried in PDFs are hard to find with keyword search.',
      role: 'Built the extraction, indexing and query pipeline.',
      features: ['PDF content extraction', 'Indexing for retrieval', 'Context-aware querying'],
      outcome: 'PDF content can be queried accurately in context.',
    },
  },
  {
    slug: 'outclasspte',
    title: 'OutclassPTE',
    client: 'PTE candidates',
    sector: 'Learning Portal',
    summary: 'A Power Pages portal for PTE preparation with practice modules, mock tests and learning resources.',
    categories: ['Power Platform'],
    tech: ['Power Pages'],
    accent: '#e2c285',
    kind: 'portal',
    metrics: [
      { value: 'Power Pages', label: 'portal' },
      { value: 'Mock', label: 'tests' },
      { value: 'PTE', label: 'practice modules' },
    ],
    caseStudy: {
      problem: 'PTE candidates need practice material and mock tests in one place.',
      role: 'Built the Power Pages portal.',
      features: ['Practice modules', 'Mock tests', 'Learning resources'],
      outcome: 'One portal for PTE preparation.',
    },
  },
  {
    slug: 'securevote',
    title: 'SecureVote',
    client: 'Secure e-voting',
    sector: 'Blockchain',
    summary: 'A blockchain e-voting platform with commit-reveal smart contracts, audited against MCA, SEBI, CERT-In and DPDP Act requirements.',
    categories: ['Web'],
    tech: ['Smart contracts', 'React', 'Firebase', 'Playwright'],
    accent: '#c9a45f',
    kind: 'governance',
    metrics: [
      { value: 'Commit-reveal', label: 'smart contracts' },
      { value: 'Playwright', label: 'E2E tests' },
      { value: '4', label: 'frameworks audited' },
    ],
    caseStudy: {
      problem: 'An online vote has to stay secret until counting and stand up to regulatory review.',
      role: 'Built the platform and its end-to-end tests.',
      features: ['Commit-reveal smart contracts', 'React front end with Firebase', 'Playwright end-to-end tests'],
      outcome: 'Audited against MCA, SEBI, CERT-In and DPDP Act requirements.',
    },
  },
]

export const featuredProject = projects.find((p) => p.featured) ?? projects[0]

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug)
}
