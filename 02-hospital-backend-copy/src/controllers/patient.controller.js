const {
  getPatientsService,
  getPatientByIdService,
  createPatientService,
  updatePatientService,
  deletePatientService,
} = require('../services/patient.service');
const { toPatientResponseDto } = require('../dto/patient.dto');
const { parseListQuery } = require('../utils/listQuery');

async function getPatients(req, res) {
  const query = parseListQuery(req.query);
  const result = await getPatientsService(query);
  res.status(200).json({
    message: 'Patient list',
    data: result.rows.map(toPatientResponseDto),
    meta: result.meta,
  });
}

async function getPatientById(req, res) {
  const patient = await getPatientByIdService(req.params.id);
  res.status(200).json({
    message: 'Patient detail',
    data: toPatientResponseDto(patient),
  });
}

async function createPatient(req, res) {
  const patient = await createPatientService(req.body);
  res.status(201).json({
    message: 'Patient created',
    data: toPatientResponseDto(patient),
  });
}

async function updatePatient(req, res) {
  const patient = await updatePatientService(req.params.id, req.body);
  res.status(200).json({
    message: 'Patient updated',
    data: toPatientResponseDto(patient),
  });
}

async function deletePatient(req, res) {
  await deletePatientService(req.params.id);
  res.status(200).json({ message: 'Patient deleted' });
}

module.exports = {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
};
