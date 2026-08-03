import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/database.js';
import { logger } from './utils/logger.js';

const PORT = parseInt(process.env.PORT ?? '5000', 10);

async function start(): Promise<void> {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      logger.info('Server', `Running on port ${PORT} (${process.env.NODE_ENV ?? 'development'})`);
    });
  } catch (error) {
    logger.error('Server', 'Failed to start server', error);
    process.exit(1);
  }
}

process.on('unhandledRejection', (reason) => {
  logger.error('Server', 'Unhandled rejection', reason as Error);
  process.exit(1);
});

process.on('SIGTERM', async () => {
  logger.info('Server', 'SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

start();
