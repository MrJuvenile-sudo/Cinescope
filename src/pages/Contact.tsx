import React, { useState } from 'react'
import { Mail, Send, AlertCircle, Info } from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { SectionHeading } from '../components/common/SectionHeading'
import { Button } from '../components/common/Button'
import { CONTACT_EMAIL } from '../config/tmdb'

export const Contact: React.FC = () => {
  useDocumentTitle('Contact — CineScope')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('Feedback')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || message.trim().length < 10) {
      return
    }

    // Prefill mailto URL honest flow
    const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      `[CineScope] ${subject} - ${name}`
    )}&body=${encodeURIComponent(
      `From: ${name} (${email})\n\nMessage:\n${message}`
    )}`

    window.location.href = mailtoUrl
    setSubmitted(true)
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 space-y-8">
      <SectionHeading
        as="h1"
        eyebrow="Direct Dispatch"
        title="Contact the Curator"
        subtitle="Have feedback, feature inquiries, or cinema recommendations? Reach out directly via our honest mail dispatch."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Container */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 sm:p-10 space-y-6">
          {submitted ? (
            <div className="p-6 rounded-2xl bg-[var(--surface-2)] border border-[var(--gold)]/40 space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-[var(--gold)] font-semibold text-base">
                <Info className="w-5 h-5 shrink-0" />
                <span>Mail Client Launched</span>
              </div>
              <p className="text-sm text-[var(--text)] leading-relaxed">
                Your email client was opened with your prefilled message addressed to{' '}
                <span className="font-mono text-[var(--gold)]">{CONTACT_EMAIL}</span>.
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Note: CineScope is a client-side SPA with no backend database; no data was stored or sent automatically.
              </p>
              <div className="pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Note
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Your Name <span className="text-[var(--primary)]">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Orson Welles"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus-visible:outline-2 focus-visible:outline-[var(--primary)] transition-all"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="contact-email" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Email Address <span className="text-[var(--primary)]">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. orson@cinema.org"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus-visible:outline-2 focus-visible:outline-[var(--primary)] transition-all"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label htmlFor="contact-subject" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Subject
                </label>
                <select
                  id="contact-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] focus-visible:outline-2 focus-visible:outline-[var(--primary)] transition-all cursor-pointer"
                >
                  <option value="Feedback">General Feedback & Impressions</option>
                  <option value="Bug Report">Technical Issue / Bug Report</option>
                  <option value="Feature Inquiry">Feature Inquiry or Suggestion</option>
                  <option value="Film Recommendation">Cinema Recommendation</option>
                </select>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="contact-message" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Message <span className="text-[var(--primary)]">*</span>
                  </label>
                  <span className="text-xs text-[var(--text-muted)] tabular-nums">
                    {message.length} / 1000
                  </span>
                </div>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  maxLength={1000}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your thoughts, discoveries, or technical questions..."
                  className="w-full px-4 py-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus-visible:outline-2 focus-visible:outline-[var(--primary)] transition-all resize-y"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <Button size="lg" type="submit" icon={<Send className="w-4 h-4" />}>
                  Dispatch Message
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Info Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              <Mail className="w-4 h-4" />
              <span>Direct Inquiries</span>
            </div>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              We welcome correspondence regarding code structure, design critique, and movie curation.
            </p>
            <div className="pt-2 text-sm font-mono text-[var(--gold)]">
              {CONTACT_EMAIL}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)]/30 p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">
              <AlertCircle className="w-4 h-4" />
              <span>Privacy Guarantee</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              CineScope transmits no contact data to proprietary databases or third-party marketing services.
              All messages are dispatched strictly through your device's native mail application.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
