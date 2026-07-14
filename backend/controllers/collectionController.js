import MenuCollection from '../models/MenuCollection.js'

// GET /api/collections  — all 4 collections (metadata only, no sections)
export async function getAllCollections(req, res) {
  try {
    const cols = await MenuCollection.find({}, 'collectionKey label packageType preference guestThreshold updatedAt').sort({ collectionKey: 1 }).lean()
    return res.json({ collections: cols })
  } catch (err) {
    console.error('getAllCollections error:', err)
    return res.status(500).json({ message: 'Server error.' })
  }
}

// GET /api/collections/:key  — full collection with sections
export async function getCollection(req, res) {
  try {
    const col = await MenuCollection.findOne({ collectionKey: req.params.key }).lean()
    if (!col) return res.status(404).json({ message: 'Collection not found.' })
    // Prevent browser/proxy caching so menu always reflects latest admin edits
    res.set('Cache-Control', 'no-store')
    return res.json({ collection: col })
  } catch (err) {
    console.error('getCollection error:', err)
    return res.status(500).json({ message: 'Server error.' })
  }
}

// PUT /api/collections/:key  — replace full sections array (admin)
export async function updateCollection(req, res) {
  try {
    const { sections } = req.body ?? {}
    if (!Array.isArray(sections)) {
      return res.status(400).json({ message: 'sections must be an array.' })
    }

    // Sanitise: ensure each section has a name and items array
    const clean = sections.map(sec => ({
      section: String(sec.section ?? '').trim(),
      items: Array.isArray(sec.items)
        ? sec.items.map(it => ({
            name: String(it.name ?? '').trim(),
            description: String(it.description ?? '').trim(),
          })).filter(it => it.name)
        : [],
    })).filter(sec => sec.section)

    const col = await MenuCollection.findOneAndUpdate(
      { collectionKey: req.params.key },
      { sections: clean },
      { new: true, runValidators: true },
    )
    if (!col) return res.status(404).json({ message: 'Collection not found.' })
    return res.json({ collection: col })
  } catch (err) {
    console.error('updateCollection error:', err)
    return res.status(500).json({ message: 'Server error.' })
  }
}
