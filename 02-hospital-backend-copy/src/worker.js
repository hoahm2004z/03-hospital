require('dotenv').config();

const logger = require('./lib/logger');
const { startWorker, closeQueue } = require('./lib/jobQueue');
const { closeRedis } = require('./lib/redis');

logger.info('Starting dedicated BullMQ worker process');

const worker = startWorker();

if (!worker) {
  logger.warn('No Redis — worker idle. Set REDIS_URL and restart.');
}

async function shutdown(signal) {
  logger.info('Worker shutting down', { signal });
  await closeQueue();
  await closeRedis();
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
