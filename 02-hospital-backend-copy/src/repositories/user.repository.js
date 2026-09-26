const prisma = require('../lib/prisma');

async function findUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

async function findUserById(id) {
  return prisma.user.findUnique({ where: { id: Number(id) } });
}

async function createUser(data) {
  return prisma.user.create({
    data: {
      email: data.email,
      passwordHash: data.passwordHash,
      name: data.name,
      role: data.role || 'patient',
    },
  });
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
};