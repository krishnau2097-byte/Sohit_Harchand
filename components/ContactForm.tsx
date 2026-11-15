'use client'

import { useRef, useState } from 'react'
import { ArrowRight } from './ui/Icons'

type Fields = { name: string; email: string; message: string; company: string }
type Errors = Partial<Record<keyof Fields, string>>

const empty: Fields = { name: '', email: '', message: '', company: '' }

function validate(f: Fields): Errors {
  const e: Errors = {}
  if (!f.name.trim()) e.name = 'Please add your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'That email address doesn’t look right.'
  if (f.message.trim().length < 20) e.message = 'Tell me a little more (20 characters or more).'
  return e
}

const inputCls =
  'block w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-3 transition-colors outline-none focus:border-gold aria-[invalid=true]:border-ember'

/** Contact form with inline validation and an animated success state. */
export function ContactForm() {
  const [fields, setFields] = useState<Fields>(empty)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [serverMsg, setServerMsg] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields((f) => ({ ...f, [k]: e.target.value }))
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(fields)
    setErrors(errs)
    if (Object.keys(errs).length) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
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
    } catch (err) {
      setStatus('error')
      setServerMsg(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  if (status === 'sent') {
    return (
      <div className="card pop-in flex min-h-[360px] flex-col items-center justify-center p-8 text-center" role="status">
        <svg viewBox="0 0 48 48" className="h-14 w-14 text-gold" aria-hidden="true">
          <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
          <path className="tick-draw" d="M14 25l7 7 13-15" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3 className="mt-5 text-xl font-semibold text-ink">Message sent</h3>
        <p className="mt-2 max-w-sm text-sm text-ink-2">Thanks for reaching out. I’ll get back to you soon.</p>
        <button type="button" onClick={() => setStatus('idle')} className="btn btn-ghost mt-6">
          Send another
        </button>
      </div>
    )
  }

  const err = (k: keyof Fields) =>
    errors[k] ? (
      <p id={`cf-${k}-err`} className="mt-1.5 text-xs text-ember">
        {errors[k]}
      </p>
    ) : null

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="card space-y-5 p-5 md:p-7" aria-label="Contact form">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="mb-1.5 block text-sm font-medium text-ink">
            Name
          </label>
          <input
            id="cf-name"
            name="name"
            autoComplete="name"
            placeholder="Your name"
            value={fields.name}
            onChange={set('name')}
            aria-invalid={errors.name ? 'true' : undefined}
            aria-describedby={errors.name ? 'cf-name-err' : undefined}
            className={inputCls}
          />
          {err('name')}
        </div>
        <div>
          <label htmlFor="cf-email" className="mb-1.5 block text-sm font-medium text-ink">
            Email
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={fields.email}
            onChange={set('email')}
            aria-invalid={errors.email ? 'true' : undefined}
            aria-describedby={errors.email ? 'cf-email-err' : undefined}
            className={inputCls}
          />
          {err('email')}
        </div>
      </div>
      <div>
        <label htmlFor="cf-message" className="mb-1.5 block text-sm font-medium text-ink">
          Message
        </label>
        <textarea
          id="cf-message"
          name="message"
          rows={5}
          placeholder="Tell me about your Dynamics 365, Power Platform or AI agent project…"
          value={fields.message}
          onChange={set('message')}
          aria-invalid={errors.message ? 'true' : undefined}
          aria-describedby={errors.message ? 'cf-message-err' : undefined}
          className={`${inputCls} resize-y`}
        />
        {err('message')}
      </div>
      {/* Honeypot: hidden from people, tempting to bots. */}
      <div className="hidden" aria-hidden="true">
        <label>
          Company <input tabIndex={-1} autoComplete="off" value={fields.company} onChange={set('company')} name="company" />
        </label>
      </div>
      <button type="submit" disabled={status === 'sending'} className="btn btn-primary w-full disabled:opacity-60">
        {status === 'sending' ? 'Sending…' : 'Send message'}
        {status === 'sending' ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-on-gold/30 border-t-on-gold" /> : <ArrowRight size={16} />}
      </button>
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
