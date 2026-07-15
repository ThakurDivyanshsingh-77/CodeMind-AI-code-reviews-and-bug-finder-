const { registerUser, loginUser, loginGoogleUser } = require('../services/auth.service');
const { generateToken } = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/response');

const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return sendError(res, 'Missing required registration parameters', {}, 400);
  }

  try {
    const user = await registerUser(name, email, password);
    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    return sendSuccess(res, 'User registered successfully', { token }, 201);
  } catch (error) {
    return sendError(res, error.message, {}, 400);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, 'Missing email or password credentials', {}, 400);
  }

  try {
    const user = await loginUser(email, password);
    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    return sendSuccess(res, 'User authenticated successfully', { token });
  } catch (error) {
    return sendError(res, error.message, {}, 401);
  }
};

const getMe = async (req, res, next) => {
  try {
    return sendSuccess(res, 'User session loaded', { user: req.user });
  } catch (error) {
    return sendError(res, 'Failed to fetch user session', error.message, 500);
  }
};

const logout = async (req, res, next) => {
  return sendSuccess(res, 'User logged out successfully');
};

const googleLogin = async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return sendError(res, 'Missing Google token', {}, 400);
  }

  try {
    const user = await loginGoogleUser(token);
    const localToken = generateToken({ id: user.id, email: user.email, role: user.role });
    return sendSuccess(res, 'User authenticated with Google successfully', { token: localToken });
  } catch (error) {
    return sendError(res, error.message, {}, 401);
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
  googleLogin
};
