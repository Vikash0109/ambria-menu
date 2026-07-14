import { Router } from 'express'
import { createCallback } from '../controllers/callbackController.js'

const router = Router()

// POST /api/callbacks  — public, no auth required
router.post('/', createCallback)

export default router
