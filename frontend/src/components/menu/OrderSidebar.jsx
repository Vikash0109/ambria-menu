import GroupedOrderList from './GroupedOrderList.jsx'

export default function OrderSidebar({
  orderList, onReorder, onRemove,
  opts, sections, selected,
  guestCount, eventName,
  submitting, onSubmit,
}) {
  const total = orderList.length

  return (
    <aside
      className="flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        boxShadow: '0 0 40px rgba(0,0,0,0.4)',
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3.5"
        style={{
          background: 'var(--surface-4)',
          borderBottom: '1px solid var(--border-soft)',
        }}
      >
        {/* Gold accent bar at very top */}
        <div className="gold-accent-bar -mx-4 -mt-3.5 mb-3" />
        <div className="flex items-center justify-between">
          <h2
            className="font-bold text-sm tracking-wide"
            style={{ color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}
          >
            Your Selection
          </h2>
          {total > 0 && (
            <span
              className="text-xs font-black px-2 py-0.5 rounded-full"
              style={{ background: 'var(--gold)', color: '#0a0a0a' }}
            >
              {total}
            </span>
          )}
        </div>
        {eventName && (
          <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>
            {eventName}
          </p>
        )}
        {total > 0 && (
          <p className="text-[10px] mt-1" style={{ color: 'var(--text-dim)', fontFamily: 'Inter, sans-serif' }}>
            Drag to reorder serving sequence
          </p>
        )}
        {total === 0 && (
          <p className="text-[10px] mt-1" style={{ color: 'var(--text-dim)', fontFamily: 'Inter, sans-serif' }}>
            Primary menu pre-selected · pick extras below
          </p>
        )}
      </div>

      {/* List */}
      <div className="flex-1 min-h-0">
        <GroupedOrderList
          orderList={orderList}
          onReorder={onReorder}
          onRemove={onRemove}
          opts={opts}
          sections={sections}
          selected={selected}
        />
      </div>

      {/* Footer */}
      <div
        className="px-4 py-3.5 space-y-2.5"
        style={{ borderTop: '1px solid var(--border-soft)' }}
      >
        {guestCount > 0 && (
          <div className="flex justify-between text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
            <span style={{ color: 'var(--text-muted)' }}>Guests</span>
            <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>{guestCount}</span>
          </div>
        )}
        {total > 0 && (
          <div className="flex justify-between text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
            <span style={{ color: 'var(--text-muted)' }}>Add-ons selected</span>
            <span className="font-semibold" style={{ color: '#90cdf4' }}>{total}</span>
          </div>
        )}

        <button
          onClick={onSubmit}
          disabled={submitting}
          className="btn-gold w-full py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <span>{submitting ? 'Submitting…' : 'Go To Services'}</span>
          {!submitting && (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          )}
        </button>
      </div>
    </aside>
  )
}
