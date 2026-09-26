const { PrismaClient } = require('@prisma/client');

// Một instance dùng chung cả app (tránh tạo nhiều kết nối)
const prisma = new PrismaClient();

module.exports = prisma;
