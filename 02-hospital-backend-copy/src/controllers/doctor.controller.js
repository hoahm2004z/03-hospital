const {
  getDoctorsService,
  getDoctorByIdService,
  createDoctorService,
  updateDoctorService,
  deleteDoctorService,
  getDoctorScheduleService,
} = require('../services/doctor.service');
const { toDoctorResponseDto } = require('../dto/doctor.dto');
const { parseListQuery } = require('../utils/listQuery');

async function getDoctors(req, res) {
  const query = parseListQuery(req.query);
  const result = await getDoctorsService(query);
  res.status(200).json({
    message: 'Doctor list',
    data: result.rows.map(toDoctorResponseDto),
    meta: result.meta,
  });
}

async function getDoctorById(req, res) {
  const doctor = await getDoctorByIdService(req.params.id);
  res.status(200).json({
    message: 'Doctor detail',
    data: toDoctorResponseDto(doctor),
  });
}

async function createDoctor(req, res) {
  const doctor = await createDoctorService(req.body);
  res.status(201).json({
    message: 'Doctor created',
    data: toDoctorResponseDto(doctor),
  });
}

async function updateDoctor(req, res) {
  const doctor = await updateDoctorService(req.params.id, req.body);
  res.status(200).json({
    message: 'Doctor updated',
    data: toDoctorResponseDto(doctor),
  });
}

async function deleteDoctor(req, res) {
  await deleteDoctorService(req.params.id);
  res.status(200).json({ message: 'Doctor deleted' });
}

async function getDoctorSchedule(req, res) {
  const rows = await getDoctorScheduleService(req.params.id);
  res.status(200).json({
    message: 'Doctor schedule',
    data: rows.map((a) => ({
      id: a.id,
      time: a.time,
      status: a.status,
      patientId: a.patientId,
      patientName: a.patient ? a.patient.name : null,
    })),
  });
}

module.exports = {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorSchedule,
};
