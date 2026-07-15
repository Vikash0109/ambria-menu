import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { api } from '../lib/api.js'
import { cx, FORM_KEY } from '../lib/utils.js'
import { occasions } from '../constants/fallbackMenu.js'
import Navbar from '../components/Navbar.jsx'
import { Section, Field, inputCx } from '../components/ui/FormElements.jsx'

const AMBRIA_VENUES = [
  'Ambria Exotica – Samalka, New Delhi',
  'Ambria Exotica – Dwarka Link Road, New Delhi',
  'Ambria Pushpanjali – Dwarka, New Delhi',
  'Ambria Pushpanjali Farms – New Delhi',
  'Ambria Grand Ballroom – Samalka, New Delhi',
  'Ambria Lawn & Banquet – Dwarka, New Delhi',
  'Ambria Rooftop Venue – New Delhi',
  'Ambria Terrace Hall – Samalka, New Delhi',
  'Ambria Convention Centre – New Delhi',
  'Ambria Garden Venue – Dwarka, New Delhi',
]

export default function IntakeFormPage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  // Pre-fill from saved session if coming back from /menu via SPA navigation.
  // On a hard browser refresh, clear session data so the form starts empty.
  // We distinguish the two cases with a 'feast-navigated' flag set on forward navigation.
  const [form, setForm] = useState(() => {
    try {
      const isReload = window.performance
        && window.performance.getEntriesByType('navigation')[0]?.type === 'reload'
      const wasNavigated = window.sessionStorage.getItem('feast-navigated') === '1'

      if (isReload && !wasNavigated) {
        // True browser refresh — wipe everything
        window.sessionStorage.removeItem(FORM_KEY)
        window.sessionStorage.removeItem('feast-selected-items')
        window.sessionStorage.removeItem('feast-services')
        return {
          name: '', phone: '', email: '',
          guestCount: '', vegCount: '', nonVegCount: '', _foodPref: 'veg',
          occasion: '', eventDate: '', eventTime: '', venue: '',
        }
      }

      // Back-navigation from /menu — consume the flag and restore the form
      window.sessionStorage.removeItem('feast-navigated')
      const saved = JSON.parse(window.sessionStorage.getItem(FORM_KEY) || '{}')
      if (saved.occasion) {
        return {
          name:        saved.name        ?? '',
          phone:       saved.phone       ?? '',
          email:       saved.email       ?? '',
          guestCount:  saved.guestCount  ? String(saved.guestCount) : '',
          vegCount:    saved.vegCount    ?? '',
          nonVegCount: saved.nonVegCount ?? '',
          _foodPref:   saved._foodPref   ?? saved.foodPref ?? 'veg',
          occasion:    saved.occasion    ?? '',
          eventDate:   saved.eventDate   ?? '',
          eventTime:   saved.eventTime   ?? '',
          venue:       saved.venue       ?? '',
        }
      }
    } catch { /* ignore */ }
    return {
      name: '', phone: '', email: '',
      guestCount: '', vegCount: '', nonVegCount: '', _foodPref: 'veg',
      occasion: '', eventDate: '', eventTime: '', venue: '',
    }
  })
  const [errors, setErrors] = useState({})
  const [venueSuggestions, setVenueSuggestions] = useState([])
  const [venueOpen, setVenueOpen] = useState(false)
  const [venueHighlight, setVenueHighlight] = useState(-1)
  const venueHighlightRef = useRef(-1)
  const venueListRef = useRef(null)
  const venueItemRefs = useRef([])

  function setHighlight(idx) {
    venueHighlightRef.current = idx
    setVenueHighlight(idx)
  }

  useEffect(() => {
    if (venueHighlight >= 0 && venueItemRefs.current[venueHighlight]) {
      venueItemRefs.current[venueHighlight].scrollIntoView({ block: 'nearest' })
    }
  }, [venueHighlight])

  // Only wipe the saved session when coming fresh from HomePage (not on back-nav from /menu)
  // — handled by HomePage clearing it on "Plan your event" click instead

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  function handleVenueChange(value) {
    set('venue', value)
    setHighlight(-1)
    if (!value.trim()) { setVenueSuggestions([]); setVenueOpen(false); return }
    const q = value.toLowerCase()
    const matches = AMBRIA_VENUES.filter(v => v.toLowerCase().includes(q))
    setVenueSuggestions(matches)
    setVenueOpen(matches.length > 0)
  }

  function selectVenue(name) {
    set('venue', name)
    setVenueSuggestions([])
    setVenueOpen(false)
    setHighlight(-1)
  }

  function handleVenueKeyDown(e) {
    if (!venueOpen || !venueSuggestions.length) return
    const current = venueHighlightRef.current
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight((current + 1) % venueSuggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((current - 1 + venueSuggestions.length) % venueSuggestions.length)
    } else if (e.key === 'Enter') {
      if (current >= 0) { e.preventDefault(); selectVenue(venueSuggestions[current]) }
    } else if (e.key === 'Escape') {
      setVenueOpen(false)
      setHighlight(-1)
    }
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.trim())) e.phone = 'Enter a valid 10-digit phone number'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.guestCount || Number(form.guestCount) < 1) e.guestCount = 'Guest count must be at least 1'
    if (!form.occasion) e.occasion = 'Select an occasion'
    if (!form.eventDate) e.eventDate = 'Select a date'
    if (!form.eventTime) e.eventTime = 'Select a time of day'
    if (!form.venue.trim()) e.venue = 'Venue is required'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSubmitting(true)
    try {
      const guests = Number(form.guestCount)
      const vegCount = form._foodPref === 'veg' ? guests : 0
      const nonVegCount = form._foodPref === 'nonveg' ? guests : 0
      const payload = {
        name: form.name, phone: `+91${form.phone}`, email: form.email,
        guestCount: guests, vegCount, nonVegCount,
        occasion: form.occasion, eventDate: form.eventDate,
        eventTime: form.eventTime, venue: form.venue,
      }

      // If an eventId already exists in session (coming back to edit), update it
      // instead of creating a duplicate event
      let existingSession = {}
      try { existingSession = JSON.parse(window.sessionStorage.getItem(FORM_KEY) || '{}') } catch { /* */ }
      const existingEventId = existingSession.eventId

      let eventId, menuTier
      if (existingEventId) {
        // Update the existing event
        const res = await api.put(`/events/${existingEventId}`, payload)
        eventId  = existingEventId
        menuTier = res.data.menuTier ?? existingSession.menuTier
      } else {
        // Create a new event
        const res = await api.post('/events', payload)
        eventId  = res.data.eventId
        menuTier = res.data.menuTier
      }

      window.sessionStorage.setItem(FORM_KEY, JSON.stringify({
        ...form, eventId, menuTier, guestCount: guests, foodPref: form._foodPref,
      }))
      window.sessionStorage.setItem('feast-navigated', '1')
      navigate('/menu')
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Could not submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const guestCount = Number(form.guestCount) || 0
  const tier = guestCount >= 150 ? 'premium' : guestCount > 0 ? 'standard' : null

  // ── Cycling hero word ──────────────────────────────────────────────────────
  const WORDS = ['event', 'menu', 'cuisine', 'occasion']
  const [wordIdx, setWordIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setWordIdx(i => (i + 1) % WORDS.length)
        setVisible(true)
      }, 350)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-1)' }}>
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6">

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <div className="text-center mb-12">
          {/* Ornamental top line */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, transparent, var(--gold))' }} />
            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--gold)', fontFamily: 'Inter, sans-serif' }}>
              Ambria Cuisine
            </span>
            <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, var(--gold), transparent)' }} />
          </div>

          <h1
            className="text-4xl sm:text-5xl font-bold leading-tight mb-3"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}
          >
            Plan your perfect{' '}
            <span className="relative inline-block">
              <span className="invisible">{WORDS.reduce((a, b) => a.length >= b.length ? a : b)}</span>
              <span
                className="absolute inset-0 flex items-center justify-start gold-text"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(-6px)',
                  transition: 'opacity 0.3s ease, transform 0.3s ease',
                }}
              >
                {WORDS[wordIdx]}
              </span>
            </span>
          </h1>

          <p className="text-base mt-2" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
            Tell us about your event and we'll build a personalised menu for you.
          </p>
        </div>

        {/* ── Tier hint ─────────────────────────────────────────────────── */}
        {tier && (
          <div
            className="mb-8 rounded-2xl p-4 flex items-start gap-3"
            style={{
              background: tier === 'premium'
                ? 'rgba(201,168,76,0.08)'
                : 'rgba(255,255,255,0.04)',
              border: `1px solid ${tier === 'premium' ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.08)'}`,
            }}
          >
            <span className="shrink-0" style={{ color: tier === 'premium' ? 'var(--gold-light)' : 'var(--gold)' }}>
              {tier === 'premium' ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/>
                </svg>
              )}
            </span>
            <div>
              <p
                className="font-bold text-sm"
                style={{ color: tier === 'premium' ? 'var(--gold-light)' : 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}
              >
                {tier === 'premium' ? 'Premium Menu — 150+ Guests' : 'Standard Menu — Under 150 Guests'}
              </p>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
                {tier === 'premium'
                  ? "You'll get access to our premium large-event menu with gourmet and signature dishes."
                  : "You'll browse our curated standard menu, perfect for intimate gatherings."}
              </p>
            </div>
          </div>
        )}

        {/* ── Form ──────────────────────────────────────────────────────── */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-3xl overflow-hidden"
          style={{
            background: 'var(--surface-3)',
            border: '1px solid var(--border)',
            boxShadow: '0 0 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.04)',
          }}
        >
          {/* Gold top accent */}
          <div className="gold-accent-bar" />

          <div className="p-6 sm:p-8 space-y-8">

            <Section title="Your Details">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full Name" error={errors.name}>
                  <input
                    type="text"
                    placeholder="e.g. Your Name"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    className={inputCx(errors.name)}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </Field>

                <Field label="Phone Number" error={errors.phone}>
                  <div
                    className="flex items-center rounded-xl overflow-hidden transition"
                    style={{
                      border: `1px solid ${errors.phone ? 'rgba(239,68,68,0.6)' : 'rgba(201,168,76,0.2)'}`,
                      background: 'var(--surface-4)',
                    }}
                    onFocus={() => {}} // handled via CSS
                  >
                    <span
                      className="px-3 py-3 text-sm font-semibold shrink-0 select-none"
                      style={{
                        color: 'var(--text-secondary)',
                        borderRight: '1px solid rgba(201,168,76,0.15)',
                        background: 'var(--surface-5)',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      +91
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      placeholder="98XXXXXXXX"
                      value={form.phone}
                      maxLength={10}
                      onChange={e => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 10)
                        set('phone', digits)
                      }}
                      className="flex-1 px-3 py-3 text-sm bg-transparent outline-none"
                      style={{ color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}
                    />
                  </div>
                </Field>

                <Field label="Email Address" error={errors.email} className="sm:col-span-2">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    className={inputCx(errors.email)}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </Field>
              </div>
            </Section>

            {/* Divider */}
            <div className="gold-divider" />

            <Section title="Guest Details">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Total Guests" error={errors.guestCount}>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 120"
                    value={form.guestCount}
                    onChange={e => set('guestCount', e.target.value)}
                    className={inputCx(errors.guestCount)}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </Field>
                <Field label="Food Preference" error={errors._foodPref}>
                  <select
                    value={form._foodPref}
                    onChange={e => {
                      const val = e.target.value
                      set('_foodPref', val)
                      set('vegCount', val === 'veg' ? form.guestCount : '0')
                      set('nonVegCount', val === 'nonveg' ? form.guestCount : '0')
                    }}
                    className={inputCx(errors._foodPref)}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <option value="veg">Vegetarian only</option>
                    <option value="nonveg">Non-Veg only</option>
                  </select>
                </Field>
              </div>
            </Section>

            {/* Divider */}
            <div className="gold-divider" />

            <Section title="Event Details">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Occasion" error={errors.occasion}>
                  <select
                    value={form.occasion}
                    onChange={e => set('occasion', e.target.value)}
                    className={inputCx(errors.occasion)}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <option value="">Select occasion</option>
                    {occasions.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </Field>

                <Field label="Event Date" error={errors.eventDate}>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={form.eventDate}
                    onChange={e => set('eventDate', e.target.value)}
                    className={inputCx(errors.eventDate)}
                    style={{ fontFamily: 'Inter, sans-serif', colorScheme: 'dark' }}
                  />
                </Field>

                <Field label="Time of Day" error={errors.eventTime}>
                  <select
                    value={form.eventTime}
                    onChange={e => set('eventTime', e.target.value)}
                    className={inputCx(errors.eventTime)}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <option value="">Select time</option>
                    <option value="Morning (7am – 11am)">Morning (7am – 11am)</option>
                    <option value="Lunch (11am – 3pm)">Lunch (11am – 3pm)</option>
                    <option value="Evening (3pm – 7pm)">Evening (3pm – 7pm)</option>
                    <option value="Dinner (7pm – 11pm)">Dinner (7pm – 11pm)</option>
                    <option value="Late Night (11pm+)">Late Night (11pm+)</option>
                  </select>
                </Field>

                <Field label="Venue / Location" error={errors.venue} className="sm:col-span-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Ambria Exotica, New Delhi"
                      value={form.venue}
                      onChange={e => handleVenueChange(e.target.value)}
                      onKeyDown={handleVenueKeyDown}
                      onBlur={() => setTimeout(() => setVenueOpen(false), 150)}
                      onFocus={() => venueSuggestions.length > 0 && setVenueOpen(true)}
                      autoComplete="off"
                      aria-autocomplete="list"
                      aria-expanded={venueOpen}
                      className={inputCx(errors.venue)}
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                    {venueOpen && venueSuggestions.length > 0 && (
                      <ul
                        ref={venueListRef}
                        className="absolute z-50 left-0 right-0 mt-1 rounded-xl overflow-hidden max-h-52 overflow-y-auto"
                        style={{
                          background: 'var(--surface-5)',
                          border: '1px solid var(--border)',
                          boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
                        }}
                      >
                        {venueSuggestions.map((s, i) => (
                          <li
                            key={i}
                            ref={el => { venueItemRefs.current[i] = el }}
                            onMouseDown={() => selectVenue(s)}
                            onMouseEnter={() => setHighlight(i)}
                            className="px-4 py-2.5 text-sm cursor-pointer transition"
                            style={{
                              color: i === venueHighlight ? 'var(--gold-light)' : 'var(--text-secondary)',
                              background: i === venueHighlight ? 'rgba(201,168,76,0.1)' : 'transparent',
                              borderBottom: '1px solid rgba(255,255,255,0.04)',
                              fontFamily: 'Inter, sans-serif',
                            }}
                          >
                            {s}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </Field>
              </div>
            </Section>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="btn-gold w-full py-4 rounded-2xl text-base disabled:opacity-60 disabled:cursor-wait disabled:transform-none"
              style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.06em' }}
            >
              {submitting ? 'Saving your event…' : 'Continue →'}
            </button>
          </div>
        </form>

        {/* Bottom ornament */}
        <div className="flex items-center justify-center gap-3 mt-8 opacity-40">
          <div className="h-px w-12" style={{ background: 'linear-gradient(90deg, transparent, var(--gold-dim))' }} />
          <span style={{ color: 'var(--gold-dim)', fontSize: '0.6rem', letterSpacing: '0.3em', fontFamily: 'Inter, sans-serif' }}>
            AMBRIA CUISINE
          </span>
          <div className="h-px w-12" style={{ background: 'linear-gradient(90deg, var(--gold-dim), transparent)' }} />
        </div>
      </div>
    </div>
  )
}
