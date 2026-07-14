import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
  },
  { timestamps: true },
)

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Compare plain password with hashed
userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password)
}

// Never return password in JSON responses
userSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.password
    return ret
  },
})

const User = mongoose.models.User || mongoose.model('User', userSchema)
export default User
