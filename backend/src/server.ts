import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/database.js';
import { logger } from './utils/logger.js';

const PORT = parseInt(process.env.PORT ?? '5000', 10);
// Bind IPv4 explicitly. `listen(PORT)` alone binds `:::PORT` (IPv6).
// Northflank's proxy connects over IPv4, which then fails with 503 / connection refused
// while `wget http://localhost:5000` inside the container still works (localhost → ::1).
const HOST = '0.0.0.0';

async function start(): Promise<void> {
  try {
    await connectDatabase();

    const server = app.listen(PORT, HOST, () => {
      logger.info(
        'Server',
        `Listening on ${HOST}:${PORT} (${process.env.NODE_ENV ?? 'development'})`
      );
    });

    server.on('error', (error) => {
      logger.error('Server', 'HTTP server error', error);
      process.exit(1);
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
