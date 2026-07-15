const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { apiLimiter } = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const reviewRoutes = require('./routes/review.routes');
const chatRoutes = require('./routes/chat.routes');
const reportRoutes = require('./routes/report.routes');
const webhookRoutes = require('./routes/webhook.routes');
const teamRoutes = require('./routes/team.routes');

const app = express();

// Secure headers
app.use(helmet());

// Cross Origin boundaries
app.use(cors());

/**
 * Raw body capture for GitHub webhook HMAC-SHA256 signature verification.
 * MUST be registered BEFORE express.json() so req.rawBody is available
 * when the webhook controller verifies the signature.
 * Only applies to the /api/v1/webhook path.
 */
app.use('/api/v1/webhook', express.raw({ type: 'application/json' }), (req, res, next) => {
  // Store raw buffer as string for HMAC verification
  req.rawBody = req.body;
  // Parse JSON body so controllers can access req.body as an object
  try {
    req.body = JSON.parse(req.body.toString('utf-8'));
  } catch {
    req.body = {};
  }
  next();
});

// Body parser for all other routes
app.use(express.json());

// Global Rate Limiting
app.use('/api', apiLimiter);

// Google OAuth Login Route
const { googleLogin } = require('./controllers/auth.controller');
app.post('/api/google-login', googleLogin);

// Route registries
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/report', reportRoutes);
app.use('/api/v1/webhook', webhookRoutes);
app.use('/api/v1/team', teamRoutes);

// Root health check
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'CodeMind Server is healthy' });
});

// Centralized error recovery
app.use(errorHandler);

module.exports = app;
