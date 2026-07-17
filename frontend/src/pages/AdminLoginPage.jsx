import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { api } from '../lib/api.js'
import { setStaffSession } from '../lib/utils.js'
import RoleSelector, { ROLES } from '../components/auth/RoleSelector.jsx'

function EyeOff() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 0 1 1.563-3.029m5.858.908a3 3 0 1 1 4.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88 6.59 6.59m7.532 7.532 3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0 1 12 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 0 1-4.132 5.411m0 0L21 21" />
    </svg>
  )
}
function EyeOn() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export default function AdminLoginPage() {
  const navigate = useNavigate()

  const [role,       setRole]       = useState('admin')
  const [email,      setEmail]      = useState('')
  const [password,   setPassword]   = useState('')
  const [showPass,   setShowPass]   = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState('')

  const selectedRole = ROLES.find(r => r.value === role)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res   = await api.post('/auth/staff/login', { email, password })
      const staff = res.data.staff
      if (staff.role !== role) {
        setError(
          role === 'admin'
            ? 'These credentials belong to a Sales account. Please select Sales and try again.'
            : 'These credentials belong to an Admin account. Please select Admin and try again.',
        )
        return
      }
      setStaffSession(res.data.token, staff)
      toast.success(`Welcome, ${staff.name}!`)
      navigate(role === 'sales' ? '/sales' : '/admin')
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Login failed. Check your credentials.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--surface-1)' }}
    >
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <svg width="160" height="50" viewBox="0 0 140 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="lgLogin" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%"   stopColor="#c9a84c" />
                  <stop offset="40%"  stopColor="#f0d060" />
                  <stop offset="70%"  stopColor="#c9a84c" />
                  <stop offset="100%" stopColor="#8a6f2e" />
                </linearGradient>
              </defs>
              <path d="M24 2 L24.5 3.5 L26 4 L24.5 4.5 L24 6 L23.5 4.5 L22 4 L23.5 3.5 Z" fill="url(#lgLogin)" />
              <path d="M8 26 Q10 14 20 6"  stroke="url(#lgLogin)" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
              <path d="M20 6 L28 26"       stroke="url(#lgLogin)" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
              <path d="M8 26 Q5 28 4 26 Q4 24 7 24" stroke="url(#lgLogin)" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
              <path d="M12.5 18 L23 18"   stroke="url(#lgLogin)" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M22 26 Q22 18 30 18 Q38 18 38 26 Z" fill="url(#lgLogin)" />
              <rect x="21" y="26" width="18" height="2.2" rx="1.1" fill="url(#lgLogin)" />
              <rect x="29" y="14.5" width="2" height="3.5" rx="1" fill="url(#lgLogin)" />
              <ellipse cx="30" cy="14" rx="2.5" ry="1.4" fill="url(#lgLogin)" />
              <text x="44" y="22" fontFamily="Georgia,'Times New Roman',serif" fontWeight="700" fontSize="14" letterSpacing="2.5" fill="url(#lgLogin)">AMBRIA</text>
              <text x="48" y="33" fontFamily="'Trebuchet MS',Arial,sans-serif" fontWeight="400" fontSize="7" letterSpacing="4" fill="url(#lgLogin)">CUISINE</text>
            </svg>
          </div>

          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-10" style={{ background: 'linear-gradient(90deg, transparent, var(--gold-dim))' }} />
            <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: 'var(--gold-dim)', fontFamily: 'Inter, sans-serif' }}>
              Staff Portal
            </span>
            <div className="h-px w-10" style={{ background: 'linear-gradient(90deg, var(--gold-dim), transparent)' }} />
          </div>

          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Sign in to your account</h1>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: 'var(--surface-3)',
            border: '1px solid var(--border)',
            boxShadow: '0 0 60px rgba(0,0,0,0.5)',
          }}
        >
          <div className="gold-accent-bar" />

          <form onSubmit={handleSubmit} className="p-6 space-y-5">

            <RoleSelector selected={role} onChange={r => { setRole(r); setError('') }} />

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 gold-divider" />
              <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>
                {selectedRole?.title} credentials
              </span>
              <div className="flex-1 gold-divider" />
            </div>

            {/* Error */}
            {error && (
              <div
                className="rounded-xl px-4 py-3 flex items-start gap-2 text-sm"
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  color: '#f87171',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <svg className="mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Email */}
            <div>
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="username"
                placeholder={role === 'sales' ? 'sales@company.com' : 'admin@company.com'}
                className="input-luxury"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="input-luxury pr-12"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 transition"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  {showPass ? <EyeOn /> : <EyeOff />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="btn-gold w-full py-3.5 rounded-2xl text-sm disabled:opacity-60 disabled:transform-none disabled:shadow-none disabled:cursor-wait"
              style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.04em' }}
            >
              {submitting ? 'Signing in…' : `Sign In as ${selectedRole?.title}`}
            </button>

            <Link
              to="/"
              className="block text-center text-sm font-medium transition"
              style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              ← Back to site
            </Link>
          </form>
        </div>

        <p className="text-center text-xs mt-4 flex items-center justify-center gap-2" style={{ color: 'var(--text-dim)', fontFamily: 'Inter, sans-serif' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-dim)', flexShrink: 0 }}>
            <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" />
          </svg>
          Admin · Full access &nbsp;|&nbsp;
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-dim)', flexShrink: 0 }}>
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          </svg>
          Sales · View-only
        </p>
      </div>
    </div>
  )
}
