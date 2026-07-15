const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  reviewId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Review", 
    required: true, 
    index: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  question: { type: String, required: true },
  answer: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Chat', ChatSchema);
