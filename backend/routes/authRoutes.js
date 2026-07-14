import { Router } from 'express'
import {
  adminLogin,
  staffLogin,
  userLogin,
  userRegister,
  getMe,
} from '../controllers/authController.js'
import { verifyToken } from '../middleware/auth.js'

const router = Router()

// POST /api/auth/staff/login   — unified login for admin + sales
router.post('/staff/login', staffLogin)

// POST /api/auth/admin/login   — legacy alias
router.post('/admin/login', adminLogin)

// POST /api/auth/register
router.post('/register', userRegister)

// POST /api/auth/login
router.post('/login', userLogin)

// GET /api/auth/me  — requires any valid token
router.get('/me', verifyToken, getMe)

export default router
