const AppError = require('../errors/AppError');
const ERROR_CODES = require('../errors/errorCodes');
const {
  findAllDoctors,
  findDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  findDoctorSchedule,
} = require('../repositories/doctor.repository');
const { buildPageMeta } = require('../utils/listQuery');
const { cacheGet, cacheSet } = require('../lib/cache');
const config = require('../config');

async function getDoctorsService(query) {
  const cacheKey = `doctors:${JSON.stringify(query)}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return cached;

  const { total, rows } = await findAllDoctors(query);
  const result = { rows, meta: buildPageMeta(total, query.page, query.limit) };
  await cacheSet(cacheKey, result, config.cacheTtlListMs);
  return result;
}

async function getDoctorByIdService(id) {
  const doctor = await findDoctorById(id);
  if (!doctor) {
    throw new AppError('Doctor not found', 404, ERROR_CODES.NOT_FOUND);
  }
  return doctor;
}

async function createDoctorService(payload) {
  try {
    return await createDoctor(payload);
  } catch (err) {
    if (err.code === 'P2002') {
      throw new AppError('Email already exists', 409, ERROR_CODES.EMAIL_EXISTS);
    }
    throw err;
  }
}

async function updateDoctorService(id, payload) {
  await getDoctorByIdService(id);
  try {
    return await updateDoctor(id, payload);
  } catch (err) {
    if (err.code === 'P2002') {
      throw new AppError('Email already exists', 409, ERROR_CODES.EMAIL_EXISTS);
    }
    throw err;
  }
}

async function deleteDoctorService(id) {
  await getDoctorByIdService(id);
  return deleteDoctor(id);
}

async function getDoctorScheduleService(id) {
  await getDoctorByIdService(id);
  return findDoctorSchedule(id);
}

module.exports = {
  getDoctorsService,
  getDoctorByIdService,
  createDoctorService,
  updateDoctorService,
  deleteDoctorService,
  getDoctorScheduleService,
};
