const logger = require('../lib/logger');

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const isOperational = !!err.isOperational;

  const logFn = statusCode >= 500 ? logger.error : logger.warn;
  logFn('Request error', {
    requestId: req.requestId,
    method: req.method,
    path: req.originalUrl,
    statusCode,
    code,
    message: err.message,
    operational: isOperational,
    stack: !isOperational ? err.stack : undefined,
  });

  const body = {
    message:
      statusCode >= 500 && !isOperational
        ? 'Internal Server Error'
        : err.message || 'Internal Server Error',
    code,
    requestId: req.requestId,
  };

  if (err.details) {
    body.errors = err.details;
  }

  res.status(statusCode).json(body);
}

module.exports = errorHandler;
