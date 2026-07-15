const express = require('express');
const { handleGithubWebhook } = require('../controllers/webhook.controller');

const router = express.Router();

/**
 * POST /api/v1/webhook/github
 *
 * GitHub webhook endpoint for Pull Request events.
 * IMPORTANT: Uses raw body parsing (registered in app.js before express.json())
 * so that we can verify the HMAC-SHA256 signature from GitHub.
 * No authentication middleware — GitHub signs payloads with a shared secret.
 */
router.post('/github', handleGithubWebhook);

module.exports = router;
