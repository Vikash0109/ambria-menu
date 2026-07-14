import { useState } from 'react'
import { generateOrderPdf } from '../../lib/pdf/generateOrderPdf.js'

export const STATUS_STYLES = {
  pending:   { pill: 'rgba(234,179,8,0.12)',  pillText: '#fbbf24', pillBorder: 'rgba(234,179,8,0.3)',  bar: '#fbbf24' },
  confirmed: { pill: 'rgba(34,197,94,0.12)',  pillText: '#4ade80', pillBorder: 'rgba(34,197,94,0.3)',  bar: '#4ade80' },
  cancelled: { pill: 'rgba(239,68,68,0.12)',  pillText: '#f87171', pillBorder: 'rgba(239,68,68,0.3)',  bar: '#f87171' },
}

// ─── Info field icons ─────────────────────────────────────────────────────────
function PhoneIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.1 6.1l.95-.95a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  )
}
function MailIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  )
}
function GuestsIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )
}
function OccasionIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  )
}
function CalendarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8"  y1="2" x2="8"  y2="6"/>
      <line x1="3"  y1="10" x2="21" y2="10"/>
    </svg>
  )
}
function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  )
}
function LocationIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  )
}
function TierIcon({ premium }) {
  return premium ? (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ) : (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/>
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>
    </svg>
  )
}
function DownloadIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16"/>
    </svg>
  )
}
function SpinnerIcon() {
  return (
    <svg width="13" height="13" className="animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
    </svg>
  )
}

export default function EventCard({ ev, onStatusChange }) {
  const s = STATUS_STYLES[ev.status] ?? STATUS_STYLES.pending
  const [downloading, setDownloading] = useState(false)
  const isPremium = ev.menuTier === 'premium'

  async function handleDownloadPdf() {
    setDownloading(true)
    try {
      await generateOrderPdf({
        eventInfo: {
          name: ev.name, occasion: ev.occasion, eventDate: ev.eventDate,
          eventTime: ev.eventTime ?? '', venue: ev.venue ?? '',
          guestCount: ev.guestCount, phone: ev.phone ?? '', email: ev.email ?? '',
          foodPref: ev.vegCount > 0 && ev.nonVegCount === 0 ? 'veg' : 'nonveg',
        },
        selectedItems: ev.selectedItems ?? [],
        services:      ev.services      ?? {},
      })
    } catch (err) {
      console.error('PDF generation failed:', err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div
      className="rounded-2xl overflow-hidden transition"
      style={{
        background: 'var(--surface-3)',
        border: '1px solid var(--border-soft)',
        borderLeft: `3px solid ${s.bar}`,
        boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.5)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.3)'}
    >
      <div className="p-5">
        {/* Top row */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2.5 h-2.5 rounded-full shrink-0 mt-0.5" style={{ background: s.bar }} />
            <h3 className="font-black text-base" style={{ color: 'var(--text-primary)' }}>{ev.name}</h3>
            <span
              className="text-xs font-bold px-2.5 py-0.5 rounded-full capitalize"
              style={{
                background: s.pill, color: s.pillText,
                border: `1px solid ${s.pillBorder}`,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {ev.status}
            </span>
            {/* Tier badge */}
            <span
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full"
              style={{
                background: isPremium ? 'rgba(168,85,247,0.12)' : 'rgba(99,102,241,0.12)',
                color:      isPremium ? '#c084fc' : '#a5b4fc',
                border: `1px solid ${isPremium ? 'rgba(168,85,247,0.25)' : 'rgba(99,102,241,0.25)'}`,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <TierIcon premium={isPremium} />
              {isPremium ? 'Premium' : 'Standard'}
            </span>
          </div>

          {onStatusChange ? (
            <div className="flex gap-1.5 flex-shrink-0">
              {['pending', 'confirmed', 'cancelled'].map(st => {
                const ss = STATUS_STYLES[st]
                const isCurrent = ev.status === st
                return (
                  <button
                    key={st}
                    onClick={() => onStatusChange(ev._id, st)}
                    disabled={isCurrent}
                    className="px-3 py-1 rounded-lg text-xs font-bold capitalize transition"
                    style={{
                      background: isCurrent ? ss.pill : 'var(--surface-5)',
                      border: `1px solid ${isCurrent ? ss.pillBorder : 'rgba(255,255,255,0.07)'}`,
                      color: isCurrent ? ss.pillText : 'var(--text-muted)',
                      fontFamily: 'Inter, sans-serif',
                      cursor: isCurrent ? 'default' : 'pointer',
                    }}
                  >
                    {st}
                  </button>
                )
              })}
            </div>
          ) : (
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-lg"
              style={{
                background: 'var(--surface-5)',
                border: '1px solid rgba(255,255,255,0.06)',
                color: 'var(--text-muted)',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              View only
            </span>
          )}
        </div>

        {/* Info grid */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2 text-sm mb-3"
          style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}
        >
          <span className="flex items-center gap-1.5"><PhoneIcon />{ev.phone}</span>
          <span className="flex items-center gap-1.5 min-w-0"><MailIcon /><span className="truncate">{ev.email}</span></span>
          <span className="flex items-center gap-1.5"><GuestsIcon />{ev.guestCount} guests</span>
          <span className="flex items-center gap-1.5"><OccasionIcon />{ev.occasion}</span>
          <span className="flex items-center gap-1.5"><CalendarIcon />{ev.eventDate}</span>
          {ev.eventTime && <span className="flex items-center gap-1.5"><ClockIcon />{ev.eventTime}</span>}
          {ev.venue     && <span className="flex items-center gap-1.5 col-span-2 min-w-0"><LocationIcon /><span className="truncate">{ev.venue}</span></span>}
        </div>

        {/* Download PDF */}
        <button
          onClick={handleDownloadPdf}
          disabled={downloading}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition disabled:opacity-50"
          style={{
            background: 'rgba(201,168,76,0.08)',
            border: '1px solid var(--border)',
            color: 'var(--gold)',
            fontFamily: 'Inter, sans-serif',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.14)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.08)' }}
        >
          {downloading ? <SpinnerIcon /> : <DownloadIcon />}
          {downloading ? 'Generating…' : 'Download PDF'}
        </button>
      </div>
    </div>
  )
}
