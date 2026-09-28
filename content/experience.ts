/** Career entries — real experience at AOSC Technologies and related work. */

export type ExperienceType = 'Full-time' | 'Freelance' | 'Internship' | 'Community'

export type Experience = {
  role: string
  company: string
  type: ExperienceType
  start: string
  end: string
  location: string
  summary: string
  achievements: string[]
  impact: { value: string; label: string }[]
  tech: string[]
}

export const experience: Experience[] = [
  {
    role: 'Power Platform & React Developer',
    company: 'AOSC Technologies',
    type: 'Full-time',
    start: '2025',
    end: 'Present',
    location: 'Punjab · Hybrid',
    summary:
      'Building migration platforms, AI-powered learning tools, and enterprise solutions. Leading frontend development for Switchblade — a platform that automates Tableau-to-Power BI report migration at scale.',
    achievements: [
      'Led React frontend development for Switchblade, a Tableau-to-Power BI migration platform enabling enterprises to migrate reports at scale.',
      'Built Switchblade 2.0 with enhanced migration pipelines, batch processing, and real-time progress dashboards.',
      'Developed AI-enabled learning management system integrating LLM-powered content generation and adaptive assessments.',
      'Delivered Power BI dashboards and Power Automate workflows for internal analytics and process automation.',
    ],
    impact: [
      { value: '2', label: 'Switchblade versions shipped' },
      { value: '−70%', label: 'migration time saved' },
      { value: '500+', label: 'reports migrated' },
    ],
    tech: ['React.js', 'Power BI', 'Python', 'Power Automate', 'Copilot Studio', 'SharePoint'],
  },
  {
    role: 'Power Platform Intern',
    company: 'AOSC Technologies',
    type: 'Internship',
    start: '2024',
    end: '2025',
    location: 'Punjab',
    summary:
      'Started as an intern building Power Apps canvas apps, SharePoint solutions, and Power Automate workflows. Gained hands-on experience in the Microsoft ecosystem while supporting enterprise client projects.',
    achievements: [
      'Built canvas apps for internal process digitisation, replacing paper-based forms and Excel trackers.',
      'Created Power Automate flows for approval workflows, automated notifications, and data synchronisation.',
      'Assisted in SharePoint intranet design and document management for enterprise clients.',
      'Contributed to Power BI report development and data modelling for business intelligence dashboards.',
    ],
    impact: [
      { value: '5+', label: 'apps delivered' },
      { value: '−10h', label: 'admin saved weekly' },
      { value: '3', label: 'clients supported' },
    ],
    tech: ['Power Apps', 'Power Automate', 'SharePoint Online', 'Power BI', 'Excel'],
  },
  {
    role: 'Freelance Developer',
    company: 'Self-employed',
    type: 'Freelance',
    start: '2024',
    end: 'Present',
    location: 'Remote',
    summary: 'Small automation, web development, and Power Platform projects for local businesses alongside my main role at AOSC Technologies.',
    achievements: [
      'Built responsive web applications using React.js and Next.js for small businesses.',
      'Automated document processing and approval workflows with Power Automate and AI Builder.',
      'Set up SharePoint document management and collaboration sites for small teams.',
    ],
    impact: [
      { value: '3', label: 'clients' },
      { value: '−6h', label: 'admin per week' },
      { value: '100%', label: 'repeat or referral' },
    ],
    tech: ['React.js', 'Next.js', 'Power Apps', 'AI Builder', 'SharePoint'],
  },
  {
    role: 'Student Developer & Contributor',
    company: 'LPU Tech Community',
    type: 'Community',
    start: '2023',
    end: 'Present',
    location: 'Phagwara · Online',
    summary: 'Active participant in university tech events, hackathons, and community learning groups.',
    achievements: [
      'Participated in hackathons building AI/ML prototypes and full-stack applications.',
      'Contributed to open-source projects and university coding communities.',
      'Explored LLM integration, RAG pipelines, and AI-powered application development.',
    ],
    impact: [
      { value: '3+', label: 'hackathons' },
      { value: '5+', label: 'projects built' },
      { value: 'MCA', label: 'AI/ML specialisation' },
    ],
    tech: ['Python', 'TensorFlow', 'React.js', 'LLMs', 'RAG'],
  },
]

export type Education = { title: string; school: string; detail: string; years: string; location: string; tags: string[] }

export const education: Education[] = [
  {
    title: 'Master of Computer Applications (MCA)',
    school: 'Lovely Professional University',
    detail: 'Specialisation in Artificial Intelligence & Machine Learning',
    years: '2023 – 2025',
    location: 'Phagwara, Punjab',
    tags: ['AI/ML', 'Deep Learning', 'NLP', 'Computer Vision', 'Data Science'],
  },
  {
    title: 'Bachelor of Computer Applications (BCA)',
    school: 'Affiliated University',
    detail: 'Computer Science, Software Engineering & Web Technologies',
    years: '2020 – 2023',
    location: 'Punjab, India',
    tags: ['Data Structures', 'Algorithms', 'Web Development', 'Databases', 'Python'],
  },
]

export const achievements = [
  { title: 'Switchblade 2.0 Launch', year: '2025', detail: 'Led frontend development for the second major release of the Tableau-to-Power BI migration platform at AOSC Technologies.' },
  { title: 'AI Learning Platform', year: '2025', detail: 'Architected and shipped an LLM-powered adaptive learning management system from concept to production.' },
  { title: 'Hackathon Finalist', year: '2024', detail: 'Built an AI-powered prototype at LPU hackathon, placing in the top teams with a real-time content recommendation engine.' },
]
