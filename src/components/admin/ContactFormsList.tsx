import React, { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Clock3, Inbox, Mail, MailCheck, Phone, Trash2 } from 'lucide-react'
import * as api from '../../lib/api'

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message
  if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as any).message === 'string') {
    return (error as any).message
  }

  return 'Something went wrong while loading contact submissions.'
}

function formatDate(value: unknown) {
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

const ContactFormsList: React.FC = () => {
  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin', 'contacts'],
    queryFn: () => api.getContactForms(),
    staleTime: 30_000,
  })

  const contacts = useMemo(() => (Array.isArray(data) ? data : []), [data])
  const unreadCount = contacts.filter((contact: any) => !contact?.isRead).length

  const markMut = useMutation({
    mutationFn: (id: any) => api.markContactFormAsRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'contacts'] }),
  })

  const delMut = useMutation({
    mutationFn: (id: any) => api.deleteContactFormSubmission(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'contacts'] }),
  })

  const mutationError = markMut.error ?? delMut.error

  const handleDelete = async (contact: any) => {
    if (!contact?.id) return

    const label = contact.fullName ?? contact.email ?? 'this contact message'
    if (!window.confirm(`Delete the message from "${label}"?`)) return

    try {
      await delMut.mutateAsync(contact.id)
    } catch (deleteError) {
      console.error(deleteError)
    }
  }

  const handleMarkRead = async (id: any) => {
    if (!id) return

    try {
      await markMut.mutateAsync(id)
    } catch (markError) {
      console.error(markError)
    }
  }

  return (
    <div className="admin-section-stack">
      <div className="admin-list-toolbar">
        <div>
          <p className="admin-eyebrow">Inbox management</p>
          <h2 className="admin-list-title">Contact submissions</h2>
        </div>

        <div className="admin-toolbar-actions">
          <span className="admin-counter">{unreadCount} unread</span>
        </div>
      </div>

      {mutationError && <div className="admin-error-banner">{getErrorMessage(mutationError)}</div>}

      {isLoading && (
        <div className="admin-empty-state">
          <div className="admin-empty-icon">
            <Inbox size={18} />
          </div>
          <strong>Loading inbox</strong>
          <p>Fetching the most recent contact submissions.</p>
        </div>
      )}

      {!isLoading && isError && (
        <div className="admin-error-banner">{getErrorMessage(error)}</div>
      )}

      {!isLoading && !isError && contacts.length === 0 && (
        <div className="admin-empty-state">
          <div className="admin-empty-icon">
            <Inbox size={18} />
          </div>
          <strong>No messages yet</strong>
          <p>New contact form submissions will appear here automatically.</p>
        </div>
      )}

      {!isLoading && !isError && contacts.length > 0 && (
        <div className="admin-message-list">
          {contacts.map((contact: any) => (
            <article key={contact.id} className={`admin-message-card ${!contact.isRead ? 'is-unread' : ''}`}>
              <div className="admin-message-header">
                <div className="admin-message-title-group">
                  <div className="admin-message-author">{contact.fullName ?? 'Unknown sender'}</div>
                  {contact.email && (
                    <a href={`mailto:${contact.email}`} className="admin-inline-link">
                      <Mail size={14} />
                      {contact.email}
                    </a>
                  )}
                </div>

                <div className="admin-message-meta">
                  <span className={`admin-status ${contact.isRead ? 'admin-status--muted' : 'admin-status--info'}`}>
                    {contact.isRead ? 'Read' : 'Unread'}
                  </span>
                  <span className="admin-message-date">
                    <Clock3 size={14} />
                    {formatDate(contact.submittedAt)}
                  </span>
                </div>
              </div>

              {contact.subject && <div className="admin-message-subject">{contact.subject}</div>}

              <p className="admin-message-body">{contact.message ?? 'No message text.'}</p>

              <div className="admin-message-footer">
                <div className="admin-contact-meta">
                  {contact.phone && (
                    <a href={`tel:${contact.phone}`} className="admin-inline-link">
                      <Phone size={14} />
                      {contact.phone}
                    </a>
                  )}
                </div>

                <div className="admin-card-actions">
                  {!contact.isRead && (
                    <button
                      type="button"
                      className="admin-secondary-btn small"
                      onClick={() => void handleMarkRead(contact.id)}
                      disabled={markMut.isPending}
                    >
                      <MailCheck size={14} />
                      Mark read
                    </button>
                  )}
                  <button
                    type="button"
                    className="admin-danger-btn small"
                    onClick={() => void handleDelete(contact)}
                    disabled={delMut.isPending}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default ContactFormsList
