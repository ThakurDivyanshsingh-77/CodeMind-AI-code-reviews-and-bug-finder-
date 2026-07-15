const { postMessage, getChatLogs, ragChat } = require('../services/chat.service');
const { sendSuccess, sendError } = require('../utils/response');

const askAssistant = async (req, res, next) => {
  const { reviewId, message } = req.body;
  if (!reviewId || !message) {
    return sendError(res, 'Review ID and query message are required', {}, 400);
  }

  try {
    const chat = await postMessage(reviewId, req.user.id, message);
    return sendSuccess(res, 'AI assistant response generated', chat, 201);
  } catch (error) {
    return sendError(res, error.message, {}, 500);
  }
};

const getHistory = async (req, res, next) => {
  const { reviewId } = req.params;
  if (!reviewId) {
    return sendError(res, 'Review ID is required', {}, 400);
  }

  try {
    const logs = await getChatLogs(reviewId, req.user.id);
    return sendSuccess(res, 'Chat history loaded successfully', logs);
  } catch (error) {
    return sendError(res, 'Failed to fetch chat logs', error.message);
  }
};

const askRag = async (req, res) => {
  const { projectId, message } = req.body;
  if (!projectId || !message) {
    return sendError(res, 'Project ID and message are required', {}, 400);
  }

  try {
    const result = await ragChat(projectId, req.user.id, message);
    return sendSuccess(res, 'RAG response generated', result, 201);
  } catch (error) {
    return sendError(res, error.message, {}, 500);
  }
};

module.exports = {
  askAssistant,
  getHistory,
  askRag
};
