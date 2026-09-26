const { Queue, Worker } = require('bullmq');
const { getRedis, isRedisEnabled } = require('./redis');
const { getStrategy } = require('../notifications/strategies');
const logger = require('./logger');
const config = require('../config');

const QUEUE_NAME = 'hospital-jobs';
const DEFAULT_ATTEMPTS = 3;
const BACKOFF_MS = 2_000;

/** In-memory fallback queue */
const memoryQueue = [];
let memoryWorking = false;
let bullQueue = null;
let bullWorker = null;

function parseRedisUrl(url) {
  try {
    const u = new URL(url);
    return {
      host: u.hostname,
      port: Number(u.port) || 6379,
      password: u.password || undefined,
      maxRetriesPerRequest: null,
    };
  } catch {
    return { host: '127.0.0.1', port: 6379, maxRetriesPerRequest: null };
  }
}

function getBullConnection() {
  if (!config.redisUrl) return null;
  return parseRedisUrl(config.redisUrl);
}

function getQueue() {
  if (bullQueue) return bullQueue;
  const connection = getBullConnection();
  if (!connection) return null;

  bullQueue = new Queue(QUEUE_NAME, { connection });
  return bullQueue;
}

async function processJob(jobName, payload) {
  const strategy = getStrategy(jobName);
  return strategy(payload);
}

async function processMemoryQueue() {
  if (memoryWorking) return;
  memoryWorking = true;

  while (memoryQueue.length > 0) {
    const job = memoryQueue.shift();
    try {
      await processJob(job.jobName, job.payload);
    } catch (err) {
      logger.error('Memory queue job failed', {
        jobName: job.jobName,
        message: err.message,
        attempt: job.attempt,
      });
      if (job.attempt < DEFAULT_ATTEMPTS) {
        memoryQueue.push({ ...job, attempt: job.attempt + 1 });
      }
    }
    await new Promise((r) => setTimeout(r, 50));
  }

  memoryWorking = false;
}

/**
 * Producer — đẩy job vào BullMQ (Redis) hoặc memory fallback.
 */
async function enqueue(jobName, payload) {
  const queue = getQueue();

  if (!queue) {
    memoryQueue.push({ jobName, payload, attempt: 1, at: new Date().toISOString() });
    processMemoryQueue();
    return { mode: 'memory', jobName };
  }

  const job = await queue.add(
    jobName,
    payload,
    {
      attempts: DEFAULT_ATTEMPTS,
      backoff: { type: 'fixed', delay: BACKOFF_MS },
      removeOnComplete: 100,
      removeOnFail: 50,
    }
  );

  logger.debug('Job enqueued to BullMQ', { jobName, jobId: job.id });
  return { mode: 'bullmq', jobName, jobId: job.id };
}

/**
 * Consumer / Worker — chạy trong cùng process (API) hoặc process riêng (src/worker.js).
 */
function startWorker() {
  if (bullWorker) return bullWorker;

  const connection = getBullConnection();
  if (!connection) {
    logger.info('BullMQ worker skipped — Redis not configured');
    return null;
  }

  // Ensure Redis client exists for cache too
  getRedis();

  bullWorker = new Worker(
    QUEUE_NAME,
    async (job) => {
      logger.info('Worker picked job', { name: job.name, id: job.id, attempt: job.attemptsMade + 1 });
      return processJob(job.name, job.data);
    },
    {
      connection,
      concurrency: Number(process.env.QUEUE_CONCURRENCY) || 2,
    }
  );

  bullWorker.on('failed', (job, err) => {
    logger.error('BullMQ job failed', {
      jobId: job?.id,
      name: job?.name,
      message: err.message,
      attemptsMade: job?.attemptsMade,
    });
  });

  bullWorker.on('completed', (job) => {
    logger.info('BullMQ job completed', { jobId: job.id, name: job.name });
  });

  logger.info('BullMQ worker started', { queue: QUEUE_NAME });
  return bullWorker;
}

async function closeQueue() {
  if (bullWorker) {
    await bullWorker.close();
    bullWorker = null;
  }
  if (bullQueue) {
    await bullQueue.close();
    bullQueue = null;
  }
}

module.exports = {
  enqueue,
  startWorker,
  closeQueue,
  isRedisEnabled,
  QUEUE_NAME,
};
