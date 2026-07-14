import { api } from '../../lib/api.js'
import { toast } from 'react-hot-toast'

// ─── Status config ────────────────────────────────────────────────────────────
export const CB_STATUS = {
  new:       { label: 'New',       color: 'rgba(99,179,237,0.12)',  text: '#63b3ed', border: 'rgba(99,179,237,0.3)',  bar: '#63b3ed'  },
  contacted: { label: 'Contacted', color: 'rgba(234,179,8,0.12)',   text: '#fbbf24', border: 'rgba(234,179,8,0.3)',   bar: '#fbbf24'  },
  converted: { label: 'Converted', color: 'rgba(34,197,94,0.12)',   text: '#4ade80', border: 'rgba(34,197,94,0.3)',   bar: '#4ade80'  },
  closed:    { label: 'Closed',    color: 'rgba(148,163,184,0.1)',  text: '#94a3b8', border: 'rgba(148,163,184,0.25)', bar: '#94a3b8' },
}

const ALL_STATUSES = Object.keys(CB_STATUS)

// ─── Icons ────────────────────────────────────────────────────────────────────
function PhoneIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.128 1.013.36 2.01.7 2.97a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.18 6.18l.95-.95a2 2 0 0 1 2.11-.45c.96.34 1.957.572 2.97.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  )
}
function MailIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  )
}
function OccasionIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  )
}
function CalendarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8"  y1="2" x2="8"  y2="6"/>
      <line x1="3"  y1="10" x2="21" y2="10"/>
    </svg>
  )
}
function MessageIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  )
}

// ─── Single callback card ─────────────────────────────────────────────────────
function CallbackCard({ cb, onStatusChange }) {
  const s = CB_STATUS[cb.status] ?? CB_STATUS.new

  function fmt(dateStr) {
    if (!dateStr) return ''
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    } catch { return dateStr }
  }

  return (
    <div
      className="rounded-2xl overflow-hidden transition"
      style={{
        background: 'var(--surface-3)',
        border: '1px solid var(--border-soft)',
        borderLeft: `3px solid ${s.bar}`,
        boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.5)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.3)'}
    >
      <div className="p-5">
        {/* Top row — name + status + actions */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2.5 h-2.5 rounded-full shrink-0 mt-0.5" style={{ background: s.bar }} />
            <h3 className="font-black text-base" style={{ color: 'var(--text-primary)' }}>{cb.name}</h3>
            <span
              className="text-xs font-bold px-2.5 py-0.5 rounded-full"
              style={{ background: s.color, color: s.text, border: `1px solid ${s.border}`, fontFamily: 'Inter, sans-serif' }}
            >
              {s.label}
            </span>
          </div>

          {/* Status buttons */}
          <div className="flex gap-1.5 flex-shrink-0 flex-wrap">
            {ALL_STATUSES.map(st => {
              const ss = CB_STATUS[st]
              const isCurrent = cb.status === st
              return (
                <button
                  key={st}
                  onClick={() => onStatusChange(cb._id, st)}
                  disabled={isCurrent}
                  className="px-3 py-1 rounded-lg text-xs font-bold capitalize transition"
                  style={{
                    background: isCurrent ? ss.color : 'var(--surface-5)',
                    border: `1px solid ${isCurrent ? ss.border : 'rgba(255,255,255,0.07)'}`,
                    color: isCurrent ? ss.text : 'var(--text-muted)',
                    fontFamily: 'Inter, sans-serif',
                    cursor: isCurrent ? 'default' : 'pointer',
                  }}
                >
                  {ss.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Info grid */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-sm mb-3"
          style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}
        >
          <span className="flex items-center gap-1.5"><PhoneIcon />{cb.phone}</span>
          {cb.email    && <span className="flex items-center gap-1.5 min-w-0"><MailIcon /><span className="truncate">{cb.email}</span></span>}
          {cb.occasion && <span className="flex items-center gap-1.5"><OccasionIcon />{cb.occasion}</span>}
          <span className="flex items-center gap-1.5 col-span-2 sm:col-span-1"><CalendarIcon />{fmt(cb.createdAt)}</span>
        </div>

        {/* Message */}
        {cb.message && (
          <div
            className="flex items-start gap-2 rounded-xl px-3 py-2.5 mt-2 text-xs"
            style={{ background: 'var(--surface-4)', color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}
          >
            <MessageIcon />
            <span>{cb.message}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Status filter bar icons ──────────────────────────────────────────────────
function PhoneCallIcon({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.128 1.013.36 2.01.7 2.97a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.18 6.18l.95-.95a2 2 0 0 1 2.11-.45c.96.34 1.957.572 2.97.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  )
}

// ─── Main list ────────────────────────────────────────────────────────────────
export default function CallbacksList({ callbacks, loading, onStatusChange, statusFilter, onClearFilter }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl animate-pulse"
            style={{ background: 'var(--surface-3)', border: '1px solid var(--border-soft)' }} />
        ))}
      </div>
    )
  }

  const filtered = statusFilter ? callbacks.filter(c => c.status === statusFilter) : callbacks
  const meta     = statusFilter ? CB_STATUS[statusFilter] : null

  return (
    <div>
      {/* Active filter banner */}
      {statusFilter && meta && (
        <div
          className="flex items-center gap-3 mb-4 px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: meta.color, border: `1px solid ${meta.border}`, color: meta.text, fontFamily: 'Inter, sans-serif' }}
        >
          <PhoneCallIcon size={14} color={meta.text} />
          <span>Showing <span className="font-black">{meta.label}</span> callbacks ({filtered.length})</span>
          <button onClick={onClearFilter} className="ml-auto text-xs font-bold underline underline-offset-2 opacity-70 hover:opacity-100 transition">
            Show all
          </button>
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(201,168,76,0.07)', border: '1px solid var(--border-soft)', color: meta ? meta.text : 'var(--text-muted)' }}
          >
            <PhoneCallIcon size={24} color={meta ? meta.text : 'var(--text-muted)'} />
          </div>
          <p className="font-semibold" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
            {statusFilter ? `No ${meta.label.toLowerCase()} callbacks` : 'No callback requests yet'}
          </p>
          {statusFilter && (
            <button onClick={onClearFilter} className="mt-3 text-sm font-bold transition"
              style={{ color: 'var(--gold)', fontFamily: 'Inter, sans-serif' }}>
              ← Show all callbacks
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(cb => (
            <CallbackCard key={cb._id} cb={cb} onStatusChange={onStatusChange} />
          ))}
        </div>
      )}
    </div>
  )
}
