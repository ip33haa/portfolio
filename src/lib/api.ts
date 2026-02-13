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
    throw { message: txt || res.statusText, status: res.status }
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

export function postContactForm(payload: any) {
  return apiFetch('/contactforms', { method: 'POST', body: JSON.stringify(payload) })
}

export default {
  API_BASE,
  refreshAccessToken,
  getAbout,
  getProjects,
  getProject,
  getSkills,
  getExperiences,
  getCertifications,
  postContactForm
}
