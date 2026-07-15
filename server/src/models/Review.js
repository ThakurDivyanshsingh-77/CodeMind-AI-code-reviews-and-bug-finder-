const mongoose = require('mongoose');

const BugSchema = new mongoose.Schema({
  filePath: { type: String, required: true },
  line: { type: Number, required: true },
  severity: { type: String, enum: ["low", "medium", "high", "critical"], required: true },
  description: { type: String, required: true },
  impact: { type: String, default: "" },
  fixSuggestion: { type: String, required: true },
  targetCode: { type: String, default: "" },
  fixedCode: { type: String, default: "" }
});

const ReviewSchema = new mongoose.Schema({
  projectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Project", 
    required: true, 
    index: true 
  },
  overallScore: { type: Number, min: 0, max: 100, required: true },
  qualityScore: { type: Number, min: 0, max: 100, required: true },
  securityScore: { type: Number, min: 0, max: 100, required: true },
  performanceScore: { type: Number, min: 0, max: 100, required: true },
  maintainabilityScore: { type: Number, min: 0, max: 100, required: true },
  bugs: [BugSchema],
  suggestions: [{ type: String }],
  aiSummary: { type: String, required: true },
  reportUrl: { type: String, default: "" }
}, {
  timestamps: true
});

module.exports = mongoose.model('Review', ReviewSchema);
