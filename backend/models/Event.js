import mongoose from 'mongoose'

const customizationSchema = new mongoose.Schema(
  {
    itemId: { type: String },
    spiceLevel: { type: String },
    portionSize: { type: String },
    notes: { type: String, default: '' },
  },
  { _id: false },
)

const selectedItemSchema = new mongoose.Schema(
  {
    id: { type: String },
    name: { type: String },
    category: { type: String },
    quantity: { type: Number, default: 1 },
    spiceLevel: { type: String, default: '' },
    servingSize: { type: String, default: '' },
    priority: { type: Number, default: null },   // 1=High 2=Medium 3=Low
    notes: { type: String, default: '' },
    servingOrder: { type: Number, default: 0 },  // drag-reorder position
  },
  { _id: false },
)

const eventSchema = new mongoose.Schema(
  {
    // Reference to registered user (optional — guests can submit without an account)
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    // Guest / contact details
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },

    // Guest count breakdown
    guestCount: { type: Number, required: true },
    vegCount: { type: Number, default: 0 },
    nonVegCount: { type: Number, default: 0 },

    // Event details
    occasion: { type: String, required: true, trim: true },
    eventDate: { type: String, required: true },
    eventTime: { type: String, default: '', trim: true },
    venue: { type: String, required: true, trim: true },

    // Menu assignment
    menuTier: { type: String, enum: ['standard', 'premium'], required: true },

    // Order
    selectedItems: [selectedItemSchema],
    customizations: [customizationSchema],

    // Admin workflow
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    adminNotes: { type: String, default: '' },
  },
  { timestamps: true },
)

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema)
export default Event
