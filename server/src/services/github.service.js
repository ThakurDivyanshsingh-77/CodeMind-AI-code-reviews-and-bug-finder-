const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const cloneRepository = (repoUrl, targetDir) => {
  return new Promise((resolve, reject) => {
    // Basic sanitization on URL to prevent shell injection (allows optional .git or trailing slash)
    if (!/^(https:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-_\.]+?)(\.git|\/)?$/.test(repoUrl)) {
      return reject(new Error('Invalid GitHub repository URL format'));
    }

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Disable credential helper to prevent login popups/prompts on server
    const command = `git -c credential.helper= clone --depth 1 ${repoUrl} "${targetDir}"`;

    exec(command, { env: { ...process.env, GIT_TERMINAL_PROMPT: '0' } }, (error, stdout, stderr) => {
      if (error) {
        return reject(new Error(`Failed to clone git repository: ${stderr || error.message}`));
      }
      resolve(targetDir);
    });
  });
};

module.exports = { cloneRepository };
