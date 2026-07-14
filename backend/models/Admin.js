import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ['admin', 'sales'],
      default: 'admin',
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
  },
  { timestamps: true },
)

// Hash password before saving
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Compare plain password with hashed
adminSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password)
}

// Never return password in JSON responses
adminSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.password
    return ret
  },
})

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema)
export default Admin
