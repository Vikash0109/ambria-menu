import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { api } from '../lib/api.js'
import { cx, getStaffUser, isStaffLoggedIn, isAdmin } from '../lib/utils.js'
import Navbar from '../components/Navbar.jsx'
import StatCard from '../components/dashboard/StatCard.jsx'
import EventsList from '../components/dashboard/EventsList.jsx'
import CollectionEditor from '../components/dashboard/CollectionEditor.jsx'

const COLLECTION_META = [
  { key: 'magnumVeg',          label: 'Magnum Veg',           type: 'veg',    badge: '≤150 guests' },
  { key: 'magnumNonVeg',       label: 'Magnum Non-Veg',       type: 'nonveg', badge: '≤150 guests' },
  { key: 'multicuisineVeg',    label: 'Multicuisine Veg',     type: 'veg',    badge: '>150 guests'  },
  { key: 'multicuisineNonVeg', label: 'Multicuisine Non-Veg', type: 'nonveg', badge: '>150 guests'  },
]

function VegIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 22c0 0 4-10 10-10S22 2 22 2" />
      <path d="M12 12C12 7 16 2 22 2" />
    </svg>
  )
}

function NonVegIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 6.5a8 8 0 0 1 11 11L6.5 6.5z" />
      <path d="M6.5 6.5C4 9 3 13 5 16l3-3" />
      <path d="M17.5 17.5C20 15 21 11 19 8l-3 3" />
    </svg>
  )
}

function MenuTabIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

function EventsTabIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="16" x2="13" y2="16" />
    </svg>
  )
}

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  )
}

export default function AdminDashboard() {
  const navigate  = useNavigate()
  const staffUser = getStaffUser()
  const adminRole = isAdmin()

  const [tab,          setTab]          = useState('collections')
  const [statusFilter, setStatusFilter] = useState(null)
  const [events,       setEvents]       = useState([])
  const [eventsLoading, setEventsLoading] = useState(true)
  const [openKey,      setOpenKey]      = useState(null)
  const [colData,      setColData]      = useState(null)
  const [colLoading,   setColLoading]   = useState(false)
  const [colSaving,    setColSaving]    = useState(false)

  function loadEvents() {
    setEventsLoading(true)
    api.get('/admin/events')
      .then(r => setEvents(r.data.events ?? []))
      .catch(() => {})
      .finally(() => setEventsLoading(false))
  }

  useEffect(() => {
    if (!isStaffLoggedIn() || !adminRole) { navigate('/admin/login'); return }
    loadEvents()
  }, [])

  async function openCollection(key) {
    setOpenKey(key)
    setColLoading(true)
    try {
      const r = await api.get(`/collections/${key}`)
      setColData(JSON.parse(JSON.stringify(r.data.collection)))
    } catch { toast.error('Could not load collection.') }
    finally { setColLoading(false) }
  }

  async function saveCollection() {
    setColSaving(true)
    try {
      await api.put(`/collections/${openKey}`, { sections: colData.sections })
      toast.success(`${colData.label} saved.`)
    } catch { toast.error('Could not save.') }
    finally { setColSaving(false) }
  }

  function closeCollection() { setOpenKey(null); setColData(null) }

  function goToEvents(filter = null) {
    setStatusFilter(filter)
    setTab('events')
    closeCollection()
  }

  async function handleStatusChange(id, status) {
    try {
      await api.patch(`/admin/events/${id}`, { status })
      setEvents(prev => prev.map(e => e._id === id ? { ...e, status } : e))
      toast.success('Status updated.')
    } catch { toast.error('Could not update status.') }
  }

  const TABS = [
    { key: 'collections', label: 'Menu',   Icon: MenuTabIcon   },
    { key: 'events',      label: 'Events', Icon: EventsTabIcon },
  ]

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-1)' }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <p
              className="text-xs font-bold uppercase tracking-[0.2em]"
              style={{ color: 'var(--gold)', fontFamily: 'Inter, sans-serif' }}
            >
              Admin Panel
            </p>
            <h1 className="text-3xl font-black mt-1" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
            {staffUser && (
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
                Signed in as{' '}
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{staffUser.name}</span>
                <span
                  className="ml-2 px-2 py-0.5 text-xs font-bold rounded-full uppercase"
                  style={{ background: 'rgba(201,168,76,0.12)', color: 'var(--gold)', border: '1px solid var(--border)' }}
                >
                  Admin
                </span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadEvents}
              disabled={eventsLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-50"
              style={{
                background: 'var(--surface-3)',
                border: '1px solid var(--border-soft)',
                color: 'var(--text-secondary)',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <RefreshIcon />
              {eventsLoading ? 'Loading…' : 'Refresh'}
            </button>
            <Link
              to="/"
              className="px-4 py-2 rounded-xl text-sm font-semibold transition"
              style={{
                background: 'var(--surface-3)',
                border: '1px solid var(--border-soft)',
                color: 'var(--text-secondary)',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              View Site
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <StatCard icon="collections" label="Menu Collections" value={4} />
          <StatCard icon="events"    label="All Events"  value={events.length}
            onClick={() => goToEvents(null)} active={tab === 'events' && statusFilter === null} />
          <StatCard icon="pending"   label="Pending"     value={events.filter(e => e.status === 'pending').length}
            onClick={() => goToEvents('pending')} active={tab === 'events' && statusFilter === 'pending'} />
          <StatCard icon="confirmed" label="Confirmed"   value={events.filter(e => e.status === 'confirmed').length}
            onClick={() => goToEvents('confirmed')} active={tab === 'events' && statusFilter === 'confirmed'} />
          <StatCard icon="cancelled" label="Cancelled"   value={events.filter(e => e.status === 'cancelled').length}
            onClick={() => goToEvents('cancelled')} active={tab === 'events' && statusFilter === 'cancelled'} />
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 rounded-2xl p-1 w-fit mb-6"
          style={{ background: 'var(--surface-3)', border: '1px solid var(--border-soft)' }}
        >
          {TABS.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => { setTab(key); closeCollection(); if (key !== 'events') setStatusFilter(null) }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition"
              style={{
                background: tab === key ? 'var(--surface-5)' : 'transparent',
                color: tab === key ? 'var(--gold-light)' : 'var(--text-muted)',
                border: tab === key ? '1px solid var(--border)' : '1px solid transparent',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <Icon />
              {label}
            </button>
          ))}
        </div>

        {/* Collections grid */}
        {tab === 'collections' && !openKey && (
          <div className="grid sm:grid-cols-2 gap-4">
            {COLLECTION_META.map(m => {
              const Icon = m.type === 'veg' ? VegIcon : NonVegIcon
              const iconColor = m.type === 'veg' ? '#4ade80' : '#fca5a5'
              return (
                <button
                  key={m.key}
                  onClick={() => openCollection(m.key)}
                  className="rounded-2xl p-6 text-left transition flex items-center gap-4"
                  style={{
                    background: 'var(--surface-3)',
                    border: '1px solid var(--border-soft)',
                    boxShadow: 'none',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--surface-4)'
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'var(--surface-3)'
                    e.currentTarget.style.borderColor = 'var(--border-soft)'
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'var(--surface-5)', border: '1px solid rgba(255,255,255,0.06)', color: iconColor }}
                  >
                    <Icon />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black" style={{ color: 'var(--text-primary)' }}>{m.label}</p>
                    <span
                      className="inline-block mt-1 text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{
                        background: 'rgba(201,168,76,0.1)',
                        color: 'var(--gold)',
                        border: '1px solid var(--border)',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {m.badge}
                    </span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              )
            })}
          </div>
        )}

        {tab === 'collections' && openKey && (
          <CollectionEditor
            openKey={openKey} colData={colData} colLoading={colLoading}
            colSaving={colSaving} onBack={closeCollection} onSave={saveCollection}
            onColDataChange={setColData}
          />
        )}

        {tab === 'events' && (
          <EventsList
            events={events} loading={eventsLoading}
            onStatusChange={handleStatusChange}
            statusFilter={statusFilter}
            onClearFilter={() => setStatusFilter(null)}
          />
        )}
      </div>
    </div>
  )
}
