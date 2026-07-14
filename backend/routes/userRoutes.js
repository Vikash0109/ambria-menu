import { Router } from 'express'
import {
  changePassword,
  getMyEvents,
  getProfile,
  updateProfile,
} from '../controllers/userController.js'
import { verifyToken } from '../middleware/auth.js'

const router = Router()

// All user routes require a valid user token
router.use(verifyToken)

// GET /api/users/profile
router.get('/profile', getProfile)

// PUT /api/users/profile
router.put('/profile', updateProfile)

// PUT /api/users/change-password
router.put('/change-password', changePassword)

// GET /api/users/events
router.get('/events', getMyEvents)

export default router
