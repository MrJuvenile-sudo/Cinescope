import React, { useState, useRef } from 'react'
import { Mail, Send, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { SectionHeading } from '../components/common/SectionHeading'
import { Button } from '../components/common/Button'
import { CONTACT_EMAIL } from '../config/tmdb'

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const Contact: React.FC = () => {
  useDocumentTitle('Contact Us — CineScope')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('General Feedback')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<{ [K in keyof FormErrors]?: boolean }>({})
  const [submitted, setSubmitted] = useState(false)

  // Input refs for programmatic focus management
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {}

    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = 'Please enter your name (minimum 2 characters).'
    }

    if (!email.trim() || !EMAIL_REGEX.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address (e.g. name@domain.com).'
    }

    if (!message.trim() || message.trim().length < 10) {
      newErrors.message = 'Please provide a message containing at least 10 characters.'
    } else if (message.trim().length > 1000) {
      newErrors.message = 'Message must not exceed 1,000 characters.'
    }

    return newErrors
  }

  const handleBlur = (field: keyof FormErrors) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const currentErrors = validate()
    setErrors((prev) => ({ ...prev, [field]: currentErrors[field] }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ name: true, email: true, message: true })

    const formErrors = validate()
    setErrors(formErrors)

    // Focus the first invalid field per accessibility rules
    if (formErrors.name) {
      nameRef.current?.focus()
      return
    }
    if (formErrors.email) {
      emailRef.current?.focus()
      return
    }
    if (formErrors.message) {
      messageRef.current?.focus()
      return
    }

    // Honest mailto: submission flow (no backend server or database)
    const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      `[CineScope] ${subject} - ${name.trim()}`
    )}&body=${encodeURIComponent(
      `From: ${name.trim()} (${email.trim()})\nSubject: ${subject}\n\nMessage:\n${message.trim()}`
    )}`

    window.location.href = mailtoUrl
    setSubmitted(true)
  }

  const handleReset = () => {
    setName('')
    setEmail('')
    setSubject('General Feedback')
    setMessage('')
    setErrors({})
    setTouched({})
    setSubmitted(false)
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
            <div
              role="status"
              aria-live="polite"
              className="p-6 sm:p-8 rounded-2xl bg-[var(--surface-2)] border border-[var(--gold)]/40 space-y-4 animate-fade-in"
            >
              <div className="flex items-center gap-3 text-[var(--gold)] font-semibold text-lg font-serif">
                <CheckCircle2 className="w-6 h-6 text-[var(--gold)] shrink-0" />
                <span>Mail Client Launched</span>
              </div>

              <div className="space-y-2 text-sm text-[var(--text)] leading-relaxed">
                <p>
                  Your device's default mail application was opened with your prefilled message addressed to{' '}
                  <strong className="font-mono text-[var(--gold)]">{CONTACT_EMAIL}</strong>.
                </p>
                <p className="text-xs text-[var(--text-muted)] bg-[var(--surface)] p-3 rounded-xl border border-[var(--border)]">
                  <strong>Transparency Notice:</strong> CineScope operates exclusively as a client-side
                  single-page application without a backend database or mail server. No personal data was
                  stored or sent automatically.
                </p>
              </div>

              <div className="pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleReset}
                  icon={<RotateCcw className="w-3.5 h-3.5" />}
                >
                  Send Another Note
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]"
                  >
                    Your Name <span className="text-[var(--primary)]">*</span>
                  </label>
                  <input
                    ref={nameRef}
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      if (touched.name) {
                        setErrors((prev) => ({
                          ...prev,
                          name:
                            e.target.value.trim().length >= 2
                              ? undefined
                              : 'Please enter your name (minimum 2 characters).',
                        }))
                      }
                    }}
                    onBlur={() => handleBlur('name')}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                    placeholder="e.g. Orson Welles"
                    className={`w-full px-4 py-3 rounded-xl bg-[var(--surface-2)] border text-sm text-[var(--text)] placeholder-[var(--text-muted)] transition-all outline-none focus-visible:outline-2 ${
                      errors.name
                        ? 'border-[var(--primary)] focus-visible:outline-[var(--primary)]'
                        : 'border-[var(--border)] focus-visible:outline-[var(--primary)] focus-visible:border-transparent'
                    }`}
                  />
                  {errors.name && (
                    <p
                      id="contact-name-error"
                      role="alert"
                      className="text-xs text-[var(--primary)] flex items-center gap-1.5 pt-0.5"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]"
                  >
                    Email Address <span className="text-[var(--primary)]">*</span>
                  </label>
                  <input
                    ref={emailRef}
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (touched.email) {
                        setErrors((prev) => ({
                          ...prev,
                          email: EMAIL_REGEX.test(e.target.value.trim())
                            ? undefined
                            : 'Please enter a valid email address (e.g. name@domain.com).',
                        }))
                      }
                    }}
                    onBlur={() => handleBlur('email')}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                    placeholder="e.g. orson@cinema.org"
                    className={`w-full px-4 py-3 rounded-xl bg-[var(--surface-2)] border text-sm text-[var(--text)] placeholder-[var(--text-muted)] transition-all outline-none focus-visible:outline-2 ${
                      errors.email
                        ? 'border-[var(--primary)] focus-visible:outline-[var(--primary)]'
                        : 'border-[var(--border)] focus-visible:outline-[var(--primary)] focus-visible:border-transparent'
                    }`}
                  />
                  {errors.email && (
                    <p
                      id="contact-email-error"
                      role="alert"
                      className="text-xs text-[var(--primary)] flex items-center gap-1.5 pt-0.5"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Subject Select */}
              <div className="space-y-1.5">
                <label
                  htmlFor="contact-subject"
                  className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]"
                >
                  Subject Matter
                </label>
                <select
                  id="contact-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] focus-visible:outline-2 focus-visible:outline-[var(--primary)] transition-all cursor-pointer"
                >
                  <option value="General Feedback">General Feedback & Impressions</option>
                  <option value="Bug Report">Technical Issue / Bug Report</option>
                  <option value="Feature Inquiry">Feature Inquiry or Suggestion</option>
                  <option value="Film Recommendation">Cinema Recommendation</option>
                  <option value="Press & Collaboration">Press & Collaboration</option>
                </select>
              </div>

              {/* Message Textarea with Live Counter */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]"
                  >
                    Message Body <span className="text-[var(--primary)]">*</span>
                  </label>
                  <span
                    className={`text-xs tabular-nums ${
                      message.length > 1000
                        ? 'text-[var(--primary)] font-semibold'
                        : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {message.length} / 1000
                  </span>
                </div>
                <textarea
                  ref={messageRef}
                  id="contact-message"
                  required
                  rows={5}
                  maxLength={1000}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value)
                    if (touched.message) {
                      setErrors((prev) => ({
                        ...prev,
                        message:
                          e.target.value.trim().length >= 10
                            ? undefined
                            : 'Please provide a message containing at least 10 characters.',
                      }))
                    }
                  }}
                  onBlur={() => handleBlur('message')}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'contact-message-error' : undefined}
                  placeholder="Share your thoughts, discoveries, or technical questions..."
                  className={`w-full px-4 py-3 rounded-xl bg-[var(--surface-2)] border text-sm text-[var(--text)] placeholder-[var(--text-muted)] transition-all resize-y outline-none focus-visible:outline-2 ${
                    errors.message
                      ? 'border-[var(--primary)] focus-visible:outline-[var(--primary)]'
                      : 'border-[var(--border)] focus-visible:outline-[var(--primary)] focus-visible:border-transparent'
                  }`}
                />
                {errors.message && (
                  <p
                    id="contact-message-error"
                    role="alert"
                    className="text-xs text-[var(--primary)] flex items-center gap-1.5 pt-0.5"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.message}</span>
                  </p>
                )}
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
