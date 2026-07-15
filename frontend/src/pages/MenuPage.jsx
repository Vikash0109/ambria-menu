import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { api } from '../lib/api.js'
import { cx, FORM_KEY } from '../lib/utils.js'
import Navbar from '../components/Navbar.jsx'
import MenuItemCard from '../components/menu/MenuItemCard.jsx'
import OrderSidebar from '../components/menu/OrderSidebar.jsx'
import { itemKey, sectionIcon, isNonVegSection, sectionCrockery } from '../constants/menuConfig.js'
import { magnumVeg, magnumNonVeg, multicuisineVeg, multicuisineNonVeg } from '../constants/menuData.js'

// Map collection key → local fallback data
const LOCAL_COLLECTIONS = { magnumVeg, magnumNonVeg, multicuisineVeg, multicuisineNonVeg }

// Given the primary collection key, return the complementary addon collection key
function addonKeyFor(primaryKey) {
  if (primaryKey === 'magnumVeg')         return 'multicuisineVeg'
  if (primaryKey === 'magnumNonVeg')      return 'multicuisineNonVeg'
  if (primaryKey === 'multicuisineVeg')   return 'magnumVeg'
  if (primaryKey === 'multicuisineNonVeg') return 'magnumNonVeg'
  return null
}

// Select every item in every primary section (indices 0..primaryCount-1)
// into `selected` map (so cards show pre-checked), but NOT into orderList
// (sidebar only shows extras the user manually picks)
function selectAllPrimary(sections, primaryCount) {
  const selected = {}
  sections.slice(0, primaryCount).forEach((sec, si) => {
    sec.items.forEach((_, ii) => {
      selected[itemKey(si, ii)] = 1
    })
  })
  // orderList starts empty — sidebar is blank until user picks add-ons
  return { selected, orderList: [] }
}

export default function MenuPage() {
  const navigate = useNavigate()

  const saved = useMemo(() => {
    try { return JSON.parse(window.sessionStorage.getItem(FORM_KEY) || '{}') } catch { return {} }
  }, [])

  const formSubmitted = Boolean(saved.eventId && saved.occasion)
  const guestCount    = Number(saved.guestCount) || 0
  const foodPref      = saved.foodPref || saved._foodPref || 'veg'

  const collectionKey = useMemo(() => {
    const isMulti = guestCount > 150
    if (isMulti) return foodPref === 'nonveg' ? 'multicuisineNonVeg' : 'multicuisineVeg'
    return foodPref === 'nonveg' ? 'magnumNonVeg' : 'magnumVeg'
  }, [guestCount, foodPref])

  const [sections,      setSections]   = useState([])
  const [loading,       setLoading]    = useState(true)
  const [selected,      setSelected]   = useState({})
  const [itemOpts,      setItemOpts]   = useState({})
  const [activeSection, setActive]     = useState(0)
  const [submitting,    setSubmitting] = useState(false)
  const [searchQuery,   setSearch]     = useState('')

  const orderRef               = useRef([])
  const [orderList, setOrderList] = useState([])
  const contentRef             = useRef(null)

  function syncOrderList() {
    const deduped = [...new Set(orderRef.current)]
    orderRef.current = deduped
    setOrderList([...deduped])
  }

  useEffect(() => {
    if (!formSubmitted) return
    let alive = true
    setLoading(true)
    api.get(`/collections/${collectionKey}`, {
      headers: { 'Cache-Control': 'no-cache' },
      params:  { _t: Date.now() },
    })
      .then(res => {
        if (!alive) return
        const primarySections = res.data.collection?.sections ?? []

        // Build addon sections from the complementary local collection
        const addonKey      = addonKeyFor(collectionKey)
        const addonRaw      = addonKey ? (LOCAL_COLLECTIONS[addonKey] ?? []) : []
        const addonSections = addonRaw.map(sec => ({ ...sec, _isAddon: true }))

        // Merge: primary first, then addons
        const allSections = [...primarySections, ...addonSections]
        setSections(allSections)

        // Auto-select ALL items from primary sections only
        const { selected: defSel, orderList: defOrder } = selectAllPrimary(allSections, primarySections.length)
        setSelected(defSel)
        orderRef.current = defOrder
        setOrderList([...defOrder])

        // Start on first beverage/drink section
        const bevIdx = allSections.findIndex(s =>
          s.section.toLowerCase().includes('beverage') ||
          s.section.toLowerCase().includes('drink')
        )
        setActive(bevIdx >= 0 ? bevIdx : 0)
      })
      .catch(() => { if (alive) setSections([]) })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [collectionKey, formSubmitted])

  function addItem(key) {
    // Only addon/extras items belong in orderList — primary items are always
    // included in the order and should never appear in the sidebar
    const [si] = key.split('__').map(Number)
    const isAddon = Boolean(sections[si]?._isAddon)
    if (isAddon && !orderRef.current.includes(key)) {
      orderRef.current = [...orderRef.current, key]
      syncOrderList()
    }
    setSelected(prev => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }))
  }

  function removeItem(key) {
    const [si] = key.split('__').map(Number)
    const isAddon = Boolean(sections[si]?._isAddon)
    setSelected(prev => {
      const qty = (prev[key] ?? 0) - 1
      if (qty <= 0) {
        // Only remove from orderList if it's an addon item
        if (isAddon) {
          orderRef.current = orderRef.current.filter(k => k !== key)
          syncOrderList()
        }
        setItemOpts(o => { const n = { ...o }; delete n[key]; return n })
        const next = { ...prev }; delete next[key]; return next
      }
      return { ...prev, [key]: qty }
    })
  }

  function removeFromSidebar(key) {
    orderRef.current = orderRef.current.filter(k => k !== key)
    syncOrderList()
    setSelected(prev => { const n = { ...prev }; delete n[key]; return n })
    setItemOpts(o => { const n = { ...o }; delete n[key]; return n })
  }

  function reorderList(newList) {
    orderRef.current = newList
    setOrderList([...newList])
  }

  function updateOpts(key, next) {
    setItemOpts(prev => ({ ...prev, [key]: next }))
  }

  function switchSection(idx) {
    setActive(idx)
    setSearch('')
    if (contentRef.current) contentRef.current.scrollTop = 0
  }

  function handleSubmit() {
    if (!formSubmitted) return
    // Collect primary items (all pre-selected, not in orderList)
    const primaryItems = []
    sections.forEach((sec, si) => {
      if (sec._isAddon) return
      sec.items.forEach((item, ii) => {
        const key = itemKey(si, ii)
        const o   = itemOpts[key] ?? {}
        primaryItems.push({
          id: key,
          name:        item.name,
          category:    sec.section,
          quantity:    selected[key] ?? 1,
          spiceLevel:  o.spiceLevel  ?? '',
          servingSize: o.servingSize ?? '',
          priority:    o.priority    ?? null,
          notes:       o.notes       ?? '',
          servingOrder: primaryItems.length,
          isAddon: false,
        })
      })
    })

    // Collect add-on items the user manually selected
    const addonItems = orderList.map((key, idx) => {
      const [si, ii] = key.split('__').map(Number)
      const item = sections[si]?.items[ii]
      const o    = itemOpts[key] ?? {}
      return {
        id: key,
        name:        item?.name ?? key,
        category:    sections[si]?.section ?? '',
        quantity:    selected[key] ?? 1,
        spiceLevel:  o.spiceLevel  ?? '',
        servingSize: o.servingSize ?? '',
        priority:    o.priority    ?? null,
        notes:       o.notes       ?? '',
        servingOrder: primaryItems.length + idx,
        isAddon: true,
      }
    })

    const allItems = [...primaryItems, ...addonItems]
    window.sessionStorage.setItem('feast-selected-items', JSON.stringify(allItems))
    navigate('/services')
  }

  if (!formSubmitted) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--surface-1)' }}>
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-24 flex flex-col items-center text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
            style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid var(--border)' }}
          >
            <svg className="w-8 h-8" style={{ color: 'var(--gold)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
            </svg>
          </div>
          <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Complete your event form first</h1>
          <p className="text-sm mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
            Your personalised menu is built from your event details — guest count, food preference, and occasion.
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-gold px-7 py-3 rounded-xl text-sm"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Fill in event details
          </button>
        </div>
      </div>
    )
  }

  const menuLabel   = guestCount > 150 ? 'Multicuisine' : 'Magnum'
  const addonLabel  = guestCount > 150 ? 'Magnum'       : 'Multicuisine'
  const prefLabel   = foodPref === 'nonveg' ? 'Non-Veg' : 'Veg'
  const currentSection = sections[activeSection]
  const isGlobalSearch = searchQuery.trim().length > 0

  const displayItems = useMemo(() => {
    if (!isGlobalSearch) {
      if (!currentSection) return []
      return currentSection.items.map((it, ii) => ({
        ...it,
        _ii: ii,
        _si: activeSection,
        _sectionName: currentSection.section,
        _isAddon: false,
      }))
    }
    // Global search — scan all sections (skip addon sections, they appear inline)
    const q = searchQuery.toLowerCase()
    const results = []
    sections.forEach((sec, si) => {
      if (sec._isAddon) return
      sec.items.forEach((it, ii) => {
        if (it.name.toLowerCase().includes(q) || it.description?.toLowerCase().includes(q)) {
          results.push({ ...it, _ii: ii, _si: si, _sectionName: sec.section, _isAddon: false })
        }
      })
    })
    return results
  }, [currentSection, searchQuery, isGlobalSearch, sections, activeSection])

  // Addon items that match the current primary section (shown inline below a dotted divider)
  // Uses normalized matching: strips trailing parentheticals and compares case-insensitively
  // so e.g. "Soup Station (Select any one)" matches "Soup Station (Select any two)",
  // and "International Cuisine – Pan Asian" matches "International Cuisine – Pan Asian (Teppanyaki Live)"
  const addonDisplayItems = useMemo(() => {
    if (isGlobalSearch || !currentSection || currentSection._isAddon) return []

    // Normalize: lowercase, strip trailing parenthetical "(…)" and whitespace
    function normalize(name) {
      return name.toLowerCase().replace(/\s*\(.*?\)\s*$/, '').trim()
    }
    const primaryNorm = normalize(currentSection.section)

    // Collect names already in the primary section so we can deduplicate
    const primaryNames = new Set(currentSection.items.map(it => it.name.toLowerCase().trim()))

    const results = []
    const seenNames = new Set()

    sections.forEach((sec, si) => {
      if (!sec._isAddon) return
      const addonNorm = normalize(sec.section)
      // Match if either normalized name starts with the other (handles suffix differences)
      if (addonNorm !== primaryNorm &&
          !addonNorm.startsWith(primaryNorm) &&
          !primaryNorm.startsWith(addonNorm)) return
      sec.items.forEach((it, ii) => {
        const nameLower = it.name.toLowerCase().trim()
        // Skip if this item already exists in the primary section or was already added
        if (primaryNames.has(nameLower) || seenNames.has(nameLower)) return
        seenNames.add(nameLower)
        results.push({ ...it, _ii: ii, _si: si, _sectionName: sec.section, _isAddon: true })
      })
    })
    return results
  }, [currentSection, isGlobalSearch, sections])

  const totalSelected = orderList.length

  const PANEL_H   = 'calc(100vh - 9rem)'
  const STICKY_TOP = '7rem'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-1)' }}>
      <Navbar />

      {/* Info bar */}
      <div style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border-soft)' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-12 flex items-center gap-3">
          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>
            {menuLabel} {prefLabel} Menu
          </span>
          <span style={{ color: 'var(--border)', userSelect: 'none' }}>|</span>
          <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>
            {saved.occasion} · {guestCount} guests
          </span>
          <div className="flex-1" />

          {/* Global search */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{
              background: 'var(--surface-3)',
              border: `1px solid ${searchQuery ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.08)'}`,
              transition: 'border-color 0.2s',
              minWidth: '200px',
            }}
          >
            <svg className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              value={searchQuery}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search all dishes…"
              className="bg-transparent outline-none text-xs flex-1"
              style={{ color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}
            />
            {searchQuery && (
              <button onClick={() => setSearch('')} style={{ color: 'var(--text-muted)', lineHeight: 1 }}>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <button
            onClick={() => navigate('/plan')}
            className="hidden sm:flex items-center gap-1 text-xs transition"
            style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Edit event
          </button>
        </div>
      </div>

      {/* ── Mobile category grid (below info bar, above items) ── */}
      <div className="md:hidden" style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border-soft)' }}>
        {loading ? (
          <div className="grid grid-cols-2 gap-2 px-3 py-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: 'var(--surface-3)' }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 px-3 py-3">
            {sections.filter(sec => !sec._isAddon).map((sec) => {
              const idx     = sections.indexOf(sec)
              const isActive  = activeSection === idx
              const nonVeg    = isNonVegSection(sec.section)
              const dot       = sectionIcon(sec.section)
              const selCount  = sec.items.filter((_, ii) => selected[itemKey(idx, ii)] > 0).length
              // also count selected addon items for this section
              const addonSelCount = sections.reduce((acc, s, si) => {
                if (!s._isAddon || s.section !== sec.section) return acc
                return acc + s.items.filter((_, ii) => selected[itemKey(si, ii)] > 0).length
              }, 0)
              const totalSel  = selCount + addonSelCount
              const accentColor = nonVeg ? '#ef4444' : 'var(--gold)'
              return (
                <button
                  key={idx}
                  onClick={() => switchSection(idx)}
                  style={{
                    textAlign: 'left',
                    background: isActive
                      ? nonVeg ? 'rgba(239,68,68,0.13)' : 'rgba(201,168,76,0.1)'
                      : 'var(--surface-3)',
                    border: `1px solid ${isActive ? accentColor : 'rgba(255,255,255,0.07)'}`,
                    borderRadius: '0.75rem',
                    padding: '0.6rem 0.75rem',
                    transition: 'all 0.15s ease',
                    boxShadow: isActive
                      ? `0 0 0 1px ${nonVeg ? 'rgba(239,68,68,0.25)' : 'rgba(201,168,76,0.2)'}, 0 2px 12px rgba(0,0,0,0.3)`
                      : '0 1px 4px rgba(0,0,0,0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* active top bar */}
                  {isActive && (
                    <div
                      style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                        background: nonVeg
                          ? 'linear-gradient(90deg, transparent, #ef4444, transparent)'
                          : 'linear-gradient(90deg, transparent, var(--gold), var(--gold-bright), var(--gold), transparent)',
                      }}
                    />
                  )}
                  <div className="flex items-start justify-between gap-1 mb-0.5">
                    <span
                      style={{
                        width: '7px', height: '7px', borderRadius: '50%',
                        background: dot, flexShrink: 0,
                        display: 'inline-block', marginTop: '3px',
                        boxShadow: isActive ? `0 0 6px ${dot}88` : 'none',
                      }}
                    />
                    <div className="flex items-center gap-1">
                      {totalSel > 0 && (
                        <span
                          style={{
                            fontSize: '0.6rem', fontWeight: 800, lineHeight: 1,
                            padding: '2px 5px', borderRadius: '999px',
                            background: isActive ? accentColor : 'rgba(201,168,76,0.18)',
                            color: isActive ? (nonVeg ? '#fff' : '#0a0a0a') : 'var(--gold)',
                            fontFamily: 'Inter, sans-serif',
                            flexShrink: 0,
                          }}
                        >
                          {totalSel}
                        </span>
                      )}
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: '0.72rem', fontWeight: isActive ? 700 : 600, lineHeight: 1.25,
                      color: isActive
                        ? nonVeg ? '#fca5a5' : 'var(--gold-light)'
                        : 'var(--text-primary)',
                      fontFamily: 'Inter, sans-serif',
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      marginBottom: '0.2rem',
                    }}
                  >
                    {sec.section}
                  </p>
                  <p
                    style={{
                      fontSize: '0.6rem',
                      color: isActive
                        ? nonVeg ? 'rgba(252,165,165,0.7)' : 'var(--gold-dim)'
                        : 'var(--text-muted)',
                      fontFamily: 'Inter, sans-serif', letterSpacing: '0.01em',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}
                  >
                    {sectionCrockery(sec.section)}
                  </p>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Three-panel body */}
      <div
        className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4"
        style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}
      >

        {/* LEFT: category list (desktop only) */}
        <div
          className="hidden md:flex flex-col rounded-2xl overflow-hidden"
          style={{
            width: '13.5rem', minWidth: '13.5rem', maxWidth: '13.5rem',
            position: 'sticky', top: STICKY_TOP, flexShrink: 0,
            background: 'var(--surface-2)',
            border: '1px solid var(--border-soft)',
            boxShadow: '0 4px 32px rgba(0,0,0,0.35)',
            maxHeight: PANEL_H,
            overflow: 'hidden',
          }}
        >
          {/* sidebar header */}
          <div
            style={{
              flexShrink: 0, padding: '0.75rem 1rem 0.65rem',
              background: 'var(--surface-3)',
              borderBottom: '1px solid var(--border-soft)',
            }}
          >
            <p
              style={{
                fontSize: '0.6rem', fontWeight: 900, letterSpacing: '0.22em',
                textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'Inter, sans-serif',
              }}
            >
              Categories
            </p>
          </div>

          <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '0.4rem 0' }}>
            {loading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="mx-3 my-1.5 h-8 rounded-lg animate-pulse"
                    style={{ background: 'var(--surface-4)' }}
                  />
                ))
              : sections.filter(sec => !sec._isAddon).map((sec, idx) => {
                  const realIdx   = sections.indexOf(sec)
                  const selCount  = sec.items.filter((_, ii) => selected[itemKey(realIdx, ii)] > 0).length
                  // also count selected addon items for this section name
                  const addonSelCount = sections.reduce((acc, s, si) => {
                    if (!s._isAddon || s.section !== sec.section) return acc
                    return acc + s.items.filter((_, ii) => selected[itemKey(si, ii)] > 0).length
                  }, 0)
                  const totalSel  = selCount + addonSelCount
                  const isActive  = activeSection === realIdx
                  const nonVeg    = isNonVegSection(sec.section)
                  const dotColor  = sectionIcon(sec.section)
                  const accentClr = nonVeg ? '#ef4444' : 'var(--gold)'
                  const textColor = isActive
                    ? nonVeg ? '#fca5a5' : 'var(--gold-light)'
                    : 'var(--text-secondary)'
                  return (
                    <div key={realIdx}>
                    <button
                      onClick={() => switchSection(realIdx)}
                      className="flex items-center gap-2.5 w-full"
                      style={{
                        padding: '0.5rem 0.85rem 0.5rem 0.75rem',
                        textAlign: 'left',
                        background: isActive
                          ? nonVeg ? 'rgba(239,68,68,0.13)' : 'rgba(201,168,76,0.1)'
                          : 'transparent',
                        borderLeft: `2.5px solid ${isActive ? accentClr : 'transparent'}`,
                        transition: 'all 0.13s ease',
                      }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                    >
                      {/* colored dot */}
                      <span
                        style={{
                          width: '7px', height: '7px', borderRadius: '50%',
                          background: dotColor, flexShrink: 0,
                          boxShadow: isActive ? `0 0 5px ${dotColor}88` : 'none',
                          transition: 'box-shadow 0.13s',
                        }}
                      />
                      {/* label */}
                      <span
                        style={{
                          flex: 1, minWidth: 0,
                          fontSize: '0.72rem', lineHeight: 1.3,
                          color: textColor,
                          fontWeight: isActive ? 700 : 400,
                          fontFamily: 'Inter, sans-serif',
                          display: '-webkit-box', WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}
                      >
                        {sec.section}
                      </span>
                      {/* selected badge */}
                      {totalSel > 0 && (
                        <span
                          style={{
                            flexShrink: 0, fontSize: '0.6rem', fontWeight: 800,
                            padding: '1px 5px', borderRadius: '999px',
                            background: isActive ? accentClr : 'rgba(201,168,76,0.18)',
                            color: isActive ? (nonVeg ? '#fff' : '#0a0a0a') : 'var(--gold)',
                            fontFamily: 'Inter, sans-serif',
                          }}
                        >
                          {totalSel}
                        </span>
                      )}
                    </button>
                    </div>
                  )
                })
            }
          </nav>
        </div>

        {/* CENTRE: items panel */}
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
          {/* Section / search header */}
          {!loading && (currentSection || isGlobalSearch) && (
            <div
              style={{
                flexShrink: 0,
                background: isGlobalSearch
                  ? 'rgba(201,168,76,0.06)'
                  : isNonVegSection(currentSection.section)
                    ? 'rgba(239,68,68,0.1)'
                    : 'var(--surface-3)',
                borderBottom: `1px solid ${
                  isGlobalSearch
                    ? 'rgba(201,168,76,0.18)'
                    : isNonVegSection(currentSection?.section)
                      ? 'rgba(239,68,68,0.18)'
                      : 'var(--border-soft)'
                }`,
                position: 'relative', overflow: 'hidden',
              }}
            >
              {/* accent top-line */}
              {!isGlobalSearch && (
                <div
                  style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                    background: isNonVegSection(currentSection?.section)
                      ? 'linear-gradient(90deg, transparent, #ef4444 30%, #ef4444 70%, transparent)'
                      : 'linear-gradient(90deg, transparent, var(--gold) 30%, var(--gold-bright) 50%, var(--gold) 70%, transparent)',
                  }}
                />
              )}
              <div className="flex items-center gap-3 px-5 py-3.5">
                {isGlobalSearch ? (
                  <>
                    <svg className="w-4 h-4 shrink-0" style={{ color: 'var(--gold)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                    </svg>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gold-light)', fontFamily: 'Inter, sans-serif', lineHeight: 1.3 }}>
                        Results for &ldquo;{searchQuery}&rdquo;
                      </p>
                      <p style={{ fontSize: '0.68rem', marginTop: '2px', color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>
                        {displayItems.length} {displayItems.length === 1 ? 'dish' : 'dishes'} across all categories
                      </p>
                    </div>
                    <button
                      onClick={() => setSearch('')}
                      style={{
                        fontSize: '0.7rem', padding: '3px 10px', borderRadius: '8px',
                        color: 'var(--gold)', border: '1px solid rgba(201,168,76,0.3)',
                        fontFamily: 'Inter, sans-serif', background: 'transparent', cursor: 'pointer',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      Clear
                    </button>
                  </>
                ) : (
                  <>
                    {/* colored dot */}
                    <span
                      style={{
                        width: '10px', height: '10px', borderRadius: '50%',
                        flexShrink: 0, display: 'inline-block',
                        background: sectionIcon(currentSection.section),
                        boxShadow: `0 0 10px ${sectionIcon(currentSection.section)}88`,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p
                          style={{
                            fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.25,
                            color: isNonVegSection(currentSection.section) ? '#fca5a5' : 'var(--gold-light)',
                            fontFamily: 'Inter, sans-serif',
                            display: '-webkit-box', WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical', overflow: 'hidden',
                          }}
                        >
                          {currentSection.section}
                        </p>
                      </div>
                      <p style={{ fontSize: '0.65rem', marginTop: '2px', color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>
                        {sectionCrockery(currentSection.section)}
                      </p>
                    </div>
                    {/* selected / total badge */}
                    <div
                      style={{
                        flexShrink: 0, textAlign: 'right',
                        fontSize: '0.65rem', fontFamily: 'Inter, sans-serif',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <span style={{
                        fontWeight: 700,
                        color: isNonVegSection(currentSection.section) ? '#fca5a5' : 'var(--gold)',
                        fontSize: '0.85rem',
                      }}>
                        {
                          currentSection.items.filter((_, ii) => selected[itemKey(activeSection, ii)] > 0).length
                          + addonDisplayItems.filter(it => selected[itemKey(it._si, it._ii)] > 0).length
                        }
                      </span>
                      <span style={{ margin: '0 2px' }}>/</span>
                      {currentSection.items.length + addonDisplayItems.length}
                      <br />
                      selected
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Scrollable grid */}
          <div
            ref={contentRef}
            style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '1rem' }}
          >
            {loading ? (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-28 rounded-xl animate-pulse"
                    style={{ background: 'var(--surface-3)' }}
                  />
                ))}
              </div>
            ) : !currentSection ? (
              <div
                className="flex items-center justify-center h-full text-sm"
                style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}
              >
                Select a category
              </div>
            ) : displayItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <svg className="w-8 h-8" style={{ color: 'var(--text-dim)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
                <p className="text-sm font-medium" style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>No dishes found</p>
                <button
                  onClick={() => setSearch('')}
                  className="text-xs"
                  style={{ color: 'var(--gold)', fontFamily: 'Inter, sans-serif' }}
                >
                  Clear search
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-3" style={{ alignItems: 'stretch' }}>
                  {displayItems.map(item => (
                    <div key={`${item._si}__${item._ii}`} className="flex flex-col">
                      {isGlobalSearch && (
                        <div className="flex items-center gap-1.5 mb-1.5 px-0.5">
                          <span style={{
                            width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0, display: 'inline-block',
                            background: sectionIcon(item._sectionName),
                          }} />
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'Inter,sans-serif', letterSpacing: '0.05em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item._sectionName}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <MenuItemCard
                          key={item._ii}
                          item={item}
                          secIdx={item._si}
                          itemIdx={item._ii}
                          qty={selected[itemKey(item._si, item._ii)] ?? 0}
                          opts={itemOpts[itemKey(item._si, item._ii)] ?? {}}
                          sectionName={item._sectionName}
                          isAddon={false}
                          onAdd={addItem}
                          onRemove={removeItem}
                          onOptsChange={updateOpts}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Addon items inline below dotted divider */}
                {addonDisplayItems.length > 0 && (
                  <>
                    {/* Dotted divider with label */}
                    <div style={{ margin: '1.25rem 0 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ flex: 1, borderTop: '2px dashed rgba(201,168,76,0.25)' }} />
                      <span style={{
                        fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.18em',
                        textTransform: 'uppercase', color: 'var(--gold-dim)',
                        fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap',
                        padding: '2px 8px', borderRadius: '999px',
                        background: 'rgba(201,168,76,0.07)',
                        border: '1px dashed rgba(201,168,76,0.25)',
                      }}>
                        Extras from {addonLabel}
                      </span>
                      <div style={{ flex: 1, borderTop: '2px dashed rgba(201,168,76,0.25)' }} />
                    </div>
                    <div className="grid grid-cols-2 xl:grid-cols-3 gap-3" style={{ alignItems: 'stretch' }}>
                      {addonDisplayItems.map(item => (
                        <div key={`${item._si}__${item._ii}`} className="flex flex-col">
                          <div className="flex-1">
                            <MenuItemCard
                              item={item}
                              secIdx={item._si}
                              itemIdx={item._ii}
                              qty={selected[itemKey(item._si, item._ii)] ?? 0}
                              opts={itemOpts[itemKey(item._si, item._ii)] ?? {}}
                              sectionName={item._sectionName}
                              isAddon={true}
                              onAdd={addItem}
                              onRemove={removeItem}
                              onOptsChange={updateOpts}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* RIGHT: order sidebar */}
        <div
          className="hidden xl:flex flex-col rounded-2xl overflow-hidden"
          style={{
            width: '17rem', minWidth: '17rem', maxWidth: '17rem',
            position: 'sticky', top: STICKY_TOP, flexShrink: 0,
          }}
        >
          <OrderSidebar
            orderList={orderList}
            onReorder={reorderList}
            onRemove={removeFromSidebar}
            opts={itemOpts}
            sections={sections}
            selected={selected}
            guestCount={guestCount}
            eventName={saved.occasion}
            submitting={submitting}
            onSubmit={handleSubmit}
          />
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div
        className="xl:hidden sticky bottom-0 px-4 pb-4 pt-2"
        style={{ background: 'linear-gradient(to top, var(--surface-1) 70%, transparent)' }}
      >
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="btn-gold w-full py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {submitting ? 'Submitting…' : `Go To Services${totalSelected > 0 ? ` (+${totalSelected} extras)` : ''}`}
          {!submitting && (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
