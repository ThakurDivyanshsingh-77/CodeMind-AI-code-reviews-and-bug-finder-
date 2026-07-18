const Review = require('../models/Review');
const Project = require('../models/Project');
const { requestAnalysis } = require('./ai.service');
const { getProjectFiles } = require('./project.service');

const runCodeReview = async (projectId, userId) => {
  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) {
    throw new Error('Project not found or unauthorized');
  }

  // Update status to processing
  project.status = 'processing';
  await project.save();

  try {
    const files = await getProjectFiles(projectId, userId);
    const report = await requestAnalysis(project.projectPath, files);

    const review = await Review.create({
      projectId,
      overallScore: report.overallScore,
      qualityScore: report.qualityScore,
      securityScore: report.securityScore,
      performanceScore: report.performanceScore,
      maintainabilityScore: report.maintainabilityScore,
      bugs: report.bugs,
      suggestions: report.suggestions,
      aiSummary: report.aiSummary
    });

    // Trigger codebase indexing for RAG if not already indexed
    const CodeChunk = require('../models/CodeChunk');
    const chunkCount = await CodeChunk.countDocuments({ projectId });
    if (chunkCount === 0) {
      try {
        const axios = require('axios');
        const env = require('../config/env');
        const payload = files && files.length > 0 ? { files } : { projectPath: project.projectPath };
        const indexResponse = await axios.post(`${env.AI_SERVICE_URL}/index`, payload);
        
        if (indexResponse.data && indexResponse.data.success && indexResponse.data.chunks) {
          const dbChunks = indexResponse.data.chunks.map(c => ({
            projectId,
            filePath: c.filePath,
            startLine: c.startLine,
            endLine: c.endLine,
            text: c.text,
            embedding: c.embedding || []
          }));
          if (dbChunks.length > 0) {
            await CodeChunk.insertMany(dbChunks);
          }
        }
      } catch (indexErr) {
        console.error("Failed to index codebase for RAG chat:", indexErr.message);
      }
    }

    // Update status to completed
    project.status = 'completed';
    await project.save();

    return review;
  } catch (error) {
    // Revert status on failure
    project.status = 'uploaded';
    await project.save();
    throw error;
  }
};

const getReviewById = async (id, userId) => {
  const mongoose = require('mongoose');
  let review = null;

  if (mongoose.Types.ObjectId.isValid(id)) {
    // Try to find by Review ID first
    review = await Review.findById(id).populate('projectId');
    
    // Fallback: try to find by Project ID (sort by createdAt: -1 to get latest)
    if (!review) {
      review = await Review.findOne({ projectId: id }).sort({ createdAt: -1 }).populate('projectId');
    }
  }

  if (!review) {
    throw new Error('Review not found');
  }

  // Authorize check
  if (!review.projectId || review.projectId.userId.toString() !== userId) {
    throw new Error('Unauthorized access to review');
  }

  return review;
};

const getReviewHistory = async (userId) => {
  const projects = await Project.find({ userId }).select('_id');
  const projectIds = projects.map(p => p._id);
  return Review.find({ projectId: { $in: projectIds } })
    .populate('projectId')
    .sort({ createdAt: -1 });
};

const getReviewsByProject = async (projectId, userId) => {
  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) {
    throw new Error('Project not found');
  }
  return Review.find({ projectId }).sort({ createdAt: -1 });
};

module.exports = {
  runCodeReview,
  getReviewById,
  getReviewHistory,
  getReviewsByProject
};
