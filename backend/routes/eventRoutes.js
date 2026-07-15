import { Router } from 'express'
import { createEvent, updateEvent, saveOrder } from '../controllers/eventController.js'

const router = Router()

// POST /api/events  — submit intake form (public, optional auth)
router.post('/', createEvent)

// PUT /api/events/:id  — update existing event (edit form re-submit)
router.put('/:id', updateEvent)

// POST /api/events/:id/order  — save order against event (public — no account required)
router.post('/:id/order', saveOrder)

export default router
