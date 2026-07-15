const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true, 
    index: true 
  },
  name: { 
    type: String, 
    required: true, 
    maxlength: 100, 
    trim: true 
  },
  description: { 
    type: String, 
    default: "" 
  },
  language: { 
    type: String, 
    required: true 
  },
  repositoryUrl: { 
    type: String, 
    default: ""
  },
  uploadType: { 
    type: String, 
    enum: ["zip", "github"], 
    required: true 
  },
  projectPath: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["uploaded", "processing", "completed"], 
    default: "uploaded",
    index: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', ProjectSchema);
