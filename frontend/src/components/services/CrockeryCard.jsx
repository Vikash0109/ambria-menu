import { useState } from 'react'
import { plateOptionsForSection, defaultPlateForSection, platePriceForSection, crockeryTypeForSection } from '../../constants/services.js'

// ── 3 top-level crockery groups ───────────────────────────────────────────────
const CROCKERY_GROUPS = [
  {
    id: 'beverages',
    label: 'Beverages',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 22H16M12 11V22M6 3H18L16 11H8L6 3Z"/>
      </svg>
    ),
    match: (n) => crockeryTypeForSection(n) === 'beverage',
  },
  {
    id: 'maincourse',
    label: 'Main Course',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
    match: (n) => { const t = crockeryTypeForSection(n); return t === 'main' || t === 'soup' || t === 'chaat' },
  },
  {
    id: 'dessert',
    label: 'Dessert',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C8 2 4 5 4 9c0 3 2 5.5 5 6.5V18h6v-2.5c3-1 5-3.5 5-6.5 0-4-4-7-8-7z"/><path d="M9 18v2a3 3 0 0 0 6 0v-2"/>
      </svg>
    ),
    match: (n) => crockeryTypeForSection(n) === 'dessert',
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
function isGroupUpgraded(sections, group, choices) {
  return sections
    .filter(s => group.match(s))
    .some(s => {
      const chosen = choices[s] ?? defaultPlateForSection(s)
      return platePriceForSection(s, chosen) > 0
    })
}

// Representative section for a group (first matching section) — used to derive plate options
function repSection(menuSections, group) {
  return menuSections.find(s => group.match(s)) ?? null
}

// Current chosen plate id for a group (uses first matching section's choice)
function groupChosenId(menuSections, group, choices) {
  const rep = repSection(menuSections, group)
  if (!rep) return null
  return choices[rep] ?? defaultPlateForSection(rep)
}

export default function CrockeryCard({ menuSections, choices, onSelectPlate, total }) {
  const [activeGroup, setActiveGroup] = useState('beverages')
  const [notes, setNotes] = useState('')

  if (menuSections.length === 0) {
    return (
      <div className="py-20 text-center flex flex-col items-center gap-3">
        <div style={{
          width: 52, height: 52, borderRadius: 12,
          background: 'rgba(201,168,76,0.08)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/>
          </svg>
        </div>
        <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter,sans-serif' }}>No menu sections found</p>
        <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'Inter,sans-serif' }}>Go back and select your menu first.</p>
      </div>
    )
  }

  const currentGroup  = CROCKERY_GROUPS.find(g => g.id === activeGroup) ?? CROCKERY_GROUPS[1]
  const rep           = repSection(menuSections, currentGroup)
  const options       = rep ? plateOptionsForSection(rep) : []
  const chosenId      = groupChosenId(menuSections, currentGroup, choices)

  // When a plate is selected, apply it to ALL sections in the group
  function handleSelectPlate(optId) {
    const groupSections = menuSections.filter(s => currentGroup.match(s))
    groupSections.forEach(sec => onSelectPlate(sec, optId))
  }

  function switchGroup(gid) {
    setActiveGroup(gid)
  }

  return (
    <div className="space-y-5">

      {/* ── 3 group tabs ── */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {CROCKERY_GROUPS.map(group => {
          const isActive    = activeGroup === group.id
          const upgraded    = isGroupUpgraded(menuSections, group, choices)
          const hasStations = menuSections.some(s => group.match(s))
          return (
            <button
              key={group.id}
              type="button"
              onClick={() => hasStations && switchGroup(group.id)}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '0.3rem', padding: '0.65rem 0.5rem',
                borderRadius: '0.875rem', cursor: hasStations ? 'pointer' : 'default',
                background: isActive ? 'rgba(201,168,76,0.1)' : 'var(--surface-3)',
                border: `1px solid ${isActive ? 'var(--gold)' : 'rgba(255,255,255,0.07)'}`,
                boxShadow: isActive ? '0 0 0 1px rgba(201,168,76,0.2), 0 2px 12px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.2)',
                opacity: hasStations ? 1 : 0.35,
                transition: 'all 0.15s ease',
                position: 'relative', overflow: 'hidden',
              }}
            >
              {isActive && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                  background: 'linear-gradient(90deg, transparent, var(--gold), var(--gold-bright), var(--gold), transparent)',
                }} />
              )}
              <span style={{ color: isActive ? 'var(--gold)' : 'var(--text-muted)', display: 'flex' }}>
                {group.icon}
              </span>
              <span style={{
                fontSize: '0.75rem', fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--gold-light)' : 'var(--text-secondary)',
                fontFamily: 'Inter,sans-serif', textAlign: 'center', letterSpacing: '0.01em',
              }}>
                {group.label}
              </span>
              {upgraded && (
                <span style={{
                  fontSize: '0.55rem', fontWeight: 800, padding: '1px 6px',
                  borderRadius: '999px', marginTop: '2px',
                  background: isActive ? 'var(--gold)' : 'rgba(201,168,76,0.18)',
                  color: isActive ? '#0a0a0a' : 'var(--gold)',
                  fontFamily: 'Inter,sans-serif', letterSpacing: '0.06em',
                }}>
                  UPGRADED
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ── No stations in this group ── */}
      {options.length === 0 && (
        <div style={{
          padding: '2rem', borderRadius: '0.875rem', textAlign: 'center',
          background: 'var(--surface-3)', border: '1px solid rgba(255,255,255,0.06)',
          color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'Inter,sans-serif',
        }}>
          No {currentGroup.label.toLowerCase()} stations in your menu.
        </div>
      )}

      {/* ── Plate option cards ── */}
      {options.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {options.map(opt => {
            const selected = chosenId === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectPlate(opt.id)}
                style={{
                  padding: '1.1rem', borderRadius: '0.875rem', textAlign: 'left',
                  background: selected ? 'var(--surface-5)' : 'var(--surface-3)',
                  border: `1px solid ${selected ? 'rgba(201,168,76,0.5)' : 'rgba(255,255,255,0.06)'}`,
                  boxShadow: selected ? '0 0 18px rgba(201,168,76,0.1)' : 'none',
                  transition: 'all 0.15s ease', minHeight: '9rem',
                  display: 'flex', flexDirection: 'column',
                }}
                onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)' }}
                onMouseLeave={e => { if (!selected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}
              >
                <p style={{
                  fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.4rem',
                  color: selected ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontFamily: 'Inter,sans-serif',
                }}>
                  {opt.label}
                </p>
                <p style={{
                  fontSize: '0.75rem', lineHeight: 1.5, flex: 1,
                  color: 'var(--text-muted)', fontFamily: 'Inter,sans-serif',
                }}>
                  {opt.description}
                </p>
                <div style={{ marginTop: '0.75rem' }}>
                  {opt.isDefault ? (
                    <span style={{
                      display: 'inline-block', fontSize: '0.6rem', fontWeight: 900,
                      padding: '3px 8px', borderRadius: '999px', letterSpacing: '0.08em',
                      background: 'rgba(255,255,255,0.08)', color: 'var(--text-secondary)',
                      fontFamily: 'Inter,sans-serif',
                    }}>
                      INCLUDED
                    </span>
                  ) : (
                    <span style={{
                      display: 'inline-block', fontSize: '0.68rem', fontWeight: 700,
                      padding: '3px 8px', borderRadius: '999px',
                      background: 'rgba(201,168,76,0.12)', color: 'var(--gold)',
                      border: '1px solid rgba(201,168,76,0.25)',
                      fontFamily: 'Inter,sans-serif',
                    }}>
                      +₹{opt.price}.00 / GUEST
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* ── Notes textarea ── */}
      <textarea
        rows={2}
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Any crockery request — specific color, material preference, etc."
        style={{
          width: '100%', padding: '0.85rem 1rem', borderRadius: '0.875rem', resize: 'none',
          background: 'var(--surface-3)', border: '1px solid rgba(255,255,255,0.07)',
          color: 'var(--text-secondary)', fontSize: '0.8rem', fontFamily: 'Inter,sans-serif',
          outline: 'none', lineHeight: 1.6, scrollbarWidth: 'none',
          transition: 'border-color 0.2s', boxSizing: 'border-box',
        }}
        onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.35)'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.07)'}
      />
    </div>
  )
}
