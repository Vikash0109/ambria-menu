import { RATIOS, OUTFITS, WAITER_PRICE_EACH, waiterCountForRatio } from '../../constants/services.js'

function OutfitCard({ outfit, selected, onToggle }) {
  const isIncluded = outfit.isDefault  // White Kurta — no extra charge

  return (
    <button
      type="button"
      onClick={() => onToggle(outfit.id)}
      className="relative flex flex-col items-center gap-2 rounded-xl px-3 py-4 select-none transition-all duration-150"
      style={{
        background: selected ? 'rgba(201,168,76,0.1)' : 'var(--surface-5)',
        border: `1px solid ${selected ? 'var(--gold)' : 'rgba(255,255,255,0.07)'}`,
        boxShadow: selected ? '0 0 12px rgba(201,168,76,0.15)' : 'none',
      }}
      aria-pressed={selected}
      aria-label={`${outfit.label}${isIncluded ? ', included' : `, ₹${outfit.price}`}`}
    >
      {/* Colour swatch */}
      <span
        className="w-8 h-8 rounded-full border-2 shrink-0"
        style={{
          backgroundColor: outfit.color,
          borderColor: selected ? 'var(--gold)' : 'rgba(255,255,255,0.15)',
          boxShadow: selected ? `0 0 8px ${outfit.color}60` : 'none',
        }}
      />

      {/* Label */}
      <span
        className="text-xs font-bold text-center leading-snug"
        style={{ color: selected ? 'var(--gold-light)' : 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}
      >
        {outfit.label}
      </span>

      {/* Price tag */}
      <span
        className="text-xs font-semibold"
        style={{
          color: isIncluded
            ? (selected ? 'var(--gold)' : '#4caf87')
            : (selected ? 'var(--gold)' : 'var(--text-muted)'),
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {isIncluded ? 'Included' : `+₹${outfit.price}`}
      </span>

      {/* Selected checkmark */}
      {selected && (
        <span
          className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
          style={{ background: 'var(--gold)' }}
        >
          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="#0a0a0a" strokeWidth={3.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
    </button>
  )
}

export default function StaffCard({
  guestCount, waiters, setWaiters,
  ratio, setRatio,
  selectedOutfits, toggleOutfit,
  waiterTotal, outfitTotal,
}) {
  const defaultCount = waiterCountForRatio(guestCount, ratio)
  const addOnCount   = Math.max(0, waiters - defaultCount)

  function handleRatioChange(newRatioId) {
    setRatio(newRatioId)
    setWaiters(waiterCountForRatio(guestCount, newRatioId))
  }

  return (
    <div className="flex flex-col gap-5">

      {/* ── Waiters section ── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'var(--surface-3)', border: '1px solid var(--border-soft)' }}
      >
        {/* Sub-header */}
        <div
          className="px-5 py-3"
          style={{ background: 'var(--surface-4)', borderBottom: '1px solid var(--border-soft)' }}
        >
          <p className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--gold)', fontFamily: 'Inter, sans-serif' }}>
            Waiters
          </p>
        </div>

        <div className="px-5 py-5 space-y-4">
          {/* Ratio buttons */}
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>
              Ratio (waiters : guests)
            </p>
            <div className="flex gap-2">
              {RATIOS.map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleRatioChange(r.id)}
                  className="flex-1 py-2 rounded-xl text-xs font-black transition-all"
                  style={{
                    background: ratio === r.id
                      ? 'linear-gradient(135deg, var(--gold), var(--gold-light))'
                      : 'var(--surface-5)',
                    border: `1px solid ${ratio === r.id ? 'var(--gold)' : 'rgba(255,255,255,0.07)'}`,
                    color: ratio === r.id ? '#0a0a0a' : 'var(--text-secondary)',
                    boxShadow: ratio === r.id ? '0 4px 12px rgba(201,168,76,0.25)' : 'none',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
            <span style={{ color: 'var(--text-secondary)' }}>👥 Guests</span>
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{guestCount}</span>
          </div>
          <div className="flex items-center justify-between text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Default ({ratio})</span>
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{defaultCount}</span>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>
              Total waiters
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setWaiters(w => Math.max(defaultCount, w - 1))}
                disabled={waiters <= defaultCount}
                className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: 'var(--surface-5)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'var(--text-secondary)',
                }}
                aria-label="Remove waiter"
              >−</button>
              <span className="w-8 text-center text-lg font-black" style={{ color: 'var(--gold)' }}>{waiters}</span>
              <button
                onClick={() => setWaiters(w => w + 1)}
                className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-lg transition"
                style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-light))', color: '#0a0a0a' }}
                aria-label="Add waiter"
              >+</button>
            </div>
          </div>

          {addOnCount > 0 && (
            <div className="flex items-center justify-between text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
              <span style={{ color: 'var(--text-muted)' }}>Add-on waiters</span>
              <span className="font-semibold" style={{ color: 'var(--gold)' }}>+{addOnCount}</span>
            </div>
          )}

          <div
            className="pt-3 flex items-center justify-between text-xs"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)', fontFamily: 'Inter, sans-serif' }}
          >
            <span style={{ color: 'var(--text-muted)' }}>₹{WAITER_PRICE_EACH} × {waiters} waiters</span>
            <span className="text-sm font-black" style={{ color: 'var(--text-primary)' }}>₹{waiterTotal}</span>
          </div>
        </div>
      </div>

      {/* ── Outfits section ── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'var(--surface-3)', border: '1px solid var(--border-soft)' }}
      >
        {/* Sub-header */}
        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{ background: 'var(--surface-4)', borderBottom: '1px solid var(--border-soft)' }}
        >
          <p className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--gold)', fontFamily: 'Inter, sans-serif' }}>
            Outfits
          </p>
          <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>
            White Kurta included
          </span>
        </div>

        <div className="px-5 py-5">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {OUTFITS.map(outfit => (
              <OutfitCard
                key={outfit.id}
                outfit={outfit}
                selected={selectedOutfits.includes(outfit.id)}
                onToggle={toggleOutfit}
              />
            ))}
          </div>
          <div
            className="mt-5 pt-4 flex items-center justify-between"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            <span className="text-sm" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
              {selectedOutfits.length > 0
                ? (() => {
                    const o = OUTFITS.find(x => x.id === selectedOutfits[0])
                    return o?.isDefault ? `${o.label} · Included` : `${o?.label} · +₹${o?.price}`
                  })()
                : 'No outfit selected'}
            </span>
            <span className="text-sm font-black" style={{ color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>
              ₹{outfitTotal}
            </span>
          </div>
        </div>
      </div>

    </div>
  )
}
