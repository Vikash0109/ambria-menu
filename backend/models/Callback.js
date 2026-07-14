import mongoose from 'mongoose'

const callbackSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    phone:    { type: String, required: true, trim: true },
    email:    { type: String, default: '', lowercase: true, trim: true },
    occasion: { type: String, default: '', trim: true },
    message:  { type: String, default: '', trim: true },

    // Workflow status
    status: {
      type: String,
      enum: ['new', 'contacted', 'converted', 'closed'],
      default: 'new',
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true },
)

const Callback = mongoose.models.Callback || mongoose.model('Callback', callbackSchema)
export default Callback
