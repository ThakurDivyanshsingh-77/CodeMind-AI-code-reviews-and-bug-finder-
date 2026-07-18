const mongoose = require('mongoose');

const CodeChunkSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  filePath: {
    type: String,
    required: true
  },
  startLine: {
    type: Number,
    required: true
  },
  endLine: {
    type: Number,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  embedding: {
    type: [Number],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CodeChunk', CodeChunkSchema);
