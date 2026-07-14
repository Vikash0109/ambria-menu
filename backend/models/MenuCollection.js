import mongoose from 'mongoose'

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
  },
  { _id: false },
)

const sectionSchema = new mongoose.Schema(
  {
    section: { type: String, required: true, trim: true },
    items: { type: [itemSchema], default: [] },
  },
  { _id: false },
)

const menuCollectionSchema = new mongoose.Schema(
  {
    // e.g. "magnumVeg" | "magnumNonVeg" | "multicuisineVeg" | "multicuisineNonVeg"
    collectionKey: { type: String, required: true, unique: true, trim: true },
    label: { type: String, required: true, trim: true },     // human-readable display name
    packageType: { type: String, enum: ['magnum', 'multicuisine'], required: true },
    preference: { type: String, enum: ['veg', 'nonveg'], required: true },
    guestThreshold: { type: String, enum: ['lte150', 'gt150'], required: true },
    sections: { type: [sectionSchema], default: [] },
  },
  { timestamps: true },
)

const MenuCollection =
  mongoose.models.MenuCollection ||
  mongoose.model('MenuCollection', menuCollectionSchema)

export default MenuCollection
