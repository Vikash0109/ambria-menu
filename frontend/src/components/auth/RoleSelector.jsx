function AdminIcon({ size = 28, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" />
    </svg>
  )
}

function SalesIcon({ size = 28, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="16" />
      <line x1="10" y1="14" x2="14" y2="14" />
    </svg>
  )
}

export const ROLES = [
  {
    value:  'admin',
    Icon:   AdminIcon,
    title:  'Admin',
    desc:   'Full access · menu, events & staff',
  },
  {
    value:  'sales',
    Icon:   SalesIcon,
    title:  'Sales',
    desc:   'View-only · Events & customers',
  },
]

export default function RoleSelector({ selected, onChange }) {
  return (
    <div>
      <p
        className="text-sm font-semibold mb-2"
        style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}
      >
        Sign in as
      </p>
      <div className="grid grid-cols-2 gap-3">
        {ROLES.map(opt => {
          const isSelected = selected === opt.value
          const iconColor  = isSelected ? 'var(--gold)' : 'var(--text-muted)'
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className="p-3.5 rounded-xl text-center transition-all duration-150"
              style={{
                background: isSelected ? 'rgba(201,168,76,0.1)' : 'var(--surface-5)',
                border: `1px solid ${isSelected ? 'var(--gold)' : 'rgba(255,255,255,0.07)'}`,
                boxShadow: isSelected ? '0 0 12px rgba(201,168,76,0.15)' : 'none',
              }}
            >
              <div className="flex justify-center mb-1.5">
                <opt.Icon size={26} color={iconColor} />
              </div>
              <div
                className="font-bold text-sm"
                style={{
                  color: isSelected ? 'var(--gold-light)' : 'var(--text-primary)',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {opt.title}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
