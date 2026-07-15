require('dotenv').config();

const env = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/codemind_ai',
  // Note: It is also safer to not hardcode a fallback for JWT_SECRET in production
  JWT_SECRET: process.env.JWT_SECRET || 'super_secret_jwt_key_12345',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  AI_SERVICE_URL: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  // GitHub PR Bot
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
  GITHUB_WEBHOOK_SECRET: process.env.GITHUB_WEBHOOK_SECRET || '',
  // Google OAuth - REMOVED THE HARDCODED FALLBACKS
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET
};

module.exports = env;