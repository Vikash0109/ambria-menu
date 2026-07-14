import { cx } from '../../lib/utils.js'
import { PRIORITIES } from '../../constants/menuConfig.js'

export default function CustomizePanel({ opts, onChange, config }) {
  const { spice, spiceLevels, serving, servingSizes, priority } = config

  if (!spice && !serving && !priority) return null

  const btnBase = {
    padding: '0.25rem 0.625rem',
    borderRadius: '0.5rem',
    fontSize: '0.65rem',
    fontWeight: '600',
    fontFamily: 'Inter, sans-serif',
    transition: 'all 0.15s ease',
    cursor: 'pointer',
  }

  return (
    <div className="space-y-2.5 pt-1">

      {spice && (
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-1.5"
            style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}
          >
            Spice Level
          </p>
          <div className="flex flex-wrap gap-1">
            {spiceLevels.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => onChange({ ...opts, spiceLevel: opts.spiceLevel === s ? '' : s })}
                style={{
                  ...btnBase,
                  background: opts.spiceLevel === s ? 'linear-gradient(135deg, var(--gold), var(--gold-light))' : 'var(--surface-5)',
                  border: `1px solid ${opts.spiceLevel === s ? 'var(--gold)' : 'rgba(255,255,255,0.08)'}`,
                  color: opts.spiceLevel === s ? '#0a0a0a' : 'var(--text-secondary)',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {serving && (
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-1.5"
            style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}
          >
            Serving Size
          </p>
          <div className="flex flex-wrap gap-1">
            {servingSizes.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => onChange({ ...opts, servingSize: opts.servingSize === s ? '' : s })}
                style={{
                  ...btnBase,
                  background: opts.servingSize === s ? 'linear-gradient(135deg, var(--gold), var(--gold-light))' : 'var(--surface-5)',
                  border: `1px solid ${opts.servingSize === s ? 'var(--gold)' : 'rgba(255,255,255,0.08)'}`,
                  color: opts.servingSize === s ? '#0a0a0a' : 'var(--text-secondary)',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {priority && (
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-1.5"
            style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}
          >
            Priority
          </p>
          <div className="flex gap-1">
            {PRIORITIES.map(p => (
              <button
                key={p.value}
                type="button"
                onClick={() => onChange({ ...opts, priority: opts.priority === p.value ? null : p.value })}
                style={{
                  ...btnBase,
                  background: opts.priority === p.value ? 'linear-gradient(135deg, var(--gold), var(--gold-light))' : 'var(--surface-5)',
                  border: `1px solid ${opts.priority === p.value ? 'var(--gold)' : 'rgba(255,255,255,0.08)'}`,
                  color: opts.priority === p.value ? '#0a0a0a' : 'var(--text-secondary)',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
