'use client'

import React, { useState } from 'react'
import { Metadata } from 'next'
import { ShieldCheck, Mail, MapPin, CheckCircle2, AlertCircle, Send, Lock } from 'lucide-react'
import { SITE_CONFIG } from '@/config/site'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'news-tip',
    subject: '',
    message: '',
    anonymous: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const res = await fetch('/api/editorial-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to transmit message')
      }

      setSubmitted(true)
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while transmitting to the editorial desk.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-slate-50 py-12 lg:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-800">
            <Lock className="h-3 w-3" /> Secure Editorial Desk
          </div>
          <h1 className="mt-4 font-serif text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
            Newsroom Desk &amp; Inquiries
          </h1>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Submit confidential news tips, report algorithm shifts, or request factual corrections. All communications are reviewed by our editorial board.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Contact Details & Editorial Commitments */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-sans text-base font-bold text-slate-900">Physical Newsroom</h3>
              <div className="mt-4 space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-800">{SITE_CONFIG.legalName}</strong>
                    <span>{SITE_CONFIG.address.streetAddress}</span>
                    <span className="block">{SITE_CONFIG.address.addressLocality}, {SITE_CONFIG.address.addressRegion} {SITE_CONFIG.address.postalCode}</span>
                    <span className="text-slate-500">United States of America</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pt-2 border-t border-slate-100">
                  <Mail className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-800">Direct Inquiries</strong>
                    <span>{SITE_CONFIG.contact.pressInquiries}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <span>Source Protection Policy</span>
              </div>
              <p className="mt-2 text-xs text-emerald-900 leading-relaxed">
                AINE.WS protects the confidentiality of whistleblowers, corporate sources, and algorithm researchers under established journalistic privilege principles. You may submit anonymously.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h4 className="font-sans text-sm font-bold text-slate-900">Editorial Response Protocol</h4>
              <ul className="mt-3 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  <span><strong>Corrections:</strong> Acknowledged within 4 hours</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                  <span><strong>Breaking Tips:</strong> Triaged continuously 24/7</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                  <span><strong>General Inquiries:</strong> 1 business day</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Interactive Form */}
          <div className="lg:col-span-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              {submitted ? (
                <div className="py-12 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h3 className="mt-4 font-serif text-2xl font-bold text-slate-900">
                    Transmission Received
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
                    Your message has been securely logged with the AINE.WS editorial newsroom desk. If you provided contact information, an assigning editor will follow up shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false)
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        inquiryType: 'news-tip',
                        subject: '',
                        message: '',
                        anonymous: false,
                      })
                    }}
                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
                  >
                    Submit Another Transmission
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {errorMessage && (
                    <div className="flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div>
                    <label htmlFor="inquiryType" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Inquiry Desk / Nature of Communication *
                    </label>
                    <select
                      id="inquiryType"
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    >
                      <option value="news-tip">📰 Confidential News Tip / Industry Leak</option>
                      <option value="correction">✏️ Factual Correction Request</option>
                      <option value="justin-davis">👤 Message for Justin Davis (Search &amp; Algorithms)</option>
                      <option value="marcus-vance">👤 Message for Marcus Vance (Sales Telephony)</option>
                      <option value="elena-chen">👤 Message for Elena Chen (Local Business &amp; Maps)</option>
                      <option value="press">💼 Press, Syndication &amp; Media Inquiries</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Your Name {formData.anonymous && <span className="text-slate-400 font-normal">(Optional)</span>}
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        disabled={formData.anonymous}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={formData.anonymous ? 'Confidential Source' : 'e.g. Sarah Jenkins'}
                        className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 shadow-sm disabled:bg-slate-100 disabled:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Email Address {formData.anonymous ? <span className="text-slate-400 font-normal">(Optional)</span> : '*'}
                      </label>
                      <input
                        type="email"
                        id="email"
                        required={!formData.anonymous}
                        disabled={formData.anonymous}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={formData.anonymous ? 'Protected by shield' : 'you@company.com'}
                        className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 shadow-sm disabled:bg-slate-100 disabled:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Phone Number <span className="text-slate-400 font-normal">(Optional, for urgent wire verification)</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      disabled={formData.anonymous}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 shadow-sm disabled:bg-slate-100 disabled:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 border border-slate-200">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={formData.anonymous}
                      onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <label htmlFor="anonymous" className="text-xs font-medium text-slate-700 select-none cursor-pointer">
                      Submit as a <strong>Confidential Anonymous Source</strong> (strips identifying metadata)
                    </label>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Subject / Headline *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Unannounced Google Business Profile layout test in Midwest"
                      className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Detailed Information &amp; Supporting Context *
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please include dates, URLs, documentation, or verifiable observations..."
                      className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow transition hover:bg-slate-800 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Transmitting to Newsroom...</span>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Transmit to Editorial Board</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
