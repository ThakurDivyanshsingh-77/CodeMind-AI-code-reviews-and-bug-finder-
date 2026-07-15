const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: function() { return this.provider === 'local'; },
    minlength: 8 
  },
  avatar: { 
    type: String, 
    default: "" 
  },
  provider: { 
    type: String, 
    enum: ["local", "google"], 
    default: "local" 
  },
  githubUsername: { 
    type: String, 
    default: "" 
  },
  role: { 
    type: String, 
    enum: ["user", "admin"], 
    default: "user" 
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true
});

// Pre-save middleware to hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password helper
UserSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
