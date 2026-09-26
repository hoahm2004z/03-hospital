const express = require('express');
const requireAuth = require('../middlewares/requireAuth');
const requirePermission = require('../middlewares/requirePermission');
const validateBody = require('../middlewares/validateBody');
const asyncHandler = require('../middlewares/asyncHandler');
const {
  createPatientSchema,
  updatePatientSchema,
} = require('../validators/patient.schema');
const {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
} = require('../controllers/patient.controller');

const router = express.Router();

router.use(requireAuth);

router.get('/', requirePermission('patient:read'), asyncHandler(getPatients));
router.get('/:id', requirePermission('patient:read'), asyncHandler(getPatientById));
router.post(
  '/',
  requirePermission('patient:write'),
  validateBody(createPatientSchema),
  asyncHandler(createPatient)
);
router.patch(
  '/:id',
  requirePermission('patient:write'),
  validateBody(updatePatientSchema),
  asyncHandler(updatePatient)
);
router.delete(
  '/:id',
  requirePermission('patient:write'),
  asyncHandler(deletePatient)
);

module.exports = router;