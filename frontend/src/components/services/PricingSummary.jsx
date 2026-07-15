import { WAITER_PRICE_EACH, OUTFIT_PRICE_EACH, VENDORS, platePriceForSection, crockeryTypeForSection } from '../../constants/services.js'

function SummaryRow({ label, detail, amount }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div>
        <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>{label}</p>
        {detail && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>{detail}</p>}
      </div>
      <span className="font-bold text-sm whitespace-nowrap" style={{ color: 'var(--gold)', fontFamily: 'Inter, sans-serif' }}>{amount}</span>
    </div>
  )
}

export default function PricingSummary({
  occasion,
  waiters, ratio, waiterTotal,
  selectedOutfits, outfitTotal,
  crockeryChoices, crockeryTotal, crockeryPerGuest, guestCount,
  selectedVendors, vendorTotal,
  addOnTotal,
  submitting, onConfirm,
}) {
  // Count distinct crockery types that are upgraded (not per-section, to avoid double-counting)
  const paidCrockerySections = (() => {
    const seenTypes = new Set()
    let count = 0
    for (const [sec, pid] of Object.entries(crockeryChoices)) {
      const type = crockeryTypeForSection(sec)
      if (seenTypes.has(type)) continue
      seenTypes.add(type)
      if (pid && platePriceForSection(sec, pid) > 0) count++
    }
    return count
  })()

  return (
    <div
      className="w-full flex flex-col rounded-2xl overflow-hidden h-full"
      style={{
        background: 'var(--surface-3)',
        border: '1px solid var(--border)',
        boxShadow: '0 0 40px rgba(0,0,0,0.4)',
      }}
    >
      {/* Gold accent */}
      <div className="gold-accent-bar" />

      {/* Header */}
      <div
        className="px-5 py-4"
        style={{ background: 'var(--surface-4)', borderBottom: '1px solid var(--border-soft)' }}
      >
        <h2 className="font-bold text-base" style={{ color: 'var(--gold-light)' }}>Pricing Summary</h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>{occasion}</p>
      </div>

      {/* Rows — scrollable */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="px-5 py-5 space-y-3 text-sm">
          <SummaryRow
            label="Waiter Charges"
            detail={`₹${WAITER_PRICE_EACH} × ${waiters} · ratio ${ratio}`}
            amount={`₹${waiterTotal}`}
          />
          <SummaryRow
            label="Outfit Charges"
            detail={selectedOutfits.length > 0
              ? `₹${OUTFIT_PRICE_EACH} × 1 outfit`
              : 'None selected'}
            amount={`₹${outfitTotal}`}
          />
          <SummaryRow
            label="Crockery Charges"
            detail={crockeryTotal > 0
              ? `₹${crockeryPerGuest}/guest × ${guestCount} guests · ${paidCrockerySections} section${paidCrockerySections !== 1 ? 's' : ''} upgraded`
              : 'All sections using Standard Steel'}
            amount={crockeryTotal > 0 ? `₹${crockeryTotal.toLocaleString()}` : 'Included'}
          />
          <SummaryRow
            label="Vendor Charges"
            detail={selectedVendors.length > 0
              ? selectedVendors.map(id => VENDORS.find(v => v.id === id)?.label).filter(Boolean).join(', ')
              : 'None selected'}
            amount={`₹${vendorTotal.toLocaleString()}`}
          />

          <div className="gold-divider" />

          <div className="flex items-center justify-between">
            <p className="font-semibold" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
              Total Add-on Charges
            </p>
            <span className="font-bold whitespace-nowrap" style={{ color: 'var(--gold)', fontFamily: 'Inter, sans-serif' }}>
              ₹{addOnTotal.toLocaleString()}
            </span>
          </div>

          <div className="gold-divider" />

          <div className="flex items-center justify-between pt-1">
            <p className="font-black text-base" style={{ color: 'var(--text-primary)' }}>Total Price</p>
            <span className="font-black text-base whitespace-nowrap gold-text">
              ₹{addOnTotal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Confirm — pinned to bottom */}
      <div
        className="px-5 py-4"
        style={{ borderTop: '1px solid var(--border-soft)', flexShrink: 0 }}
      >
        <button
          onClick={onConfirm}
          disabled={submitting}
          className="btn-gold w-full py-3 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {submitting ? 'Saving…' : 'Review Order →'}
        </button>
        <p className="text-xs text-center mt-2" style={{ color: 'var(--text-dim)', fontFamily: 'Inter, sans-serif' }}>
          Services are optional
        </p>
      </div>
    </div>
  )
}
