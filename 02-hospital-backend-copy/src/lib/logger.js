const SENSITIVE_KEYS = new Set([
  'password',
  'passwordhash',
  'authorization',
  'accesstoken',
  'refreshtoken',
  'token',
  'secret',
]);

function redactValue(key, value) {
  if (SENSITIVE_KEYS.has(String(key).toLowerCase())) {
    return '[REDACTED]';
  }
  if (typeof value === 'string' && value.startsWith('Bearer ')) {
    return 'Bearer [REDACTED]';
  }
  return value;
}

function redact(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map((item) => redact(item));

  const out = {};
  for (const [key, value] of Object.entries(obj)) {
    out[key] =
      value && typeof value === 'object' ? redact(value) : redactValue(key, value);
  }
  return out;
}

function write(level, message, meta = {}) {
  if (process.env.NODE_ENV === 'test' && level !== 'error') {
    return;
  }
  const line = {
    level,
    at: new Date().toISOString(),
    message,
    ...redact(meta),
  };
  const text = JSON.stringify(line);
  if (level === 'error') {
    console.error(text);
  } else if (level === 'warn') {
    console.warn(text);
  } else {
    console.log(text);
  }
}

const logger = {
  info: (message, meta) => write('info', message, meta),
  warn: (message, meta) => write('warn', message, meta),
  error: (message, meta) => write('error', message, meta),
  debug: (message, meta) => {
    if (process.env.LOG_LEVEL === 'debug' || process.env.NODE_ENV !== 'production') {
      write('debug', message, meta);
    }
  },
  redact,
};

module.exports = logger;
