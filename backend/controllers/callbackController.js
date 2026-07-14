import Callback from '../models/Callback.js'

// ── Submit a callback request (public) ───────────────────────────────────────
// POST /api/callbacks
export async function createCallback(req, res) {
  try {
    const { name, phone, email, occasion, message } = req.body ?? {}

    if (!name?.trim())  return res.status(400).json({ message: 'Name is required.' })
    if (!phone?.trim()) return res.status(400).json({ message: 'Phone number is required.' })

    const cb = await Callback.create({
      name:     name.trim(),
      phone:    phone.trim(),
      email:    email?.trim()   ?? '',
      occasion: occasion?.trim() ?? '',
      message:  message?.trim()  ?? '',
    })

    return res.status(201).json({ message: 'Callback request received.', callback: cb })
  } catch (err) {
    console.error('createCallback error:', err)
    return res.status(500).json({ message: 'Server error.' })
  }
}
