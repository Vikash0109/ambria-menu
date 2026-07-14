import Event from '../models/Event.js'
import User from '../models/User.js'

// ── Get all events ────────────────────────────────────────────────────────────
// GET /api/admin/events
export async function getAllEvents(req, res) {
  try {
    const { status, tier } = req.query
    const query = {}
    if (status && ['pending', 'confirmed', 'cancelled'].includes(status)) query.status = status
    if (tier && ['standard', 'premium'].includes(tier)) query.menuTier = tier

    const events = await Event.find(query)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .lean()

    return res.json({ events, total: events.length })
  } catch (err) {
    console.error('getAllEvents error:', err)
    return res.status(500).json({ message: 'Server error.' })
  }
}

// ── Update event status / admin notes ────────────────────────────────────────
// PATCH /api/admin/events/:id
export async function updateEventStatus(req, res) {
  try {
    const { status, adminNotes } = req.body ?? {}

    if (status && !['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' })
    }

    const updates = {}
    if (status) updates.status = status
    if (adminNotes !== undefined) updates.adminNotes = String(adminNotes).trim()

    const event = await Event.findByIdAndUpdate(req.params.id, updates, { new: true })
    if (!event) return res.status(404).json({ message: 'Event not found.' })

    return res.json({ event })
  } catch (err) {
    console.error('updateEventStatus error:', err)
    return res.status(500).json({ message: 'Server error.' })
  }
}

// ── Get all registered users ──────────────────────────────────────────────────
// GET /api/admin/users
export async function getAllUsers(req, res) {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean()
    return res.json({ users, total: users.length })
  } catch (err) {
    console.error('getAllUsers error:', err)
    return res.status(500).json({ message: 'Server error.' })
  }
}

// ── Get dashboard stats ───────────────────────────────────────────────────────
// GET /api/admin/stats
export async function getDashboardStats(req, res) {
  try {
    const [totalEvents, pendingEvents, confirmedEvents, cancelledEvents, totalUsers] =
      await Promise.all([
        Event.countDocuments(),
        Event.countDocuments({ status: 'pending' }),
        Event.countDocuments({ status: 'confirmed' }),
        Event.countDocuments({ status: 'cancelled' }),
        User.countDocuments(),
      ])

    return res.json({
      totalEvents,
      pendingEvents,
      confirmedEvents,
      cancelledEvents,
      totalUsers,
    })
  } catch (err) {
    console.error('getDashboardStats error:', err)
    return res.status(500).json({ message: 'Server error.' })
  }
}

// ── Update admin profile / password ──────────────────────────────────────────
// PUT /api/admin/profile
export async function updateAdminProfile(req, res) {
  // env-based accounts — profile updates not supported
  return res.status(400).json({ message: 'Profile updates are not available for env-based accounts.' })
}

// ── Get all callback requests ─────────────────────────────────────────────────
// GET /api/admin/callbacks
import Callback from '../models/Callback.js'

export async function getCallbacks(req, res) {
  try {
    const { status } = req.query
    const query = {}
    if (status && ['new', 'contacted', 'converted', 'closed'].includes(status)) {
      query.status = status
    }
    const callbacks = await Callback.find(query).sort({ createdAt: -1 }).lean()
    return res.json({ callbacks, total: callbacks.length })
  } catch (err) {
    console.error('getCallbacks error:', err)
    return res.status(500).json({ message: 'Server error.' })
  }
}

// ── Update callback status / notes ───────────────────────────────────────────
// PATCH /api/admin/callbacks/:id
export async function updateCallbackStatus(req, res) {
  try {
    const { status, notes } = req.body ?? {}

    if (status && !['new', 'contacted', 'converted', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' })
    }

    const updates = {}
    if (status) updates.status = status
    if (notes !== undefined) updates.notes = String(notes).trim()

    const cb = await Callback.findByIdAndUpdate(req.params.id, updates, { new: true })
    if (!cb) return res.status(404).json({ message: 'Callback not found.' })

    return res.json({ callback: cb })
  } catch (err) {
    console.error('updateCallbackStatus error:', err)
    return res.status(500).json({ message: 'Server error.' })
  }
}
