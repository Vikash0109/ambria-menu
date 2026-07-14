import { Router } from 'express'
import { createEvent, saveOrder } from '../controllers/eventController.js'

const router = Router()

// POST /api/events  — submit intake form (public, optional auth)
router.post('/', createEvent)

// POST /api/events/:id/order  — save order against event (public — no account required)
router.post('/:id/order', saveOrder)

export default router
