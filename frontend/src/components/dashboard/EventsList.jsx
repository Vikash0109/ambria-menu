import EventCard from './EventCard.jsx'

const STATUS_LABELS = {
  pending:   { label: 'Pending',   color: 'rgba(234,179,8,0.12)',  textColor: '#fbbf24', borderColor: 'rgba(234,179,8,0.3)'  },
  confirmed: { label: 'Confirmed', color: 'rgba(34,197,94,0.12)',  textColor: '#4ade80', borderColor: 'rgba(34,197,94,0.3)'  },
  cancelled: { label: 'Cancelled', color: 'rgba(239,68,68,0.12)',  textColor: '#f87171', borderColor: 'rgba(239,68,68,0.3)'  },
}

function PendingIcon({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  )
}
function ConfirmedIcon({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  )
}
function CancelledIcon({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  )
}
function AllEventsIcon({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="1"/>
      <line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/>
    </svg>
  )
}

const STATUS_ICONS = {
  pending:   PendingIcon,
  confirmed: ConfirmedIcon,
  cancelled: CancelledIcon,
}

export default function EventsList({ events, loading, onStatusChange, statusFilter, onClearFilter }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-36 rounded-2xl animate-pulse"
            style={{ background: 'var(--surface-3)', border: '1px solid var(--border-soft)' }}
          />
        ))}
      </div>
    )
  }

  const filtered = statusFilter ? events.filter(e => e.status === statusFilter) : events
  const meta      = statusFilter ? STATUS_LABELS[statusFilter] : null
  const StatusIcon = statusFilter ? STATUS_ICONS[statusFilter] : AllEventsIcon

  return (
    <div>
      {statusFilter && meta && (
        <div
          className="flex items-center gap-3 mb-4 px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{
            background: meta.color,
            border: `1px solid ${meta.borderColor}`,
            color: meta.textColor,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <StatusIcon size={14} color={meta.textColor} />
          <span>Showing <span className="font-black">{meta.label}</span> events ({filtered.length})</span>
          <button
            onClick={onClearFilter}
            className="ml-auto text-xs font-bold underline underline-offset-2 opacity-70 hover:opacity-100 transition"
          >
            Show all
          </button>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{
              background: 'rgba(201,168,76,0.07)',
              border: '1px solid var(--border-soft)',
              color: meta ? meta.textColor : 'var(--text-muted)',
            }}
          >
            <StatusIcon size={24} color={meta ? meta.textColor : 'var(--text-muted)'} />
          </div>
          <p className="font-semibold" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
            {statusFilter ? `No ${meta.label.toLowerCase()} events` : 'No events yet'}
          </p>
          {statusFilter && (
            <button
              onClick={onClearFilter}
              className="mt-3 text-sm font-bold transition"
              style={{ color: 'var(--gold)', fontFamily: 'Inter, sans-serif' }}
            >
              ← Show all events
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(ev => (
            <EventCard key={ev._id} ev={ev} onStatusChange={onStatusChange} />
          ))}
        </div>
      )}
    </div>
  )
}
