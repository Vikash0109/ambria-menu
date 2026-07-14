import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { api } from '../lib/api.js'
import { getStaffUser, isStaffLoggedIn, isSales } from '../lib/utils.js'
import Navbar from '../components/Navbar.jsx'
import StatCard from '../components/dashboard/StatCard.jsx'
import EventsList from '../components/dashboard/EventsList.jsx'
import CallbacksList, { CB_STATUS } from '../components/dashboard/CallbacksList.jsx'

// ─── Icons ────────────────────────────────────────────────────────────────────
function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/>
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
    </svg>
  )
}
function EventsTabIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="1"/>
      <line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/>
    </svg>
  )
}
function CallbackTabIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.128 1.013.36 2.01.7 2.97a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.18 6.18l.95-.95a2 2 0 0 1 2.11-.45c.96.34 1.957.572 2.97.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  )
}
function ScopeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

// ─── Tabs config ──────────────────────────────────────────────────────────────
const TABS = [
  { key: 'events',    label: 'Events',    Icon: EventsTabIcon   },
  { key: 'callbacks', label: 'Callbacks', Icon: CallbackTabIcon },
]

export default function SalesDashboard() {
  const navigate  = useNavigate()
  const staffUser = getStaffUser()

  const [tab,              setTab]              = useState('events')
  const [statusFilter,     setStatusFilter]     = useState(null)
  const [cbStatusFilter,   setCbStatusFilter]   = useState(null)

  const [events,           setEvents]           = useState([])
  const [eventsLoading,    setEventsLoading]    = useState(true)
  const [callbacks,        setCallbacks]        = useState([])
  const [callbacksLoading, setCallbacksLoading] = useState(true)

  // ── Loaders ──────────────────────────────────────────────────────────────────
  function loadEvents() {
    setEventsLoading(true)
    api.get('/admin/events')
      .then(r => setEvents(r.data.events ?? []))
      .catch(() => toast.error('Could not load events.'))
      .finally(() => setEventsLoading(false))
  }

  function loadCallbacks() {
    setCallbacksLoading(true)
    api.get('/admin/callbacks')
      .then(r => setCallbacks(r.data.callbacks ?? []))
      .catch(() => toast.error('Could not load callbacks.'))
      .finally(() => setCallbacksLoading(false))
  }

  useEffect(() => {
    if (!isStaffLoggedIn() || !isSales()) { navigate('/admin/login'); return }
    loadEvents()
    loadCallbacks()
  }, [])

  // ── Status updaters ───────────────────────────────────────────────────────────
  async function handleEventStatusChange(id, status) {
    try {
      await api.patch(`/admin/events/${id}`, { status })
      setEvents(prev => prev.map(e => e._id === id ? { ...e, status } : e))
      toast.success('Event status updated.')
    } catch { toast.error('Could not update event status.') }
  }

  async function handleCallbackStatusChange(id, status) {
    try {
      await api.patch(`/admin/callbacks/${id}`, { status })
      setCallbacks(prev => prev.map(c => c._id === id ? { ...c, status } : c))
      toast.success('Callback status updated.')
    } catch { toast.error('Could not update callback status.') }
  }

  // ── Derived counts ────────────────────────────────────────────────────────────
  const pendingCount   = events.filter(e => e.status === 'pending').length
  const confirmedCount = events.filter(e => e.status === 'confirmed').length
  const cancelledCount = events.filter(e => e.status === 'cancelled').length
  const newCbCount     = callbacks.filter(c => c.status === 'new').length

  // ── Refresh current tab ───────────────────────────────────────────────────────
  function handleRefresh() {
    if (tab === 'events') loadEvents()
    else { loadCallbacks() }
  }
  const isLoading = tab === 'events' ? eventsLoading : callbacksLoading

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-1)' }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--gold)', fontFamily: 'Inter, sans-serif' }}>
              Sales Portal
            </p>
            <h1 className="text-3xl font-black mt-1" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
            {staffUser && (
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
                Signed in as{' '}
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{staffUser.name}</span>
                <span className="ml-2 px-2 py-0.5 text-xs font-bold rounded-full uppercase"
                  style={{ background: 'rgba(99,102,241,0.12)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)' }}>
                  Sales
                </span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-50"
              style={{ background: 'var(--surface-3)', border: '1px solid var(--border-soft)', color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}
            >
              <RefreshIcon />
              {isLoading ? 'Loading…' : 'Refresh'}
            </button>
            <Link to="/"
              className="px-4 py-2 rounded-xl text-sm font-semibold transition"
              style={{ background: 'var(--surface-3)', border: '1px solid var(--border-soft)', color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}
            >
              View Site
            </Link>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <StatCard icon="events"    label="All Events"  value={events.length}
            onClick={() => { setTab('events'); setStatusFilter(null) }}
            active={tab === 'events' && statusFilter === null} />
          <StatCard icon="pending"   label="Pending"     value={pendingCount}
            onClick={() => { setTab('events'); setStatusFilter('pending') }}
            active={tab === 'events' && statusFilter === 'pending'} />
          <StatCard icon="confirmed" label="Confirmed"   value={confirmedCount}
            onClick={() => { setTab('events'); setStatusFilter('confirmed') }}
            active={tab === 'events' && statusFilter === 'confirmed'} />
          <StatCard icon="cancelled" label="Cancelled"   value={cancelledCount}
            onClick={() => { setTab('events'); setStatusFilter('cancelled') }}
            active={tab === 'events' && statusFilter === 'cancelled'} />
          {/* Callbacks new-requests card */}
          <StatCard icon="callbacks" label="New Callbacks" value={newCbCount}
            onClick={() => { setTab('callbacks'); setCbStatusFilter('new') }}
            active={tab === 'callbacks'} />
        </div>

        {/* ── Tabs ── */}
        <div
          className="flex gap-1 rounded-2xl p-1 w-fit mb-6"
          style={{ background: 'var(--surface-3)', border: '1px solid var(--border-soft)' }}
        >
          {TABS.map(({ key, label, Icon }) => {
            const isActive = tab === key
            // Show a red dot badge on Callbacks tab when there are new requests
            const showBadge = key === 'callbacks' && newCbCount > 0
            return (
              <button
                key={key}
                onClick={() => { setTab(key); setStatusFilter(null); setCbStatusFilter(null) }}
                className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition"
                style={{
                  background: isActive ? 'var(--surface-5)' : 'transparent',
                  color: isActive ? 'var(--gold-light)' : 'var(--text-muted)',
                  border: isActive ? '1px solid var(--border)' : '1px solid transparent',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <Icon />
                {label}
                {showBadge && (
                  <span
                    className="flex items-center justify-center text-[9px] font-black rounded-full w-4 h-4"
                    style={{ background: '#63b3ed', color: '#0a0a0a' }}
                  >
                    {newCbCount > 9 ? '9+' : newCbCount}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* ── Scope notice ── */}
        <div
          className="mb-5 flex items-center gap-2 text-xs font-medium rounded-xl px-4 py-2.5 w-fit"
          style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc', fontFamily: 'Inter, sans-serif' }}
        >
          <ScopeIcon />
          <span>Sales role — confirm/cancel events and manage callback requests. Menu management is admin-only.</span>
        </div>

        {/* ── Content ── */}
        {tab === 'events' && (
          <EventsList
            events={events}
            loading={eventsLoading}
            onStatusChange={handleEventStatusChange}
            statusFilter={statusFilter}
            onClearFilter={() => setStatusFilter(null)}
          />
        )}

        {tab === 'callbacks' && (
          <CallbacksList
            callbacks={callbacks}
            loading={callbacksLoading}
            onStatusChange={handleCallbackStatusChange}
            statusFilter={cbStatusFilter}
            onClearFilter={() => setCbStatusFilter(null)}
          />
        )}

      </div>
    </div>
  )
}
