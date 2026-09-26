const prisma = require('../lib/prisma');
const { cacheDelPrefix } = require('../lib/cache');

async function findAllPatients(query = {}) {
  const where = {};
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { email: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  const allowedSort = ['id', 'name', 'email'];
  const sortBy = allowedSort.includes(query.sortBy) ? query.sortBy : 'id';

  const [total, rows] = await Promise.all([
    prisma.patient.count({ where }),
    prisma.patient.findMany({
      where,
      orderBy: { [sortBy]: query.sortOrder || 'asc' },
      skip: query.skip || 0,
      take: query.limit || 10,
    }),
  ]);

  return { total, rows };
}

async function findPatientById(id) {
  return prisma.patient.findUnique({ where: { id: Number(id) } });
}

async function createPatient(data) {
  const row = await prisma.patient.create({ data });
  await cacheDelPrefix('patients:');
  return row;
}

async function updatePatient(id, data) {
  const row = await prisma.patient.update({
    where: { id: Number(id) },
    data,
  });
  await cacheDelPrefix('patients:');
  return row;
}

async function deletePatient(id) {
  const row = await prisma.patient.delete({ where: { id: Number(id) } });
  await cacheDelPrefix('patients:');
  return row;
}

module.exports = {
  findAllPatients,
  findPatientById,
  createPatient,
  updatePatient,
  deletePatient,
};
