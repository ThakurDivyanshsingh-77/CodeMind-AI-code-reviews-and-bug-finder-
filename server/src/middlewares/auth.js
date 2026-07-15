const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');
const { sendError } = require('../utils/response');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return sendError(res, 'Not authorized, token missing', {}, 401);
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return sendError(res, 'Not authorized, token invalid', {}, 401);
    }

    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return sendError(res, 'User not found matching session', {}, 401);
    }

    next();
  } catch (error) {
    return sendError(res, 'Session authorization failed', error.message, 401);
  }
};

module.exports = { protect };
