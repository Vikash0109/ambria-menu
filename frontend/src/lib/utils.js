// ─── Shared constants ─────────────────────────────────────────────────────────
export const FORM_KEY = 'feast-event-form'
export const STAFF_TOKEN_KEY = 'feast-staff-token'

// ─── Class name helper ────────────────────────────────────────────────────────
export function cx(...classes) {
  return classes.filter(Boolean).join(' ')
}

// ─── Staff auth helpers ───────────────────────────────────────────────────────
export function getStaffToken() {
  return window.localStorage.getItem(STAFF_TOKEN_KEY)
}

export function setStaffSession(token, staff) {
  window.localStorage.setItem(STAFF_TOKEN_KEY, token)
  window.localStorage.setItem('feast-staff-user', JSON.stringify(staff))
}

export function clearStaffSession() {
  window.localStorage.removeItem(STAFF_TOKEN_KEY)
  window.localStorage.removeItem('feast-staff-user')
}

export function getStaffUser() {
  try {
    return JSON.parse(window.localStorage.getItem('feast-staff-user') || 'null')
  } catch {
    return null
  }
}

/** Returns 'admin', 'sales', or null */
export function getStaffRole() {
  const user = getStaffUser()
  return user?.role ?? null
}

export function isAdmin() {
  return getStaffRole() === 'admin'
}

export function isSales() {
  return getStaffRole() === 'sales'
}

export function isStaffLoggedIn() {
  return Boolean(getStaffToken()) && Boolean(getStaffUser())
}

// ─── Legacy alias used in AdminDashboard (backward compat) ───────────────────
export function getAdminToken() {
  return getStaffToken()
}

// ─── Session data (intake form result stored in sessionStorage) ───────────────
export function getSessionData() {
  try {
    return JSON.parse(window.sessionStorage.getItem(FORM_KEY) || '{}')
  } catch {
    return {}
  }
}

export function hasValidSession() {
  const s = getSessionData()
  return Boolean(s.eventId && s.occasion)
}
