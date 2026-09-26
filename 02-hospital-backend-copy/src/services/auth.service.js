const AppError = require('../errors/AppError');
const ERROR_CODES = require('../errors/errorCodes');
const { hashPassword, verifyPassword } = require('../lib/password');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../lib/jwt');
const {
  findUserByEmail,
  findUserById,
  createUser,
} = require('../repositories/user.repository');

async function registerService(payload) {
  const existing = await findUserByEmail(payload.email);
  if (existing) {
    throw new AppError('Email already registered', 409, ERROR_CODES.EMAIL_EXISTS);
  }

  const passwordHash = await hashPassword(payload.password);

  return createUser({
    email: payload.email,
    passwordHash,
    name: payload.name,
    role: 'patient',
  });
}

function buildTokenPair(user) {
  const accessToken = signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = signRefreshToken({
    sub: user.id,
  });

  return { accessToken, refreshToken };
}

async function loginService(payload) {
  const user = await findUserByEmail(payload.email);

  if (!user) {
    throw new AppError(
      'Invalid email or password',
      401,
      ERROR_CODES.INVALID_CREDENTIALS
    );
  }

  const ok = await verifyPassword(payload.password, user.passwordHash);
  if (!ok) {
    throw new AppError(
      'Invalid email or password',
      401,
      ERROR_CODES.INVALID_CREDENTIALS
    );
  }

  const tokens = buildTokenPair(user);
  return { user, tokens };
}

async function refreshService(refreshToken) {
  if (!refreshToken) {
    throw new AppError('refreshToken is required', 400, ERROR_CODES.VALIDATION_ERROR);
  }

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new AppError('Refresh token expired', 401, ERROR_CODES.TOKEN_EXPIRED);
    }
    throw new AppError('Invalid refresh token', 401, ERROR_CODES.TOKEN_INVALID);
  }

  const user = await findUserById(payload.sub);
  if (!user) {
    throw new AppError('User not found', 401, ERROR_CODES.TOKEN_INVALID);
  }

  return buildTokenPair(user);
}

module.exports = {
  registerService,
  loginService,
  refreshService,
  buildTokenPair,
};
