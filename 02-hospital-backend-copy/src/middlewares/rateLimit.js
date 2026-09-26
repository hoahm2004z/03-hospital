const AppError = require('../errors/AppError');
const ERROR_CODES = require('../errors/errorCodes');
const { getRedis } = require('../lib/redis');
const logger = require('../lib/logger');

/** In-memory buckets when Redis unavailable */
const memoryHits = new Map();

function rateLimit({ windowMs = 60_000, max = 60 } = {}) {
  return async function rateLimitMiddleware(req, res, next) {
    try {
      const key = `ratelimit:${req.ip}:${req.path}`;
      const redis = getRedis();
      let count;

      if (redis) {
        count = await redis.incr(key);
        if (count === 1) {
          await redis.pexpire(key, windowMs);
        }
      } else {
        const now = Date.now();
        let bucket = memoryHits.get(key);
        if (!bucket || now > bucket.resetAt) {
          bucket = { count: 0, resetAt: now + windowMs };
          memoryHits.set(key, bucket);
        }
        bucket.count += 1;
        count = bucket.count;
      }

      res.setHeader('X-RateLimit-Limit', String(max));
      res.setHeader('X-RateLimit-Remaining', String(Math.max(0, max - count)));

      if (count > max) {
        return next(
          new AppError('Too many requests', 429, ERROR_CODES.RATE_LIMITED)
        );
      }

      return next();
    } catch (err) {
      logger.warn('Rate limit check failed — allowing request', {
        message: err.message,
      });
      return next();
    }
  };
}

module.exports = rateLimit;
