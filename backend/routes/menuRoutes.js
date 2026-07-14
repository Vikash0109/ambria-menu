import { Router } from 'express'
import {
  createMenuItem,
  deleteMenuItem,
  getAdminMenu,
  getMenu,
  updateMenuItem,
} from '../controllers/menuController.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()

// GET  /api/menu               — public menu
router.get('/', getMenu)

// GET  /api/menu/admin         — all items including unavailable (admin only)
router.get('/admin', requireAdmin, getAdminMenu)

// POST /api/menu               — create dish (admin only)
router.post('/', requireAdmin, createMenuItem)

// PUT  /api/menu/:id           — update dish (admin only)
router.put('/:id', requireAdmin, updateMenuItem)

// DELETE /api/menu/:id         — delete dish (admin only)
router.delete('/:id', requireAdmin, deleteMenuItem)

export default router
