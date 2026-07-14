import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { cx, isStaffLoggedIn, clearStaffSession, getStaffRole } from '../../lib/utils.js'
import StepBar from './StepBar.jsx'

const MOBILE_BP = 768   // px — below this show hamburger

function useActiveStep(overrideStep) {
  const { pathname } = useLocation()
  if (overrideStep !== undefined) return overrideStep
  if (pathname === '/plan')     return 1
  if (pathname === '/menu')     return 2
  if (pathname === '/services') return 3
  if (pathname === '/review')   return 4
  return null
}

function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < MOBILE_BP)
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < MOBILE_BP)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return mobile
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <svg width="130" height="40" viewBox="0 0 148 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="navGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#c9a84c" />
          <stop offset="35%"  stopColor="#f0d060" />
          <stop offset="65%"  stopColor="#c9a84c" />
          <stop offset="100%" stopColor="#8a6f2e" />
        </linearGradient>
      </defs>
      <path d="M24 2 L24.5 3.5 L26 4 L24.5 4.5 L24 6 L23.5 4.5 L22 4 L23.5 3.5 Z" fill="url(#navGold)" />
      <path d="M8 26 Q10 14 20 6"  stroke="url(#navGold)" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      <path d="M20 6 L28 26"       stroke="url(#navGold)" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      <path d="M8 26 Q5 28 4 26 Q4 24 7 24" stroke="url(#navGold)" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
      <path d="M12.5 18 L23 18"    stroke="url(#navGold)" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M22 26 Q22 18 30 18 Q38 18 38 26 Z" fill="url(#navGold)" />
      <rect x="21" y="26" width="18" height="2.2" rx="1.1" fill="url(#navGold)" />
      <rect x="29" y="14.5" width="2" height="3.5" rx="1" fill="url(#navGold)" />
      <ellipse cx="30" cy="14" rx="2.5" ry="1.4" fill="url(#navGold)" />
      <text x="44" y="22" fontFamily="Georgia,'Times New Roman',serif" fontWeight="700" fontSize="14" letterSpacing="2.5" fill="url(#navGold)">AMBRIA</text>
      <text x="48" y="33" fontFamily="'Trebuchet MS',Arial,sans-serif" fontWeight="400" fontSize="7" letterSpacing="4" fill="url(#navGold)">CUISINE</text>
    </svg>
  )
}

// ─── Hamburger / Close icon ───────────────────────────────────────────────────
function MenuIcon({ open }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      {open ? (
        <>
          <line x1="18" y1="6"  x2="6"  y2="18" />
          <line x1="6"  y1="6"  x2="18" y2="18" />
        </>
      ) : (
        <>
          <line x1="3" y1="6"  x2="21" y2="6"  />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </>
      )}
    </svg>
  )
}

export default function Navbar({ activeStep: activeStepProp }) {
  const navigate   = useNavigate()
  const location   = useLocation()
  const loggedIn   = isStaffLoggedIn()
  const role       = getStaffRole()
  const activeStep = useActiveStep(activeStepProp)
  const isMobile   = useIsMobile()
  const [menuOpen, setMenuOpen] = useState(false)
  const drawerRef  = useRef(null)

  // Close on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  // Lock body scroll when drawer open — not needed for in-flow drawer

  function handleLogout()    { clearStaffSession(); setMenuOpen(false); navigate('/admin/login') }
  function handleDashboard() { setMenuOpen(false); navigate(role === 'sales' ? '/sales' : '/admin') }

  // ── shared style helpers ──────────────────────────────────────────────────
  const dLinkStyle = {
    padding: '0.35rem 1rem', borderRadius: '0.5rem',
    fontSize: '0.875rem', letterSpacing: '0.02em',
    transition: 'all 0.15s ease', fontFamily: 'Inter, sans-serif',
    textDecoration: 'none', cursor: 'pointer', border: 'none', background: 'transparent',
  }
  const dActive  = { color: '#e8c55a', background: 'rgba(255,255,255,0.05)' }
  const dIdle    = { color: '#a09070' }
  const dLogout  = { color: 'rgba(248,113,113,0.7)' }

  const mLinkStyle = {
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    width: '100%', padding: '0.875rem 1rem',
    borderRadius: '0.75rem', fontSize: '0.9rem', fontWeight: 600,
    letterSpacing: '0.02em', fontFamily: 'Inter, sans-serif',
    transition: 'all 0.15s ease', textDecoration: 'none',
    cursor: 'pointer', border: 'none', background: 'transparent',
    color: '#a09070',
  }

  return (
    <header
      style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: '#0f0f0f',
        borderBottom: '1px solid rgba(201,168,76,0.18)',
      }}
    >
      {/* ── Main bar ────────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: '1400px', margin: '0 auto',
          padding: '0 1rem', height: '64px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }} onClick={() => setMenuOpen(false)}>
          <Logo />
        </Link>

        {/* Desktop nav — shown when NOT mobile */}
        {!isMobile && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <NavLink to="/" end style={({ isActive }) => ({ ...dLinkStyle, ...(isActive ? dActive : dIdle) })}>
              Home
            </NavLink>
            <NavLink to="/plan" style={({ isActive }) => ({ ...dLinkStyle, ...(isActive ? dActive : dIdle) })}>
              Plan Event
            </NavLink>
            {loggedIn ? (
              <>
                <button onClick={handleDashboard} style={{ ...dLinkStyle, ...dIdle }}>Dashboard</button>
                <button onClick={handleLogout}    style={{ ...dLinkStyle, ...dLogout }}>Logout</button>
              </>
            ) : (
              <NavLink to="/admin/login" style={({ isActive }) => ({ ...dLinkStyle, ...(isActive ? dActive : dIdle) })}>
                Staff Login
              </NavLink>
            )}
          </nav>
        )}

        {/* Hamburger — shown when mobile */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '40px', height: '40px', borderRadius: '10px',
              background: menuOpen ? 'rgba(201,168,76,0.12)' : 'transparent',
              border: `1px solid ${menuOpen ? 'rgba(201,168,76,0.35)' : 'rgba(255,255,255,0.1)'}`,
              color: menuOpen ? '#e8c55a' : '#c9a84c',
              cursor: 'pointer', transition: 'all 0.15s ease',
              flexShrink: 0,
            }}
          >
            <MenuIcon open={menuOpen} />
          </button>
        )}
      </div>

      {/* Step bar */}
      {activeStep !== null && <StepBar activeStep={activeStep} />}

      {/* ── Mobile drawer ───────────────────────────────────────────────── */}
      {isMobile && (
        <>
          {/* In-flow drawer — pushes content down, no overlap */}
          <div
            ref={drawerRef}
            style={{
              overflow: 'hidden',
              maxHeight: menuOpen ? '400px' : '0px',
              transition: 'max-height 0.3s cubic-bezier(0.4,0,0.2,1)',
              background: '#141414',
              borderBottom: menuOpen ? '1px solid rgba(201,168,76,0.2)' : 'none',
              boxShadow: menuOpen ? '0 8px 32px rgba(0,0,0,0.6)' : 'none',
            }}
          >
            {/* Gold top accent */}
            <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #c9a84c, #f0d060, #c9a84c, transparent)' }} />

            <nav style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>

              <NavLink to="/" end style={({ isActive }) => ({
                ...mLinkStyle,
                color: isActive ? '#e8c55a' : '#a09070',
                background: isActive ? 'rgba(255,255,255,0.04)' : 'transparent',
              })}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                Home
              </NavLink>

              <NavLink to="/plan" style={({ isActive }) => ({
                ...mLinkStyle,
                color: isActive ? '#e8c55a' : '#a09070',
                background: isActive ? 'rgba(255,255,255,0.04)' : 'transparent',
              })}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Plan Event
              </NavLink>

              {/* Divider */}
              <div style={{ margin: '0.25rem 0', height: '1px', background: 'rgba(201,168,76,0.12)' }} />

              {loggedIn ? (
                <>
                  <button onClick={handleDashboard} style={mLinkStyle}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <rect x="3" y="3" width="7" height="7" rx="1"/>
                      <rect x="14" y="3" width="7" height="7" rx="1"/>
                      <rect x="3" y="14" width="7" height="7" rx="1"/>
                      <rect x="14" y="14" width="7" height="7" rx="1"/>
                    </svg>
                    Dashboard
                  </button>
                  <button onClick={handleLogout} style={{ ...mLinkStyle, color: 'rgba(248,113,113,0.75)' }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Logout
                  </button>
                </>
              ) : (
                <NavLink to="/admin/login" style={({ isActive }) => ({
                  ...mLinkStyle,
                  color: isActive ? '#e8c55a' : '#a09070',
                  background: isActive ? 'rgba(255,255,255,0.04)' : 'transparent',
                })}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"/>
                  </svg>
                  Staff Login
                </NavLink>
              )}
            </nav>

            {/* Brand bottom */}
            <div style={{
              padding: '0.5rem 1rem 1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '0.75rem', opacity: 0.25,
            }}>
              <div style={{ flex: 1, height: '1px', background: '#c9a84c' }} />
              <span style={{ fontSize: '0.55rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c9a84c', fontFamily: 'Inter, sans-serif' }}>
                Ambria Cuisine
              </span>
              <div style={{ flex: 1, height: '1px', background: '#c9a84c' }} />
            </div>
          </div>
        </>
      )}
    </header>
  )
}
