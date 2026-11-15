import type { MockKind, Project } from '@/content/projects'

/**
 * Generates a 1600×1000 SVG "screenshot" for a project so the grid and the
 * 3D ribbon look complete before real screenshots exist. Each kind draws a
 * different interface (portal, intranet, chat, CRM, mobile, flow, governance,
 * dashboard) tinted with the project's accent colour. Mixed light and dark
 * screens mirror the reference video's orange/black/white panels.
 */

const W = 1600
const H = 1000

type Theme = { bg: string; bar: string; panel: string; panel2: string; line: string; text: string; muted: string; pill: string }

const dark: Theme = { bg: '#100e0b', bar: '#191612', panel: '#1d1a15', panel2: '#26221c', line: '#2f2a22', text: '#f3ece0', muted: '#8f8778', pill: '#24201a' }
const light: Theme = { bg: '#f7f3ec', bar: '#ebe4d8', panel: '#ffffff', panel2: '#f1ebe1', line: '#e2d9c9', text: '#17130e', muted: '#8a8073', pill: '#ffffff' }

const lightKinds: MockKind[] = ['portal', 'crm', 'flow']

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const r = (x: number, y: number, w: number, h: number, rx: number, fill: string, extra = '') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`

const t = (x: number, y: number, s: string, size: number, fill: string, weight = 400, anchor = 'start', extra = '') =>
  `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" ${extra}>${esc(s)}</text>`

/** Placeholder text line (grey bar). */
const bar = (x: number, y: number, w: number, fill: string, h = 12) => r(x, y, w, h, h / 2, fill)

function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16)
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(amt >= 0 ? v + (255 - v) * amt : v * (1 + amt))))
  const R = c((n >> 16) & 255)
  const G = c((n >> 8) & 255)
  const B = c(n & 255)
  return `#${((1 << 24) | (R << 16) | (G << 8) | B).toString(16).slice(1)}`
}

function portal(p: Project, th: Theme, a: string) {
  let s = ''
  s += r(0, 64, W, 84, 0, th.panel) + r(72, 88, 36, 36, 10, a) + t(124, 114, p.client, 22, th.text, 700)
  ;['Programs', 'Eligibility', 'Guides', 'Contact'].forEach((n, i) => (s += t(860 + i * 150, 114, n, 18, th.muted, 500)))
  s += r(1440, 86, 96, 40, 20, th.text) + t(1488, 112, 'Sign in', 16, th.panel, 600, 'middle')
  s += t(72, 280, 'Apply for a', 76, th.text, 800) + t(72, 370, 'community grant', 76, shade(a, -0.35), 800)
  s += bar(72, 410, 560, th.line, 16) + bar(72, 440, 480, th.line, 16) + bar(72, 470, 380, th.line, 16)
  s += r(72, 530, 260, 64, 32, a) + t(202, 570, 'Start application', 20, '#120f0b', 700, 'middle')
  s += r(352, 530, 190, 64, 32, 'none', `stroke="${th.line}" stroke-width="2"`) + t(447, 570, 'Check status', 20, th.text, 600, 'middle')
  // application card
  s += r(840, 200, 690, 440, 28, th.panel, `stroke="${th.line}" stroke-width="2"`)
  ;[0, 1, 2, 3].forEach((i) => {
    const cx = 910 + i * 180
    if (i < 3) s += r(cx, 262, 180, 4, 2, i < 1 ? a : th.line)
    s += `<circle cx="${cx}" cy="264" r="20" fill="${i <= 1 ? a : th.panel2}" stroke="${i <= 1 ? a : th.line}" stroke-width="3"/>`
    s += t(cx, 316, ['Details', 'Project', 'Budget', 'Submit'][i], 16, i <= 1 ? th.text : th.muted, 600, 'middle')
  })
  ;[0, 1, 2].forEach((i) => {
    s += bar(890, 360 + i * 86, 140, th.muted, 10)
    s += r(890, 380 + i * 86, 590, 44, 12, th.panel2, `stroke="${th.line}" stroke-width="2"`)
  })
  s += r(1330, 588, 150, 44, 22, a) + t(1405, 616, 'Continue', 17, '#120f0b', 700, 'middle')
  // cards
  ;['Open rounds', 'Track decisions', 'Acquit online'].forEach((n, i) => {
    const x = 72 + i * 490
    s += r(x, 700, 460, 240, 24, th.panel, `stroke="${th.line}" stroke-width="2"`)
    s += r(x + 32, 732, 56, 56, 16, shade(a, 0.45))
    s += t(x + 32, 830, n, 26, th.text, 700) + bar(x + 32, 856, 360, th.line) + bar(x + 32, 880, 280, th.line)
  })
  return s
}

function intranet(p: Project, th: Theme, a: string) {
  let s = ''
  s += r(0, 64, W, 88, 0, th.panel) + r(64, 88, 40, 40, 12, a) + t(120, 116, 'The Hub', 24, th.text, 800)
  s += r(460, 84, 680, 48, 24, th.panel2) + t(496, 115, 'Search people, policies and news…', 18, th.muted)
  s += `<circle cx="1480" cy="108" r="22" fill="${shade(a, -0.15)}"/>`
  s += `<defs><linearGradient id="h" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${shade(a, -0.45)}"/></linearGradient></defs>`
  s += r(64, 184, 960, 420, 28, 'url(#h)')
  s += `<circle cx="820" cy="330" r="160" fill="#fff" opacity="0.08"/><circle cx="930" cy="480" r="90" fill="#fff" opacity="0.07"/>`
  s += r(96, 470, 110, 34, 17, '#120f0b', 'opacity="0.55"') + t(151, 493, 'NEWS', 15, '#fff', 700, 'middle')
  s += t(96, 560, p.title, 46, '#120f0b', 800)
  s += r(1056, 184, 480, 420, 28, th.panel) + t(1088, 236, 'Quick links', 24, th.text, 700)
  ;['Leave & pay', 'IT service desk', 'Policy hub', 'Book a room', 'Org chart'].forEach((n, i) => {
    s += r(1088, 262 + i * 64, 416, 50, 14, th.panel2) + `<circle cx="1116" cy="${287 + i * 64}" r="9" fill="${a}"/>` + t(1140, 293 + i * 64, n, 18, th.text, 500)
  })
  ;[0, 1, 2, 3].forEach((i) => {
    const x = 64 + i * 374
    s += r(x, 640, 350, 300, 24, th.panel)
    s += r(x, 640, 350, 150, 24, shade(a, -0.35 + i * 0.08)) + r(x, 740, 350, 50, 0, shade(a, -0.35 + i * 0.08))
    s += bar(x + 24, 820, 280, th.text, 14) + bar(x + 24, 850, 220, th.line) + bar(x + 24, 874, 250, th.line)
  })
  return s
}

function chat(p: Project, th: Theme, a: string) {
  let s = ''
  s += r(0, 64, 380, H - 64, 0, th.panel) + t(40, 124, 'Chats', 26, th.text, 700)
  ;['Carer’s leave', 'Travel claims', 'Remote work', 'Code of conduct', 'Procurement'].forEach((n, i) => {
    const y = 160 + i * 96
    s += r(24, y, 332, 80, 18, i === 0 ? th.panel2 : th.panel) + `<circle cx="64" cy="${y + 40}" r="18" fill="${i === 0 ? a : th.line}"/>`
    s += t(96, y + 36, n, 18, th.text, 600) + bar(96, y + 50, 200, th.line, 10)
  })
  s += r(380, 64, W - 380, 96, 0, th.bar) + `<path d="M436 94c2 14 10 22 24 24-14 2-22 10-24 24-2-14-10-22-24-24 14-2 22-10 24-24Z" fill="${a}"/>`
  s += t(480, 124, p.title, 28, th.text, 700) + r(1380, 96, 170, 36, 18, th.panel2) + t(1465, 120, '● Online', 16, '#7ed3a4', 600, 'middle')
  s += r(900, 200, 620, 80, 26, a) + t(930, 250, 'How many days of carer’s leave do I get?', 21, '#120f0b', 600)
  s += r(440, 310, 760, 240, 26, th.panel2)
  s += bar(474, 348, 620, th.text, 14) + bar(474, 378, 680, th.muted, 12) + bar(474, 404, 540, th.muted, 12) + bar(474, 430, 600, th.muted, 12)
  ;['Leave Policy §4.2', 'EA 2024 cl. 31'].forEach((n, i) => {
    s += r(474 + i * 230, 476, 210, 44, 22, 'none', `stroke="${a}" stroke-width="2"`) + t(579 + i * 230, 504, n, 16, a, 600, 'middle')
  })
  s += r(1040, 580, 480, 80, 26, a) + t(1070, 630, 'Can I take it in half days?', 21, '#120f0b', 600)
  s += r(440, 690, 180, 64, 26, th.panel2)
  ;[0, 1, 2].forEach((i) => (s += `<circle cx="${490 + i * 40}" cy="722" r="9" fill="${th.muted}" opacity="${0.4 + i * 0.25}"/>`))
  s += r(420, 880, 1140, 76, 38, th.panel2, `stroke="${th.line}" stroke-width="2"`) + t(460, 926, 'Ask about any policy…', 20, th.muted)
  s += `<circle cx="1514" cy="918" r="26" fill="${a}"/><path d="M1504 918h20M1516 908l10 10-10 10" stroke="#120f0b" stroke-width="3" fill="none" stroke-linecap="round"/>`
  return s
}

function crm(p: Project, th: Theme, a: string) {
  let s = ''
  s += r(0, 64, 96, H - 64, 0, '#1b1813')
  ;[0, 1, 2, 3, 4, 5].forEach((i) => (s += r(28, 110 + i * 76, 40, 40, 12, i === 1 ? a : '#2d2921')))
  s += r(96, 64, W - 96, 140, 0, th.panel) + t(144, 124, 'Case #2024-0183', 20, th.muted, 600)
  s += t(144, 172, p.title, 36, th.text, 800) + r(1300, 128, 150, 44, 22, a) + t(1375, 157, 'In review', 17, '#120f0b', 700, 'middle')
  ;['Open cases', 'Due this week', 'SLA met', 'Avg. days'].forEach((n, i) => {
    const x = 144 + i * 350
    s += r(x, 236, 326, 130, 22, th.panel, `stroke="${th.line}" stroke-width="2"`)
    s += t(x + 28, 286, n, 17, th.muted, 600) + t(x + 28, 342, ['128', '17', '96%', '6.4'][i], 44, i === 2 ? shade(a, -0.35) : th.text, 800)
  })
  s += r(144, 396, 820, 560, 22, th.panel, `stroke="${th.line}" stroke-width="2"`)
  ;['Summary', 'Parties', 'Evidence', 'Notes'].forEach((n, i) => (s += t(176 + i * 150, 446, n, 18, i === 0 ? th.text : th.muted, 600)))
  s += r(176, 462, 90, 4, 2, a)
  ;[0, 1, 2, 3, 4].forEach((i) => {
    const y = 500 + i * 88
    s += bar(176, y, 120, th.muted, 10) + r(176, y + 20, 360, 44, 10, th.panel2) + bar(572, y, 120, th.muted, 10) + r(572, y + 20, 360, 44, 10, th.panel2)
  })
  s += r(996, 396, 460, 560, 22, th.panel, `stroke="${th.line}" stroke-width="2"`) + t(1028, 446, 'Timeline', 20, th.text, 700)
  s += r(1043, 480, 3, 440, 1.5, th.line)
  ;[0, 1, 2, 3, 4].forEach((i) => {
    const y = 490 + i * 88
    s += `<circle cx="1044" cy="${y + 10}" r="11" fill="${i === 0 ? a : th.panel}" stroke="${i === 0 ? a : th.line}" stroke-width="3"/>`
    s += bar(1076, y, 240, th.text, 12) + bar(1076, y + 26, 320, th.line, 10)
  })
  return s
}

function mobile(p: Project, th: Theme, a: string) {
  let s = `<defs><radialGradient id="g" cx="0.7" cy="0.4" r="0.7"><stop offset="0" stop-color="${a}" stop-opacity="0.45"/><stop offset="1" stop-color="${th.bg}" stop-opacity="0"/></radialGradient></defs>`
  s += r(0, 64, W, H - 64, 0, 'url(#g)')
  s += t(96, 300, 'Field', 88, th.text, 800) + t(96, 400, 'Inspections', 88, a, 800)
  s += bar(96, 450, 460, th.line, 16) + bar(96, 480, 380, th.line, 16)
  ;['Offline', 'Photos', 'GPS'].forEach((n, i) => (s += r(96 + i * 150, 540, 136, 48, 24, 'none', `stroke="${a}" stroke-width="2"`) + t(164 + i * 150, 571, n, 18, a, 600, 'middle')))
  const phone = (x: number, y: number, inner: string) =>
    r(x, y, 360, 740, 56, '#0b0a08', `stroke="#3a342a" stroke-width="6"`) + r(x + 130, y + 22, 100, 26, 13, '#000') + inner
  let list = t(760, 236, 'Bridge B-114', 24, th.text, 700, 'start') + bar(760, 254, 160, th.muted, 10)
  ;['Deck surface', 'Expansion joints', 'Drainage', 'Barriers', 'Signage', 'Lighting'].forEach((n, i) => {
    const y = 300 + i * 72
    const done = i < 3
    list += r(752, y, 310, 58, 16, th.panel2) + `<circle cx="784" cy="${y + 29}" r="14" fill="${done ? a : 'none'}" stroke="${done ? a : th.muted}" stroke-width="3"/>`
    list += t(812, y + 36, n, 18, th.text, 500)
  })
  list += r(752, 750, 310, 56, 28, a) + t(907, 786, 'Submit report', 19, '#120f0b', 700, 'middle')
  s += phone(730, 150, list)
  let map = r(1170, 226, 300, 640, 30, '#1a2019')
  for (let i = 0; i < 8; i++) map += `<path d="M1170 ${260 + i * 80}h300M${1190 + i * 40} 226v640" stroke="#27302a" stroke-width="2"/>`
  map += `<path d="M1210 820C1260 700 1320 690 1350 560S1420 380 1440 300" stroke="${a}" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="2 14"/>`
  ;[[1230, 780], [1350, 560], [1438, 310]].forEach(([x, y], i) => (map += `<circle cx="${x}" cy="${y}" r="${i === 1 ? 18 : 12}" fill="${i === 1 ? a : '#f3ece0'}" stroke="#0b0a08" stroke-width="4"/>`))
  s += phone(1140, 190, map)
  return s
}

function flow(p: Project, th: Theme, a: string) {
  let s = ''
  for (let x = 40; x < W; x += 40) for (let y = 104; y < H; y += 40) s += `<circle cx="${x}" cy="${y}" r="2" fill="${th.line}"/>`
  s += t(72, 150, p.title, 40, th.text, 800) + bar(72, 176, 380, th.muted, 12)
  const node = (x: number, y: number, title: string, sub: string, color: string) =>
    r(x, y, 380, 118, 20, th.panel, `stroke="${th.line}" stroke-width="2"`) + r(x, y, 380, 14, 7, color) + `<circle cx="${x + 48}" cy="${y + 66}" r="22" fill="${color}" opacity="0.9"/>` + t(x + 88, y + 62, title, 20, th.text, 700) + t(x + 88, y + 90, sub, 16, th.muted, 500)
  const line = (d: string) => `<path d="${d}" stroke="${th.muted}" stroke-width="3" fill="none" stroke-dasharray="1 0"/>`
  s += line('M610 330V400') + line('M610 518V588') + line('M610 706V740H340V790') + line('M610 740H880V790') + line('M340 908V930H610') + line('M880 908V930H610')
  s += node(420, 212, 'When an invoice arrives', 'Outlook · shared mailbox', '#0f6cbd')
  s += node(420, 400, 'Extract fields', 'AI Builder · custom model', a)
  s += node(420, 588, 'Amount over $10k?', 'Condition', '#8a6420')
  s += node(150, 790, 'Manager approval', 'Approvals · Teams', '#6b4fbb')
  s += node(690, 790, 'Auto-approve', 'Rules · tolerance 2%', '#2e8b57')
  s += r(1130, 212, 400, 700, 24, th.panel, `stroke="${th.line}" stroke-width="2"`) + t(1162, 262, 'Run history', 22, th.text, 700)
  ;[0, 1, 2, 3, 4, 5, 6].forEach((i) => {
    const y = 290 + i * 86
    const ok = i !== 2
    s += r(1162, y, 336, 70, 14, th.panel2) + `<circle cx="1194" cy="${y + 35}" r="11" fill="${ok ? '#2e8b57' : a}"/>` + bar(1220, y + 22, 160, th.text, 11) + bar(1220, y + 42, 220, th.line, 9)
  })
  return s
}

function governance(p: Project, th: Theme, a: string) {
  let s = ''
  s += t(72, 150, p.title, 38, th.text, 800) + r(1330, 110, 200, 48, 24, th.panel2) + t(1430, 141, 'Last 30 days', 17, th.muted, 600, 'middle')
  ;[['Apps', '2,318'], ['Flows', '5,902'], ['Makers', '1,147'], ['Environments', '14']].forEach(([n, v], i) => {
    const x = 72 + i * 366
    s += r(x, 190, 342, 150, 24, th.panel) + t(x + 30, 242, n, 18, th.muted, 600) + t(x + 30, 306, v, 50, i === 0 ? a : th.text, 800)
  })
  const C = 2 * Math.PI * 120
  s += r(72, 372, 520, 580, 24, th.panel) + t(104, 424, 'DLP coverage', 22, th.text, 700)
  s += `<circle cx="332" cy="660" r="120" fill="none" stroke="${th.panel2}" stroke-width="40"/>`
  s += `<circle cx="332" cy="660" r="120" fill="none" stroke="${a}" stroke-width="40" stroke-dasharray="${C * 0.72} ${C}" transform="rotate(-90 332 660)"/>`
  s += `<circle cx="332" cy="660" r="120" fill="none" stroke="${shade(a, -0.3)}" stroke-width="40" stroke-dasharray="${C * 0.18} ${C}" stroke-dashoffset="${-C * 0.72}" transform="rotate(-90 332 660)"/>`
  s += t(332, 676, '90%', 48, th.text, 800, 'middle')
  s += r(624, 372, 904, 580, 24, th.panel) + t(656, 424, 'Environments', 22, th.text, 700)
  ;['Production', 'UAT', 'Development', 'Default', 'Sandbox – Finance', 'Sandbox – HR'].forEach((n, i) => {
    const y = 458 + i * 78
    const status = ['Managed', 'Managed', 'Managed', 'Restricted', 'Review', 'Managed'][i]
    s += r(656, y, 840, 62, 14, i % 2 ? th.panel : th.panel2) + t(684, y + 39, n, 19, th.text, 600) + bar(1000, y + 25, 160, th.line)
    s += r(1340, y + 13, 130, 36, 18, status === 'Managed' ? shade(a, -0.1) : status === 'Review' ? '#ff6a3d' : '#5b544a') + t(1405, y + 37, status, 15, '#120f0b', 700, 'middle')
  })
  return s
}

function dashboard(p: Project, th: Theme, a: string) {
  let s = ''
  s += t(72, 150, p.title, 38, th.text, 800) + t(72, 186, p.sector, 18, th.muted, 500)
  // KPI tiles show the project's own résumé metrics, never made-up numbers.
  ;[...p.metrics.map((m) => [m.label, m.value]), ['Technologies', String(p.tech.length)]].slice(0, 4).forEach(([n, v], i) => {
    const x = 72 + i * 366
    s += r(x, 222, 342, 170, 24, th.panel) + t(x + 30, 272, n, 18, th.muted, 600) + t(x + 30, 338, v, 48, th.text, 800)
    const pts = Array.from({ length: 8 }, (_, k) => `${x + 200 + k * 16},${360 - Math.abs(Math.sin(k * 1.3 + i)) * 40}`).join(' ')
    s += `<polyline points="${pts}" fill="none" stroke="${a}" stroke-width="4" stroke-linejoin="round"/>`
  })
  s += r(72, 424, 900, 530, 24, th.panel) + t(104, 476, 'Services by month', 22, th.text, 700)
  const heights = [220, 260, 240, 300, 280, 340, 310, 360, 330, 390, 370, 420]
  heights.forEach((h, i) => {
    s += r(120 + i * 68, 900 - h, 40, h, 10, i === 11 ? a : shade(a, -0.45 + i * 0.02))
  })
  s += r(1004, 424, 524, 530, 24, th.panel) + t(1036, 476, 'Trend', 22, th.text, 700)
  s += `<defs><linearGradient id="ar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}" stop-opacity="0.45"/><stop offset="1" stop-color="${a}" stop-opacity="0"/></linearGradient></defs>`
  s += `<path d="M1036 860C1110 820 1150 700 1230 720S1350 600 1400 560 1480 520 1496 500V920H1036Z" fill="url(#ar)"/>`
  s += `<path d="M1036 860C1110 820 1150 700 1230 720S1350 600 1400 560 1480 520 1496 500" fill="none" stroke="${a}" stroke-width="5"/>`
  return s
}

const renderers: Record<MockKind, (p: Project, th: Theme, a: string) => string> = {
  portal,
  intranet,
  chat,
  crm,
  mobile,
  flow,
  governance,
  dashboard,
}

export function projectMockSvg(p: Project) {
  const th = lightKinds.includes(p.kind) ? light : dark
  const a = p.accent
  const url = `${p.slug.replace(/-/g, '')}.app`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs><clipPath id="frame"><rect width="${W}" height="${H}" rx="32"/></clipPath></defs>
<g clip-path="url(#frame)">
${r(0, 0, W, H, 0, th.bg)}
${r(0, 0, W, 64, 0, th.bar)}
<circle cx="36" cy="32" r="8" fill="#ff5f57"/><circle cx="62" cy="32" r="8" fill="#febc2e"/><circle cx="88" cy="32" r="8" fill="#28c840"/>
${r(560, 16, 480, 32, 16, th.pill)}${t(800, 38, url, 16, th.muted, 500, 'middle')}
${renderers[p.kind](p, th, a)}
</g>
</svg>`
}

export function projectMockDataUri(p: Project) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(projectMockSvg(p))}`
}

/** Real screenshot if provided, generated mock otherwise. */
export function projectImage(p: Project) {
  return p.image ?? projectMockDataUri(p)
}
