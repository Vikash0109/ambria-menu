import { useState } from 'react'
import { generateOrderPdf } from '../lib/pdf/generateOrderPdf.js'

export default function OrderSuccessModal({ eventInfo, selectedItems, services, onClose }) {
  const [downloading, setDownloading] = useState(false)

  async function handleDownload() {
    setDownloading(true)
    try {
      await generateOrderPdf({ eventInfo, selectedItems: selectedItems ?? [], services: services ?? {} })
    } catch (err) {
      console.error('PDF generation failed:', err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
    >
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden"
        style={{
          background: 'var(--surface-3)',
          border: '1px solid var(--border)',
          boxShadow: '0 0 80px rgba(201,168,76,0.12), 0 32px 64px rgba(0,0,0,0.8)',
        }}
      >
        {/* Gold top bar */}
        <div
          className="h-0.5 w-full"
          style={{ background: 'linear-gradient(90deg, transparent, var(--gold), var(--gold-bright), var(--gold), transparent)' }}
        />

        {/* Header */}
        <div className="px-7 pt-7 pb-5 text-center">
          {/* Checkmark circle */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{
              background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)',
              border: '1px solid rgba(201,168,76,0.28)',
              boxShadow: '0 0 24px rgba(201,168,76,0.12)',
            }}
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="11" stroke="url(#checkGold)" strokeWidth="1.5" />
              <path d="M7 12.5l3.5 3.5 6.5-7" stroke="url(#checkGold)" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="checkGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c9a84c" />
                  <stop offset="50%" stopColor="#f0d060" />
                  <stop offset="100%" stopColor="#c9a84c" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, var(--gold-dim))' }} />
            <span className="text-[9px] tracking-[0.32em] uppercase" style={{ color: 'var(--gold)', fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
              Confirmed
            </span>
            <div className="h-px w-8" style={{ background: 'linear-gradient(90deg, var(--gold-dim), transparent)' }} />
          </div>

          <h2 className="text-xl font-bold tracking-tight mb-1" style={{ color: 'var(--text-primary)' }}>
            Order Received
          </h2>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
            Your menu selection has been submitted successfully.
          </p>
        </div>

        {/* Divider */}
        <div className="mx-7 gold-divider" />

        {/* Summary pills */}
        <div className="px-6 py-4 grid grid-cols-3 gap-2">
          <Pill
            icon={
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            }
            label={eventInfo?.occasion || 'Event'}
          />
          <Pill
            icon={
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            }
            label={`${eventInfo?.guestCount ?? 0} Guests`}
          />
          <Pill
            icon={
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/>
                <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>
              </svg>
            }
            label={`${selectedItems?.length ?? 0} Dishes`}
          />
        </div>

        {/* Divider */}
        <div className="mx-7 gold-divider" />

        {/* Actions */}
        <div className="px-7 py-5 space-y-2.5">
          <p className="text-[11px] text-center mb-3" style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>
            Download a PDF summary of your order for your records.
          </p>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="btn-gold w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, letterSpacing: '0.04em' }}
          >
            {downloading ? (
              <>
                <SpinnerIcon />
                Generating PDF…
              </>
            ) : (
              <>
                <DownloadIcon />
                Download Order PDF
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 btn-ghost-gold"
            style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.03em' }}
          >
            Back to Home
          </button>
        </div>

        {/* Bottom ornament */}
        <div className="flex items-center justify-center gap-3 pb-4 opacity-30">
          <div className="h-px w-8" style={{ background: 'var(--gold-muted)' }} />
          <span style={{ color: 'var(--gold-muted)', fontSize: '0.5rem', letterSpacing: '0.3em', fontFamily: 'Inter, sans-serif' }}>
            AMBRIA CUISINE
          </span>
          <div className="h-px w-8" style={{ background: 'var(--gold-muted)' }} />
        </div>
      </div>
    </div>
  )
}

function Pill({ icon, label }) {
  return (
    <div
      className="flex flex-col items-center gap-1.5 py-3 rounded-xl"
      style={{
        background: 'var(--surface-4)',
        border: '1px solid var(--border-soft)',
      }}
    >
      <span style={{ color: 'var(--gold)' }}>{icon}</span>
      <span
        className="text-[10px] font-semibold text-center leading-tight px-1"
        style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}
      >
        {label}
      </span>
    </div>
  )
}

function DownloadIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}
