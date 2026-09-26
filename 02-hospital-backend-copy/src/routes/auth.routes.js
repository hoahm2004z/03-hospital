const express = require('express');
const validateBody = require('../middlewares/validateBody');
const asyncHandler = require('../middlewares/asyncHandler');
const {
  registerSchema,
  loginSchema,
  refreshSchema,
} = require('../validators/auth.schema');
const { register, login, refresh } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', validateBody(registerSchema), asyncHandler(register));
router.post('/login', validateBody(loginSchema), asyncHandler(login));
router.post('/refresh', validateBody(refreshSchema), asyncHandler(refresh));

module.exports = router;