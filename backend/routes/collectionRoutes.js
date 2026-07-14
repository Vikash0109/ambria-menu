import { Router } from 'express'
import {
  getAllCollections,
  getCollection,
  updateCollection,
} from '../controllers/collectionController.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()

// Public — user menu page reads these
router.get('/', getAllCollections)
router.get('/:key', getCollection)

// Admin only — save edits
router.put('/:key', requireAdmin, updateCollection)

export default router
