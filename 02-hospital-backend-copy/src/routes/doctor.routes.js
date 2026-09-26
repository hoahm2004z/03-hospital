const express = require('express');
const requireAuth = require('../middlewares/requireAuth');
const requirePermission = require('../middlewares/requirePermission');
const validateBody = require('../middlewares/validateBody');
const asyncHandler = require('../middlewares/asyncHandler');
const {
  createDoctorSchema,
  updateDoctorSchema,
} = require('../validators/doctor.schema');
const {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorSchedule,
} = require('../controllers/doctor.controller');

const router = express.Router();

router.use(requireAuth);

router.get('/', requirePermission('doctor:read'), asyncHandler(getDoctors));

// schedule TRƯỚC /:id để khỏi bị nuốt
router.get(
  '/:id/schedule',
  requirePermission('appointment:read'),
  asyncHandler(getDoctorSchedule)
);

router.get('/:id', requirePermission('doctor:read'), asyncHandler(getDoctorById));

router.post(
  '/',
  requirePermission('doctor:write'),
  validateBody(createDoctorSchema),
  asyncHandler(createDoctor)
);

router.patch(
  '/:id',
  requirePermission('doctor:write'),
  validateBody(updateDoctorSchema),
  asyncHandler(updateDoctor)
);

router.delete(
  '/:id',
  requirePermission('doctor:write'),
  asyncHandler(deleteDoctor)
);

module.exports = router;