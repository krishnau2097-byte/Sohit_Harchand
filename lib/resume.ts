import 'server-only'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

/** Public path of the downloadable résumé. */
export const resumeHref = '/resume.pdf'

/** The "Download résumé" button only renders once public/resume.pdf exists, so it never links to a 404. */
export const hasResume = () => existsSync(join(process.cwd(), 'public', 'resume.pdf'))
