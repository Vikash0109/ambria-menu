/**
 * Manual seed runner.
 * Usage: node backend/seed/run.js
 * Safe to re-run — every operation is an upsert.
 */
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '../.env') })

import MenuItem      from '../models/MenuItem.js'
import Admin         from '../models/Admin.js'
import MenuCollection from '../models/MenuCollection.js'
import { SEED_MENU_ITEMS }  from './menuItems.js'
import { SEED_COLLECTIONS } from './menuCollections.js'

async function run() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB.')

  // Menu items
  for (const item of SEED_MENU_ITEMS) {
    await MenuItem.updateOne({ id: item.id }, { $set: item }, { upsert: true })
  }
  console.log(`✔ Upserted ${SEED_MENU_ITEMS.length} menu items.`)

  // Collections
  for (const col of SEED_COLLECTIONS) {
    const result = await MenuCollection.findOneAndUpdate(
      { collectionKey: col.collectionKey },
      col,
      { upsert: true, new: true, setDefaultsOnInsert: true },
    )
    console.log(`✔ Upserted collection: ${result.label}`)
  }

  // Default admin
  const existing = await Admin.findOne({ email: process.env.ADMIN_EMAIL })
  if (!existing && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    await Admin.create({
      email:    process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      name:     'Super Admin',
      role:     'admin',
    })
    console.log('✔ Default admin created:', process.env.ADMIN_EMAIL)
  } else {
    console.log('✔ Admin already exists, skipping.')
  }

  console.log('Seed complete.')
  await mongoose.disconnect()
}

run().catch(err => { console.error(err); process.exit(1) })
