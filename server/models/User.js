const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  authProvider: { type: String, enum: ['local', 'google', 'apple'], default: 'local' },
  theme: { type: String, default: 'system' },
  language: {
    type: String,
    enum: ['en', 'bg'],
    default: 'en'
  },
  physicalProfile: {
    age: { type: Number },
    gender: { type: String, enum: ['male', 'female'] },
    height: { type: Number },
    weight: { type: Number },
    activityLevel: {
        type: String,
        enum: ['sedentary', 'light', 'moderate', 'active', 'very_active']
    }
  },
  savedExercises: [
    {
      name: String,
      muscleGroup: String,
      gif: String,
      difficulty: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);