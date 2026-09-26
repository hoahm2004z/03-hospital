const prisma = require('../lib/prisma');
const { cacheDelPrefix } = require('../lib/cache');

async function findAllDoctors(query = {}) {
  const where = {};
  if (query.specialty) where.specialty = query.specialty;
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { email: { contains: query.search, mode: 'insensitive' } },
      { specialty: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  const allowedSort = ['id', 'name', 'specialty', 'email'];
  const sortBy = allowedSort.includes(query.sortBy) ? query.sortBy : 'id';

  const [total, rows] = await Promise.all([
    prisma.doctor.count({ where }),
    prisma.doctor.findMany({
      where,
      orderBy: { [sortBy]: query.sortOrder || 'asc' },
      skip: query.skip || 0,
      take: query.limit || 10,
    }),
  ]);

  return { total, rows };
}

async function findDoctorById(id) {
  return prisma.doctor.findUnique({ where: { id: Number(id) } });
}

async function createDoctor(data) {
  const row = await prisma.doctor.create({ data });
  await cacheDelPrefix('doctors:');
  return row;
}

async function updateDoctor(id, data) {
  const row = await prisma.doctor.update({
    where: { id: Number(id) },
    data,
  });
  await cacheDelPrefix('doctors:');
  return row;
}

async function deleteDoctor(id) {
  const row = await prisma.doctor.delete({ where: { id: Number(id) } });
  await cacheDelPrefix('doctors:');
  return row;
}

async function findDoctorSchedule(doctorId) {
  return prisma.appointment.findMany({
    where: { doctorId: Number(doctorId) },
    orderBy: { time: 'asc' },
    include: { patient: true },
  });
}

module.exports = {
  findAllDoctors,
  findDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  findDoctorSchedule,
};
