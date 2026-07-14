import { useState } from 'react'
import { cx } from '../../lib/utils.js'
import { itemKey, getCustomizeConfig } from '../../constants/menuConfig.js'
import CustomizePanel from './CustomizePanel.jsx'

export default function MenuItemCard({
  item, secIdx, itemIdx,
  qty, opts,
  onAdd, onRemove, onOptsChange,
  sectionName,
  isAddon = false,
}) {
  const key          = itemKey(secIdx, itemIdx)
  const added        = qty > 0
  const config       = getCustomizeConfig(sectionName, item.name)
  const hasCustomize = config.spice || config.serving || config.priority

  const [customOpen, setCustomOpen] = useState(false)

  function toggle() {
    if (added) { onRemove(key); setCustomOpen(false) }
    else        { onAdd(key) }
  }

  return (
    <div
      className="flex flex-col rounded-xl transition-all duration-150"
      style={{
        height: '100%',
        background: added ? 'var(--surface-4)' : 'var(--surface-3)',
        border: `1px solid ${added ? 'var(--gold)' : 'rgba(255,255,255,0.07)'}`,
        boxShadow: added ? '0 0 16px rgba(201,168,76,0.12)' : 'none',
      }}
    >
      {/* ── Name + description + checkbox ── */}
      <div className="flex items-start gap-2.5 p-3 flex-1">
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-semibold leading-snug"
            style={{
              color: added ? 'var(--gold-light)' : 'var(--text-primary)',
              fontFamily: 'Inter, sans-serif',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '2.6em',
            }}
          >
            {item.name}
          </p>
          <p
            className="text-xs mt-0.5 leading-relaxed"
            style={{
              height: '2.8em',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              color: 'var(--text-muted)',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {item.description ?? ''}
          </p>
        </div>

        {/* Checkbox */}
        <button
          type="button"
          onClick={toggle}
          aria-label={added ? `Remove ${item.name}` : `Add ${item.name}`}
          className="shrink-0 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all"
          style={{
            background: added
              ? 'linear-gradient(135deg, var(--gold), var(--gold-light))'
              : 'transparent',
            border: `2px solid ${added ? 'var(--gold)' : 'rgba(255,255,255,0.2)'}`,
            boxShadow: added ? '0 0 8px rgba(201,168,76,0.4)' : 'none',
          }}
        >
          {added && (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="#0a0a0a" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
      </div>

      {/* ADD-ON badge */}
      {isAddon && (
        <div className="px-3 pb-1.5 -mt-1">
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.58rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '2px 7px',
              borderRadius: '999px',
              background: 'rgba(201,168,76,0.08)',
              border: '1px solid rgba(201,168,76,0.25)',
              color: 'var(--gold-dim)',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            ADD-ON
          </span>
        </div>
      )}

      {/* ── Notes + customize ── */}
      <div
        className="px-3 pb-3 pt-2 space-y-2"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        {config.notes && (
          <textarea
            value={opts.notes ?? ''}
            onChange={e => onOptsChange(key, { ...opts, notes: e.target.value })}
            placeholder="Add a note (optional)"
            rows={1}
            disabled={!added}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg resize-none outline-none leading-relaxed transition-colors"
            style={{
              background: added ? 'var(--surface-5)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${added ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)'}`,
              color: added ? 'var(--text-secondary)' : 'var(--text-dim)',
              fontFamily: 'Inter, sans-serif',
            }}
          />
        )}

        {hasCustomize && (
          <div>
            <button
              type="button"
              disabled={!added}
              onClick={() => added && setCustomOpen(v => !v)}
              className="flex items-center gap-1 text-[11px] font-medium transition"
              style={{
                color: added ? 'var(--text-secondary)' : 'var(--text-dim)',
                fontFamily: 'Inter, sans-serif',
                cursor: added ? 'pointer' : 'default',
              }}
            >
              <svg
                className={cx('w-3 h-3 transition-transform duration-150', customOpen && 'rotate-180')}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
              Spice / Serving / Priority
            </button>

            {added && customOpen && (
              <div className="mt-2">
                <CustomizePanel
                  opts={opts}
                  onChange={next => onOptsChange(key, next)}
                  config={config}
                />
              </div>
            )}
          </div>
        )}

        {added && qty > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onRemove(key)}
              className="w-6 h-6 rounded-md flex items-center justify-center text-sm font-bold transition"
              style={{
                background: 'var(--surface-5)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text-secondary)',
              }}
            >−</button>
            <span className="text-xs font-bold w-4 text-center" style={{ color: 'var(--gold)' }}>{qty}</span>
            <button
              onClick={() => onAdd(key)}
              className="w-6 h-6 rounded-md flex items-center justify-center text-sm font-bold transition"
              style={{
                background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
                color: '#0a0a0a',
              }}
            >+</button>
          </div>
        )}
      </div>
    </div>
  )
}
