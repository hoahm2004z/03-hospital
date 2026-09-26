require('dotenv').config();

const DEFAULT_PORT = 3000;
const DEFAULT_RATE_LIMIT_WINDOW_MS = 60_000;
const DEFAULT_RATE_LIMIT_MAX = 120;
const CACHE_TTL_LIST_MS = 15_000;
const CACHE_TTL_STATS_MS = 20_000;

const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || DEFAULT_PORT,
  serviceName: process.env.SERVICE_NAME || 'hospital-backend',
  jwtAccessExpires: process.env.JWT_ACCESS_EXPIRES || '15m',
  jwtRefreshExpires: process.env.JWT_REFRESH_EXPIRES || '7d',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
  databaseUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL || '',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || DEFAULT_RATE_LIMIT_WINDOW_MS,
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX) || DEFAULT_RATE_LIMIT_MAX,
  cacheTtlListMs: Number(process.env.CACHE_TTL_LIST_MS) || CACHE_TTL_LIST_MS,
  cacheTtlStatsMs: Number(process.env.CACHE_TTL_STATS_MS) || CACHE_TTL_STATS_MS,
  isProduction: process.env.NODE_ENV === 'production',
};

module.exports = config;
