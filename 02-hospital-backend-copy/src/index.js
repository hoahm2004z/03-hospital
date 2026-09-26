require('dotenv').config();

const config = require('./config');
const logger = require('./lib/logger');
const { createApp } = require('./app');
const { startWorker, closeQueue } = require('./lib/jobQueue');
const { closeRedis } = require('./lib/redis');

const app = createApp();

// Start in-process worker when Redis is available (also run `npm run worker` separately in prod)
if (process.env.EMBED_WORKER !== 'false') {
  startWorker();
}

const server = app.listen(config.port, () => {
  logger.info('Server started', {
    port: config.port,
    env: config.env,
    docs: `http://localhost:${config.port}/docs`,
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    logger.error('Port already in use', {
      port: config.port,
      hint: `netstat -ano | findstr :${config.port}`,
    });
  } else {
    logger.error('Server error', { message: err.message, stack: err.stack });
  }
  process.exit(1);
});

async function shutdown(signal) {
  logger.info('Shutting down', { signal });
  server.close(async () => {
    await closeQueue();
    await closeRedis();
    const prisma = require('./lib/prisma');
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

module.exports = { app, server };
