'use client'

import { useRef, useState } from 'react'
import { animate, createTimeline, stagger, svg, utils } from 'animejs'
import { isReducedMotion } from '@/lib/motion'
import { ArrowUpRight } from './ui/Icons'

type Fields = { firstName: string; lastName: string; email: string; subject: string; message: string; company: string }
type Errors = Partial<Record<keyof Fields, string>>

const empty: Fields = { firstName: '', lastName: '', email: '', subject: '', message: '', company: '' }

function validate(f: Fields): Errors {
  const e: Errors = {}
  if (!f.firstName.trim()) e.firstName = 'Please add your first name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'That email address doesn’t look right.'
  if (!f.subject.trim()) e.subject = 'A short subject helps me reply faster.'
  if (f.message.trim().length < 20) e.message = 'Tell me a little more (20 characters or more).'
  return e
}

/** Contact form with inline validation, a shake on errors and an animated success state. */
export function ContactForm() {
  const [fields, setFields] = useState<Fields>(empty)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [serverMsg, setServerMsg] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields((f) => ({ ...f, [k]: e.target.value }))
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }))
  }

  const playSuccess = () => {
    requestAnimationFrame(() => {
      const el = successRef.current
      if (!el) return
      el.querySelector<HTMLElement>('h3')?.focus({ preventScroll: true })
      if (isReducedMotion()) return
      const paths = svg.createDrawable(el.querySelectorAll('.ok-path'))
      utils.set(paths, { draw: '0 0' })
      createTimeline({ defaults: { ease: 'out(4)' } })
        .add(el, { opacity: [0, 1], scale: [0.96, 1], duration: 500 })
        .add(paths, { draw: ['0 0', '0 1'], duration: 800, delay: stagger(200), ease: 'inOut(3)' }, 100)
        .add(el.querySelectorAll('.ok-line'), { opacity: [0, 1], y: [16, 0], duration: 700, delay: stagger(80) }, 500)
    })
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(fields)
    setErrors(errs)
    if (Object.keys(errs).length) {
      const form = formRef.current!
      if (!isReducedMotion()) animate(form.querySelectorAll('[aria-invalid="true"]'), { x: [0, -10, 8, -6, 4, 0], duration: 500, ease: 'out(2)' })
      requestAnimationFrame(() => form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (!res.ok || !data.ok) throw new Error(data.error || 'Something went wrong.')
      setStatus('sent')
      setFields(empty)
      playSuccess()
    } catch (err) {
      setStatus('error')
      setServerMsg(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  if (status === 'sent') {
    return (
      <div ref={successRef} className="card flex min-h-[420px] flex-col items-center justify-center p-10 text-center" role="status">
        <svg viewBox="0 0 96 96" className="h-24 w-24 text-gold" aria-hidden="true">
          <circle className="ok-path" cx="48" cy="48" r="44" fill="none" stroke="currentColor" strokeWidth="2" />
          <path className="ok-path" d="M28 50l13 13 27-29" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3 tabIndex={-1} className="ok-line font-wide mt-8 text-3xl text-ink outline-none">Message sent.</h3>
        <p className="ok-line mt-3 max-w-sm text-ink-2">Thanks for reaching out. I reply to every message within two working days.</p>
        <button type="button" onClick={() => setStatus('idle')} className="ok-line btn btn-ghost mt-8">
          Send another
        </button>
      </div>
    )
  }

  const field = (k: keyof Fields, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div className="group relative">
      <input
        id={`cf-${k}`}
        name={k}
        value={fields[k]}
        onChange={set(k)}
        placeholder=" "
        aria-invalid={errors[k] ? 'true' : undefined}
        aria-describedby={errors[k] ? `cf-${k}-err` : undefined}
        className="peer block h-14 w-full rounded-2xl border border-line bg-bg/60 px-4 pt-5 text-ink transition-colors outline-none focus:border-gold aria-[invalid=true]:border-ember"
        {...props}
      />
      <label
        htmlFor={`cf-${k}`}
        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm text-ink-3 transition-all peer-focus:top-3.5 peer-focus:text-[11px] peer-focus:text-gold peer-[:not(:placeholder-shown)]:top-3.5 peer-[:not(:placeholder-shown)]:text-[11px]"
      >
        {label}
      </label>
      {errors[k] ? (
        <p id={`cf-${k}-err`} className="mt-1.5 pl-1 text-xs text-ember">
          {errors[k]}
        </p>
      ) : null}
    </div>
  )

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="card space-y-4 p-5 md:p-8" aria-label="Contact form">
      <div className="grid gap-4 sm:grid-cols-2">
        {field('firstName', 'First name *', { autoComplete: 'given-name' })}
        {field('lastName', 'Last name', { autoComplete: 'family-name' })}
      </div>
      {field('email', 'Email *', { type: 'email', autoComplete: 'email', inputMode: 'email' })}
      {field('subject', 'Subject *')}
      <div className="relative">
        <textarea
          id="cf-message"
          name="message"
          rows={5}
          value={fields.message}
          onChange={set('message')}
          placeholder=" "
          aria-invalid={errors.message ? 'true' : undefined}
          aria-describedby={errors.message ? 'cf-message-err' : undefined}
          className="peer block w-full resize-y rounded-2xl border border-line bg-bg/60 px-4 pt-7 pb-3 text-ink transition-colors outline-none focus:border-gold aria-[invalid=true]:border-ember"
        />
        <label
          htmlFor="cf-message"
          className="pointer-events-none absolute top-4 left-4 text-sm text-ink-3 transition-all peer-focus:top-2.5 peer-focus:text-[11px] peer-focus:text-gold peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-[11px]"
        >
          How can I help? *
        </label>
        {errors.message ? (
          <p id="cf-message-err" className="mt-1.5 pl-1 text-xs text-ember">
            {errors.message}
          </p>
        ) : null}
      </div>
      {/* Honeypot: hidden from people, tempting to bots. */}
      <div className="hidden" aria-hidden="true">
        <label>
          Company <input tabIndex={-1} autoComplete="off" value={fields.company} onChange={set('company')} name="company" />
        </label>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <p className="text-xs text-ink-3">* required. Your details are only used to reply to you.</p>
        <button type="submit" disabled={status === 'sending'} className="btn btn-primary disabled:opacity-60">
          {status === 'sending' ? 'Sending…' : 'Send message'}
          {status === 'sending' ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-on-gold/30 border-t-on-gold" /> : <ArrowUpRight size={16} />}
        </button>
      </div>
      {status === 'error' ? (
        <p role="alert" className="rounded-xl border border-ember/40 bg-ember/10 px-4 py-3 text-sm text-ink">
          {serverMsg} You can also email me directly.
        </p>
      ) : null}
      <span className="sr-only" aria-live="polite">
        {status === 'sending' ? 'Sending your message' : ''}
      </span>
    </form>
  )
}
