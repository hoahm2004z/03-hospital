const { z } = require('zod');

const createDoctorSchema = z.object({
  name: z.string().trim().min(1).max(100),
  specialty: z.string().trim().min(1).max(100),
  email: z.string().trim().toLowerCase().email(),
});

const updateDoctorSchema = createDoctorSchema.partial();

module.exports = {
  createDoctorSchema,
  updateDoctorSchema,
};