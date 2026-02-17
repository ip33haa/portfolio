const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'https://localhost:5001/api'

type AuthData = {
  accessToken?: string
  refreshToken?: string
  expiresIn?: number
  expiresAt?: number
  [k: string]: any
}

function loadAuth(): AuthData | null {
  try {
    const raw = localStorage.getItem('auth')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveAuth(a: AuthData) {
  if (!a) return
  if (a.expiresIn) a.expiresAt = Date.now() + a.expiresIn * 1000
  localStorage.setItem('auth', JSON.stringify(a))
}

export function getAuth(): AuthData | null {
  return loadAuth()
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  if (!res.ok) {
    const txt = await res.text()
    try {
      const json = JSON.parse(txt)
      // prefer structured message
      const msg = json.message || (json.errors && Array.isArray(json.errors) ? json.errors.map((e: any) => e.message || e).join(', ') : null)
      throw { message: msg || txt || res.statusText, status: res.status, body: json }
    } catch {
      throw { message: txt || res.statusText, status: res.status }
    }
  }

  const data = await res.json()
  saveAuth(data)
  return data
}

export async function logout() {
  const auth = loadAuth()
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(auth?.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {})
      },
      body: JSON.stringify({ refreshToken: auth?.refreshToken })
    })
  } catch {
    // ignore
  }
  localStorage.removeItem('auth')
}

export async function register(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  if (!res.ok) {
    const txt = await res.text()
    try {
      const json = JSON.parse(txt)
      const msg = json.message || (json.errors && Array.isArray(json.errors) ? json.errors.map((e: any) => e.message || e).join(', ') : null)
      throw { message: msg || txt || res.statusText, status: res.status, body: json }
    } catch {
      throw { message: txt || res.statusText, status: res.status }
    }
  }

  const data = await res.json()
  saveAuth(data)
  return data
}

export async function refreshAccessToken(): Promise<string | null> {
  const auth = loadAuth()
  if (!auth?.refreshToken) return null

  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: auth.refreshToken })
  })

  if (!res.ok) {
    localStorage.removeItem('auth')
    return null
  }

  const data = await res.json()
  saveAuth(data)
  return data.accessToken
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`

  const auth = loadAuth()
  const headers = new Headers(options.headers || {})
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  if (auth?.accessToken) headers.set('Authorization', `Bearer ${auth.accessToken}`)

  let res = await fetch(url, { ...options, headers })

  if (res.status === 401) {
    const newToken = await refreshAccessToken()
    if (newToken) {
      headers.set('Authorization', `Bearer ${newToken}`)
      res = await fetch(url, { ...options, headers })
    }
  }

  // Treat 404 as a missing resource (return null) instead of throwing an error
  if (res.status === 404) return null

  if (!res.ok) {
    const txt = await res.text()
    try {
      const json = JSON.parse(txt)
      throw json
    } catch {
      throw { message: txt || res.statusText, status: res.status }
    }
  }

  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) return res.json()
  return res.text()
}

// Exported API helpers
export function getAbout() {
  return apiFetch('/about')
}

export function getProjects() {
  return apiFetch('/projects')
}

export function getProject(id: string | number) {
  return apiFetch(`/projects/${id}`)
}

export function getSkills() {
  return apiFetch('/skills')
}

export function getExperiences() {
  return apiFetch('/experiences')
}

export function getCertifications() {
  return apiFetch('/certifications')
}

// Admin CRUD helpers for common resources
export function createSkill(payload: any) {
  return apiFetch('/skills', { method: 'POST', body: JSON.stringify(payload) })
}

export function updateSkill(id: string | number, payload: any) {
  return apiFetch(`/skills/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
}

export function deleteSkill(id: string | number) {
  return apiFetch(`/skills/${id}`, { method: 'DELETE' })
}

export function createExperience(payload: any) {
  return apiFetch('/experiences', { method: 'POST', body: JSON.stringify(payload) })
}

export function updateExperience(id: string | number, payload: any) {
  return apiFetch(`/experiences/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
}

export function deleteExperience(id: string | number) {
  return apiFetch(`/experiences/${id}`, { method: 'DELETE' })
}

export function createCertification(payload: any) {
  return apiFetch('/certifications', { method: 'POST', body: JSON.stringify(payload) })
}

export function updateCertification(id: string | number, payload: any) {
  return apiFetch(`/certifications/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
}

export function deleteCertification(id: string | number) {
  return apiFetch(`/certifications/${id}`, { method: 'DELETE' })
}

export function getTestimonials() {
  return apiFetch('/testimonials')
}

export function createTestimonial(payload: any) {
  return apiFetch('/testimonials', { method: 'POST', body: JSON.stringify(payload) })
}

export function updateTestimonial(id: string | number, payload: any) {
  return apiFetch(`/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
}

export function deleteTestimonial(id: string | number) {
  return apiFetch(`/testimonials/${id}`, { method: 'DELETE' })
}

export function createAbout(payload: any) {
  return apiFetch('/about', { method: 'POST', body: JSON.stringify(payload) })
}

export function updateAbout(id: string | number, payload: any) {
  return apiFetch(`/about/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
}

export function deleteAbout(id: string | number) {
  return apiFetch(`/about/${id}`, { method: 'DELETE' })
}

export function postContactForm(payload: any) {
  return apiFetch('/contactforms', { method: 'POST', body: JSON.stringify(payload) })
}

// Request the backend to send the contact message as an email (if supported)
export function sendContactEmail(payload: any) {
  return apiFetch('/contactforms/send', { method: 'POST', body: JSON.stringify(payload) })
}

// Admin helpers
export function createProject(payload: any) {
  return apiFetch('/projects', { method: 'POST', body: JSON.stringify(payload) })
}

export function updateProject(id: string | number, payload: any) {
  return apiFetch(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
}

export function deleteProject(id: string | number) {
  return apiFetch(`/projects/${id}`, { method: 'DELETE' })
}

export function getContactForms() {
  return apiFetch('/contactforms')
}

export function getUnreadContactForms() {
  return apiFetch('/contactforms/unread')
}

export function markContactFormAsRead(id: string | number) {
  return apiFetch(`/contactforms/${id}/mark-as-read`, { method: 'PATCH' })
}

export function deleteContactFormSubmission(id: string | number) {
  return apiFetch(`/contactforms/${id}`, { method: 'DELETE' })
}

export async function uploadFile(file: File) {
  const auth = loadAuth()
  const form = new FormData()
  form.append('file', file)

  const headers: Record<string, string> = {}
  if (auth?.accessToken) headers['Authorization'] = `Bearer ${auth.accessToken}`

  const res = await fetch(`${API_BASE}/uploads`, { method: 'POST', headers, body: form })
  if (!res.ok) {
    const txt = await res.text()
    try { const json = JSON.parse(txt); throw json } catch { throw { message: txt || res.statusText, status: res.status } }
  }
  const data = await res.json()
  return data.url
}

export default {
  API_BASE,
  refreshAccessToken,
  getAuth,
  login,
  logout,
  register,
  getAbout,
  createAbout,
  updateAbout,
  deleteAbout,
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getContactForms,
  getUnreadContactForms,
  markContactFormAsRead,
  deleteContactFormSubmission,
  postContactForm,
  sendContactEmail,
  uploadFile
}
