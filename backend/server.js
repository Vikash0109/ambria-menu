import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'

import { connectDB } from './config/db.js'
import adminRoutes from './routes/adminRoutes.js'
import authRoutes from './routes/authRoutes.js'
import callbackRoutes from './routes/callbackRoutes.js'
import collectionRoutes from './routes/collectionRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import menuRoutes from './routes/menuRoutes.js'
import userRoutes from './routes/userRoutes.js'

// ── Seed helpers (run once on startup) ────────────────────────────────────────
import MenuItem from './models/MenuItem.js'
import Admin from './models/Admin.js'
import MenuCollection from './models/MenuCollection.js'
import { SEED_MENU_ITEMS } from './seed/menuItems.js'
import { SEED_COLLECTIONS } from './seed/menuCollections.js'

dotenv.config()

const app  = express()
const port = process.env.PORT || 4000
const isProd = process.env.NODE_ENV === 'production'

// ── Security headers ──────────────────────────────────────────────────────────
// crossOriginResourcePolicy must be "cross-origin" for a REST API so browsers
// can read responses fetched from a different origin (the Vite dev server on
// :5173 → API on :4000, or a separate production frontend domain).
// crossOriginOpenerPolicy is relaxed for the same reason.
// All other helmet defaults (CSP, HSTS, X-Frame-Options, etc.) are kept.
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginOpenerPolicy:   { policy: 'same-origin-allow-popups' },
}))

// ── CORS ──────────────────────────────────────────────────────────────────────
// In production set CORS_ORIGIN to your frontend domain, e.g. https://feast.example.com
// In development the vite proxy handles /api so '*' is safe for local work.
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:4173']

app.use(cors({
  origin: (origin, cb) => {
    // allow server-to-server / curl calls (no Origin header)
    if (!origin) return cb(null, true)
    if (allowedOrigins.includes(origin) || !isProd) return cb(null, true)
    cb(new Error(`CORS: origin ${origin} not allowed`))
  },
  credentials: true,
}))

// ── Rate limiting ─────────────────────────────────────────────────────────────
// General limiter — 200 req / 15 min per IP
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
}))

// Tighter limiter on auth endpoints — 20 req / 15 min per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts, please try again later.' },
})

// ── Body parsing & request size limit ────────────────────────────────────────
app.use(express.json({ limit: '200kb' }))
app.use(express.urlencoded({ extended: true, limit: '200kb' }))

// ── Routes ─────────────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ ok: true, message: 'API is running.' }))

app.use('/api/auth',        authLimiter, authRoutes)
app.use('/api/users',       userRoutes)
app.use('/api/menu',        menuRoutes)
app.use('/api/collections', collectionRoutes)
app.use('/api/events',      eventRoutes)
app.use('/api/callbacks',   callbackRoutes)
app.use('/api/admin',       adminRoutes)

// ── 404 handler ────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found.' })
})

// ── Global error handler ───────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  // Don't leak internal details in production
  const message = isProd ? 'Internal server error.' : (err.message ?? 'Internal server error.')
  console.error('Unhandled error:', err)
  res.status(err.status ?? 500).json({ message })
})

// ── Seed database ──────────────────────────────────────────────────────────────
async function seedDatabase() {
  try {
    // Upsert menu items
    for (const item of SEED_MENU_ITEMS) {
      await MenuItem.updateOne({ id: item.id }, { $set: item }, { upsert: true })
    }
    console.log('Menu items seed complete.')

    // Upsert collections
    for (const col of SEED_COLLECTIONS) {
      await MenuCollection.findOneAndUpdate(
        { collectionKey: col.collectionKey },
        col,
        { upsert: true, new: true, setDefaultsOnInsert: true },
      )
    }
    console.log('Menu collections seed complete.')

    // Create default admin from env if none exists
    const existing = await Admin.findOne({ email: process.env.ADMIN_EMAIL })
    if (!existing && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      await Admin.create({
        email:    process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        name:     'Super Admin',
        role:     'admin',
      })
      console.log('Default admin created:', process.env.ADMIN_EMAIL)
    }
  } catch (err) {
    console.error('Seed error:', err.message)
  }
}

// ── Start ──────────────────────────────────────────────────────────────────────
async function start() {
  await connectDB()
  await seedDatabase()
  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}  [${process.env.NODE_ENV ?? 'development'}]`)
  })
}

start()
