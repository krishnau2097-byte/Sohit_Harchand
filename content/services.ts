/** Services cards, résumé highlights (carousel) and the technology marquee. */

export const services = [
  {
    title: 'Dynamics 365 CE',
    body: 'Sales, Customer Service and Field Service solutions with Business Process Flows, views, dashboards and role-based security.',
    points: ['Business Process Flows', 'C#/.NET plugins', 'PCF controls'],
    icon: 'crm',
  },
  {
    title: 'Power Platform Apps',
    body: 'End-to-end solutions with Power Apps, Power Automate, Power Pages and Power BI on a Dataverse model.',
    points: ['Canvas apps', 'Approval flows', 'Power Pages portals'],
    icon: 'apps',
  },
  {
    title: 'Copilot Studio & Azure OpenAI Agents',
    body: 'Agents for document analysis, employee onboarding and assessment evaluation, with AI Builder and agent-triggered flows.',
    points: ['Multi-agent design', 'RAG', 'Agent test suites'],
    icon: 'agent',
  },
  {
    title: 'Azure Integration',
    body: 'Azure Functions, Logic Apps and Service Bus with the Dataverse Web API and REST APIs for webhooks and async processing.',
    points: ['Webhooks', 'Custom connectors', 'Third-party systems'],
    icon: 'integration',
  },
  {
    title: 'Data, Fabric & Delivery',
    body: 'Qlik and Tableau to Microsoft Fabric migration tooling, SQL Server models, and Azure DevOps CI/CD from Dev to Production.',
    points: ['TMDL generation', 'SQL Server', 'Azure DevOps'],
    icon: 'intranet',
  },
] as const

export type ServiceIcon = (typeof services)[number]['icon']

/**
 * The quote carousel. These are highlights taken from the résumé, not
 * testimonials; add real recommendations here only with permission.
 */
export const testimonials = [
  {
    quote: 'Used KQL in Log Analytics across ten Container Apps and an Azure OpenAI resource to analyse token usage, and found that Key Vault diagnostic logging was never enabled.',
    name: 'SwitchBlade',
    title: 'Azure monitoring · KQL',
  },
  {
    quote: 'Configured a Business Process Flow from Lead Qualification to Opportunity, Proposal, Approval and Close, with approvals that update opportunity status automatically.',
    name: 'Dynamics 365 CE',
    title: 'Sales & Customer Service',
  },
  {
    quote: 'Designed a multi-agent solution in Copilot Studio with a dedicated Onboarding Agent, a full test suite and Entra ID single sign-on.',
    name: 'Onboarding Assistant',
    title: 'Copilot Studio · Power Automate',
  },
  {
    quote: 'Wait conditions hold escalations until staff confirm their shifts, and an Azure Function syncs shift data with external HR systems.',
    name: 'NDIS Scheduling',
    title: 'Power Apps · Azure Functions',
  },
]

/** Words for the technology marquee. */
export const marqueeWords = [
  'Dynamics 365',
  'Power Apps',
  'Power Automate',
  'Copilot Studio',
  'Azure OpenAI',
  'Dataverse',
  'Power Pages',
  'Azure Functions',
  'Microsoft Fabric',
  'Power BI',
  'C# / .NET',
  'Azure DevOps',
]
