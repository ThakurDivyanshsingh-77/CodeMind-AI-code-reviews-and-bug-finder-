const { runCodeReview, getReviewById, getReviewHistory } = require('../services/review.service');
const { sendSuccess, sendError } = require('../utils/response');

const startReview = async (req, res, next) => {
  const { projectId } = req.body;
  if (!projectId) {
    return sendError(res, 'Project ID is required to start review', {}, 400);
  }

  try {
    const review = await runCodeReview(projectId, req.user.id);
    return sendSuccess(res, 'Code review executed successfully', review, 201);
  } catch (error) {
    return sendError(res, error.message, {}, 500);
  }
};

const getReview = async (req, res, next) => {
  const { id } = req.params;
  try {
    const review = await getReviewById(id, req.user.id);
    return sendSuccess(res, 'Review details loaded successfully', review);
  } catch (error) {
    return sendError(res, error.message, {}, 404);
  }
};

const listReviewHistory = async (req, res, next) => {
  try {
    const history = await getReviewHistory(req.user.id);
    return sendSuccess(res, 'Review history loaded successfully', history);
  } catch (error) {
    return sendError(res, 'Failed to fetch review history', error.message);
  }
};

module.exports = {
  startReview,
  getReview,
  listReviewHistory
};
