import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api.js'
import { FORM_KEY } from '../lib/utils.js'
import Navbar from '../components/Navbar.jsx'
import OrderSuccessModal from '../components/OrderSuccessModal.jsx'
import {
  OUTFITS, VENDORS, OUTFIT_PRICE_EACH, WAITER_PRICE_EACH,
  plateOptionsForSection, platePriceForSection, crockeryTypeForSection,
} from '../constants/services.js'

function fmt(n) { return `₹${Number(n || 0).toLocaleString('en-IN')}` }
function outfitLabel(id) { return OUTFITS.find(o => o.id === id)?.label ?? id }
function outfitColor(id)  { return OUTFITS.find(o => o.id === id)?.color ?? '#888' }
function vendorLabel(id)  { return VENDORS.find(v => v.id === id)?.label ?? id }
function vendorPrice(id)  { return VENDORS.find(v => v.id === id)?.price ?? 0 }
function plateLabelForSection(section, plateId) {
  return plateOptionsForSection(section).find(p => p.id === plateId)?.label ?? plateId
}

// ─── Crockery display groups (mirrors CrockeryCard grouping) ──────────────────
const CROCKERY_DISPLAY_GROUPS = [
  {
    id: 'beverages',
    label: 'Beverages',
    icon: '🥤',
    match: (n) => crockeryTypeForSection(n) === 'beverage',
  },
  {
    id: 'maincourse',
    label: 'Main Course',
    icon: '🍽️',
    match: (n) => { const t = crockeryTypeForSection(n); return t === 'main' || t === 'soup' || t === 'chaat' },
  },
  {
    id: 'dessert',
    label: 'Dessert',
    icon: '🍮',
    match: (n) => crockeryTypeForSection(n) === 'dessert',
  },
]

// ─── Reusable menu item list ──────────────────────────────────────────────────
function MenuItemList({ items, isAddon = false }) {
  return (
    <div className="space-y-1.5">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-start justify-between gap-3 rounded-xl px-3 py-2.5"
          style={{
            background: isAddon ? 'rgba(99,179,237,0.06)' : 'var(--surface-4)',
            border: `1px solid ${isAddon ? 'rgba(99,179,237,0.12)' : 'transparent'}`,
          }}
        >
          <div className="min-w-0">
            <p
              className="text-sm font-semibold leading-tight"
              style={{ color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}
            >
              {item.name}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {item.spiceLevel && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', fontFamily: 'Inter, sans-serif' }}
                >
                  🌶 {item.spiceLevel}
                </span>
              )}
              {item.servingSize && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: 'rgba(99,102,241,0.12)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)', fontFamily: 'Inter, sans-serif' }}
                >
                  {item.servingSize}
                </span>
              )}
              {item.priority && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: 'rgba(201,168,76,0.12)', color: 'var(--gold)', border: '1px solid var(--border)', fontFamily: 'Inter, sans-serif' }}
                >
                  {item.priority}
                </span>
              )}
              {item.notes && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.06)', fontFamily: 'Inter, sans-serif' }}
                >
                  📝 {item.notes}
                </span>
              )}
            </div>
          </div>
          {item.quantity > 1 && (
            <span
              className="text-xs font-black rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: isAddon ? '#63b3ed' : 'var(--gold)', color: '#0a0a0a' }}
            >
              {item.quantity}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Section card ─────────────────────────────────────────────────────────────
function ReviewCard({ icon, title, children, accent = false }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'var(--surface-3)',
        border: `1px solid ${accent ? 'rgba(201,168,76,0.25)' : 'var(--border-soft)'}`,
      }}
    >
      <div
        className="px-5 py-3.5 flex items-center gap-2.5"
        style={{
          background: accent ? 'rgba(201,168,76,0.07)' : 'var(--surface-4)',
          borderBottom: `1px solid ${accent ? 'rgba(201,168,76,0.15)' : 'var(--border-soft)'}`,
        }}
      >
        <span className="text-lg">{icon}</span>
        <h3
          className="font-black text-sm tracking-wide uppercase"
          style={{ color: accent ? 'var(--gold-light)' : 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}
        >
          {title}
        </h3>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  )
}

// ─── Info row ─────────────────────────────────────────────────────────────────
function InfoRow({ label, value }) {
  return (
    <div
      className="flex items-start justify-between gap-4 py-2"
      style={{ borderBottom: '1px dashed rgba(255,255,255,0.06)' }}
    >
      <span
        className="text-xs font-semibold uppercase tracking-wide shrink-0"
        style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}
      >
        {label}
      </span>
      <span
        className="text-sm font-semibold text-right"
        style={{ color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}
      >
        {value || '—'}
      </span>
    </div>
  )
}

// ─── Charge row ───────────────────────────────────────────────────────────────
function ChargeRow({ label, detail, amount, highlight = false }) {
  return (
    <div
      className="flex items-start justify-between gap-3 py-2.5"
      style={{ borderBottom: '1px dashed rgba(255,255,255,0.06)' }}
    >
      <div className="min-w-0">
        <p
          className="text-sm font-semibold"
          style={{ color: highlight ? 'var(--gold-light)' : 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}
        >
          {label}
        </p>
        {detail && (
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>
            {detail}
          </p>
        )}
      </div>
      <span
        className="text-sm font-black whitespace-nowrap"
        style={{ color: highlight ? 'var(--gold)' : 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}
      >
        {amount}
      </span>
    </div>
  )
}

// ─── ReviewPage ───────────────────────────────────────────────────────────────
export default function ReviewPage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const eventInfo = useMemo(() => {
    try { return JSON.parse(window.sessionStorage.getItem(FORM_KEY) || '{}') } catch { return {} }
  }, [])

  const selectedItems = useMemo(() => {
    try { return JSON.parse(window.sessionStorage.getItem('feast-selected-items') || '[]') } catch { return [] }
  }, [])

  const services = useMemo(() => {
    try { return JSON.parse(window.sessionStorage.getItem('feast-services') || '{}') } catch { return {} }
  }, [])

  const hasSession = Boolean(eventInfo.eventId && eventInfo.occasion)

  // Split items into primary (isAddon=false) and addon (isAddon=true)
  const { primaryItems, addonItems } = useMemo(() => {
    const primary = selectedItems.filter(it => !it.isAddon)
    const addon   = selectedItems.filter(it => it.isAddon)
    return { primaryItems: primary, addonItems: addon }
  }, [selectedItems])

  const groupedMenu = useMemo(() => {
    const map = {}
    for (const item of primaryItems) {
      const cat = item.category || 'Uncategorised'
      if (!map[cat]) map[cat] = []
      map[cat].push(item)
    }
    return map
  }, [primaryItems])

  const groupedAddons = useMemo(() => {
    const map = {}
    for (const item of addonItems) {
      const cat = item.category || 'Uncategorised'
      if (!map[cat]) map[cat] = []
      map[cat].push(item)
    }
    return map
  }, [addonItems])

  const waiterCharge   = Number(services.waiterCharge  || 0)
  const outfitCharge   = Number(services.outfitCharge  || 0)
  const crockeryCharge = Number(services.crockeryCharge || 0)
  const vendorCharge   = Number(services.vendorCharge  || 0)
  const totalCharge    = waiterCharge + outfitCharge + crockeryCharge + vendorCharge

  const crockeryChoices = services.crockery  || {}
  const selectedOutfits = services.outfits   || []
  const selectedVendors = services.vendors   || []

  async function handleConfirm() {
    setSubmitting(true)
    try {
      await api.post('/events/confirm', { eventId: eventInfo.eventId, selectedItems, services })
    } catch { /* non-blocking */ }
    finally { setSubmitting(false); setShowSuccess(true) }
  }

  if (!hasSession) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--surface-1)' }}>
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-24 flex flex-col items-center text-center">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-6"
            style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid var(--border)' }}
          >🎪</div>
          <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>No active order found</h1>
          <p className="text-base mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
            Please complete your event form, menu selection, and services first.
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-gold inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Start from the beginning →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-1)' }}>
      <Navbar />

      {/* Page header */}
      <div style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border-soft)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--gold)', fontFamily: 'Inter, sans-serif' }}>
                Final Step
              </p>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Review <span className="gold-text">Your Order</span>
              </h1>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
                {eventInfo.occasion} · {eventInfo.guestCount} guests · {eventInfo.venue}
              </p>
            </div>
            <button
              onClick={() => navigate('/services')}
              className="text-sm font-semibold transition"
              style={{ color: 'var(--gold)', fontFamily: 'Inter, sans-serif' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--gold-light)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--gold)'}
            >
              ← Back to Services
            </button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* Left column */}
          <div className="flex-1 flex flex-col gap-5">

            {/* Event Details */}
            <ReviewCard icon="📋" title="Event Details">
              <InfoRow label="Name"      value={eventInfo.name} />
              <InfoRow label="Phone"     value={eventInfo.phone} />
              <InfoRow label="Email"     value={eventInfo.email} />
              <InfoRow label="Occasion"  value={eventInfo.occasion} />
              <InfoRow label="Date"      value={eventInfo.eventDate
                ? new Date(eventInfo.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                : eventInfo.eventDate} />
              <InfoRow label="Time"      value={eventInfo.eventTime} />
              <InfoRow label="Venue"     value={eventInfo.venue} />
              <InfoRow label="Guests"    value={`${eventInfo.guestCount} guests`} />
              <InfoRow label="Food Pref" value={eventInfo.foodPref === 'nonveg' ? '🍗 Non-Vegetarian' : '🥦 Vegetarian'} />
            </ReviewCard>

            {/* Menu Selection */}
            <ReviewCard icon="🍽️" title={`Menu Selection · ${selectedItems.length} dishes`} accent>
              {selectedItems.length === 0 ? (
                <p className="text-sm py-2" style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>
                  No items selected.
                </p>
              ) : (
                <div className="space-y-4">
                  {/* ── Primary menu items ── */}
                  {Object.entries(groupedMenu).map(([category, items]) => (
                    <div key={category}>
                      <p
                        className="text-xs font-black uppercase tracking-widest mb-2"
                        style={{ color: 'var(--gold)', fontFamily: 'Inter, sans-serif' }}
                      >
                        {category}
                      </p>
                      <MenuItemList items={items} />
                    </div>
                  ))}

                  {/* ── Extras / Add-on items ── */}
                  {addonItems.length > 0 && (
                    <div>
                      {/* Divider with label */}
                      <div className="flex items-center gap-3 my-3">
                        <div className="flex-1 h-px" style={{ background: 'rgba(99,179,237,0.25)' }} />
                        <div
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                          style={{
                            background: 'rgba(99,179,237,0.08)',
                            border: '1px solid rgba(99,179,237,0.25)',
                          }}
                        >
                          <span style={{ fontSize: '0.6rem' }}>✦</span>
                          <span
                            className="text-[10px] font-black uppercase tracking-widest"
                            style={{ color: '#63b3ed', fontFamily: 'Inter, sans-serif' }}
                          >
                            Extras Added
                          </span>
                          <span
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                            style={{ background: 'rgba(99,179,237,0.2)', color: '#63b3ed', fontFamily: 'Inter, sans-serif' }}
                          >
                            {addonItems.length}
                          </span>
                        </div>
                        <div className="flex-1 h-px" style={{ background: 'rgba(99,179,237,0.25)' }} />
                      </div>

                      {Object.entries(groupedAddons).map(([category, items]) => (
                        <div key={category} className="mb-3">
                          <p
                            className="text-xs font-black uppercase tracking-widest mb-2"
                            style={{ color: '#63b3ed', fontFamily: 'Inter, sans-serif' }}
                          >
                            {category}
                          </p>
                          <MenuItemList items={items} isAddon />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </ReviewCard>

            {/* Staff */}
            <ReviewCard icon="👔" title="Staff & Services">
              <InfoRow label="Waiters" value={`${services.waiters ?? '—'} waiters (ratio ${services.ratio ?? '—'})`} />
              <InfoRow
                label="Outfits"
                value={selectedOutfits.length === 0 ? 'None selected' : (
                  <span className="flex flex-wrap gap-1.5 justify-end">
                    {selectedOutfits.map(id => (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: 'var(--surface-5)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.07)', fontFamily: 'Inter, sans-serif' }}
                      >
                        <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ background: outfitColor(id) }} />
                        {outfitLabel(id)}
                      </span>
                    ))}
                  </span>
                )}
              />
            </ReviewCard>

            {/* Crockery */}
            <ReviewCard icon="🍴" title="Crockery per Section">
              {Object.keys(crockeryChoices).length === 0 ? (
                <p className="text-sm py-2" style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>No crockery configured.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {CROCKERY_DISPLAY_GROUPS.map(group => {
                    const groupSections = Object.keys(crockeryChoices).filter(s => group.match(s))
                    if (groupSections.length === 0) return null

                    // Pick the representative section — prefer an upgraded one, else first
                    const repSection = groupSections.find(s => platePriceForSection(s, crockeryChoices[s]) > 0) ?? groupSections[0]
                    const repPlateId = crockeryChoices[repSection]
                    const repLabel   = plateLabelForSection(repSection, repPlateId)
                    const repPrice   = platePriceForSection(repSection, repPlateId)
                    const isUpgraded = repPrice > 0

                    return (
                      <div
                        key={group.id}
                        className="flex items-center justify-between gap-4 rounded-xl px-4 py-3"
                        style={{
                          background: isUpgraded ? 'rgba(201,168,76,0.06)' : 'var(--surface-4)',
                          border: `1px solid ${isUpgraded ? 'rgba(201,168,76,0.25)' : 'rgba(255,255,255,0.06)'}`,
                        }}
                      >
                        {/* Left: icon + group label */}
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-base shrink-0">{group.icon}</span>
                          <span
                            className="text-xs font-black uppercase tracking-widest truncate"
                            style={{ color: isUpgraded ? 'var(--gold-light)' : 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}
                          >
                            {group.label}
                          </span>
                        </div>

                        {/* Right: plate name + price badge */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className="text-xs font-semibold"
                            style={{ color: isUpgraded ? 'var(--text-primary)' : 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}
                          >
                            {repLabel}
                          </span>
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                            style={{
                              background: isUpgraded ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.05)',
                              color: isUpgraded ? 'var(--gold)' : 'var(--text-dim)',
                              border: `1px solid ${isUpgraded ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.08)'}`,
                              fontFamily: 'Inter, sans-serif',
                            }}
                          >
                            {isUpgraded ? `+₹${repPrice}/guest` : 'Included'}
                          </span>
                          {isUpgraded && (
                            <span
                              className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                              style={{ background: 'var(--gold)', color: '#0a0a0a', fontFamily: 'Inter, sans-serif' }}
                            >
                              Upgraded
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </ReviewCard>

            {/* Vendors */}
            {selectedVendors.length > 0 && (
              <ReviewCard icon="🏪" title="Outdoor Vendors">
                <div className="flex flex-wrap gap-2">
                  {selectedVendors.map(id => (
                    <div
                      key={id}
                      className="flex items-center gap-2 rounded-xl px-3 py-2"
                      style={{ background: 'var(--surface-4)', border: '1px solid rgba(255,255,255,0.05)' }}
                    >
                      <img
                        src={VENDORS.find(v => v.id === id)?.logo}
                        alt={vendorLabel(id)}
                        className="w-7 h-7 object-contain rounded"
                        onError={e => { e.target.style.display = 'none' }}
                      />
                      <div>
                        <p className="text-sm font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>
                          {vendorLabel(id)}
                        </p>
                        <p className="text-xs font-semibold" style={{ color: 'var(--gold)', fontFamily: 'Inter, sans-serif' }}>
                          {fmt(vendorPrice(id))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ReviewCard>
            )}
          </div>

          {/* Right sticky column */}
          <div className="w-full lg:w-80 shrink-0 sticky top-24 flex flex-col gap-4">

            {/* Order Summary */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'var(--surface-3)',
                border: '1px solid var(--border)',
                boxShadow: '0 0 40px rgba(0,0,0,0.4)',
              }}
            >
              <div className="gold-accent-bar" />
              <div
                className="px-5 py-4"
                style={{ background: 'var(--surface-4)', borderBottom: '1px solid var(--border-soft)' }}
              >
                <h2 className="font-black text-base" style={{ color: 'var(--gold-light)' }}>Order Summary</h2>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>
                  {eventInfo.occasion}
                </p>
              </div>

              <div className="px-5 py-4">
                <ChargeRow
                  label="Waiter Charges"
                  detail={`₹${WAITER_PRICE_EACH} × ${services.waiters ?? 0} · ratio ${services.ratio ?? '—'}`}
                  amount={fmt(waiterCharge)}
                />
                <ChargeRow
                  label="Outfit Charges"
                  detail={selectedOutfits.length > 0
                    ? `${selectedOutfits.length} outfit${selectedOutfits.length !== 1 ? 's' : ''} × ₹${OUTFIT_PRICE_EACH}`
                    : 'None selected'}
                  amount={fmt(outfitCharge)}
                />
                <ChargeRow
                  label="Crockery Charges"
                  detail={crockeryCharge > 0
                    ? `${Object.entries(crockeryChoices).filter(([sec, pid]) => platePriceForSection(sec, pid) > 0).length} upgraded section(s)`
                    : 'All sections using default crockery'}
                  amount={crockeryCharge > 0 ? fmt(crockeryCharge) : 'Included'}
                />
                <ChargeRow
                  label="Vendor Charges"
                  detail={selectedVendors.length > 0 ? selectedVendors.map(vendorLabel).join(', ') : 'None selected'}
                  amount={fmt(vendorCharge)}
                />
              </div>

              <div className="px-5 pb-5">
                <div className="gold-divider mb-4" />
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
                    Total Add-on Charges
                  </p>
                  <span className="text-sm font-bold" style={{ color: 'var(--gold)', fontFamily: 'Inter, sans-serif' }}>
                    {fmt(totalCharge)}
                  </span>
                </div>
                <div className="gold-divider my-3" />
                <div className="flex items-center justify-between">
                  <p className="text-base font-black" style={{ color: 'var(--text-primary)' }}>Total Price</p>
                  <span className="text-xl font-black gold-text">{fmt(totalCharge)}</span>
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: selectedItems.length, label: 'Dishes' },
                { value: eventInfo.guestCount,  label: 'Guests' },
                { value: services.waiters ?? 0, label: 'Waiters' },
                { value: selectedVendors.length, label: 'Vendors' },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="rounded-2xl px-4 py-3 text-center"
                  style={{ background: 'var(--surface-3)', border: '1px solid var(--border-soft)' }}
                >
                  <p className="text-2xl font-black gold-text">{value}</p>
                  <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* Confirm button */}
            <button
              onClick={handleConfirm}
              disabled={submitting}
              className="btn-gold w-full py-4 rounded-2xl font-bold text-base disabled:opacity-60 disabled:cursor-wait disabled:transform-none disabled:shadow-none"
              style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.04em' }}
            >
              {submitting ? 'Confirming…' : '✦ Confirm Order'}
            </button>

            <p className="text-xs text-center" style={{ color: 'var(--text-dim)', fontFamily: 'Inter, sans-serif' }}>
              Our team will follow up to confirm details.
            </p>
          </div>
        </div>
      </div>

      {showSuccess && (
        <OrderSuccessModal
          eventInfo={eventInfo}
          selectedItems={selectedItems}
          services={services}
          onClose={() => { setShowSuccess(false); navigate('/') }}
        />
      )}
    </div>
  )
}
