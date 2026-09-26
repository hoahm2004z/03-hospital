const AppError = require('../errors/AppError');
const ERROR_CODES = require('../errors/errorCodes');
const prisma = require('../lib/prisma');
const { cacheDelPrefix } = require('../lib/cache');

const appointmentInclude = {
  patient: true,
  doctor: true,
};

async function createAppointmentRepo(data) {
  const created = await prisma.$transaction(async (tx) => {
    const existing = await tx.appointment.findFirst({
      where: {
        doctorId: data.doctorId,
        time: data.time,
      },
    });

    if (existing) {
      throw new AppError(
        'Doctor already booked at this time',
        409,
        ERROR_CODES.DOUBLE_BOOKING
      );
    }

    try {
      return await tx.appointment.create({
        data: {
          patientId: data.patientId,
          doctorId: data.doctorId,
          time: data.time,
          status: data.status,
        },
        include: appointmentInclude,
      });
    } catch (err) {
      if (err.code === 'P2002') {
        throw new AppError(
          'Doctor already booked at this time',
          409,
          ERROR_CODES.DOUBLE_BOOKING
        );
      }
      throw err;
    }
  });

  await cacheDelPrefix('appointments:');
  return created;
}

async function findAllAppointmentsRepo(query = {}) {
  const where = {};

  if (query.doctorId) where.doctorId = Number(query.doctorId);
  if (query.patientId) where.patientId = Number(query.patientId);
  if (query.status) where.status = query.status;

  if (query.search) {
    where.OR = [
      { time: { contains: query.search } },
      { patient: { name: { contains: query.search, mode: 'insensitive' } } },
      { doctor: { name: { contains: query.search, mode: 'insensitive' } } },
    ];
  }

  const allowedSort = ['id', 'time', 'status', 'doctorId', 'patientId'];
  const sortBy = allowedSort.includes(query.sortBy) ? query.sortBy : 'id';

  const [total, rows] = await Promise.all([
    prisma.appointment.count({ where }),
    prisma.appointment.findMany({
      where,
      orderBy: { [sortBy]: query.sortOrder || 'asc' },
      skip: query.skip || 0,
      take: query.limit || 10,
      include: appointmentInclude,
    }),
  ]);

  return { total, rows };
}

async function findAppointmentByIdRepo(id) {
  return prisma.appointment.findUnique({
    where: { id: Number(id) },
    include: appointmentInclude,
  });
}

async function countAppointmentsByStatusRaw() {
  return prisma.$queryRaw`
    SELECT status, COUNT(*)::int AS count
    FROM "Appointment"
    GROUP BY status
    ORDER BY status ASC
  `;
}

module.exports = {
  createAppointmentRepo,
  findAllAppointmentsRepo,
  findAppointmentByIdRepo,
  countAppointmentsByStatusRaw,
};
