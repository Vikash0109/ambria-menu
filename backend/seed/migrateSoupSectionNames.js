/**
 * One-time migration: rename soup section labels from "Select any one" → "Select any two"
 * Safe to run multiple times (idempotent — only updates if old name exists).
 *
 * Usage: node backend/seed/migrateSoupSectionNames.js
 */
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '../.env') })

import MenuCollection from '../models/MenuCollection.js'

const RENAMES = [
  { from: 'Soup Station (Select any one)',                    to: 'Soup Station (Select any two)'                    },
  { from: 'Soup Station',                                     to: 'Soup Station (Select any two)'                    },
  { from: 'Soup Station – Vegetarian (Select any one)',       to: 'Soup Station – Vegetarian (Select any two)'       },
  { from: 'Soup Station – Non-Vegetarian (Select any one)',   to: 'Soup Station – Non-Vegetarian (Select any two)'   },
]

async function run() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB.')

  const collections = await MenuCollection.find({})
  let totalRenamed = 0

  for (const col of collections) {
    let modified = false
    for (const sec of col.sections) {
      const rename = RENAMES.find(r => r.from === sec.section)
      if (rename) {
        console.log(`  [${col.collectionKey}] "${sec.section}" → "${rename.to}"`)
        sec.section = rename.to
        modified = true
        totalRenamed++
      }
    }
    if (modified) {
      col.markModified('sections')
      await col.save()
      console.log(`✔ Saved collection: ${col.collectionKey}`)
    }
  }

  if (totalRenamed === 0) {
    console.log('Nothing to rename — all sections already up to date.')
  } else {
    console.log(`\nMigration complete. Renamed ${totalRenamed} section(s).`)
  }

  await mongoose.disconnect()
}

run().catch(err => { console.error(err); process.exit(1) })
