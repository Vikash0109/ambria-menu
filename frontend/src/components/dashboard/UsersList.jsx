export default function UsersList({ users, loading }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-2xl animate-pulse"
            style={{ background: 'var(--surface-3)', border: '1px solid var(--border-soft)' }}
          />
        ))}
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">👥</p>
        <p className="font-semibold" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
          No registered users yet
        </p>
      </div>
    )
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: 'var(--surface-3)', border: '1px solid var(--border-soft)' }}
    >
      <div>
        {users.map((user, idx) => (
          <div
            key={user._id}
            className="px-5 py-4 flex items-center gap-4"
            style={{ borderBottom: idx < users.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
              style={{ background: 'rgba(201,168,76,0.12)', color: 'var(--gold)', border: '1px solid var(--border)' }}
            >
              {user.name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>
                {user.name}
              </p>
              <p className="text-xs truncate" style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>
                {user.email}
              </p>
            </div>
            {user.phone && (
              <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>
                {user.phone}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
