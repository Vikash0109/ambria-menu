import { cx } from '../../lib/utils.js'

export function Section({ title, children }) {
  return (
    <div>
      <h3
        className="text-xs font-bold uppercase tracking-[0.2em] mb-4"
        style={{ color: 'var(--gold)', fontFamily: 'Inter, sans-serif' }}
      >
        {title}
      </h3>
      {children}
    </div>
  )
}

export function Field({ label, error, children, className = '' }) {
  return (
    <div className={className}>
      <label
        className="block text-sm font-semibold mb-1.5"
        style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs font-medium" style={{ color: '#f87171', fontFamily: 'Inter, sans-serif' }}>
          {error}
        </p>
      )}
    </div>
  )
}

export function inputCx(error) {
  return cx(
    'input-luxury',
    error ? '!border-red-500/60 !bg-red-950/20' : ''
  )
}
