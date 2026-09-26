const AppError = require('../errors/AppError');
const ERROR_CODES = require('../errors/errorCodes');
const {
  findAllPatients,
  findPatientById,
  createPatient,
  updatePatient,
  deletePatient,
} = require('../repositories/patient.repository');
const { buildPageMeta } = require('../utils/listQuery');
const { cacheGet, cacheSet } = require('../lib/cache');
const config = require('../config');

async function getPatientsService(query) {
  const cacheKey = `patients:${JSON.stringify(query)}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return cached;

  const { total, rows } = await findAllPatients(query);
  const result = { rows, meta: buildPageMeta(total, query.page, query.limit) };
  await cacheSet(cacheKey, result, config.cacheTtlListMs);
  return result;
}

async function getPatientByIdService(id) {
  const patient = await findPatientById(id);
  if (!patient) {
    throw new AppError('Patient not found', 404, ERROR_CODES.NOT_FOUND);
  }
  return patient;
}

async function createPatientService(payload) {
  try {
    return await createPatient({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
    });
  } catch (err) {
    if (err.code === 'P2002') {
      throw new AppError('Email already exists', 409, ERROR_CODES.EMAIL_EXISTS);
    }
    throw err;
  }
}

async function updatePatientService(id, payload) {
  await getPatientByIdService(id);
  try {
    return await updatePatient(id, payload);
  } catch (err) {
    if (err.code === 'P2002') {
      throw new AppError('Email already exists', 409, ERROR_CODES.EMAIL_EXISTS);
    }
    throw err;
  }
}

async function deletePatientService(id) {
  await getPatientByIdService(id);
  return deletePatient(id);
}

module.exports = {
  getPatientsService,
  getPatientByIdService,
  createPatientService,
  updatePatientService,
  deletePatientService,
};
