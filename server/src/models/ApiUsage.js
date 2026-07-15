const mongoose = require('mongoose');

const ApiUsageSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true, 
    index: true 
  },
  tokensUsed: { type: Number, required: true, min: 0 },
  requests: { type: Number, default: 1 },
  model: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('ApiUsage', ApiUsageSchema);
