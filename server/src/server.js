const app = require('./app');
const env = require('./config/env');
const connectDB = async () => {
  const conn = require('./config/db');
  await conn();
};
const logger = require('./config/logger');

const startServer = async () => {
  try {
    await connectDB();
    app.listen(env.PORT, () => {
      logger.info(`Server is running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error(`Critical Server Startup Failure: ${error.message}`);
    process.exit(1);
  }
};

// Start the database connection and the Express server
startServer();
