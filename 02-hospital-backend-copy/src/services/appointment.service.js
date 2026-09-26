const AppError = require('../errors/AppError');
const ERROR_CODES = require('../errors/errorCodes');
const { findPatientById } = require('../repositories/patient.repository');
const { findDoctorById } = require('../repositories/doctor.repository');
const {
  createAppointmentRepo,
  findAllAppointmentsRepo,
  findAppointmentByIdRepo,
  countAppointmentsByStatusRaw,
} = require('../repositories/appointment.repository');
const { enqueue } = require('../lib/jobQueue');
const { cacheGet, cacheSet } = require('../lib/cache');
const { buildPageMeta } = require('../utils/listQuery');
const config = require('../config');

async function createAppointmentService(payload) {
  const patient = await findPatientById(payload.patientId);
  if (!patient) {
    throw new AppError('Patient not found', 404, ERROR_CODES.NOT_FOUND);
  }

  const doctor = await findDoctorById(payload.doctorId);
  if (!doctor) {
    throw new AppError('Doctor not found', 404, ERROR_CODES.NOT_FOUND);
  }

  const appointment = await createAppointmentRepo({
    patientId: Number(payload.patientId),
    doctorId: Number(payload.doctorId),
    time: payload.time,
    status: payload.status || 'booked',
  });

  await enqueue('notify-appointment', {
    patientId: appointment.patientId,
    doctorId: appointment.doctorId,
    time: appointment.time,
  });

  return appointment;
}

async function getAppointmentsService(query) {
  const cacheKey = `appointments:${JSON.stringify(query)}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return cached;

  const { total, rows } = await findAllAppointmentsRepo(query);
  const result = {
    rows,
    meta: buildPageMeta(total, query.page, query.limit),
  };
  await cacheSet(cacheKey, result, config.cacheTtlListMs);
  return result;
}

async function getAppointmentByIdService(id) {
  return findAppointmentByIdRepo(id);
}

async function getAppointmentStatsService() {
  const cacheKey = 'appointments:stats';
  const cached = await cacheGet(cacheKey);
  if (cached) return cached;
  const stats = await countAppointmentsByStatusRaw();
  await cacheSet(cacheKey, stats, config.cacheTtlStatsMs);
  return stats;
}

module.exports = {
  createAppointmentService,
  getAppointmentsService,
  getAppointmentByIdService,
  getAppointmentStatsService,
};
