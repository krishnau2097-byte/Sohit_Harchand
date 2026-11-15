import { education, experience } from '@/content/experience'
import { Check } from './ui/Icons'

/** Work history as a single timeline card per role, with education beneath. */
export function ExperienceList({ showEducation = true }: { showEducation?: boolean }) {
  return (
    <div className="space-y-10">
      <ol className="relative space-y-6 border-l border-line pl-6 md:pl-8">
        {experience.map((job) => (
          <li key={job.role + job.company} data-reveal="" className="relative">
            <span className="status-dot absolute top-6 -left-[29px] h-2.5 w-2.5 rounded-full bg-gold md:-left-[37px]" aria-hidden="true" />
            <article className="card p-5 md:p-7">
              <header className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-ink">{job.role}</h3>
                  <p className="text-gold">{job.company}</p>
                </div>
                <p className="chip self-start">
                  {job.start} – {job.end}
                </p>
              </header>

              <p className="mt-4 text-sm text-ink-3">
                Dynamics 365 CE apps delivered: <span className="text-ink-2">{job.apps.join(' · ')}</span>
              </p>

              <ul className="mt-5 space-y-3">
                {job.achievements.map((a, i) => (
                  <li key={a} data-reveal="" style={{ '--d': `${i * 60}ms` } as React.CSSProperties} className="flex gap-3 text-sm leading-relaxed text-ink-2 md:text-[0.95rem]">
                    <Check size={16} className="mt-1 shrink-0 text-gold" />
                    {a}
                  </li>
                ))}
              </ul>

              <ul className="mt-6 flex flex-wrap gap-1.5 border-t border-line pt-5">
                {job.tech.map((t) => (
                  <li key={t} className="chip">
                    {t}
                  </li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ol>

      {showEducation ? (
        <div>
          <h3 data-reveal="" className="eyebrow">
            Education
          </h3>
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {education.map((e, i) => (
              <li key={e.title} data-reveal="" style={{ '--d': `${i * 80}ms` } as React.CSSProperties} className="card card-hover spotlight p-5">
                <p className="font-mono text-xs text-ink-3">{e.years}</p>
                <p className="mt-2 font-semibold text-ink">{e.title}</p>
                <p className="mt-1 text-sm text-ink-2">
                  {e.school}, {e.location}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
