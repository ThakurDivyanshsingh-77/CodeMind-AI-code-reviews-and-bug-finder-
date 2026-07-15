const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

const extractZip = (zipFilePath, outputDir) => {
  return new Promise((resolve, reject) => {
    try {
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const zip = new AdmZip(zipFilePath);
      zip.extractAllTo(outputDir, true);
      resolve(outputDir);
    } catch (error) {
      reject(new Error(`Failed to extract ZIP archive: ${error.message}`));
    }
  });
};

module.exports = { extractZip };
