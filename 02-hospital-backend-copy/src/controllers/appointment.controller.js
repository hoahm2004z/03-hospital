const {
  createAppointmentService,
  getAppointmentsService,
  getAppointmentByIdService,
  getAppointmentStatsService,
} = require('../services/appointment.service');
const {
  toCreateAppointmentDto,
  toAppointmentResponseDto,
} = require('../dto/appointment.dto');
const AppError = require('../errors/AppError');
const ERROR_CODES = require('../errors/errorCodes');
const { parseListQuery } = require('../utils/listQuery');

async function createAppointment(req, res) {
  const dto = toCreateAppointmentDto(req.body);
  const appointment = await createAppointmentService(dto);

  res.status(201).json({
    message: 'Appointment created',
    data: toAppointmentResponseDto(appointment),
  });
}

async function getAppointments(req, res) {
  const query = parseListQuery(req.query);
  const result = await getAppointmentsService(query);

  res.status(200).json({
    message: 'Appointment list',
    data: result.rows.map(toAppointmentResponseDto),
    meta: result.meta,
  });
}

async function getAppointmentById(req, res) {
  const appointment = await getAppointmentByIdService(req.params.id);

  if (!appointment) {
    throw new AppError('Appointment not found', 404, ERROR_CODES.NOT_FOUND);
  }

  res.status(200).json({
    message: 'Appointment detail',
    data: toAppointmentResponseDto(appointment),
  });
}

async function getAppointmentStats(req, res) {
  const stats = await getAppointmentStatsService();

  res.status(200).json({
    message: 'Appointment stats (raw SQL)',
    data: stats,
  });
}

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  getAppointmentStats,
};
