/**
 * Projects feed the 3D ribbon, the projects grid and the case-study pages.
 * Real projects based on work at AOSC Technologies and freelance.
 */

export type ProjectCategory = 'Power Platform' | 'React & Web' | 'Copilot & AI' | 'SharePoint' | 'Data & Migration'

export type MockKind = 'portal' | 'intranet' | 'chat' | 'crm' | 'mobile' | 'flow' | 'governance' | 'dashboard'

export type Project = {
  slug: string
  title: string
  client: string
  sector: string
  start: string
  end: string
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

export const projectCategories: ProjectCategory[] = ['Power Platform', 'React & Web', 'Copilot & AI', 'SharePoint', 'Data & Migration']

export const projects: Project[] = [
  {
    slug: 'switchblade',
    title: 'Switchblade — Tableau to Power BI Migration',
    client: 'AOSC Technologies',
    sector: 'Enterprise Migration',
    start: '2025',
    end: '2025',
    summary:
      'A React-based migration platform that automates Tableau-to-Power BI report conversion at scale, with visual mapping, batch processing, and real-time progress tracking.',
    categories: ['Data & Migration', 'React & Web', 'Power Platform'],
    tech: ['React.js', 'Python', 'Power BI REST API', 'Node.js', 'Tailwind CSS', 'REST APIs'],
    accent: '#e2c285',
    kind: 'dashboard',
    featured: true,
    metrics: [
      { value: '500+', label: 'reports migrated' },
      { value: '−70%', label: 'migration time' },
      { value: '2', label: 'major versions' },
    ],
    caseStudy: {
      problem:
        'Enterprises migrating from Tableau to Power BI faced weeks of manual re-creation for each report, with no way to batch-convert visualisations, calculated fields, or data connections.',
      role: 'Led React frontend development: migration wizard UI, progress dashboards, visual mapping interface, and batch processing controls.',
      features: [
        'Drag-and-drop report selection with visual preview',
        'Automated field mapping between Tableau and Power BI data models',
        'Batch processing with real-time progress and error tracking',
        'Migration audit trail and rollback capability',
      ],
      outcome:
        'Enterprises can now migrate hundreds of Tableau reports to Power BI in hours instead of weeks, with full visual fidelity and data integrity.',
    },
  },
  {
    slug: 'switchblade-2',
    title: 'Switchblade 2.0 — Enhanced Migration Platform',
    client: 'AOSC Technologies',
    sector: 'Enterprise Migration',
    start: '2025',
    end: '2025',
    summary:
      'The second-generation migration platform with advanced pipeline orchestration, improved accuracy, AI-assisted field mapping, and enterprise-grade deployment options.',
    categories: ['Data & Migration', 'Copilot & AI', 'React & Web'],
    tech: ['React.js', 'Python', 'LLMs', 'Power BI Embedded', 'Azure Functions', 'TypeScript'],
    accent: '#d8a657',
    kind: 'portal',
    metrics: [
      { value: '95%', label: 'mapping accuracy' },
      { value: '3×', label: 'faster than v1' },
      { value: 'AI', label: 'field mapping' },
    ],
    caseStudy: {
      problem: 'Switchblade v1 required manual intervention for complex calculated fields and custom visuals. Large enterprises needed higher throughput and smarter mapping.',
      role: 'Frontend architect: redesigned the migration wizard, built the AI-assisted mapping review UI, and implemented real-time pipeline monitoring dashboards.',
      features: [
        'AI-powered intelligent field mapping suggestions',
        'Pipeline orchestration with parallel processing',
        'Side-by-side Tableau vs Power BI visual comparison',
        'Enterprise SSO and role-based access controls',
      ],
      outcome: 'Migration accuracy improved to 95% with 3× throughput, reducing enterprise adoption friction significantly.',
    },
  },
  {
    slug: 'ai-learning-platform',
    title: 'AI-Powered Learning Management System',
    client: 'AOSC Technologies',
    sector: 'EdTech & AI',
    start: '2025',
    end: '2025',
    summary:
      'An LLM-powered adaptive learning platform with AI content generation, intelligent assessments, personalised learning paths, and real-time progress analytics.',
    categories: ['Copilot & AI', 'React & Web'],
    tech: ['React.js', 'Python', 'OpenAI API', 'FastAPI', 'PostgreSQL', 'LangChain'],
    accent: '#ff7a45',
    kind: 'chat',
    metrics: [
      { value: 'LLM', label: 'powered content' },
      { value: '80%', label: 'engagement uplift' },
      { value: '<2s', label: 'AI response time' },
    ],
    caseStudy: {
      problem: 'Traditional LMS platforms offered static content with no personalisation. Learners dropped off without adaptive feedback or intelligent content recommendations.',
      role: 'Full-stack developer: built the React frontend, integrated LLM APIs for content generation, and designed the adaptive assessment engine.',
      features: [
        'AI-generated course content from topic prompts',
        'Adaptive quiz engine that adjusts difficulty in real-time',
        'Personalised learning path recommendations',
        'Real-time analytics dashboard for instructors',
      ],
      outcome: 'Learner engagement increased by 80% and course completion rates doubled compared to the static LMS it replaced.',
    },
  },
  {
    slug: 'enterprise-sharepoint-intranet',
    title: 'Enterprise SharePoint Intranet',
    client: 'AOSC Technologies Client',
    sector: 'Enterprise Collaboration',
    start: '2024',
    end: '2024',
    summary:
      'A SharePoint Online intranet for enterprise teams with structured document management, news publishing, and department-specific landing pages.',
    categories: ['SharePoint'],
    tech: ['SharePoint Online', 'Power Automate', 'Power Apps', 'Microsoft Search'],
    accent: '#c9a45f',
    kind: 'intranet',
    metrics: [
      { value: '500+', label: 'users' },
      { value: '2×', label: 'faster to find docs' },
      { value: '80%', label: 'weekly active' },
    ],
    caseStudy: {
      problem: 'The client’s document management was scattered across shared drives, email, and legacy file servers with no search or governance.',
      role: 'SharePoint developer: site architecture, page templates, document libraries, and content migration.',
      features: ['Hub-and-spoke site architecture', 'Structured document libraries with metadata', 'Automated news publishing workflow', 'Department-specific landing pages'],
      outcome: 'Staff find documents in half the time and the team eliminated duplicate file management across multiple systems.',
    },
  },
  {
    slug: 'power-bi-analytics-suite',
    title: 'Power BI Analytics Dashboard Suite',
    client: 'AOSC Technologies',
    sector: 'Business Intelligence',
    start: '2024',
    end: '2025',
    summary:
      'A suite of Power BI dashboards providing operational KPIs, sales analytics, and resource utilisation metrics with row-level security and mobile layouts.',
    categories: ['Data & Migration', 'Power Platform'],
    tech: ['Power BI', 'DAX', 'Power Query', 'SQL', 'Azure SQL', 'Power Automate'],
    accent: '#e8c77f',
    kind: 'dashboard',
    metrics: [
      { value: '12+', label: 'KPIs tracked' },
      { value: '3', label: 'data sources' },
      { value: 'Daily', label: 'auto-refresh' },
    ],
    caseStudy: {
      problem: 'Leadership relied on manually-assembled weekly reports that were out of date by the time they were reviewed.',
      role: 'Report developer: data model design, DAX measures, report pages, and mobile-optimised layouts.',
      features: ['Star-schema data model', 'Row-level security by department', 'Automated refresh with Power Automate alerts', 'Mobile-optimised report layouts'],
      outcome: 'Leadership sees real-time operational data daily, replacing the manual weekly reporting process entirely.',
    },
  },
  {
    slug: 'process-automation-suite',
    title: 'Enterprise Process Automation',
    client: 'AOSC Technologies Clients',
    sector: 'Process Automation',
    start: '2024',
    end: '2025',
    summary:
      'A collection of Power Automate flows automating approval chains, document processing, notifications, and data sync across Microsoft 365 and third-party systems.',
    categories: ['Power Platform'],
    tech: ['Power Automate', 'Power Apps', 'SharePoint', 'Outlook', 'Teams', 'Custom Connectors'],
    accent: '#f0d9a8',
    kind: 'flow',
    metrics: [
      { value: '50+', label: 'flows in production' },
      { value: '−15h', label: 'admin per week' },
      { value: '99%', label: 'success rate' },
    ],
    caseStudy: {
      problem: 'Multiple clients had manual approval workflows, email-based notifications, and spreadsheet-driven processes that were slow and error-prone.',
      role: 'Automation developer: designed and built approval flows, notification systems, and data synchronisation between SharePoint and external systems.',
      features: ['Multi-stage approval workflows', 'Automated document routing and notifications', 'Error handling with retry and fallback logic', 'Custom connectors for third-party integration'],
      outcome: 'Clients saved 15+ hours per week of administrative overhead and virtually eliminated manual data entry errors.',
    },
  },
  {
    slug: 'portfolio-website',
    title: 'Personal Portfolio — Next.js & Anime.js',
    client: 'Personal Project',
    sector: 'Web Engineering',
    start: '2025',
    end: '2025',
    summary:
      'This portfolio website — a premium, dark-themed Next.js application with scroll-linked storytelling animations, interactive skill matrices, and a custom cursor system.',
    categories: ['React & Web'],
    tech: ['Next.js', 'React', 'TypeScript', 'Anime.js', 'Tailwind CSS', 'Lenis'],
    accent: '#b8893a',
    kind: 'portal',
    metrics: [
      { value: '100', label: 'Lighthouse perf' },
      { value: '60fps', label: 'animations' },
      { value: '0', label: 'dependencies bloat' },
    ],
    caseStudy: {
      problem: 'Needed a portfolio that showcases technical depth while making a premium first impression — not just another template.',
      role: 'Sole developer: design system, animations, content architecture, and deployment.',
      features: ['Scroll-linked storytelling with pinned sections', 'Interactive periodic-table skill matrix', 'Custom cursor with mode-aware states', 'Smooth page transitions with Lenis scroll'],
      outcome: 'A bespoke portfolio that demonstrates both design taste and engineering skill, standing out from generic developer portfolios.',
    },
  },
]

export const featuredProject = projects.find((p) => p.featured) ?? projects[0]

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug)
}
