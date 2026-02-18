import React, { useState } from 'react'
import * as api from '../lib/api'
import ProfileCard from './ProfileCard'
// no longer need useQuery here

const ContactSection: React.FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [position, setPosition] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setStatus(null)
    try {
      // Map frontend fields to backend-expected names to satisfy validation
      const payload = {
        FullName: name,
        Email: email,
        Subject: position || (message ? message.slice(0, 80) : 'Contact Form Submission'),
        Message: message,
        Position: position
      }

      await api.postContactForm(payload)
      // Attempt to trigger an email send on the backend if available
      try {
        await api.sendContactEmail(payload)
      } catch (e) {
        // it's non-fatal if the endpoint doesn't exist; log for debugging
        console.warn('sendContactEmail failed or not supported', e)
      }

      setStatus('Thanks — your message was sent.')
      setName('')
      setEmail('')
      setPosition('')
      setMessage('')
    } catch (err: any) {
      console.error(err)
      setStatus(err?.message ?? 'Failed to send message')
    } finally {
      setSubmitting(false)
    }
  }

  // about data previously used for the visual card; removed with the card

  return (
    <section id="contact" className="mt-0 bg-transparent min-h-screen snap-start flex items-center relative">
      {/* GridScan removed */}
      <div className="mx-auto relative z-10 w-full max-w-6xl px-4 sm:px-6 py-8 sm:py-16">
        <div className="bg-white/3 backdrop-blur-md rounded-[16px] p-4 sm:p-6 md:p-8">
            <h2 className="font-display text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">Contact Me</h2>
            <p className="text-white/70 text-sm sm:text-base mb-4 sm:mb-6">Have a project, question, or want to collaborate? Send a message and I will get back to you.</p>

            <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 items-start">
              <div>
                <form onSubmit={handleSubmit} className="grid gap-3">
              <div>
                <label className="block text-xs sm:text-sm text-white/80">Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 sm:mt-2 p-2 sm:p-3 rounded bg-white/3 text-white text-sm sm:text-base" required />
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-white/80">Position Offered</label>
                <input value={position} onChange={e => setPosition(e.target.value)} className="w-full mt-1 sm:mt-2 p-2 sm:p-3 rounded bg-white/3 text-white text-sm sm:text-base" placeholder="What position are you offering?" />
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-white/80">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full mt-1 sm:mt-2 p-2 sm:p-3 rounded bg-white/3 text-white text-sm sm:text-base" required />
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-white/80">Message</label>
                <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} className="w-full mt-1 sm:mt-2 p-2 sm:p-3 rounded bg-white/3 text-white text-sm sm:text-base sm:rows-6" required />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-2 sm:gap-3">
                {status && <div className="text-xs sm:text-sm text-white/80 sm:mr-auto">{status}</div>}
                <button type="submit" disabled={submitting} className="hero-primary-btn w-full sm:w-auto text-sm sm:text-base">{submitting ? 'Sending…' : 'Send Message'}</button>
              </div>
            </form>
              </div>

              <div className="flex justify-center lg:justify-end mt-6 lg:mt-0">
                <div className="w-full max-w-[280px] sm:max-w-sm">
                  <ProfileCard
                    name="John Philip Garcia"
                    title=".NET Developer"
                    handle="ip33haa"
                    status="Online"
                    contactText="Contact Me"
                    avatarUrl="/Media.jpg"
                    showUserInfo={false}
                    enableTilt={true}
                    enableMobileTilt={false}
                    onContactClick={() => console.log('Contact clicked')}
                    behindGlowColor="rgba(125, 190, 255, 0.67)"
                    iconUrl="/logo-overlay.png"
                    behindGlowEnabled
                    innerGradient="linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"
                    />
                </div>
              </div>
            </div>
          </div>
      </div>
    </section>
  )
}

export default ContactSection
