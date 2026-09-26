const config = require('../config');
const logger = require('./logger');

let redis = null;
let connectionAttempted = false;

function getRedis() {
  if (connectionAttempted) return redis;
  connectionAttempted = true;

  if (!config.redisUrl) {
    logger.info('Redis disabled — using in-memory fallbacks', {
      reason: 'REDIS_URL empty',
    });
    return null;
  }

  try {
    // Lazy require so unit tests without ioredis installed still load if needed
    const Redis = require('ioredis');
    redis = new Redis(config.redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
      lazyConnect: false,
    });

    redis.on('error', (err) => {
      logger.error('Redis connection error', { message: err.message });
    });

    redis.on('connect', () => {
      logger.info('Redis connected');
    });
  } catch (err) {
    logger.warn('Redis init failed — falling back to memory', {
      message: err.message,
    });
    redis = null;
  }

  return redis;
}

function isRedisEnabled() {
  return Boolean(getRedis());
}

async function closeRedis() {
  if (redis) {
    await redis.quit().catch(() => redis.disconnect());
    redis = null;
    connectionAttempted = false;
  }
}

module.exports = {
  getRedis,
  isRedisEnabled,
  closeRedis,
};
