const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const config = require('./config');
const rateLimit = require('./middlewares/rateLimit');
const requestLogger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const { setupSwagger } = require('./docs/swagger');

const authRouter = require('./routes/auth.routes');
const patientRouter = require('./routes/patient.routes');
const doctorRouter = require('./routes/doctor.routes');
const appointmentRouter = require('./routes/appointment.routes');

function createApp() {
  const app = express();

  app.use(
    helmet({
      // Swagger UI needs inline scripts; keep CSP loose for API docs
      contentSecurityPolicy: false,
    })
  );
  app.use(
    cors({
      origin: config.corsOrigin === '*' ? true : config.corsOrigin.split(','),
      credentials: true,
    })
  );
  app.use(express.json({ limit: '100kb' }));
  app.use(requestLogger);
  app.use(
    rateLimit({
      windowMs: config.rateLimitWindowMs,
      max: config.rateLimitMax,
    })
  );

  setupSwagger(app);

  app.get('/', (req, res) => {
    res.status(200).json({
      service: config.serviceName,
      message: 'Hospital Backend is running',
      docs: '/docs',
      health: '/health',
    });
  });

  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      service: config.serviceName,
      env: config.env,
      redis: Boolean(config.redisUrl),
      message: 'Health check',
    });
  });

  app.get('/ready', async (req, res) => {
    try {
      const prisma = require('./lib/prisma');
      await prisma.$queryRaw`SELECT 1`;
      res.status(200).json({ status: 'ready', database: true });
    } catch (err) {
      res.status(503).json({
        status: 'not_ready',
        database: false,
        message: err.message,
      });
    }
  });

  app.use('/auth', authRouter);
  app.use('/patients', patientRouter);
  app.use('/doctors', doctorRouter);
  app.use('/appointments', appointmentRouter);

  app.get('/debug/headers', (req, res) => {
    if (config.isProduction) {
      return res.status(404).json({ message: 'Not found', code: 'NOT_FOUND' });
    }
    return res.status(200).json({
      contentType: req.headers['content-type'] || 'none',
      userAgent: req.headers['user-agent'] || 'none',
      authorization: req.headers.authorization ? 'Bearer [REDACTED]' : 'none',
      requestId: req.requestId,
    });
  });

  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
