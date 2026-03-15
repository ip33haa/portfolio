import React, { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowRight,
  Award,
  Briefcase,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  X,
} from 'lucide-react'
import ProjectsList from '../components/admin/ProjectsList'
import ContactFormsList from '../components/admin/ContactFormsList'
import SkillsList from '../components/admin/SkillsList'
import ExperiencesList from '../components/admin/ExperiencesList'
import CertificationsList from '../components/admin/CertificationsList'
import TestimonialsList from '../components/admin/TestimonialsList'
import AboutEditor from '../components/admin/AboutEditor'
import UsersList from '../components/admin/UsersList'
import { useAuth } from '../lib/useAuth'
import * as api from '../lib/api'
import '../styles/admin.css'

type AdminTab =
  | 'overview'
  | 'projects'
  | 'contacts'
  | 'skills'
  | 'experiences'
  | 'certifications'
  | 'testimonials'
  | 'about'
  | 'users'

type TabConfig = {
  id: AdminTab
  label: string
  description: string
  icon: typeof LayoutDashboard
  count?: number
}

function decodeJwtPayload(token: string | null | undefined) {
  if (!token) return null

  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const base64Url = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64Url.padEnd(Math.ceil(base64Url.length / 4) * 4, '=')
    return JSON.parse(atob(padded)) as Record<string, unknown>
  } catch {
    return null
  }
}

function getUserLabel(claims: Record<string, unknown> | null) {
  const email = claims?.email
  const subject = claims?.sub

  if (typeof email === 'string' && email.length > 0) return email
  if (typeof subject === 'string' && subject.length > 0) return subject

  return 'unknown'
}

function getUserShortName(userLabel: string) {
  if (!userLabel || userLabel === 'unknown') return 'admin'
  return userLabel.includes('@') ? userLabel.split('@')[0] : userLabel
}

function getGreeting() {
  const hour = new Date().getHours()

  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function formatSubmittedAt(value: unknown) {
  if (typeof value !== 'string' && !(value instanceof Date)) return 'Just now'

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return 'Just now'

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

const Admin: React.FC = () => {
  const { auth, isAdmin, role, logout } = useAuth()
  const [tab, setTab] = useState<AdminTab>('overview')
  const [navOpen, setNavOpen] = useState(false)

  const claims = useMemo(() => decodeJwtPayload(auth?.accessToken), [auth?.accessToken])
  const userLabel = getUserLabel(claims)
  const shortName = getUserShortName(userLabel)
  const dashboardEnabled = Boolean(auth && isAdmin)

  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ['admin', 'projects'],
    queryFn: () => api.getProjects(),
    enabled: dashboardEnabled,
    staleTime: 30_000,
  })

  const { data: contactsData, isLoading: contactsLoading } = useQuery({
    queryKey: ['admin', 'contacts'],
    queryFn: () => api.getContactForms(),
    enabled: dashboardEnabled,
    staleTime: 30_000,
  })

  const projects = Array.isArray(projectsData) ? projectsData : []
  const contacts = Array.isArray(contactsData) ? contactsData : []
  const unreadContacts = contacts.filter((contact: any) => !contact?.isRead)
  const recentContacts = (unreadContacts.length > 0 ? unreadContacts : contacts).slice(0, 3)

  const tabs: TabConfig[] = [
    {
      id: 'overview',
      label: 'Overview',
      description: 'Quick insight into projects, unread messages, and admin status.',
      icon: LayoutDashboard,
    },
    {
      id: 'projects',
      label: 'Projects',
      description: 'Create, edit, and polish the portfolio projects shown on the site.',
      icon: FolderKanban,
      count: projects.length,
    },
    {
      id: 'contacts',
      label: 'Inbox',
      description: 'Review incoming contact submissions and keep the inbox clear.',
      icon: Mail,
      count: unreadContacts.length,
    },
    {
      id: 'skills',
      label: 'Skills',
      description: 'Maintain the list of strengths and technologies visible on the site.',
      icon: Target,
    },
    {
      id: 'experiences',
      label: 'Experience',
      description: 'Edit work history and career highlights.',
      icon: Briefcase,
    },
    {
      id: 'certifications',
      label: 'Certificates',
      description: 'Manage certifications, issuers, and supporting details.',
      icon: Award,
    },
    {
      id: 'testimonials',
      label: 'Testimonials',
      description: 'Curate social proof and client or team feedback.',
      icon: MessageSquare,
    },
    {
      id: 'about',
      label: 'About',
      description: 'Update personal profile, social links, and public summary.',
      icon: FileText,
    },
    {
      id: 'users',
      label: 'Users',
      description: 'Review administrator accounts and user access.',
      icon: Users,
    },
  ]

  const currentTab = tabs.find((item) => item.id === tab) ?? tabs[0]

  const statCards = [
    {
      label: 'Projects',
      value: projectsLoading ? '...' : String(projects.length),
      note: projects.length > 0 ? 'Portfolio entries ready to display' : 'No projects created yet',
      icon: FolderKanban,
    },
    {
      label: 'Inbox',
      value: contactsLoading ? '...' : String(contacts.length),
      note:
        unreadContacts.length > 0
          ? `${unreadContacts.length} unread message${unreadContacts.length === 1 ? '' : 's'}`
          : 'All messages reviewed',
      icon: Mail,
      highlight: unreadContacts.length > 0,
    },
    {
      label: 'Access',
      value: role ?? 'Admin',
      note: 'Secure workspace for content management',
      icon: ShieldCheck,
    },
  ]

  const closeNav = () => setNavOpen(false)

  const switchTab = (nextTab: AdminTab) => {
    setTab(nextTab)
    closeNav()
  }

  const handleLogout = async () => {
    closeNav()
    await logout()
    window.location.hash = '#/auth?mode=login'
  }

  const renderPanel = () => {
    switch (tab) {
      case 'overview':
        return (
          <section className="admin-content-grid">
            <article className="admin-feature-card">
              <div className="admin-section-heading">
                <span className="admin-chip">
                  <Sparkles size={14} />
                  Fast actions
                </span>
                <h2>Everything important in one place</h2>
                <p className="admin-section-copy">
                  Jump into content editing, inbox cleanup, or profile updates from a layout tuned for desktop and mobile.
                </p>
              </div>

              <div className="admin-quick-actions">
                <button type="button" className="admin-quick-action" onClick={() => switchTab('projects')}>
                  <FolderKanban size={18} />
                  <div>
                    <strong>Open project manager</strong>
                    <span>Create, edit, and publish portfolio work quickly.</span>
                  </div>
                </button>

                <button type="button" className="admin-quick-action" onClick={() => switchTab('contacts')}>
                  <Mail size={18} />
                  <div>
                    <strong>Review messages</strong>
                    <span>
                      {unreadContacts.length > 0
                        ? `${unreadContacts.length} unread message${unreadContacts.length === 1 ? '' : 's'} waiting`
                        : 'Inbox is clear right now'}
                    </span>
                  </div>
                </button>

                <button type="button" className="admin-quick-action" onClick={() => switchTab('about')}>
                  <FileText size={18} />
                  <div>
                    <strong>Refresh profile section</strong>
                    <span>Update the public bio, contact details, and social links.</span>
                  </div>
                </button>
              </div>
            </article>

            <article className="admin-feature-card">
              <div className="admin-section-heading">
                <span className="admin-chip">Recent activity</span>
                <h2>Latest contact submissions</h2>
                <p className="admin-section-copy">
                  The newest unread messages appear here first so nothing important gets missed.
                </p>
              </div>

              {recentContacts.length > 0 ? (
                <div className="admin-recent-list">
                  {recentContacts.map((contact: any) => (
                    <button
                      key={contact.id ?? `${contact.email ?? 'contact'}-${contact.submittedAt ?? ''}`}
                      type="button"
                      className="admin-recent-item"
                      onClick={() => switchTab('contacts')}
                    >
                      <div className="admin-recent-top">
                        <span className="admin-recent-name">{contact.fullName ?? 'Unknown sender'}</span>
                        <span className="admin-recent-date">{formatSubmittedAt(contact.submittedAt)}</span>
                      </div>
                      <p className="admin-recent-message">
                        {contact.subject ? `${contact.subject} — ` : ''}
                        {typeof contact.message === 'string' && contact.message.length > 140
                          ? `${contact.message.slice(0, 140)}...`
                          : contact.message ?? 'No message content.'}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="admin-empty-state">
                  <div className="admin-empty-icon">
                    <Mail size={18} />
                  </div>
                  <strong>No contact submissions yet</strong>
                  <p>Incoming messages will appear here as soon as people use the contact form.</p>
                </div>
              )}
            </article>
          </section>
        )
      case 'projects':
        return (
          <section className="admin-surface">
            <ProjectsList />
          </section>
        )
      case 'contacts':
        return (
          <section className="admin-surface">
            <ContactFormsList />
          </section>
        )
      case 'skills':
        return (
          <section className="admin-surface">
            <SkillsList />
          </section>
        )
      case 'experiences':
        return (
          <section className="admin-surface">
            <ExperiencesList />
          </section>
        )
      case 'certifications':
        return (
          <section className="admin-surface">
            <CertificationsList />
          </section>
        )
      case 'testimonials':
        return (
          <section className="admin-surface">
            <TestimonialsList />
          </section>
        )
      case 'about':
        return (
          <section className="admin-surface">
            <AboutEditor />
          </section>
        )
      case 'users':
        return (
          <section className="admin-surface">
            <UsersList />
          </section>
        )
      default:
        return null
    }
  }

  if (!auth) {
    return (
      <div className="admin-guard">
        <div className="admin-guard-card">
          <div className="admin-guard-icon">
            <ShieldCheck size={20} />
          </div>
          <span className="admin-chip">Authentication required</span>
          <h1>Sign in to open the dashboard</h1>
          <p>
            The admin area is protected. Sign in with an administrator account to manage projects and review contact submissions.
          </p>
          <div className="admin-guard-actions">
            <a href="#/auth?mode=login" className="admin-primary-btn">
              Go to sign in
            </a>
          </div>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="admin-guard">
        <div className="admin-guard-card">
          <div className="admin-guard-icon admin-guard-icon--alert">
            <X size={20} />
          </div>
          <span className="admin-chip admin-chip--alert">Access blocked</span>
          <h1>Administrator access only</h1>
          <p>
            This account does not have permission to use the admin dashboard. Sign in with an administrator account to continue.
          </p>
          <div className="admin-guard-actions">
            <button type="button" className="admin-secondary-btn" onClick={handleLogout}>
              Sign out
            </button>
            <a href="#/" className="admin-text-btn">
              Back to portfolio
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-shell">
      <div
        className={`admin-mobile-overlay ${navOpen ? 'is-visible' : ''}`}
        onClick={closeNav}
        aria-hidden={!navOpen}
      />

      <aside className={`admin-sidebar ${navOpen ? 'is-open' : ''}`}>
        <div className="admin-sidebar-top">
          <div className="admin-brand-wrap">
            <div className="admin-brand-icon">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="admin-eyebrow">Portfolio control center</p>
              <div className="admin-brand">Admin dashboard</div>
            </div>
          </div>

          <button
            type="button"
            className="admin-close-btn"
            onClick={closeNav}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        <div className="admin-profile-card">
          <span className="admin-chip">Signed in as {role ?? 'Admin'}</span>
          <strong>{userLabel}</strong>
          <p>
            Manage projects, profile content, and incoming messages from one responsive workspace.
          </p>
        </div>

        <nav className="admin-nav" aria-label="Admin sections">
          {tabs.map(({ id, label, description, icon: Icon, count }) => (
            <button
              key={id}
              type="button"
              className={`admin-nav-btn ${tab === id ? 'is-active' : ''}`}
              onClick={() => switchTab(id)}
            >
              <span className="admin-nav-icon">
                <Icon size={18} />
              </span>

              <span className="admin-nav-copy">
                <span className="admin-nav-label-row">
                  <span className="admin-nav-label">{label}</span>
                  {typeof count === 'number' && (
                    <span className={`admin-nav-count ${id === 'contacts' && count > 0 ? 'is-alert' : ''}`}>
                      {count}
                    </span>
                  )}
                </span>
                <span className="admin-nav-desc">{description}</span>
              </span>
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button type="button" className="admin-ghost-btn" onClick={handleLogout}>
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header-main">
            <button
              type="button"
              className="admin-menu-btn"
              onClick={() => setNavOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={18} />
            </button>

            <div>
              <p className="admin-eyebrow">
                {getGreeting()}, {shortName}
              </p>
              <h1 className="admin-title">{currentTab.label}</h1>
              <p className="admin-subtitle">{currentTab.description}</p>
            </div>
          </div>

          <div className="admin-header-actions">
            <button type="button" className="admin-secondary-btn" onClick={() => switchTab('contacts')}>
              Unread inbox
              <span className="admin-pill">{unreadContacts.length}</span>
            </button>
            <button type="button" className="admin-primary-btn" onClick={() => switchTab('projects')}>
              Manage projects
              <ArrowRight size={16} />
            </button>
          </div>
        </header>

        <section className="admin-stats-grid" aria-label="Admin overview metrics">
          {statCards.map(({ label, value, note, icon: Icon, highlight }) => (
            <article key={label} className={`admin-stat-card ${highlight ? 'admin-stat-card--highlight' : ''}`}>
              <div className="admin-stat-icon">
                <Icon size={18} />
              </div>
              <div className="admin-stat-copy">
                <span className="admin-stat-label">{label}</span>
                <strong className="admin-stat-value">{value}</strong>
                <span className="admin-stat-note">{note}</span>
              </div>
            </article>
          ))}
        </section>

        {renderPanel()}
      </main>
    </div>
  )
}

export default Admin
