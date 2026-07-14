import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { api } from '../../lib/api.js'

export default function StaffTab({ currentUserId }) {
  const [staff,    setStaff]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    api.get('/admin/staff')
      .then(r => setStaff(r.data.staff ?? []))
      .catch(() => toast.error('Could not load staff.'))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id, name) {
    if (!confirm(`Remove ${name} from the system?`)) return
    setDeleting(id)
    try {
      await api.delete(`/admin/staff/${id}`)
      setStaff(prev => prev.filter(s => s._id !== id))
      toast.success(`${name} removed.`)
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Could not remove staff member.')
    } finally {
      setDeleting(null)
    }
  }

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

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: 'var(--surface-3)', border: '1px solid var(--border-soft)' }}
    >
      {staff.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">👤</p>
          <p className="font-semibold" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
            No staff accounts yet
          </p>
        </div>
      ) : (
        <div>
          {staff.map((s, idx) => (
            <div
              key={s._id}
              className="px-5 py-4 flex items-center gap-4"
              style={{ borderBottom: idx < staff.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                style={{
                  background: s.role === 'admin' ? 'rgba(201,168,76,0.12)' : 'rgba(99,102,241,0.12)',
                  color: s.role === 'admin' ? 'var(--gold)' : '#a5b4fc',
                  border: `1px solid ${s.role === 'admin' ? 'var(--border)' : 'rgba(99,102,241,0.2)'}`,
                }}
              >
                {s.name?.[0]?.toUpperCase() ?? '?'}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>
                    {s.name}
                  </p>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full uppercase"
                    style={{
                      background: s.role === 'admin' ? 'rgba(201,168,76,0.12)' : 'rgba(99,102,241,0.12)',
                      color: s.role === 'admin' ? 'var(--gold)' : '#a5b4fc',
                      border: `1px solid ${s.role === 'admin' ? 'var(--border)' : 'rgba(99,102,241,0.2)'}`,
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {s.role}
                  </span>
                  {String(s._id) === String(currentUserId) && (
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(34,197,94,0.12)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.25)', fontFamily: 'Inter, sans-serif' }}
                    >
                      You
                    </span>
                  )}
                </div>
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>
                  {s.email}
                </p>
              </div>

              {String(s._id) !== String(currentUserId) && (
                <button
                  onClick={() => handleDelete(s._id, s.name)}
                  disabled={deleting === s._id}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition flex-shrink-0 disabled:opacity-50"
                  style={{
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    color: '#f87171',
                    fontFamily: 'Inter, sans-serif',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                >
                  {deleting === s._id ? '…' : 'Remove'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
