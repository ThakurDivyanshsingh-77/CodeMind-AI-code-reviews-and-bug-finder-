const mongoose = require('mongoose');

const TeamChatSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, required: true },
  message: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('TeamChat', TeamChatSchema);
