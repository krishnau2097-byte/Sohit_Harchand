/** The three chapters of the pinned scroll story on the home page. */

export type StoryChapter = {
  id: string
  kicker: string
  title: string
  lines: string[]
  art: 'who' | 'build' | 'deliver'
  caption: string
}

/** Year markers on the chapter-one orbit illustration. */
export const storyMilestones = ['2023', '2024', '2025', '2026']

export const story: StoryChapter[] = [
  {
    id: 'who',
    kicker: 'Who I am',
    title: 'From Punjab, built for the enterprise.',
    lines: [
      'I joined AOSC Technologies in 2024 and dove deep into the Microsoft stack:',
      'Power Apps, Power Automate, SharePoint, then React and Python.',
      'Every project — from Switchblade to AI learning tools — shaped who I am today.',
    ],
    art: 'who',
    caption: '2024 → today',
  },
  {
    id: 'build',
    kicker: 'What I build',
    title: 'Migration platforms, AI tools and enterprise apps.',
    lines: [
      'Switchblade: a platform that migrates Tableau reports to Power BI at scale,',
      'AI-powered learning systems with LLM content generation,',
      'SharePoint intranets and Power BI dashboards that teams rely on daily.',
    ],
    art: 'build',
    caption: 'React · Power Platform · Python · AI/ML',
  },
  {
    id: 'deliver',
    kicker: 'How I work',
    title: 'Curious, careful, quick to ship.',
    lines: [
      'Understand the problem first, then prototype in days.',
      'Clean architecture, reusable components, and tested pipelines from day one.',
      'Documentation and handover so the team can own it and scale it.',
    ],
    art: 'deliver',
    caption: 'Build · Ship · Iterate',
  },
]
