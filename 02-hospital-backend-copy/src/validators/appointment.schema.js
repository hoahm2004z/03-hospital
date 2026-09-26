const { z } = require('zod');

const contactSchema = z.object({
  email: z.string().trim().toLowerCase().email('email không hợp lệ'),
  phone: z.string().trim().min(9).max(15).optional(),
});

const createAppointmentSchema = z.object({
  patientId: z.coerce.number().int().positive(),
  doctorId: z.coerce.number().int().positive(),

  // trim = sanitization (bài 130)
  time: z
    .string({ required_error: 'time is required' })
    .trim()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'time must be HH:MM (00:00–23:59)'),

  note: z.string().trim().min(1).max(200).optional(),

  status: z.enum(['booked', 'cancelled', 'completed']).optional(),
  appointmentDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'appointmentDate must be YYYY-MM-DD')
    .optional(),

  contact: contactSchema.optional(),
  symptoms: z.array(z.string().trim().min(1)).max(10).optional(),
});

module.exports = {
  createAppointmentSchema,
  contactSchema,
};
