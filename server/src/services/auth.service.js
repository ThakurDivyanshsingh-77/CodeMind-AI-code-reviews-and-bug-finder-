const User = require('../models/User');

const registerUser = async (name, email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    provider: 'local'
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };
};

const { OAuth2Client } = require('google-auth-library');
const env = require('../config/env');
const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

const loginGoogleUser = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: env.GOOGLE_CLIENT_ID,
  });
  
  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error('Invalid token payload from Google');
  }

  const { email, name, picture } = payload;

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name: name || 'Google User',
      email,
      avatar: picture || '',
      provider: 'google',
      isVerified: true
    });
  } else {
    // Update avatar if it was not set
    if (!user.avatar && picture) {
      user.avatar = picture;
      await user.save();
    }
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };
};

module.exports = {
  registerUser,
  loginUser,
  loginGoogleUser
};

