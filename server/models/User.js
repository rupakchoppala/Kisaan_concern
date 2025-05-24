import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: { type: String, default: null },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // required only for manual login
  userName: String,
  photo: String,
  role: {
    type: String,
    enum: ['farmer', 'consumer'],
    default: 'farmer',
    required: true,
  },
});
const User = mongoose.model('User', userSchema);
export default User;
