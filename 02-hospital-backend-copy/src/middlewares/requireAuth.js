const AppError = require('../errors/AppError');
const ERROR_CODES = require('../errors/errorCodes');
const { verifyAccessToken } = require('../lib/jwt');

function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return next(new AppError('Unauthorized', 401, ERROR_CODES.UNAUTHORIZED));
  }

  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(
      new AppError(
        'Invalid authorization format. Use: Bearer <token>',
        401,
        ERROR_CODES.TOKEN_INVALID
      )
    );
  }

  try {
    const payload = verifyAccessToken(token);

    // Chuẩn hóa user gắn vào request
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(
        new AppError('Access token expired', 401, ERROR_CODES.TOKEN_EXPIRED)
      );
    }

    return next(
      new AppError('Invalid access token', 401, ERROR_CODES.TOKEN_INVALID)
    );
  }
}

module.exports = requireAuth;