const { getRedis } = require('./redis');
const logger = require('./logger');

/** In-memory fallback when Redis is unavailable */
const memoryStore = new Map();

function memoryGet(key) {
  const row = memoryStore.get(key);
  if (!row) return null;
  if (Date.now() > row.expireAt) {
    memoryStore.delete(key);
    return null;
  }
  return row.value;
}

function memorySet(key, value, ttlMs = 30_000) {
  memoryStore.set(key, { value, expireAt: Date.now() + ttlMs });
}

function memoryDelPrefix(prefix) {
  for (const key of memoryStore.keys()) {
    if (key.startsWith(prefix)) memoryStore.delete(key);
  }
}

/**
 * Cache-aside GET. Prefers Redis; falls back to process memory.
 */
async function cacheGet(key) {
  const redis = getRedis();
  if (!redis) return memoryGet(key);

  try {
    const raw = await redis.get(key);
    if (raw == null) return null;
    return JSON.parse(raw);
  } catch (err) {
    logger.warn('cacheGet Redis failed — memory fallback', {
      key,
      message: err.message,
    });
    return memoryGet(key);
  }
}

async function cacheSet(key, value, ttlMs = 30_000) {
  const redis = getRedis();
  if (!redis) {
    memorySet(key, value, ttlMs);
    return;
  }

  try {
    const ttlSec = Math.max(1, Math.ceil(ttlMs / 1000));
    await redis.set(key, JSON.stringify(value), 'EX', ttlSec);
  } catch (err) {
    logger.warn('cacheSet Redis failed — memory fallback', {
      key,
      message: err.message,
    });
    memorySet(key, value, ttlMs);
  }
}

async function cacheDelPrefix(prefix) {
  const redis = getRedis();
  if (!redis) {
    memoryDelPrefix(prefix);
    return;
  }

  try {
    let cursor = '0';
    do {
      const [next, keys] = await redis.scan(cursor, 'MATCH', `${prefix}*`, 'COUNT', 100);
      cursor = next;
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } while (cursor !== '0');
  } catch (err) {
    logger.warn('cacheDelPrefix Redis failed — memory fallback', {
      prefix,
      message: err.message,
    });
    memoryDelPrefix(prefix);
  }
}

/** Test helper */
function _clearMemoryCache() {
  memoryStore.clear();
}

module.exports = {
  cacheGet,
  cacheSet,
  cacheDelPrefix,
  _clearMemoryCache,
};
