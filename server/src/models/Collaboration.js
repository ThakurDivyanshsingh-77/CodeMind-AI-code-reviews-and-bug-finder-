const mongoose = require('mongoose');

const CollaborationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  role: { type: String, enum: ['Admin', 'Reviewer', 'Viewer'], default: 'Reviewer' },
  status: { type: String, enum: ['Active', 'Pending'], default: 'Pending' },
  joinedDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Collaboration', CollaborationSchema);
