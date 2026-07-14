import MenuItem from '../models/MenuItem.js'

function slugify(value) {
  const s = String(value ?? '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  return s || `dish-${Date.now()}`
}

function normalizeList(value) {
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean)
  return String(value ?? '').split(',').map((v) => v.trim()).filter(Boolean)
}

function buildItemPayload(body, idOverride) {
  const name = String(body.name ?? '').trim()
  const description = String(body.description ?? '').trim()
  const price = String(body.price ?? '').trim()
  const category = String(body.category ?? '').trim()

  if (!name || !description || !price || !category) return null

  return {
    id: idOverride ?? (String(body.id ?? '').trim() || slugify(name)),
    name,
    description,
    price,
    category,
    menuTier: ['standard', 'premium', 'both'].includes(body.menuTier) ? body.menuTier : 'both',
    isVeg: body.isVeg === true || body.isVeg === 'true',
    spiceLevels: normalizeList(body.spiceLevels),
    portionSizes: normalizeList(body.portionSizes),
    tags: normalizeList(body.tags),
    gradient: String(body.gradient ?? 'from-slate-800 via-slate-700 to-emerald-800').trim(),
    available: body.available !== false && body.available !== 'false',
  }
}

// ── Public: get available menu ────────────────────────────────────────────────
// GET /api/menu?tier=standard|premium&isVeg=true|false
export async function getMenu(req, res) {
  try {
    const { tier, isVeg } = req.query
    const query = { available: true }

    if (tier && ['standard', 'premium'].includes(tier)) {
      query.$or = [{ menuTier: tier }, { menuTier: 'both' }]
    }
    if (isVeg !== undefined) {
      query.isVeg = isVeg === 'true'
    }

    const items = await MenuItem.find(query).sort({ category: 1, name: 1 }).lean()
    return res.json({ items })
  } catch (err) {
    console.error('getMenu error:', err)
    return res.status(500).json({ message: 'Server error.' })
  }
}

// ── Admin: get all menu items (including unavailable) ─────────────────────────
// GET /api/admin/menu
export async function getAdminMenu(req, res) {
  try {
    const items = await MenuItem.find().sort({ createdAt: -1 }).lean()
    return res.json({ items })
  } catch (err) {
    console.error('getAdminMenu error:', err)
    return res.status(500).json({ message: 'Server error.' })
  }
}

// ── Admin: create dish ────────────────────────────────────────────────────────
// POST /api/admin/menu
export async function createMenuItem(req, res) {
  try {
    const payload = buildItemPayload(req.body)
    if (!payload) {
      return res.status(400).json({ message: 'Name, description, price, and category are required.' })
    }

    // Ensure slug is unique
    const exists = await MenuItem.findOne({ id: payload.id })
    if (exists) payload.id = `${payload.id}-${Date.now()}`

    const item = await MenuItem.create(payload)
    return res.status(201).json({ item })
  } catch (err) {
    console.error('createMenuItem error:', err)
    return res.status(500).json({ message: 'Server error.' })
  }
}

// ── Admin: update dish ────────────────────────────────────────────────────────
// PUT /api/admin/menu/:id
export async function updateMenuItem(req, res) {
  try {
    const payload = buildItemPayload(req.body, req.params.id)
    if (!payload) {
      return res.status(400).json({ message: 'Name, description, price, and category are required.' })
    }

    const item = await MenuItem.findOneAndUpdate(
      { id: req.params.id },
      payload,
      { new: true, runValidators: true, upsert: false },
    )
    if (!item) return res.status(404).json({ message: 'Dish not found.' })
    return res.json({ item })
  } catch (err) {
    console.error('updateMenuItem error:', err)
    return res.status(500).json({ message: 'Server error.' })
  }
}

// ── Admin: delete dish ────────────────────────────────────────────────────────
// DELETE /api/admin/menu/:id
export async function deleteMenuItem(req, res) {
  try {
    const item = await MenuItem.findOneAndDelete({ id: req.params.id })
    if (!item) return res.status(404).json({ message: 'Dish not found.' })
    return res.json({ ok: true, message: 'Dish deleted.' })
  } catch (err) {
    console.error('deleteMenuItem error:', err)
    return res.status(500).json({ message: 'Server error.' })
  }
}
