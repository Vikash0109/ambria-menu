import jwt from 'jsonwebtoken'
import User from '../models/User.js'

function signToken(payload, expiresIn = '7d') {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn })
}

// ── Staff login (admin OR sales) ──────────────────────────────────────────────
// POST /api/auth/staff/login
// Credentials are sourced exclusively from .env — no DB accounts.
export async function staffLogin(req, res) {
  try {
    const { email, password } = req.body ?? {}
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const normalizedEmail = String(email).toLowerCase().trim()

    // ── Check env-based Admin credentials ────────────────────────────────────
    const adminEmail    = (process.env.ADMIN_EMAIL ?? '').toLowerCase().trim()
    const adminPassword = process.env.ADMIN_PASSWORD ?? ''

    if (adminEmail && normalizedEmail === adminEmail) {
      if (String(password) !== adminPassword) {
        return res.status(401).json({ message: 'Invalid credentials.' })
      }
      const adminStaff = { _id: 'admin-env', name: 'Admin', email: adminEmail, role: 'admin' }
      const token = signToken({ id: 'admin-env', email: adminEmail, role: 'admin' })
      return res.json({ token, staff: adminStaff })
    }

    // ── Check env-based Sales credentials ────────────────────────────────────
    const salesEmail    = (process.env.SALES_EMAIL ?? '').toLowerCase().trim()
    const salesPassword = process.env.SALES_PASSWORD ?? ''

    if (salesEmail && normalizedEmail === salesEmail) {
      if (String(password) !== salesPassword) {
        return res.status(401).json({ message: 'Invalid credentials.' })
      }
      const salesStaff = { _id: 'sales-env', name: 'Sales', email: salesEmail, role: 'sales' }
      const token = signToken({ id: 'sales-env', email: salesEmail, role: 'sales' })
      return res.json({ token, staff: salesStaff })
    }

    return res.status(401).json({ message: 'Invalid credentials.' })
  } catch (err) {
    console.error('staffLogin error:', err)
    return res.status(500).json({ message: 'Server error.' })
  }
}

// ── Legacy admin login alias ──────────────────────────────────────────────────
// POST /api/auth/admin/login
export async function adminLogin(req, res) {
  return staffLogin(req, res)
}

// ── User register ─────────────────────────────────────────────────────────────
// POST /api/auth/register
export async function userRegister(req, res) {
  try {
    const { name, email, phone, password } = req.body ?? {}
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Name, email, phone, and password are required.' })
    }
    if (String(password).length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' })
    }

    const exists = await User.findOne({ email: String(email).toLowerCase().trim() })
    if (exists) return res.status(409).json({ message: 'An account with this email already exists.' })

    const user = await User.create({
      name: String(name).trim(),
      email: String(email).toLowerCase().trim(),
      phone: String(phone).trim(),
      password: String(password),
    })

    const token = signToken({ id: user._id, email: user.email, role: 'user' })
    return res.status(201).json({ token, user: user.toJSON() })
  } catch (err) {
    console.error('userRegister error:', err)
    return res.status(500).json({ message: 'Server error.' })
  }
}

// ── User login ────────────────────────────────────────────────────────────────
// POST /api/auth/login
export async function userLogin(req, res) {
  try {
    const { email, password } = req.body ?? {}
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const user = await User.findOne({ email: String(email).toLowerCase().trim() })
    if (!user) return res.status(401).json({ message: 'Invalid credentials.' })

    const match = await user.comparePassword(String(password))
    if (!match) return res.status(401).json({ message: 'Invalid credentials.' })

    const token = signToken({ id: user._id, email: user.email, role: 'user' })
    return res.json({ token, user: user.toJSON() })
  } catch (err) {
    console.error('userLogin error:', err)
    return res.status(500).json({ message: 'Server error.' })
  }
}

// ── Get current session ───────────────────────────────────────────────────────
// GET /api/auth/me  (works for any valid token)
export async function getMe(req, res) {
  try {
    if (req.user.role === 'admin' || req.user.role === 'sales') {
      return res.json({
        role: req.user.role,
        user: {
          _id:   req.user.id,
          email: req.user.email,
          role:  req.user.role,
          name:  req.user.role === 'admin' ? 'Admin' : 'Sales',
        },
      })
    }

    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found.' })
    return res.json({ role: 'user', user: user.toJSON() })
  } catch (err) {
    console.error('getMe error:', err)
    return res.status(500).json({ message: 'Server error.' })
  }
}
