/** The three chapters of the pinned scroll story on the home page. */

export type StoryChapter = {
  id: string
  kicker: string
  title: string
  lines: string[]
  art: 'who' | 'build' | 'deliver'
  caption: string
}

/** Year markers on the chapter-one orbit illustration (BCA start, AOSC, today). */
export const storyMilestones = ['2021', '2024', '2025', '2026']

export const story: StoryChapter[] = [
  {
    id: 'who',
    kicker: 'Who I am',
    title: 'From Amritsar, built for the enterprise.',
    lines: [
      'A BCA from Guru Nanak Dev University, an MCA in progress at LPU,',
      'and since 2024 a Dynamics 365 & Power Platform developer at AOSC,',
      'delivering D365 CE for multiple clients on the Microsoft stack.',
    ],
    art: 'who',
    caption: '2024 → today',
  },
  {
    id: 'build',
    kicker: 'What I build',
    title: 'CRM platforms, AI agents and migration tooling.',
    lines: [
      'Dynamics 365 CE for Sales, Customer Service and Field Service,',
      'Copilot Studio and Azure OpenAI agents for documents, onboarding and assessments,',
      'and SwitchBlade, which moves Qlik and Tableau models to Microsoft Fabric.',
    ],
    art: 'build',
    caption: 'Dynamics 365 · Power Platform · Azure · AI',
  },
  {
    id: 'deliver',
    kicker: 'How I work',
    title: 'Rules in the platform, releases in the pipeline.',
    lines: [
      'Business Process Flows, security roles, plugins and PCF controls enforce the rules.',
      'Agents get clear instructions, trigger descriptions and a full test suite.',
      'Every solution ships through Azure DevOps from Dev to UAT to Production.',
    ],
    art: 'deliver',
    caption: 'Model · Automate · Ship',
  },
]
