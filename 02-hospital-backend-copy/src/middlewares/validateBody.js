const AppError = require('../errors/AppError');
const ERROR_CODES = require('../errors/errorCodes');

function validateBody(schema) {
  return function validateBodyMiddleware(req, res, next) {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }));

      return next(
        new AppError(
          'Validation failed',
          400,
          ERROR_CODES.VALIDATION_ERROR,
          details
        )
      );
    }

    req.body = result.data;
    next();
  };
}

module.exports = validateBody;
