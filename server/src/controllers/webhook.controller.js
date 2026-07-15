const crypto = require('crypto');
const path = require('path');
const os = require('os');
const fs = require('fs');
const { requestAnalysis } = require('../services/ai.service');
const { fetchPRFiles, postPRReview, mapLineToPosition } = require('../services/prbot.service');
const env = require('../config/env');

// Simple logger using console (matches existing patterns in this codebase)
const logger = {
  info: (msg) => console.log(`[PR Bot] INFO: ${msg}`),
  warn: (msg) => console.warn(`[PR Bot] WARN: ${msg}`),
  error: (msg) => console.error(`[PR Bot] ERROR: ${msg}`)
};

/**
 * Verify GitHub webhook HMAC-SHA256 signature.
 * GitHub sends: X-Hub-Signature-256: sha256=<hex_digest>
 */
const verifyWebhookSignature = (rawBody, signatureHeader) => {
  if (!env.GITHUB_WEBHOOK_SECRET) return true; // Skip if not configured (dev mode)
  if (!signatureHeader) return false;

  const expectedSig = `sha256=${crypto
    .createHmac('sha256', env.GITHUB_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex')}`;

  // Use timingSafeEqual to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signatureHeader),
      Buffer.from(expectedSig)
    );
  } catch {
    return false;
  }
};

/**
 * Build a temporary directory with PR file contents so the Python
 * AI analyzer can read them via the filesystem (same as zip/clone flow).
 */
const buildTempProjectDir = async (prFiles) => {
  const tmpDir = path.join(os.tmpdir(), `codemind_pr_${Date.now()}`);
  fs.mkdirSync(tmpDir, { recursive: true });

  for (const file of prFiles) {
    const filePath = path.join(tmpDir, file.path);
    const fileDir = path.dirname(filePath);
    fs.mkdirSync(fileDir, { recursive: true });
    fs.writeFileSync(filePath, file.content || '', 'utf-8');
  }

  return tmpDir;
};

/**
 * Clean up a temporary directory after analysis.
 */
const cleanupTempDir = (dirPath) => {
  try {
    fs.rmSync(dirPath, { recursive: true, force: true });
  } catch { /* Ignore cleanup errors */ }
};

/**
 * Main webhook handler for GitHub Pull Request events.
 * 
 * POST /api/v1/webhook/github
 */
const handleGithubWebhook = async (req, res) => {
  // 1. Verify HMAC signature immediately
  const signature = req.headers['x-hub-signature-256'];
  const rawBody = req.rawBody; // Set by raw body middleware in app.js

  if (!verifyWebhookSignature(rawBody, signature)) {
    logger.warn('GitHub webhook received with invalid signature — rejected');
    return res.status(401).json({ success: false, message: 'Invalid webhook signature' });
  }

  // 2. Only handle pull_request events
  const event = req.headers['x-github-event'];
  if (event !== 'pull_request') {
    return res.status(200).json({ success: true, message: `Event "${event}" ignored` });
  }

  const payload = req.body;
  const action = payload.action;

  // Only trigger on new PR or when commits are pushed to an existing PR
  if (!['opened', 'synchronize'].includes(action)) {
    return res.status(200).json({ success: true, message: `Action "${action}" ignored` });
  }

  // Acknowledge webhook immediately (GitHub times out after 10s)
  res.status(202).json({ success: true, message: 'PR review analysis queued' });

  // 3. Extract PR metadata
  const prNumber = payload.pull_request?.number;
  const owner = payload.repository?.owner?.login;
  const repo = payload.repository?.name;
  const prTitle = payload.pull_request?.title || `PR #${prNumber}`;
  const token = env.GITHUB_TOKEN;

  if (!prNumber || !owner || !repo || !token) {
    logger.error('PR Bot: Missing required metadata or GITHUB_TOKEN not configured');
    return;
  }

  logger.info(`PR Bot: Scanning PR #${prNumber} — ${owner}/${repo} — "${prTitle}"`);

  let tmpDir = null;
  try {
    // 4. Fetch changed files from GitHub
    const prFiles = await fetchPRFiles(owner, repo, prNumber, token);
    if (!prFiles || prFiles.length === 0) {
      logger.info(`PR Bot: PR #${prNumber} has no analyzable files, skipping`);
      return;
    }

    logger.info(`PR Bot: Fetched ${prFiles.length} changed files from GitHub`);

    // 5. Write files to a temp dir and run AI analysis
    tmpDir = await buildTempProjectDir(prFiles);
    const report = await requestAnalysis(tmpDir);

    // 6. Map AI bugs → GitHub inline review comments
    const comments = [];
    const bugsByFile = {};

    for (const bug of (report.bugs || [])) {
      const normalizedPath = bug.filePath?.replace(/\\/g, '/');
      if (!normalizedPath) continue;
      if (!bugsByFile[normalizedPath]) bugsByFile[normalizedPath] = [];
      bugsByFile[normalizedPath].push(bug);
    }

    for (const prFile of prFiles) {
      const fileBugs = bugsByFile[prFile.path] || [];
      for (const bug of fileBugs) {
        // Map the line number to a GitHub diff position
        const position = mapLineToPosition(prFile.patch, bug.line);

        // Build a rich markdown comment body
        const severityEmoji = {
          critical: '🔴', high: '🟠', medium: '🟡', low: '🔵'
        }[bug.severity] || '⚪';

        const body = [
          `${severityEmoji} **[CodeMind AI] ${bug.severity?.toUpperCase()} Severity Issue**`,
          '',
          bug.description,
          '',
          '**💡 Suggested Fix:**',
          bug.fixSuggestion || '_No specific fix available._'
        ].join('\n');

        comments.push({
          path: prFile.path,
          position: position ?? 1, // Fallback to first line if unmappable
          body
        });
      }
    }

    // 7. Build overall summary
    const totalBugs = report.bugs?.length ?? 0;
    const summaryBody = [
      `## 🤖 CodeMind AI Review — PR #${prNumber}: *${prTitle}*`,
      '',
      `| Metric | Score |`,
      `|--------|-------|`,
      `| 🏆 Overall | **${report.overallScore}/100** |`,
      `| 🛡️ Security | ${report.securityScore}/100 |`,
      `| ⚡ Performance | ${report.performanceScore}/100 |`,
      `| 🧹 Quality | ${report.qualityScore}/100 |`,
      `| 🔧 Maintainability | ${report.maintainabilityScore}/100 |`,
      '',
      `**${totalBugs} issue${totalBugs !== 1 ? 's' : ''} detected** across ${prFiles.length} changed file${prFiles.length !== 1 ? 's' : ''}.`,
      '',
      report.aiSummary || '',
      '',
      '---',
      '*Powered by [CodeMind AI](https://github.com) • Automated Code Review Bot*'
    ].join('\n');

    // 8. Post the review to GitHub
    if (comments.length > 0 || totalBugs === 0) {
      await postPRReview(owner, repo, prNumber, comments, token, summaryBody);
      logger.info(`PR Bot: Successfully posted review with ${comments.length} inline comments on PR #${prNumber}`);
    }

  } catch (error) {
    logger.error(`PR Bot: Error reviewing PR #${prNumber} — ${error.message}`);
  } finally {
    if (tmpDir) cleanupTempDir(tmpDir);
  }
};

module.exports = { handleGithubWebhook };
