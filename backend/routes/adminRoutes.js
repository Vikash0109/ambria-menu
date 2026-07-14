import { Router } from 'express'
import {
  getAllEvents,
  getAllUsers,
  getDashboardStats,
  updateAdminProfile,
  updateEventStatus,
  getCallbacks,
  updateCallbackStatus,
} from '../controllers/adminController.js'
import { requireAdmin, requireRole } from '../middleware/auth.js'

const router = Router()

// ── Routes accessible by both admin and sales ─────────────────────────────────
router.get('/stats',    requireRole('admin', 'sales'), getDashboardStats)
router.get('/events',   requireRole('admin', 'sales'), getAllEvents)
router.get('/users',    requireRole('admin', 'sales'), getAllUsers)
router.get('/callbacks',requireRole('admin', 'sales'), getCallbacks)

// ── Admin + sales can update event and callback status ────────────────────────
router.patch('/events/:id',    requireRole('admin', 'sales'), updateEventStatus)
router.patch('/callbacks/:id', requireRole('admin', 'sales'), updateCallbackStatus)

// ── Admin-only ────────────────────────────────────────────────────────────────
router.put('/profile', requireRole('admin', 'sales'), updateAdminProfile)

export default router
