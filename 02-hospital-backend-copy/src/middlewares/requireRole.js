const AppError = require('../errors/AppError');
const ERROR_CODES = require('../errors/errorCodes');

function requireRole(...allowedRoles) {
  return function requireRoleMiddleware(req, res, next) {
    // Phải chạy SAU requireAuth (đã có req.user)
    if (!req.user) {
      return next(new AppError('Unauthorized', 401, ERROR_CODES.UNAUTHORIZED));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          'Forbidden: insufficient role',
          403,
          ERROR_CODES.FORBIDDEN
        )
      );
    }

    next();
  };
}

module.exports = requireRole;