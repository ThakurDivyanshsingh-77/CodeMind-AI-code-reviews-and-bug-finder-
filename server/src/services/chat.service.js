const Chat = require('../models/Chat');
const Review = require('../models/Review');
const Project = require('../models/Project');
const axios = require('axios');
const env = require('../config/env');

const postMessage = async (reviewId, userId, question) => {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new Error('Associated code review report not found');
  }

  // Load chat history
  const history = await Chat.find({ reviewId }).sort({ createdAt: 1 });
  const chatHistory = history.map(h => ({
    question: h.question,
    answer: h.answer
  }));

  // Compile context
  const reviewContext = {
    overallScore: review.overallScore,
    qualityScore: review.qualityScore,
    securityScore: review.securityScore,
    performanceScore: review.performanceScore,
    maintainabilityScore: review.maintainabilityScore,
    bugs: review.bugs.map(b => ({
      filePath: b.filePath,
      line: b.line,
      severity: b.severity,
      description: b.description
    })),
    suggestions: review.suggestions,
    aiSummary: review.aiSummary
  };

  try {
    // Send to FastAPI Python
    const response = await axios.post(`${env.AI_SERVICE_URL}/chat`, {
      reviewContext,
      chatHistory,
      question
    });

    if (response.data && response.data.success) {
      const answer = response.data.reply;
      
      // Save to database
      const chatRecord = await Chat.create({
        reviewId,
        userId,
        question,
        answer
      });

      return chatRecord;
    }
    throw new Error('AI chat service returned an invalid response');
  } catch (error) {
    const detail = error.response?.data?.detail || error.message;
    throw new Error(`AI Chat Service Communication Error: ${detail}`);
  }
};

const getChatLogs = async (reviewId, userId) => {
  return Chat.find({ reviewId, userId }).sort({ createdAt: 1 });
};

/**
 * RAG Chat — ask questions about actual source code files.
 * Uses Gemini embeddings + cosine similarity on the Python side.
 */
const ragChat = async (projectId, userId, question) => {
  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) {
    throw new Error('Project not found or unauthorized');
  }
  if (!project.projectPath) {
    throw new Error('Project has no files on disk. Please upload or clone the project first.');
  }

  // Load RAG chat history for this project (use projectId as reviewId key)
  const history = await Chat.find({ reviewId: projectId, userId }).sort({ createdAt: 1 });
  const chatHistory = history.map(h => ({ question: h.question, answer: h.answer }));

  try {
    const response = await axios.post(`${env.AI_SERVICE_URL}/rag-chat`, {
      projectPath: project.projectPath,
      question,
      chatHistory
    });

    if (response.data && response.data.success) {
      const { reply, sources } = response.data;

      // Persist message using projectId as the reviewId so history is scoped per project
      await Chat.create({
        reviewId: projectId,
        userId,
        question,
        answer: reply
      });

      return { reply, sources: sources || [] };
    }
    throw new Error('RAG chat service returned an invalid response');
  } catch (error) {
    const axiosError = error.response?.data?.detail || error.response?.data?.message || error.message;
    throw new Error(axiosError);
  }
};

module.exports = {
  postMessage,
  getChatLogs,
  ragChat
};
