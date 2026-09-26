const express = require('express');
const requireAuth = require('../middlewares/requireAuth');
const requirePermission = require('../middlewares/requirePermission');
const validateBody = require('../middlewares/validateBody');
const asyncHandler = require('../middlewares/asyncHandler');
const { createAppointmentSchema } = require('../validators/appointment.schema');
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  getAppointmentStats,
} = require('../controllers/appointment.controller');

const router = express.Router();

router.post(
  '/',
  requireAuth,
  requirePermission('appointment:write'),
  validateBody(createAppointmentSchema),
  asyncHandler(createAppointment)
);

router.get(
  '/',
  requireAuth,
  requirePermission('appointment:read'),
  asyncHandler(getAppointments)
);

router.get(
  '/stats',
  requireAuth,
  requirePermission('stats:read'),
  asyncHandler(getAppointmentStats)
);

router.get(
  '/:id',
  requireAuth,
  requirePermission('appointment:read'),
  asyncHandler(getAppointmentById)
);

module.exports = router;
