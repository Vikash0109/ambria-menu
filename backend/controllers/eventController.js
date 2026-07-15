import Event from '../models/Event.js'

// ── Helpers ───────────────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/

function sanitizeStr(v, max = 200) {
  return String(v ?? '').trim().slice(0, max)
}

function sanitizeItems(raw) {
  if (!Array.isArray(raw)) return []
  return raw.slice(0, 200).map((item, idx) => ({
    id:           sanitizeStr(item.id,       100),
    name:         sanitizeStr(item.name,     200),
    category:     sanitizeStr(item.category, 100),
    quantity:     Math.max(1, Math.min(99, Number(item.quantity) || 1)),
    spiceLevel:   sanitizeStr(item.spiceLevel,  50),
    servingSize:  sanitizeStr(item.servingSize, 50),
    priority:     item.priority ? Math.max(1, Math.min(3, Number(item.priority))) : null,
    notes:        sanitizeStr(item.notes, 500),
    servingOrder: Number(item.servingOrder ?? idx),
  }))
}

// ── Submit intake form ────────────────────────────────────────────────────────
// POST /api/events
export async function createEvent(req, res) {
  try {
    const {
      name, phone, email,
      guestCount, vegCount, nonVegCount,
      occasion, eventDate, eventTime, venue,
    } = req.body ?? {}

    // Required field check
    if (!name || !phone || !email || !guestCount || !occasion || !eventDate || !venue) {
      return res.status(400).json({ message: 'All required fields must be provided.' })
    }

    // Format validation
    const cleanEmail = sanitizeStr(email, 254).toLowerCase()
    if (!EMAIL_RE.test(cleanEmail)) {
      return res.status(400).json({ message: 'Invalid email address.' })
    }

    const cleanPhone = sanitizeStr(phone, 30)
    if (!PHONE_RE.test(cleanPhone)) {
      return res.status(400).json({ message: 'Invalid phone number.' })
    }

    const guests = Number(guestCount)
    if (!Number.isInteger(guests) || guests < 1 || guests > 100000) {
      return res.status(400).json({ message: 'Guest count must be a whole number between 1 and 100,000.' })
    }

    const veg    = Math.max(0, Number(vegCount)    || 0)
    const nonVeg = Math.max(0, Number(nonVegCount) || 0)

    if (veg + nonVeg > guests) {
      return res.status(400).json({ message: 'Veg + non-veg count cannot exceed total guests.' })
    }

    const menuTier = guests >= 150 ? 'premium' : 'standard'

    const event = await Event.create({
      userId:    req.user?.role === 'user' ? req.user.id : null,
      name:      sanitizeStr(name, 100),
      phone:     cleanPhone,
      email:     cleanEmail,
      guestCount: guests,
      vegCount:   veg,
      nonVegCount: nonVeg,
      occasion:  sanitizeStr(occasion, 100),
      eventDate: sanitizeStr(eventDate, 20),
      eventTime: sanitizeStr(eventTime ?? '', 50),
      venue:     sanitizeStr(venue, 200),
      menuTier,
    })

    return res.status(201).json({ eventId: event._id, menuTier, message: 'Event registered.' })
  } catch (err) {
    console.error('createEvent error:', err)
    return res.status(500).json({ message: 'Server error.' })
  }
}

// ── Update an existing event (edit form re-submit) ───────────────────────────
// PUT /api/events/:id
export async function updateEvent(req, res) {
  try {
    const {
      name, phone, email,
      guestCount, vegCount, nonVegCount,
      occasion, eventDate, eventTime, venue,
    } = req.body ?? {}

    if (!name || !phone || !email || !guestCount || !occasion || !eventDate || !venue) {
      return res.status(400).json({ message: 'All required fields must be provided.' })
    }

    const cleanEmail = sanitizeStr(email, 254).toLowerCase()
    if (!EMAIL_RE.test(cleanEmail)) {
      return res.status(400).json({ message: 'Invalid email address.' })
    }

    const cleanPhone = sanitizeStr(phone, 30)
    if (!PHONE_RE.test(cleanPhone)) {
      return res.status(400).json({ message: 'Invalid phone number.' })
    }

    const guests = Number(guestCount)
    if (!Number.isInteger(guests) || guests < 1 || guests > 100000) {
      return res.status(400).json({ message: 'Guest count must be a whole number between 1 and 100,000.' })
    }

    const veg    = Math.max(0, Number(vegCount)    || 0)
    const nonVeg = Math.max(0, Number(nonVegCount) || 0)

    const menuTier = guests >= 150 ? 'premium' : 'standard'

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        name:        sanitizeStr(name, 100),
        phone:       cleanPhone,
        email:       cleanEmail,
        guestCount:  guests,
        vegCount:    veg,
        nonVegCount: nonVeg,
        occasion:    sanitizeStr(occasion, 100),
        eventDate:   sanitizeStr(eventDate, 20),
        eventTime:   sanitizeStr(eventTime ?? '', 50),
        venue:       sanitizeStr(venue, 200),
        menuTier,
      },
      { new: true }
    )

    if (!event) return res.status(404).json({ message: 'Event not found.' })

    return res.json({ eventId: event._id, menuTier, message: 'Event updated.' })
  } catch (err) {
    console.error('updateEvent error:', err)
    return res.status(500).json({ message: 'Server error.' })
  }
}
// POST /api/events/:id/order
export async function saveOrder(req, res) {
  try {
    const { selectedItems = [] } = req.body ?? {}

    if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
      return res.status(400).json({ message: 'Select at least one dish.' })
    }

    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ message: 'Event not found.' })

    event.selectedItems = sanitizeItems(selectedItems)
    await event.save()

    return res.json({ message: 'Order saved.', eventId: event._id })
  } catch (err) {
    console.error('saveOrder error:', err)
    return res.status(500).json({ message: 'Server error.' })
  }
}
