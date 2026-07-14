import User from '../models/User.js'
import Event from '../models/Event.js'

// ── Get own profile ───────────────────────────────────────────────────────────
// GET /api/users/profile
export async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found.' })
    return res.json({ user: user.toJSON() })
  } catch (err) {
    console.error('getProfile error:', err)
    return res.status(500).json({ message: 'Server error.' })
  }
}

// ── Update own profile ────────────────────────────────────────────────────────
// PUT /api/users/profile
export async function updateProfile(req, res) {
  try {
    const { name, phone } = req.body ?? {}
    const updates = {}
    if (name) updates.name = String(name).trim()
    if (phone) updates.phone = String(phone).trim()

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true })
    if (!user) return res.status(404).json({ message: 'User not found.' })
    return res.json({ user: user.toJSON() })
  } catch (err) {
    console.error('updateProfile error:', err)
    return res.status(500).json({ message: 'Server error.' })
  }
}

// ── Change password ───────────────────────────────────────────────────────────
// PUT /api/users/change-password
export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body ?? {}
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required.' })
    }
    if (String(newPassword).length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters.' })
    }

    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found.' })

    const match = await user.comparePassword(String(currentPassword))
    if (!match) return res.status(401).json({ message: 'Current password is incorrect.' })

    user.password = String(newPassword)
    await user.save() // triggers bcrypt pre-save hook
    return res.json({ message: 'Password updated successfully.' })
  } catch (err) {
    console.error('changePassword error:', err)
    return res.status(500).json({ message: 'Server error.' })
  }
}

// ── Get own event history ─────────────────────────────────────────────────────
// GET /api/users/events
export async function getMyEvents(req, res) {
  try {
    const events = await Event.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean()
    return res.json({ events })
  } catch (err) {
    console.error('getMyEvents error:', err)
    return res.status(500).json({ message: 'Server error.' })
  }
}
