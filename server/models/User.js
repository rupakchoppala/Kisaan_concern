import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: { type: String, default: null },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  userName: String,
  photo: String,
  role: { type: String, enum: ['farmer','consumer'], default:'farmer', required:true },
  address: {
    fullName: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    phoneNumber: String,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0],
    },
  },
});
userSchema.index({ location: "2dsphere" });
const User = mongoose.model('User', userSchema);
export default User;
