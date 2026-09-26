const logger = require('../lib/logger');

/**
 * Strategy Pattern — mỗi job type = một strategy xử lý.
 * Dễ mở rộng (email, SMS) mà không sửa producer.
 */
async function notifyAppointmentStrategy(payload) {
  logger.info('Notification job processed', {
    job: 'notify-appointment',
    patientId: payload.patientId,
    doctorId: payload.doctorId,
    time: payload.time,
  });
  return { ok: true };
}

const strategies = {
  'notify-appointment': notifyAppointmentStrategy,
};

function getStrategy(jobName) {
  const strategy = strategies[jobName];
  if (!strategy) {
    throw new Error(`Unknown notification strategy: ${jobName}`);
  }
  return strategy;
}

module.exports = {
  strategies,
  getStrategy,
  notifyAppointmentStrategy,
};
