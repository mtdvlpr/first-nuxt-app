const mongoose = require('mongoose')

let user = null

try {
  const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verificationToken: { type: String, required: true },
    verificationTokenExpire: { type: Date, required: true },
    isVerified: { type: Boolean, required: true, default: false },
    resetPassword: { type: Boolean, required: true, default: false },
    scope: { type: Array, required: true, default: ['user'] },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    favorites: { type: Array, required: false },
  })

  user = mongoose.model('User', UserSchema)
} catch (e) {
  try {
    user = mongoose.model('User')
  } catch {
    user = null
  }
}

const userModel = user

export default userModel
