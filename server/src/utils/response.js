const sendSuccess = (res, message, data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const sendError = (res, message, error = {}, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: typeof error === 'string' ? { message: error } : error
  });
};

module.exports = {
  sendSuccess,
  sendError
};
