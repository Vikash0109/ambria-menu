import { useState } from 'react'
import { VENDORS } from '../../constants/services.js'

function VendorCard({ vendor, selected, onToggle }) {
  const [logoFailed, setLogoFailed] = useState(false)

  return (
    <button
      type="button"
      onClick={() => onToggle(vendor.id)}
      className="relative flex flex-col items-center justify-center rounded-2xl py-5 px-3 gap-1.5 select-none text-center transition-all duration-150 overflow-hidden"
      style={{
        background: selected ? 'rgba(201,168,76,0.08)' : 'var(--surface-4)',
        border: `1px solid ${selected ? 'var(--gold)' : 'rgba(255,255,255,0.07)'}`,
        boxShadow: selected ? '0 0 20px rgba(201,168,76,0.15), inset 0 0 0 1px rgba(201,168,76,0.1)' : 'none',
        transform: selected ? 'scale(1.03)' : 'scale(1)',
      }}
      aria-pressed={selected}
      aria-label={`${vendor.label} — ₹${vendor.price.toLocaleString()}`}
    >
      {/* subtle color wash */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundColor: vendor.color }} />

      {/* Brand logo */}
      <div
        className="relative w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center shrink-0"
        style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
      >
        {!logoFailed ? (
          <img
            src={vendor.logo}
            alt={vendor.label}
            className="w-12 h-12 object-contain"
            onError={() => setLogoFailed(true)}
          />
        ) : (
          <span
            className="w-full h-full flex items-center justify-center text-white text-lg font-black rounded-xl"
            style={{ backgroundColor: vendor.color }}
          >
            {vendor.label.charAt(0)}
          </span>
        )}
      </div>

      <span
        className="relative text-sm font-bold leading-tight"
        style={{ color: selected ? 'var(--gold-light)' : 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}
      >
        {vendor.label}
      </span>
      <span
        className="relative text-xs font-semibold"
        style={{ color: 'var(--gold)', fontFamily: 'Inter, sans-serif' }}
      >
        ₹{vendor.price.toLocaleString()}
      </span>

      {vendor.nonVegOnly && (
        <span
          className="relative text-[9px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded-full"
          style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}
        >
          Non-Veg
        </span>
      )}

      {selected && (
        <span
          className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: 'var(--gold)', boxShadow: '0 0 8px rgba(201,168,76,0.4)' }}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="#0a0a0a" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
    </button>
  )
}

export default function VendorsCard({ isNonVeg, selectedVendors, toggleVendor, total }) {
  const visibleVendors = VENDORS.filter(v => !v.nonVegOnly || isNonVeg)

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: 'var(--surface-3)', border: '1px solid var(--border-soft)' }}
    >
      {/* Sub-header */}
      <div
        className="px-5 py-3"
        style={{ background: 'var(--surface-4)', borderBottom: '1px solid var(--border-soft)' }}
      >
        <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--gold)', fontFamily: 'Inter, sans-serif' }}>
          Select brands for live counters
        </p>
      </div>

      <div style={{ padding: '1.25rem' }}>
        {!isNonVeg && (
          <div
            className="mb-4 flex items-center gap-2 text-xs rounded-xl px-3 py-2"
            style={{
              color: 'var(--text-secondary)',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            KFC is only available for non-veg events
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {visibleVendors.map(vendor => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              selected={selectedVendors.includes(vendor.id)}
              onToggle={toggleVendor}
            />
          ))}
        </div>

        <div
          className="mt-5 pt-4 flex items-center justify-between"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <span className="text-sm" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
            {selectedVendors.length > 0
              ? `${selectedVendors.length} vendor${selectedVendors.length !== 1 ? 's' : ''} selected`
              : 'No vendors selected'}
          </span>
          <span className="text-sm font-black" style={{ color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>
            ₹{total.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}
