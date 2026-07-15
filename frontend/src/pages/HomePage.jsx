import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { api } from '../lib/api.js'
import Navbar from '../components/Navbar.jsx'

// ── SVG Icon set (no emojis) ───────────────────────────────────────────────
const Icon = {
  // Amenities
  Catering: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l19-9-9 19-2-8-8-2z"/>
    </svg>
  ),
  Decor: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
    </svg>
  ),
  Music: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
    </svg>
  ),
  Seating: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  Star: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  Parking: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>
    </svg>
  ),
  // Occasions
  Rings: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/>
    </svg>
  ),
  Cake: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2 1 2 1"/><path d="M2 21h20"/><path d="M12 3v5"/><path d="M10 5l2-2 2 2"/>
    </svg>
  ),
  Briefcase: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="12"/>
    </svg>
  ),
  Heart: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  Baby: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  ),
  Diamond: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12l4 6-10 13L2 9z"/><path d="M2 9h20"/><path d="M12 22V9"/>
    </svg>
  ),
  Sparkle: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18M3 12h18M5.64 5.64l12.72 12.72M18.36 5.64L5.64 18.36"/>
    </svg>
  ),
  Fork: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="9" y1="3" x2="9" y2="21"/><path d="M6 3v6a3 3 0 0 0 6 0V3"/><line x1="15" y1="3" x2="15" y2="21"/>
    </svg>
  ),
  // Contact
  Phone: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.4 2 2 0 0 1 3.58 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  Mail: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  MapPin: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  // Footer brand mark
  Plate: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
    </svg>
  ),
}

// ── Animated counter ───────────────────────────────────────────────────────
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 1800
          const steps = 60
          const increment = target / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= target) { setCount(target); clearInterval(timer) }
            else setCount(Math.floor(current))
          }, duration / steps)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return <span ref={ref}>{count}{suffix}</span>
}

// ── Ornamental divider ─────────────────────────────────────────────────────
function OrnamentDivider({ label }) {
  return (
    <div className="flex items-center justify-center gap-4 mb-4">
      <div className="h-px w-12" style={{ background: 'linear-gradient(90deg,transparent,var(--gold))' }} />
      <span style={{ color: 'var(--gold)', fontSize: '0.6rem', letterSpacing: '0.35em', fontFamily: 'Inter,sans-serif', fontWeight: 700 }}>
        {label}
      </span>
      <div className="h-px w-12" style={{ background: 'linear-gradient(90deg,var(--gold),transparent)' }} />
    </div>
  )
}

// ── Section heading ────────────────────────────────────────────────────────
function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="text-center mb-14">
      <OrnamentDivider label={eyebrow} />
      <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-xl mx-auto text-base leading-relaxed" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter,sans-serif' }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

// ── Data ───────────────────────────────────────────────────────────────────
const STATS = [
  { value: 2000, suffix: '+', label: 'Events Catered' },
  { value: 10,   suffix: '+', label: 'Venues Available' },
  { value: 400,  suffix: '+', label: 'Guests Capacity' },
  { value: 15,   suffix: '+', label: 'Years of Excellence' },
]

const AMENITIES = [
  { IconComp: Icon.Catering, title: 'In-House Catering',  desc: 'Curated menus crafted by our executive chefs for every occasion.' },
  { IconComp: Icon.Decor,    title: 'In-House Décor',     desc: 'Full floral, lighting and thematic décor tailored to your vision.' },
  { IconComp: Icon.Music,    title: 'In-House DJ & Sound',desc: 'Professional sound systems and DJs for every mood and vibe.' },
  { IconComp: Icon.Seating,  title: 'Custom Seating',      desc: 'Modular seating arrangements from intimate to grand ballroom style.' },
  { IconComp: Icon.Star,     title: '5-Star Service',      desc: 'Uniformed staff trained to deliver a seamless luxury experience.' },
  { IconComp: Icon.Parking,  title: 'Ample Parking',       desc: 'Secure, valet-assisted parking available at all our venues.' },
]

const OCCASIONS = [
  { IconComp: Icon.Rings,     name: 'Weddings' },
  { IconComp: Icon.Cake,      name: 'Birthdays' },
  { IconComp: Icon.Briefcase, name: 'Corporate' },
  { IconComp: Icon.Heart,     name: 'Anniversaries' },
  { IconComp: Icon.Baby,      name: 'Baby Showers' },
  { IconComp: Icon.Diamond,   name: 'Engagements' },
  { IconComp: Icon.Sparkle,   name: 'Festivals' },
  { IconComp: Icon.Fork,      name: 'Private Dinners' },
]

const CONTACT_ITEMS = [
  { IconComp: Icon.Phone,  label: 'CALL US',    value: '+91 98765 00001' },
  { IconComp: Icon.Mail,   label: 'EMAIL',      value: 'events@ambriacuisine.com' },
  { IconComp: Icon.MapPin, label: 'LOCATIONS',  value: 'Samalka, Dwarka & across New Delhi' },
]

// ── Hero cycling words ─────────────────────────────────────────────────────
const HERO_WORDS = ['Weddings', 'Celebrations', 'Gatherings', 'Milestones']

// ── Contact form ───────────────────────────────────────────────────────────
// Accepts +91XXXXXXXXXX, 91XXXXXXXXXX, or 10-digit numbers (6–9 start)
const PHONE_RE = /^(?:\+91|91)?[6-9]\d{9}$/

function ContactForm() {
  const [form, setForm] = useState({ name: '', phone: '+91 ', email: '', occasion: '', message: '' })
  const [phoneError, setPhoneError] = useState('')
  const [sending, setSending] = useState(false)

  function set(k, v) { setForm(p => ({ ...p, [k]: v })) }

  function handlePhoneChange(e) {
    let raw = e.target.value
    // Always keep the +91 prefix
    if (!raw.startsWith('+91 ')) raw = '+91 '
    // Allow only digits after the prefix
    const prefix = '+91 '
    const digits = raw.slice(prefix.length).replace(/\D/g, '')
    set('phone', prefix + digits)
    if (phoneError) setPhoneError('')
  }

  function validatePhone(value) {
    const stripped = value.replace(/\s+/g, '')
    if (!stripped || stripped === '+91') return 'Phone number is required.'
    if (!PHONE_RE.test(stripped)) return 'Enter a valid 10-digit Indian mobile number.'
    return ''
  }

  function handlePhoneBlur() {
    setPhoneError(validatePhone(form.phone))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error('Full name is required.')
      return
    }
    const phoneErr = validatePhone(form.phone)
    if (phoneErr) {
      setPhoneError(phoneErr)
      return
    }
    setSending(true)
    api.post('/callbacks', {
      name:     form.name.trim(),
      phone:    form.phone.trim(),
      email:    form.email.trim(),
      occasion: form.occasion,
      message:  form.message.trim(),
    })
      .then(() => {
        toast.success("Thank you! We'll reach out to you shortly.")
        setForm({ name: '', phone: '+91 ', email: '', occasion: '', message: '' })
      })
      .catch(() => toast.error('Could not submit. Please try again.'))
      .finally(() => setSending(false))
  }

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem',
    border: '1px solid rgba(201,168,76,0.2)', background: 'var(--surface-4)',
    color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none',
    fontFamily: 'Inter,sans-serif', transition: 'border-color 0.2s,box-shadow 0.2s',
  }
  function focusStyle(e) { e.target.style.borderColor='var(--gold)'; e.target.style.boxShadow='0 0 0 3px rgba(201,168,76,0.12)' }
  function blurStyle(e)  { e.target.style.borderColor='rgba(201,168,76,0.2)'; e.target.style.boxShadow='none' }

  const labelStyle = { display:'block', fontSize:'0.72rem', letterSpacing:'0.12em', color:'var(--gold)', fontFamily:'Inter,sans-serif', fontWeight:700, marginBottom:'0.5rem' }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label style={labelStyle}>FULL NAME *</label>
          <input style={inputStyle} type="text" placeholder="e.g. Your Name"
            value={form.name} onChange={e => set('name', e.target.value)}
            onFocus={focusStyle} onBlur={blurStyle} />
        </div>
        <div>
          <label style={labelStyle}>PHONE NUMBER *</label>
          <input
            style={{
              ...inputStyle,
              borderColor: phoneError ? '#ef4444' : 'rgba(201,168,76,0.2)',
              boxShadow: phoneError ? '0 0 0 3px rgba(239,68,68,0.12)' : 'none',
            }}
            type="tel"
            placeholder="+91 98XXXXXXXX"
            value={form.phone}
            onChange={handlePhoneChange}
            onBlur={handlePhoneBlur}
            onFocus={e => {
              if (!phoneError) {
                e.target.style.borderColor = 'var(--gold)'
                e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.12)'
              }
            }}
            maxLength={14}
          />
          {phoneError && (
            <p style={{ marginTop: '0.35rem', fontSize: '0.72rem', color: '#ef4444', fontFamily: 'Inter,sans-serif' }}>
              {phoneError}
            </p>
          )}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label style={labelStyle}>EMAIL ADDRESS *</label>
          <input style={inputStyle} type="email" placeholder="you@example.com"
            value={form.email} onChange={e => set('email', e.target.value)}
            onFocus={focusStyle} onBlur={blurStyle} />
        </div>
        <div>
          <label style={labelStyle}>OCCASION</label>
          <select style={{ ...inputStyle, colorScheme: 'dark' }}
            value={form.occasion} onChange={e => set('occasion', e.target.value)}
            onFocus={focusStyle} onBlur={blurStyle}>
            <option value="">Select an occasion</option>
            {['Wedding','Birthday Party','Corporate Event','Anniversary','Festival Celebration','Private Dinner','Baby Shower','Engagement'].map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label style={labelStyle}>MESSAGE</label>
        <textarea rows={5} className="clean-field" style={{ ...inputStyle, resize: 'none', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          placeholder="Tell us about your event — expected guest count, date, any special requirements…"
          value={form.message} onChange={e => set('message', e.target.value)}
          onFocus={focusStyle} onBlur={blurStyle} />
      </div>
      <button type="submit" disabled={sending}
        className="btn-gold w-full py-4 rounded-2xl text-sm disabled:opacity-60 disabled:cursor-wait"
        style={{ fontFamily: 'Inter,sans-serif', letterSpacing: '0.08em', fontWeight: 700 }}>
        {sending ? 'SENDING…' : 'REQUEST A CALLBACK →'}
      </button>
    </form>
  )
}

// ── Main Page Component ────────────────────────────────────────────────────
export default function HomePage() {
  const [wordIdx, setWordIdx] = useState(0)
  const [wordVisible, setWordVisible] = useState(true)

  useEffect(() => {
    const iv = setInterval(() => {
      setWordVisible(false)
      setTimeout(() => { setWordIdx(i => (i + 1) % HERO_WORDS.length); setWordVisible(true) }, 380)
    }, 2400)
    return () => clearInterval(iv)
  }, [])

  return (
    <div style={{ background: 'var(--surface-1)', minHeight: '100vh' }}>
      <Navbar activeStep={null} />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '92vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(201,168,76,0.05) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)', backgroundSize: '80px 80px', pointerEvents: 'none' }} />

        <div className="max-w-4xl mx-auto px-6 text-center" style={{ position: 'relative', zIndex: 1 }}>
          <div className="inline-flex items-center gap-2 mb-8" style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '9999px', padding: '0.4rem 1rem' }}>
            <span style={{ color: 'var(--gold)', fontSize: '0.65rem', letterSpacing: '0.3em', fontFamily: 'Inter,sans-serif', fontWeight: 700 }}>AMBRIA CUISINE — NEW DELHI</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)', fontWeight: 700, lineHeight: 1.1, color: 'var(--text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Crafting Memories,
          </h1>
          <h1 style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            One{' '}
            <span style={{ position: 'relative', display: 'inline-block' }}>
              <span style={{ visibility: 'hidden' }}>{HERO_WORDS.reduce((a, b) => a.length >= b.length ? a : b)}</span>
              <span className="gold-text-anim" style={{ position: 'absolute', inset: 0, opacity: wordVisible ? 1 : 0, transform: wordVisible ? 'translateY(0)' : 'translateY(-8px)', transition: 'opacity 0.35s ease, transform 0.35s ease' }}>
                {HERO_WORDS[wordIdx]}
              </span>
            </span>
            {' '}at a Time
          </h1>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', fontFamily: 'Inter,sans-serif', maxWidth: '540px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            From intimate dinners to grand galas — explore our premium catering menus and multi-cuisine offerings, crafted fresh for every occasion.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/plan"
              className="btn-gold inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm"
              style={{ fontFamily: 'Inter,sans-serif', letterSpacing: '0.07em', fontWeight: 700, textDecoration: 'none' }}
              onClick={() => window.sessionStorage.removeItem('feast-event-form')}
            >
              PLAN YOUR EVENT →
            </Link>
            <a href="#contact" className="btn-ghost-gold inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm"
              style={{ fontFamily: 'Inter,sans-serif', letterSpacing: '0.07em', fontWeight: 600, textDecoration: 'none' }}>
              REQUEST A CALLBACK
            </a>
          </div>

          <div style={{ marginTop: '5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', opacity: 0.4 }}>
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.25em', fontFamily: 'Inter,sans-serif', color: 'var(--gold)' }}>SCROLL</span>
            <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, var(--gold), transparent)' }} />
          </div>
        </div>
      </section>

      {/* ── ABOUT / STATS ─────────────────────────────────────────────── */}
      <section style={{ background: 'var(--surface-2)', borderTop: '1px solid var(--border-soft)', borderBottom: '1px solid var(--border-soft)', padding: '5rem 1.5rem' }}>
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            eyebrow="ABOUT US"
            title="Where Every Occasion Becomes Extraordinary"
            subtitle="Ambria Cuisine brings together culinary mastery and seamless event management — delivering a premium experience at every scale, from intimate home gatherings to 400-guest celebrations."
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map(s => (
              <div key={s.label} className="luxury-card text-center py-8 px-4" style={{ borderRadius: '1.25rem' }}>
                <div className="gold-text text-4xl font-bold mb-2" style={{ fontFamily: 'Georgia,serif' }}>
                  <Counter target={s.value} suffix={s.suffix} />
                </div>
                <div style={{ fontSize: '0.72rem', letterSpacing: '0.18em', color: 'var(--text-muted)', fontFamily: 'Inter,sans-serif', fontWeight: 600, textTransform: 'uppercase' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-8 mt-14">
            <div className="luxury-card p-8" style={{ borderRadius: '1.5rem' }}>
              <div className="gold-divider mb-6" />
              <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Our Philosophy</h3>
              <p style={{ color: 'var(--text-secondary)', fontFamily: 'Inter,sans-serif', lineHeight: 1.75, fontSize: '0.92rem' }}>
                We believe great food is the heart of every celebration. Our chefs source the finest ingredients and craft every dish — from rustic comfort food to gourmet multi-course feasts — with the same dedication and passion.
              </p>
            </div>
            <div className="luxury-card p-8" style={{ borderRadius: '1.5rem' }}>
              <div className="gold-divider mb-6" />
              <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Our Promise</h3>
              <p style={{ color: 'var(--text-secondary)', fontFamily: 'Inter,sans-serif', lineHeight: 1.75, fontSize: '0.92rem' }}>
                From the first inquiry to the last dessert, we handle every detail. Our dedicated event managers, trained staff, and in-house logistics ensure your celebration unfolds exactly as you envisioned.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── OCCASIONS ─────────────────────────────────────────────────── */}
      <section style={{ padding: '5rem 1.5rem', background: 'var(--surface-1)' }}>
        <div className="max-w-5xl mx-auto">
          <SectionHeading eyebrow="OCCASIONS" title="We Cater For Every Celebration" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {OCCASIONS.map(o => (
              <div key={o.name} className="luxury-card text-center py-8 px-4"
                style={{ borderRadius: '1.25rem', cursor: 'default', transition: 'border-color 0.25s,transform 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(201,168,76,0.45)'; e.currentTarget.style.transform='translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.transform='translateY(0)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.85rem', color: 'var(--gold)' }}>
                  <o.IconComp />
                </div>
                <div style={{ fontSize: '0.75rem', letterSpacing: '0.14em', color: 'var(--text-secondary)', fontFamily: 'Inter,sans-serif', fontWeight: 600, textTransform: 'uppercase' }}>
                  {o.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AMENITIES ─────────────────────────────────────────────────── */}
      <section style={{ padding: '5rem 1.5rem', background: 'var(--surface-2)', borderTop: '1px solid var(--border-soft)', borderBottom: '1px solid var(--border-soft)' }}>
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            eyebrow="WHAT'S INCLUDED"
            title="Amenities & Facilities"
            subtitle="Everything you need for a flawless event — all under one roof."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {AMENITIES.map(a => (
              <div key={a.title} className="luxury-card p-6 flex gap-4"
                style={{ borderRadius: '1.25rem', transition: 'border-color 0.25s,box-shadow 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(201,168,76,0.4)'; e.currentTarget.style.boxShadow='0 8px 32px rgba(0,0,0,0.4)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.boxShadow='none' }}>
                <div style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '0.1rem' }}>
                  <a.IconComp />
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem', fontSize: '0.95rem' }}>{a.title}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontFamily: 'Inter,sans-serif', lineHeight: 1.6 }}>{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MENU TIERS ────────────────────────────────────────────────── */}
      <section style={{ padding: '5rem 1.5rem', background: 'var(--surface-1)' }}>
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            eyebrow="OUR MENUS"
            title="Two Tiers of Culinary Excellence"
            subtitle="Whether you're hosting an intimate gathering or a grand gala, we have a menu crafted for you."
          />
          <div className="grid md:grid-cols-2 gap-6">
            {/* Standard */}
            <div className="luxury-card overflow-hidden" style={{ borderRadius: '1.5rem' }}>
              <div className="gold-accent-bar" />
              <div className="p-8">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p style={{ fontSize: '0.65rem', letterSpacing: '0.3em', color: 'var(--gold)', fontFamily: 'Inter,sans-serif', fontWeight: 700, marginBottom: '0.4rem' }}>STANDARD MENU</p>
                    <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Up to 149 Guests</h3>
                  </div>
                  {/* Plate icon instead of emoji */}
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/>
                    </svg>
                  </div>
                </div>
                <div className="gold-divider mb-5" />
                <ul className="space-y-2 mb-7">
                  {['Curated veg & non-veg starters','Rich main course selection','Signature dessert spread','Refreshing beverages & chaas','Live counters available'].map(item => (
                    <li key={item} className="flex items-center gap-2" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontFamily: 'Inter,sans-serif' }}>
                      <span style={{ color: 'var(--gold)', fontSize: '0.6rem' }}>◆</span> {item}
                    </li>
                  ))}
                </ul>
                <Link to="/plan" className="btn-ghost-gold w-full flex items-center justify-center py-3 rounded-xl text-sm"
                  style={{ fontFamily: 'Inter,sans-serif', letterSpacing: '0.07em', fontWeight: 600, textDecoration: 'none' }}>
                  EXPLORE STANDARD →
                </Link>
              </div>
            </div>

            {/* Premium */}
            <div style={{ background: 'linear-gradient(145deg, rgba(201,168,76,0.12) 0%, rgba(26,26,26,0.98) 50%, rgba(201,168,76,0.06) 100%)', border: '1px solid rgba(201,168,76,0.35)', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 0 40px rgba(201,168,76,0.08)' }}>
              <div className="gold-accent-bar" />
              <div className="p-8">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p style={{ fontSize: '0.65rem', letterSpacing: '0.3em', color: 'var(--gold)', fontFamily: 'Inter,sans-serif', fontWeight: 700, marginBottom: '0.4rem' }}>PREMIUM MENU</p>
                    <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>150+ Guests</h3>
                  </div>
                  {/* Crown / star icon instead of emoji */}
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-light)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  </div>
                </div>
                <div className="gold-divider mb-5" />
                <ul className="space-y-2 mb-7">
                  {['Gourmet & signature dishes','Truffle, saffron & specialty items','Multi-cuisine live stations','Fine crockery & linen service','Dedicated event manager'].map(item => (
                    <li key={item} className="flex items-center gap-2" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontFamily: 'Inter,sans-serif' }}>
                      <span style={{ color: 'var(--gold)', fontSize: '0.6rem' }}>◆</span> {item}
                    </li>
                  ))}
                </ul>
                <Link to="/plan" className="btn-gold w-full flex items-center justify-center py-3 rounded-xl text-sm"
                  style={{ fontFamily: 'Inter,sans-serif', letterSpacing: '0.07em', fontWeight: 700, textDecoration: 'none' }}>
                  EXPLORE PREMIUM →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM ──────────────────────────────────────────────── */}
      <section id="contact" style={{ padding: '5rem 1.5rem', background: 'var(--surface-2)', borderTop: '1px solid var(--border-soft)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left — copy */}
            <div>
              <OrnamentDivider label="GET IN TOUCH" />
              <h2 className="text-3xl sm:text-4xl font-bold mb-5" style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                Ready to Begin Your<br />
                <span className="gold-text">Ambria Story?</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontFamily: 'Inter,sans-serif', lineHeight: 1.75, fontSize: '0.93rem', marginBottom: '2rem' }}>
                Tell us about your event and we'll help you plan the perfect celebration — from menu to milestone. Our team will get back to you within 24 hours.
              </p>
              <div className="space-y-4">
                {CONTACT_ITEMS.map(c => (
                  <div key={c.label} className="flex items-start gap-4">
                    <div style={{ width: '42px', height: '42px', borderRadius: '10px', flexShrink: 0, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
                      <c.IconComp />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.6rem', letterSpacing: '0.25em', color: 'var(--gold)', fontFamily: 'Inter,sans-serif', fontWeight: 700, marginBottom: '0.2rem' }}>{c.label}</p>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontFamily: 'Inter,sans-serif' }}>{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — form card */}
            <div className="rounded-3xl overflow-hidden" style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', boxShadow: '0 0 60px rgba(0,0,0,0.5)' }}>
              <div className="gold-accent-bar" />
              <div className="p-8">
                <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Send Us a Message</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'Inter,sans-serif', marginBottom: '1.5rem' }}>We'll respond within 24 hours.</p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer style={{ background: 'var(--surface-0)', borderTop: '1px solid var(--border-soft)', padding: '4rem 1.5rem 2rem' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-10 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg,#c9a84c,#f0d060)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a0a0a', flexShrink: 0 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 11l19-9-9 19-2-8-8-2z"/>
                  </svg>
                </div>
                <span style={{ fontFamily: 'Georgia,serif', fontWeight: 700, letterSpacing: '2px', color: 'var(--gold)', fontSize: '0.95rem' }}>AMBRIA CUISINE</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontFamily: 'Inter,sans-serif', lineHeight: 1.7 }}>
                Premium catering & event management across New Delhi. Elegance served on every table.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{ fontSize: '0.65rem', letterSpacing: '0.25em', color: 'var(--gold)', fontFamily: 'Inter,sans-serif', fontWeight: 700, marginBottom: '1rem' }}>QUICK LINKS</h4>
              <ul className="space-y-2">
                {[{ label: 'Plan Your Event', to: '/plan' }, { label: 'Our Menu', to: '/plan' }, { label: 'Services', to: '/plan' }, { label: 'Staff Login', to: '/admin/login' }].map(l => (
                  <li key={l.label}>
                    <Link to={l.to}
                      onClick={() => l.to === '/plan' && window.sessionStorage.removeItem('feast-event-form')}
                      style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: 'Inter,sans-serif', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.target.style.color = 'var(--gold-light)'}
                      onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 style={{ fontSize: '0.65rem', letterSpacing: '0.25em', color: 'var(--gold)', fontFamily: 'Inter,sans-serif', fontWeight: 700, marginBottom: '1rem' }}>CONTACT</h4>
              <ul className="space-y-2">
                {['+91 98765 00001', 'events@ambriacuisine.com', 'Samalka, New Delhi', 'Dwarka, New Delhi'].map(c => (
                  <li key={c} style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: 'Inter,sans-serif' }}>{c}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="gold-divider mb-6" />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <p style={{ color: 'var(--text-dim)', fontSize: '0.75rem', fontFamily: 'Inter,sans-serif' }}>
              © {new Date().getFullYear()} Ambria Cuisine. All rights reserved.
            </p>
            <div className="flex items-center gap-3 opacity-50">
              <div className="h-px w-10" style={{ background: 'var(--gold-muted)' }} />
              <span style={{ color: 'var(--gold-muted)', fontSize: '0.55rem', letterSpacing: '0.3em', fontFamily: 'Inter,sans-serif' }}>AMBRIA CUISINE</span>
              <div className="h-px w-10" style={{ background: 'var(--gold-muted)' }} />
            </div>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.75rem', fontFamily: 'Inter,sans-serif' }}>
              Crafted with care for every occasion.
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}
