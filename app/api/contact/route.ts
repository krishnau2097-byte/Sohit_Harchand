/**
 * Contact form backend. Configure ONE of these in .env.local (see .env.example):
 *  - CONTACT_WEBHOOK_URL  → any HTTPS webhook, e.g. a Power Automate "When an HTTP request is received" flow
 *  - RESEND_API_KEY + CONTACT_TO_EMAIL (+ optional CONTACT_FROM_EMAIL) → sends an email through Resend
 * With neither set, development logs the message to the server console;
 * production answers 503 so nothing is silently dropped.
 */

type Payload = { firstName?: string; lastName?: string; email?: string; subject?: string; message?: string; company?: string }

const clip = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export async function POST(request: Request) {
  let body: Payload
  try {
    body = (await request.json()) as Payload
  } catch {
    return Response.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  // Honeypot filled in: pretend success, drop it.
  if (clip(body.company, 200)) return Response.json({ ok: true })

  const data = {
    firstName: clip(body.firstName, 80),
    lastName: clip(body.lastName, 80),
    email: clip(body.email, 200),
    subject: clip(body.subject, 200),
    message: clip(body.message, 5000),
  }

  if (!data.firstName || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email) || !data.subject || data.message.length < 20) {
    return Response.json({ ok: false, error: 'Please check the highlighted fields.' }, { status: 422 })
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL
  const resendKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL

  try {
    if (webhook) {
      const res = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, receivedAt: new Date().toISOString() }),
      })
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`)
      return Response.json({ ok: true })
    }

    if (resendKey && to) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>',
          to: [to],
          reply_to: data.email,
          subject: `Portfolio: ${data.subject}`,
          text: `From: ${data.firstName} ${data.lastName} <${data.email}>\n\n${data.message}`,
        }),
      })
      if (!res.ok) throw new Error(`Resend responded ${res.status}`)
      return Response.json({ ok: true })
    }
  } catch (err) {
    console.error('[contact] delivery failed', err)
    return Response.json({ ok: false, error: 'The message could not be delivered right now.' }, { status: 502 })
  }

  if (process.env.NODE_ENV !== 'production') {
    console.info('[contact] no delivery configured; message received in development:', data)
    return Response.json({ ok: true, delivered: false })
  }
  return Response.json({ ok: false, error: 'The contact form is not configured yet.' }, { status: 503 })
}
