// ─── Stat card icons ──────────────────────────────────────────────────────────
function CollectionsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}
function AllEventsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="16" x2="13" y2="16" />
    </svg>
  )
}
function PendingIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
function ConfirmedIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}
function CancelledIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  )
}
function CallbacksIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.128 1.013.36 2.01.7 2.97a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.18 6.18l.95-.95a2 2 0 0 1 2.11-.45c.96.34 1.957.572 2.97.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  )
}
function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6"  x2="21" y2="6"  />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

// Map string icon keys to components
const ICON_MAP = {
  collections: CollectionsIcon,
  events:      AllEventsIcon,
  pending:     PendingIcon,
  confirmed:   ConfirmedIcon,
  cancelled:   CancelledIcon,
  callbacks:   CallbacksIcon,
  menu:        MenuIcon,
}

const ICON_COLORS = {
  collections: 'var(--gold)',
  events:      'var(--gold)',
  pending:     '#fbbf24',
  confirmed:   '#4ade80',
  cancelled:   '#f87171',
  callbacks:   '#63b3ed',
  menu:        'var(--gold)',
}

export default function StatCard({ icon, label, value, onClick, active }) {
  const IconComponent = ICON_MAP[icon] ?? AllEventsIcon
  const iconColor     = ICON_COLORS[icon] ?? 'var(--gold)'

  const base = {
    background: active ? 'rgba(201,168,76,0.08)' : 'var(--surface-3)',
    border: `1px solid ${active ? 'rgba(201,168,76,0.35)' : 'var(--border-soft)'}`,
    borderRadius: '1rem',
    padding: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    transition: 'all 0.15s ease',
    boxShadow: active ? '0 0 20px rgba(201,168,76,0.1)' : 'none',
  }

  const iconBox = (
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{
        background: 'var(--surface-5)',
        border: '1px solid rgba(255,255,255,0.06)',
        color: iconColor,
      }}
    >
      <IconComponent />
    </div>
  )

  const content = (
    <div className="min-w-0">
      <p className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>{value}</p>
      <p className="text-sm font-medium leading-snug" style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>
        {label}
      </p>
    </div>
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        style={{ ...base, width: '100%', textAlign: 'left', cursor: 'pointer' }}
        onMouseEnter={e => {
          if (!active) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
            e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'
          }
        }}
        onMouseLeave={e => {
          if (!active) {
            e.currentTarget.style.background = 'var(--surface-3)'
            e.currentTarget.style.borderColor = 'var(--border-soft)'
          }
        }}
      >
        {iconBox}
        {content}
        {active && (
          <span
            className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
            style={{
              color: 'var(--gold)',
              background: 'rgba(201,168,76,0.12)',
              border: '1px solid var(--border)',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Filtered
          </span>
        )}
      </button>
    )
  }

  return (
    <div style={base}>
      {iconBox}
      {content}
    </div>
  )
}
