import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FORM_KEY } from '../lib/utils.js'
import Navbar from '../components/Navbar.jsx'
import StaffCard      from '../components/services/StaffCard.jsx'
import CrockeryCard   from '../components/services/CrockeryCard.jsx'
import VendorsCard    from '../components/services/VendorsCard.jsx'
import PricingSummary from '../components/services/PricingSummary.jsx'

import {
  OUTFITS, PLATE_OPTIONS, VENDORS,
  DEFAULT_RATIO, DEFAULT_PLATE_ID,
  waiterCountForRatio, waiterCharge, platePrice,
  defaultPlateForSection, platePriceForSection,
  crockeryTypeForSection,
  getSectionsFromSaved,
  outfitPrice,
} from '../constants/services.js'

const SERVICE_SECTIONS = [
  { id: 'staff',    label: 'Staff & Outfits' },
  { id: 'crockery', label: 'Crockery'        },
  { id: 'vendors',  label: 'Outdoor Vendors' },
]

// SVG icons for service nav
function ServiceIcon({ id, size = 16, color = 'currentColor' }) {
  const s = { width: size, height: size, flexShrink: 0 }
  if (id === 'staff') return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )
  if (id === 'crockery') return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill={color} stroke="none"/>
    </svg>
  )
  if (id === 'vendors') return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
  return null
}

export default function ServicesPage() {
  const navigate = useNavigate()

  const saved = useMemo(() => {
    try { return JSON.parse(window.sessionStorage.getItem(FORM_KEY) || '{}') } catch { return {} }
  }, [])

  const hasSession = Boolean(saved.eventId && saved.occasion)
  const guestCount = Number(saved.guestCount) || 0
  const isNonVeg   = (saved.foodPref ?? saved._foodPref) === 'nonveg'
  const menuSections = useMemo(() => getSectionsFromSaved(), [])

  const [activeSection, setActiveSection] = useState('staff')
  const [ratio,   setRatio]   = useState(DEFAULT_RATIO)
  const [waiters, setWaiters] = useState(() => waiterCountForRatio(guestCount, DEFAULT_RATIO))
  const [selectedOutfits, setOutfits] = useState([OUTFITS[0].id])
  const [crockeryChoices, setCrockery] = useState(() =>
    Object.fromEntries(menuSections.map(s => [s, defaultPlateForSection(s)]))
  )
  const [selectedVendors, setVendors] = useState([])
  const [submitting] = useState(false)

  const contentRef = useRef(null)

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [])

  const waiterTotal      = waiterCharge(waiters)
  const outfitTotal      = selectedOutfits.reduce((sum, id) => sum + outfitPrice(id), 0)
  // Charge once per crockery type (beverage/main/soup/chaat/dessert), not per section.
  // Multiple sections of the same type (e.g. "Juice" + "Tea" = both 'beverage') share one plate choice.
  const crockeryPerGuest = (() => {
    const seenTypes = new Set()
    let sum = 0
    for (const [sec, pid] of Object.entries(crockeryChoices)) {
      const type = crockeryTypeForSection(sec)
      if (seenTypes.has(type)) continue
      seenTypes.add(type)
      sum += platePriceForSection(sec, pid)
    }
    return sum
  })()
  const crockeryTotal  = crockeryPerGuest * guestCount
  const vendorTotal    = selectedVendors
    .reduce((sum, id) => sum + (VENDORS.find(v => v.id === id)?.price ?? 0), 0)
  const addOnTotal     = waiterTotal + outfitTotal + crockeryTotal + vendorTotal

  // badge counts per section for the left nav
  const sectionBadge = {
    staff:    waiters + selectedOutfits.length,
    crockery: Object.entries(crockeryChoices).filter(([sec, id]) => id !== defaultPlateForSection(sec)).length,
    vendors:  selectedVendors.length,
  }

  function toggleOutfit(id) {
    setOutfits(prev => prev.includes(id) ? prev : [id])
  }
  function toggleVendor(id) {
    setVendors(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id])
  }
  function selectPlate(section, plateId) {
    setCrockery(prev => ({ ...prev, [section]: plateId }))
  }
  function handleSubmit() {
    window.sessionStorage.setItem('feast-services', JSON.stringify({
      waiters, ratio,
      outfits: selectedOutfits,
      crockery: crockeryChoices,
      vendors: selectedVendors,
      waiterCharge: waiterTotal,
      outfitCharge: outfitTotal,
      crockeryCharge: crockeryTotal,
      vendorCharge: vendorTotal,
      totalCharge: addOnTotal,
    }))
    navigate('/review')
  }

  function switchSection(id) {
    setActiveSection(id)
    if (contentRef.current) contentRef.current.scrollTop = 0
  }

  if (!hasSession) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--surface-1)' }}>
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-24 flex flex-col items-center text-center">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
            style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid var(--border)', color: 'var(--gold)' }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>No active order found</h1>
          <p className="text-base mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
            Please complete your event form and menu selection first.
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

  const PANEL_H    = 'calc(100vh - 10.5rem)'
  const STICKY_TOP = '7rem'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-1)' }}>
      <Navbar />

      {/* Info bar — mirrors MenuPage's info bar */}
      <div style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border-soft)' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-12 flex items-center gap-3">
          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>
            Services <span style={{ color: 'var(--gold)' }}>Add-ons</span>
          </span>
          <span style={{ color: 'var(--border)', userSelect: 'none' }}>|</span>
          <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>
            {saved.occasion} · {guestCount} guests
          </span>
          <div className="flex-1" />
          <button
            onClick={() => navigate('/menu')}
            className="hidden sm:flex items-center gap-1 text-xs transition"
            style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to menu
          </button>
        </div>
      </div>

      {/* Three-panel body */}
      <div
        className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4"
        style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}
      >

        {/* LEFT: service category nav */}
        <div
          className="hidden md:flex flex-col rounded-2xl overflow-hidden"
          style={{
            width: '13rem', minWidth: '13rem', maxWidth: '13rem',
            height: PANEL_H, overflow: 'hidden',
            position: 'sticky', top: STICKY_TOP, flexShrink: 0,
            background: 'var(--surface-2)',
            border: '1px solid var(--border-soft)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          }}
        >
          {/* Nav header */}
          <div
            className="px-4 py-3"
            style={{ flexShrink: 0, background: 'var(--surface-3)', borderBottom: '1px solid var(--border-soft)' }}
          >
            <p
              className="text-[10px] font-black uppercase tracking-widest"
              style={{ color: 'var(--gold)', fontFamily: 'Inter, sans-serif' }}
            >
              Services
            </p>
          </div>

          {/* Nav items */}
          <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
            {SERVICE_SECTIONS.map(sec => {
              const isActive = activeSection === sec.id
              const badge    = sectionBadge[sec.id]
              return (
                <button
                  key={sec.id}
                  onClick={() => switchSection(sec.id)}
                  style={{
                    display: 'flex', width: '100%', textAlign: 'left',
                    background: isActive ? 'rgba(201,168,76,0.12)' : 'transparent',
                    borderLeft: isActive ? '2px solid var(--gold)' : '2px solid transparent',
                    transition: 'all 0.15s ease',
                  }}
                  className="items-center gap-2.5 px-3 py-2.5"
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                >
                  <ServiceIcon id={sec.id} size={15} color={isActive ? 'var(--gold-light)' : 'var(--text-muted)'} />
                  <span
                    className="text-xs leading-snug flex-1 truncate"
                    style={{
                      color: isActive ? 'var(--gold-light)' : 'var(--text-secondary)',
                      fontWeight: isActive ? 600 : 400,
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {sec.label}
                  </span>
                  {badge > 0 && (
                    <span
                      className="shrink-0 text-[10px] font-black px-1.5 py-0.5 rounded-full"
                      style={{
                        background: isActive ? 'var(--gold)' : 'rgba(201,168,76,0.2)',
                        color: isActive ? '#0a0a0a' : 'var(--gold)',
                      }}
                    >
                      {badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Total cost at bottom of nav */}
          <div
            className="px-4 py-2.5"
            style={{ flexShrink: 0, borderTop: '1px solid var(--border-soft)', background: 'var(--surface-3)' }}
          >
            <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>
              Add-on Total
            </p>
            <p className="text-sm font-black" style={{ color: addOnTotal > 0 ? 'var(--gold)' : 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>
              ₹{addOnTotal.toLocaleString()}
            </p>
          </div>
        </div>

        {/* CENTRE: active service card panel */}
        <div
          className="flex flex-col rounded-2xl overflow-hidden"
          style={{
            flex: 1, minWidth: 0,
            height: PANEL_H, overflow: 'hidden',
            position: 'sticky', top: STICKY_TOP,
            background: 'var(--surface-2)',
            border: '1px solid var(--border-soft)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          }}
        >
          {/* Section header */}
          {(() => {
            const sec = SERVICE_SECTIONS.find(s => s.id === activeSection)
            return (
              <div
                className="flex items-center gap-3 px-5 py-3"
                style={{
                  flexShrink: 0,
                  background: 'var(--surface-4)',
                  borderBottom: '1px solid var(--border-soft)',
                }}
              >
                <span className="shrink-0" style={{ color: 'var(--gold)' }}>
                  <ServiceIcon id={sec.id} size={17} color="var(--gold)" />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    className="text-sm font-bold leading-tight truncate"
                    style={{ color: 'var(--gold-light)', fontFamily: 'Inter, sans-serif' }}
                  >
                    {sec.label}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>
                    {activeSection === 'staff'    && `${waiters} waiters · ${selectedOutfits.length} outfit${selectedOutfits.length !== 1 ? 's' : ''}`}
                    {activeSection === 'crockery' && `${menuSections.length} station${menuSections.length !== 1 ? 's' : ''}`}
                    {activeSection === 'vendors'  && (selectedVendors.length > 0 ? `${selectedVendors.length} selected` : 'None selected')}
                  </p>
                </div>

                {/* Mobile section switcher pills */}
                <div className="flex md:hidden items-center gap-1.5">
                  {SERVICE_SECTIONS.map(s => (
                    <button
                      key={s.id}
                      onClick={() => switchSection(s.id)}
                      className="flex items-center justify-center px-2.5 py-1.5 rounded-lg transition-all"
                      style={{
                        background: s.id === activeSection ? 'rgba(201,168,76,0.15)' : 'transparent',
                        border: `1px solid ${s.id === activeSection ? 'var(--gold)' : 'rgba(255,255,255,0.07)'}`,
                        color: s.id === activeSection ? 'var(--gold)' : 'var(--text-muted)',
                      }}
                      aria-label={s.label}
                    >
                      <ServiceIcon id={s.id} size={14} color="currentColor" />
                    </button>
                  ))}
                </div>
              </div>
            )
          })()}

          {/* Scrollable content */}
          <div
            ref={contentRef}
            style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '1rem' }}
          >
            {activeSection === 'staff' && (
              <StaffCard
                guestCount={guestCount}
                waiters={waiters}
                setWaiters={setWaiters}
                ratio={ratio}
                setRatio={setRatio}
                selectedOutfits={selectedOutfits}
                toggleOutfit={toggleOutfit}
                waiterTotal={waiterTotal}
                outfitTotal={outfitTotal}
              />
            )}

            {activeSection === 'crockery' && (
              <CrockeryCard
                menuSections={menuSections}
                choices={crockeryChoices}
                onSelectPlate={selectPlate}
                total={crockeryTotal}
              />
            )}

            {activeSection === 'vendors' && (
              <VendorsCard
                isNonVeg={isNonVeg}
                selectedVendors={selectedVendors}
                toggleVendor={toggleVendor}
                total={vendorTotal}
              />
            )}
          </div>
        </div>

        {/* RIGHT: pricing summary sidebar */}
        <div
          className="hidden xl:flex flex-col rounded-2xl overflow-hidden"
          style={{
            width: '17rem', minWidth: '17rem', maxWidth: '17rem',
            height: PANEL_H,
            position: 'sticky', top: STICKY_TOP, flexShrink: 0,
          }}
        >
          <PricingSummary
            occasion={saved.occasion ?? ''}
            waiters={waiters}
            ratio={ratio}
            waiterTotal={waiterTotal}
            selectedOutfits={selectedOutfits}
            outfitTotal={outfitTotal}
            crockeryChoices={crockeryChoices}
            crockeryTotal={crockeryTotal}
            crockeryPerGuest={crockeryPerGuest}
            guestCount={guestCount}
            selectedVendors={selectedVendors}
            vendorTotal={vendorTotal}
            addOnTotal={addOnTotal}
            submitting={submitting}
            onConfirm={handleSubmit}
          />
        </div>

        {/* Mobile: floating confirm button (xl hidden) */}
        <div
          className="xl:hidden fixed bottom-0 left-0 right-0 z-50 px-4 py-3"
          style={{ background: 'var(--surface-2)', borderTop: '1px solid var(--border-soft)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
              Add-on Total
            </span>
            <span className="text-sm font-black" style={{ color: addOnTotal > 0 ? 'var(--gold)' : 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>
              ₹{addOnTotal.toLocaleString()}
            </span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-gold w-full py-3 rounded-xl text-sm disabled:opacity-50"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {submitting ? 'Saving…' : 'Review Order →'}
          </button>
        </div>
      </div>
    </div>
  )
}
