const axios = require('axios');
const env = require('../config/env');

const requestAnalysis = async (projectPath, files = null) => {
  try {
    const payload = files && files.length > 0 ? { files } : { projectPath };
    const response = await axios.post(`${env.AI_SERVICE_URL}/analyze`, payload);
    
    if (response.data && response.data.success) {
      return response.data.report;
    }
    throw new Error('AI analysis service returned an invalid response status');
  } catch (error) {
    const errorDetails = error.response?.data?.detail || error.message;
    throw new Error(`AI Review Service Communication Error: ${errorDetails}`);
  }
};

module.exports = { requestAnalysis };
