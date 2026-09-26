const AppError = require('../errors/AppError');
const ERROR_CODES = require('../errors/errorCodes');
const { roleHasPermission } = require('../auth/permissions');

function requirePermission(permission) {
  return function requirePermissionMiddleware(req, res, next) {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401, ERROR_CODES.UNAUTHORIZED));
    }

    if (!roleHasPermission(req.user.role, permission)) {
      return next(
        new AppError(
          `Forbidden: missing permission ${permission}`,
          403,
          ERROR_CODES.FORBIDDEN
        )
      );
    }

    next();
  };
}

module.exports = requirePermission;