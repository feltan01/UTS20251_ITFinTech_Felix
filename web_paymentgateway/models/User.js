import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true }, // hashed password
    role: { type: String, default: 'user', enum: ['user', 'admin'] },
    mfaCode: { type: String },
    mfaExpiresAt: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
