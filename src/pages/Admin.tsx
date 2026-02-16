import React from 'react'
import { useAuth } from '../lib/useAuth'
import ProjectsList from '../components/admin/ProjectsList'
import ContactFormsList from '../components/admin/ContactFormsList'
import SkillsList from '../components/admin/SkillsList'
import ExperiencesList from '../components/admin/ExperiencesList'
import CertificationsList from '../components/admin/CertificationsList'
import TestimonialsList from '../components/admin/TestimonialsList'
import AboutEditor from '../components/admin/AboutEditor'
import { useState } from 'react'
import '../styles/admin.css'

const Admin: React.FC = () => {
  const { auth, isAdmin } = useAuth()

  if (!auth) {
    return (
      <div className="min-h-screen p-8">
        <h2 className="text-xl font-semibold">Sign in required</h2>
        <p className="mt-2">Please <a href="#/auth?mode=login" className="text-cyan-300">sign in</a> to access the admin dashboard.</p>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen p-8">
        <h2 className="text-xl font-semibold text-red-400">Forbidden</h2>
        <p className="mt-2">You do not have permission to view this page.</p>
      </div>
    )
  }

  const [tab, setTab] = useState<'projects' | 'contacts' | 'users' | 'skills' | 'about' | 'certifications' | 'experiences' | 'testimonials'>('projects')

  const token = apiGetTokenFromAuth?.() ?? null
  function apiGetTokenFromAuth() {
    try {
      const a = (window as any).localStorage?.getItem('auth')
      if (!a) return null
      const parsed = JSON.parse(a)
      return parsed?.accessToken ?? null
    } catch {
      return null
    }
  }

  function decodeEmailFromToken(t: string | null) {
    if (!t) return null
    try {
      const parts = t.split('.')
      if (parts.length !== 3) return null
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
      return payload?.email ?? payload?.sub ?? null
    } catch {
      return null
    }
  }

  const userLabel = decodeEmailFromToken(token)

  return (
    <div className="admin-root">
      <aside className="admin-sidebar">
        <div className="admin-brand">Admin</div>
        <nav className="admin-nav">
          <button className={tab === 'projects' ? 'active' : ''} onClick={() => setTab('projects')}>Projects</button>
          <button className={tab === 'contacts' ? 'active' : ''} onClick={() => setTab('contacts')}>Contact Forms</button>
          <button className={tab === 'skills' ? 'active' : ''} onClick={() => setTab('skills')}>Skills</button>
          <button className={tab === 'experiences' ? 'active' : ''} onClick={() => setTab('experiences')}>Experiences</button>
          <button className={tab === 'certifications' ? 'active' : ''} onClick={() => setTab('certifications')}>Certifications</button>
          <button className={tab === 'testimonials' ? 'active' : ''} onClick={() => setTab('testimonials')}>Testimonials</button>
          <button className={tab === 'about' ? 'active' : ''} onClick={() => setTab('about')}>About</button>
          <button className={tab === 'users' ? 'active' : ''} onClick={() => setTab('users')}>Users</button>
        </nav>
        <div className="admin-info">Signed in as <strong>{userLabel ?? 'unknown'}</strong></div>
      </aside>

      <main className="admin-content">
        <header className="admin-header">
          <h1 className="admin-title">
            {tab === 'projects' ? 'Manage Projects'
              : tab === 'contacts' ? 'Contact Submissions'
              : tab === 'skills' ? 'Manage Skills'
              : tab === 'experiences' ? 'Manage Experiences'
              : tab === 'certifications' ? 'Manage Certifications'
              : tab === 'testimonials' ? 'Manage Testimonials'
              : tab === 'about' ? 'Edit About'
              : 'User Management'
            }
          </h1>
        </header>

        <section className="admin-panel">
          {tab === 'projects' && (
            <div className="admin-card-grid">
              <ProjectsList />
            </div>
          )}
          {tab === 'contacts' && (
            <div className="admin-card-grid">
              <ContactFormsList />
            </div>
          )}
          {tab === 'skills' && (
            <div className="admin-card-grid">
              <SkillsList />
            </div>
          )}
          {tab === 'experiences' && (
            <div className="admin-card-grid">
              <ExperiencesList />
            </div>
          )}
          {tab === 'certifications' && (
            <div className="admin-card-grid">
              <CertificationsList />
            </div>
          )}
          {tab === 'testimonials' && (
            <div className="admin-card-grid">
              <TestimonialsList />
            </div>
          )}
          {tab === 'about' && (
            <div className="admin-card-grid">
              <AboutEditor />
            </div>
          )}
          {tab === 'users' && (
            <div className="admin-placeholder">User management coming soon.</div>
          )}
        </section>
      </main>
    </div>
  )
}

export default Admin
