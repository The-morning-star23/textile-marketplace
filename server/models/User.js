const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['buyer', 'supplier'], required: true },
  isOnboarded: { type: Boolean, default: false },
  preferences: { type: Object, default: {} },
  
  // Required Supplier Fields
  businessName: { type: String, default: "" },
  businessType: { type: String, default: "" }, // Added
  phoneNumber: { type: String, default: "" },
  businessAddress: { type: String, default: "" },
  operatingHours: { type: String, default: "" },
  productCategories: { type: [String], default: [] }, // Added
  fabricTypes: { type: [String], default: [] }, // Added
  moq: { type: String, default: "" }, // Added
  
  // Additional Info
  gstinNumber: { type: String, default: "" },
  website: { type: String, default: "" },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);