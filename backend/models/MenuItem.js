import mongoose from 'mongoose'

const menuItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    menuTier: {
      type: String,
      enum: ['standard', 'premium', 'both'],
      default: 'both',
    },
    isVeg: { type: Boolean, default: true },
    spiceLevels: [{ type: String }],
    portionSizes: [{ type: String }],
    tags: [{ type: String }],
    gradient: {
      type: String,
      default: 'from-slate-800 via-slate-700 to-emerald-800',
      trim: true,
    },
    available: { type: Boolean, default: true },
  },
  { timestamps: true },
)

const MenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema)
export default MenuItem
