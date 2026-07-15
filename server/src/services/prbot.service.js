const axios = require('axios');

const GITHUB_API = 'https://api.github.com';

/**
 * Fetch all changed files and their content for a given Pull Request.
 * Uses GitHub REST API: GET /repos/:owner/:repo/pulls/:pull_number/files
 *
 * @param {string} owner  - Repository owner (user or org)
 * @param {string} repo   - Repository name
 * @param {number} prNumber - Pull Request number
 * @param {string} token  - GitHub PAT or App installation token
 * @returns {Promise<Array<{path: string, content: string, patch: string}>>}
 */
const fetchPRFiles = async (owner, repo, prNumber, token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'CodeMind-PR-Bot/1.0'
  };

  // GitHub paginates file list at 30 per page, support up to 3 pages (90 files)
  const allFiles = [];
  for (let page = 1; page <= 3; page++) {
    const { data: files } = await axios.get(
      `${GITHUB_API}/repos/${owner}/${repo}/pulls/${prNumber}/files`,
      { headers, params: { per_page: 30, page } }
    );
    if (!files || files.length === 0) break;
    allFiles.push(...files);
    if (files.length < 30) break;
  }

  // For each changed file, fetch raw file content via the blob URL
  const results = [];
  for (const file of allFiles) {
    // Skip deleted files and binary files
    if (file.status === 'removed' || !file.contents_url) continue;

    let content = '';
    try {
      const { data: blob } = await axios.get(file.contents_url, { headers });
      if (blob.encoding === 'base64' && blob.content) {
        content = Buffer.from(blob.content, 'base64').toString('utf-8');
      }
    } catch {
      // If we can't fetch content, use the patch as a fallback
      content = file.patch || '';
    }

    results.push({
      path: file.filename,       // e.g. "src/controllers/auth.js"
      content,                    // Full file content (decoded)
      patch: file.patch || '',   // Diff patch for line position mapping
      sha: file.sha
    });
  }

  return results;
};

/**
 * Maps a file line number to a GitHub PR review "position" in the diff.
 * GitHub positions count from 1 at the first line of the diff hunk header (@@).
 * Returns null if the line cannot be found in the diff.
 *
 * @param {string} patch  - The unified diff patch string for a file
 * @param {number} lineNo - The absolute line number in the new file
 * @returns {number|null}
 */
const mapLineToPosition = (patch, lineNo) => {
  if (!patch) return null;
  const lines = patch.split('\n');
  let position = 0;
  let currentNewLine = 0;

  for (const line of lines) {
    // Parse hunk header: @@ -oldStart,oldCount +newStart,newCount @@
    const hunkMatch = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (hunkMatch) {
      currentNewLine = parseInt(hunkMatch[1], 10) - 1;
      position++; // The hunk header itself counts as position 1
      continue;
    }

    position++;
    if (line.startsWith('-')) continue; // Removed line — no new-file line number

    currentNewLine++;
    if (currentNewLine === lineNo) {
      return position;
    }
  }

  return null;
};

/**
 * Post a pull request review with inline code comments.
 * Uses: POST /repos/:owner/:repo/pulls/:pull_number/reviews
 *
 * @param {string} owner
 * @param {string} repo
 * @param {number} prNumber
 * @param {Array<{path, position, body}>} comments - Array of inline comment objects
 * @param {string} token
 * @param {string} summary - Overall AI summary body text for the review
 */
const postPRReview = async (owner, repo, prNumber, comments, token, summary) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'CodeMind-PR-Bot/1.0'
  };

  // Filter out comments where we couldn't map to a diff position
  const validComments = comments.filter(c => c.position !== null && c.position > 0);

  const reviewBody = summary || '🤖 **CodeMind AI Review** — Automated analysis complete. See inline comments for details.';

  const payload = {
    body: reviewBody,
    event: validComments.length > 0 ? 'COMMENT' : 'APPROVE',
    comments: validComments
  };

  const { data } = await axios.post(
    `${GITHUB_API}/repos/${owner}/${repo}/pulls/${prNumber}/reviews`,
    payload,
    { headers }
  );

  return data;
};

module.exports = { fetchPRFiles, postPRReview, mapLineToPosition };
